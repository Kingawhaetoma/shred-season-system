import type { DailyLog } from "@prisma/client";
import { differenceInCalendarDays, format, parseISO, subDays } from "date-fns";
import {
  DANGER_LOOKBACK_DAYS,
  DANGER_LOW_SCORE_DAYS,
  LOW_SCORE_THRESHOLD,
  WEEKLY_TARGET_SCORE,
} from "@/lib/constants";
import { getScoreBreakdown, type ScoreBreakdown } from "@/lib/scoring";

export type ScoredLog = DailyLog & {
  score: number;
  breakdown: ScoreBreakdown;
};

export type RollingWindowEntry = {
  date: string;
  dayLabel: string;
  shortDate: string;
  log: ScoredLog | null;
  score: number;
};

function average(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((total, value) => total + value, 0) / values.length;
}

function averageOrNull(values: number[], minCount: number) {
  if (values.length < minCount) {
    return null;
  }

  return average(values);
}

export function attachScores(logs: DailyLog[]): ScoredLog[] {
  return logs.map((log) => {
    const breakdown = getScoreBreakdown(log);

    return {
      ...log,
      breakdown,
      score: breakdown.total,
    };
  });
}

export function getLatestLog(logs: ScoredLog[]) {
  return logs.at(-1) ?? null;
}

export function getCurrentWeight(logs: ScoredLog[]) {
  return getLatestLog(logs)?.weight ?? null;
}

export function buildRollingWindow(logs: ScoredLog[], days: number): RollingWindowEntry[] {
  const logMap = new Map(logs.map((log) => [log.date, log]));

  return Array.from({ length: days }, (_, index) => {
    const date = format(subDays(new Date(), days - index - 1), "yyyy-MM-dd");
    const log = logMap.get(date) ?? null;

    return {
      date,
      dayLabel: format(parseISO(date), "EEEE"),
      shortDate: format(parseISO(date), "MMM d"),
      log,
      score: log?.score ?? 0,
    };
  });
}

export function getSevenDayAverageWeight(logs: ScoredLog[]) {
  const recentWeights = logs.slice(-7).map((log) => log.weight);

  return averageOrNull(recentWeights, 7);
}

export function getStreak(logs: ScoredLog[], minimumScore = 4) {
  const descending = [...logs].sort((a, b) => b.date.localeCompare(a.date));
  let streak = 0;

  for (const [index, log] of descending.entries()) {
    if (log.score < minimumScore) {
      break;
    }

    if (index > 0) {
      const previousDate = parseISO(descending[index - 1].date);
      const currentDate = parseISO(log.date);

      if (differenceInCalendarDays(previousDate, currentDate) !== 1) {
        break;
      }
    }

    streak += 1;
  }

  return streak;
}

export function getBestStreak(logs: ScoredLog[], minimumScore = 4) {
  const ascending = [...logs].sort((a, b) => a.date.localeCompare(b.date));
  let best = 0;
  let current = 0;

  for (const [index, log] of ascending.entries()) {
    if (log.score < minimumScore) {
      current = 0;
      continue;
    }

    if (index > 0) {
      const previousDate = parseISO(ascending[index - 1].date);
      const currentDate = parseISO(log.date);

      if (differenceInCalendarDays(currentDate, previousDate) !== 1) {
        current = 0;
      }
    }

    current += 1;
    best = Math.max(best, current);
  }

  return best;
}

export function getDangerAlert(logs: ScoredLog[]) {
  const window = buildRollingWindow(logs, DANGER_LOOKBACK_DAYS);
  const lowDays = window.filter((entry) => entry.score <= LOW_SCORE_THRESHOLD);
  const lowScoreStreak = getLowScoreStreak(logs);

  if (lowDays.length < DANGER_LOW_SCORE_DAYS && lowScoreStreak < 2) {
    return null;
  }

  return {
    lowScoreDays: lowDays.length,
    windowDays: DANGER_LOOKBACK_DAYS,
    threshold: LOW_SCORE_THRESHOLD,
    averageScore: average(window.map((entry) => entry.score)),
    latestLowDate: lowDays.at(-1)?.date ?? window.at(-1)?.date ?? "",
    lowScoreStreak,
    message:
      lowScoreStreak >= 2
        ? `${lowScoreStreak} low-score days in a row`
        : `${lowDays.length} low-score days in the last ${DANGER_LOOKBACK_DAYS} days`,
  };
}

