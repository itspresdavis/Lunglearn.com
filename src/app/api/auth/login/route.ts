import { NextResponse } from "next/server";
import { clientIp, sameOrigin } from "@/lib/http";
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";
import { getStore } from "@/server/store";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Cross-site request rejected." }, { status: 403 });
  const body = (await request.json().catch(() => null)) as { email?: string; password?: string } | null;
  if (!body?.email || !body.password) return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  const result = getStore().login({ email: body.email, password: body.password, ip: clientIp(request) });
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: 401 });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, result.token, sessionCookieOptions());
  return response;
}
