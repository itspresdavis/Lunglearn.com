import type { Metadata } from "next";
import Link from "next/link";
import { EducatorPanel, InquiryForm } from "@/components/account-panels";
import { lessons } from "@/content/curriculum";

export const metadata: Metadata = { title: "Educator resources", robots: { index: false, follow: true } };

export default function EducatorsPage() {
  return (
    <section className="section wrap">
      <p className="kicker">Teaching</p>
      <h1>Educator resources</h1>
      <p className="lede">Classrooms, assignments, and {lessons.length} lesson outlines you can print. These outlines are drafts. They are not an accredited curriculum.</p>
      <p>
        <Link href="/educators/resources">Printable outlines</Link>
      </p>
      <EducatorPanel />
      <InquiryForm />
    </section>
  );
}
