import { NextResponse } from "next/server";
import { sameOrigin } from "@/lib/http";
import { currentSession } from "@/lib/session";
import { getStore } from "@/server/store";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Cross-site request rejected." }, { status: 403 });
  const session = await currentSession();
  if (!session) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const body = (await request.json().catch(() => null)) as { consent?: boolean } | null;
  if (!body?.consent) return NextResponse.json({ error: "Consent has to be explicit." }, { status: 400 });
  const result = getStore().consentToStandardPrice(session.user.id, new Date().toISOString());
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json({ ok: true });
}
