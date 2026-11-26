import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QuestionPractice } from "@/components/interactive";
import { EditorialNote, Locked, References } from "@/components/prose";
import { getQuestion, questions } from "@/content/questions";
import { canAccess } from "@/lib/entitlements";
import { currentSession } from "@/lib/session";

type Params = { id: string };

export function generateStaticParams() {
  return questions.filter((question) => question.access === "free").map((question) => ({ id: question.id }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params;
  const question = getQuestion(id);
  if (!question) return {};
  return { title: question.topic, robots: { index: false, follow: true } };
}

export default async function QuestionPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const question = getQuestion(id);
  if (!question) notFound();
  const session = await currentSession();
  if (!canAccess(session?.entitlement ?? "free", question.access)) {
    return <section className="section wrap"><Locked title="Practice item" /></section>;
  }
  return (
    <article className="section wrap reading">
      <p className="kicker">{question.topic}</p>
      <h1>Practice item</h1>
      <EditorialNote editorial={question.editorial} />
      <QuestionPractice item={question} />
      <References references={question.references} />
    </article>
  );
}
