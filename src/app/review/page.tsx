import type { Metadata } from "next";
import { MetricCard } from "@/components/MetricCard";
import { ScorePill } from "@/components/ScorePill";
import { getAllLogs } from "@/lib/data";
import { attachScores, buildRollingWindow, getWeeklySummary } from "@/lib/analytics";
import { formatInteger, formatPercent, formatSignedWeight } from "@/lib/format";

export const metadata: Metadata = {
  title: "Weekly Review",
};

const habitLabels = {
  caloriesInRange: "Calories in range",
  proteinHit: "Protein target",
  stepsHit: "10k steps",
  noNightEating: "No night eating",
  stayedOnPlan: "Stayed on plan",
} as const;

export default async function ReviewPage() {
  const logs = attachScores(await getAllLogs());
  const weeklySummary = getWeeklySummary(logs);
  const week = [...buildRollingWindow(logs, 7)].reverse();

  return (
    <div className="space-y-6">
      <section className="glass-card rounded-[32px] px-6 py-7 sm:px-8">
        <p className="font-mono text-xs uppercase tracking-[0.32em] text-[var(--muted)]">
          Weekly review
        </p>
        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">
              Review the week without excuses.
            </h1>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)] sm:text-base">
              These numbers compress the last seven days into objective feedback so
              you can decide what to repeat and what to tighten.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Average calories"
          value={formatInteger(weeklySummary.averageCalories)}
          subtitle="Rolling 7-day intake average."
        />
        <MetricCard
          title="Average steps"
          value={formatInteger(weeklySummary.averageSteps)}
          subtitle="Rolling 7-day movement average."
          accent="success"
        />
        <MetricCard
          title="Weight change"
          value={formatSignedWeight(weeklySummary.weightChange)}
          subtitle="Change from the first to the latest weigh-in."
          accent={weeklySummary.weightChange <= 0 ? "success" : "warning"}
        />
        <MetricCard
          title="Consistency"
          value={formatPercent(weeklySummary.consistencyPercent)}
          subtitle="Total weekly score out of 35 possible points."
          accent="warning"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="panel-card rounded-[32px] p-6 sm:p-7">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.32em] text-[var(--muted)]">
              Daily score log
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
              Last 7 days at a glance
            </h2>
          </div>
          <div className="mt-6 space-y-3">
            {week.map((entry) => (
              <div
                key={entry.date}
                className="flex items-center justify-between rounded-2xl border border-black/6 bg-black/[0.02] px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-[var(--foreground)]">
                    {entry.dayLabel}
                  </p>
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
                    {entry.shortDate}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden text-right sm:block">
                    <p className="text-sm text-[var(--foreground)]">
                      {entry.log
                        ? `${formatInteger(entry.log.protein)}g protein`
                        : "No check-in"}
                    </p>
                    <p className="text-xs text-[var(--muted)]">
                      {entry.log
                        ? `${formatInteger(entry.log.steps)} steps`
                        : "Counted as 0/5"}
                    </p>
                  </div>
                  <ScorePill score={entry.score} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <section className="panel-card rounded-[32px] p-6 sm:p-7">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.32em] text-[var(--muted)]">
                Habit hit rates
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                What held up this week
              </h2>
            </div>
            <div className="mt-6 space-y-4">
              {Object.entries(weeklySummary.habitHitRates).map(([key, hitRate]) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-[var(--foreground)]">
                      {habitLabels[key as keyof typeof habitLabels]}
                    </p>
                    <p className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
                      {hitRate}/7 days
                    </p>
                  </div>
                  <div className="h-2 rounded-full bg-black/6">
                    <div
                      className="h-full rounded-full bg-[var(--success)]"
                      style={{ width: `${(hitRate / 7) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="panel-card rounded-[32px] p-6 sm:p-7">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.32em] text-[var(--muted)]">
                Quick read
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                Weekly takeaway
              </h2>
            </div>
            <div className="mt-6 space-y-4 text-sm leading-7 text-[var(--muted)]">
              <p>
                You averaged {formatInteger(weeklySummary.averageCalories)} calories and{" "}
                {formatInteger(weeklySummary.averageSteps)} steps over the last 7 days.
              </p>
              <p>
                The week finished at {formatPercent(weeklySummary.consistencyPercent)}{" "}
                consistency, with a total score of {weeklySummary.totalScore}/35.
              </p>
              <p>
                Weight changed {formatSignedWeight(weeklySummary.weightChange)} across
                the review window. If next week needs improvement, start with the
                habit row that has the lowest hit rate.
              </p>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
