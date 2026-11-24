import { NextResponse } from "next/server";
import { currentSession } from "@/lib/session";

export async function GET() {
  const session = await currentSession();
  if (!session) return NextResponse.json({ user: null });
  return NextResponse.json({
    user: session.user,
    entitlement: session.entitlement,
    mfa: session.mfa,
    subscription: session.subscription
      ? {
          plan: session.subscription.plan,
          status: session.subscription.status,
          priceCents: session.subscription.priceCents,
          periodEndsAt: session.subscription.periodEndsAt,
          verificationStatus: session.subscription.verificationStatus,
          standardPriceConsentAt: session.subscription.standardPriceConsentAt,
        }
      : null,
  });
}
