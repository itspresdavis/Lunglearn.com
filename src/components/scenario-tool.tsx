"use client";

import { useState } from "react";
import { MONTHLY_PROFIT_TARGET_CENTS, scenarioMonth } from "@/lib/finance";

export function ScenarioTool() {
  const [students, setStudents] = useState(200);
  const [standard, setStandard] = useState(400);
  const [institutional, setInstitutional] = useState(0);
  const [churn, setChurn] = useState(0.04);
  const [expense, setExpense] = useState(80000);
  const result = scenarioMonth({
    studentSubscribers: students,
    standardSubscribers: standard,
    institutionalRevenueCents: institutional,
    monthlyChurn: churn,
    processingRate: 0.029,
    fixedExpenseCents: expense,
  });
  return (
    <form className="card">
      <h2>Projection, not a result</h2>
      <label className="field">Verified students<input type="number" value={students} onChange={(event) => setStudents(Number(event.target.value))} /></label>
      <label className="field">Standard subscribers<input type="number" value={standard} onChange={(event) => setStandard(Number(event.target.value))} /></label>
      <label className="field">Institutional cents<input type="number" value={institutional} onChange={(event) => setInstitutional(Number(event.target.value))} /></label>
      <label className="field">Monthly churn fraction<input type="number" step="0.01" value={churn} onChange={(event) => setChurn(Number(event.target.value))} /></label>
      <label className="field">Fixed expense, cents<input type="number" value={expense} onChange={(event) => setExpense(Number(event.target.value))} /></label>
      <p>Projected revenue ${(result.revenueCents / 100).toFixed(2)}. Projected card fees ${(result.processingCents / 100).toFixed(2)}. Projected profit ${(result.profitCents / 100).toFixed(2)}. Label: {result.label}.</p>
      <p>Monthly operating-profit target ${(MONTHLY_PROFIT_TARGET_CENTS / 100).toLocaleString("en-US")}. A projection does not count toward that target.</p>
    </form>
  );
}
