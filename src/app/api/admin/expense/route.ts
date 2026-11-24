import { NextResponse } from "next/server";
import { sameOrigin } from "@/lib/http";
import { currentSession } from "@/lib/session";
import { getStore } from "@/server/store";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Cross-site request rejected." }, { status: 403 });
  const session = await currentSession();
  if (!session || session.user.role !== "admin") return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  const body = (await request.json().catch(() => null)) as { category?: string; cents?: number; note?: string; actual?: boolean } | null;
  if (!body?.category || typeof body.cents !== "number") return NextResponse.json({ error: "Category and cents are required." }, { status: 400 });
  getStore().setExpense(body.category.slice(0, 80), Math.round(body.cents), (body.note ?? "").slice(0, 300), Boolean(body.actual));
  return NextResponse.json({ ok: true });
}
