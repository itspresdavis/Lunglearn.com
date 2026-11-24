import type { EditorialRecord, Reference } from "@/lib/editorial";
import type { Block } from "@/content/career";

const formulaEditorial: EditorialRecord = {
  status: "published",
  version: 1,
  contentClass: "educational_formula",
  author: "Lung Learn editorial desk",
  reviewer: null,
  reviewedOn: "2026-11-23",
  publishedOn: "2026-11-23",
  formulaVerified: true,
  corrections: [],
};

const clinical: EditorialRecord = {
  status: "clinical_review_required",
  version: 1,
  contentClass: "clinical_education",
  author: "Lung Learn editorial desk",
  reviewer: null,
  reviewedOn: null,
  publishedOn: null,
  corrections: [],
};

const ardsnet: Reference = {
  title: "Ventilation with lower tidal volumes for acute lung injury and ARDS",
  source: "Acute Respiratory Distress Syndrome Network. New England Journal of Medicine",
  url: "https://doi.org/10.1056/NEJM200005043421801",
  published: "2000",
};

const yang: Reference = {
  title: "A prospective study of indexes predicting the outcome of trials of weaning from mechanical ventilation",
  source: "Yang KL, Tobin MJ. New England Journal of Medicine",
  url: "https://doi.org/10.1056/NEJM199105233242101",
  published: "1991",
};

const devine: Reference = {
  title: "Gentamicin therapy",
  source: "Devine BJ. Drug Intelligence and Clinical Pharmacy",
    url: "https://pubmed.ncbi.nlm.nih.gov/?term=Devine%20BJ%20Gentamicin%20therapy%201974",
    published: "1974",
    note: "Bibliographic citation: Drug Intelligence and Clinical Pharmacy. 1974;8:650-655. The link is a PubMed search, not a claim that a specific DOI was verified.",
};

const openstax: Reference = {
  title: "Anatomy and Physiology 2e",
  source: "OpenStax",
  url: "https://openstax.org/details/books/anatomy-and-physiology-2e",
  accessed: "2026-11-23",
};

export type CalculatorSpec = {
  slug: string;
  title: string;
  formula: string;
  unit: string;
  inputs: { name: string; label: string; unit: string; step?: string }[];
  limitations: string[];
  example: string;
  references: Reference[];
  editorial: EditorialRecord;
};

