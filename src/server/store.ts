import fs from "fs";
import path from "path";
import {
  decryptBytes,
  dummyPasswordHash,
  encryptBytes,
  hashPassword,
  hashToken,
  newToken,
  randomSecret,
  redactSensitive,
  sniffUpload,
  verifyPassword,
  verifyTotp,
  base32Encode,
} from "@/server/crypto";

export type Role = "learner" | "admin" | "editor" | "reviewer" | "support";

export type User = {
  id: string;
  email: string;
  passwordHash: string;
  role: Role;
  mfaSecret: string | null;
  mfaPendingSecret: string | null;
  mfaEnabled: boolean;
  createdAt: string;
};

export type Session = {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: string;
  mfaUntil: string | null;
  mfaPending?: boolean;
};

export type Subscription = {
  id: string;
  userId: string;
  plan: "student" | "standard" | "institutional";
  status: "active" | "past_due" | "canceled" | "incomplete";
  priceCents: number;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  periodEndsAt: string | null;
  standardPriceConsentAt: string | null;
  verificationStatus: "none" | "pending" | "approved" | "expired" | "rejected";
};

export type Verification = {
  id: string;
  userId: string;
  method: "document" | "attestation";
  status: "pending" | "approved" | "rejected";
  enrollmentStart: string | null;
  enrollmentEnd: string | null;
  evidenceHasDates: boolean;
  reviewerId: string | null;
  decidedAt: string | null;
  deleteAfter: string | null;
  ciphertextRemoved: boolean;
  fileKind: "jpeg" | "png" | "pdf" | null;
  note: string;
  createdAt: string;
};

type Audit = { id: string; at: string; actorId: string | null; action: string; detail: string };
type Report = { id: string; at: string; href: string; message: string; userId: string | null; status: "open" | "resolved" };
type Note = { id: string; userId: string; title: string; body: string; updatedAt: string };
type Bookmark = { id: string; userId: string; href: string; title: string };
type Flashcard = {
  id: string;
  userId: string;
  front: string;
  back: string;
  sourceHref: string | null;
  ease: number;
  intervalDays: number;
  repetitions: number;
  dueOn: string;
};
type Progress = { userId: string; lessonSlug: string; completedAt: string };
type Classroom = { id: string; ownerId: string; name: string; code: string };
type Enrollment = { classroomId: string; userId: string };
type Assignment = { id: string; classroomId: string; title: string; href: string; dueOn: string | null };
type Inquiry = { id: string; organization: string; email: string; seats: number; note: string; at: string };
type Expense = { id: string; category: string; cents: number; note: string; actual: boolean };
type Rate = { key: string; at: string };

type Database = {
  users: User[];
  sessions: Session[];
  subscriptions: Subscription[];
  verifications: Verification[];
  audits: Audit[];
  reports: Report[];
  notes: Note[];
  bookmarks: Bookmark[];
  flashcards: Flashcard[];
  progress: Progress[];
  classrooms: Classroom[];
  enrollments: Enrollment[];
  assignments: Assignment[];
  inquiries: Inquiry[];
  expenses: Expense[];
  stripeEvents: string[];
  rates: Rate[];
  fileTokens: { tokenHash: string; verificationId: string; expiresAt: string }[];
};

function empty(): Database {
  return {
    users: [],
    sessions: [],
    subscriptions: [],
    verifications: [],
    audits: [],
    reports: [],
    notes: [],
    bookmarks: [],
    flashcards: [],
    progress: [],
    classrooms: [],
    enrollments: [],
    assignments: [],
    inquiries: [],
    expenses: [],
    stripeEvents: [],
    rates: [],
    fileTokens: [],
  };
}

export class Store {
  constructor(private readonly directory: string) {
    fs.mkdirSync(directory, { recursive: true });
    fs.mkdirSync(path.join(directory, "verification"), { recursive: true });
    if (!fs.existsSync(this.file)) fs.writeFileSync(this.file, JSON.stringify(empty(), null, 2));
  }

