"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { safeNext } from "@/lib/http";
import { interpretAcidBase } from "@/lib/acid-base";
import * as formulas from "@/lib/calculators";
import type { CalcResult } from "@/lib/calculators";
import type { Question } from "@/content/questions";
import type { SimulationCase } from "@/content/simulation-cases";
import { applySimulationAction, startSimulation, type SimSnapshot } from "@/lib/simulation";
import type { CalculatorSpec } from "@/content/tools";

function numberFrom(values: Record<string, string>, name: string) {
  return Number(values[name]);
}

export function CalculatorForm({ spec }: { spec: CalculatorSpec }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [output, setOutput] = useState<CalcResult | { ok: false; error: string } | null>(null);

  function run(event: React.FormEvent) {
    event.preventDefault();
    const sex = values.sex === "female" ? "female" : "male";
    const cylinder = values.cylinder === "H" ? "H" : "E";
    const table: Record<string, () => CalcResult | { ok: false; error: string }> = {
      "predicted-body-weight": () => formulas.predictedBodyWeight(sex, numberFrom(values, "heightCm")),
      "ideal-body-weight": () => formulas.idealBodyWeightDevine(sex, numberFrom(values, "heightCm")),
      "minute-ventilation": () => formulas.minuteVentilation(numberFrom(values, "tidalVolumeMl"), numberFrom(values, "rate")),
      "pf-ratio": () => formulas.pfRatio(numberFrom(values, "paO2"), numberFrom(values, "fiO2")),
      "alveolar-gas": () =>
        formulas.alveolarPo2({
          fiO2Fraction: numberFrom(values, "fiO2"),
          paCO2: numberFrom(values, "paCO2"),
          barometricPressure: values.pb ? numberFrom(values, "pb") : undefined,
          respiratoryQuotient: values.r ? numberFrom(values, "r") : undefined,
        }),
      "aa-gradient": () =>
        formulas.aaGradient({
          paO2: numberFrom(values, "paO2"),
          fiO2Fraction: numberFrom(values, "fiO2"),
          paCO2: numberFrom(values, "paCO2"),
        }),
      "oxygen-content": () => formulas.oxygenContent(numberFrom(values, "hemoglobin"), numberFrom(values, "saturation"), numberFrom(values, "paO2")),
      "oxygen-delivery": () => formulas.oxygenDelivery(numberFrom(values, "caO2"), numberFrom(values, "cardiacOutput")),
      "oxygen-consumption": () => formulas.oxygenConsumption(numberFrom(values, "caO2"), numberFrom(values, "cvO2"), numberFrom(values, "cardiacOutput")),
      "static-compliance": () => formulas.staticCompliance(numberFrom(values, "tidalVolumeMl"), numberFrom(values, "plateau"), numberFrom(values, "peep")),
      "dynamic-compliance": () => formulas.dynamicCompliance(numberFrom(values, "tidalVolumeMl"), numberFrom(values, "pip"), numberFrom(values, "peep")),
      "airway-resistance": () => formulas.airwayResistance(numberFrom(values, "pip"), numberFrom(values, "plateau"), numberFrom(values, "flowLpm")),
      rsbi: () => formulas.rapidShallowBreathingIndex(numberFrom(values, "rate"), numberFrom(values, "tidalVolumeMl")),
      "anion-gap": () => formulas.anionGap(numberFrom(values, "sodium"), numberFrom(values, "chloride"), numberFrom(values, "bicarbonate")),
      "winters-formula": () => formulas.wintersFormula(numberFrom(values, "bicarbonate")),
      "oxygenation-index": () => formulas.oxygenationIndex(numberFrom(values, "map"), numberFrom(values, "fiO2"), numberFrom(values, "paO2")),
      "mean-airway-pressure": () => formulas.approximateMeanAirwayPressure(numberFrom(values, "peep"), numberFrom(values, "pip"), numberFrom(values, "fraction")),
      "cylinder-duration": () => formulas.cylinderDuration(numberFrom(values, "psi"), numberFrom(values, "flow"), cylinder),
      "time-constant": () => formulas.timeConstant(numberFrom(values, "resistance"), numberFrom(values, "complianceMl")),
      "corrected-minute-ventilation": () => formulas.correctedMinuteVentilation(numberFrom(values, "minuteVentilation"), numberFrom(values, "paCO2")),
      "dead-space": () => formulas.deadSpaceFraction(numberFrom(values, "paCO2"), numberFrom(values, "peCO2")),
      "mean-arterial-pressure": () => formulas.meanArterialPressure(numberFrom(values, "systolic"), numberFrom(values, "diastolic")),
      svr: () => formulas.systemicVascularResistance(numberFrom(values, "map"), numberFrom(values, "cvp"), numberFrom(values, "cardiacOutput")),
      pvr: () => formulas.pulmonaryVascularResistance(numberFrom(values, "mpap"), numberFrom(values, "pawp"), numberFrom(values, "cardiacOutput")),
      "stroke-volume": () => formulas.strokeVolume(numberFrom(values, "cardiacOutput"), numberFrom(values, "heartRate")),
    };
    if (spec.slug === "acid-base") {
      const report = interpretAcidBase({
        pH: numberFrom(values, "pH"),
        paCO2: numberFrom(values, "paCO2"),
        bicarbonate: numberFrom(values, "bicarbonate"),
      });
      if (!report.ok) setOutput(report);
      else setOutput({ ok: true, value: numberFrom(values, "pH"), unit: "pH entered", steps: [report.summary, ...report.details, ...report.limits] });
      return;
    }
    const fn = table[spec.slug];
    setOutput(fn ? fn() : { ok: false, error: "This calculator is not wired." });
  }

  return (
    <form onSubmit={run} className="card">
      {spec.inputs.map((input) => (
        <label key={input.name} className="field">
          {input.label}
          {input.unit ? ` (${input.unit})` : ""}
          {input.name === "sex" || input.name === "cylinder" ? (
            <select value={values[input.name] ?? (input.name === "sex" ? "male" : "E")} onChange={(event) => setValues({ ...values, [input.name]: event.target.value })}>
              {input.name === "sex" ? (
                <>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </>
              ) : (
                <>
                  <option value="E">E</option>
                  <option value="H">H</option>
                </>
              )}
            </select>
          ) : (
            <input
              inputMode="decimal"
              value={values[input.name] ?? ""}
              onChange={(event) => setValues({ ...values, [input.name]: event.target.value })}
              required
            />
          )}
        </label>
      ))}
      <button className="btn" type="submit">
        Calculate
      </button>
      <p className="muted">Educational use only. This result is not a treatment order.</p>
      {output && !output.ok ? <p className="banner">{output.error}</p> : null}
      {output && output.ok ? (
        <div>
          <p className="stat">
            {output.value} {output.unit}
          </p>
          <ol>
            {output.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      ) : null}
    </form>
  );
}

export function ExamRunner({
  title,
  minutes,
  items,
  note,
}: {
  title: string;
  minutes: number;
  items: Question[];
  note: string;
}) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<Record<string, number>>({});
  const [confidence, setConfidence] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [timed, setTimed] = useState(true);
  const [left, setLeft] = useState(minutes * 60);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const current = items[index];

  useEffect(() => {
    if (!timed || done) return;
    const timer = window.setInterval(() => {
      setLeft((value) => {
        if (value <= 1) {
          setDone(true);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [timed, done]);

  const score = useMemo(() => items.filter((item) => picked[item.id] === item.answer).length, [items, picked]);

  if (!current) return <p>This form has no questions.</p>;

  return (
    <section className="card">
      <h2>{title}</h2>
      <p>{note}</p>
      <p className="meta">
        <span>
          Item {Math.min(index + 1, items.length)} of {items.length}
        </span>
        <label>
          <input type="checkbox" checked={timed} onChange={(event) => setTimed(event.target.checked)} /> Timed
        </label>
        {timed ? <span>{Math.floor(left / 60)}:{String(left % 60).padStart(2, "0")}</span> : <span>Untimed</span>}
      </p>
      {done ? (
        <div>
          <p className="stat">
            {score} / {items.length}
          </p>
          <p>This is a count of matches to the answer key. It is not an examination score and it does not predict a credential.</p>
          {items.map((item) => {
            const choice = picked[item.id];
            const correct = choice === item.answer;
            return (
              <article key={item.id}>
                <h3>{item.stem}</h3>
                <p>{correct ? "Matched the key." : "Did not match the key."}</p>
                <p>{item.explanation}</p>
                {!correct && choice !== undefined ? <p>{item.whyWrong[choice] ?? "Review the explanation."}</p> : null}
                <p className="muted">
                  {item.topic} · {item.difficulty}
                  {confidence[item.id] ? ` · confidence ${confidence[item.id]}` : ""}
                </p>
              </article>
            );
          })}
        </div>
      ) : (
        <div>
          <h3>{current.stem}</h3>
          <div className="checks">
            {current.choices.map((choice, choiceIndex) => (
              <label key={choice}>
                <input
                  type="radio"
                  name={current.id}
                  checked={picked[current.id] === choiceIndex}
                  onChange={() => setPicked({ ...picked, [current.id]: choiceIndex })}
                />{" "}
                {choice}
              </label>
            ))}
          </div>
          <label className="field">
            Confidence
            <select value={confidence[current.id] ?? ""} onChange={(event) => setConfidence({ ...confidence, [current.id]: event.target.value })}>
              <option value="">Not marked</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
          <div className="toolbar">
            <button type="button" className="btn-quiet" onClick={() => setIndex((value) => Math.max(0, value - 1))}>
              Previous
            </button>
            <button type="button" className="btn-quiet" onClick={() => setIndex((value) => Math.min(items.length - 1, value + 1))}>
              Next
            </button>
            <button
              type="button"
              className="btn-quiet"
              onClick={() => setBookmarks((currentMarks) => (currentMarks.includes(current.id) ? currentMarks : [...currentMarks, current.id]))}
            >
              Bookmark
            </button>
            <button type="button" className="btn" onClick={() => setDone(true)}>
              Finish
            </button>
          </div>
          {bookmarks.length ? <p className="muted">Bookmarked: {bookmarks.join(", ")}</p> : null}
        </div>
      )}
    </section>
  );
}

export function QuestionPractice({ item }: { item: Question }) {
  return <ExamRunner title="Single item" minutes={4} items={[item]} note="One original item. Not an NBRC question." />;
}

export function SimulationRunner({ scenario }: { scenario: SimulationCase }) {
  const [snapshot, setSnapshot] = useState<SimSnapshot>(() => startSimulation(scenario));
  const step = scenario.steps[snapshot.step];
  return (
    <section className="card">
      <p>{scenario.stem}</p>
      <dl>
        {Object.entries(snapshot.vitals).map(([key, value]) => (
          <div key={key}>
            <dt>{key}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      {snapshot.completed ? <p>The authored sequence is complete. The numbers above are the case’s teaching values, not a prediction.</p> : <h2>{step?.prompt}</h2>}
      {!snapshot.completed && step
        ? step.actions.map((action) => (
            <button
              key={action.id}
              type="button"
              className="btn-quiet"
              onClick={() => {
                const next = applySimulationAction(scenario, snapshot, action.id);
                if (!("error" in next)) setSnapshot(next);
              }}
            >
              {action.label}
            </button>
          ))
        : null}
      <ol>
        {snapshot.log.map((entry, index) => (
          <li key={`${entry.actionId}-${index}`}>
            {entry.appropriate ? "Fits the authored case." : "Does not fit the authored case."} {entry.explanation}
          </li>
        ))}
      </ol>
    </section>
  );
}

async function postJson(url: string, body: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await response.json().catch(() => ({}))) as { error?: string; ok?: boolean; mfaRequired?: boolean; challenge?: string };
  return { ok: response.ok, error: data.error, mfaRequired: data.mfaRequired, challenge: data.challenge };
}

export function AuthForm({ mode, next }: { mode: "sign-in" | "sign-up"; next?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [challenge, setChallenge] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const destination = safeNext(mode === "sign-in" ? next : "/learn");
  if (challenge) {
    return (
      <form
        className="card"
        onSubmit={async (event) => {
          event.preventDefault();
          const result = await postJson("/api/auth/login", { challenge, code });
          if (!result.ok) {
            setError(result.error || "That code was not accepted.");
            return;
          }
          router.push(destination);
          router.refresh();
        }}
      >
        <label className="field">
          Authenticator code
          <input value={code} onChange={(event) => setCode(event.target.value)} inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" required />
        </label>
        {error ? <p className="banner">{error}</p> : null}
        <button className="btn" type="submit">
          Confirm code
        </button>
      </form>
    );
  }
  return (
    <form
      className="card"
      onSubmit={async (event) => {
        event.preventDefault();
        const result = await postJson(mode === "sign-in" ? "/api/auth/login" : "/api/auth/register", { email, password });
        if (result.mfaRequired && result.challenge) {
          setChallenge(result.challenge);
          setError("");
          return;
        }
        if (!result.ok) {
          setError(result.error || "The request failed.");
          return;
        }
        router.push(destination);
        router.refresh();
      }}
    >
      <label className="field">
        Email
        <input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
      </label>
      <label className="field">
        Password
        <input type="password" autoComplete={mode === "sign-in" ? "current-password" : "new-password"} value={password} onChange={(event) => setPassword(event.target.value)} required />
      </label>
      {error ? <p className="banner">{error}</p> : null}
      <button className="btn" type="submit">
        {mode === "sign-in" ? "Sign in" : "Create account"}
      </button>
    </form>
  );
}

export function ReportForm({ href }: { href: string }) {
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  return (
    <form
      className="card"
      onSubmit={async (event) => {
        event.preventDefault();
        const result = await postJson("/api/reports", { href, message });
        if (!result.ok) setError(result.error || "The report was not saved.");
        else setDone(true);
      }}
    >
      <label className="field">
        Page
        <input value={href} readOnly />
      </label>
      <label className="field">
        What looks wrong?
        <textarea value={message} onChange={(event) => setMessage(event.target.value)} required minLength={12} rows={5} />
      </label>
      {error ? <p className="banner">{error}</p> : null}
      {done ? <p>The report is in the correction queue.</p> : <button className="btn">Send report</button>}
    </form>
  );
}

export function BookmarkButton({ href, title }: { href: string; title: string }) {
  const [note, setNote] = useState("");
  return (
    <button
      type="button"
      className="btn-quiet no-print"
      onClick={async () => {
        const result = await postJson("/api/study", { action: "bookmark", href, title });
        setNote(result.ok ? "Saved to your study desk." : result.error || "Sign in to save this.");
      }}
    >
      {note || "Bookmark"}
    </button>
  );
}

export function FlashcardButton({ front, back, sourceHref }: { front: string; back: string; sourceHref: string }) {
  const [note, setNote] = useState("");
  return (
    <button
      type="button"
      className="btn-quiet no-print"
      onClick={async () => {
        const result = await postJson("/api/study", { action: "card", front, back, sourceHref });
        setNote(result.ok ? "Card added." : result.error || "Sign in to make a card.");
      }}
    >
      {note || "Make a flashcard"}
    </button>
  );
}

export function CompleteLessonButton({ slug }: { slug: string }) {
  const [note, setNote] = useState("");
  return (
    <button
      type="button"
      className="btn-quiet no-print"
      onClick={async () => {
        const result = await postJson("/api/study", { action: "complete", lessonSlug: slug });
        setNote(result.ok ? "Marked complete." : result.error || "Sign in first.");
      }}
    >
      {note || "Mark complete"}
    </button>
  );
}
