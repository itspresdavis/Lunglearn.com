import { NextResponse } from "next/server";
import { clientIp, sameOrigin } from "@/lib/http";
import { currentSession } from "@/lib/session";
import { getStore } from "@/server/store";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Cross-site request rejected." }, { status: 403 });
  const body = (await request.json().catch(() => null)) as { href?: string; message?: string } | null;
  if (!body?.href?.startsWith("/") || !body.message || body.message.trim().length < 12) {
    return NextResponse.json({ error: "Name the page and describe the problem in a sentence." }, { status: 400 });
  }
  const session = await currentSession();
  const store = getStore();
  if (!store.consumeRate(`report:${clientIp(request)}`, 8, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many reports from this network. Wait and try again." }, { status: 429 });
  }
  store.addReport({ href: body.href.slice(0, 300), message: body.message.slice(0, 4000), userId: session?.user.id ?? null });
  return NextResponse.json({ ok: true });
}
