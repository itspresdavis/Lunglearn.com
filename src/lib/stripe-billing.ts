import Stripe from "stripe";
import { PLANS } from "@/lib/entitlements";

export function stripeClient(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export function stripePriceId(plan: "student" | "standard"): string | null {
  const value = plan === "student" ? process.env.STRIPE_PRICE_STUDENT : process.env.STRIPE_PRICE_STANDARD;
  return value || null;
}

export type BillingPatch = {
  userId: string;
  plan?: "student" | "standard";
  status?: "active" | "past_due" | "canceled" | "incomplete";
  priceCents?: number;
  customerId?: string;
  subscriptionId?: string;
  periodEndsAt?: string | null;
};

function centsFromPrice(unitAmount: number | null | undefined, fallback: number): number {
  if (typeof unitAmount === "number" && unitAmount >= 0) return unitAmount;
  return fallback;
}

/**
 * Maps a verified Stripe event onto a local subscription patch.
 * Returns null when the event has no user to update.
 */
export function patchFromStripeEvent(event: Stripe.Event): BillingPatch | null {
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId || session.client_reference_id || "";
    const plan = session.metadata?.plan === "standard" ? "standard" : session.metadata?.plan === "student" ? "student" : undefined;
    if (!userId) return null;
    return {
      userId,
      plan,
      status: session.payment_status === "paid" || session.status === "complete" ? "active" : "incomplete",
      priceCents: plan ? PLANS[plan].monthlyCents : undefined,
      customerId: typeof session.customer === "string" ? session.customer : session.customer?.id,
      subscriptionId: typeof session.subscription === "string" ? session.subscription : session.subscription?.id,
    };
  }
  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const userId = subscription.metadata?.userId || "";
    if (!userId) return null;
    const plan = subscription.metadata?.plan === "standard" ? "standard" : subscription.metadata?.plan === "student" ? "student" : undefined;
    const price = subscription.items.data[0]?.price?.unit_amount ?? undefined;
    const status =
      event.type === "customer.subscription.deleted"
        ? "canceled"
        : subscription.status === "active"
          ? "active"
          : subscription.status === "past_due"
            ? "past_due"
            : subscription.status === "canceled"
              ? "canceled"
              : "incomplete";
    const endSeconds = (subscription as Stripe.Subscription & { current_period_end?: number }).current_period_end;
    return {
      userId,
      plan,
      status,
      priceCents: plan ? centsFromPrice(price, PLANS[plan].monthlyCents) : price ?? undefined,
      customerId: typeof subscription.customer === "string" ? subscription.customer : subscription.customer?.id,
      subscriptionId: subscription.id,
      periodEndsAt: endSeconds ? new Date(endSeconds * 1000).toISOString() : null,
    };
  }
  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object as Stripe.Invoice;
    const userId = invoice.metadata?.userId || "";
    if (!userId) return null;
    return { userId, status: "past_due" };
  }
  return null;
}
