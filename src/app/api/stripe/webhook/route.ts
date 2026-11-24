import { NextResponse } from "next/server";
import { renewalDecision } from "@/lib/billing-policy";
import { currentSession } from "@/lib/session";
import { patchFromStripeEvent, stripeClient } from "@/lib/stripe-billing";
import { getStore } from "@/server/store";

export async function POST(request: Request) {
  const stripe = stripeClient();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) return NextResponse.json({ error: "Webhook is not configured." }, { status: 503 });
  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  const payload = await request.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch {
    return NextResponse.json({ error: "Signature verification failed." }, { status: 400 });
  }
  const patch = patchFromStripeEvent(event);
  if (!patch) return NextResponse.json({ received: true, ignored: true });
  const store = getStore();
  const existing = store.subscriptionFor(patch.userId);
  if (
    existing &&
    existing.plan === "student" &&
    patch.priceCents !== undefined &&
    patch.priceCents > existing.priceCents &&
    existing.priceCents > 0 &&
    !existing.standardPriceConsentAt
  ) {
    const decision = renewalDecision({
      plan: "student",
      verificationActive: existing.verificationStatus === "approved",
      standardPriceConsentAt: null,
    });
    store.applyStripeEvent({
      id: event.id,
      type: event.type,
      userId: patch.userId,
      status: "canceled",
      priceCents: decision.priceCents,
      customerId: patch.customerId,
      subscriptionId: patch.subscriptionId,
      periodEndsAt: patch.periodEndsAt,
    });
    if (patch.subscriptionId) {
      await stripe.subscriptions.update(patch.subscriptionId, { cancel_at_period_end: true }).catch(() => undefined);
    }
    return NextResponse.json({ received: true, heldPrice: true });
  }
  store.applyStripeEvent({ id: event.id, type: event.type, ...patch });
  return NextResponse.json({ received: true });
}

export async function GET() {
  const session = await currentSession();
  if (!session || session.user.role !== "admin") return NextResponse.json({ error: "Not available." }, { status: 404 });
  return NextResponse.json({ configured: Boolean(process.env.STRIPE_WEBHOOK_SECRET && process.env.STRIPE_SECRET_KEY) });
}
