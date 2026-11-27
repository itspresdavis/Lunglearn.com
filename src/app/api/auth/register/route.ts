import { NextResponse } from "next/server";
import { clientIp, sameOrigin } from "@/lib/http";
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";
import { getStore } from "@/server/store";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Cross-site request rejected." }, { status: 403 });
  const body = (await request.json().catch(() => null)) as { email?: string; password?: string } | null;
  if (!body?.email || !body.password) return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  const store = getStore();
  const created = store.register({ email: body.email, password: body.password, ip: clientIp(request) });
  if ("error" in created) return NextResponse.json({ error: created.error }, { status: "status" in created ? created.status : 400 });
  const session = store.login({ email: body.email, password: body.password, ip: clientIp(request) });
  if (!("token" in session) || !session.token) {
    const message = "error" in session ? session.error : "The account was created, but sign-in did not start.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, session.token, sessionCookieOptions());
  return response;
}
