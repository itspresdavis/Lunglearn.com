export const PLANS = {
  free: {
    id: "free",
    name: "Free",
    monthlyCents: 0,
    summary: "Career exploration, the school directory, public articles, the thoracic atlas, basic calculators, selected lessons, and a short set of practice questions.",
  },
  student: {
    id: "student",
    name: "Verified student",
    monthlyCents: 499,
    summary: "The full individual library for a student with a current enrollment review.",
  },
  standard: {
    id: "standard",
    name: "Standard",
    monthlyCents: 999,
    summary: "The same individual library for practicing therapists, educators, and other subscribers.",
  },
} as const;

export type PlanId = keyof typeof PLANS | "institutional";

export type AccessLevel = "free" | "premium";

export type Entitlement = "free" | "individual_premium" | "institutional";

export function canAccess(entitlement: Entitlement, access: AccessLevel, educator = false): boolean {
  if (access === "free" && !educator) return true;
  if (educator) return entitlement === "institutional";
  return entitlement === "individual_premium" || entitlement === "institutional";
}

export function resolveEntitlement(input: {
  plan: PlanId;
  subscriptionStatus: "active" | "past_due" | "canceled" | "incomplete" | "none";
  verificationStatus: "none" | "pending" | "approved" | "expired" | "rejected";
  periodEndsAt: string | null;
  now: string;
}): Entitlement {
  const periodOpen = Boolean(input.periodEndsAt && input.periodEndsAt > input.now);
  const paying = input.subscriptionStatus === "active" || input.subscriptionStatus === "past_due" || periodOpen;
  if (!paying) return "free";
  if (input.plan === "institutional") return "institutional";
  if (input.plan === "standard") return "individual_premium";
  if (input.plan === "student") {
    if (input.verificationStatus === "approved") return "individual_premium";
    if (input.verificationStatus === "expired" && periodOpen) return "individual_premium";
  }
  return "free";
}

export const FREE_CALCULATORS = new Set([
  "predicted-body-weight",
  "ideal-body-weight",
  "minute-ventilation",
  "pf-ratio",
  "alveolar-gas",
  "aa-gradient",
]);

export const FREE_ANATOMY_MONOGRAPHS = new Set([
  "fma-7394",
  "fma-7396",
  "fma-68418",
  "fma-13295",
  "text-lung",
  "text-alveolus",
  "text-pleura",
]);

export function calculatorIsFree(slug: string): boolean {
  return FREE_CALCULATORS.has(slug);
}
