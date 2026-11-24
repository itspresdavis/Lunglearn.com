import type { Metadata } from "next";
import Link from "next/link";
import { SignOutButton } from "@/components/account-panels";
import { CompleteLessonButton } from "@/components/interactive";
import { lessons } from "@/content/curriculum";
import { currentSession } from "@/lib/session";
import { getStore } from "@/server/store";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "My learning", robots: { index: false, follow: false } };

export default async function LearnPage() {
  const session = await currentSession();
  if (!session) {
    return (
      <section className="section wrap">
        <h1>My learning</h1>
        <p>
          <Link href="/sign-in">Sign in</Link> or <Link href="/sign-up">create an account</Link>.
        </p>
      </section>
    );
  }
  const progress = getStore().progressFor(session.user.id);
  const done = new Set(progress.map((item) => item.lessonSlug));
  return (
    <section className="section wrap">
      <h1>My learning</h1>
      <p>
        {session.user.email} · {session.entitlement === "individual_premium" ? "Individual library" : session.entitlement === "institutional" ? "Institutional" : "Free"}
      </p>
      <SignOutButton />
      <p>
        <Link href="/account/billing">Billing</Link> · <Link href="/account/verification">Verification</Link> · <Link href="/study">Study desk</Link>
      </p>
      <h2>Lessons</h2>
      <ul>
        {lessons.map((lesson) => {
          const key = `${lesson.course}/${lesson.slug}`;
          return (
            <li key={key}>
              <Link href={`/academy/${lesson.course}/${lesson.slug}`}>{lesson.title}</Link>
              {done.has(key) ? " · completed" : ""} <CompleteLessonButton slug={key} />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
