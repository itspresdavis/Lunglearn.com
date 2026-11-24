import Link from "next/link";
import { redirect } from "next/navigation";
import { currentSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await currentSession();
  if (!session || !["admin", "editor", "reviewer", "support"].includes(session.user.role)) redirect("/sign-in");
  return (
    <section className="section wrap">
      <p className="kicker">Administration · {session.user.role}</p>
      <nav className="toolbar" aria-label="Administration">
        <Link href="/admin">Overview</Link>
        <Link href="/admin/verification">Verification</Link>
        <Link href="/admin/editorial">Editorial</Link>
        <Link href="/admin/reports">Reports</Link>
        <Link href="/admin/finance">Finance</Link>
        <Link href="/admin/security">Security</Link>
      </nav>
      {children}
    </section>
  );
}
