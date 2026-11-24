import type { Metadata } from "next";
import Link from "next/link";
import { StudyDesk } from "@/components/study-desk";

export const metadata: Metadata = { title: "Study tools", robots: { index: false, follow: false } };

export default function StudyPage() {
  return (
    <section className="section wrap">
      <p className="kicker">Study</p>
      <h1>Study tools</h1>
      <p>Flashcards use a spaced-repetition schedule stored on your account. Notes, bookmarks, and a browser-only daily goal live here. Print this page from the browser when you want a paper copy of what is loaded.</p>
      <p>
        <Link href="/study/tutor">Grounded tutor</Link> · <Link href="/atlas">Anatomy identification</Link> · <Link href="/board-prep">Custom practice</Link>
      </p>
      <StudyDesk />
    </section>
  );
}
