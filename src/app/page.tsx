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
  const shelves: { title: string; items: [string, string, string, string][] }[] = [
    {
      title: "Study",
      items: [
        ["/atlas", "Anatomy atlas", String(counts.anatomyMeshes), "Adult male thoracic meshes you can select. A female model is not made by recoloring the male file."],
        ["/academy", "Respiratory academy", String(counts.lessons), "Lessons with objectives and checks. Clinical drafts stay unpublished until a named reviewer accepts them."],
        ["/diseases", "Disease library", String(counts.diseases), "Cardiopulmonary entries written as teaching patterns, not as a description of every patient."],
        ["/pharmacology", "Pharmacology", String(counts.medications), "Medication monographs. Doses are omitted."],
      ],
    },
    {
      title: "Practice",
      items: [
        ["/reference", "Clinical reference", String(counts.referenceArticles), "Short references for people who already practice. No continuing-education credit is claimed."],
        ["/simulations", "Simulations", String(counts.simulations), "Fictional cases with authored decisions. The engine does not predict a real outcome."],
        ["/board-prep", "Board preparation", String(counts.questions), "Original questions aligned to the published NBRC outline. Lung Learn is not an NBRC product."],
        ["/calculators", "Calculators", String(counts.calculators), "Educational formulas with units, limits, and references. A result is not an order."],
      ],
    },
    {
      title: "Career",
      items: [
        ["/explore", "Explore the career", String(counts.careerArticles), "What the work is, how people enter it, and what the Bureau of Labor Statistics reports."],
        ["/schools", "Find a school", String(counts.schools), "Programs checked on the institution’s own site. CoARC’s directory is not republished here."],
        ["/study", "Study desk", String(counts.flashcardSeeds), "Notes, bookmarks, and spaced-repetition cards kept with the account."],
        ["/educators", "Educators", String(counts.lessons), "Classrooms and lesson outlines. The outlines are drafts, not an accredited curriculum."],
      ],
    },
  ];
  return (
    <>
      <section className="wrap home">
        <header className="home-intro">
          <h1>Where do you want to start?</h1>
            <p>The atlas, the lessons, and the formulas live in one library. Clinical lessons stay in draft until a named reviewer accepts them.</p>
          <p className="actions">
            <Link className="btn" href="/learn">Continue learning</Link>
            <Link className="btn-quiet" href="/atlas">Open the atlas</Link>
          </p>
        </header>
        <div className="catalog-index">
          {shelves.map((shelf) => (
            <section key={shelf.title}>
              <h2>{shelf.title}</h2>
              <ul>
                {shelf.items.map(([href, title, count, note]) => (
                  <li key={href}>
                    <Link href={href}>
                      <span>{title}</span>
                      <span className="count">{count}</span>
                      <span className="note">{note}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <p className="source wage-line">
          Median U.S. wage {wage ? money(wage.value) : "—"}
          {hourly ? `, ${money(hourly.value)} an hour` : ""}.{" "}
          {jobs ? `${Number(jobs.value).toLocaleString("en-US")} jobs, ` : ""}
          {growth ? `with ${growth.value}% projected growth from 2025 to 2035. ` : ""}
          <Link href="/explore/respiratory-therapist-salary">Bureau of Labor Statistics</Link>
        </p>
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
