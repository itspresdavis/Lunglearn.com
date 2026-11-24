import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section wrap">
      <h1>That page is not in the library.</h1>
      <p><Link href="/search">Search</Link> or return <Link href="/">home</Link>.</p>
    </section>
  );
}
