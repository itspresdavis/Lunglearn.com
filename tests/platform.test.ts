import fs from "fs";
import os from "os";
import path from "path";
import { describe, expect, it } from "vitest";
import { interpretAcidBase } from "@/lib/acid-base";
import { ATLAS_GLB_PATH, meshHits, readGlbMeshes } from "@/lib/atlas";
import { clipPosition, visibleMeshIds } from "@/lib/atlas-model";
import { renewalDecision } from "@/lib/billing-policy";
import {
  airwayResistance,
  anionGap,
  cylinderDuration,
  deadSpaceFraction,
  dynamicCompliance,
  idealBodyWeightDevine,
  minuteVentilation,
  oxygenationIndex,
  oxygenContent,
  pfRatio,
  predictedBodyWeight,
  rapidShallowBreathingIndex,
  staticCompliance,
  wintersFormula,
} from "@/lib/calculators";
import { resourceCounts } from "@/lib/catalog";
import { anatomyRecords, getAnatomy } from "@/content/anatomy";
import { diseases } from "@/content/diseases";
import { findLesson, lessons } from "@/content/curriculum";
import { medications } from "@/content/medications";
import { questions } from "@/content/questions";
import { canTransition, publishBlockers } from "@/lib/editorial";
import { canAccess, resolveEntitlement } from "@/lib/entitlements";
import { estimatedCardProcessingFeeCents, monthlyRecurringRevenueCents, operatingProfitCents, scenarioMonth } from "@/lib/finance";
import { searchDocuments } from "@/lib/search";
import { applySimulationAction, startSimulation } from "@/lib/simulation";
import { reviewCard, startingCard } from "@/lib/srs";
import { patchFromStripeEvent } from "@/lib/stripe-billing";
import { simulations } from "@/content/simulation-cases";
import { calculators } from "@/content/tools";
import { decryptBytes, hotp, sniffUpload, redactSensitive } from "@/server/crypto";
import { Store } from "@/server/store";

describe("formulas", () => {
  it("matches the worked teaching examples", () => {
    expect(predictedBodyWeight("male", 180)).toMatchObject({ ok: true, value: 75.12 });
    expect(minuteVentilation(500, 12)).toMatchObject({ ok: true, value: 6 });
    expect(pfRatio(80, 0.8)).toMatchObject({ ok: true, value: 100 });
    expect(oxygenContent(15, 1, 100)).toMatchObject({ ok: true, value: 20.41 });
    expect(staticCompliance(500, 25, 5)).toMatchObject({ ok: true, value: 25 });
    expect(dynamicCompliance(500, 35, 5).ok).toBe(true);
    expect(airwayResistance(30, 20, 60)).toMatchObject({ ok: true, value: 10 });
    expect(rapidShallowBreathingIndex(30, 300)).toMatchObject({ ok: true, value: 100 });
    expect(anionGap(140, 104, 24)).toMatchObject({ ok: true, value: 12 });
    expect(wintersFormula(12)).toMatchObject({ ok: true, value: 26 });
    expect(oxygenationIndex(15, 0.6, 60)).toMatchObject({ ok: true, value: 15 });
    expect(cylinderDuration(2000, 2, "E")).toMatchObject({ ok: true, value: 280 });
    expect(deadSpaceFraction(40, 20)).toMatchObject({ ok: true, value: 0.5 });
    expect(idealBodyWeightDevine("male", 140).ok).toBe(true);
  });

  it("rejects unsafe or empty inputs", () => {
    expect(predictedBodyWeight("male", 100).ok).toBe(false);
    expect(pfRatio(80, 2).ok).toBe(false);
    expect(staticCompliance(500, 5, 5).ok).toBe(false);
  });
});

describe("acid-base", () => {
  it("names a respiratory acidosis without prescribing anything", () => {
    const report = interpretAcidBase({ pH: 7.25, paCO2: 60, bicarbonate: 26 });
    expect(report.ok).toBe(true);
    if (report.ok) {
      expect(report.summary).toContain("respiratory acidosis");
      expect(report.limits.join(" ")).toContain("does not recommend a treatment");
    }
  });
});