  private get file() {
    return path.join(this.directory, "db.json");
  }

  private read(): Database {
    const parsed = JSON.parse(fs.readFileSync(this.file, "utf8")) as Database;
    const base = empty();
    for (const key of Object.keys(base) as (keyof Database)[]) {
      if (!Array.isArray(parsed[key])) parsed[key] = base[key] as never;
    }
    return parsed;
  }

  private write(db: Database) {
    const temporary = `${this.file}.tmp`;
    fs.writeFileSync(temporary, JSON.stringify(db, null, 2));
    fs.renameSync(temporary, this.file);
  }

  private id() {
    return newToken().slice(0, 24);
  }

  private audit(db: Database, actorId: string | null, action: string, detail: string) {
    db.audits.push({
      id: this.id(),
      at: new Date().toISOString(),
      actorId,
      action,
      detail: redactSensitive(detail).slice(0, 500),
    });
  }

  consumeRate(key: string, max: number, windowMs: number, now = Date.now()) {
    const db = this.read();
    const allowed = this.limit(db, key, max, windowMs, now);
    this.write(db);
    return allowed;
  }

  private rateCount(db: Database, key: string, windowMs: number, now: number) {
    db.rates = db.rates.filter((rate) => now - Date.parse(rate.at) < 24 * 60 * 60 * 1000);
    return db.rates.filter((rate) => rate.key === key && now - Date.parse(rate.at) < windowMs).length;
  }

  private markRate(db: Database, key: string, now: number) {
    db.rates.push({ key, at: new Date(now).toISOString() });
  }

  private limit(db: Database, key: string, max: number, windowMs: number, now: number) {
    if (this.rateCount(db, key, windowMs, now) >= max) return false;
    this.markRate(db, key, now);
    return true;
  }

  register(input: { email: string; password: string; now?: string; ip?: string }) {
    const email = input.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Enter a valid email address." as const };
    if (input.password.length < 10) return { error: "Use at least 10 characters." as const };
    const db = this.read();
    const now = input.now ? Date.parse(input.now) : Date.now();
    if (input.ip && !this.limit(db, `register:${input.ip}`, 5, 60 * 60 * 1000, now)) {
      this.write(db);
      return { error: "Too many new accounts from this network. Wait and try again." as const, status: 429 as const };
    }
    if (db.users.some((user) => user.email === email)) {
      if (input.ip) this.write(db);
      return { error: "An account with that email already exists." as const };
    }
    const admins = (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean);
    const user: User = {
      id: this.id(),
      email,
      passwordHash: hashPassword(input.password),
      role: admins.includes(email) ? "admin" : "learner",
      mfaSecret: null,
      mfaPendingSecret: null,
      mfaEnabled: false,
      createdAt: input.now ?? new Date().toISOString(),
    };
    db.users.push(user);
    db.subscriptions.push({
      id: this.id(),
      userId: user.id,
      plan: "student",
      status: "canceled",
      priceCents: 0,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      periodEndsAt: null,
      standardPriceConsentAt: null,
      verificationStatus: "none",
    });
    this.audit(db, user.id, "register", `account ${user.id}`);
    this.write(db);
    return { user: publicUser(user) };
  }

