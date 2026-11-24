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
      <form className="search" action="/search">
        <input name="q" defaultValue={q} aria-label="Search" />
        <button type="submit">Search</button>
      </form>
      <p className="muted">{q ? `${hits.length} matches` : "Enter a structure, disease, drug, lesson, or formula."}</p>
      <ul>
        {hits.map((hit) => (
          <li key={hit.id}>
            <Link href={hit.href}>{hit.title}</Link>
            <span className="muted"> · {hit.type} · {hit.access}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
