import Link from "next/link";
import { resourceCounts } from "@/lib/catalog";
import { money, statisticReleases } from "@/content/statistics";

export default function HomePage() {
  const counts = resourceCounts();
  const handbook = statisticReleases[0];
  const wage = handbook.statistics.find((item) => item.id === "median-annual");
  const hourly = handbook.statistics.find((item) => item.id === "median-hourly");
  const jobs = handbook.statistics.find((item) => item.id === "employment");
  const growth = handbook.statistics.find((item) => item.id === "growth");
  const library: [string, string, string, string][] = [
    ["/atlas", "Anatomy atlas", String(counts.anatomyMeshes), "Adult male thoracic meshes you can select. A female model is not made by recoloring the male file."],
    ["/academy", "Respiratory academy", String(counts.lessons), "Lessons with objectives and checks. Clinical drafts stay unpublished until a named reviewer accepts them."],
    ["/diseases", "Disease library", String(counts.diseases), "Cardiopulmonary entries written as teaching patterns, not as a description of every patient."],
    ["/pharmacology", "Pharmacology", String(counts.medications), "Medication monographs. Doses are omitted."],
    ["/reference", "Clinical reference", String(counts.referenceArticles), "Short references for people who already practice. No continuing-education credit is claimed."],
    ["/simulations", "Simulations", String(counts.simulations), "Fictional cases with authored decisions. The engine does not predict a real outcome."],
    ["/board-prep", "Board preparation", String(counts.questions), "Original questions aligned to the published NBRC outline. Lung Learn is not an NBRC product."],
    ["/calculators", "Calculators", String(counts.calculators), "Educational formulas with units, limits, and references. A result is not an order."],
    ["/schools", "Find a school", String(counts.schools), "Programs checked on the institution’s own site. CoARC’s directory is not republished here."],
    ["/explore", "Explore the career", String(counts.careerArticles), "What the work is, how people enter it, and what the Bureau of Labor Statistics reports."],
  ];
  return (
    <>
      <section className="wrap home">
        <header className="home-intro">
          <div>
            <h1>A library for respiratory care.</h1>
            <p>Select a structure in the thoracic atlas, read a disease or drug monograph, run a formula, or sit a practice question. Clinical lessons remain drafts until a named reviewer accepts them.</p>
          </div>
          <p className="actions">
            <Link className="btn" href="/atlas">Open the atlas</Link>
            <Link className="btn-quiet" href="/academy">Browse the academy</Link>
          </p>
        </header>
        <h2>In the library</h2>
        <ul className="catalog">
          {library.map(([href, title, count, note]) => (
            <li key={href}>
              <Link href={href}>{title}</Link>
              <span className="count">{count}</span>
              <span className="note">{note}</span>
            </li>
          ))}
        </ul>
        <h2>United States occupation figures</h2>
        <p className="source">Bureau of Labor Statistics, May 2025. National estimates, not a job offer.</p>
        <dl className="facts">
          <div>
            <dt>Median annual wage</dt>
            <dd>{wage ? money(wage.value) : "—"}</dd>
          </div>
          <div>
            <dt>Median hourly wage</dt>
            <dd>{hourly ? money(hourly.value) : "—"}</dd>
          </div>
          <div>
            <dt>Jobs</dt>
            <dd>{jobs ? Number(jobs.value).toLocaleString("en-US") : "—"}</dd>
          </div>
          <div>
            <dt>Projected growth</dt>
            <dd>{growth ? `${growth.value}%` : "—"}</dd>
            <dd className="note">2025–2035</dd>
          </div>
        </dl>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            name: "Lung Learn",
            url: "https://lunglearn.com",
            description: "A library for respiratory care.",
          }),
        }}
      />
    </>
  );
}
