import type { Metadata } from "next";
import Link from "next/link";
import { MfaPanel, SignOutButton } from "@/components/account-panels";
import { currentSession } from "@/lib/session";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Account", robots: { index: false, follow: false } };

export default async function AccountPage() {
  const session = await currentSession();
  if (!session) {
    return (
      <section className="section wrap">
        <h1>Account</h1>
        <p><Link href="/sign-in">Sign in</Link></p>
      </section>
    );
  }
  return (
    <section className="section wrap">
      <h1>Account</h1>
      <dl className="facts">
        <div><dt>Email</dt><dd>{session.user.email}</dd></div>
        <div><dt>Role</dt><dd>{session.user.role}</dd></div>
        <div><dt>Authenticator</dt><dd>{session.user.mfaEnabled ? "On" : "Off"}</dd></div>
      </dl>
      <SignOutButton />
      <p>
        <Link href="/account/billing">Billing</Link> · <Link href="/account/verification">Student verification</Link>
      </p>
      <MfaPanel />
    </section>
  );
}