export function getLowScoreStreak(logs: ScoredLog[], threshold = LOW_SCORE_THRESHOLD) {
  const descending = [...logs].sort((a, b) => b.date.localeCompare(a.date));
  let streak = 0;

  for (const [index, log] of descending.entries()) {
    if (log.score > threshold) {
      break;
    }

    if (index > 0) {
      const previousDate = parseISO(descending[index - 1].date);
      const currentDate = parseISO(log.date);

      if (differenceInCalendarDays(previousDate, currentDate) !== 1) {
        break;
      }
    }

    streak += 1;
  }

  return streak;
}

export function getWeeklySummary(logs: ScoredLog[]) {
  const window = buildRollingWindow(logs, 7);
  const loggedEntries = window.flatMap((entry) => (entry.log ? [entry.log] : []));
  const totalScore = window.reduce((sum, entry) => sum + entry.score, 0);
  const hasEnoughEntriesForWeek = loggedEntries.length >= 7;
  const weightChange =
    loggedEntries.length >= 2
      ? loggedEntries.at(-1)!.weight - loggedEntries[0].weight
      : null;

  return {
    totalScore,
    targetScore: WEEKLY_TARGET_SCORE,
    goalCompletionPercent: Math.min((totalScore / WEEKLY_TARGET_SCORE) * 100, 100),
    consistencyPercent: hasEnoughEntriesForWeek ? (totalScore / 35) * 100 : null,
    averageCaloriesIn: averageOrNull(
      loggedEntries.map((entry) => entry.caloriesIn),
      7,
    ),
    averageSteps: averageOrNull(
      loggedEntries.map((entry) => entry.steps),
      7,
    ),
    weightChange,
    daysCompleted: loggedEntries.length,
    hasEnoughEntriesForWeek,
    habitHitRates: {
      caloriesInRange: loggedEntries.filter((entry) => entry.breakdown.caloriesInRange)
        .length,
      proteinHit: loggedEntries.filter((entry) => entry.breakdown.proteinHit).length,
      stepsHit: loggedEntries.filter((entry) => entry.breakdown.stepsHit).length,
      noNightEating: loggedEntries.filter((entry) => entry.breakdown.noNightEating).length,
      stayedOnPlan: loggedEntries.filter((entry) => entry.breakdown.stayedOnPlan).length,
    },
  };
}

export function buildWeightChartData(logs: ScoredLog[]) {
  return logs.map((log, index) => {
    const slice = logs.slice(Math.max(0, index - 6), index + 1);

    return {
      date: format(parseISO(log.date), "MMM d"),
      weight: Number(log.weight.toFixed(1)),
      sevenDayAverage:
        slice.length >= 7
          ? Number(average(slice.map((entry) => entry.weight)).toFixed(1))
          : null,
    };
  });
}

export function buildCalorieChartData(logs: ScoredLog[]) {
  return logs.slice(-14).map((log) => ({
    date: format(parseISO(log.date), "MMM d"),
    caloriesIn: log.caloriesIn,
  }));
}

export function getThirtyDayWeightChange(logs: ScoredLog[]) {
  if (logs.length < 2) {
    return null;
  }

  const windowStart = format(subDays(new Date(), 29), "yyyy-MM-dd");
  const window = logs.filter((log) => log.date >= windowStart);

  if (window.length < 2) {
    return null;
  }

  return window.at(-1)!.weight - window[0].weight;
}
