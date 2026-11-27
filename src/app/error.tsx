"use client";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="section wrap narrow">
      <h1>This page failed to render.</h1>
      <p>The page did not finish loading. Nothing was changed.</p>
      <button type="button" className="btn" onClick={() => reset()}>
        Try again
      </button>
    </section>
  );
}
