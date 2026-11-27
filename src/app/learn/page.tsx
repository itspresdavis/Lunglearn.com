import type { Metadata } from "next";
import Link from "next/link";
import { SignOutButton } from "@/components/account-panels";
import { coursePlace, getCourse, lessons } from "@/content/curriculum";
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
  const progress = getStore().progressFor(session.user.id);
  const done = new Set(progress.map((item) => item.lessonSlug));
  const next = lessons.find((lesson) => !done.has(`${lesson.course}/${lesson.slug}`));
  const plan = session.entitlement === "individual_premium" ? "Individual library" : session.entitlement === "institutional" ? "Institutional" : "Free";
  return (
    <section className="section wrap">
      <h1>My learning</h1>
      <p className="muted">{session.user.email} · {plan}</p>
      {next ? (
        <p className="actions">
          <Link className="btn" href={`/academy/${next.course}/${next.slug}`}>Continue: {next.title}</Link>
        </p>
      ) : (
        <p>You have opened every lesson on your list.</p>
      )}
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
