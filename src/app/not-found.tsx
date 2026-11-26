import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section wrap narrow">
      <h1>That page is not in the library.</h1>
      <p>The address may be mistyped, or the record was never published.</p>
      <p className="actions">
        <Link className="btn" href="/search">Search the library</Link>
        <Link className="btn-quiet" href="/">Back home</Link>
      </p>
    </section>
  );
}
