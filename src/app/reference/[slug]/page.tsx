import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Blocks, EditorialNote, References } from "@/components/prose";
import { getReferenceArticle, referenceArticles } from "@/content/tools";

type Params = { slug: string };

export function generateStaticParams() {
  return referenceArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getReferenceArticle(slug);
  if (!article) return {};
  return { title: article.title, robots: { index: false, follow: true } };
}

export default async function ReferenceArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const article = getReferenceArticle(slug);
  if (!article) notFound();
  return (
    <article className="section wrap reading">
      <h1>{article.title}</h1>
      <EditorialNote editorial={article.editorial} />
      <Blocks blocks={article.blocks} />
      <References references={article.references} />
    </article>
  );
}