  login(input: { email: string; password: string; ip: string; now?: number }) {
    const now = input.now ?? Date.now();
    const db = this.read();
    if (this.rateCount(db, `login:${input.ip}`, 15 * 60 * 1000, now) >= 10) {
      this.write(db);
      return { error: "Too many sign-in attempts. Wait and try again." as const, status: 429 as const };
    }
    const user = db.users.find((candidate) => candidate.email === input.email.trim().toLowerCase());
    const passwordOk = verifyPassword(input.password, user?.passwordHash ?? dummyPasswordHash());
    if (!user || !passwordOk) {
      this.markRate(db, `login:${input.ip}`, now);
      this.audit(db, null, "login_failed", "rejected credentials");
      this.write(db);
      return { error: "Email or password is incorrect." as const };
    }
    if (user.mfaEnabled && user.mfaSecret) {
      const challenge = newToken();
      db.sessions.push({
        id: this.id(),
        userId: user.id,
        tokenHash: hashToken(challenge),
        expiresAt: new Date(now + 5 * 60 * 1000).toISOString(),
        mfaUntil: null,
        mfaPending: true,
      });
      this.audit(db, user.id, "login_mfa_challenge", `user ${user.id}`);
      this.write(db);
      return { mfaRequired: true as const, challenge };
    }
    const token = newToken();
    db.sessions.push({
      id: this.id(),
      userId: user.id,
      tokenHash: hashToken(token),
      expiresAt: new Date(now + 14 * 24 * 60 * 60 * 1000).toISOString(),
      mfaUntil: null,
    });
    this.audit(db, user.id, "login", `session for ${user.id}`);
    this.write(db);
    return { token, user: publicUser(user) };
  }

  logout(token: string) {
    const db = this.read();
    const hash = hashToken(token);
    db.sessions = db.sessions.filter((session) => session.tokenHash !== hash);
    this.write(db);
  }

  userForToken(token: string, now = Date.now()) {
    const db = this.read();
    const sessionsBefore = db.sessions.length;
    const tokensBefore = db.fileTokens.length;
    db.sessions = db.sessions.filter((session) => Date.parse(session.expiresAt) >= now);
    db.fileTokens = db.fileTokens.filter((item) => Date.parse(item.expiresAt) >= now);
    if (db.sessions.length !== sessionsBefore || db.fileTokens.length !== tokensBefore) this.write(db);
    const session = db.sessions.find((candidate) => candidate.tokenHash === hashToken(token));
    if (!session || session.mfaPending) return null;
    const user = db.users.find((candidate) => candidate.id === session.userId);
    if (!user) return null;
    return { user: publicUser(user), mfa: session.mfaUntil !== null && Date.parse(session.mfaUntil) > now };
  }

  completeMfaLogin(input: { challenge: string; code: string; ip: string; now?: number }) {
    const now = input.now ?? Date.now();
    const db = this.read();
    if (this.rateCount(db, `login:${input.ip}`, 15 * 60 * 1000, now) >= 10) {
      this.write(db);
      return { error: "Too many sign-in attempts. Wait and try again." as const, status: 429 as const };
    }
    const session = db.sessions.find((candidate) => candidate.tokenHash === hashToken(input.challenge));
    const user = session ? db.users.find((candidate) => candidate.id === session.userId) : undefined;
    if (!session?.mfaPending || Date.parse(session.expiresAt) < now || !user?.mfaSecret) {
      this.markRate(db, `login:${input.ip}`, now);
      this.write(db);
      return { error: "That sign-in challenge expired. Sign in again." as const };
    }
    const secret = decryptBytes(Buffer.from(user.mfaSecret, "base64"));
    if (!verifyTotp(secret, input.code, now)) {
      this.markRate(db, `login:${input.ip}`, now);
      this.audit(db, user.id, "login_failed", "rejected authenticator code");
      this.write(db);
      return { error: "That code is not valid." as const };
    }
    session.mfaPending = false;
    session.mfaUntil = new Date(now + 12 * 60 * 60 * 1000).toISOString();
    session.expiresAt = new Date(now + 14 * 24 * 60 * 60 * 1000).toISOString();
    this.audit(db, user.id, "login", `session for ${user.id}`);
    this.write(db);
    return { token: input.challenge, user: publicUser(user) };
  }

  beginMfa(userId: string) {
    const db = this.read();
    const user = db.users.find((candidate) => candidate.id === userId);
    if (!user) return { error: "Account not found." as const };
    const secret = randomSecret(20);
    user.mfaPendingSecret = encryptBytes(secret).toString("base64");
    this.write(db);
    const label = encodeURIComponent(user.email);
    return { otpauth: `otpauth://totp/Lung%20Learn:${label}?secret=${base32Encode(secret)}&issuer=Lung%20Learn&digits=6&period=30` };
  }

