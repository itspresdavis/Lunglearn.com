"use client";

import { useState } from "react";

export function CheckoutButtons() {
  const [message, setMessage] = useState("");
  async function start(plan: "student" | "standard") {
    const response = await fetch("/api/billing/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const data = (await response.json()) as { url?: string; error?: string };
    if (data.url) {
      window.location.href = data.url;
      return;
    }
    setMessage(data.error || "Checkout did not start.");
  }
  return (
    <div>
      <div className="toolbar">
        <button type="button" className="btn" onClick={() => start("student")}>
          Student checkout
        </button>
        <button type="button" className="btn" onClick={() => start("standard")}>
          Standard checkout
        </button>
      </div>
      {message ? <p className="banner">{message}</p> : null}
    </div>
  );
}

export function PortalButton() {
  const [message, setMessage] = useState("");
  return (
    <div>
      <button
        type="button"
        className="btn-quiet"
        onClick={async () => {
          const response = await fetch("/api/billing/portal", { method: "POST" });
          const data = (await response.json()) as { url?: string; error?: string };
          if (data.url) window.location.href = data.url;
          else setMessage(data.error || "The billing portal is not available.");
        }}
      >
        Open billing portal
      </button>
      {message ? <p className="banner">{message}</p> : null}
    </div>
  );
}

export function ConsentButton() {
  const [message, setMessage] = useState("");
  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        const response = await fetch("/api/billing/consent", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ consent: true }),
        });
        const data = (await response.json()) as { error?: string };
        setMessage(response.ok ? "Consent recorded. A future renewal may use the standard price after verification ends." : data.error || "Consent was not saved.");
      }}
    >
      <label>
        <input type="checkbox" required /> I agree that, after student verification lapses, a renewal may be charged at $9.99 per month instead of ending.
      </label>
      <div className="toolbar">
        <button className="btn" type="submit">
          Record consent
        </button>
      </div>
      {message ? <p>{message}</p> : null}
    </form>
  );
}

export function VerificationForms() {
  const [message, setMessage] = useState("");
  return (
    <div className="grid grid-2">
      <form
        className="card"
        onSubmit={async (event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          const response = await fetch("/api/verification", { method: "POST", body: form });
          const data = (await response.json()) as { error?: string };
          setMessage(response.ok ? "The document is in the review queue. Redact anything a reviewer does not need." : data.error || "Upload failed.");
        }}
      >
        <h2>Document</h2>
        <p>JPEG, PNG, or PDF, up to 5 MB. An ID without enrollment dates cannot be approved.</p>
        <input name="file" type="file" accept="image/jpeg,image/png,application/pdf" required />
        <div className="toolbar">
          <button className="btn" type="submit">
            Upload
          </button>
        </div>
      </form>
      <form
        className="card"
        onSubmit={async (event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          const response = await fetch("/api/verification", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              institution: form.get("institution"),
              email: form.get("email"),
              start: form.get("start"),
              end: form.get("end"),
            }),
          });
          const data = (await response.json()) as { error?: string };
          setMessage(response.ok ? "The attestation is waiting for a reviewer. It is not an approval." : data.error || "The attestation was not saved.");
        }}
      >
        <h2>Enrollment attestation</h2>
        <p>Use this if you cannot upload a document. A reviewer still has to accept it.</p>
        <label className="field">
          School
          <input name="institution" required />
        </label>
        <label className="field">
          School email
          <input name="email" type="email" required />
        </label>
        <label className="field">
          Term starts
          <input name="start" type="date" required />
        </label>
        <label className="field">
          Term ends
          <input name="end" type="date" required />
        </label>
        <button className="btn" type="submit">
          Submit for review
        </button>
      </form>
      {message ? <p className="banner">{message}</p> : null}
    </div>
  );
}

export function MfaPanel() {
  const [otpauth, setOtpauth] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  return (
    <section className="card">
      <h2>Authenticator</h2>
      <p>Reviewers need an authenticator before they can open a verification file. This is a code from an app, not a face scan and not a government ID.</p>
      <button
        type="button"
        className="btn-quiet"
        onClick={async () => {
          const response = await fetch("/api/mfa", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ action: "begin" }),
          });
          const data = (await response.json()) as { otpauth?: string; error?: string };
          if (data.otpauth) setOtpauth(data.otpauth);
          else setMessage(data.error || "Setup did not start.");
        }}
      >
        Start setup
      </button>
      {otpauth ? (
        <p>
          Add this address to an authenticator app: <code>{otpauth}</code>
        </p>
      ) : null}
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          const response = await fetch("/api/mfa", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ action: "confirm", code }),
          });
          const data = (await response.json()) as { error?: string };
          setMessage(response.ok ? "Authenticator confirmed for this session." : data.error || "That code was not accepted.");
        }}
      >
        <label className="field">
          Six-digit code
          <input value={code} onChange={(event) => setCode(event.target.value)} inputMode="numeric" pattern="[0-9]{6}" required />
        </label>
        <button className="btn" type="submit">
          Confirm
        </button>
      </form>
      {message ? <p>{message}</p> : null}
    </section>
  );
}

