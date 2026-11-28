export type CalcValue = { ok: true; value: number; unit: string; steps: string[]; reading: string | null };
export type CalcError = { ok: false; error: string };
export type CalcResult = CalcValue | CalcError;

function fail(error: string): CalcError {
  return { ok: false, error };
}

function ok(value: number, unit: string, steps: string[], reading: string | null = null): CalcValue {
  return { ok: true, value: round(value), unit, steps, reading };
}

function berlinReading(ratio: number): string {
  const limit = "The Berlin definition uses this ratio only together with timing, imaging, and the origin of the edema, and it expects PEEP or CPAP of at least 5 cm H2O. The ratio alone does not establish ARDS.";
  if (ratio <= 100) return `This ratio is in the severe oxygenation band of the Berlin definition, 100 mm Hg or below. ${limit}`;
  if (ratio <= 200) return `This ratio is in the moderate oxygenation band of the Berlin definition, above 100 through 200 mm Hg. ${limit}`;
  if (ratio <= 300) return `This ratio is in the mild oxygenation band of the Berlin definition, above 200 through 300 mm Hg. ${limit}`;
  return `This ratio is above the mild oxygenation band in the Berlin definition. ${limit}`;
}

export function round(value: number, places = 2): number {
  const factor = 10 ** places;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function finite(value: number, label: string): string | null {
  if (!Number.isFinite(value)) return `${label} must be a number.`;
  return null;
}

export function predictedBodyWeight(sex: "male" | "female", heightCm: number): CalcResult {
  const problem = finite(heightCm, "Height");
  if (problem) return fail(problem);
  if (heightCm < 140 || heightCm > 220) {
    return fail("Enter an adult height from 140 to 220 cm. The ARDS Network predicted-body-weight equation is not an infant or pediatric growth formula.");
  }
  const base = sex === "male" ? 50 : 45.5;
  const value = base + 0.91 * (heightCm - 152.4);
  const six = round(value * 6);
  return ok(value, "kg", [
    `PBW = ${base} + 0.91 × (${heightCm} − 152.4)`,
    "Constants are the adult ARDS Network predicted body weight equations.",
  ], `Six mL per kilogram of this predicted weight is ${six} mL. The ARDS Network trial used 6 mL/kg predicted body weight in acute lung injury and ARDS. That volume is arithmetic from this equation, not an order for every person on a ventilator.`);
}

export function idealBodyWeightDevine(sex: "male" | "female", heightCm: number): CalcResult {
  const problem = finite(heightCm, "Height");
  if (problem) return fail(problem);
  if (heightCm < 140 || heightCm > 220) {
    return fail("Enter an adult height from 140 to 220 cm. The Devine equation is an adult estimate.");
  }
  const inches = heightCm / 2.54;
  const base = sex === "male" ? 50 : 45.5;
  const value = base + 2.3 * (inches - 60);
  if (value <= 0) return fail("The Devine equation produced a nonpositive weight at this height.");
  return ok(value, "kg", [
    `Height ${round(inches)} in. IBW = ${base} + 2.3 × (inches over 5 feet).`,
    "Devine, 1974. This is not the ARDS Network predicted body weight used for tidal-volume targets.",
  ]);
}

export function minuteVentilation(tidalVolumeMl: number, rate: number): CalcResult {
  if (!Number.isFinite(tidalVolumeMl) || !Number.isFinite(rate)) return fail("Tidal volume and rate must be numbers.");
  if (tidalVolumeMl < 50 || tidalVolumeMl > 2000) return fail("Enter a tidal volume from 50 to 2,000 mL.");
  if (rate < 1 || rate > 80) return fail("Enter a respiratory rate from 1 to 80 breaths per minute.");
  const value = (tidalVolumeMl / 1000) * rate;
  return ok(value, "L/min", [`VE = (${tidalVolumeMl} mL ÷ 1000) × ${rate}`]);
}

export function pfRatio(paO2: number, fiO2Fraction: number): CalcResult {
  if (!Number.isFinite(paO2) || !Number.isFinite(fiO2Fraction)) return fail("PaO2 and FiO2 must be numbers.");
  if (paO2 <= 0 || paO2 > 800) return fail("Enter a PaO2 from just above 0 through 800 mm Hg.");
  if (fiO2Fraction < 0.21 || fiO2Fraction > 1) return fail("Enter FiO2 as a fraction from 0.21 to 1.");
  const value = paO2 / fiO2Fraction;
  return ok(value, "mm Hg", [`P/F = ${paO2} ÷ ${fiO2Fraction}`], berlinReading(value));
}

export function alveolarPo2(input: {
  fiO2Fraction: number;
  paCO2: number;
  barometricPressure?: number;
  waterVaporPressure?: number;
  respiratoryQuotient?: number;
}): CalcResult {
  const pb = input.barometricPressure ?? 760;
  const ph2o = input.waterVaporPressure ?? 47;
  const r = input.respiratoryQuotient ?? 0.8;
  if ([input.fiO2Fraction, input.paCO2, pb, ph2o, r].some((value) => !Number.isFinite(value))) {
    return fail("Every term in the alveolar gas equation must be a number.");
  }
  if (input.fiO2Fraction < 0.21 || input.fiO2Fraction > 1) return fail("Enter FiO2 as a fraction from 0.21 to 1.");
  if (input.paCO2 <= 0 || input.paCO2 > 150) return fail("Enter a PaCO2 from just above 0 through 150 mm Hg.");
  if (pb <= ph2o || pb > 800) return fail("Barometric pressure must be greater than water-vapor pressure and no more than 800 mm Hg.");
  if (r <= 0 || r > 1.5) return fail("Enter a respiratory exchange ratio from just above 0 through 1.5.");
  const value = input.fiO2Fraction * (pb - ph2o) - input.paCO2 / r;
  if (value <= 0) return fail("These inputs produced a nonpositive alveolar PO2. Check FiO2, PaCO2, and the assumed pressures.");
  return ok(value, "mm Hg", [
    `PAO2 = ${input.fiO2Fraction} × (${pb} − ${ph2o}) − (${input.paCO2} ÷ ${r})`,
    "Water vapor pressure defaults to 47 mm Hg at 37 °C. The respiratory exchange ratio defaults to 0.8.",
  ]);
}

export function aaGradient(input: {
  paO2: number;
  fiO2Fraction: number;
  paCO2: number;
  barometricPressure?: number;
  waterVaporPressure?: number;
  respiratoryQuotient?: number;
}): CalcResult {
  const alveolar = alveolarPo2(input);
  if (!alveolar.ok) return alveolar;
  if (!Number.isFinite(input.paO2) || input.paO2 <= 0 || input.paO2 > 800) {
    return fail("Enter a PaO2 from just above 0 through 800 mm Hg.");
  }
  const value = alveolar.value - input.paO2;
  return ok(value, "mm Hg", [...alveolar.steps, `A–a gradient = ${alveolar.value} − ${input.paO2}`]);
}

export function oxygenContent(hemoglobin: number, saO2Fraction: number, paO2: number): CalcResult {
  if ([hemoglobin, saO2Fraction, paO2].some((value) => !Number.isFinite(value))) {
    return fail("Hemoglobin, saturation, and PaO2 must be numbers.");
  }
  if (hemoglobin <= 0 || hemoglobin > 25) return fail("Enter hemoglobin from just above 0 through 25 g/dL.");
  if (saO2Fraction < 0 || saO2Fraction > 1) return fail("Enter oxygen saturation as a fraction from 0 to 1.");
  if (paO2 < 0 || paO2 > 800) return fail("Enter a PaO2 from 0 through 800 mm Hg.");
  const bound = 1.34 * hemoglobin * saO2Fraction;
  const dissolved = 0.0031 * paO2;
  const content = bound + dissolved;
  return ok(content, "mL/dL", [
    `Bound oxygen = 1.34 × ${hemoglobin} × ${saO2Fraction} = ${round(bound)}`,
    `Dissolved oxygen = 0.0031 × ${paO2} = ${round(dissolved)}`,
    "1.34 mL/g and 0.0031 mL/dL per mm Hg are conventional teaching constants, not universal physical constants.",
  ], `Bound oxygen is ${round(bound)} of the ${round(content)} mL/dL. The worked example in the oxygen-content lesson, hemoglobin 15 g/dL fully saturated at a PaO2 of 100 mm Hg, is about 20.4 mL/dL. Use that example as a comparison, not as a goal for a person.`);
}

export function oxygenDelivery(caO2: number, cardiacOutput: number): CalcResult {
  if (!Number.isFinite(caO2) || !Number.isFinite(cardiacOutput)) return fail("Oxygen content and cardiac output must be numbers.");
  if (caO2 <= 0 || caO2 > 40) return fail("Enter arterial oxygen content from just above 0 through 40 mL/dL.");
  if (cardiacOutput <= 0 || cardiacOutput > 20) return fail("Enter cardiac output from just above 0 through 20 L/min.");
  return ok(caO2 * cardiacOutput * 10, "mL/min", [`DO2 = ${caO2} mL/dL × ${cardiacOutput} L/min × 10`]);
}

export function oxygenConsumption(caO2: number, cvO2: number, cardiacOutput: number): CalcResult {
  if ([caO2, cvO2, cardiacOutput].some((value) => !Number.isFinite(value))) {
    return fail("Oxygen contents and cardiac output must be numbers.");
  }
  if (cvO2 < 0 || caO2 <= cvO2 || caO2 > 40) return fail("Arterial oxygen content must be greater than mixed-venous content.");
  if (cardiacOutput <= 0 || cardiacOutput > 20) return fail("Enter cardiac output from just above 0 through 20 L/min.");
  return ok((caO2 - cvO2) * cardiacOutput * 10, "mL/min", [
    `VO2 = (${caO2} − ${cvO2}) × ${cardiacOutput} × 10`,
  ]);
}

export function staticCompliance(tidalVolumeMl: number, plateau: number, peep: number): CalcResult {
  if ([tidalVolumeMl, plateau, peep].some((value) => !Number.isFinite(value))) {
    return fail("Tidal volume, plateau pressure, and PEEP must be numbers.");
  }
  if (tidalVolumeMl <= 0 || tidalVolumeMl > 2000) return fail("Enter a tidal volume from just above 0 through 2,000 mL.");
  if (plateau <= peep) return fail("Plateau pressure has to be higher than total PEEP for this equation.");
  if (peep < 0 || plateau > 80) return fail("Check the airway pressures. This teaching tool accepts PEEP of at least 0 and plateau pressure through 80 cm H2O.");
  return ok(tidalVolumeMl / (plateau - peep), "mL/cm H2O", [
    `Cstat = ${tidalVolumeMl} ÷ (${plateau} − ${peep})`,
  ]);
}

export function dynamicCompliance(tidalVolumeMl: number, pip: number, peep: number): CalcResult {
  if ([tidalVolumeMl, pip, peep].some((value) => !Number.isFinite(value))) {
    return fail("Tidal volume, peak pressure, and PEEP must be numbers.");
  }
  if (tidalVolumeMl <= 0 || tidalVolumeMl > 2000) return fail("Enter a tidal volume from just above 0 through 2,000 mL.");
  if (pip <= peep) return fail("Peak inspiratory pressure has to be higher than PEEP.");
  return ok(tidalVolumeMl / (pip - peep), "mL/cm H2O", [`Cdyn = ${tidalVolumeMl} ÷ (${pip} − ${peep})`]);
}

export function airwayResistance(pip: number, plateau: number, flowLpm: number): CalcResult {
  if ([pip, plateau, flowLpm].some((value) => !Number.isFinite(value))) {
    return fail("Pressures and flow must be numbers.");
  }
  if (pip <= plateau) return fail("Peak pressure has to be higher than plateau pressure.");
  if (flowLpm <= 0 || flowLpm > 120) return fail("Enter inspiratory flow from just above 0 through 120 L/min.");
  const flow = flowLpm / 60;
  return ok((pip - plateau) / flow, "cm H2O/L/s", [
    `Flow = ${flowLpm} L/min ÷ 60 = ${round(flow)} L/s`,
    `Raw = (${pip} − ${plateau}) ÷ ${round(flow)}`,
    "This estimate assumes a constant inspiratory flow and ignores the contribution of the artificial airway unless that pressure drop was already removed.",
  ]);
}

export function rapidShallowBreathingIndex(rate: number, tidalVolumeMl: number): CalcResult {
  if (!Number.isFinite(rate) || !Number.isFinite(tidalVolumeMl)) return fail("Rate and tidal volume must be numbers.");
  if (rate <= 0 || rate > 80) return fail("Enter a respiratory rate from just above 0 through 80.");
  if (tidalVolumeMl <= 0 || tidalVolumeMl > 2000) return fail("Enter a tidal volume from just above 0 through 2,000 mL.");
  const liters = tidalVolumeMl / 1000;
  const value = rate / liters;
  const place = value > 105 ? "above" : value < 105 ? "below" : "at";
  return ok(value, "breaths/min/L", [
    `RSBI = ${rate} ÷ ${round(liters)} L`,
    "Yang and Tobin described this index. A single value does not decide whether a person should be extubated.",
  ], `This index is ${place} 105, the landmark Yang and Tobin associated with weaning failure in their 1991 study. A single index is not an extubation decision.`);
}

export function anionGap(sodium: number, chloride: number, bicarbonate: number): CalcResult {
  if ([sodium, chloride, bicarbonate].some((value) => !Number.isFinite(value))) {
    return fail("Sodium, chloride, and bicarbonate must be numbers.");
  }
  if (sodium < 80 || sodium > 200 || chloride < 40 || chloride > 160 || bicarbonate < 1 || bicarbonate > 80) {
    return fail("One of these values is outside the range this teaching calculator accepts.");
  }
  return ok(sodium - (chloride + bicarbonate), "mEq/L", [
    `Anion gap = ${sodium} − (${chloride} + ${bicarbonate})`,
    "Potassium is not included. Laboratory reference intervals differ, and albumin changes the expected gap.",
  ]);
}

export function wintersFormula(bicarbonate: number): CalcResult {
  if (!Number.isFinite(bicarbonate)) return fail("Bicarbonate must be a number.");
  if (bicarbonate < 1 || bicarbonate > 40) return fail("Enter bicarbonate from 1 through 40 mEq/L.");
  const expected = 1.5 * bicarbonate + 8;
  return ok(expected, "mm Hg", [
    `Expected PaCO2 = 1.5 × ${bicarbonate} + 8 = ${round(expected)}`,
    `Teaching range ± 2 mm Hg: ${round(expected - 2)} to ${round(expected + 2)}.`,
    "Winter's formula is a compensation check for metabolic acidosis. It is not a ventilator prescription.",
  ]);
}

export function oxygenationIndex(meanAirwayPressure: number, fiO2Fraction: number, paO2: number): CalcResult {
  if ([meanAirwayPressure, fiO2Fraction, paO2].some((value) => !Number.isFinite(value))) {
    return fail("Mean airway pressure, FiO2, and PaO2 must be numbers.");
  }
  if (meanAirwayPressure <= 0 || meanAirwayPressure > 40) return fail("Enter mean airway pressure from just above 0 through 40 cm H2O.");
  if (fiO2Fraction < 0.21 || fiO2Fraction > 1) return fail("Enter FiO2 as a fraction from 0.21 to 1.");
  if (paO2 <= 0 || paO2 > 800) return fail("Enter a PaO2 from just above 0 through 800 mm Hg.");
  const percent = fiO2Fraction * 100;
  return ok((meanAirwayPressure * percent) / paO2, "index", [
    `OI = (${meanAirwayPressure} × ${round(percent)}) ÷ ${paO2}`,
  ]);
}

export function approximateMeanAirwayPressure(peep: number, pip: number, inspiratoryFraction: number): CalcResult {
  if ([peep, pip, inspiratoryFraction].some((value) => !Number.isFinite(value))) {
    return fail("PEEP, peak pressure, and inspiratory time fraction must be numbers.");
  }
  if (pip <= peep) return fail("Peak pressure has to be higher than PEEP.");
  if (inspiratoryFraction <= 0 || inspiratoryFraction >= 1) return fail("Enter the inspiratory fraction of the total cycle, greater than 0 and less than 1.");
  const value = peep + (pip - peep) * inspiratoryFraction;
  return ok(value, "cm H2O", [
    `Approximate MAP = ${peep} + (${pip} − ${peep}) × ${inspiratoryFraction}`,
    "This square-wave estimate is a teaching approximation for a constant-pressure inspiratory hold. A ventilator measurement replaces it.",
  ]);
}

export function cylinderDuration(gaugePsi: number, flowLpm: number, cylinder: "E" | "H"): CalcResult {
  if (!Number.isFinite(gaugePsi) || !Number.isFinite(flowLpm)) return fail("Gauge pressure and flow must be numbers.");
  if (gaugePsi <= 0 || gaugePsi > 3000) return fail("Enter a gauge pressure from just above 0 through 3,000 psi.");
  if (flowLpm <= 0 || flowLpm > 60) return fail("Enter flow from just above 0 through 60 L/min.");
  const factor = cylinder === "E" ? 0.28 : 3.14;
  const minutes = (gaugePsi * factor) / flowLpm;
  return ok(minutes, "minutes", [
    `${cylinder} cylinder estimate: (${gaugePsi} × ${factor}) ÷ ${flowLpm}`,
    "The factors 0.28 and 3.14 are conventional tank constants. They are not a measurement of the cylinder in front of you.",
  ]);
}

export function timeConstant(resistance: number, complianceMl: number): CalcResult {
  if (!Number.isFinite(resistance) || !Number.isFinite(complianceMl)) return fail("Resistance and compliance must be numbers.");
  if (resistance <= 0 || resistance > 100) return fail("Enter airway resistance from just above 0 through 100 cm H2O/L/s.");
  if (complianceMl <= 0 || complianceMl > 400) return fail("Enter compliance from just above 0 through 400 mL/cm H2O.");
  const liters = complianceMl / 1000;
  return ok(resistance * liters, "seconds", [
    `Compliance = ${complianceMl} mL/cm H2O = ${round(liters, 3)} L/cm H2O`,
    `Time constant = ${resistance} × ${round(liters, 3)}`,
  ]);
}

export function correctedMinuteVentilation(minuteVentilationL: number, paCO2: number): CalcResult {
  if (!Number.isFinite(minuteVentilationL) || !Number.isFinite(paCO2)) return fail("Minute ventilation and PaCO2 must be numbers.");
  if (minuteVentilationL <= 0 || minuteVentilationL > 40) return fail("Enter minute ventilation from just above 0 through 40 L/min.");
  if (paCO2 <= 0 || paCO2 > 150) return fail("Enter a PaCO2 from just above 0 through 150 mm Hg.");
  return ok((minuteVentilationL * paCO2) / 40, "L/min", [
    `Corrected VE = ${minuteVentilationL} × ${paCO2} ÷ 40`,
    "This compares ventilation with a PaCO2 of 40 mm Hg. It is an educational normalization, not a target to impose on a patient.",
  ]);
}

export function deadSpaceFraction(paCO2: number, peCO2: number): CalcResult {
  if (!Number.isFinite(paCO2) || !Number.isFinite(peCO2)) return fail("PaCO2 and mixed expired PCO2 must be numbers.");
  if (paCO2 <= 0 || paCO2 > 150) return fail("Enter a PaCO2 from just above 0 through 150 mm Hg.");
  if (peCO2 < 0 || peCO2 >= paCO2) return fail("Mixed expired PCO2 must be at least 0 and lower than PaCO2.");
  return ok((paCO2 - peCO2) / paCO2, "fraction", [
    `VD/VT = (${paCO2} − ${peCO2}) ÷ ${paCO2}`,
    "This is the Enghoff modification of the Bohr equation using arterial PCO2. It estimates physiologic dead-space fraction for teaching.",
  ]);
}

export function meanArterialPressure(systolic: number, diastolic: number): CalcResult {
  if (!Number.isFinite(systolic) || !Number.isFinite(diastolic)) return fail("Systolic and diastolic pressures must be numbers.");
  if (systolic <= diastolic || systolic > 300 || diastolic < 20) {
    return fail("Enter a systolic pressure above the diastolic pressure, within ordinary clinical teaching bounds.");
  }
  return ok(diastolic + (systolic - diastolic) / 3, "mm Hg", [
    `MAP = ${diastolic} + (${systolic} − ${diastolic}) ÷ 3`,
  ]);
}

export function systemicVascularResistance(map: number, cvp: number, cardiacOutput: number): CalcResult {
  if ([map, cvp, cardiacOutput].some((value) => !Number.isFinite(value))) return fail("MAP, CVP, and cardiac output must be numbers.");
  if (map <= cvp) return fail("Mean arterial pressure has to be higher than central venous pressure.");
  if (cardiacOutput <= 0 || cardiacOutput > 20) return fail("Enter cardiac output from just above 0 through 20 L/min.");
  return ok(((map - cvp) / cardiacOutput) * 80, "dyn·s·cm−5", [
    `SVR = (${map} − ${cvp}) ÷ ${cardiacOutput} × 80`,
  ]);
}

export function pulmonaryVascularResistance(meanPap: number, pawp: number, cardiacOutput: number): CalcResult {
  if ([meanPap, pawp, cardiacOutput].some((value) => !Number.isFinite(value))) {
    return fail("Mean pulmonary artery pressure, wedge pressure, and cardiac output must be numbers.");
  }
  if (meanPap <= pawp) return fail("Mean pulmonary artery pressure has to be higher than the wedge pressure.");
  if (cardiacOutput <= 0 || cardiacOutput > 20) return fail("Enter cardiac output from just above 0 through 20 L/min.");
  return ok(((meanPap - pawp) / cardiacOutput) * 80, "dyn·s·cm−5", [
    `PVR = (${meanPap} − ${pawp}) ÷ ${cardiacOutput} × 80`,
  ]);
}

export function strokeVolume(cardiacOutput: number, heartRate: number): CalcResult {
  if (!Number.isFinite(cardiacOutput) || !Number.isFinite(heartRate)) return fail("Cardiac output and heart rate must be numbers.");
  if (cardiacOutput <= 0 || cardiacOutput > 20) return fail("Enter cardiac output from just above 0 through 20 L/min.");
  if (heartRate < 20 || heartRate > 250) return fail("Enter a heart rate from 20 through 250 beats per minute.");
  return ok((cardiacOutput / heartRate) * 1000, "mL", [`SV = (${cardiacOutput} ÷ ${heartRate}) × 1000`]);
}
