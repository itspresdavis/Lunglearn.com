import type { Metadata } from "next";
import Link from "next/link";
import { articles, specialties } from "@/content/career";
import { statisticReleases, money } from "@/content/statistics";

export const metadata: Metadata = {
  title: "Explore respiratory therapy",
  description: "What respiratory therapists do, how people enter the profession, and what the U.S. Bureau of Labor Statistics reports.",
};

export default function ExplorePage() {
  const handbook = statisticReleases[0];
  return (
    <section className="section wrap">
      <p className="kicker">Free</p>
      <h1>Explore the career</h1>
      <p className="lede">A public introduction to respiratory therapy. Figures are national estimates. They are not a promise of a job, a wage, or a license.</p>
      <div className="grid grid-3">
        {handbook.statistics.slice(0, 6).map((item) => (
          <article key={item.id} className="card">
            <h2>{item.label}</h2>
            <p className="stat">{item.unit.startsWith("USD") ? money(item.value) : Number(item.value).toLocaleString("en-US")}</p>
            <p className="muted">{item.period} · {item.geography}</p>
          </article>
        ))}
      </div>
      <h2>Guides</h2>
      <ul className="rows notes">
        {articles.map((article) => (
          <li key={article.slug}>
            <Link href={`/explore/${article.slug}`}>
              <span className="row-title">{article.title}</span>
              <span className="row-meta">{article.description}</span>
            </Link>
          </li>
        ))}
      </ul>
      <h2>Practice settings</h2>
      <ul className="rows">
        {specialties.map((article) => (
          <li key={article.slug}>
            <Link href={`/explore/specialties/${article.slug}`}>
              <span className="row-title">{article.title}</span>
            </Link>
          </li>
        ))}
      </ul>
      <p>
        Source: <a href={handbook.url}>{handbook.publisher}</a>. Verified {handbook.verifiedOn} ({handbook.verificationTimezone}).
      </p>
    </section>
  );
}
