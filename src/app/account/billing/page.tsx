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
        <dl className="facts">
          <div><dt>Plan</dt><dd>{subscription.plan}</dd></div>
          <div><dt>Status</dt><dd>{subscription.status}</dd></div>
          <div><dt>Price on the record</dt><dd>${(subscription.priceCents / 100).toFixed(2)}</dd></div>
          <div><dt>Verification</dt><dd>{subscription.verificationStatus}</dd></div>
          <div><dt>Period ends</dt><dd>{subscription.periodEndsAt ?? "No open period"}</dd></div>
          <div><dt>Standard-price consent</dt><dd>{subscription.standardPriceConsentAt ?? "Not given"}</dd></div>
        </dl>
      ) : <p>No subscription record.</p>}
      {decision ? <p>If renewal were evaluated today: {decision.action}, at ${(decision.priceCents / 100).toFixed(2)}. {decision.reason}</p> : null}
      <PortalButton />
      <h2>Consent to the standard price</h2>
      <ConsentButton />
      <p><Link href="/pricing">Back to pricing</Link></p>
    </section>
  );
}