  confirmMfa(userId: string, token: string, sessionToken: string, now = Date.now()) {
    const db = this.read();
    const user = db.users.find((candidate) => candidate.id === userId);
    if (!user?.mfaPendingSecret) return { error: "Set up an authenticator before confirming." as const };
    const secret = decryptBytes(Buffer.from(user.mfaPendingSecret, "base64"));
    if (!verifyTotp(secret, token, now)) return { error: "That code is not valid." as const };
    user.mfaSecret = user.mfaPendingSecret;
    user.mfaPendingSecret = null;
    user.mfaEnabled = true;
    const session = db.sessions.find((candidate) => candidate.tokenHash === hashToken(sessionToken));
    if (session) session.mfaUntil = new Date(now + 12 * 60 * 60 * 1000).toISOString();
    this.audit(db, userId, "mfa_enabled", `user ${userId}`);
    this.write(db);
    return { ok: true as const };
  }

  subscriptionFor(userId: string) {
    return this.read().subscriptions.find((subscription) => subscription.userId === userId) ?? null;
  }

  consentToStandardPrice(userId: string, at: string) {
    const db = this.read();
    const subscription = db.subscriptions.find((candidate) => candidate.userId === userId);
    if (!subscription) return { error: "No subscription record." as const };
    subscription.standardPriceConsentAt = at;
    this.audit(db, userId, "standard_price_consent", `user ${userId} consented at ${at}`);
    this.write(db);
    return { ok: true as const };
  }

  applyStripeEvent(event: { id: string; type: string; userId?: string; plan?: "student" | "standard"; status?: Subscription["status"]; priceCents?: number; customerId?: string; subscriptionId?: string; periodEndsAt?: string | null }) {
    const db = this.read();
    if (db.stripeEvents.includes(event.id)) return { duplicate: true as const };
    db.stripeEvents.push(event.id);
    if (event.userId) {
      const subscription = db.subscriptions.find((candidate) => candidate.userId === event.userId);
      if (subscription) {
        if (event.plan) subscription.plan = event.plan;
        if (event.status) subscription.status = event.status;
        if (event.priceCents !== undefined) subscription.priceCents = event.priceCents;
        if (event.customerId) subscription.stripeCustomerId = event.customerId;
        if (event.subscriptionId) subscription.stripeSubscriptionId = event.subscriptionId;
        if (event.periodEndsAt !== undefined) subscription.periodEndsAt = event.periodEndsAt;
      }
    }
    this.audit(db, event.userId ?? null, "stripe_event", event.type);
    this.write(db);
    return { duplicate: false as const };
  }

  submitDocument(input: { userId: string; bytes: Uint8Array; ip: string; now?: number }) {
    const now = input.now ?? Date.now();
    const kind = sniffUpload(input.bytes);
    if (!kind) return { error: "Upload a JPEG, PNG, or PDF no larger than 5 MB." as const };
    const db = this.read();
    if (!this.limit(db, `upload:${input.userId}`, 5, 60 * 60 * 1000, now)) {
      this.write(db);
      return { error: "Upload limit reached. Try again later." as const };
    }
    const record: Verification = {
      id: this.id(),
      userId: input.userId,
      method: "document",
      status: "pending",
      enrollmentStart: null,
      enrollmentEnd: null,
      evidenceHasDates: false,
      reviewerId: null,
      decidedAt: null,
      deleteAfter: null,
      ciphertextRemoved: false,
      fileKind: kind,
      note: "",
      createdAt: new Date(now).toISOString(),
    };
    fs.writeFileSync(this.verificationPath(record.id), encryptBytes(Buffer.from(input.bytes)));
    db.verifications.push(record);
    const subscription = db.subscriptions.find((candidate) => candidate.userId === input.userId);
    if (subscription) subscription.verificationStatus = "pending";
    this.audit(db, input.userId, "verification_uploaded", `record ${record.id}`);
    this.write(db);
    return { id: record.id };
  }

