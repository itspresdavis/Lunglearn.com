"use client";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <section className="section wrap">
      <h1>This page failed to render.</h1>
      <p>{error.message || "The error had no message."}</p>
      <button type="button" className="btn" onClick={() => reset()}>
        Try again
      </button>
    </section>
  );
}