export const calculators: CalculatorSpec[] = [
  { slug: "predicted-body-weight", title: "Predicted body weight", formula: "Male: 50 + 0.91 × (height cm − 152.4). Female: 45.5 + 0.91 × (height cm − 152.4).", unit: "kg", inputs: [{ name: "sex", label: "Sex", unit: "male or female" }, { name: "heightCm", label: "Height", unit: "cm" }], limitations: ["Adult equation from the ARDS Network trial.", "Not a pediatric growth chart.", "Not an order for a tidal volume."], example: "An adult man, 180 cm: 50 + 0.91 × 27.6 = 75.1 kg.", references: [ardsnet], editorial: formulaEditorial },
  { slug: "ideal-body-weight", title: "Ideal body weight (Devine)", formula: "Male: 50 kg + 2.3 kg per inch over 5 feet. Female: 45.5 kg + 2.3 kg per inch over 5 feet.", unit: "kg", inputs: [{ name: "sex", label: "Sex", unit: "male or female" }, { name: "heightCm", label: "Height", unit: "cm" }], limitations: ["This is not predicted body weight.", "Do not use it as the ARDS Network denominator."], example: "The calculator converts centimeters to inches and applies Devine's coefficients.", references: [devine], editorial: formulaEditorial },
  { slug: "minute-ventilation", title: "Minute ventilation", formula: "VE = tidal volume (L) × respiratory rate.", unit: "L/min", inputs: [{ name: "tidalVolumeMl", label: "Tidal volume", unit: "mL" }, { name: "rate", label: "Rate", unit: "/min" }], limitations: ["A set ventilator rate is not the person's minute ventilation if they are also breathing."], example: "500 mL at 12 breaths/min is 6 L/min.", references: [openstax], editorial: formulaEditorial },
  { slug: "pf-ratio", title: "P/F ratio", formula: "PaO2 ÷ FiO2, with FiO2 as a fraction.", unit: "mm Hg", inputs: [{ name: "paO2", label: "PaO2", unit: "mm Hg" }, { name: "fiO2", label: "FiO2", unit: "fraction" }], limitations: ["The Berlin definition also requires a context and a minimum PEEP. A ratio alone is not ARDS."], example: "PaO2 80 at FiO2 0.80 is 100.", references: [{ title: "The Berlin definition of ARDS", source: "JAMA", url: "https://doi.org/10.1001/jama.2012.5669", published: "2012" }], editorial: formulaEditorial },
  { slug: "alveolar-gas", title: "Alveolar gas equation", formula: "PAO2 = FiO2 × (PB − PH2O) − (PaCO2 / R).", unit: "mm Hg", inputs: [{ name: "fiO2", label: "FiO2", unit: "fraction" }, { name: "paCO2", label: "PaCO2", unit: "mm Hg" }, { name: "pb", label: "Barometric pressure", unit: "mm Hg" }, { name: "r", label: "Respiratory exchange ratio", unit: "ratio" }], limitations: ["Defaults are PB 760, water vapor 47, R 0.8.", "R is assumed, not measured."], example: "Room air, PaCO2 40: 0.21 × 713 − 50 = 99.7 mm Hg.", references: [openstax], editorial: formulaEditorial },
  { slug: "aa-gradient", title: "A–a oxygen gradient", formula: "PAO2 − PaO2, using the alveolar gas equation above.", unit: "mm Hg", inputs: [{ name: "paO2", label: "PaO2", unit: "mm Hg" }, { name: "fiO2", label: "FiO2", unit: "fraction" }, { name: "paCO2", label: "PaCO2", unit: "mm Hg" }], limitations: ["The expected gradient rises with age and with FiO2. A single cutoff is not used here."], example: "If PAO2 is 99.7 and PaO2 is 95, the gradient is about 4.7 mm Hg.", references: [openstax], editorial: formulaEditorial },
  { slug: "oxygen-content", title: "Arterial oxygen content", formula: "CaO2 = (1.34 × Hb × SaO2) + (0.0031 × PaO2).", unit: "mL/dL", inputs: [{ name: "hemoglobin", label: "Hemoglobin", unit: "g/dL" }, { name: "saturation", label: "Saturation", unit: "fraction" }, { name: "paO2", label: "PaO2", unit: "mm Hg" }], limitations: ["1.34 and 0.0031 are conventional constants.", "Dyshemoglobin is ignored."], example: "Hb 15, saturation 1, PaO2 100: 20.1 + 0.31 = 20.41 mL/dL.", references: [openstax], editorial: formulaEditorial },
  { slug: "oxygen-delivery", title: "Oxygen delivery", formula: "DO2 = CaO2 × cardiac output × 10.", unit: "mL/min", inputs: [{ name: "caO2", label: "CaO2", unit: "mL/dL" }, { name: "cardiacOutput", label: "Cardiac output", unit: "L/min" }], limitations: ["Requires a content and a cardiac output. Saturation is not a substitute."], example: "Content 20 mL/dL and output 5 L/min: 1,000 mL/min.", references: [openstax], editorial: formulaEditorial },
  { slug: "oxygen-consumption", title: "Oxygen consumption", formula: "VO2 = (CaO2 − CvO2) × cardiac output × 10.", unit: "mL/min", inputs: [{ name: "caO2", label: "CaO2", unit: "mL/dL" }, { name: "cvO2", label: "CvO2", unit: "mL/dL" }, { name: "cardiacOutput", label: "Cardiac output", unit: "L/min" }], limitations: ["Mixed venous content is not a central venous saturation guessed from a monitor."], example: "A content difference of 5 mL/dL at 5 L/min is 250 mL/min.", references: [openstax], editorial: formulaEditorial },
  { slug: "static-compliance", title: "Static compliance", formula: "Cstat = VT ÷ (Pplat − PEEP).", unit: "mL/cm H2O", inputs: [{ name: "tidalVolumeMl", label: "Tidal volume", unit: "mL" }, { name: "plateau", label: "Plateau pressure", unit: "cm H2O" }, { name: "peep", label: "PEEP", unit: "cm H2O" }], limitations: ["Requires a real inspiratory pause.", "Patient effort during the pause invalidates it."], example: "500 mL, plateau 25, PEEP 5: 25 mL/cm H2O.", references: [openstax], editorial: formulaEditorial },
  { slug: "dynamic-compliance", title: "Dynamic compliance", formula: "Cdyn = VT ÷ (PIP − PEEP).", unit: "mL/cm H2O", inputs: [{ name: "tidalVolumeMl", label: "Tidal volume", unit: "mL" }, { name: "pip", label: "Peak pressure", unit: "cm H2O" }, { name: "peep", label: "PEEP", unit: "cm H2O" }], limitations: ["Includes resistance. It is not static compliance."], example: "500 mL, peak 35, PEEP 5: 16.7 mL/cm H2O.", references: [openstax], editorial: formulaEditorial },
  { slug: "airway-resistance", title: "Airway resistance", formula: "Raw = (PIP − Pplat) ÷ flow, with flow in L/s.", unit: "cm H2O/L/s", inputs: [{ name: "pip", label: "Peak pressure", unit: "cm H2O" }, { name: "plateau", label: "Plateau pressure", unit: "cm H2O" }, { name: "flowLpm", label: "Flow", unit: "L/min" }], limitations: ["Assumes constant flow.", "Includes the artificial airway unless that drop was subtracted."], example: "Peak 30, plateau 20, flow 60 L/min: 10 ÷ 1 = 10 cm H2O/L/s.", references: [openstax], editorial: formulaEditorial },
  { slug: "rsbi", title: "Rapid shallow breathing index", formula: "RSBI = respiratory rate ÷ tidal volume in liters.", unit: "breaths/min/L", inputs: [{ name: "rate", label: "Rate", unit: "/min" }, { name: "tidalVolumeMl", label: "Tidal volume", unit: "mL" }], limitations: ["Yang and Tobin's index. A cutoff is not an extubation order."], example: "Rate 30 and tidal volume 300 mL: 100.", references: [yang], editorial: formulaEditorial },
  { slug: "anion-gap", title: "Anion gap", formula: "Na − (Cl + HCO3). Potassium is not included.", unit: "mEq/L", inputs: [{ name: "sodium", label: "Sodium", unit: "mEq/L" }, { name: "chloride", label: "Chloride", unit: "mEq/L" }, { name: "bicarbonate", label: "Bicarbonate", unit: "mEq/L" }], limitations: ["Albumin and the laboratory's own interval change the meaning.", "This is not a diagnosis."], example: "140 − (104 + 24) = 12.", references: [openstax], editorial: formulaEditorial },
  { slug: "winters-formula", title: "Winter's formula", formula: "Expected PaCO2 = 1.5 × HCO3 + 8 ± 2.", unit: "mm Hg", inputs: [{ name: "bicarbonate", label: "Bicarbonate", unit: "mEq/L" }], limitations: ["A compensation check for metabolic acidosis only.", "Not a target to set on a ventilator."], example: "Bicarbonate 12: expected PaCO2 26, band 24 to 28.", references: [openstax], editorial: formulaEditorial },
  { slug: "acid-base", title: "Acid-base compensation check", formula: "A ruled teaching interpretation of pH, PaCO2, and bicarbonate. See the acid-base module for the rules.", unit: "interpretation", inputs: [{ name: "pH", label: "pH", unit: "" }, { name: "paCO2", label: "PaCO2", unit: "mm Hg" }, { name: "bicarbonate", label: "Bicarbonate", unit: "mEq/L" }], limitations: ["Teaching intervals only.", "No treatment is produced."], example: "pH 7.25, PaCO2 60, bicarbonate 26: respiratory acidosis.", references: [openstax], editorial: formulaEditorial },
  { slug: "oxygenation-index", title: "Oxygenation index", formula: "OI = (mean airway pressure × FiO2 as a percent) ÷ PaO2.", unit: "index", inputs: [{ name: "map", label: "Mean airway pressure", unit: "cm H2O" }, { name: "fiO2", label: "FiO2", unit: "fraction" }, { name: "paO2", label: "PaO2", unit: "mm Hg" }], limitations: ["Used most often in neonatal and pediatric teaching. An index is not a referral criterion by itself."], example: "MAP 15, FiO2 0.60, PaO2 60: 15 × 60 ÷ 60 = 15.", references: [openstax], editorial: formulaEditorial },
  { slug: "mean-airway-pressure", title: "Approximate mean airway pressure", formula: "PEEP + (PIP − PEEP) × inspiratory fraction of the cycle.", unit: "cm H2O", inputs: [{ name: "peep", label: "PEEP", unit: "cm H2O" }, { name: "pip", label: "Peak pressure", unit: "cm H2O" }, { name: "fraction", label: "Inspiratory fraction", unit: "0 to 1" }], limitations: ["A square-wave teaching estimate. Use the ventilator's measured mean when you have one."], example: "PEEP 5, peak 25, inspiratory fraction 0.33: about 11.6 cm H2O.", references: [openstax], editorial: formulaEditorial },
  { slug: "cylinder-duration", title: "Cylinder duration estimate", formula: "Minutes = (gauge psi × factor) ÷ flow. E factor 0.28. H factor 3.14.", unit: "minutes", inputs: [{ name: "psi", label: "Gauge pressure", unit: "psi" }, { name: "flow", label: "Flow", unit: "L/min" }, { name: "cylinder", label: "Cylinder", unit: "E or H" }], limitations: ["Tank factors are conventions.", "They ignore temperature and the actual cylinder."], example: "E cylinder, 2,000 psi, 2 L/min: about 280 minutes.", references: [openstax], editorial: formulaEditorial },
  { slug: "time-constant", title: "Time constant", formula: "Resistance (cm H2O/L/s) × compliance (L/cm H2O).", unit: "seconds", inputs: [{ name: "resistance", label: "Resistance", unit: "cm H2O/L/s" }, { name: "complianceMl", label: "Compliance", unit: "mL/cm H2O" }], limitations: ["A single compartment. Real lungs are not one compartment."], example: "Resistance 10 and compliance 50 mL/cm H2O: 0.5 s.", references: [openstax], editorial: formulaEditorial },
  { slug: "corrected-minute-ventilation", title: "Corrected minute ventilation", formula: "VE × PaCO2 ÷ 40.", unit: "L/min", inputs: [{ name: "minuteVentilation", label: "Minute ventilation", unit: "L/min" }, { name: "paCO2", label: "PaCO2", unit: "mm Hg" }], limitations: ["Normalizes to a PaCO2 of 40. It is not a prescribed minute ventilation."], example: "10 L/min at PaCO2 60 is 15 L/min when normalized.", references: [openstax], editorial: formulaEditorial },
  { slug: "dead-space", title: "Physiologic dead-space fraction", formula: "VD/VT = (PaCO2 − PECO2) ÷ PaCO2.", unit: "fraction", inputs: [{ name: "paCO2", label: "PaCO2", unit: "mm Hg" }, { name: "peCO2", label: "Mixed expired PCO2", unit: "mm Hg" }], limitations: ["Enghoff modification, using arterial rather than ideal alveolar PCO2.", "End-tidal PCO2 is not mixed expired PCO2."], example: "PaCO2 40 and mixed expired 20: 0.50.", references: [openstax], editorial: formulaEditorial },
  { slug: "mean-arterial-pressure", title: "Mean arterial pressure", formula: "DBP + (SBP − DBP) ÷ 3.", unit: "mm Hg", inputs: [{ name: "systolic", label: "Systolic", unit: "mm Hg" }, { name: "diastolic", label: "Diastolic", unit: "mm Hg" }], limitations: ["A calculation from cuff pressures. An arterial line's mean is the better number when you have it."], example: "120 and 80: 93 mm Hg.", references: [openstax], editorial: formulaEditorial },
  { slug: "svr", title: "Systemic vascular resistance", formula: "(MAP − CVP) ÷ cardiac output × 80.", unit: "dyn·s·cm−5", inputs: [{ name: "map", label: "MAP", unit: "mm Hg" }, { name: "cvp", label: "CVP", unit: "mm Hg" }, { name: "cardiacOutput", label: "Cardiac output", unit: "L/min" }], limitations: ["The factor 80 converts Wood units. Garbage pressures produce a confident-looking resistance."], example: "MAP 80, CVP 8, output 5: 1,152.", references: [openstax], editorial: formulaEditorial },
  { slug: "pvr", title: "Pulmonary vascular resistance", formula: "(mean PAP − PAWP) ÷ cardiac output × 80.", unit: "dyn·s·cm−5", inputs: [{ name: "mpap", label: "Mean PAP", unit: "mm Hg" }, { name: "pawp", label: "Wedge pressure", unit: "mm Hg" }, { name: "cardiacOutput", label: "Cardiac output", unit: "L/min" }], limitations: ["Requires catheter measurements. An echocardiogram estimate is not this equation."], example: "Mean PAP 30, wedge 10, output 5: 320.", references: [openstax], editorial: formulaEditorial },
  { slug: "stroke-volume", title: "Stroke volume", formula: "Cardiac output ÷ heart rate × 1000.", unit: "mL", inputs: [{ name: "cardiacOutput", label: "Cardiac output", unit: "L/min" }, { name: "heartRate", label: "Heart rate", unit: "/min" }], limitations: ["An average over a minute, not the next beat."], example: "Output 5 L/min at 80 beats/min: 62.5 mL.", references: [openstax], editorial: formulaEditorial },
];

