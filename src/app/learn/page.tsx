import type { Metadata } from "next";
import Link from "next/link";
import { SignOutButton } from "@/components/account-panels";
import { coursePlace, getCourse, getLesson, lessons } from "@/content/curriculum";
import { topicStudyLinks } from "@/lib/study-links";
import { currentSession } from "@/lib/session";
import { getStore } from "@/server/store";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "My learning", robots: { index: false, follow: false } };

export default async function LearnPage() {
  const session = await currentSession();
  if (!session) {
    return (
      <section className="section wrap narrow">
        <h1>My learning</h1>
        <p>Sign in to keep your place, notes, and cards.</p>
        <p className="actions">
          <Link className="btn" href="/sign-in">Sign in</Link>
          <Link className="btn-quiet" href="/sign-up">Create an account</Link>
        </p>
      </section>
    );
  }
  const store = getStore();
  const progress = store.progressFor(session.user.id);
  const done = new Set(progress.map((item) => item.lessonSlug));
  const next = lessons.find((lesson) => !done.has(`${lesson.course}/${lesson.slug}`));
  const today = new Date().toISOString().slice(0, 10);
  const due = store.flashcardsFor(session.user.id).filter((card) => card.dueOn <= today);
  const miss = store.latestMiss(session.user.id);
  const missLink = miss ? topicStudyLinks[miss.topic] : undefined;
  const missLesson = missLink ? getLesson(missLink.course, missLink.slug) : undefined;
  const plan = session.entitlement === "individual_premium" ? "Individual library" : session.entitlement === "institutional" ? "Institutional" : "Free";
  return (
    <section className="section wrap">
      <h1>My learning</h1>
      <p className="muted">{session.user.email} · {plan}</p>
      <ul className="rows">
        <li>
          {next ? (
            <Link href={`/academy/${next.course}/${next.slug}`}>
              <span className="row-title">Continue</span>
              <span className="row-meta">{next.title}</span>
            </Link>
          ) : (
            <Link href="/academy">
              <span className="row-title">Lessons</span>
              <span className="row-meta">Every lesson on your list is marked complete</span>
            </Link>
          )}
        </li>
        <li>
          <Link href="/study">
            <span className="row-title">{due.length === 0 ? "No cards are due" : due.length === 1 ? "1 card is due" : `${due.length} cards are due`}</span>
            <span className="row-meta">Study desk</span>
          </Link>
        </li>
        <li>
          {missLesson ? (
            <Link href={`/academy/${missLesson.course}/${missLesson.slug}`}>
              <span className="row-title">Last miss: {miss?.topic}</span>
              <span className="row-meta">{missLesson.title}</span>
            </Link>
          ) : (
            <Link href="/board-prep">
              <span className="row-title">No missed practice item yet</span>
              <span className="row-meta">Board prep</span>
            </Link>
          )}
        </li>
      </ul>
      <ul className="rows">
        {lessons.map((lesson) => {
          const key = `${lesson.course}/${lesson.slug}`;
          const place = coursePlace(lesson);
          return (
            <li key={key}>
              <Link href={`/academy/${lesson.course}/${lesson.slug}`}>
                <span className="row-title">{lesson.title}</span>
                <span className="row-meta">
                  {getCourse(lesson.course)?.title} · {place.index + 1} of {place.total} · {done.has(key) ? "Done" : "Not started"}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="muted">
        <Link href="/study">Study desk</Link> · <Link href="/account/billing">Billing</Link> · <Link href="/account/verification">Verification</Link>
      </p>
      <SignOutButton />
    </section>
  );
}
