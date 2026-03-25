import type { Metadata } from "next";
import { LazyCalorieChart, LazyWeightChart } from "@/components/ProgressCharts";
import { GOAL_WEIGHT } from "@/lib/constants";
import { getAllLogs } from "@/lib/data";
import {
  attachScores,
  buildCalorieChartData,
  buildWeightChartData,
  getBestStreak,
  getCurrentWeight,
  getSevenDayAverageWeight,
  getThirtyDayWeightChange,
} from "@/lib/analytics";
import { formatSignedWeight, formatWeight } from "@/lib/format";

export const metadata: Metadata = {
  title: "Trajectory",
};

export const dynamic = "force-dynamic";

export default async function ProgressPage() {
  const logs = attachScores(await getAllLogs());
  const weightChartData = buildWeightChartData(logs);
  const calorieChartData = buildCalorieChartData(logs);
  const currentWeight = getCurrentWeight(logs);
  const averageWeight = getSevenDayAverageWeight(logs);
  const thirtyDayChange = getThirtyDayWeightChange(logs);
  const bestStreak = getBestStreak(logs);
  const hasEnoughWeightData = weightChartData.length >= 2;
  const hasEnoughCalorieData = calorieChartData.length >= 2;

  return (
    <div className="space-y-8 lg:space-y-10">
      <section className="glass-card rounded-[28px] px-6 py-8 sm:px-8 sm:py-10">
        <div className="space-y-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
            Trajectory
          </p>
          <h1 className="text-5xl font-semibold tracking-[-0.07em] text-[var(--foreground)] sm:text-6xl">
            Recorded trajectory
          </h1>
          <p className="max-w-2xl text-base leading-8 text-[var(--secondary)] sm:text-lg">
            The system reads only recorded weigh-ins and intake. If the dataset is
            thin, it waits rather than inventing a trend.
          </p>
        </div>

        <div className="section-divider mt-8 grid gap-8 pt-8 sm:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">
              Current weight
            </p>
            <p className="font-mono text-5xl font-semibold tracking-[-0.08em] text-[var(--foreground)] sm:text-6xl">
              {currentWeight !== null ? formatWeight(currentWeight) : "Not enough data yet"}
            </p>
            <p className="text-sm text-[var(--secondary)]">Latest recorded weigh-in.</p>
          </div>

          <div className="space-y-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">
              Goal weight
            </p>
            <p className="font-mono text-5xl font-semibold tracking-[-0.08em] text-[var(--foreground)] sm:text-6xl">
              {formatWeight(GOAL_WEIGHT)}
            </p>
            <p className="text-sm text-[var(--secondary)]">Operating target.</p>
          </div>

          <div className="space-y-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">
              7-day average
            </p>
            <p className="font-mono text-5xl font-semibold tracking-[-0.08em] text-[var(--foreground)] sm:text-6xl">
              {averageWeight !== null ? formatWeight(averageWeight) : "Not enough data yet"}
            </p>
            <p className="text-sm text-[var(--secondary)]">Needs 7 real weigh-ins.</p>
          </div>

          <div className="space-y-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">
              30-day change
            </p>
            <p className="font-mono text-5xl font-semibold tracking-[-0.08em] text-[var(--foreground)] sm:text-6xl">
              {thirtyDayChange !== null
                ? formatSignedWeight(thirtyDayChange)
                : "Not enough data yet"}
            </p>
            <p className="text-sm text-[var(--secondary)]">Needs at least 2 real weigh-ins.</p>
          </div>
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="panel-card rounded-[24px] px-6 py-7 sm:px-8 sm:py-8">
          <div className="border-b border-[var(--border)] pb-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
              Scale record
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[var(--foreground)]">
              Scale weight and rolling average
            </h2>
          </div>
          <div className="mt-8">
            {hasEnoughWeightData ? (
              <LazyWeightChart data={weightChartData} />
            ) : (
              <p className="text-sm leading-7 text-[var(--secondary)]">
                Not enough data yet.
              </p>
            )}
          </div>
        </section>

        <section className="panel-card rounded-[24px] px-6 py-7 sm:px-8 sm:py-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
            Readout
          </p>
          <div className="mt-6 space-y-5 text-sm leading-7 text-[var(--secondary)]">
            <p>
              The raw line keeps the record honest. The rolling average confirms
              direction once the dataset is deep enough.
            </p>
            <p>
              Single spikes are noise. Repeated drift with weak adherence is the
              signal.
            </p>
            <p>
              Best streak on record: {bestStreak} day{bestStreak === 1 ? "" : "s"}.
            </p>
          </div>
        </section>
      </section>

      <section className="panel-card rounded-[24px] px-6 py-7 sm:px-8 sm:py-8">
        <div className="border-b border-[var(--border)] pb-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
            Intake record
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[var(--foreground)]">
            Calories in against plan range
          </h2>
        </div>
        <div className="mt-8">
          {hasEnoughCalorieData ? (
            <LazyCalorieChart data={calorieChartData} />
          ) : (
            <p className="text-sm leading-7 text-[var(--secondary)]">Not enough data yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
