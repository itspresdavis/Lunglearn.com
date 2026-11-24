import { NextResponse } from "next/server";
import { sameOrigin } from "@/lib/http";
import { currentSession } from "@/lib/session";
import { stripeClient } from "@/lib/stripe-billing";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Cross-site request rejected." }, { status: 403 });
  const session = await currentSession();
  if (!session?.subscription?.stripeCustomerId) {
    return NextResponse.json({ error: "There is no billing customer on this account yet." }, { status: 400 });
  }
  const stripe = stripeClient();
  if (!stripe) return NextResponse.json({ error: "Billing portal is not configured. No change was made." }, { status: 503 });
  const origin = new URL(request.url).origin;
  const portal = await stripe.billingPortal.sessions.create({
    customer: session.subscription.stripeCustomerId,
    return_url: `${origin}/account/billing`,
  });
  return NextResponse.json({ url: portal.url });
}
