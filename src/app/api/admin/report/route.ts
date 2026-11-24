import { NextResponse } from "next/server";
import { sameOrigin } from "@/lib/http";
import { currentSession } from "@/lib/session";
import { getStore } from "@/server/store";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Cross-site request rejected." }, { status: 403 });
  const session = await currentSession();
  if (!session || !["admin", "editor", "reviewer"].includes(session.user.role)) {
    return NextResponse.json({ error: "Editorial access required." }, { status: 403 });
  }
  const body = (await request.json().catch(() => null)) as { id?: string } | null;
  if (!body?.id) return NextResponse.json({ error: "A report id is required." }, { status: 400 });
  const result = getStore().resolveReport(body.id, session.user.id);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: 404 });
  return NextResponse.json({ ok: true });
}
