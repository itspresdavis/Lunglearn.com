import { NextResponse } from "next/server";
import { sameOrigin } from "@/lib/http";
import { currentSession } from "@/lib/session";
import { getStore } from "@/server/store";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Cross-site request rejected." }, { status: 403 });
  const session = await currentSession();
  if (!session) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const body = (await request.json().catch(() => null)) as { action?: string; code?: string } | null;
  const store = getStore();
  if (body?.action === "begin") {
    const started = store.beginMfa(session.user.id);
    if ("error" in started) return NextResponse.json({ error: started.error }, { status: 400 });
    return NextResponse.json({ otpauth: started.otpauth });
  }
  if (body?.action === "confirm" && body.code) {
    const confirmed = store.confirmMfa(session.user.id, body.code, session.token);
    if ("error" in confirmed) return NextResponse.json({ error: confirmed.error }, { status: 400 });
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "Unknown authenticator action." }, { status: 400 });
}
