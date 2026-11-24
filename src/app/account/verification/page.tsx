import type { Metadata } from "next";
import Link from "next/link";
import { VerificationForms } from "@/components/account-panels";
import { currentSession } from "@/lib/session";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Student verification", robots: { index: false, follow: false } };

export default async function VerificationPage() {
  const session = await currentSession();
  if (!session) return <section className="section wrap"><p><Link href="/sign-in">Sign in</Link></p></section>;
  return (
    <section className="section wrap">
      <h1>Student verification</h1>
      <p>Current status: {session.subscription?.verificationStatus ?? "none"}.</p>
      <p>Upload a document that shows you are enrolled, or send an attestation with term dates. Redact account numbers, full birth dates, and government ID numbers. A card with no dates cannot be approved. Files are encrypted, opened only by a reviewer with an authenticator, and deleted 14 days after a decision.</p>
      <VerificationForms />
    </section>
  );
}
