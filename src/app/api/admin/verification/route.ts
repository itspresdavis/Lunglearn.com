import { NextResponse } from "next/server";
import { sameOrigin } from "@/lib/http";
import { currentSession } from "@/lib/session";
import { getStore } from "@/server/store";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Cross-site request rejected." }, { status: 403 });
  const session = await currentSession();
  if (!session || (session.user.role !== "admin" && session.user.role !== "reviewer")) {
    return NextResponse.json({ error: "Reviewer access required." }, { status: 403 });
  }
  const body = (await request.json().catch(() => null)) as {
    verificationId?: string;
    decision?: "approved" | "rejected";
    enrollmentStart?: string;
    enrollmentEnd?: string;
    evidenceHasDates?: boolean;
  } | null;
  if (!body?.verificationId || (body.decision !== "approved" && body.decision !== "rejected")) {
    return NextResponse.json({ error: "A decision is required." }, { status: 400 });
  }
  const result = getStore().decideVerification({
    reviewerId: session.user.id,
    verificationId: body.verificationId,
    decision: body.decision,
    enrollmentStart: body.enrollmentStart,
    enrollmentEnd: body.enrollmentEnd,
    evidenceHasDates: Boolean(body.evidenceHasDates),
  });
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });
  getStore().purgeVerificationFiles();
  return NextResponse.json({ ok: true });
}
