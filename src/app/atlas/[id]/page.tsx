import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AtlasViewer } from "@/components/atlas-viewer";
import { AlveolusSchematic } from "@/components/diagrams";
import { BookmarkButton, FlashcardButton } from "@/components/interactive";
import { EditorialNote, Locked, References } from "@/components/prose";
import { anatomyRecords, getAnatomy } from "@/content/anatomy";
import { canAccess, FREE_ANATOMY_MONOGRAPHS } from "@/lib/entitlements";
import { isIndexable } from "@/lib/editorial";
import { currentSession } from "@/lib/session";

type Params = { id: string };

export function generateStaticParams() {
  return anatomyRecords.filter((record) => FREE_ANATOMY_MONOGRAPHS.has(record.id)).map((record) => ({ id: record.id }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params;
  const record = getAnatomy(id);
  if (!record) return {};
  return {
    title: record.name,
    description: record.location,
    robots: isIndexable(record) ? undefined : { index: false, follow: true },
  };
}

export default async function AnatomyPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const record = getAnatomy(id);
  if (!record) notFound();
  const session = await currentSession();
  const free = FREE_ANATOMY_MONOGRAPHS.has(record.id);
  if (!free && !canAccess(session?.entitlement ?? "free", "premium")) return <section className="section wrap"><Locked title={record.name} /></section>;
  const fields: [string, string | null][] = [
    ["Location", record.location],
    ["Composition", record.composition],
    ["Function", record.function],
    ["Arterial supply", record.arterial],
    ["Venous drainage", record.venous],
    ["Innervation", record.innervation],
    ["Lymphatic drainage", record.lymphatic],
    ["Clinical significance", record.clinical],
    ["Respiratory therapy relevance", record.respiratoryRelevance],
  ];
  return (
    <article className="section wrap reading">
      <p className="kicker">{record.system}</p>
      <h1>{record.name}</h1>
      <EditorialNote editorial={record.editorial} />
      <p className="meta">
        {record.latin ? <span>Latin: {record.latin}</span> : null}
        {record.fma ? <span>{record.fma}</span> : null}
        {record.uberon ? <span>{record.uberon}</span> : null}
        <span>{record.sex === "male" ? "Adult male mesh" : "No sex-specific mesh"}</span>
      </p>
      <BookmarkButton href={`/atlas/${record.id}`} title={record.name} />
      <FlashcardButton front={record.name} back={record.location} sourceHref={`/atlas/${record.id}`} />
      {record.mesh ? <AtlasViewer highlight={record.mesh} /> : <p className="banner">{record.geometryNote}</p>}
      {record.id === "text-alveolus" ? <AlveolusSchematic /> : null}
      {record.synonyms.length ? <p>Also called: {record.synonyms.join(", ")}.</p> : null}
      {fields.map(([label, value]) => (value ? <section key={label}><h2>{label}</h2><p>{value}</p></section> : null))}
      {record.relationships.length ? (
        <section>
          <h2>Relationships</h2>
          <ul>{record.relationships.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
      ) : null}
      {record.related.length ? (
        <section>
          <h2>Related structures</h2>
          <ul>
            {record.related.map((item) => {
              const related = getAnatomy(item);
              return <li key={item}>{related ? <Link href={`/atlas/${related.id}`}>{related.name}</Link> : item}</li>;
            })}
          </ul>
        </section>
      ) : null}
      {record.diseases.length ? (
        <section>
          <h2>Related diseases</h2>
          <ul>{record.diseases.map((item) => <li key={item}><Link href={`/diseases/${item}`}>{item}</Link></li>)}</ul>
        </section>
      ) : null}
      <p className="muted">{record.geometryNote}</p>
      <References references={record.references} />
    </article>
  );
}
