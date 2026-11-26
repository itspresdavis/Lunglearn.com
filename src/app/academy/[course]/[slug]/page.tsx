import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Blocks, EditorialNote, Locked, References } from "@/components/prose";
import { BookmarkButton, CompleteLessonButton, FlashcardButton } from "@/components/interactive";
import { getAnatomy } from "@/content/anatomy";
import { getLesson, lessons } from "@/content/curriculum";
import { canAccess } from "@/lib/entitlements";
import { currentSession } from "@/lib/session";

type Params = { course: string; slug: string };

export function generateStaticParams() {
  return lessons.filter((lesson) => lesson.access === "free").map((lesson) => ({ course: lesson.course, slug: lesson.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { course, slug } = await params;
  const lesson = getLesson(course, slug);
  if (!lesson) return {};
  return { title: lesson.title, robots: { index: false, follow: true } };
}

export default async function LessonPage({ params }: { params: Promise<Params> }) {
  const { course, slug } = await params;
  const lesson = getLesson(course, slug);
  if (!lesson) notFound();
  const session = await currentSession();
  if (!canAccess(session?.entitlement ?? "free", lesson.access)) {
    return (
      <section className="section wrap">
        <Locked title={lesson.title} />
      </section>
    );
  }
  return (
    <article className="section wrap reading">
      <p className="kicker">{lesson.level}</p>
      <h1>{lesson.title}</h1>
      <EditorialNote editorial={lesson.editorial} />
      <p className="actions">
        <BookmarkButton href={`/academy/${lesson.course}/${lesson.slug}`} title={lesson.title} />
      </p>
      <h2>Objectives</h2>
      <ul>{lesson.objectives.map((item) => <li key={item}>{item}</li>)}</ul>
      <Blocks blocks={lesson.blocks} />
      <h2>Terms</h2>
      <dl>
        {lesson.terms.map((term) => (
          <div key={term.term}>
            <dt>{term.term}</dt>
            <dd>
              {term.definition} <FlashcardButton front={term.term} back={term.definition} sourceHref={`/academy/${lesson.course}/${lesson.slug}`} />
            </dd>
          </div>
        ))}
      </dl>
      <h2>Clinical notes</h2>
      <ul>{lesson.clinical.map((item) => <li key={item}>{item}</li>)}</ul>
      {lesson.example ? (
        <section>
          <h2>{lesson.example.title}</h2>
          <ol>{lesson.example.steps.map((step) => <li key={step}>{step}</li>)}</ol>
        </section>
      ) : null}
      <h2>Misconceptions</h2>
      <ul>{lesson.misconceptions.map((item) => <li key={item.myth}><strong>{item.myth}</strong> {item.correction}</li>)}</ul>
      <h2>Checks</h2>
      {lesson.checks.map((check) => (
        <details key={check.question}>
          <summary>{check.question}</summary>
          <ol>{check.choices.map((choice) => <li key={choice}>{choice}</li>)}</ol>
          <p>Key: {check.choices[check.answer]}. {check.explanation}</p>
        </details>
      ))}
      <h2>Related</h2>
      <ul className="rows">
        {lesson.anatomy.map((item) => {
          const record = getAnatomy(item);
          return (
            <li key={item}>
              <Link href={`/atlas/${item}`}>
                <span className="row-title">{record?.name ?? item}</span>
                <span className="row-meta">Anatomy</span>
              </Link>
            </li>
          );
        })}
        {lesson.related.map((item) => {
          const related = getLesson(lesson.course, item);
          return (
            <li key={item}>
              <Link href={`/academy/${lesson.course}/${item}`}>
                <span className="row-title">{related?.title ?? item}</span>
                <span className="row-meta">Lesson</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <References references={lesson.references} />
      <p className="actions">
        <CompleteLessonButton slug={`${lesson.course}/${lesson.slug}`} />
      </p>
    </article>
  );
}
