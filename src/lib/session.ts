import { cookies } from "next/headers";
import { resolveEntitlement, type Entitlement } from "@/lib/entitlements";
import { getStore } from "@/server/store";

export const SESSION_COOKIE = "ll_session";

export async function currentSession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const found = getStore().userForToken(token);
  if (!found) return null;
  const subscription = getStore().subscriptionFor(found.user.id);
  const entitlement: Entitlement = subscription
    ? resolveEntitlement({
        plan: subscription.plan,
        subscriptionStatus: subscription.status,
        verificationStatus: subscription.verificationStatus,
        periodEndsAt: subscription.periodEndsAt,
        now: new Date().toISOString(),
      })
    : "free";
  return { token, user: found.user, mfa: found.mfa, subscription, entitlement };
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 14 * 24 * 60 * 60,
  };
}
