import { NextResponse } from "next/server";
import { clientIp, sameOrigin } from "@/lib/http";
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";
import { getStore } from "@/server/store";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Cross-site request rejected." }, { status: 403 });
  const body = (await request.json().catch(() => null)) as { email?: string; password?: string; challenge?: string; code?: string } | null;
  const store = getStore();
  const ip = clientIp(request);
  if (body?.challenge && body.code) {
    const result = store.completeMfaLogin({ challenge: body.challenge, code: body.code, ip });
    if ("error" in result) return NextResponse.json({ error: result.error }, { status: "status" in result ? result.status : 401 });
    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE, result.token, sessionCookieOptions());
    return response;
  }
  if (!body?.email || !body.password) return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  const result = store.login({ email: body.email, password: body.password, ip });
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: "status" in result ? result.status : 401 });
  if ("mfaRequired" in result) return NextResponse.json({ mfaRequired: true, challenge: result.challenge });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, result.token, sessionCookieOptions());
  return response;
}
