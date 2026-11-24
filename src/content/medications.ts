import type { EditorialRecord, Reference } from "@/lib/editorial";

const editorial: EditorialRecord = {
  status: "clinical_review_required",
  version: 1,
  contentClass: "clinical_education",
  author: "Lung Learn editorial desk",
  reviewer: null,
  reviewedOn: null,
  publishedOn: null,
  corrections: [],
};

function dailyMed(query: string): Reference {
  return {
    title: `DailyMed search for ${query}`,
    source: "U.S. National Library of Medicine, DailyMed",
    url: `https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=${encodeURIComponent(query)}`,
    accessed: "2026-11-23",
    note: "Prescribing information changes. Read the label linked from the current search result. This monograph gives no dose.",
  };
}

export type Medication = {
  slug: string;
  generic: string;
  brands: string[];
  className: string;
  mechanism: string;
  indications: string;
  routes: string[];
  adverse: string[];
  contraindications: string[];
  interactions: string[];
  monitoring: string[];
  respiratory: string;
  references: Reference[];
  editorial: EditorialRecord;
};

export const medications: Medication[] = [
  {
    slug: "albuterol",
    generic: "Albuterol",
    brands: ["ProAir", "Ventolin", "Proventil"],
    className: "Short-acting beta-2 agonist",
    mechanism: "Stimulates beta-2 receptors on airway smooth muscle, raises cyclic AMP, and relaxes the muscle. It is a reliever, not an anti-inflammatory drug.",
    indications: "The labels cover bronchospasm in reversible obstructive airway disease and prevention of exercise-induced bronchospasm. Confirm the current wording. Off-label use is a prescriber's decision and is not endorsed here.",
    routes: ["Inhaled, by metered-dose inhaler or nebulizer"],
    adverse: ["Tremor", "Tachycardia and palpitations", "Nervousness", "A fall in potassium with repeated doses"],
    contraindications: ["Hypersensitivity to the drug or its components. Prior paradoxical bronchospasm is a reason to stop it and reassess."],
    interactions: ["Nonselective beta blockers can blunt the effect.", "Other sympathomimetics add to the cardiac stimulation."],
    monitoring: ["Symptom response", "Heart rate", "In repeated dosing, potassium and the rhythm when the clinical setting warrants it"],
    respiratory: "It treats the smooth-muscle part of obstruction. It does not remove mucus, fluid, or a foreign body. A poor response is information, not a reason to keep giving it without a new plan.",
    references: [dailyMed("albuterol")],
    editorial,
  },
  {
    slug: "ipratropium",
    generic: "Ipratropium",
    brands: ["Atrovent"],
    className: "Short-acting muscarinic antagonist",
    mechanism: "Blocks muscarinic receptors in the airway and reduces vagally mediated bronchoconstriction and secretion.",
    indications: "Labeled as a bronchodilator for maintenance in COPD, and used in combination during acute obstructive exacerbations. Confirm the current label before calling a use approved.",
    routes: ["Inhaled"],
    adverse: ["Dry mouth", "Cough", "Occasional urinary retention in susceptible people", "Avoid getting the mist in the eyes. It can worsen narrow-angle glaucoma."],
    contraindications: ["Hypersensitivity, including to atropine or its derivatives in some formulations."],
    interactions: ["Other anticholinergic drugs add to the effect."],
    monitoring: ["Respiratory response", "Urinary symptoms in older men", "Eye symptoms if the mist was poorly directed"],
    respiratory: "Onset is slower than albuterol. The two are often combined in severe obstruction because they act on different receptors. Combination is a clinical choice, not a reflex.",
    references: [dailyMed("ipratropium")],
    editorial,
  },
  {
    slug: "tiotropium",
    generic: "Tiotropium",
    brands: ["Spiriva"],
    className: "Long-acting muscarinic antagonist",
    mechanism: "A long-acting block of muscarinic receptors, used as maintenance bronchodilation. It is not a rescue inhaler.",
    indications: "Maintenance treatment of bronchospasm in COPD, and, for some products, asthma maintenance. The indication depends on the product and the label.",
    routes: ["Inhaled powder or soft-mist inhaler, depending on the product"],
    adverse: ["Dry mouth", "Urinary retention", "The mist or powder in the eye is a problem for narrow-angle glaucoma"],
    contraindications: ["Hypersensitivity to tiotropium or to ipratropium, because of cross-sensitivity."],
    interactions: ["Other anticholinergics."],
    monitoring: ["Exacerbation frequency over weeks, not minutes", "Urinary and eye symptoms"],
    respiratory: "Do not hand this to someone who is in acute respiratory failure and expect a rescue effect. Teach the device. A perfect drug in a device the person cannot use is a placebo.",
    references: [dailyMed("tiotropium")],
    editorial,
  },
  {
    slug: "budesonide",
    generic: "Budesonide",
    brands: ["Pulmicort"],
    className: "Inhaled corticosteroid",
    mechanism: "A glucocorticoid that reduces airway inflammation. The benefit is measured in days to weeks of control, not in the next five minutes.",
    indications: "Maintenance treatment of asthma. Some nebulized products have specific age limits. COPD use is a separate, narrower question. Read the product label.",
    routes: ["Inhaled"],
    adverse: ["Oral candidiasis and hoarseness", "Cough on inhalation", "Systemic effects are smaller than with oral steroids and are not zero at high doses"],
    contraindications: ["Hypersensitivity. It is not a treatment for acute bronchospasm, and the label says so."],
    interactions: ["Strong CYP3A4 inhibitors can raise systemic exposure."],
    monitoring: ["Symptom control and exacerbation rate", "Mouth care to limit thrush", "Growth in children is a prescriber's concern at higher doses"],
    respiratory: "Rinse and spit after use. Do not stop it during an attack and rely on the reliever alone unless a clinician has made that plan. The attack is often the evidence that the controller was needed.",
    references: [dailyMed("budesonide")],
    editorial,
  },
  {
    slug: "prednisone",
    generic: "Prednisone",
    brands: [],
    className: "Systemic corticosteroid",
    mechanism: "A prodrug converted to prednisolone. It suppresses inflammation broadly, which is why it works and why its harms are broad.",
    indications: "Short courses are used for acute asthma and COPD exacerbations. Long courses are used for selected inflammatory diseases. The indication and the duration are the prescriber's, and they should be short when the problem is an exacerbation.",
    routes: ["Oral"],
    adverse: ["Hyperglycemia", "Mood and sleep changes", "Fluid retention", "With repeated courses: infection risk, bone loss, adrenal suppression, myopathy"],
    contraindications: ["Systemic fungal infection is a classic labeled concern. Hypersensitivity. A relative contraindication is not a slogan. It is a balance the prescriber strikes."],
    interactions: ["NSAIDs and the gastrointestinal risk", "Drugs that alter potassium", "Warfarin effect can change"],
    monitoring: ["Glucose in people with diabetes", "Mood", "The plan for stopping, which matters more as the course gets longer"],
    respiratory: "The benefit in an exacerbation is on the inflammatory part of the obstruction over hours to days. It does not replace oxygen or ventilation in someone who is failing now.",
    references: [dailyMed("prednisone")],
    editorial,
  },
  {
    slug: "norepinephrine",
    generic: "Norepinephrine",
    brands: ["Levophed"],
    className: "Vasopressor",
    mechanism: "A potent alpha agonist with some beta-1 activity. It constricts vessels and supports blood pressure. It is not a respiratory drug that happens to be in the ICU.",
    indications: "Labeled for blood-pressure control in acute hypotensive states. Sepsis care uses it as a first vasopressor in many protocols. This page is not those protocols.",
    routes: ["Intravenous infusion through a reliable line"],
    adverse: ["Ischemia of fingers, gut, or kidney if flow is sacrificed for pressure", "Arrhythmia", "Extravasation injury"],
    contraindications: ["Hypersensitivity. Profound volume depletion is a reason to restore volume, not a reason to pretend the drug will oxygenate a dry circulation."],
    interactions: ["Other vasopressors and anesthetics add to the cardiovascular effect."],
    monitoring: ["Blood pressure, perfusion, rhythm, and the line site"],
    respiratory: "A falling blood pressure changes oxygen delivery even when the saturation looks fine. The therapist who only watches the airway will miss it. The drug itself can worsen ventilation-perfusion matching by constricting pulmonary vessels. That is a reason to reassess, not a reason to withhold a needed vasopressor.",
    references: [dailyMed("norepinephrine")],
    editorial,
  },
  {
    slug: "propofol",
    generic: "Propofol",
    brands: ["Diprivan"],
    className: "Intravenous anesthetic and sedative",
    mechanism: "Potentiates GABA-A inhibition. It sedates and, at higher doses, anesthetizes. It has no analgesic effect.",
    indications: "Induction and maintenance of anesthesia, and sedation of intubated mechanically ventilated adults in an intensive care unit, among labeled uses. Confirm the current product. It is not a sleep medicine for an unmonitored ward.",
    routes: ["Intravenous"],
    adverse: ["Hypotension", "Respiratory depression and apnea", "Pain on injection", "Hypertriglyceridemia with prolonged infusion", "Propofol-related infusion syndrome is rare and serious"],
    contraindications: ["Hypersensitivity to propofol, and allergy to egg or soy is addressed in the specific product label. Read that label rather than a remembered rule."],
    interactions: ["Other sedatives and opioids add respiratory and cardiovascular depression."],
    monitoring: ["Airway and ventilation", "Blood pressure", "Triglycerides and acid-base status during prolonged high-dose infusion"],
    respiratory: "Apnea is an expected effect at induction doses. The person who gives it owns the airway. A respiratory therapist should know that a sudden apnea after the drug is the drug until proved otherwise.",
    references: [dailyMed("propofol")],
    editorial,
  },
  {
    slug: "rocuronium",
    generic: "Rocuronium",
    brands: ["Zemuron"],
    className: "Nondepolarizing neuromuscular blocker",
    mechanism: "Competitively blocks acetylcholine at the nicotinic receptor of skeletal muscle. The diaphragm becomes weak along with every other skeletal muscle. The person is paralyzed and fully awake unless a sedative was also given.",
    indications: "Adjunct to general anesthesia for intubation and surgical relaxation, and, off the strict reading of some labels, ICU paralysis in ARDS protocols. ICU use is a specialist protocol with sedation requirements. It is not a treatment for agitation by itself.",
    routes: ["Intravenous"],
    adverse: ["Prolonged weakness", "The awareness that follows if sedation fails", "Anaphylaxis, uncommon and serious"],
    contraindications: ["Hypersensitivity. It does not replace an airway plan."],
    interactions: ["Inhaled anesthetics, magnesium, and some antibiotics prolong the block."],
    monitoring: ["Train-of-four or another assessment of the block", "Continuous sedation", "Ventilator alarms, because the person cannot breathe if the circuit fails"],
    respiratory: "Once this drug is in, the ventilator and the bag are the only respiration the person has. A disconnected circuit is an apnea. Confirm sedation before and during the block. This is the respiratory implication that matters most.",
    references: [dailyMed("rocuronium")],
    editorial,
  },
];

export function getMedication(slug: string) {
  return medications.find((medication) => medication.slug === slug);
}