  submitAttestation(input: { userId: string; institution: string; email: string; start: string; end: string }) {
    if (!input.institution.trim() || !input.email.includes("@") || input.end <= input.start) {
      return { error: "Institution, an email address, and a real enrollment term are required." as const };
    }
    const db = this.read();
    const record: Verification = {
      id: this.id(),
      userId: input.userId,
      method: "attestation",
      status: "pending",
      enrollmentStart: input.start,
      enrollmentEnd: input.end,
      evidenceHasDates: true,
      reviewerId: null,
      decidedAt: null,
      deleteAfter: null,
      ciphertextRemoved: true,
      fileKind: null,
      note: `${input.institution.trim()} · ${input.email.trim().toLowerCase()}`,
      createdAt: new Date().toISOString(),
    };
    db.verifications.push(record);
    const subscription = db.subscriptions.find((candidate) => candidate.userId === input.userId);
    if (subscription) subscription.verificationStatus = "pending";
    this.audit(db, input.userId, "verification_attestation", `record ${record.id}`);
    this.write(db);
    return { id: record.id };
  }

  decideVerification(input: {
    reviewerId: string;
    verificationId: string;
    decision: "approved" | "rejected";
    enrollmentStart?: string;
    enrollmentEnd?: string;
    evidenceHasDates: boolean;
    now?: string;
  }) {
    const db = this.read();
    const reviewer = db.users.find((user) => user.id === input.reviewerId);
    if (!reviewer || (reviewer.role !== "admin" && reviewer.role !== "reviewer")) {
      return { error: "Only a reviewer can make this decision." as const };
    }
    const record = db.verifications.find((candidate) => candidate.id === input.verificationId);
    if (!record) return { error: "Verification record not found." as const };
    if (input.decision === "approved") {
      if (!input.evidenceHasDates || !input.enrollmentStart || !input.enrollmentEnd || input.enrollmentEnd <= input.enrollmentStart) {
        return { error: "Approval requires enrollment dates that appear on the evidence. An ID card without dates is not enough." as const };
      }
      record.enrollmentStart = input.enrollmentStart;
      record.enrollmentEnd = input.enrollmentEnd;
      record.evidenceHasDates = true;
    }
    record.status = input.decision;
    record.reviewerId = reviewer.id;
    record.decidedAt = input.now ?? new Date().toISOString();
    record.deleteAfter = new Date(Date.parse(record.decidedAt) + 14 * 24 * 60 * 60 * 1000).toISOString();
    const subscription = db.subscriptions.find((candidate) => candidate.userId === record.userId);
    if (subscription) subscription.verificationStatus = input.decision === "approved" ? "approved" : "rejected";
    this.audit(db, reviewer.id, "verification_decision", `${input.decision} ${record.id}`);
    this.write(db);
    return { ok: true as const };
  }

  issueFileToken(input: { reviewerId: string; verificationId: string; mfa: boolean; now?: number }) {
    const now = input.now ?? Date.now();
    const db = this.read();
    const reviewer = db.users.find((user) => user.id === input.reviewerId);
    if (!reviewer || (reviewer.role !== "admin" && reviewer.role !== "reviewer") || !reviewer.mfaEnabled || !input.mfa) {
      return { error: "A reviewer with a current authenticator check can open a file." as const };
    }
    const record = db.verifications.find((candidate) => candidate.id === input.verificationId);
    if (!record || record.ciphertextRemoved || !record.fileKind) return { error: "No file is available." as const };
    const token = newToken();
    db.fileTokens.push({
      tokenHash: hashToken(token),
      verificationId: record.id,
      expiresAt: new Date(now + 60_000).toISOString(),
    });
    this.audit(db, reviewer.id, "verification_token", `token for ${record.id}`);
    this.write(db);
    return { token, expiresAt: new Date(now + 60_000).toISOString() };
  }

