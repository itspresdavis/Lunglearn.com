export const calculatorLessons: Record<string, { course: string; slug: string }> = {
  "predicted-body-weight": { course: "gases-and-ventilation", slug: "introduction-to-invasive-ventilation" },
  "static-compliance": { course: "cardiopulmonary", slug: "mechanics-of-breathing" },
  "airway-resistance": { course: "cardiopulmonary", slug: "mechanics-of-breathing" },
  "time-constant": { course: "cardiopulmonary", slug: "mechanics-of-breathing" },
  "oxygen-content": { course: "gases-and-ventilation", slug: "oxygen-content-and-delivery" },
  "oxygen-delivery": { course: "gases-and-ventilation", slug: "oxygen-content-and-delivery" },
  "acid-base": { course: "gases-and-ventilation", slug: "arterial-blood-gas-framework" },
  "winters-formula": { course: "gases-and-ventilation", slug: "arterial-blood-gas-framework" },
};

export const topicStudyLinks: Record<string, { course: string; slug: string; label: string }> = {
  Mechanics: { course: "cardiopulmonary", slug: "mechanics-of-breathing", label: "Mechanics of a quiet breath" },
  Airway: { course: "cardiopulmonary", slug: "airway-nose-to-alveolus", label: "The airway from nose to alveolus" },
  Ventilation: { course: "gases-and-ventilation", slug: "introduction-to-invasive-ventilation", label: "A first look at invasive ventilation" },
  Oxygenation: { course: "gases-and-ventilation", slug: "oxygen-content-and-delivery", label: "Oxygen content and delivery" },
  "Blood gas": { course: "gases-and-ventilation", slug: "arterial-blood-gas-framework", label: "A framework for arterial blood gases" },
  Credential: { course: "foundations", slug: "what-respiratory-therapy-studies", label: "What respiratory therapy studies" },
};
