import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticle, specialties } from "@/content/career";
import { Blocks, EditorialNote, References } from "@/components/prose";

type Params = { slug: string };

export function generateStaticParams() {
  return specialties.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const article = specialties.find((item) => item.slug === slug);
  if (!article) return {};
  return { title: article.title, description: article.description };
}

export default async function SpecialtyPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const article = specialties.find((item) => item.slug === slug);
  if (!article) notFound();
  return (
    <article className="section wrap reading">
      <p className="kicker">Specialty</p>
      <h1>{article.title}</h1>
      <EditorialNote editorial={article.editorial} />
      <Blocks blocks={article.blocks} />
      <ul>
        {article.related.map((item) => {
          const related = getArticle(item);
          if (!related) return null;
          const href = related.kicker === "Specialty" ? `/explore/specialties/${related.slug}` : `/explore/${related.slug}`;
          return (
            <li key={item}>
              <Link href={href}>{related.title}</Link>
            </li>
          );
        })}
      </ul>
      <References references={article.references} />
    </article>
  );
}
