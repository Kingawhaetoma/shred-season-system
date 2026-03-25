import { format, subDays } from "date-fns";
import { CALORIE_RANGE, PROTEIN_GOAL } from "../src/lib/constants";

type SampleLog = {
  date: string;
  weight: number;
  calories: number;
  protein: number;
  steps: number;
  water: number;
  fastingHours: number;
  stayedOnPlan: boolean;
  noNightEating: boolean;
  isSample: boolean;
};

export function buildSampleLogs(today = new Date()): SampleLog[] {
  return Array.from({ length: 28 }, (_, index) => {
    const dayOffset = 27 - index;
    const date = format(subDays(today, dayOffset), "yyyy-MM-dd");
    const patternIndex = index % 7;

    const baseWeight = 246.6 - index * 0.25;
    let weight = Number(
      (baseWeight + [0.4, 0.2, 0.1, 0.35, 0.15, -0.05, -0.25][patternIndex]).toFixed(1),
    );
    let calories = [2240, 2080, 1960, 2360, 2480, 2140, 2010][patternIndex];
    let protein = [192, 181, 188, 170, 156, 184, 194][patternIndex];
    let steps = [12600, 10950, 9800, 11400, 7600, 10250, 14100][patternIndex];
    let water = [3.9, 3.5, 3.7, 3.1, 2.8, 3.4, 4.0][patternIndex];
    let fastingHours = [15.5, 16, 14.5, 13.5, 12.5, 15, 16.5][patternIndex];
    let stayedOnPlan = [true, true, true, false, false, true, true][patternIndex];
    let noNightEating = [true, true, true, false, false, true, true][patternIndex];

    if (dayOffset === 4) {
      calories = 2780;
      protein = 151;
      steps = 6200;
      water = 2.6;
      fastingHours = 11.5;
      stayedOnPlan = false;
      noNightEating = false;
    }

    if (dayOffset === 3) {
      calories = 2620;
      protein = 144;
      steps = 4800;
      water = 2.4;
      fastingHours = 10.5;
      stayedOnPlan = false;
      noNightEating = false;
    }

    if (dayOffset === 1) {
      calories = 2490;
      protein = 158;
      steps = 7100;
      water = 2.9;
      fastingHours = 12;
      stayedOnPlan = false;
      noNightEating = false;
    }

    if (dayOffset === 0) {
      weight = Number((weight - 0.5).toFixed(1));
      calories = 2085;
      protein = 196;
      steps = 11840;
      water = 3.7;
      fastingHours = 15.5;
      stayedOnPlan = true;
      noNightEating = true;
    }

    const caloriesInRange =
      calories >= CALORIE_RANGE.min && calories <= CALORIE_RANGE.max;
    const proteinHit = protein >= PROTEIN_GOAL;

    return {
      date,
      weight,
      calories,
      protein,
      steps,
      water,
      fastingHours,
      stayedOnPlan: stayedOnPlan && caloriesInRange && proteinHit,
      noNightEating,
      isSample: true,
    };
  });
}
