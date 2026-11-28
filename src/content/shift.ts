export const shiftTools = [
  { slug: "predicted-body-weight", why: "Height and sex, then the 6 mL/kg figure as arithmetic." },
  { slug: "pf-ratio", why: "Where the ratio sits in the Berlin oxygenation bands." },
  { slug: "rsbi", why: "The index next to the Yang and Tobin landmark of 105." },
  { slug: "static-compliance", why: "Tidal volume divided by plateau pressure minus PEEP." },
  { slug: "airway-resistance", why: "The gap between peak and plateau, divided by flow." },
  { slug: "cylinder-duration", why: "A conventional estimate of minutes left in an E or H cylinder." },
  { slug: "minute-ventilation", why: "Tidal volume times rate, in liters per minute." },
  { slug: "acid-base", why: "pH, PaCO2, and bicarbonate, in that order." },
] as const;

export const shiftSituations = [
  {
    title: "The peak pressure is high",
    checks: [
      "Compare peak pressure with plateau pressure before changing the tidal volume.",
      "A sudden gap between them points at the circuit, the tube, biting, secretions, or bronchospasm.",
      "A high plateau points at stiffness or volume. Silencing the alarm is not the same as finding the cause.",
    ],
    simulation: "high-pressure-alarm",
    calculators: ["airway-resistance", "static-compliance"],
  },
  {
    title: "The saturation fell",
    checks: [
      "Look at the person and the probe before trusting the number.",
      "Note the device and flow already in use, and whether the saturation changed after that device.",
      "A blood gas, if you have one, can be read as a P/F ratio. The ratio does not choose the next device.",
    ],
    simulation: "oxygen-device",
    calculators: ["pf-ratio"],
  },
  {
    title: "The person looks worse than the gas",
    checks: [
      "A gas is one sample. Look at the rate, the work of breathing, and whether the saturation matches the story.",
      "Read pH, then PaCO2, then bicarbonate. A normal pH can still hide two abnormal values.",
      "The sample does not outrank the person in the bed.",
    ],
    simulation: "abg-ward-round",
    calculators: ["acid-base"],
  },
] as const;
