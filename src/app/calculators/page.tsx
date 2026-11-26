import type { Metadata } from "next";
import Link from "next/link";
import { calculators } from "@/content/tools";
import { calculatorIsFree } from "@/lib/entitlements";

export const metadata: Metadata = {
  title: "Respiratory therapy formulas",
  description: "Educational respiratory and hemodynamic calculators with formulas, units, limits, and references.",
};

export default function CalculatorsPage() {
  return (
    <section className="section wrap">
      <p className="kicker">Tools</p>
      <h1>Calculators</h1>
      <p className="lede">{calculators.length} educational calculators. Each one shows its formula and refuses to write an order.</p>
      <ul className="rows">
        {calculators.map((calculator) => (
          <li key={calculator.slug}>
            <Link href={`/calculators/${calculator.slug}`}>
              <span className="row-title">{calculator.title}</span>
              <span className="row-meta">{calculatorIsFree(calculator.slug) ? "Free" : "Individual library"}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
