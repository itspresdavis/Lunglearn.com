import type { Metadata } from "next";
import Link from "next/link";
import { ConsentButton, PortalButton } from "@/components/account-panels";
import { renewalDecision } from "@/lib/billing-policy";
import { currentSession } from "@/lib/session";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Billing", robots: { index: false, follow: false } };

export default async function BillingPage() {
  const session = await currentSession();
  if (!session) return <section className="section wrap"><p><Link href="/sign-in">Sign in</Link></p></section>;
  const subscription = session.subscription;
  const decision = subscription && (subscription.plan === "student" || subscription.plan === "standard")
    ? renewalDecision({
        plan: subscription.plan,
        verificationActive: subscription.verificationStatus === "approved",
        standardPriceConsentAt: subscription.standardPriceConsentAt,
      })
    : null;
  return (
    <section className="section wrap">
      <h1>Billing</h1>
      {subscription ? (
        <ul>
          <li>Plan field: {subscription.plan}</li>
          <li>Status: {subscription.status}</li>
          <li>Price on the record: ${(subscription.priceCents / 100).toFixed(2)}</li>
          <li>Verification: {subscription.verificationStatus}</li>
          <li>Period ends: {subscription.periodEndsAt ?? "no open period"}</li>
          <li>Standard-price consent: {subscription.standardPriceConsentAt ?? "not given"}</li>
        </ul>
      ) : <p>No subscription record.</p>}
      {decision ? <p>If renewal were evaluated today: {decision.action}, at ${(decision.priceCents / 100).toFixed(2)}. {decision.reason}</p> : null}
      <PortalButton />
      <h2>Consent to the standard price</h2>
      <ConsentButton />
      <p><Link href="/pricing">Back to pricing</Link></p>
    </section>
  );
}
