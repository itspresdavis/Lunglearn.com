export type ReviewGrade = 0 | 1 | 2 | 3 | 4 | 5;

export type SrsCard = {
  ease: number;
  intervalDays: number;
  repetitions: number;
  dueOn: string;
};

function addDays(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function startingCard(today: string): SrsCard {
  return { ease: 2.5, intervalDays: 0, repetitions: 0, dueOn: today };
}

export function reviewCard(card: SrsCard, grade: ReviewGrade, today: string): SrsCard {
  let ease = card.ease + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
  if (ease < 1.3) ease = 1.3;
  if (grade < 3) {
    return { ease, intervalDays: 1, repetitions: 0, dueOn: addDays(today, 1) };
  }
  const repetitions = card.repetitions + 1;
  let intervalDays = 1;
  if (repetitions === 1) intervalDays = 1;
  else if (repetitions === 2) intervalDays = 6;
  else intervalDays = Math.round(card.intervalDays * ease);
  return { ease, intervalDays, repetitions, dueOn: addDays(today, intervalDays) };
}
