export type RenewalDecision =
  | { action: "renew_student"; priceCents: 499; reason: string }
  | { action: "renew_standard"; priceCents: 999; reason: string }
  | { action: "cancel_at_period_end"; priceCents: 499; reason: string };

/**
 * A lapsed student verification never changes the price by itself.
 * The student price continues only while verification is active.
 * Without consent, renewal stops instead of moving to the standard price.
 */
export function renewalDecision(input: {
  plan: "student" | "standard";
  verificationActive: boolean;
  standardPriceConsentAt: string | null;
}): RenewalDecision {
  if (input.plan === "standard") {
    return {
      action: "renew_standard",
      priceCents: 999,
      reason: "The subscriber is already on the standard price.",
    };
  }
  if (input.verificationActive) {
    return {
      action: "renew_student",
      priceCents: 499,
      reason: "Current enrollment verification is on file, so the student price can renew.",
    };
  }
  if (input.standardPriceConsentAt) {
    return {
      action: "renew_standard",
      priceCents: 999,
      reason: "Verification has lapsed and the subscriber consented to the standard price.",
    };
  }
  return {
    action: "cancel_at_period_end",
    priceCents: 499,
    reason: "Verification has lapsed. The student price is not increased, and the standard price is not charged without consent. The subscription is set to end at the close of the paid period.",
  };
}