export function EducatorPanel() {
  const [message, setMessage] = useState("");
  const [rooms, setRooms] = useState<{ id: string; name: string; code: string; enrollments: number; assignments: { title: string; href: string }[] }[]>([]);
  async function load() {
    const response = await fetch("/api/educators");
    if (!response.ok) {
      setMessage("Sign in to use classrooms.");
      return;
    }
    const data = (await response.json()) as { classrooms: typeof rooms };
    setRooms(data.classrooms);
  }
  return (
    <section className="card">
      <h2>Classrooms</h2>
      <button type="button" className="btn-quiet" onClick={() => void load()}>
        Refresh
      </button>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          const response = await fetch("/api/educators", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ action: "create", name: form.get("name") }),
          });
          const data = (await response.json()) as { error?: string; room?: { code: string } };
          setMessage(data.room ? `Classroom code ${data.room.code}` : data.error || "The classroom was not created.");
          await load();
        }}
      >
        <label className="field">
          New classroom
          <input name="name" required />
        </label>
        <button className="btn" type="submit">
          Create
        </button>
      </form>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          const response = await fetch("/api/educators", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ action: "join", code: form.get("code") }),
          });
          const data = (await response.json()) as { error?: string };
          setMessage(response.ok ? "Joined." : data.error || "That code did not match.");
          await load();
        }}
      >
        <label className="field">
          Join with a code
          <input name="code" required />
        </label>
        <button className="btn-quiet" type="submit">
          Join
        </button>
      </form>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          const response = await fetch("/api/educators", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              action: "assign",
              classroomId: form.get("classroomId"),
              title: form.get("title"),
              href: form.get("href"),
              dueOn: form.get("dueOn"),
            }),
          });
          const data = (await response.json()) as { error?: string };
          setMessage(response.ok ? "Assignment saved." : data.error || "The assignment was not saved.");
          await load();
        }}
      >
        <label className="field">
          Classroom id
          <input name="classroomId" required />
        </label>
        <label className="field">
          Assignment title
          <input name="title" required />
        </label>
        <label className="field">
          Lung Learn path
          <input name="href" placeholder="/academy/foundations/what-respiratory-therapy-studies" required />
        </label>
        <label className="field">
          Due date
          <input name="dueOn" type="date" />
        </label>
        <button className="btn" type="submit">
          Assign
        </button>
      </form>
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>
            {room.name} · code {room.code} · {room.enrollments} people · id {room.id}
            <ul>
              {room.assignments.map((assignment) => (
                <li key={assignment.href}>
                  {assignment.title} ({assignment.href})
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      {message ? <p>{message}</p> : null}
    </section>
  );
}

export function InquiryForm() {
  const [message, setMessage] = useState("");
  return (
    <form
      className="card"
      onSubmit={async (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const response = await fetch("/api/educators", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            action: "inquiry",
            organization: form.get("organization"),
            email: form.get("email"),
            seats: form.get("seats"),
            note: form.get("note"),
          }),
        });
        setMessage(response.ok ? "The inquiry is saved. It is not a quote and it does not start a subscription." : "The inquiry was not saved.");
      }}
    >
      <h2>Institutional licensing</h2>
      <p>Pricing is arranged per organization. There is no self-serve institutional checkout.</p>
      <label className="field">
        Organization
        <input name="organization" required />
      </label>
      <label className="field">
        Email
        <input name="email" type="email" required />
      </label>
      <label className="field">
        Seats
        <input name="seats" type="number" min={1} defaultValue={25} />
      </label>
      <label className="field">
        Note
        <textarea name="note" />
      </label>
      <button className="btn" type="submit">
        Send inquiry
      </button>
      {message ? <p>{message}</p> : null}
    </form>
  );
}

export function TutorBox() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [passages, setPassages] = useState<{ title: string; href: string }[]>([]);
  return (
    <form
      className="card"
      onSubmit={async (event) => {
        event.preventDefault();
        const response = await fetch("/api/tutor", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ question }),
        });
        const data = (await response.json()) as { answer?: string; error?: string; passages?: { title: string; href: string }[] };
        setAnswer(data.answer || data.error || "No response.");
        setPassages(data.passages ?? []);
      }}
    >
      <label className="field">
        Question
        <textarea value={question} onChange={(event) => setQuestion(event.target.value)} required minLength={8} />
      </label>
      <button className="btn" type="submit">
        Ask
      </button>
      {answer ? <p>{answer}</p> : null}
      <ul>
        {passages.map((passage) => (
          <li key={passage.href}>
            <a href={passage.href}>{passage.title}</a>
          </li>
        ))}
      </ul>
    </form>
  );
}

export function SignOutButton() {
  return (
    <button
      type="button"
      className="btn-quiet"
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/";
      }}
    >
      Sign out
    </button>
  );
}
