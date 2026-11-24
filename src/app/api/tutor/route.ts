import { NextResponse } from "next/server";
import { queryCatalog } from "@/lib/catalog";
import { sameOrigin } from "@/lib/http";
import { currentSession } from "@/lib/session";
import { getStore } from "@/server/store";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Cross-site request rejected." }, { status: 403 });
  const session = await currentSession();
  if (!session) return NextResponse.json({ error: "Sign in to use the tutor." }, { status: 401 });
  const body = (await request.json().catch(() => null)) as { question?: string } | null;
  const question = body?.question?.trim() ?? "";
  if (question.length < 8) return NextResponse.json({ error: "Ask a longer question." }, { status: 400 });
  const store = getStore();
  if (!store.consumeRate(`tutor:${session.user.id}`, 20, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Tutor limit reached for this hour." }, { status: 429 });
  }
  const hits = queryCatalog(question).slice(0, 5);
  const passages = hits.map((hit) => ({ title: hit.title, href: hit.href, type: hit.type }));
  const endpoint = process.env.AI_TUTOR_URL;
  const key = process.env.AI_TUTOR_KEY;
  if (!endpoint || !key) {
    return NextResponse.json({
      mode: "retrieval",
      answer: "No generative tutor is configured. These are the closest Lung Learn records. Read them rather than treating this list as an answer.",
      passages,
    });
  }
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
    body: JSON.stringify({
      question: question.slice(0, 1200),
      passages,
      instruction: "Answer only from the supplied Lung Learn passages. Cite the href of each passage you use. If the passages do not answer the question, say so. Do not give a patient-specific order.",
    }),
  }).catch(() => null);
  if (!response?.ok) {
    return NextResponse.json({
      mode: "retrieval",
      answer: "The tutor service did not respond. The matching records are listed instead.",
      passages,
    });
  }
  const data = (await response.json().catch(() => null)) as { answer?: string } | null;
  return NextResponse.json({
    mode: "generated",
    answer: data?.answer || "The tutor returned no answer. Use the passages.",
    passages,
  });
}
