import type { Metadata } from "next";
import Link from "next/link";
import { COARC_DIRECTORY, schools } from "@/content/schools";
import { SchoolFilters } from "@/components/school-filters";

export const metadata: Metadata = {
  title: "Respiratory therapy schools",
  description: "A short directory of respiratory therapy programs checked on each school's own website.",
};

export default function SchoolsPage() {
  return (
    <section className="section wrap">
      <p className="kicker">Free</p>
      <h1>Find a school</h1>
      <p className="lede">
        These {schools.length} programs were read on the institution’s own site. Tuition and outcomes are omitted because they were not independently verified. This is not a copy of the CoARC directory.
      </p>
      <p>
        The official accredited-program finder is <a href={COARC_DIRECTORY}>CoARC’s student search</a>. Commercial reuse of that directory requires CoARC’s written permission, which Lung Learn has not requested.
      </p>
      <SchoolFilters />
      <noscript>
        <ul>
          {schools.map((school) => (
            <li key={school.slug}>
              <Link href={`/schools/${school.slug}`}>{school.institution}</Link> — {school.state} — {school.degree}
            </li>
          ))}
        </ul>
      </noscript>
    </section>
  );
}
