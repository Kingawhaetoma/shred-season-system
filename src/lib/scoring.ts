import type { DailyLog } from "@prisma/client";
import { CALORIE_RANGE, PROTEIN_GOAL, STEPS_GOAL } from "@/lib/constants";

type ScoreSource = Pick<
  DailyLog,
  "caloriesIn" | "protein" | "steps" | "noNightEating" | "stayedOnPlan"
>;

export type ScoreBreakdown = {
  total: number;
  caloriesInRange: boolean;
  proteinHit: boolean;
  stepsHit: boolean;
  noNightEating: boolean;
  stayedOnPlan: boolean;
  details: Array<{
    label: string;
    met: boolean;
  }>;
};

export function getScoreBreakdown(log: ScoreSource): ScoreBreakdown {
  const caloriesInRange =
    log.caloriesIn !== null &&
    log.caloriesIn >= CALORIE_RANGE.min &&
    log.caloriesIn <= CALORIE_RANGE.max;
  const proteinHit = log.protein !== null && log.protein >= PROTEIN_GOAL;
  const stepsHit = log.steps !== null && log.steps >= STEPS_GOAL;

  const details = [
    { label: "Calories in range", met: caloriesInRange },
    { label: `Protein ${PROTEIN_GOAL}g+`, met: proteinHit },
    { label: `Steps ${STEPS_GOAL.toLocaleString()}+`, met: stepsHit },
    { label: "No night eating", met: log.noNightEating },
    { label: "Stayed on plan", met: log.stayedOnPlan },
  ];

  return {
    total: details.filter((detail) => detail.met).length,
    caloriesInRange,
    proteinHit,
    stepsHit,
    noNightEating: log.noNightEating,
    stayedOnPlan: log.stayedOnPlan,
    details,
  };
}
