import type { Metadata } from "next";
import Link from "next/link";
import { medications } from "@/content/medications";

export const metadata: Metadata = { title: "Pharmacology", robots: { index: false, follow: true } };

export default function PharmacologyPage() {
  return (
    <section className="section wrap">
      <p className="kicker">Reference</p>
      <h1>Pharmacology</h1>
      <p className="lede">{medications.length} monographs. Doses are omitted. A class and a mechanism are not a prescription.</p>
      <ul>
        {medications.map((medication) => (
          <li key={medication.slug}>
            <Link href={`/pharmacology/${medication.slug}`}>{medication.generic}</Link>
            <span className="muted"> · {medication.className}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
