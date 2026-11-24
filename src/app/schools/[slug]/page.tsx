import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { schools } from "@/content/schools";

type Params = { slug: string };

export function generateStaticParams() {
  return schools.map((school) => ({ slug: school.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const school = schools.find((item) => item.slug === slug);
  if (!school) return {};
  return { title: `${school.institution} respiratory therapy`, description: school.program };
}

export default async function SchoolPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const school = schools.find((item) => item.slug === slug);
  if (!school) notFound();
  return (
    <article className="section wrap">
      <p className="kicker">{school.state}</p>
      <h1>{school.institution}</h1>
      <p className="lede">{school.program}</p>
      <p>{school.degreeLabel}</p>
      <p>{school.accreditationNote}</p>
      <p>Tuition: not stored. Outcomes: not stored. Last read of the program page: {school.reviewedOn}.</p>
      <p>
        <a href={school.url}>Program website</a>
      </p>
    </article>
  );
}
