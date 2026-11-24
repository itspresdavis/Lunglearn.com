"use client";

import { useState } from "react";

export function ReviewDecision({ id }: { id: string }) {
  const [message, setMessage] = useState("");
  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const response = await fetch("/api/admin/verification", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            verificationId: id,
            decision: form.get("decision"),
            enrollmentStart: form.get("start"),
            enrollmentEnd: form.get("end"),
            evidenceHasDates: form.get("dates") === "on",
          }),
        });
        const data = (await response.json()) as { error?: string };
        setMessage(response.ok ? "Decision saved." : data.error || "The decision was not saved.");
      }}
    >
      <label>
        <input type="checkbox" name="dates" /> Evidence shows enrollment dates
      </label>
      <label className="field">
        Start
        <input type="date" name="start" />
      </label>
      <label className="field">
        End
        <input type="date" name="end" />
      </label>
      <div className="toolbar">
        <button className="btn" name="decision" value="approved" type="submit">
          Approve
        </button>
        <button className="btn-quiet" name="decision" value="rejected" type="submit">
          Reject
        </button>
      </div>
      {message ? <p>{message}</p> : null}
    </form>
  );
}

export function FileLink({ id }: { id: string }) {
  const [message, setMessage] = useState("");
  return (
    <button
      type="button"
      className="btn-quiet"
      onClick={async () => {
        const response = await fetch("/api/verification/file", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ verificationId: id }),
        });
        const data = (await response.json()) as { url?: string; error?: string };
        if (data.url) window.open(data.url, "_blank", "noopener");
        else setMessage(data.error || "The file link was not issued.");
      }}
    >
      {message || "Open file for one minute"}
    </button>
  );
}

export function ResolveReport({ id }: { id: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="btn-quiet"
      onClick={async () => {
        const response = await fetch("/api/admin/report", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ id }),
        });
        if (response.ok) setDone(true);
      }}
    >
      {done ? "Resolved" : "Resolve"}
    </button>
  );
}

export function ExpenseForm() {
  const [message, setMessage] = useState("");
  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const response = await fetch("/api/admin/expense", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            category: form.get("category"),
            cents: Number(form.get("cents")),
            note: form.get("note"),
            actual: form.get("actual") === "on",
          }),
        });
        setMessage(response.ok ? "Expense saved." : "The expense was not saved.");
      }}
    >
      <label className="field">
        Category
        <input name="category" required />
      </label>
      <label className="field">
        Cents
        <input name="cents" type="number" required />
      </label>
      <label className="field">
        Note
        <input name="note" />
      </label>
      <label>
        <input type="checkbox" name="actual" /> This figure is an actual invoice, not a projection
      </label>
      <button className="btn" type="submit">
        Save expense
      </button>
      {message ? <p>{message}</p> : null}
    </form>
  );
}
