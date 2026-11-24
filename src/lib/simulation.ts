export type SimAction = {
  id: string;
  label: string;
  appropriate: boolean;
  explanation: string;
  vitals?: Record<string, string>;
};

export type SimStep = {
  prompt: string;
  actions: SimAction[];
};

export type SimScenario = {
  id: string;
  title: string;
  access: "free" | "premium";
  minutes: number;
  setting: string;
  stem: string;
  assumptions: string[];
  simplifications: string[];
  initial: Record<string, string>;
  steps: SimStep[];
};

export type SimSnapshot = {
  scenarioId: string;
  step: number;
  vitals: Record<string, string>;
  log: { actionId: string; appropriate: boolean; explanation: string }[];
  completed: boolean;
};

export function startSimulation(scenario: SimScenario): SimSnapshot {
  return {
    scenarioId: scenario.id,
    step: 0,
    vitals: { ...scenario.initial },
    log: [],
    completed: false,
  };
}

export function applySimulationAction(
  scenario: SimScenario,
  snapshot: SimSnapshot,
  actionId: string,
): SimSnapshot | { error: string } {
  if (snapshot.completed) return { error: "This case is already complete." };
  const step = scenario.steps[snapshot.step];
  if (!step) return { error: "This case has no further decision." };
  const action = step.actions.find((candidate) => candidate.id === actionId);
  if (!action) return { error: "That action is not part of this decision." };
  const vitals = { ...snapshot.vitals, ...action.vitals };
  const log = [...snapshot.log, { actionId, appropriate: action.appropriate, explanation: action.explanation }];
  if (!action.appropriate) {
    return { ...snapshot, vitals, log };
  }
  const next = snapshot.step + 1;
  const completed = next >= scenario.steps.length;
  return { scenarioId: scenario.id, step: completed ? snapshot.step : next, vitals, log, completed };
}
