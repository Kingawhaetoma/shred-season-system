import type { Metadata } from "next";
import { ScorePill } from "@/components/ScorePill";
import { getAllLogs } from "@/lib/data";
import { attachScores, buildRollingWindow, getWeeklySummary } from "@/lib/analytics";
import { formatInteger, formatPercent, formatSignedWeight } from "@/lib/format";

export const metadata: Metadata = {
  title: "Weekly Audit",
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
    <div className="space-y-8 lg:space-y-10">
      <section className="glass-card rounded-[28px] px-6 py-8 sm:px-8 sm:py-10">
        <div className="space-y-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
            Weekly audit
          </p>
          <h1 className="text-5xl font-semibold tracking-[-0.07em] text-[var(--foreground)] sm:text-6xl">
            Seven-day audit
          </h1>
          <p className="max-w-2xl text-base leading-8 text-[var(--secondary)] sm:text-lg">
            A weekly read on intake, movement, adherence, and scale trend. The
            system only calls the averages when the week is fully logged.
          </p>
        </div>

        <div className="section-divider mt-8 grid gap-8 pt-8 sm:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">
              Average calories
            </p>
            <p className="font-mono text-5xl font-semibold tracking-[-0.08em] text-[var(--foreground)] sm:text-6xl">
              {weeklySummary.averageCalories !== null
                ? formatInteger(weeklySummary.averageCalories)
                : "Not enough data yet"}
            </p>
            <p className="text-sm text-[var(--secondary)]">Needs 7 real entries.</p>
          </div>

          <div className="space-y-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">
              Average steps
            </p>
            <p className="font-mono text-5xl font-semibold tracking-[-0.08em] text-[var(--foreground)] sm:text-6xl">
              {weeklySummary.averageSteps !== null
                ? formatInteger(weeklySummary.averageSteps)
                : "Not enough data yet"}
            </p>
            <p className="text-sm text-[var(--secondary)]">Needs 7 real entries.</p>
          </div>

          <div className="space-y-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">
              Weight change
            </p>
            <p className="font-mono text-5xl font-semibold tracking-[-0.08em] text-[var(--foreground)] sm:text-6xl">
              {weeklySummary.weightChange !== null
                ? formatSignedWeight(weeklySummary.weightChange)
                : "Not enough data yet"}
            </p>
            <p className="text-sm text-[var(--secondary)]">Needs 2 real weigh-ins.</p>
          </div>

          <div className="space-y-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">
              Consistency
            </p>
            <p className="font-mono text-5xl font-semibold tracking-[-0.08em] text-[var(--foreground)] sm:text-6xl">
              {weeklySummary.consistencyPercent !== null
                ? formatPercent(weeklySummary.consistencyPercent)
                : "Not enough data yet"}
            </p>
            <p className="text-sm text-[var(--secondary)]">
              {weeklySummary.daysCompleted}/7 real entries logged.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="panel-card rounded-[24px] px-6 py-7 sm:px-8 sm:py-8">
          <div className="border-b border-[var(--border)] pb-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
              Score ledger
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[var(--foreground)]">
              Seven-day scorecard
            </h2>
          </div>

          <div className="mt-4 divide-y divide-[var(--border)]">
            {week.map((entry) => (
              <div
                key={entry.date}
                className="flex items-center justify-between gap-4 py-4"
              >
                <div>
                  <p className="text-sm font-medium text-[var(--foreground)]">
                    {entry.dayLabel}
                  </p>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">
                    {entry.shortDate}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="hidden text-right sm:block">
                    <p className="text-sm text-[var(--foreground)]">
                      {entry.log
                        ? `${formatInteger(entry.log.protein)}g protein`
                        : "No real entry"}
                    </p>
                    <p className="mt-1 text-xs text-[var(--secondary)]">
                      {entry.log
                        ? `${formatInteger(entry.log.steps)} steps`
                        : "No score recorded"}
                    </p>
                  </div>
                  <ScorePill score={entry.score} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="panel-card rounded-[24px] px-6 py-7 sm:px-8 sm:py-8">
          <div className="border-b border-[var(--border)] pb-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
              Plan adherence
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[var(--foreground)]">
              Weekly hit rates
            </h2>
          </div>

          <div className="mt-6 space-y-5">
            {Object.entries(weeklySummary.habitHitRates).map(([key, hitRate]) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-[var(--foreground)]">
                    {habitLabels[key as keyof typeof habitLabels]}
                  </p>
                  <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">
                    {hitRate}/7
                  </p>
                </div>
                <div className="h-1.5 bg-[var(--surface)]">
                  <div
                    className="h-full bg-[var(--accent)]"
                    style={{ width: `${(hitRate / 7) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="section-divider mt-8 pt-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
              Audit note
            </p>
            <div className="mt-4 space-y-4 text-sm leading-7 text-[var(--secondary)]">
              {weeklySummary.hasEnoughEntriesForWeek ? (
                <>
                  <p>
                    The week closed at {formatPercent(weeklySummary.consistencyPercent ?? 0)}
                    , with a score of {weeklySummary.totalScore}/35.
                  </p>
                  <p>
                    Average intake came in at{" "}
                    {formatInteger(weeklySummary.averageCalories ?? 0)} calories and
                    average movement held at{" "}
                    {formatInteger(weeklySummary.averageSteps ?? 0)} steps.
                  </p>
                  <p>
                    Scale weight moved{" "}
                    {weeklySummary.weightChange !== null
                      ? formatSignedWeight(weeklySummary.weightChange)
                      : "Not enough data yet"}{" "}
                    across the audit window.
                  </p>
                </>
              ) : (
                <p>Not enough data yet.</p>
              )}
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}
