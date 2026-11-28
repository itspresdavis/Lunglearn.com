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
  const shelves: { title: string; items: [string, string, string][] }[] = [
    {
      title: "Study",
      items: [
        ["/atlas", "Atlas", String(counts.anatomyMeshes)],
        ["/academy", "Academy", String(counts.lessons)],
        ["/diseases", "Diseases", String(counts.diseases)],
        ["/pharmacology", "Pharmacology", String(counts.medications)],
      ],
    },
    {
      title: "Practice",
      items: [
        ["/shift", "On shift", "8"],
        ["/calculators", "Calculators", String(counts.calculators)],
        ["/board-prep", "Board prep", String(counts.questions)],
        ["/simulations", "Simulations", String(counts.simulations)],
        ["/reference", "Reference", String(counts.referenceArticles)],
      ],
    },
    {
      title: "Career",
      items: [
        ["/explore", "Explore", String(counts.careerArticles)],
        ["/schools", "Schools", String(counts.schools)],
        ["/study", "Study desk", String(counts.flashcardSeeds)],
        ["/educators", "Educators", String(counts.lessons)],
        ["/pricing", "Pricing", ""],
      ],
    },
  ];
  return (
    <>
      <section className="wrap home">
        <header className="home-intro">
          <h1>Where do you want to start?</h1>
            <p>Study, practice, and career. Those three choices stay at the top of every page.</p>
          <p className="actions">
            <Link className="btn" href="/learn">Continue learning</Link>
            <Link className="btn-quiet" href="/atlas">Open the atlas</Link>
          </p>
        </header>
        <div className="home-map">
          {shelves.map((shelf) => (
            <section key={shelf.title}>
              <h2>{shelf.title}</h2>
              <ul>
                {shelf.items.map(([href, title, count]) => (
                  <li key={href}>
                    <Link href={href}>
                      <span>{title}</span>
                      {count ? <span className="count">{count}</span> : null}
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
