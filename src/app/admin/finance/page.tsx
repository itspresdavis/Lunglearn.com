import { notFound } from "next/navigation";
import { ExpenseForm } from "@/components/admin-forms";
import { ScenarioTool } from "@/components/scenario-tool";
import { estimatedCardProcessingFeeCents, MONTHLY_PROFIT_TARGET_CENTS, monthlyRecurringRevenueCents, operatingProfitCents } from "@/lib/finance";
import { currentSession } from "@/lib/session";
import { getStore } from "@/server/store";

export default async function FinancePage() {
  const session = await currentSession();
  if (!session || session.user.role !== "admin") notFound();
  const subscriptions = getStore().subscriptions();
  const mrr = monthlyRecurringRevenueCents(subscriptions);
  const expenses = getStore().expenses();
  const actualExpense = expenses.filter((expense) => expense.actual).reduce((sum, expense) => sum + expense.cents, 0);
  const feeProjection = subscriptions
    .filter((subscription) => subscription.status === "active")
    .reduce((sum, subscription) => sum + estimatedCardProcessingFeeCents(subscription.priceCents), 0);
  const profit = operatingProfitCents({
    collectedCents: 0,
    refundedCents: 0,
    processingFeesCents: 0,
    expenseCents: actualExpense,
  });
  const activeStudents = subscriptions.filter((subscription) => subscription.status === "active" && subscription.plan === "student").length;
  const activeStandard = subscriptions.filter((subscription) => subscription.status === "active" && subscription.plan === "standard").length;
  return (
    <div>
      <h1>Finance</h1>
      <p>Monthly recurring revenue from active subscriptions: ${(mrr / 100).toFixed(2)}. Annualized, that is ${(mrr * 12 / 100).toFixed(2)}. Recurring revenue is not cash collected and it is not profit.</p>
      <p>Active verified-student subscriptions: {activeStudents}. Active standard subscriptions: {activeStandard}. Institutional revenue recorded: $0.</p>
      <p>Card-processing estimate at 2.9% plus $0.30, labeled as a projection: ${(feeProjection / 100).toFixed(2)}.</p>
      <p>Operating profit from recorded cash, refunds, and actual expenses: ${(profit / 100).toFixed(2)}. Collected cash in this ledger: $0. The target is ${(MONTHLY_PROFIT_TARGET_CENTS / 100).toLocaleString("en-US")} of operating profit per month. This build has not reached it.</p>
      <h2>Recorded expenses</h2>
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>{expense.category}: ${(expense.cents / 100).toFixed(2)} · {expense.actual ? "actual" : "not actual"} · {expense.note}</li>
        ))}
      </ul>
      <ExpenseForm />
      <ScenarioTool />
    </div>
  );
}
