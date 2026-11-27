import type { EditorialRecord, Reference } from "@/lib/editorial";
import type { Block } from "@/content/career";

const openstax: Reference = {
  title: "Anatomy and Physiology 2e",
  source: "OpenStax",
  url: "https://openstax.org/details/books/anatomy-and-physiology-2e",
  accessed: "2026-11-23",
};

const lungs: Reference = {
  title: "Anatomy and Physiology 2e, The Lungs",
  source: "OpenStax",
  url: "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-2-the-lungs",
  accessed: "2026-11-23",
};

const ardsnet: Reference = {
  title: "Ventilation with lower tidal volumes as compared with traditional tidal volumes for acute lung injury and the acute respiratory distress syndrome",
  source: "Acute Respiratory Distress Syndrome Network. New England Journal of Medicine",
  url: "https://doi.org/10.1056/NEJM200005043421801",
  published: "2000",
};

const teaching: EditorialRecord = {
  status: "clinical_review_required",
  version: 1,
  contentClass: "clinical_education",
  author: "Lung Learn editorial desk",
  reviewer: null,
  reviewedOn: null,
  publishedOn: null,
  corrections: [],
};

export type Lesson = {
  slug: string;
  course: string;
  title: string;
  level: "beginner" | "intermediate" | "advanced";
  minutes: number;
  access: "free" | "premium";
  objectives: string[];
  blocks: Block[];
  terms: { term: string; definition: string }[];
  clinical: string[];
  example: { title: string; steps: string[] } | null;
  misconceptions: { myth: string; correction: string }[];
  checks: { question: string; choices: string[]; answer: number; explanation: string }[];
  related: string[];
  anatomy: string[];
  tools: { href: string; label: string }[];
  references: Reference[];
  editorial: EditorialRecord;
};

export type Course = {
  slug: string;
  title: string;
  level: "beginner" | "intermediate" | "advanced";
  summary: string;
};

export const courses: Course[] = [
  { slug: "foundations", title: "Foundations of respiratory care", level: "beginner", summary: "What the profession studies, the language it uses, and the obligations that come with the license." },
  { slug: "cardiopulmonary", title: "Cardiopulmonary anatomy and physiology", level: "beginner", summary: "The airway, the lungs, and the mechanics of a quiet breath." },
  { slug: "gases-and-ventilation", title: "Gases, blood, and ventilation", level: "intermediate", summary: "Oxygen content, blood gases, and a first look at invasive ventilation." },
];

