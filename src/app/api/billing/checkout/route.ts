import { NextResponse } from "next/server";
import { PLANS } from "@/lib/entitlements";
import { sameOrigin } from "@/lib/http";
import { currentSession } from "@/lib/session";
import { stripeClient, stripePriceId } from "@/lib/stripe-billing";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Cross-site request rejected." }, { status: 403 });
  const session = await currentSession();
  if (!session) return NextResponse.json({ error: "Sign in before checkout." }, { status: 401 });
  const body = (await request.json().catch(() => null)) as { plan?: string } | null;
  const plan = body?.plan === "standard" || body?.plan === "student" ? body.plan : null;
  if (!plan) return NextResponse.json({ error: "Choose the student or standard plan." }, { status: 400 });
  const stripe = stripeClient();
  const price = stripePriceId(plan);
  if (!stripe || !price) {
    return NextResponse.json({
      error: "Card checkout is not configured. No charge was created.",
      configured: false,
      plan,
      monthlyCents: PLANS[plan].monthlyCents,
    }, { status: 503 });
  }
  const origin = new URL(request.url).origin;
  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: session.user.email,
    client_reference_id: session.user.id,
    line_items: [{ price, quantity: 1 }],
    success_url: `${origin}/account/billing?checkout=success`,
    cancel_url: `${origin}/pricing?checkout=cancelled`,
    automatic_tax: { enabled: process.env.STRIPE_AUTOMATIC_TAX === "true" },
    metadata: { userId: session.user.id, plan },
    subscription_data: { metadata: { userId: session.user.id, plan } },
    allow_promotion_codes: true,
  });
  return NextResponse.json({ url: checkout.url });
}
