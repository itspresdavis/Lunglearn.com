import type { Metadata } from "next";
import Link from "next/link";
import { queryCatalog } from "@/lib/catalog";
import type { SearchHit } from "@/lib/search";

export const metadata: Metadata = { title: "Search", robots: { index: false, follow: false } };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const hits = q.trim() ? queryCatalog(q) : [];
  const groups = new Map<string, SearchHit[]>();
  for (const hit of hits) {
    const group = groups.get(hit.type) ?? [];
    group.push(hit);
    groups.set(hit.type, group);
  }
  return (
    <section className="section wrap">
      <h1>Search the library</h1>
      <form className="finder" action="/search">
        <input name="q" defaultValue={q} aria-label="Search" placeholder="Structure, disease, drug, lesson, or formula" />
        <button className="btn" type="submit">Search</button>
      </form>
      <p className="muted">
        {q
          ? hits.length
            ? `${hits.length} ${hits.length === 1 ? "record uses" : "records use"} every word.`
            : "No record in the library uses every word. Try a disease, a brand name, or a formula."
          : "Search stays inside the library. It does not query the open web."}
      </p>
      {[...groups.entries()].map(([type, group]) => (
        <section key={type}>
          <h2>{type}</h2>
          <ul className="rows notes">
            {group.map((hit) => (
              <li key={hit.id}>
                <Link href={hit.href}>
                  <span className="row-title">{hit.title}</span>
                  <span className="row-meta">{hit.access === "free" ? "Free" : "Individual library"}</span>
                  {hit.excerpt ? <span className="row-excerpt">{hit.excerpt}</span> : null}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </section>
  );
}
