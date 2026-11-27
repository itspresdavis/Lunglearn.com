import { NextResponse } from "next/server";
import { sameOrigin } from "@/lib/http";
import { currentSession } from "@/lib/session";
import { getStore } from "@/server/store";

export async function GET() {
  const session = await currentSession();
  if (!session) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const store = getStore();
  const classrooms = store.classroomsFor(session.user.id);
  return NextResponse.json({
    classrooms: classrooms.map((room) => ({
      id: room.id,
      name: room.name,
      code: room.ownerId === session.user.id ? room.code : undefined,
      assignments: store.assignmentsForClassroom(room.id),
      enrollments: store.enrollmentsFor(room.id).length,
    })),
  });
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Cross-site request rejected." }, { status: 403 });
  const session = await currentSession();
  if (!session) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const body = (await request.json().catch(() => null)) as {
    action?: string;
    name?: string;
    code?: string;
    classroomId?: string;
    title?: string;
    href?: string;
    dueOn?: string;
    organization?: string;
    email?: string;
    seats?: number;
    note?: string;
  } | null;
  const store = getStore();
  if (body?.action === "create" && body.name) {
    const room = store.createClassroom(session.user.id, body.name.slice(0, 120));
    return NextResponse.json({ ok: true, room });
  }
  if (body?.action === "join" && body.code) {
    const result = store.joinClassroom(session.user.id, body.code);
    if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ ok: true });
  }
  if (body?.action === "assign" && body.classroomId && body.title && body.href?.startsWith("/")) {
    const result = store.createAssignment(session.user.id, body.classroomId, body.title.slice(0, 160), body.href, body.dueOn || null);
    if ("error" in result) return NextResponse.json({ error: result.error }, { status: 403 });
    return NextResponse.json({ ok: true });
  }
  if (body?.action === "inquiry" && body.organization && body.email) {
    store.addInquiry({
      organization: body.organization.slice(0, 160),
      email: body.email.slice(0, 160),
      seats: Math.max(1, Math.min(5000, Number(body.seats) || 1)),
      note: (body.note ?? "").slice(0, 2000),
    });
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "Unknown educator action." }, { status: 400 });
}
