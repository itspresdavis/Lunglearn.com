import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles, getArticle } from "@/content/career";
import { Blocks, EditorialNote, References } from "@/components/prose";
import { BookmarkButton } from "@/components/interactive";

type Params = { slug: string };

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  if (!article) return {};
  return { title: article.title, description: article.description };
}

export default async function CareerArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug) ?? null;
  if (!article) notFound();
  const related = article.related.map((item) => getArticle(item)).filter((item) => item !== undefined);
  return (
    <article className="section wrap reading">
      <p className="kicker">{article.kicker}</p>
      <h1>{article.title}</h1>
      <EditorialNote editorial={article.editorial} />
      <BookmarkButton href={`/explore/${article.slug}`} title={article.title} />
      <Blocks blocks={article.blocks} />
      {related.length ? (
        <section>
          <h2>Related</h2>
          <ul>
            {related.map((item) => (
              <li key={item.slug}>
                <Link href={item.kicker === "Specialty" ? `/explore/specialties/${item.slug}` : `/explore/${item.slug}`}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <References references={article.references} />
    </article>
  );
}