describe("access and billing", () => {
  it("does not treat a canceled student record as premium", () => {
    expect(resolveEntitlement({
      plan: "student",
      subscriptionStatus: "canceled",
      verificationStatus: "approved",
      periodEndsAt: null,
      now: "2026-11-23T00:00:00.000Z",
    })).toBe("free");
  });

  it("keeps access during an open paid period", () => {
    expect(resolveEntitlement({
      plan: "student",
      subscriptionStatus: "canceled",
      verificationStatus: "approved",
      periodEndsAt: "2026-12-01T00:00:00.000Z",
      now: "2026-11-23T00:00:00.000Z",
    })).toBe("individual_premium");
  });

  it("never raises a student price without consent", () => {
    const decision = renewalDecision({ plan: "student", verificationActive: false, standardPriceConsentAt: null });
    expect(decision.action).toBe("cancel_at_period_end");
    expect(decision.priceCents).toBe(499);
  });

  it("gives students and standard subscribers the same library", () => {
    expect(canAccess("individual_premium", "premium")).toBe(true);
    expect(canAccess("free", "premium")).toBe(false);
  });
});

describe("editorial", () => {
  it("blocks publication of clinical content with no reviewer", () => {
    const lesson = lessons[0];
    expect(lesson.editorial.status).not.toBe("published");
    expect(publishBlockers(lesson).join(" ")).toContain("named reviewer");
    expect(canTransition("clinical_review_required", "published")).toBe(false);
  });

  it("keeps every clinical item out of the published state", () => {
    const clinical = [...lessons, ...diseases, ...medications, ...questions, ...simulations];
    expect(clinical.every((item) => item.editorial.status !== "published")).toBe(true);
    expect(clinical.every((item) => item.editorial.reviewer === null)).toBe(true);
  });
});

describe("search and catalog", () => {
  it("requires every term to match", () => {
    const hits = searchDocuments([
      { id: "a", type: "Lesson", title: "trachea", href: "/a", text: "airway", access: "free" },
      { id: "b", type: "Lesson", title: "trachea", href: "/b", text: "other", access: "free" },
    ], "trachea airway");
    expect(hits.map((hit) => hit.id)).toEqual(["a"]);
  });

  it("points every lesson at a real neighbor, structure, and answer", () => {
    const slugs = lessons.map((lesson) => lesson.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const lesson of lessons) {
      for (const related of lesson.related) expect(findLesson(related)?.slug).toBe(related);
      for (const id of lesson.anatomy) expect(getAnatomy(id)?.id).toBe(id);
      for (const tool of lesson.tools) {
        const slug = tool.href.slice("/calculators/".length);
        expect(calculators.some((calculator) => calculator.slug === slug)).toBe(true);
      }
      for (const check of lesson.checks) expect(check.answer).toBeGreaterThanOrEqual(0);
      for (const check of lesson.checks) expect(check.answer).toBeLessThan(check.choices.length);
    }
  });

  it("counts only records that exist", () => {
    const counts = resourceCounts();
    expect(counts.lessons).toBe(lessons.length);
    expect(counts.diseases).toBe(diseases.length);
    expect(counts.questions).toBe(questions.length);
    expect(counts.calculators).toBe(calculators.length);
    expect(counts.fullLengthExams).toBe(0);
    expect(counts.anatomyMeshes).toBe(anatomyRecords.filter((record) => record.mesh).length);
  });
});

