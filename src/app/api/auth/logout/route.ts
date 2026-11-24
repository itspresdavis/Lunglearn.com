import { NextResponse } from "next/server";
import { sameOrigin } from "@/lib/http";
import { SESSION_COOKIE } from "@/lib/session";
import { getStore } from "@/server/store";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Cross-site request rejected." }, { status: 403 });
  const token = request.headers.get("cookie")?.match(/(?:^|;\s*)ll_session=([^;]+)/)?.[1];
  if (token) getStore().logout(decodeURIComponent(token));
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return response;
}
