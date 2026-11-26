import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EditorialNote, References } from "@/components/prose";
import { getMedication, medications } from "@/content/medications";

type Params = { slug: string };

export function generateStaticParams() {
  return medications.map((medication) => ({ slug: medication.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const medication = getMedication(slug);
  if (!medication) return {};
  return { title: medication.generic, robots: { index: false, follow: true } };
}

export default async function MedicationPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const medication = getMedication(slug);
  if (!medication) notFound();
  return (
    <article className="section wrap reading">
      <p className="kicker">{medication.className}</p>
      <h1>{medication.generic}</h1>
      <EditorialNote editorial={medication.editorial} />
      <p>Brand names people may see: {medication.brands.join(", ") || "none stored"}.</p>
      <h2>Mechanism</h2>
      <p>{medication.mechanism}</p>
      <h2>Indications</h2>
      <p>{medication.indications}</p>
      <h2>Routes</h2>
      <p>{medication.routes.join(", ")}</p>
      <h2>Adverse effects</h2>
      <ul>{medication.adverse.map((item) => <li key={item}>{item}</li>)}</ul>
      <h2>Contraindications</h2>
      <ul>{medication.contraindications.map((item) => <li key={item}>{item}</li>)}</ul>
      <h2>Interactions</h2>
      <ul>{medication.interactions.map((item) => <li key={item}>{item}</li>)}</ul>
      <h2>Monitoring</h2>
      <ul>{medication.monitoring.map((item) => <li key={item}>{item}</li>)}</ul>
      <h2>Respiratory implications</h2>
      <p>{medication.respiratory}</p>
      <p className="banner">No dose is published here. Product labeling and a prescriber’s order govern administration.</p>
      <References references={medication.references} />
    </article>
  );
}
