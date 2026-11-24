import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExamRunner } from "@/components/interactive";
import { Locked } from "@/components/prose";
import { getQuestion, practiceForms } from "@/content/questions";
import { canAccess } from "@/lib/entitlements";
import { currentSession } from "@/lib/session";

type Params = { id: string };

export function generateStaticParams() {
  return practiceForms.filter((form) => form.access === "free").map((form) => ({ id: form.id }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params;
  const form = practiceForms.find((item) => item.id === id);
  if (!form) return {};
  return { title: form.title, robots: { index: false, follow: false } };
}

export default async function FormPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const form = practiceForms.find((item) => item.id === id);
  if (!form) notFound();
  const session = await currentSession();
  if (!canAccess(session?.entitlement ?? "free", form.access)) {
    return <section className="section wrap"><Locked title={form.title} /></section>;
  }
  const items = form.questionIds.map((questionId) => getQuestion(questionId)).filter((item) => item !== undefined);
  return (
    <section className="section wrap">
      <h1>{form.title}</h1>
      <ExamRunner title={form.title} minutes={form.minutes} items={items} note={form.note} />
    </section>
  );
}
