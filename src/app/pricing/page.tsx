import type { Metadata } from "next";
import Link from "next/link";
import { CheckoutButtons, InquiryForm } from "@/components/account-panels";
import { PLANS } from "@/lib/entitlements";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Free, verified student at $4.99 per month, and standard at $9.99 per month. The student and standard libraries are the same.",
};

export default function PricingPage() {
  return (
    <section className="section wrap">
      <p className="kicker">Access</p>
      <h1>Pricing</h1>
      <div className="plans">
        {(["free", "student", "standard"] as const).map((id) => (
          <article key={id} className="plan">
            <h2>{PLANS[id].name}</h2>
            <p className="stat">{PLANS[id].monthlyCents === 0 ? "$0" : `$${(PLANS[id].monthlyCents / 100).toFixed(2)}`}<span> / month</span></p>
            <p>{PLANS[id].summary}</p>
          </article>
        ))}
      </div>
      <p>A verified student and a standard subscriber receive the same individual library. The price differs. When a student verification ends, the price does not rise unless the subscriber has agreed to the standard price. Otherwise the subscription is set to stop at the end of the paid period.</p>
      <p>Cancellation is done in the billing portal once Stripe is connected. Until then, checkout explains that no charge was created.</p>
      <CheckoutButtons />
      <p>
        <Link href="/account/verification">Student verification</Link> · <Link href="/account/billing">Billing</Link>
      </p>
      <InquiryForm />
    </section>
  );
}
