import { NextResponse } from "next/server";
import { lessonByKey } from "@/content/curriculum";
import { sameOrigin } from "@/lib/http";
import { reviewCard, type ReviewGrade } from "@/lib/srs";
import { currentSession } from "@/lib/session";
import { getStore } from "@/server/store";

export async function GET() {
  const session = await currentSession();
  if (!session) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const store = getStore();
  return NextResponse.json({
    notes: store.notesFor(session.user.id),
    bookmarks: store.bookmarksFor(session.user.id),
    cards: store.flashcardsFor(session.user.id),
    progress: store.progressFor(session.user.id),
  });
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Cross-site request rejected." }, { status: 403 });
  const session = await currentSession();
  if (!session) return NextResponse.json({ error: "Sign in to use the study desk." }, { status: 401 });
  const body = (await request.json().catch(() => null)) as {
    action?: string;
    title?: string;
    body?: string;
    href?: string;
    front?: string;
    back?: string;
    sourceHref?: string;
    cardId?: string;
    grade?: number;
    lessonSlug?: string;
    cards?: { front?: string; back?: string; sourceHref?: string | null }[];
  } | null;
  const store = getStore();
  const today = new Date().toISOString().slice(0, 10);
  if (body?.action === "note" && body.title && body.body) {
    store.addNote(session.user.id, body.title.slice(0, 160), body.body.slice(0, 8000));
    return NextResponse.json({ ok: true });
  }
  if (body?.action === "bookmark" && body.href?.startsWith("/") && body.title) {
    store.addBookmark(session.user.id, body.href.slice(0, 300), body.title.slice(0, 180));
    return NextResponse.json({ ok: true });
  }
  if (body?.action === "card" && body.front && body.back) {
    const result = store.addFlashcards(session.user.id, [{ front: body.front, back: body.back, sourceHref: body.sourceHref ?? null }], today);
    return NextResponse.json({ ok: true, ...result });
  }
  if (body?.action === "cards" && Array.isArray(body.cards)) {
    const cards = body.cards.flatMap((card) =>
      card && typeof card.front === "string" && typeof card.back === "string"
        ? [{ front: card.front, back: card.back, sourceHref: typeof card.sourceHref === "string" ? card.sourceHref : null }]
        : [],
    );
    if (!cards.length) return NextResponse.json({ error: "Add at least one card." }, { status: 400 });
    const result = store.addFlashcards(session.user.id, cards, today);
    return NextResponse.json({ ok: true, ...result });
  }
  if (body?.action === "review" && body.cardId && typeof body.grade === "number" && body.grade >= 0 && body.grade <= 5) {
    const card = store.flashcardsFor(session.user.id).find((item) => item.id === body.cardId);
    if (!card) return NextResponse.json({ error: "Card not found." }, { status: 404 });
    const next = reviewCard(card, body.grade as ReviewGrade, today);
    store.updateFlashcard(session.user.id, card.id, next);
    return NextResponse.json({ ok: true, card: next });
  }
  if (body?.action === "complete" && body.lessonSlug) {
    const lessonSlug = body.lessonSlug.slice(0, 120);
    if (!lessonByKey(lessonSlug)) return NextResponse.json({ error: "That lesson is not in the academy." }, { status: 400 });
    store.completeLesson(session.user.id, lessonSlug);
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "Unknown study action." }, { status: 400 });
}
