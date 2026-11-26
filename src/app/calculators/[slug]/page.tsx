import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalculatorForm } from "@/components/interactive";
import { EditorialNote, Locked, References } from "@/components/prose";
import { calculators, getCalculator } from "@/content/tools";
import { calculatorIsFree, canAccess } from "@/lib/entitlements";
import { isIndexable } from "@/lib/editorial";
import { currentSession } from "@/lib/session";

type Params = { slug: string };

export function generateStaticParams() {
  return calculators.filter((calculator) => calculatorIsFree(calculator.slug)).map((calculator) => ({ slug: calculator.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const calculator = getCalculator(slug);
  if (!calculator) return {};
  return {
    title: calculator.title,
    description: calculator.formula,
    robots: isIndexable(calculator) ? undefined : { index: false, follow: true },
  };
}

export default async function CalculatorPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const calculator = getCalculator(slug);
  if (!calculator) notFound();
  const session = await currentSession();
  const access = calculatorIsFree(calculator.slug) ? "free" : "premium";
  if (!canAccess(session?.entitlement ?? "free", access)) {
    return <section className="section wrap"><Locked title={calculator.title} /></section>;
  }
  return (
    <article className="section wrap reading">
      <p className="kicker">Educational calculator</p>
      <h1>{calculator.title}</h1>
      <EditorialNote editorial={calculator.editorial} />
      <h2>Formula</h2>
      <p>{calculator.formula}</p>
      <p>Result unit: {calculator.unit}.</p>
      <h2>Worked example</h2>
      <p>{calculator.example}</p>
      <h2>Limitations</h2>
      <ul>{calculator.limitations.map((item) => <li key={item}>{item}</li>)}</ul>
      <CalculatorForm spec={calculator} />
      <References references={calculator.references} />
    </article>
  );
}