describe("atlas", () => {
  it("loads named meshes and hits a real triangle", () => {
    const meshes = readGlbMeshes(ATLAS_GLB_PATH);
    expect(meshes).toHaveLength(74);
    expect(meshes.map((mesh) => mesh.name)).toContain("FMA7394");
    const trachea = meshes.find((mesh) => mesh.name === "FMA7394");
    expect(trachea).toBeTruthy();
    if (!trachea) return;
    const a = trachea.indices[0];
    const centroid: [number, number, number] = [0, 0, 0];
    for (const index of [a, trachea.indices[1], trachea.indices[2]]) {
      centroid[0] += trachea.positions[index * 3] / 3;
      centroid[1] += trachea.positions[index * 3 + 1] / 3;
      centroid[2] += trachea.positions[index * 3 + 2] / 3;
    }
    const toward = meshHits(trachea, [centroid[0], centroid[1], centroid[2] - 0.2], [0, 0, 1]);
    const away = meshHits(trachea, [centroid[0], centroid[1], centroid[2] + 0.2], [0, 0, -1]);
    expect(toward + away).toBeGreaterThan(0);
  });

  it("shows a layer only when that layer is enabled", () => {
    const meshes = [{ mesh: "FMA7394", layers: ["respiratory"] }, { mesh: "FMA7487", layers: ["skeletal"] }];
    expect(visibleMeshIds(meshes, ["respiratory"], [])).toEqual(["FMA7394"]);
    expect(visibleMeshIds(meshes, ["respiratory", "skeletal"], ["FMA7487"])).toEqual(["FMA7394"]);
    expect(clipPosition(0, 10, 0.5)).toBe(5);
  });
});

describe("simulation and study", () => {
  it("does not advance on an inappropriate action", () => {
    const scenario = simulations[0];
    const start = startSimulation(scenario);
    const wrong = scenario.steps[0].actions.find((action) => !action.appropriate);
    expect(wrong).toBeTruthy();
    if (!wrong) return;
    const next = applySimulationAction(scenario, start, wrong.id);
    expect("step" in next && next.step).toBe(0);
    expect("log" in next && next.log).toHaveLength(1);
  });

  it("resets a missed card and keeps ease at or above 1.3", () => {
    const again = reviewCard(startingCard("2026-11-23"), 0, "2026-11-23");
    expect(again.repetitions).toBe(0);
    expect(again.ease).toBeGreaterThanOrEqual(1.3);
  });
});

describe("finance", () => {
  it("separates recurring revenue from profit and labels a scenario as a projection", () => {
    const mrr = monthlyRecurringRevenueCents([
      { plan: "student", status: "active", priceCents: 499 },
      { plan: "standard", status: "canceled", priceCents: 999 },
    ]);
    expect(mrr).toBe(499);
    expect(estimatedCardProcessingFeeCents(499)).toBe(Math.round(499 * 0.029) + 30);
    expect(operatingProfitCents({ collectedCents: 499, refundedCents: 0, processingFeesCents: 44, expenseCents: 100 })).toBe(355);
    expect(scenarioMonth({
      studentSubscribers: 1,
      standardSubscribers: 0,
      institutionalRevenueCents: 0,
      monthlyChurn: 0,
      processingRate: 0,
      fixedExpenseCents: 0,
    }).label).toBe("projection");
  });
});

describe("verification privacy", () => {
  it("encrypts uploads, refuses approval without dates, and expires file links", () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), "ll-"));
    const store = new Store(directory);
    const created = store.register({ email: "student@example.edu", password: "long-password" });
    expect("user" in created).toBe(true);
    if (!("user" in created) || !created.user?.id) return;
    const studentId = created.user.id;
    const png = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0, 0, 0, 0, 1, 2, 3, 4]);
    expect(sniffUpload(png)).toBe("png");
    const uploaded = store.submitDocument({ userId: studentId, bytes: png, ip: "203.0.113.4" });
    expect("id" in uploaded).toBe(true);
    if (!("id" in uploaded) || !uploaded.id) return;
    const verificationId = uploaded.id;
    const denied = store.decideVerification({
      reviewerId: studentId,
      verificationId,
      decision: "approved",
      evidenceHasDates: false,
    });
    expect("error" in denied).toBe(true);
    const reviewer = store.register({ email: "reviewer@lunglearn.test", password: "long-password" });
    if (!("user" in reviewer) || !reviewer.user?.id) return;
    const reviewerId = reviewer.user.id;
    const database = JSON.parse(fs.readFileSync(path.join(directory, "db.json"), "utf8")) as { users: { id: string; role: string; mfaEnabled: boolean }[] };
    const record = database.users.find((user) => user.id === reviewerId);
    if (record) {
      record.role = "reviewer";
      record.mfaEnabled = true;
      fs.writeFileSync(path.join(directory, "db.json"), JSON.stringify(database));
    }
    const token = store.issueFileToken({ reviewerId, verificationId, mfa: true, now: Date.now() - 120_000 });
    expect("error" in token || "token" in token).toBe(true);
    if ("token" in token && token.token) {
      const read = store.readVerificationFile(token.token, Date.now());
      expect("error" in read).toBe(true);
    }
    const fresh = store.issueFileToken({ reviewerId, verificationId, mfa: false });
    expect("error" in fresh).toBe(true);
    expect(redactSensitive("verification/abc.bin and AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==")).not.toContain("AAAA");
  });
});

