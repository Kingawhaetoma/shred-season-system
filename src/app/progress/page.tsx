import type { Metadata } from "next";
import { LazyCalorieChart, LazyWeightChart } from "@/components/ProgressCharts";
import { MetricCard } from "@/components/MetricCard";
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
  title: "Progress",
};

export default async function ProgressPage() {
  const logs = attachScores(await getAllLogs());
  const weightChartData = buildWeightChartData(logs);
  const calorieChartData = buildCalorieChartData(logs);
  const currentWeight = getCurrentWeight(logs);
  const averageWeight = getSevenDayAverageWeight(logs);
  const thirtyDayChange = getThirtyDayWeightChange(logs);
  const bestStreak = getBestStreak(logs);

  return (
    <div className="space-y-6">
      <section className="glass-card rounded-[32px] px-6 py-7 sm:px-8">
        <p className="font-mono text-xs uppercase tracking-[0.32em] text-[var(--muted)]">
          Progress page
        </p>
        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">
              See the trend, not the mood.
            </h1>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)] sm:text-base">
              Weight moves slowly. Consistency moves daily. This view keeps both in
              frame so you can stay objective.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Current weight"
          value={currentWeight ? formatWeight(currentWeight) : "--"}
          subtitle="Latest recorded weigh-in."
        />
        <MetricCard
          title="7-day average"
          value={averageWeight ? formatWeight(averageWeight) : "--"}
          subtitle="Smoothed trend across the last seven weigh-ins."
          accent="success"
        />
        <MetricCard
          title="30-day change"
          value={formatSignedWeight(thirtyDayChange)}
          subtitle="Weight change across the last 30 logged days."
          accent={thirtyDayChange <= 0 ? "success" : "warning"}
        />
        <MetricCard
          title="Best streak"
          value={`${bestStreak} days`}
          subtitle="Longest run of 4/5 days or better."
          accent="warning"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="panel-card rounded-[32px] p-6 sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.32em] text-[var(--muted)]">
                Weight trend
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                Scale weight and 7-day average
              </h2>
            </div>
          </div>
          <div className="mt-6">
            <LazyWeightChart data={weightChartData} />
          </div>
        </div>

        <div className="panel-card rounded-[32px] p-6 sm:p-7">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.32em] text-[var(--muted)]">
              Read the chart
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
              What matters here
            </h2>
          </div>
          <div className="mt-6 space-y-4 text-sm leading-7 text-[var(--muted)]">
            <p>
              Use the raw weight line to stay honest, but let the 7-day average tell
              you whether the cut is actually working.
            </p>
            <p>
              Short spikes from sodium, stress, or a big meal are noise. Repeated
              high-calorie days paired with a flat average are signal.
            </p>
            <p>
              If the average stalls, tighten the variables you control first:
              calories, protein floor, and daily movement.
            </p>
          </div>
        </div>
      </section>

      <section className="panel-card rounded-[32px] p-6 sm:p-7">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.32em] text-[var(--muted)]">
              Calorie trend
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
              Intake against the target range
            </h2>
          </div>
        </div>
        <div className="mt-6">
          <LazyCalorieChart data={calorieChartData} />
        </div>
      </section>
    </div>
  );
}
