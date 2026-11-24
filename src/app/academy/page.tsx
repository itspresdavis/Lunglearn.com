import type { Metadata } from "next";
import Link from "next/link";
import { courses, lessonsIn } from "@/content/curriculum";

export const metadata: Metadata = { title: "Respiratory academy", robots: { index: false, follow: true } };

export default function AcademyPage() {
  return (
    <section className="section wrap">
      <p className="kicker">Academy</p>
      <h1>Respiratory academy</h1>
      <p className="lede">Courses, modules, and lessons from prerequisites toward practice. Clinical lessons are readable as drafts and are not marked reviewed.</p>
      {courses.map((course) => (
        <section key={course.slug}>
          <h2>{course.title}</h2>
          <p>{course.summary}</p>
          <ul>
            {lessonsIn(course.slug).map((lesson) => (
              <li key={lesson.slug}>
                <Link href={`/academy/${course.slug}/${lesson.slug}`}>{lesson.title}</Link>
                <span className="muted"> · {lesson.level} · {lesson.minutes} min · {lesson.access}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </section>
  );
}
