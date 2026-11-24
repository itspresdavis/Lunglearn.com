import type { Metadata } from "next";
import Link from "next/link";
import { referenceArticles } from "@/content/tools";

export const metadata: Metadata = { title: "Clinical reference", robots: { index: false, follow: true } };

export default function ReferencePage() {
  return (
    <section className="section wrap">
      <p className="kicker">Practice</p>
      <h1>Clinical reference</h1>
      <p className="lede">Short educational references for people who already practice. Lung Learn does not claim continuing-education credit.</p>
      <ul>
        {referenceArticles.map((article) => (
          <li key={article.slug}>
            <Link href={`/reference/${article.slug}`}>{article.title}</Link>
            <span className="muted"> — {article.description}</span>
          </li>
        ))}
      </ul>
      <p>
        Equations live with the <Link href="/calculators">calculators</Link>. Medication records live in <Link href="/pharmacology">pharmacology</Link>.
      </p>
    </section>
  );
}
