import { NextResponse } from "next/server";
import { clientIp, sameOrigin } from "@/lib/http";
import { currentSession } from "@/lib/session";
import { getStore } from "@/server/store";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Cross-site request rejected." }, { status: 403 });
  const session = await currentSession();
  if (!session) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const type = request.headers.get("content-type") ?? "";
  const store = getStore();
  if (type.includes("application/json")) {
    const body = (await request.json().catch(() => null)) as { institution?: string; email?: string; start?: string; end?: string } | null;
    if (!body) return NextResponse.json({ error: "The attestation was empty." }, { status: 400 });
    const result = store.submitAttestation({
      userId: session.user.id,
      institution: body.institution ?? "",
      email: body.email ?? "",
      start: body.start ?? "",
      end: body.end ?? "",
    });
    if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ ok: true, id: result.id });
  }
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Choose a JPEG, PNG, or PDF." }, { status: 400 });
  if (file.size > 5_000_000) return NextResponse.json({ error: "The file is larger than 5 MB." }, { status: 400 });
  const bytes = new Uint8Array(await file.arrayBuffer());
  const result = store.submitDocument({ userId: session.user.id, bytes, ip: clientIp(request) });
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json({ ok: true, id: result.id });
}
