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

const nbrc: Reference = {
  title: "Respiratory Therapy Examination",
  source: "National Board for Respiratory Care",
  url: "https://www.nbrc.org/rt/",
  accessed: "2026-11-23",
  note: "Cited for the public description of the examination. These questions are not NBRC items.",
};

export type Question = {
  id: string;
  stem: string;
  choices: string[];
  answer: number;
  explanation: string;
  whyWrong: string[];
  topic: string;
  difficulty: "basic" | "intermediate" | "advanced";
  access: "free" | "premium";
  references: Reference[];
  editorial: EditorialRecord;
};

const openstax: Reference = {
  title: "Anatomy and Physiology 2e",
  source: "OpenStax",
  url: "https://openstax.org/details/books/anatomy-and-physiology-2e",
  accessed: "2026-11-23",
};

export const questions: Question[] = [
  {
    id: "q1",
    stem: "A quiet inspiration begins. Which pressure change actually draws air into the alveoli?",
    choices: [
      "Alveolar pressure rises above atmospheric pressure.",
      "Alveolar pressure falls slightly below atmospheric pressure.",
      "Pleural pressure becomes positive and pushes air in.",
      "Atmospheric pressure falls.",
    ],
    answer: 1,
    explanation: "Diaphragm descent increases thoracic volume. Alveolar pressure falls a little below atmospheric pressure, and air flows in.",
    whyWrong: [
      "A rise in alveolar pressure would push air out.",
      "Pleural pressure becomes more negative in ordinary inspiration, not positive.",
      "The atmosphere is not the thing that changed.",
    ],
    topic: "Mechanics",
    difficulty: "basic",
    access: "free",
    references: [openstax],
    editorial,
  },
  {
    id: "q2",
    stem: "Which main bronchus is shorter, wider, and more vertical?",
    choices: ["Left", "Right", "They are symmetrical", "Neither. Both leave at the same angle."],
    answer: 1,
    explanation: "The right main bronchus continues the line of the trachea more closely. That is why aspirated material and a deep tube more often enter it.",
    whyWrong: ["The left is longer and more horizontal.", "They are not symmetrical.", "The angles differ."],
    topic: "Airway",
    difficulty: "basic",
    access: "free",
    references: [openstax],
    editorial,
  },
  {
    id: "q3",
    stem: "Predicted body weight in the ARDS Network tidal-volume trial is calculated from which inputs?",
    choices: ["Actual body weight only", "Height and sex", "Ideal body weight from a visual estimate", "Body mass index"],
    answer: 1,
    explanation: "The equations use sex and height in centimeters. Actual weight includes tissue that is not lung.",
    whyWrong: ["Actual weight is the quantity the trial avoided as the denominator.", "A visual estimate is not the equation.", "BMI is not an input."],
    topic: "Ventilation",
    difficulty: "intermediate",
    access: "free",
    references: [{
      title: "Ventilation with lower tidal volumes for acute lung injury and ARDS",
      source: "Acute Respiratory Distress Syndrome Network. New England Journal of Medicine",
      url: "https://doi.org/10.1056/NEJM200005043421801",
      published: "2000",
    }],
    editorial,
  },
  {
    id: "q4",
    stem: "Static compliance uses which pressure difference in the denominator?",
    choices: ["Peak inspiratory pressure minus PEEP", "Plateau pressure minus PEEP", "Peak minus plateau", "Mean airway pressure minus PEEP"],
    answer: 1,
    explanation: "Plateau pressure is measured with no flow, so it reflects elastic recoil. Compliance is tidal volume divided by plateau minus PEEP.",
    whyWrong: ["Peak minus PEEP estimates dynamic compliance.", "Peak minus plateau is the numerator of a resistance estimate.", "Mean airway pressure is a different teaching equation."],
    topic: "Mechanics",
    difficulty: "intermediate",
    access: "free",
    references: [openstax],
    editorial,
  },
  {
    id: "q5",
    stem: "Hemoglobin is 7 g/dL and arterial saturation is 100 percent. Which statement is accurate?",
    choices: [
      "Oxygen content is normal because saturation is normal.",
      "Oxygen content is reduced because there is less hemoglobin to bind oxygen.",
      "Dissolved oxygen fully replaces the missing hemoglobin.",
      "The PaO2 must be low.",
    ],
    answer: 1,
    explanation: "Content depends mostly on hemoglobin times saturation. A normal saturation on a small amount of hemoglobin is still a small amount of oxygen. Dissolved oxygen is a minor term at ordinary PaO2.",
    whyWrong: ["Saturation is not content.", "Dissolved oxygen does not replace a missing 8 g/dL of hemoglobin.", "PaO2 can be normal. The problem is the hemoglobin."],
    topic: "Oxygenation",
    difficulty: "intermediate",
    access: "free",
    references: [openstax],
    editorial,
  },
  {
    id: "q6",
    stem: "pH 7.25, PaCO2 60 mm Hg, bicarbonate 26 mEq/L. Which teaching label fits best?",
    choices: ["Metabolic acidosis with respiratory compensation", "Respiratory acidosis, with little metabolic compensation yet", "Fully compensated metabolic alkalosis", "Laboratory error, because these values cannot coexist"],
    answer: 1,
    explanation: "The pH is low and the PaCO2 is high, so the leading process is respiratory. The bicarbonate has barely moved, which fits an acute time course better than a chronic one.",
    whyWrong: ["The bicarbonate is not the low value that would lead a metabolic acidosis.", "The pH is not normal, so this is not full compensation, and the bicarbonate is not high.", "The values are physiologically compatible."],
    topic: "Blood gas",
    difficulty: "intermediate",
    access: "free",
    references: [openstax],
    editorial,
  },
  {
    id: "q7",
    stem: "Through December 31, 2026, how is the CRT credential earned according to the NBRC's public description?",
    choices: [
      "By the lower cut score on the Therapist Multiple-Choice Examination.",
      "Only by passing the Clinical Simulation Examination.",
      "By graduating from any college program, without an examination.",
      "By the high cut score on the 185-item examination that begins in January 2027.",
    ],
    answer: 0,
    explanation: "NBRC states that the lower TMC cut score earns the CRT credential. The higher cut score also earns the CRT and can open the Clinical Simulation Examination for eligible candidates.",
    whyWrong: ["The simulation examination is part of the RRT path in that era, not the CRT path.", "Graduation alone does not confer the credential.", "The 185-item examination is the later design, and its high cut score is described as earning the RRT."],
    topic: "Credential",
    difficulty: "basic",
    access: "free",
    references: [nbrc, {
      title: "Certified Respiratory Therapist",
      source: "National Board for Respiratory Care",
      url: "https://www.nbrc.org/examinations/crt/",
      accessed: "2026-11-23",
    }],
    editorial,
  },
  {
    id: "q8",
    stem: "The Respiratory Therapy Examination effective January 2027, as NBRC describes it, contains:",
    choices: [
      "160 items over three hours, with a separate clinical simulation for the RRT.",
      "185 multiple-choice items over four hours, of which 160 are scored.",
      "100 items, all scored, with no pretest items.",
      "Two separate examinations given on different days for the CRT and the RRT.",
    ],
    answer: 1,
    explanation: "NBRC describes 185 items, 160 scored and 25 pretest, over four hours, with two cut scores on that one examination.",
    whyWrong: ["That is the earlier TMC description.", "Pretest items are part of the described examination.", "The two credentials are two cut scores, not two examinations, in the 2027 description."],
    topic: "Credential",
    difficulty: "basic",
    access: "free",
    references: [nbrc],
    editorial,
  },
  {
    id: "q9",
    stem: "A ventilator breath shows peak pressure 48 cm H2O and plateau pressure 22 cm H2O. Which problem does that gap point toward?",
    choices: ["A stiff lung", "Increased airway resistance or a problem in the tube", "Not enough PEEP", "Low cardiac output"],
    answer: 1,
    explanation: "The pressure that disappears when flow stops was spent overcoming resistance. A stiff lung would raise the plateau.",
    whyWrong: ["Stiffness raises plateau pressure.", "PEEP is not diagnosed from the peak-to-plateau gap.", "Cardiac output is not what this pressure gap measures."],
    topic: "Ventilation",
    difficulty: "intermediate",
    access: "premium",
    references: [openstax],
    editorial,
  },
  {
    id: "q10",
    stem: "The rapid shallow breathing index divides which quantities?",
    choices: ["Tidal volume in liters by respiratory rate", "Respiratory rate by tidal volume in liters", "PaO2 by FiO2", "Minute ventilation by PaCO2"],
    answer: 1,
    explanation: "Yang and Tobin described frequency divided by tidal volume in liters. A single value does not decide extubation.",
    whyWrong: ["That ratio is inverted.", "That is the P/F ratio.", "That resembles a corrected minute ventilation, which is a different teaching equation."],
    topic: "Ventilation",
    difficulty: "intermediate",
    access: "premium",
    references: [{
      title: "A prospective study of indexes predicting the outcome of trials of weaning from mechanical ventilation",
      source: "Yang KL, Tobin MJ. New England Journal of Medicine",
      url: "https://doi.org/10.1056/NEJM199105233242101",
      published: "1991",
    }],
    editorial,
  },
  {
    id: "q11",
    stem: "Which finding is the more concerning one during an asthma attack?",
    choices: [
      "A loud wheeze in a person who is still speaking in sentences.",
      "A silent chest in an exhausted person.",
      "A heart rate of 96 while albuterol is being given.",
      "A cough after the first nebulizer.",
    ],
    answer: 1,
    explanation: "Wheeze requires enough flow to make a sound. A silent chest with exhaustion can mean flow has nearly stopped.",
    whyWrong: ["A loud wheeze is not reassuring by itself, but it at least means air is moving.", "Tachycardia is an expected effect of a beta agonist and of the work of breathing.", "Cough is common and not the warning in the list."],
    topic: "Obstructive disease",
    difficulty: "intermediate",
    access: "premium",
    references: [{
      title: "Global Strategy for Asthma Management and Prevention",
      source: "Global Initiative for Asthma",
      url: "https://ginasthma.org/",
      accessed: "2026-11-23",
    }],
    editorial,
  },
  {
    id: "q12",
    stem: "A large pleural effusion and a completely collapsed lung from an obstructed bronchus shift the mediastinum in which directions?",
    choices: [
      "Both shift it toward the diseased side.",
      "Effusion shifts it away from the fluid. Collapse shifts it toward the collapse.",
      "Neither shifts the mediastinum.",
      "Effusion shifts it toward the fluid. Collapse shifts it away.",
    ],
    answer: 1,
    explanation: "Fluid pushes. Collapse pulls. The direction of the shift is a basic radiograph distinction.",
    whyWrong: ["They do not behave the same way.", "A large one-sided process does shift the mediastinum.", "The directions in that choice are reversed."],
    topic: "Imaging concepts",
    difficulty: "advanced",
    access: "premium",
    references: [openstax],
    editorial,
  },
];

export const practiceForms = [
  {
    id: "short-form-free",
    title: "8-item public practice form",
    access: "free" as const,
    minutes: 12,
    questionIds: ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8"],
    note: "An original educational form. It is not an NBRC examination, not a 185-item mock, and not a prediction of a score.",
  },
  {
    id: "short-form-premium",
    title: "12-item practice form",
    access: "premium" as const,
    minutes: 18,
    questionIds: questions.map((question) => question.id),
    note: "Still a short original form. A full-length 185-item examination is not published, because a reviewed bank of that size does not exist here yet.",
  },
];

export function getQuestion(id: string) {
  return questions.find((question) => question.id === id);
}