  readVerificationFile(token: string, now = Date.now()) {
    const db = this.read();
    const match = db.fileTokens.find((candidate) => candidate.tokenHash === hashToken(token));
    if (!match || Date.parse(match.expiresAt) < now) return { error: "This link has expired." as const };
    const file = this.verificationPath(match.verificationId);
    if (!fs.existsSync(file)) return { error: "The file has already been deleted." as const };
    const bytes = decryptBytes(fs.readFileSync(file));
    db.fileTokens = db.fileTokens.filter((candidate) => candidate !== match);
    this.audit(db, null, "verification_file_read", `record ${match.verificationId}`);
    this.write(db);
    return { bytes, verificationId: match.verificationId };
  }

  purgeVerificationFiles(now = Date.now()) {
    const db = this.read();
    let removed = 0;
    for (const record of db.verifications) {
      if (!record.deleteAfter || record.ciphertextRemoved) continue;
      if (Date.parse(record.deleteAfter) > now) continue;
      const file = this.verificationPath(record.id);
      if (fs.existsSync(file)) fs.rmSync(file);
      record.ciphertextRemoved = true;
      record.fileKind = null;
      removed += 1;
    }
    if (removed) this.audit(db, null, "verification_purged", `removed ${removed}`);
    this.write(db);
    return { removed };
  }

  private verificationPath(id: string) {
    return path.join(this.directory, "verification", `${id}.bin`);
  }

  addReport(input: { href: string; message: string; userId: string | null }) {
    const db = this.read();
    const report: Report = {
      id: this.id(),
      at: new Date().toISOString(),
      href: input.href.slice(0, 300),
      message: input.message.slice(0, 4000),
      userId: input.userId,
      status: "open",
    };
    db.reports.push(report);
    this.audit(db, input.userId, "content_report", report.id);
    this.write(db);
    return report;
  }

  listReports() {
    return this.read().reports;
  }

  resolveReport(id: string, actorId: string) {
    const db = this.read();
    const report = db.reports.find((candidate) => candidate.id === id);
    if (!report) return { error: "Report not found." as const };
    report.status = "resolved";
    this.audit(db, actorId, "report_resolved", id);
    this.write(db);
    return { ok: true as const };
  }

  addNote(userId: string, title: string, body: string) {
    const db = this.read();
    const note: Note = { id: this.id(), userId, title: title.slice(0, 160), body: body.slice(0, 20000), updatedAt: new Date().toISOString() };
    db.notes.push(note);
    this.write(db);
    return note;
  }

  notesFor(userId: string) {
    return this.read().notes.filter((note) => note.userId === userId);
  }

  addBookmark(userId: string, href: string, title: string) {
    const db = this.read();
    db.bookmarks.push({ id: this.id(), userId, href, title });
    this.write(db);
  }

  bookmarksFor(userId: string) {
    return this.read().bookmarks.filter((bookmark) => bookmark.userId === userId);
  }

  addFlashcard(input: { userId: string; front: string; back: string; sourceHref: string | null; today: string }) {
    const db = this.read();
    const card: Flashcard = {
      id: this.id(),
      userId: input.userId,
      front: input.front.slice(0, 500),
      back: input.back.slice(0, 2000),
      sourceHref: input.sourceHref,
      ease: 2.5,
      intervalDays: 0,
      repetitions: 0,
      dueOn: input.today,
    };
    db.flashcards.push(card);
    this.write(db);
    return card;
  }

  flashcardsFor(userId: string) {
    return this.read().flashcards.filter((card) => card.userId === userId);
  }

  updateFlashcard(userId: string, cardId: string, next: Pick<Flashcard, "ease" | "intervalDays" | "repetitions" | "dueOn">) {
    const db = this.read();
    const card = db.flashcards.find((candidate) => candidate.id === cardId && candidate.userId === userId);
    if (!card) return { error: "Card not found." as const };
    Object.assign(card, next);
    this.write(db);
    return { ok: true as const };
  }

