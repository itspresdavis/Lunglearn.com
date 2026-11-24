import { round, wintersFormula } from "@/lib/calculators";

export type AcidBaseInput = { pH: number; paCO2: number; bicarbonate: number };

export type AcidBaseReport = {
  ok: true;
  summary: string;
  details: string[];
  limits: string[];
};

const LIMITS = [
  "The intervals used here are common adult arterial teaching intervals: pH 7.35–7.45, PaCO2 35–45 mm Hg, bicarbonate 22–26 mEq/L. A laboratory's own reference interval may differ.",
  "Temperature, chronic respiratory disease, and measurement error change the interpretation.",
  "This report does not recommend a treatment.",
];

export function interpretAcidBase(input: AcidBaseInput): AcidBaseReport | { ok: false; error: string } {
  const { pH, paCO2, bicarbonate } = input;
  if ([pH, paCO2, bicarbonate].some((value) => !Number.isFinite(value))) {
    return { ok: false, error: "pH, PaCO2, and bicarbonate must be numbers." };
  }
  if (pH < 6.5 || pH > 7.9 || paCO2 < 5 || paCO2 > 150 || bicarbonate < 1 || bicarbonate > 80) {
    return { ok: false, error: "One of these values is outside the range this teaching tool accepts." };
  }
  const acidemic = pH < 7.35;
  const alkalemic = pH > 7.45;
  const co2High = paCO2 > 45;
  const co2Low = paCO2 < 35;
  const hco3High = bicarbonate > 26;
  const hco3Low = bicarbonate < 22;
  const details: string[] = [];

  if (!acidemic && !alkalemic && !co2High && !co2Low && !hco3High && !hco3Low) {
    return {
      ok: true,
      summary: "All three values sit inside the adult teaching intervals used by this tool.",
      details: ["That does not exclude disease. It only describes these three numbers."],
      limits: LIMITS,
    };
  }

  if (!acidemic && !alkalemic && (co2High || co2Low) && (hco3High || hco3Low)) {
    return {
      ok: true,
      summary: "pH is inside the teaching interval while both PaCO2 and bicarbonate are outside it. This pattern can represent a fully compensated process, a mixed process, or a laboratory mismatch.",
      details: [
        "The tool does not choose which process came first when pH is inside the interval.",
        `PaCO2 is ${paCO2} mm Hg and bicarbonate is ${bicarbonate} mEq/L.`,
      ],
      limits: LIMITS,
    };
  }

  let summary = "The pattern does not fit a single primary teaching category.";
  if (acidemic && co2High && !hco3Low) {
    const delta = paCO2 - 40;
    const acute = round(24 + 0.1 * delta);
    const chronic = round(24 + 0.4 * delta);
    summary = "Acidemia with an elevated PaCO2 fits a respiratory acidosis teaching pattern.";
    details.push(`Acute teaching expectation for bicarbonate is about ${acute} mEq/L (increase of 1 mEq/L per 10 mm Hg of PaCO2).`);
    details.push(`Chronic teaching expectation is about ${chronic} mEq/L (increase of 4 mEq/L per 10 mm Hg).`);
    details.push("The measured bicarbonate is " + bicarbonate + " mEq/L. Duration is not known from these three numbers.");
  } else if (alkalemic && co2Low && !hco3High) {
    const delta = 40 - paCO2;
    const acute = round(24 - 0.2 * delta);
    const chronic = round(24 - 0.5 * delta);
    summary = "Alkalemia with a low PaCO2 fits a respiratory alkalosis teaching pattern.";
    details.push(`Acute teaching expectation for bicarbonate is about ${acute} mEq/L.`);
    details.push(`Chronic teaching expectation is about ${chronic} mEq/L.`);
    details.push(`Measured bicarbonate is ${bicarbonate} mEq/L.`);
  } else if (acidemic && hco3Low) {
    const winter = wintersFormula(bicarbonate);
    summary = "Acidemia with a low bicarbonate fits a metabolic acidosis teaching pattern.";
    if (winter.ok) {
      details.push(`Winter's formula expects PaCO2 near ${winter.value} mm Hg, with a teaching band of ±2.`);
      const gap = paCO2 - winter.value;
      if (Math.abs(gap) <= 2) details.push("The measured PaCO2 is inside that band.");
      else if (paCO2 > winter.value + 2) details.push("PaCO2 is higher than that band, which can mean an additional respiratory acidosis.");
      else details.push("PaCO2 is lower than that band, which can mean an additional respiratory alkalosis.");
    }
  } else if (alkalemic && hco3High) {
    const expected = round(40 + 0.6 * (bicarbonate - 24));
    summary = "Alkalemia with a high bicarbonate fits a metabolic alkalosis teaching pattern.";
    details.push(`One teaching estimate expects PaCO2 near ${expected} mm Hg (about 0.6 mm Hg for each 1 mEq/L of bicarbonate above 24).`);
    details.push(`Measured PaCO2 is ${paCO2} mm Hg. Compensation rules for metabolic alkalosis vary, and the respiratory response has a limit.`);
  } else {
    details.push("More than one primary process may be present. Compare each value with the direction of the pH instead of forcing a single label.");
  }

  return { ok: true, summary, details, limits: LIMITS };
}
