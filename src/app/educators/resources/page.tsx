import type { Metadata } from "next";
import Link from "next/link";
import { lessons } from "@/content/curriculum";

export const metadata: Metadata = { title: "Teaching outlines", robots: { index: false, follow: true } };

export default function TeachingResourcesPage() {
  return (
    <section className="section wrap">
      <h1>Teaching outlines</h1>
      <p>{lessons.length} outlines, generated from the lesson records. Print from the browser. There is no separate slide deck, because none has been reviewed.</p>
      {lessons.map((lesson) => (
        <article key={lesson.slug} className="card">
          <h2>{lesson.title}</h2>
          <p>{lesson.level} · {lesson.minutes} minutes · <Link href={`/academy/${lesson.course}/${lesson.slug}`}>Open the lesson</Link></p>
          <ol>{lesson.objectives.map((objective) => <li key={objective}>{objective}</li>)}</ol>
        </article>
      ))}
    </section>
  );
}
