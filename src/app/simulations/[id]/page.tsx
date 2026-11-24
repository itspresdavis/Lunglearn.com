import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SimulationRunner } from "@/components/interactive";
import { Locked } from "@/components/prose";
import { getSimulation, simulations } from "@/content/simulation-cases";
import { canAccess } from "@/lib/entitlements";
import { currentSession } from "@/lib/session";

type Params = { id: string };

export function generateStaticParams() {
  return simulations.filter((simulation) => simulation.access === "free").map((simulation) => ({ id: simulation.id }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params;
  const simulation = getSimulation(id);
  if (!simulation) return {};
  return { title: simulation.title, robots: { index: false, follow: true } };
}

export default async function SimulationPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const simulation = getSimulation(id);
  if (!simulation) notFound();
  const session = await currentSession();
  if (!canAccess(session?.entitlement ?? "free", simulation.access)) {
    return <section className="section wrap"><Locked title={simulation.title} /></section>;
  }
  return (
    <article className="section wrap">
      <p className="kicker">{simulation.setting}</p>
      <h1>{simulation.title}</h1>
      <h2>Assumptions</h2>
      <ul>{simulation.assumptions.map((item) => <li key={item}>{item}</li>)}</ul>
      <h2>Simplifications</h2>
      <ul>{simulation.simplifications.map((item) => <li key={item}>{item}</li>)}</ul>
      <SimulationRunner scenario={simulation} />
    </article>
  );
}
