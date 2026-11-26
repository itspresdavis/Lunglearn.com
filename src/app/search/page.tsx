import type { Metadata } from "next";
import Link from "next/link";
import { queryCatalog } from "@/lib/catalog";

export const metadata: Metadata = { title: "Search", robots: { index: false, follow: false } };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const hits = q.trim() ? queryCatalog(q) : [];
  return (
    <section className="section wrap">
      <h1>Search the library</h1>
      <form className="finder" action="/search">
        <input name="q" defaultValue={q} aria-label="Search" placeholder="Structure, disease, drug, lesson, or formula" />
        <button className="btn" type="submit">Search</button>
      </form>
      <p className="muted">{q ? `${hits.length} ${hits.length === 1 ? "match" : "matches"}` : "Search stays inside the library. It does not query the open web."}</p>
      <ul className="rows">
        {hits.map((hit) => (
          <li key={hit.id}>
            <Link href={hit.href}>
              <span className="row-title">{hit.title}</span>
              <span className="row-meta">{hit.type} · {hit.access}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
