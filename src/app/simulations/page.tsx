import type { Metadata } from "next";
import Link from "next/link";
import { simulations } from "@/content/simulation-cases";

export const metadata: Metadata = { title: "Clinical simulations", robots: { index: false, follow: true } };

export default function SimulationsPage() {
  return (
    <section className="section wrap">
      <p className="kicker">Laboratory</p>
      <h1>Clinical simulations</h1>
      <p className="lede">Fictional patients and authored decisions. The engine changes the case’s teaching values. It does not predict a real outcome.</p>
      <ul className="rows">
        {simulations.map((simulation) => (
          <li key={simulation.id}>
            <Link href={`/simulations/${simulation.id}`}>
              <span className="row-title">{simulation.title}</span>
              <span className="row-meta">{simulation.access} · {simulation.minutes} min</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
