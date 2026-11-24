import type { Metadata } from "next";
import { TutorBox } from "@/components/account-panels";

export const metadata: Metadata = { title: "Tutor", robots: { index: false, follow: false } };

export default function TutorPage() {
  return (
    <section className="section wrap">
      <h1>Tutor</h1>
      <p>Without an external model configured, the tutor returns matching Lung Learn records and does not invent an answer. It never receives verification documents. It will not write a patient order.</p>
      <TutorBox />
    </section>
  );
}