export type ReferenceArticle = {
  slug: string;
  title: string;
  description: string;
  blocks: Block[];
  references: Reference[];
  editorial: EditorialRecord;
};

export const referenceArticles: ReferenceArticle[] = [
  {
    slug: "ventilator-modes",
    title: "Ventilator modes, as ideas",
    description: "What volume-targeted, pressure-targeted, and spontaneous breaths are trying to do.",
    editorial: clinical,
    references: [ardsnet, openstax],
    blocks: [
      { type: "p", text: "A mode is a pattern of promises. A volume-targeted breath promises a volume and lets pressure vary. A pressure-targeted breath promises a pressure and lets volume vary. A spontaneous mode promises support for breaths the person starts, and it gives nothing useful if the person has stopped starting them." },
      { type: "p", text: "Manufacturers rename these promises. Read the manual for the machine in front of you before you trust a classroom synonym. SIMV mixes mandatory breaths with spontaneous ones. Pressure support is a spontaneous mode with a set assist. None of the names chooses the tidal volume for you." },
      { type: "note", text: "This is an orientation. It is not a mode card for a named ventilator, and it is not a protocol." },
    ],
  },
  {
    slug: "waveforms",
    title: "Reading a ventilator waveform",
    description: "Pressure, flow, and volume, and the two questions worth asking first.",
    editorial: clinical,
    references: [openstax],
    blocks: [
      { type: "p", text: "Ask what is controlled and what is variable. In a constant-flow volume breath, flow is a square and pressure rises. In a pressure breath, pressure is the square and flow decelerates as the lung fills. Volume is the area under the flow curve in either case." },
      { type: "p", text: "Then ask whether flow returned to zero before the next breath. If expiratory flow is still going when inspiration starts, gas is trapped. A scoop or a beak on a pressure-volume loop is a teaching picture of overdistension, and it is easier to misread than the textbooks admit. When the picture and the person disagree, look at the person and the circuit." },
    ],
  },
  {
    slug: "oxygen-devices",
    title: "Oxygen devices compared",
    description: "A comparison of what each device can and cannot promise about FiO2.",
    editorial: clinical,
    references: [openstax],
    blocks: [
      { type: "p", text: "A nasal cannula at low flow raises FiO2 modestly, and the result depends on how much room air the person entrains. The faster they breathe, the more room air dilutes the oxygen. A simple mask does the same thing with a larger reservoir of oxygen near the face. A reservoir mask, used with enough flow to keep the bag from collapsing, can deliver a higher FiO2. An air-entrainment mask sacrifices peak FiO2 in order to hold FiO2 steadier." },
      { type: "p", text: "High-flow nasal cannula heats and humidifies a high flow and can wash out upper-airway carbon dioxide. It is not a ventilator. Noninvasive ventilation is a ventilator attached to a mask, with its own failure mode: the person vomits, or the mask leaks, or the person needed a tube. No device on this list has a single FiO2 that is true for every face and every rate." },
      { type: "note", text: "Device choice in the simulation is authored for that case. It is not a ladder you must climb for every saturation." },
    ],
  },
  {
    slug: "reference-intervals",
    title: "Teaching intervals, not a laboratory handbook",
    description: "The adult intervals this site uses, and the reasons not to tattoo them on a protocol.",
    editorial: clinical,
    references: [openstax],
    blocks: [
      { type: "p", text: "For blood-gas teaching, Lung Learn uses pH 7.35–7.45, PaCO2 35–45 mm Hg, and bicarbonate 22–26 mEq/L. These are common adult arterial intervals in textbooks. A laboratory prints its own. A person with chronic lung disease may live outside them with a normal pH. Altitude changes the expected PaO2. Venous blood is not arterial blood." },
      { type: "p", text: "Hemoglobin, electrolytes, and cell counts are deliberately not given a fake universal range here. Use the laboratory that ran the sample. A range copied from memory is how an education site becomes a bad protocol." },
    ],
  },
];

export function getCalculator(slug: string) {
  return calculators.find((calculator) => calculator.slug === slug);
}

export function getReferenceArticle(slug: string) {
  return referenceArticles.find((article) => article.slug === slug);
}
