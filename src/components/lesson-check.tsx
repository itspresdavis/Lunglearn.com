"use client";

import { useState } from "react";

export type LessonCheckItem = {
  question: string;
  choices: string[];
  answer: number;
  explanation: string;
};

export function LessonChecks({ checks }: { checks: LessonCheckItem[] }) {
  const [picked, setPicked] = useState<Record<number, number>>({});
  return (
    <div className="lesson-checks">
      {checks.map((check, index) => {
        const choice = picked[index];
        const answered = choice !== undefined;
        const matched = choice === check.answer;
        return (
          <fieldset key={check.question} className="lesson-check">
            <legend>{check.question}</legend>
            <div className="lesson-check-options">
              {check.choices.map((label, option) => (
                <button
                  key={label}
                  type="button"
                  className="btn-quiet"
                  aria-pressed={choice === option}
                  disabled={answered}
                  onClick={() => setPicked((current) => ({ ...current, [index]: option }))}
                >
                  {label}
                </button>
              ))}
            </div>
            {answered ? (
              <p>{matched ? "That matches this lesson." : "That does not match this lesson."} {check.explanation}</p>
            ) : (
              <p className="muted">Choose one answer. The explanation stays hidden until you do.</p>
            )}
          </fieldset>
        );
      })}
    </div>
  );
}
