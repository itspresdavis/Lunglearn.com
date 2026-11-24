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
  return (
    <>
      <section className="hero wrap">
        <p className="kicker">Respiratory therapy</p>
        <h1>The home of respiratory education.</h1>
        <p className="lede">Learn anatomy. Understand disease. Master respiratory care.</p>
        <p>
          <Link className="btn" href="/explore">
            Explore the career
          </Link>{" "}
          <Link className="btn-quiet" href="/atlas">
            Open the atlas
          </Link>
        </p>
      </section>
      <section className="section wrap">
        <div className="grid grid-3">
          <article className="card">
            <p className="kicker">In the library now</p>
            <p className="stat">{counts.anatomyMeshes}</p>
            <h2>Selectable thoracic structures</h2>
            <p>Adult male meshes from BodyParts3D, picked by the mesh itself. A female model is not invented from the male file.</p>
            <Link href="/atlas">Anatomy atlas</Link>
          </article>
          <article className="card">
            <p className="kicker">In the library now</p>
            <p className="stat">{counts.lessons}</p>
            <h2>Lessons under review</h2>
            <p>Objectives, notes, checks, and references. Clinical lessons stay unpublished until a named reviewer accepts them.</p>
            <Link href="/academy">Respiratory academy</Link>
          </article>
          <article className="card">
            <p className="kicker">United States, May 2025</p>
            <p className="stat">{wage ? money(wage.value) : ""}</p>
            <h2>Median annual wage</h2>
            <p>
              {hourly ? `${money(hourly.value)} an hour. ` : ""}
              {jobs ? `About ${Number(jobs.value).toLocaleString("en-US")} jobs in 2025. ` : ""}
              {growth ? `${growth.value}% projected growth, 2025–2035. ` : ""}
              These are BLS estimates, not an offer.
            </p>
            <Link href="/explore/respiratory-therapist-salary">Salary guide</Link>
          </article>
        </div>
      </section>
      <section className="section wrap">
        <h2>What is here</h2>
        <div className="grid grid-3">
          {[
            ["/diseases", "Disease library", `${counts.diseases} cardiopulmonary entries`],
            ["/pharmacology", "Pharmacology", `${counts.medications} medication monographs, no doses`],
            ["/calculators", "Calculators", `${counts.calculators} educational formulas`],
            ["/simulations", "Simulations", `${counts.simulations} fictional cases`],
            ["/board-prep", "Board preparation", `${counts.questions} original questions, ${counts.fullLengthExams} full-length exams`],
            ["/schools", "Find a school", `${counts.schools} programs checked on their own sites`],
          ].map(([href, title, text]) => (
            <article key={href} className="card">
              <h3>{title}</h3>
              <p>{text}</p>
              <Link href={href}>Open</Link>
            </article>
          ))}
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            name: "Lung Learn",
            url: "https://lunglearn.com",
            description: "The home of respiratory education.",
          }),
        }}
      />
    </>
  );
}
