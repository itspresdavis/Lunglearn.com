"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Card = { id: string; front: string; back: string; dueOn: string; sourceHref: string | null };
type Desk = {
  notes: { id: string; title: string; body: string }[];
  bookmarks: { id: string; href: string; title: string }[];
  cards: Card[];
  progress: { lessonSlug: string; completedAt: string }[];
};

export function StudyDesk() {
  const [desk, setDesk] = useState<Desk | null>(null);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [goal, setGoal] = useState(10);
  const [examDate, setExamDate] = useState("");

  async function reload() {
    const response = await fetch("/api/study");
    if (!response.ok) {
      setError("Sign in to open the study desk.");
      return;
    }
    setDesk((await response.json()) as Desk);
  }

  useEffect(() => {
    const storedGoal = window.localStorage.getItem("ll-goal");
    const storedExam = window.localStorage.getItem("ll-exam");
    if (storedGoal) setGoal(Number(storedGoal) || 10);
    if (storedExam) setExamDate(storedExam);
    void reload();
  }, []);

  const due = desk?.cards.filter((card) => card.dueOn <= new Date().toISOString().slice(0, 10)) ?? [];
  const days = examDate ? Math.ceil((Date.parse(examDate) - Date.now()) / 86_400_000) : null;

  return (
    <div className="grid grid-2">
      {error ? <p className="banner">{error}</p> : null}
      <section className="card">
        <h2>Today</h2>
        <p>
          Due cards: {due.length}. Completed lessons on this account: {desk?.progress.length ?? 0}. Daily goal: {goal} minutes, stored on this browser.
        </p>
        <label className="field">
          Daily minute goal
          <input
            type="number"
            min={5}
            max={240}
            value={goal}
            onChange={(event) => {
              setGoal(Number(event.target.value));
              window.localStorage.setItem("ll-goal", event.target.value);
            }}
          />
        </label>
        <label className="field">
          Examination date, if you have one
          <input
            type="date"
            value={examDate}
            onChange={(event) => {
              setExamDate(event.target.value);
              window.localStorage.setItem("ll-exam", event.target.value);
            }}
          />
        </label>
        {days !== null && Number.isFinite(days) ? <p>{days >= 0 ? `${days} days until that date.` : "That date has passed."} A countdown is not a study plan and it is not an NBRC schedule.</p> : null}
      </section>
      <section className="card">
        <h2>Due flashcards</h2>
        {due.length === 0 ? <p>No cards are due.</p> : null}
        {due.map((card) => (
          <article key={card.id}>
            <h3>{card.front}</h3>
            <p>{card.back}</p>
            {card.sourceHref ? <p><Link href={card.sourceHref}>Source</Link></p> : null}
            <div className="toolbar">
              {[0, 3, 5].map((grade) => (
                <button
                  key={grade}
                  type="button"
                  className="btn-quiet"
                  onClick={async () => {
                    await fetch("/api/study", {
                      method: "POST",
                      headers: { "content-type": "application/json" },
                      body: JSON.stringify({ action: "review", cardId: card.id, grade }),
                    });
                    await reload();
                  }}
                >
                  {grade === 0 ? "Again" : grade === 3 ? "Good" : "Easy"}
                </button>
              ))}
            </div>
          </article>
        ))}
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            await fetch("/api/study", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ action: "card", front, back, sourceHref: null }),
            });
            setFront("");
            setBack("");
            await reload();
          }}
        >
          <label className="field">
            Front
            <input value={front} onChange={(event) => setFront(event.target.value)} required />
          </label>
          <label className="field">
            Back
            <textarea value={back} onChange={(event) => setBack(event.target.value)} required />
          </label>
          <button className="btn" type="submit">
            Add card
          </button>
        </form>
      </section>
      <section className="card">
        <h2>Notes and bookmarks</h2>
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            await fetch("/api/study", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ action: "note", title, body }),
            });
            setTitle("");
            setBody("");
            await reload();
          }}
        >
          <label className="field">
            Note title
            <input value={title} onChange={(event) => setTitle(event.target.value)} required />
          </label>
          <label className="field">
            Note
            <textarea value={body} onChange={(event) => setBody(event.target.value)} required />
          </label>
          <button className="btn" type="submit">
            Save note
          </button>
        </form>
        <ul>
          {desk?.notes.map((note) => (
            <li key={note.id}>
              <strong>{note.title}</strong>
              <div>{note.body}</div>
            </li>
          ))}
        </ul>
        <ul>
          {desk?.bookmarks.map((mark) => (
            <li key={mark.id}>
              <Link href={mark.href}>{mark.title}</Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
