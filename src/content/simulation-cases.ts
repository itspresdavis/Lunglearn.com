import type { SimScenario } from "@/lib/simulation";
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

const openstax: Reference = {
  title: "Anatomy and Physiology 2e",
  source: "OpenStax",
  url: "https://openstax.org/details/books/anatomy-and-physiology-2e",
  accessed: "2026-11-23",
};

export type SimulationCase = SimScenario & {
  description: string;
  references: Reference[];
  editorial: EditorialRecord;
};

export const simulations: SimulationCase[] = [
  {
    id: "abg-ward-round",
    title: "Name the blood-gas pattern",
    access: "free",
    minutes: 8,
    description: "A fictional postoperative patient and one arterial sample. The task is classification, not treatment.",
    setting: "A surgical ward, two hours after an upper-abdominal operation. The person is awake, in pain, and breathing quickly.",
    stem: "The sample reads pH 7.48, PaCO2 32 mm Hg, PaO2 78 mm Hg, bicarbonate 24 mEq/L, on 2 L/min by nasal cannula. You do not have a prior gas. Pain and a high rate are the history you were given.",
    assumptions: [
      "The sample is arterial and was not delayed.",
      "The teaching intervals are pH 7.35–7.45, PaCO2 35–45, bicarbonate 22–26.",
      "No other laboratory values are available, on purpose.",
    ],
    simplifications: [
      "Real samples have temperature, a source, and a person you can look at. This one has a paragraph.",
      "The case ends when you classify the pattern. It does not let you order a drug.",
    ],
    initial: {
      pH: "7.48",
      "PaCO2": "32 mm Hg",
      "HCO3": "24 mEq/L",
      "PaO2": "78 mm Hg",
      Rate: "26 /min",
    },
    steps: [
      {
        prompt: "Which teaching label fits this single sample?",
        actions: [
          {
            id: "resp-alk",
            label: "Respiratory alkalosis, with a bicarbonate that has not moved much",
            appropriate: true,
            explanation: "The pH is high and the PaCO2 is low. They agree. The bicarbonate is still inside the teaching interval, so a large metabolic compensation is not visible. Pain and a high rate are a plausible reason. Plausible is not proven.",
            vitals: { Interpretation: "Respiratory alkalosis" },
          },
          {
            id: "met-acid",
            label: "Metabolic acidosis, because the person is postoperative",
            appropriate: false,
            explanation: "The setting makes metabolic acidosis worth thinking about. These numbers do not show it. The bicarbonate is 24 and the pH is high.",
            vitals: { Note: "The setting and the sample disagree. Believe the sample, then ask why." },
          },
          {
            id: "fully",
            label: "Fully compensated metabolic alkalosis",
            appropriate: false,
            explanation: "Full compensation would leave the pH inside the interval. This pH is 7.48.",
          },
        ],
      },
      {
        prompt: "What is the honest next educational step?",
        actions: [
          {
            id: "look",
            label: "Look at the person and the oxygen device before adding a diagnosis",
            appropriate: true,
            explanation: "A PaO2 of 78 on 2 L/min may or may not meet the team's goal. The classification of the pH does not answer that, and it does not replace seeing how much work the person is doing.",
          },
          {
            id: "bicarb",
            label: "Recommend intravenous bicarbonate because the carbon dioxide is low",
            appropriate: false,
            explanation: "Bicarbonate is not a treatment for a low PaCO2. This case is not asking for a drug, and that drug would not fit the pattern.",
          },
        ],
      },
    ],
    references: [openstax],
    editorial,
  },
  {
    id: "high-pressure-alarm",
    title: "A high-pressure alarm",
    access: "premium",
    minutes: 10,
    description: "A fictional intubated patient. The cause is written into the case so the feedback can be honest.",
    setting: "An adult intensive care unit. The person is intubated and sedated, volume-targeted at 420 mL, rate 16, PEEP 8.",
    stem: "The peak-pressure alarm is sounding. Peak pressure is 46 cm H2O. A pause shows plateau pressure still 22 cm H2O. Ten minutes ago the peak was 28. The case, which you would not know at a real bedside, is a kinked circuit where it is caught under the rail, plus the person biting the tube.",
    assumptions: [
      "The plateau was measured correctly, with no flow.",
      "The sudden change points to something that changed suddenly: the tube, the circuit, or a new patient effort.",
      "Secretions are not the cause in this authored case. Suctioning is still a reasonable look. It will not fix this one.",
    ],
    simplifications: [
      "Vitals change only when an action in the script says they change.",
      "There is no second diagnosis hiding behind the first.",
    ],
    initial: {
      PIP: "46 cm H2O",
      Pplat: "22 cm H2O",
      "SpO2": "93%",
      "Heart rate": "112",
    },
    steps: [
      {
        prompt: "The peak is high and the plateau is not. What do you check first?",
        actions: [
          {
            id: "circuit",
            label: "Look at the circuit and the mouth before you change the tidal volume",
            appropriate: true,
            explanation: "The gap between peak and plateau is resistance, including the tube and the circuit. A sudden gap is often mechanical. Changing the tidal volume would treat a number you have not understood.",
            vitals: { Finding: "Circuit caught under the rail" },
          },
          {
            id: "volume",
            label: "Drop the tidal volume to 250 mL to silence the alarm",
            appropriate: false,
            explanation: "The alarm is not the problem. A lower volume may hide a kink and underventilate the person. The plateau never asked for a smaller breath.",
            vitals: { PIP: "40 cm H2O", Note: "Still high. The kink is still there." },
          },
        ],
      },
      {
        prompt: "You free the circuit. Peak pressure falls to 34 and then climbs again as the jaw clenches. What fits?",
        actions: [
          {
            id: "bite",
            label: "Recognize biting, and ask for a bite block and a check of sedation rather than more volume",
            appropriate: true,
            explanation: "A clenched jaw occludes the tube. The pressure is real and the lung compliance, given the plateau you already measured, is not the new problem. Sedation decisions belong to the team. The recognition belongs to whoever is standing there.",
            vitals: { PIP: "29 cm H2O", "Heart rate": "96" },
          },
          {
            id: "bronchodilator",
            label: "Start continuous bronchodilator for bronchospasm",
            appropriate: false,
            explanation: "Bronchospasm can widen the peak-to-plateau gap. It does not bite. The jaw was the new finding. A drug aimed at the wrong mechanism delays the fix.",
          },
        ],
      },
    ],
    references: [openstax],
    editorial,
  },
  {
    id: "oxygen-device",
    title: "Choose an oxygen device for a fictional person",
    access: "premium",
    minutes: 8,
    description: "Match a device to a short case. The case is not a protocol for the next person you meet.",
    setting: "An emergency department cubicle.",
    stem: "A person with an acute asthma attack is sitting forward, speaking three words at a time, saturation 88 percent on room air, rate 32. A nasal cannula at 2 L/min is already on from triage and has not changed the saturation. They are still protecting the airway.",
    assumptions: [
      "The saturation reading is real.",
      "Two liters by cannula raises FiO2 only modestly.",
      "This case's authored next step is a higher, controllable FiO2 while bronchodilator treatment starts. It is not a rule for every saturation of 88.",
    ],
    simplifications: ["No blood gas is provided.", "The case stops before drugs and doses, which are not its subject."],
    initial: { "SpO2": "88% on room air, unchanged on 2 L cannula", Rate: "32", Speech: "Three words" },
    steps: [
      {
        prompt: "Which device choice matches this authored case?",
        actions: [
          {
            id: "mask",
            label: "Move to a device that can deliver a higher FiO2, and stay at the bedside",
            appropriate: true,
            explanation: "Two liters did not change the saturation, and the work of breathing is high. A reservoir mask or a high-flow device can raise FiO2 while the team treats the attack. Staying there matters more than the brand name on the device.",
            vitals: { "SpO2": "94% on a reservoir mask" },
          },
          {
            id: "leave",
            label: "Leave the cannula. A saturation of 88 is close enough.",
            appropriate: false,
            explanation: "Eighty-eight percent with that much work is not a stable plan in this case. Close enough is how hypoxemia gets ignored.",
          },
          {
            id: "intubate-now",
            label: "Intubate immediately because the saturation is 88",
            appropriate: false,
            explanation: "Intubation may become necessary. This stem says the person is protecting the airway and has not yet received effective oxygen or bronchodilator. Jumping to a tube because of one saturation skips the steps the case is teaching.",
          },
        ],
      },
    ],
    references: [{
      title: "Global Strategy for Asthma Management and Prevention",
      source: "Global Initiative for Asthma",
      url: "https://ginasthma.org/",
      accessed: "2026-11-23",
    }],
    editorial,
  },
];

export function getSimulation(id: string) {
  return simulations.find((simulation) => simulation.id === id);
}
