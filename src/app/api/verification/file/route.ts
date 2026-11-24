import { NextResponse } from "next/server";
import { sameOrigin } from "@/lib/http";
import { currentSession } from "@/lib/session";
import { getStore } from "@/server/store";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Cross-site request rejected." }, { status: 403 });
  const session = await currentSession();
  if (!session) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const body = (await request.json().catch(() => null)) as { verificationId?: string } | null;
  if (!body?.verificationId) return NextResponse.json({ error: "A verification record is required." }, { status: 400 });
  const issued = getStore().issueFileToken({
    reviewerId: session.user.id,
    verificationId: body.verificationId,
    mfa: session.mfa,
  });
  if ("error" in issued) return NextResponse.json({ error: issued.error }, { status: 403 });
  return NextResponse.json({ url: `/api/verification/file?token=${issued.token}`, expiresAt: issued.expiresAt });
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  const file = getStore().readVerificationFile(token);
  if ("error" in file) return NextResponse.json({ error: file.error }, { status: 403 });
  const kind = file.bytes[0] === 0x25 ? "application/pdf" : file.bytes[0] === 0x89 ? "image/png" : "image/jpeg";
  return new NextResponse(Buffer.from(file.bytes), {
    headers: {
      "content-type": kind,
      "cache-control": "no-store",
      "content-disposition": "inline",
    },
  });
}