  completeLesson(userId: string, lessonSlug: string) {
    const db = this.read();
    if (!db.progress.some((row) => row.userId === userId && row.lessonSlug === lessonSlug)) {
      db.progress.push({ userId, lessonSlug, completedAt: new Date().toISOString() });
      this.write(db);
    }
  }

  progressFor(userId: string) {
    return this.read().progress.filter((row) => row.userId === userId);
  }

  createClassroom(ownerId: string, name: string) {
    const db = this.read();
    const classroom: Classroom = { id: this.id(), ownerId, name: name.slice(0, 120), code: newToken().slice(0, 8) };
    db.classrooms.push(classroom);
    this.write(db);
    return classroom;
  }

  joinClassroom(userId: string, code: string) {
    const db = this.read();
    const classroom = db.classrooms.find((candidate) => candidate.code === code);
    if (!classroom) return { error: "That class code was not found." as const };
    if (!db.enrollments.some((row) => row.classroomId === classroom.id && row.userId === userId)) {
      db.enrollments.push({ classroomId: classroom.id, userId });
    }
    this.write(db);
    return { classroom };
  }

  createAssignment(ownerId: string, classroomId: string, title: string, href: string, dueOn: string | null) {
    const db = this.read();
    const classroom = db.classrooms.find((candidate) => candidate.id === classroomId && candidate.ownerId === ownerId);
    if (!classroom) return { error: "You do not teach that class." as const };
    const assignment: Assignment = { id: this.id(), classroomId, title, href, dueOn };
    db.assignments.push(assignment);
    this.write(db);
    return { assignment };
  }

  classroomsFor(userId: string) {
    const db = this.read();
    return db.classrooms.filter((classroom) => classroom.ownerId === userId || db.enrollments.some((row) => row.classroomId === classroom.id && row.userId === userId));
  }

  assignmentsForClassroom(classroomId: string) {
    return this.read().assignments.filter((assignment) => assignment.classroomId === classroomId);
  }

  enrollmentsFor(classroomId: string) {
    return this.read().enrollments.filter((row) => row.classroomId === classroomId);
  }

  addInquiry(input: { organization: string; email: string; seats: number; note: string }) {
    const db = this.read();
    const inquiry: Inquiry = { id: this.id(), ...input, at: new Date().toISOString() };
    db.inquiries.push(inquiry);
    this.audit(db, null, "institution_inquiry", inquiry.id);
    this.write(db);
    return inquiry;
  }

  listInquiries() {
    return this.read().inquiries;
  }

  setExpense(category: string, cents: number, note: string, actual: boolean) {
    const db = this.read();
    db.expenses.push({ id: this.id(), category, cents, note, actual });
    this.write(db);
  }

  expenses() {
    return this.read().expenses;
  }

  audits() {
    return this.read().audits;
  }

  users() {
    return this.read().users.map(publicUser);
  }

  verifications() {
    return this.read().verifications.map((record) => ({
      id: record.id,
      userId: record.userId,
      method: record.method,
      status: record.status,
      enrollmentStart: record.enrollmentStart,
      enrollmentEnd: record.enrollmentEnd,
      evidenceHasDates: record.evidenceHasDates,
      reviewerId: record.reviewerId,
      decidedAt: record.decidedAt,
      deleteAfter: record.deleteAfter,
      ciphertextRemoved: record.ciphertextRemoved,
      fileKind: record.fileKind,
      createdAt: record.createdAt,
    }));
  }

  subscriptions() {
    return this.read().subscriptions;
  }
}

function publicUser(user: User) {
  return { id: user.id, email: user.email, role: user.role, mfaEnabled: user.mfaEnabled, createdAt: user.createdAt };
}

export function getStore() {
  const directory = process.env.DATA_DIR || path.join(process.cwd(), ".data");
  return new Store(directory);
}

export function encryptionReady() {
  return Boolean(process.env.APP_ENCRYPTION_KEY);
}
