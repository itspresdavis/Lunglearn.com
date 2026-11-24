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
      <p>{session.user.email}</p>
      <p>Role: {session.user.role}. Authenticator: {session.user.mfaEnabled ? "on" : "off"}.</p>
      <SignOutButton />
      <p>
        <Link href="/account/billing">Billing</Link> · <Link href="/account/verification">Student verification</Link>
      </p>
      <MfaPanel />
    </section>
  );
}
