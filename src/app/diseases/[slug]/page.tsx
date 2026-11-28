import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookmarkButton, FlashcardButton } from "@/components/interactive";
import { EditorialNote, References } from "@/components/prose";
import { findLesson } from "@/content/curriculum";
import { diseases, getDisease } from "@/content/diseases";
import { getAnatomy } from "@/content/anatomy";
import { getMedication } from "@/content/medications";

type Params = { slug: string };

export function generateStaticParams() {
  return diseases.map((disease) => ({ slug: disease.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const disease = getDisease(slug);
  if (!disease) return {};
  return { title: disease.title, description: disease.definition, robots: { index: false, follow: true } };
}

export default async function DiseasePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const disease = getDisease(slug);
  if (!disease) notFound();
  return (
    <article className="section wrap reading">
      <p className="kicker">{disease.categories.join(" · ")}</p>
      <h1>{disease.title}</h1>
      <EditorialNote editorial={disease.editorial} />
      <p className="actions">
        <BookmarkButton href={`/diseases/${disease.slug}`} title={disease.title} />
        <FlashcardButton front={disease.title} back={disease.definition} sourceHref={`/diseases/${disease.slug}`} />
      </p>
      <nav className="on-page" aria-label="On this page">
        <a href="#epidemiology">Epidemiology</a>
        <a href="#pathophysiology">Pathophysiology</a>
        <a href="#diagnostics">Diagnostics</a>
        <a href="#blood-gas">Blood gas</a>
        <a href="#respiratory-care">Respiratory care</a>
        <a href="#connected">Connected records</a>
      </nav>
      <p>{disease.definition}</p>
      <h2 id="epidemiology">Epidemiology</h2>
      <p>{disease.epidemiology ?? "No incidence figure is stored. A number is not invented for this page."}</p>
      <h2>Etiology</h2>
      <p>{disease.etiology}</p>
      <h2>Risk factors</h2>
      <ul>{disease.risks.map((item) => <li key={item}>{item}</li>)}</ul>
      <h2 id="pathophysiology">Pathophysiology</h2>
      <p>{disease.pathophysiology}</p>
      <h2>Signs and symptoms</h2>
      <ul>{disease.signs.map((item) => <li key={item}>{item}</li>)}</ul>
      <h2 id="diagnostics">Diagnostic principles</h2>
      <p>{disease.diagnostics}</p>
      <h2>Laboratory findings</h2>
      <p>{disease.labs}</p>
      <h2 id="blood-gas">Blood gas pattern</h2>
      <p>{disease.abg ?? "No single blood-gas pattern is claimed for this condition."}</p>
      <h2>Pulmonary function</h2>
      <p>{disease.pft ?? "No single pulmonary-function pattern is claimed for this condition."}</p>
      <h2>Imaging</h2>
      <p>{disease.imaging}</p>
      <h2>Management overview</h2>
      <p>{disease.management}</p>
      <h2 id="respiratory-care">Respiratory care considerations</h2>
      <p>{disease.respiratoryCare}</p>
      <h2>Complications</h2>
      <ul>{disease.complications.map((item) => <li key={item}>{item}</li>)}</ul>
      <h2>Prognosis</h2>
      <p>{disease.prognosis}</p>
      <h2>Differential concepts</h2>
      <ul>{disease.differential.map((item) => <li key={item}>{item}</li>)}</ul>
      <h2 id="connected">Connected records</h2>
      <ul className="rows">
        {disease.anatomy.map((item) => {
          const record = getAnatomy(item);
          if (!record) return null;
          return (
            <li key={item}>
              <Link href={`/atlas/${item}`}>
                <span className="row-title">{record.name}</span>
                <span className="row-meta">Anatomy</span>
              </Link>
            </li>
          );
        })}
        {disease.medications.map((item) => {
          const medication = getMedication(item);
          if (!medication) return null;
          return (
            <li key={item}>
              <Link href={`/pharmacology/${item}`}>
                <span className="row-title">{medication.generic}</span>
                <span className="row-meta">Pharmacology</span>
              </Link>
            </li>
          );
        })}
        {disease.lessons.map((item) => {
          const lesson = findLesson(item);
          if (!lesson) return null;
          return (
            <li key={item}>
              <Link href={`/academy/${lesson.course}/${lesson.slug}`}>
                <span className="row-title">{lesson.title}</span>
                <span className="row-meta">Lesson</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="muted">There is no diseased 3D mesh for this condition. A color change on the healthy atlas would pretend to be pathology.</p>
      <References references={disease.references} />
    </article>
  );
}
