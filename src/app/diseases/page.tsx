import type { Metadata } from "next";
import Link from "next/link";
import { diseases } from "@/content/diseases";

export const metadata: Metadata = { title: "Disease library", robots: { index: false, follow: true } };

export default function DiseasesPage() {
  const systems = [...new Set(diseases.flatMap((disease) => disease.systems))];
  return (
    <section className="section wrap">
      <p className="kicker">Reference</p>
      <h1>Disease library</h1>
      <p className="lede">{diseases.length} cardiopulmonary entries. Findings are typical teaching patterns, not a description of every patient. None of these entries is clinically approved.</p>
      {systems.map((system) => (
        <section key={system}>
          <h2>{system}</h2>
          <ul>
            {diseases.filter((disease) => disease.systems.includes(system)).map((disease) => (
              <li key={disease.slug}>
                <Link href={`/diseases/${disease.slug}`}>{disease.title}</Link>
                <span className="muted"> · {disease.categories.join(", ")}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </section>
  );
}
