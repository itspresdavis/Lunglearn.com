export type MoneySubscription = {
  plan: "student" | "standard" | "institutional";
  status: "active" | "past_due" | "canceled" | "incomplete";
  priceCents: number;
};

export type Ledger = {
  collectedCents: number;
  refundedCents: number;
  processingFeesCents: number;
  expenseCents: number;
};

export function monthlyRecurringRevenueCents(subscriptions: MoneySubscription[]): number {
  return subscriptions
    .filter((subscription) => subscription.status === "active")
    .reduce((sum, subscription) => sum + subscription.priceCents, 0);
}

export function annualRecurringRevenueCents(subscriptions: MoneySubscription[]): number {
  return monthlyRecurringRevenueCents(subscriptions) * 12;
}

/** Planning assumption from Stripe's published domestic online card rate. Not an invoice. */
export function estimatedCardProcessingFeeCents(amountCents: number): number {
  if (amountCents <= 0) return 0;
  return Math.round(amountCents * 0.029) + 30;
}

export function operatingProfitCents(ledger: Ledger): number {
  return ledger.collectedCents - ledger.refundedCents - ledger.processingFeesCents - ledger.expenseCents;
}

export const MONTHLY_PROFIT_TARGET_CENTS = 500_000;

export type ScenarioInput = {
  studentSubscribers: number;
  standardSubscribers: number;
  institutionalRevenueCents: number;
  monthlyChurn: number;
  processingRate: number;
  fixedExpenseCents: number;
};

export function scenarioMonth(input: ScenarioInput): {
  revenueCents: number;
  processingCents: number;
  profitCents: number;
  label: "projection";
} {
  const student = input.studentSubscribers * 499;
  const standard = input.standardSubscribers * 999;
  const revenueCents = student + standard + input.institutionalRevenueCents;
  const processingCents = Math.round(revenueCents * input.processingRate);
  const retained = Math.round(revenueCents * (1 - input.monthlyChurn));
  return {
    revenueCents,
    processingCents,
    profitCents: retained - processingCents - input.fixedExpenseCents,
    label: "projection",
  };
}
