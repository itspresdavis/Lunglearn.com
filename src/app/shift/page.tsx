import type { Metadata } from "next";
import Link from "next/link";
import { EditorialNote } from "@/components/prose";
import { shiftSituations, shiftTools } from "@/content/shift";
import { simulations } from "@/content/simulation-cases";
import { calculators } from "@/content/tools";
import { calculatorIsFree } from "@/lib/entitlements";
import type { EditorialRecord } from "@/lib/editorial";

const editorial: EditorialRecord = {
  status: "clinical_review_required",
  version: 1,
  contentClass: "clinical_education",
  author: "Lung Learn editorial desk",
  reviewer: null,
  reviewedOn: null,
  publishedOn: null,
  corrections: [],
};

export const metadata: Metadata = {
  title: "On shift",
  description: "The calculations and checks a respiratory therapist reaches for during a shift. Not a protocol and not an order.",
  robots: { index: false, follow: true },
};

export default function ShiftPage() {
  return (
    <section className="section wrap">
      <p className="kicker">Practice</p>
      <h1>On shift</h1>
      <p className="lede">
        Eight calculations, then three situations that say what to look at. The hospital protocol and the clinician responsible for the person outrank this page.
      </p>
      <EditorialNote editorial={editorial} />
      <h2>Numbers</h2>
      <ul className="rows notes">
        {shiftTools.map((tool) => {
          const calculator = calculators.find((item) => item.slug === tool.slug);
          return (
            <li key={tool.slug}>
              <Link href={`/calculators/${tool.slug}`}>
                <span className="row-title">{calculator?.title ?? tool.slug}</span>
                <span className="row-excerpt">{tool.why}</span>
                <span className="row-meta">{calculatorIsFree(tool.slug) ? "Free" : "Individual library"}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <h2>Situations</h2>
      {shiftSituations.map((situation) => {
        const simulation = simulations.find((item) => item.id === situation.simulation);
        return (
          <section key={situation.title}>
            <h3>{situation.title}</h3>
            <ul>
              {situation.checks.map((check) => <li key={check}>{check}</li>)}
            </ul>
            <ul className="rows">
              {simulation ? (
                <li>
                  <Link href={`/simulations/${simulation.id}`}>
                    <span className="row-title">{simulation.title}</span>
                    <span className="row-meta">Practice the case</span>
                  </Link>
                </li>
              ) : null}
              {situation.calculators.map((slug) => {
                const calculator = calculators.find((item) => item.slug === slug);
                return (
                  <li key={slug}>
                    <Link href={`/calculators/${slug}`}>
                      <span className="row-title">{calculator?.title ?? slug}</span>
                      <span className="row-meta">Calculator</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </section>
  );
}
