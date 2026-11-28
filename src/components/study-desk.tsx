"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { reviewCard, type ReviewGrade } from "@/lib/srs";

type Card = {
  id: string;
  front: string;
  back: string;
  dueOn: string;
  sourceHref: string | null;
  ease: number;
  intervalDays: number;
  repetitions: number;
};
type Desk = {
  notes: { id: string; title: string; body: string }[];
  bookmarks: { id: string; href: string; title: string }[];
  cards: Card[];
  progress: { lessonSlug: string; completedAt: string }[];
};

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function duePhrase(dueOn: string, today: string) {
  if (dueOn <= today) return "today";
  const days = Math.round((Date.parse(`${dueOn}T00:00:00.000Z`) - Date.parse(`${today}T00:00:00.000Z`)) / 86_400_000);
  if (days === 1) return "tomorrow";
  return `in ${days} days`;
}

export function StudyDesk() {
  const [desk, setDesk] = useState<Desk | null>(null);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [goal, setGoal] = useState(10);
  const [examDate, setExamDate] = useState("");
  const [queue, setQueue] = useState<Card[] | null>(null);

  async function reload() {
    const response = await fetch("/api/study");
    if (!response.ok) {
      setError("Sign in to open the study desk.");
      return;
    }
    setError("");
    setDesk((await response.json()) as Desk);
  }

  useEffect(() => {
    const storedGoal = window.localStorage.getItem("ll-goal");
    const storedExam = window.localStorage.getItem("ll-exam");
    if (storedGoal) setGoal(Number(storedGoal) || 10);
    if (storedExam) setExamDate(storedExam);
    void reload();
  }, []);

  const today = todayIso();
  const due = desk?.cards.filter((card) => card.dueOn <= today) ?? [];
  const waiting = desk?.cards.filter((card) => card.dueOn > today) ?? [];
  const nextDue = waiting.map((card) => card.dueOn).sort()[0];
  const days = examDate ? Math.ceil((Date.parse(examDate) - Date.now()) / 86_400_000) : null;

  return (
    <div className="grid grid-2">
      {error ? <p className="banner span-2">{error}</p> : null}
      <section className="card">
        <h2>Today</h2>
        <p>
          {due.length} {due.length === 1 ? "card is" : "cards are"} due. {desk?.progress.length ?? 0} lessons are marked complete. The {goal}-minute goal is a reminder stored on this browser.
        </p>
        {waiting.length ? <p className="muted">{waiting.length} more {waiting.length === 1 ? "card waits" : "cards wait"}{nextDue ? `, next on ${nextDue}` : ""}.</p> : null}
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
        {due.length && !queue ? (
          <p className="actions">
            <button type="button" className="btn" onClick={() => setQueue(due)}>
              Review {due.length} due {due.length === 1 ? "card" : "cards"}
            </button>
          </p>
        ) : null}
      </section>
      <section className="card">
        <h2>{queue ? "Review" : "Due flashcards"}</h2>
        {queue ? (
          <ReviewSession
            cards={queue}
            today={today}
            onClose={async () => {
              setQueue(null);
              await reload();
            }}
          />
        ) : due.length === 0 ? (
          <p>Nothing is due. Add terms from a lesson, or write a card below. The answer stays hidden until you ask for it.</p>
        ) : (
          <p>Start the review when you are ready. You will see the front, then the answer, then choose how soon to see it again.</p>
        )}
      </section>
      <section className="card">
        <h2>Write a card</h2>
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            const response = await fetch("/api/study", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ action: "card", front, back, sourceHref: null }),
            });
            if (!response.ok) {
              setError("The card was not saved.");
              return;
            }
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

function ReviewSession({ cards, today, onClose }: { cards: Card[]; today: string; onClose: () => Promise<void> }) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [log, setLog] = useState<{ grade: ReviewGrade; dueOn: string }[]>([]);
  const [error, setError] = useState("");
  const card = cards[index];

  if (!card) {
    const again = log.filter((entry) => entry.grade === 0).length;
    const good = log.filter((entry) => entry.grade === 3).length;
    const easy = log.filter((entry) => entry.grade === 5).length;
    const next = log.map((entry) => entry.dueOn).sort()[0];
    return (
      <div>
        <p>
          {log.length} reviewed. {again} again, {good} good, {easy} easy.
          {next ? ` The soonest of these comes back ${duePhrase(next, today)}.` : ""}
        </p>
        <p className="muted">Again brings a card back tomorrow. Good and Easy stretch the interval. This is a memory schedule, not a grade.</p>
        <button type="button" className="btn" onClick={() => void onClose()}>
          Done
        </button>
      </div>
    );
  }

  const preview = (grade: ReviewGrade) =>
    reviewCard(
      { ease: card.ease, intervalDays: card.intervalDays, repetitions: card.repetitions, dueOn: card.dueOn },
      grade,
      today,
    );

  async function grade(value: ReviewGrade) {
    const response = await fetch("/api/study", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "review", cardId: card.id, grade: value }),
    });
    const data = (await response.json().catch(() => ({}))) as { error?: string; card?: { dueOn: string } };
    if (!response.ok || !data.card) {
      setError(data.error || "The review was not saved.");
      return;
    }
    setError("");
    setLog((current) => [...current, { grade: value, dueOn: data.card?.dueOn || preview(value).dueOn }]);
    setRevealed(false);
    setIndex((current) => current + 1);
  }

  return (
    <article className="review-card">
      <p className="meta">
        <span>Card {index + 1} of {cards.length}</span>
      </p>
      <h3>{card.front}</h3>
      {revealed ? <p className="review-back">{card.back}</p> : null}
      {revealed && card.sourceHref ? <p><Link href={card.sourceHref}>Open the lesson</Link></p> : null}
      {error ? <p className="banner">{error}</p> : null}
      {revealed ? (
        <div className="toolbar">
          {([0, 3, 5] as const).map((value) => (
            <button key={value} type="button" className="btn-quiet" onClick={() => void grade(value)}>
              {value === 0 ? "Again" : value === 3 ? "Good" : "Easy"} · {duePhrase(preview(value).dueOn, today)}
            </button>
          ))}
        </div>
      ) : (
        <button type="button" className="btn" onClick={() => setRevealed(true)}>
          Show answer
        </button>
      )}
    </article>
  );
}