describe("sign-in protections", () => {
  it("does not let a short rate window erase a longer one", () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), "ll-rate-"));
    const store = new Store(directory);
    const now = Date.parse("2026-11-23T12:00:00.000Z");
    expect(store.consumeRate("tutor:person", 1, 60 * 60 * 1000, now - 20 * 60 * 1000)).toBe(true);
    store.login({ email: "nobody@example.com", password: "wrong-password", ip: "198.51.100.8", now });
    expect(store.consumeRate("tutor:person", 1, 60 * 60 * 1000, now)).toBe(false);
  });

  it("withholds a session until the authenticator code matches", () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), "ll-mfa-"));
    const store = new Store(directory);
    const created = store.register({ email: "mfa@example.edu", password: "long-password" });
    expect("user" in created).toBe(true);
    if (!("user" in created) || !created.user) return;
    const first = store.login({ email: "mfa@example.edu", password: "long-password", ip: "198.51.100.9" });
    expect("token" in first).toBe(true);
    if (!("token" in first) || !first.token) return;
    const started = store.beginMfa(created.user.id);
    expect("otpauth" in started).toBe(true);
    const database = JSON.parse(fs.readFileSync(path.join(directory, "db.json"), "utf8")) as {
      users: { mfaPendingSecret: string | null; mfaSecret: string | null; mfaEnabled: boolean }[];
    };
    const pending = database.users[0]?.mfaPendingSecret;
    expect(pending).toBeTruthy();
    if (!pending) return;
    const now = Date.now();
    const code = hotp(decryptBytes(Buffer.from(pending, "base64")), Math.floor(now / 30_000));
    expect(store.confirmMfa(created.user.id, code, first.token, now)).toMatchObject({ ok: true });
    const saved = JSON.parse(fs.readFileSync(path.join(directory, "db.json"), "utf8")) as { users: { mfaSecret: string | null; mfaEnabled: boolean }[] };
    const secret = saved.users[0]?.mfaSecret;
    store.beginMfa(created.user.id);
    const after = JSON.parse(fs.readFileSync(path.join(directory, "db.json"), "utf8")) as { users: { mfaSecret: string | null; mfaEnabled: boolean }[] };
    expect(after.users[0]?.mfaEnabled).toBe(true);
    expect(after.users[0]?.mfaSecret).toBe(secret);
    const challenged = store.login({ email: "mfa@example.edu", password: "long-password", ip: "198.51.100.9", now });
    expect(challenged).toMatchObject({ mfaRequired: true });
    if (!("challenge" in challenged) || !challenged.challenge) return;
    expect(store.userForToken(challenged.challenge, now)).toBeNull();
    const wrongCode = code === "000000" ? "000001" : "000000";
    expect("error" in store.completeMfaLogin({ challenge: challenged.challenge, code: wrongCode, ip: "198.51.100.9", now })).toBe(true);
    const signedIn = store.completeMfaLogin({ challenge: challenged.challenge, code, ip: "198.51.100.9", now });
    expect(signedIn).toMatchObject({ token: challenged.challenge });
    expect(store.userForToken(challenged.challenge, now)?.mfa).toBe(true);
  });
});

describe("stripe mapping", () => {
  it("reads the user from checkout metadata", () => {
    const patch = patchFromStripeEvent({
      id: "evt_test",
      object: "event",
      type: "checkout.session.completed",
      data: {
        object: {
          metadata: { userId: "user_1", plan: "student" },
          payment_status: "paid",
          status: "complete",
          customer: "cus_1",
          subscription: "sub_1",
        },
      },
    } as never);
    expect(patch).toMatchObject({ userId: "user_1", plan: "student", priceCents: 499, status: "active" });
  });
});