export const lessons: Lesson[] = [
  {
    slug: "what-respiratory-therapy-studies",
    course: "foundations",
    title: "What respiratory therapy studies",
    level: "beginner",
    minutes: 20,
    access: "free",
    objectives: [
      "Describe the scope of respiratory therapy without confusing it with nursing or medicine.",
      "Separate a national description of the job from a promise about your own career.",
    ],
    blocks: [
      { type: "p", text: "Respiratory therapy is the clinical discipline concerned with breathing: the assessment of it, the devices and medications that support it, and the tests that measure it. A therapist does not become a physician by learning to read a ventilator, and a nurse does not become a therapist by working in the same room. The licenses are different because the education and the examinations are different." },
      { type: "p", text: "The Bureau of Labor Statistics describes the work as interviewing and examining people with cardiopulmonary disorders, consulting with physicians, performing diagnostic tests, giving treatment, recording the response, and teaching people to use equipment. Hospitals employ most therapists. The work includes nights and the risk of infection and injury. Those are features of the job, not footnotes." },
      { type: "h", text: "How this academy uses that fact" },
      { type: "p", text: "Later lessons go into the airway, the blood gas, and the ventilator. They are educational drafts. A named clinical reviewer has not signed them. They will not tell you what to do for a person in a bed you can see. They will try to make the public, standard ideas precise enough that a later reviewer, and you, can argue with them." },
    ],
    terms: [
      { term: "CRT", definition: "Certified Respiratory Therapist, the NBRC credential earned at the lower cut score of the entry examination." },
      { term: "RRT", definition: "Registered Respiratory Therapist, the NBRC credential earned at the higher cut score under the current rules, and by the Clinical Simulation Examination under the rules in effect through 2026." },
    ],
    clinical: ["A credential is not a license. The state still has to grant permission to practice."],
    example: null,
    misconceptions: [
      { myth: "Respiratory therapy is nursing with a different badge.", correction: "The education, the examination, and the legal scope are different. The professions collaborate." },
    ],
    checks: [
      {
        question: "Which statement matches the Bureau of Labor Statistics description?",
        choices: [
          "Respiratory therapists are licensed in every state, including Alaska.",
          "The usual entry education is an associate degree, and licensure is required in every state except Alaska.",
          "A bachelor's degree is required in every state before the NBRC examination.",
        ],
        answer: 1,
        explanation: "BLS describes an associate degree as typical and says licensure is required except in Alaska, where national certification is recommended.",
      },
    ],
    related: ["cardiopulmonary-terminology", "professional-ethics"],
    anatomy: ["text-lung"],
    tools: [],
    references: [
      {
        title: "Respiratory Therapists",
        source: "U.S. Bureau of Labor Statistics, Occupational Outlook Handbook",
        url: "https://www.bls.gov/ooh/healthcare/respiratory-therapists.htm",
        accessed: "2026-11-23",
      },
    ],
    editorial: teaching,
  },
  {
    slug: "cardiopulmonary-terminology",
    course: "foundations",
    title: "Cardiopulmonary terminology",
    level: "beginner",
    minutes: 25,
    access: "free",
    objectives: ["Use a small set of word parts accurately.", "Avoid treating a word root as a diagnosis."],
    blocks: [
      { type: "p", text: "The vocabulary is mostly Latin and Greek parts stacked together. Pulmo- refers to the lung. Pneumo- can refer to air or to the lung, which is why pneumothorax and pneumonia are not the same word. -itis means inflammation. -ectomy means removal. Brady- is slow and tachy- is fast. Hypo- is below and hyper- is above, and both of them need a noun: hypoxia is not the same measurement as hypoxemia." },
      { type: "p", text: "Hypoxemia means a low oxygen tension or content in the blood. Hypoxia means that tissues are short of oxygen. A person can have one without the other, for example when anemia limits content while the PaO2 is ordinary, or when a cold extremity is poorly perfused while the arterial blood is well oxygenated. The words are only useful if you keep the distinction." },
      { type: "h", text: "Ventilation and oxygenation" },
      { type: "p", text: "Ventilation is the movement of air. Oxygenation, in bedside speech, usually means how well that air raises the oxygen in arterial blood. A person can move a great deal of air and still oxygenate poorly if the air is not meeting blood, and can oxygenate acceptably while failing to clear carbon dioxide. The two words are not compliments you pay a ventilator." },
    ],
    terms: [
      { term: "Hypoxemia", definition: "Low oxygen in the blood, usually discussed as a low PaO2 or a low saturation." },
      { term: "Hypercapnia", definition: "A high arterial carbon dioxide tension." },
      { term: "Tidal volume", definition: "The volume of one ordinary breath." },
      { term: "FiO2", definition: "The fraction of inspired oxygen, from 0.21 in room air toward 1.0." },
    ],
    clinical: ["Write the number and the unit. “Oxygen was low” is not a result a colleague can use."],
    example: {
      title: "Reading a phrase",
      steps: [
        "“Tachypnea with hypoxemia” says the rate is high and the blood oxygen is low.",
        "It does not say why, and it does not say which device to reach for.",
      ],
    },
    misconceptions: [
      { myth: "Saturation and PaO2 are the same fact.", correction: "Saturation is the percent of available hemoglobin that is carrying oxygen. PaO2 is a dissolved-gas tension. They move together on the oxyhemoglobin curve, and they are not interchangeable." },
    ],
    checks: [
      {
        question: "Which pair is the accurate distinction?",
        choices: [
          "Hypoxemia is tissue oxygen; hypoxia is the PaO2.",
          "Hypoxemia refers to blood oxygen; hypoxia refers to tissue oxygen.",
          "The two words are synonyms and may be swapped in a chart.",
        ],
        answer: 1,
        explanation: "The prefixes point at the same problem, but the words locate it in blood or in tissue.",
      },
    ],
    related: ["what-respiratory-therapy-studies", "oxygen-content-and-delivery"],
    anatomy: ["text-alveolus"],
    tools: [],
    references: [openstax],
    editorial: teaching,
  },
  {
    slug: "airway-nose-to-alveolus",
    course: "cardiopulmonary",
    title: "The airway from nose to alveolus",
    level: "beginner",
    minutes: 30,
    access: "free",
    objectives: [
      "Trace conducting airways separately from gas-exchange regions.",
      "Name the carina and the two main bronchi without inventing a depth for a tube.",
    ],
    blocks: [
      { type: "p", text: "Air enters through the nose or the mouth. The nose warms, humidifies, and filters. The pharynx is a shared corridor for air and food. The larynx guards the opening to the trachea and holds the vocal folds. Below the cricoid cartilage, the trachea is a stack of C-shaped cartilages with a soft posterior wall against the esophagus." },
      { type: "p", text: "The trachea ends at the carina, where it divides. The right main bronchus is wider, shorter, and more vertical. The left is longer and more horizontal. Lobar bronchi, then segmental bronchi, then smaller bronchi and bronchioles follow. Gas exchange begins as alveoli appear, in respiratory bronchioles and alveolar ducts, and it is the work of the alveolar region. Cartilage disappears as the airways get small. Smooth muscle does not, which is why a bronchiole can narrow." },
      { type: "h", text: "What the model on this site actually contains" },
      { type: "p", text: "The thoracic model includes a trachea, both main bronchi, many segmental bronchi, laryngeal cartilages, and the diaphragm, taken from BodyParts3D. It does not include lung tissue, pleura, or alveoli. Those structures have text records. A schematic of an alveolus is labeled as a schematic. Treating the bronchial tree as if it were the lung would be a mistake the site is built to avoid." },
    ],
    terms: [
      { term: "Carina", definition: "The ridge at the split of the trachea." },
      { term: "Conducting zone", definition: "Airways that move air and do not exchange gas." },
      { term: "Bronchopulmonary segment", definition: "A portion of lung supplied by a segmental bronchus and a segmental pulmonary artery." },
    ],
    clinical: ["A tube past the carina into the right main bronchus leaves the left lung unventilated. Listen and look. Do not trust a centimeter mark alone."],
    example: {
      title: "Why the right side",
      steps: [
        "The right main bronchus continues the line of the trachea more closely than the left.",
        "An object that falls down the airway, or a tube that is pushed too far, more often follows that line.",
        "More often is a statement about anatomy, not a guarantee about the person in front of you.",
      ],
    },
    misconceptions: [
      { myth: "The entire lung is visible once the bronchi are on the screen.", correction: "Bronchi are airways. The lung parenchyma and the pleura are separate structures, and they are absent from the current mesh set." },
    ],
    checks: [
      {
        question: "Which description of the main bronchi is the usual one?",
        choices: [
          "The left is shorter and more vertical.",
          "The right is shorter, wider, and more vertical.",
          "They are symmetrical.",
        ],
        answer: 1,
        explanation: "The right main bronchus is the shorter, wider, more vertical of the two.",
      },
    ],
    related: ["mechanics-of-breathing"],
    anatomy: ["fma-7394", "fma-7396", "fma-68418", "text-carina", "text-alveolus"],
    tools: [],
    references: [lungs, openstax],
    editorial: teaching,
  },
  {
    slug: "mechanics-of-breathing",
    course: "cardiopulmonary",
    title: "Mechanics of a quiet breath",
    level: "intermediate",
    minutes: 30,
    access: "premium",
    objectives: [
      "Explain inspiration as a pressure change caused by the diaphragm.",
      "Separate compliance from resistance.",
    ],
    blocks: [
      { type: "p", text: "A quiet breath in is muscular. The diaphragm contracts and its dome descends. External intercostal muscles lift and rotate the ribs. Thoracic volume increases. Pleural pressure becomes more negative. Alveolar pressure falls a little below atmospheric pressure, and air flows in until the pressures are nearly equal again. Quiet expiration is mostly elastic recoil. The muscles let go, the lung and chest wall spring back, alveolar pressure rises a little above atmospheric pressure, and air flows out." },
      { type: "h", text: "Compliance and resistance" },
      { type: "p", text: "Compliance is how much volume changes for a change in pressure. A stiff lung, as in fibrosis, takes more pressure for the same volume. A lung that has lost recoil, as in emphysema, can be very compliant and still be hard to empty. Resistance is how much pressure it takes to push flow through the tubes. Narrow tubes, as in asthma, raise resistance. The two problems feel different on a ventilator: one shows up between peak and plateau pressure, and the other shows up in the pressure required to hold the plateau." },
      { type: "p", text: "The time constant is resistance multiplied by compliance. A long time constant means the lung fills and empties slowly. That is why a fast rate can trap gas even when each breath looks acceptable on its own. The calculator on this site does the multiplication and labels it as an education tool." },
      { type: "note", text: "Any motion applied to the diaphragm mesh in the atlas is a simplified excursion so you can see the direction of the dome. It is not a measured tidal volume and it is not a prediction of work of breathing." },
    ],
    terms: [
      { term: "Compliance", definition: "Volume change divided by pressure change." },
      { term: "Resistance", definition: "The pressure difference required to produce flow." },
      { term: "Plateau pressure", definition: "The airway pressure during a pause with no flow, used to estimate elastic recoil." },
    ],
    clinical: ["Peak pressure much higher than plateau pressure points toward resistance. A high plateau points toward stiffness or too much volume."],
    example: {
      title: "A teaching pause",
      steps: [
        "Tidal volume 500 mL, plateau 25 cm H2O, PEEP 5 cm H2O.",
        "Static compliance = 500 ÷ (25 − 5) = 25 mL/cm H2O.",
        "The number describes this set of inputs. It does not say whether 25 is acceptable for a person.",
      ],
    },
    misconceptions: [
      { myth: "A high peak pressure always means the lung is stiff.", correction: "Peak pressure includes the pressure spent on flow. Plateau pressure is the one that speaks to elastic recoil." },
    ],
    checks: [
      {
        question: "Quiet expiration is mainly:",
        choices: ["Contraction of the diaphragm", "Elastic recoil", "Contraction of the sternocleidomastoid"],
        answer: 1,
        explanation: "The inspiratory muscles stop, and recoil empties the lung. Accessory muscles are for increased demand, not for a quiet breath out.",
      },
    ],
    related: ["airway-nose-to-alveolus", "introduction-to-invasive-ventilation"],
    anatomy: ["fma-13295", "fma-9756", "text-pleura"],
    tools: [
      { href: "/calculators/static-compliance", label: "Static compliance" },
      { href: "/calculators/airway-resistance", label: "Airway resistance" },
      { href: "/calculators/time-constant", label: "Time constant" },
    ],
    references: [lungs, openstax],
    editorial: teaching,
  },
  {
    slug: "oxygen-content-and-delivery",
    course: "gases-and-ventilation",
    title: "Oxygen content and delivery",
    level: "intermediate",
    minutes: 30,
    access: "premium",
    objectives: [
      "Calculate arterial oxygen content with the constants this site declares.",
      "Explain why saturation alone misses anemia and cardiac output.",
    ],
    blocks: [
      { type: "p", text: "Almost all of the oxygen in blood is bound to hemoglobin. A small amount is dissolved. The teaching equation used here is CaO2 = (1.34 × hemoglobin × saturation) + (0.0031 × PaO2), with saturation as a fraction and the result in mL of oxygen per dL of blood. The constants 1.34 and 0.0031 are conventions. Other texts use 1.36 or 1.39, and 0.003. The difference matters when you compare two calculations, so this site always shows the constants it used." },
      { type: "p", text: "Delivery to the tissues is content times cardiac output, with a factor of 10 to convert dL to L. A saturation of 100 percent and a hemoglobin of 6 g/dL is not the same delivery as a saturation of 100 percent and a hemoglobin of 14. A normal content and a cardiac output of 2 L/min is not the same delivery as a cardiac output of 5. The pulse oximeter cannot see either problem." },
      { type: "note", text: "The calculator will not tell you to transfuse or to start a drug. It will do arithmetic and list the assumptions." },
    ],
    terms: [
      { term: "CaO2", definition: "Arterial oxygen content." },
      { term: "DO2", definition: "Oxygen delivery, content times cardiac output." },
    ],
    clinical: ["Read hemoglobin and cardiac output before you declare that oxygenation is fine because the saturation is 98 percent."],
    example: {
      title: "Bound plus dissolved",
      steps: [
        "Hemoglobin 15 g/dL, saturation 1.0, PaO2 100 mm Hg.",
        "Bound = 1.34 × 15 × 1 = 20.1 mL/dL.",
        "Dissolved = 0.0031 × 100 = 0.31 mL/dL.",
        "Content is about 20.4 mL/dL. The dissolved share is small at this PaO2.",
      ],
    },
    misconceptions: [
      { myth: "Raising FiO2 always fixes low oxygen delivery.", correction: "FiO2 raises PaO2 and, if saturation was low, the bound portion. It does not raise hemoglobin or cardiac output." },
    ],
    checks: [
      {
        question: "At ordinary PaO2, most arterial oxygen is:",
        choices: ["Dissolved in plasma", "Bound to hemoglobin", "Carried as bicarbonate"],
        answer: 1,
        explanation: "The bound term dominates. Dissolved oxygen becomes a larger share only at very high PaO2, and bicarbonate is how carbon dioxide is carried.",
      },
    ],
    related: ["arterial-blood-gas-framework"],
    anatomy: ["text-alveolus"],
    tools: [
      { href: "/calculators/oxygen-content", label: "Arterial oxygen content" },
      { href: "/calculators/oxygen-delivery", label: "Oxygen delivery" },
    ],
    references: [openstax],
    editorial: teaching,
  },
  {
    slug: "arterial-blood-gas-framework",
    course: "gases-and-ventilation",
    title: "A framework for arterial blood gases",
    level: "intermediate",
    minutes: 35,
    access: "premium",
    objectives: [
      "Use pH, PaCO2, and bicarbonate in that order.",
      "Refuse a single label when the pattern is mixed or fully compensated.",
    ],
    blocks: [
      { type: "p", text: "Start with the pH. Below 7.35, in the adult interval this site uses, the blood is acidemic. Above 7.45 it is alkalemic. Then ask which of PaCO2 or bicarbonate is pushing in that same direction. A high PaCO2 pushes toward acid. A low bicarbonate pushes toward acid. The one that agrees with the pH is the leading process in a simple disorder. The other may be compensating." },
      { type: "p", text: "These intervals — pH 7.35 to 7.45, PaCO2 35 to 45 mm Hg, bicarbonate 22 to 26 mEq/L — are teaching intervals. They are not every laboratory's reference range, and they are not adjusted for a person who lives with chronic carbon dioxide retention. Temperature changes the values. Three numbers cannot tell you the history." },
      { type: "h", text: "Compensation is a check, not a treatment" },
      { type: "p", text: "For a metabolic acidosis, Winter's formula estimates the PaCO2 you would expect if the lungs were compensating: 1.5 times the bicarbonate, plus 8, plus or minus 2. If the measured PaCO2 is far from that band, a second process is likely. For respiratory disorders, the expected bicarbonate change depends on whether the disorder is acute or chronic, and the blood gas does not contain a clock. The acid-base tool shows both expectations and stops there." },
    ],
    terms: [
      { term: "Acidemia", definition: "A low blood pH." },
      { term: "Acidosis", definition: "The process pushing the pH down. The pH itself may still be inside the interval if compensation is complete." },
    ],
    clinical: ["Do not give bicarbonate because a formula produced a number. The formula is a description of the sample."],
    example: {
      title: "A simple respiratory pattern",
      steps: [
        "pH 7.25, PaCO2 60 mm Hg, bicarbonate 26 mEq/L.",
        "The pH is low and the PaCO2 is high, so the leading process is respiratory acidosis.",
        "The bicarbonate has barely moved, which fits an acute time course better than a chronic one. You still do not know the cause.",
      ],
    },
    misconceptions: [
      { myth: "A normal pH means the gas is normal.", correction: "Both PaCO2 and bicarbonate can be abnormal and leave the pH inside the interval. That pattern needs a second look, not a signature that says unremarkable." },
    ],
    checks: [
      {
        question: "pH 7.25 and PaCO2 60 mm Hg, with bicarbonate still near 26, is first called:",
        choices: ["Metabolic alkalosis", "Respiratory acidosis", "A fully compensated metabolic acidosis"],
        answer: 1,
        explanation: "The low pH and the high PaCO2 agree. The bicarbonate has not made a large chronic-style move.",
      },
    ],
    related: ["oxygen-content-and-delivery", "introduction-to-invasive-ventilation"],
    anatomy: ["text-alveolus"],
    tools: [
      { href: "/calculators/acid-base", label: "Acid-base compensation check" },
      { href: "/calculators/winters-formula", label: "Winter's formula" },
    ],
    references: [openstax],
    editorial: teaching,
  },
  {
    slug: "introduction-to-invasive-ventilation",
    course: "gases-and-ventilation",
    title: "A first look at invasive ventilation",
    level: "advanced",
    minutes: 35,
    access: "premium",
    objectives: [
      "Describe what a ventilator is doing in volume- and pressure-targeted breaths.",
      "Use predicted body weight as the height-based number it is, not as a prescription you invented.",
    ],
    blocks: [
      { type: "p", text: "An invasive ventilator blows gas into the lungs through a tube in the trachea. In a volume-targeted breath it aims at a tidal volume and lets the pressure be whatever the lungs and the tube require. In a pressure-targeted breath it aims at a pressure and lets the volume be whatever results. Neither mode knows the diagnosis. Both can injure a lung if the volume or the pressure is excessive, and both can fail to ventilate if they are timid in the wrong direction." },
      { type: "p", text: "The ARDS Network tidal-volume trial used 6 mL per kilogram of predicted body weight, not actual body weight. Predicted weight comes from height and sex: 50 + 0.91 × (height in centimeters − 152.4) for adult men, and 45.5 + 0.91 × (height in centimeters − 152.4) for adult women. That trial was about acute lung injury and ARDS. Copying 6 mL/kg into every patient on a ventilator is a slogan, not the trial. The calculator gives the weight. A clinician decides the volume." },
      { type: "h", text: "Two pressures worth naming" },
      { type: "p", text: "Peak inspiratory pressure is the highest pressure during the breath. Plateau pressure is the pressure when flow has stopped. Their difference, divided by flow in liters per second, estimates resistance. Plateau pressure minus PEEP, divided into the tidal volume, estimates compliance. Alarms exist because tubes kink, patients bite, secretions collect, and lungs flood. The troubleshooting simulation on this site is a fictional case with the cause written down in advance. It is practice in noticing, not a protocol." },
    ],
    terms: [
      { term: "PEEP", definition: "Positive end-expiratory pressure, the pressure left in the airway at the end of expiration." },
      { term: "Predicted body weight", definition: "A height-and-sex estimate used to scale tidal volume in the ARDS Network trial." },
    ],
    clinical: ["Always ask whose height the weight was calculated from, and whether the person is in the population the equation was built for."],
    example: {
      title: "Predicted weight, not a tidal volume order",
      steps: [
        "An adult man who is 180 cm tall.",
        "PBW = 50 + 0.91 × (180 − 152.4) = 75.1 kg.",
        "Six mL per kilogram of that weight is about 451 mL. Whether that volume is appropriate is a clinical question this lesson does not answer.",
      ],
    },
    misconceptions: [
      { myth: "Actual body weight is the right denominator for an ARDS Network tidal volume.", correction: "The trial used predicted body weight from height and sex. Actual weight includes tissue that is not lung." },
    ],
    checks: [
      {
        question: "Plateau pressure is measured when:",
        choices: ["Flow is zero during an inspiratory pause", "Flow is at its peak", "The patient is exhaling as fast as possible"],
        answer: 0,
        explanation: "The pause removes the flow-related pressure so the remaining pressure reflects elastic recoil and PEEP.",
      },
    ],
    related: ["mechanics-of-breathing", "arterial-blood-gas-framework"],
    anatomy: ["fma-7394", "text-lung", "text-alveolus"],
    tools: [
      { href: "/calculators/predicted-body-weight", label: "Predicted body weight" },
      { href: "/calculators/static-compliance", label: "Static compliance" },
      { href: "/calculators/airway-resistance", label: "Airway resistance" },
    ],
    references: [ardsnet, lungs],
    editorial: teaching,
  },
  {
    slug: "professional-ethics",
    course: "foundations",
    title: "Professional obligations",
    level: "beginner",
    minutes: 20,
    access: "free",
    objectives: [
      "Separate education on this site from an order for a patient.",
      "Name the duty to speak up about a number that does not make sense.",
    ],
    blocks: [
      { type: "p", text: "A respiratory therapist handles information that can hurt someone if it is casual: blood gases, ventilator settings, and the story a family tells at two in the morning. The duty is ordinary. Record what you did. Do not record what you meant to do. If a number disagrees with the person in the bed, believe that you might be the one who is wrong and check the sample, the device, and the patient before you build a theory." },
      { type: "p", text: "This website is not a medical device and it is not a covering clinician. Calculators refuse to produce an order. Simulations use fictional people and say so. If you are a student, your clinical instructor and the hospital's protocol outrank a lesson. If you are licensed, your own scope and the patient's physician outrank it too." },
      { type: "p", text: "There is also a duty to the next reader of this site. If a page is wrong, use the correction link. The editorial queue can unpublish a page. Leaving a known error up because it is useful for an examination is not a kindness." },
    ],
    terms: [
      { term: "Scope of practice", definition: "The work a license and a facility actually allow a person to do." },
    ],
    clinical: ["An educational example that uses round numbers is not a chart you can copy."],
    example: null,
    misconceptions: [
      { myth: "If the calculator produced a result, the result is an order.", correction: "The result is arithmetic. Orders come from a clinician who knows the person." },
    ],
    checks: [
      {
        question: "A lesson and a hospital protocol disagree. Which one governs care in that hospital?",
        choices: ["The lesson, because it was updated more recently", "The hospital protocol and the supervising clinician", "Whichever one the student prefers"],
        answer: 1,
        explanation: "Lung Learn is an education site. It does not replace a facility's protocol or a clinician's order.",
      },
    ],
    related: ["what-respiratory-therapy-studies"],
    anatomy: [],
    tools: [],
    references: [
      {
        title: "Respiratory Therapists",
        source: "U.S. Bureau of Labor Statistics, Occupational Outlook Handbook",
        url: "https://www.bls.gov/ooh/healthcare/respiratory-therapists.htm",
        accessed: "2026-11-23",
        note: "Cited for the occupational context of the work, not as an ethics code.",
      },
    ],
    editorial: teaching,
  },
];

export function getCourse(slug: string) {
  return courses.find((course) => course.slug === slug);
}

export function lessonsIn(course: string) {
  return lessons.filter((lesson) => lesson.course === course);
}

export function getLesson(course: string, slug: string) {
  return lessons.find((lesson) => lesson.course === course && lesson.slug === slug);
}

export function findLesson(slug: string) {
  return lessons.find((lesson) => lesson.slug === slug);
}

export function lessonByKey(key: string) {
  const slash = key.indexOf("/");
  if (slash <= 0) return undefined;
  return getLesson(key.slice(0, slash), key.slice(slash + 1));
}

export function coursePlace(lesson: Lesson) {
  const group = lessonsIn(lesson.course);
  const index = group.findIndex((item) => item.slug === lesson.slug);
  return {
    index,
    total: group.length,
    previous: index > 0 ? group[index - 1] : undefined,
    next: index >= 0 && index < group.length - 1 ? group[index + 1] : undefined,
  };
}
