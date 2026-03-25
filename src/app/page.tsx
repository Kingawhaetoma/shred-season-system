import type { Metadata } from "next";
import { DailyLogForm } from "@/components/DailyLogForm";
import { FastTimer } from "@/components/FastTimer";
import { MetricCard } from "@/components/MetricCard";
import { ScorePill } from "@/components/ScorePill";
import { getAllLogs } from "@/lib/data";
import {
  attachScores,
  buildRollingWindow,
  getDangerAlert,
  getLatestLog,
  getSevenDayAverageWeight,
  getStreak,
  getWeeklySummary,
} from "@/lib/analytics";
import { formatDateLabel, getTodayKey } from "@/lib/date";
import { formatInteger, formatPercent, formatWeight } from "@/lib/format";

export const metadata: Metadata = {
  title: "Dashboard",
};

type HomePageProps = {
  searchParams: Promise<{
    saved?: string;
    invalid?: string;
  }>;
};

export default async function Home({ searchParams }: HomePageProps) {
  const [logs, params] = await Promise.all([getAllLogs(), searchParams]);
  const scoredLogs = attachScores(logs);
  const latestLog = getLatestLog(scoredLogs);
  const todayKey = getTodayKey();
  const todayLog = scoredLogs.find((log) => log.date === todayKey) ?? null;
  const lastSevenDays = buildRollingWindow(scoredLogs, 7);
  const weeklySummary = getWeeklySummary(scoredLogs);
  const streak = getStreak(scoredLogs);
  const dangerAlert = getDangerAlert(scoredLogs);
  const sevenDayAverageWeight = getSevenDayAverageWeight(scoredLogs);

  return (
    <div className="space-y-6">
      <section className="glass-card rounded-[32px] px-6 py-7 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="font-mono text-xs uppercase tracking-[0.32em] text-[var(--muted)]">
              Daily accountability
            </p>
            <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[var(--foreground)] sm:text-5xl">
              Discipline over drama.
            </h1>
            <p className="max-w-xl text-sm leading-7 text-[var(--muted)] sm:text-base">
              Score each day against the plan, catch slippage early, and keep
              the trend moving down through boring consistency.
            </p>
          </div>
          <div className="rounded-[28px] border border-black/8 bg-black/[0.02] px-5 py-4">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
              Latest check-in
            </p>
            <div className="mt-3 flex flex-wrap items-end gap-6">
              <div>
                <p className="font-mono text-3xl font-semibold tracking-[-0.06em] text-[var(--foreground)]">
                  {latestLog ? formatWeight(latestLog.weight) : "--"}
                </p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {latestLog
                    ? `${formatDateLabel(latestLog.date)} weigh-in`
                    : "No logs yet"}
                </p>
              </div>
              <div>
                <p className="font-mono text-3xl font-semibold tracking-[-0.06em] text-[var(--foreground)]">
                  {sevenDayAverageWeight ? formatWeight(sevenDayAverageWeight) : "--"}
                </p>
                <p className="mt-1 text-sm text-[var(--muted)]">7-day average weight</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {params.saved ? (
        <section className="glass-card rounded-[28px] border-emerald-200 bg-emerald-50/70 px-5 py-4">
          <p className="font-medium text-[var(--success)]">
            Saved log for {formatDateLabel(params.saved)}.
          </p>
        </section>
      ) : null}

      {params.invalid ? (
        <section className="glass-card rounded-[28px] border-rose-200 bg-rose-50/70 px-5 py-4">
          <p className="font-medium text-[var(--danger)]">
            The log could not be saved. Check the form values and try again.
          </p>
        </section>
      ) : null}

      {dangerAlert ? (
        <section className="glass-card rounded-[28px] border-rose-200 bg-rose-50/70 px-5 py-5">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--danger)]">
            Danger detection
          </p>
          <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                {dangerAlert.lowScoreDays} of the last {dangerAlert.windowDays} days
                scored {dangerAlert.threshold} or less.
              </h2>
              <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                Average score over that stretch is {dangerAlert.averageScore.toFixed(1)}
                /5. Tighten calories, recover your step floor, and stack one clean
                day immediately.
              </p>
            </div>
            <div className="rounded-2xl border border-rose-200 bg-white/80 px-4 py-3">
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
                Most recent miss
              </p>
              <p className="mt-2 text-sm font-medium text-[var(--foreground)]">
                {formatDateLabel(dangerAlert.latestLowDate)}
              </p>
            </div>
          </div>
        </section>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Today's score"
          value={`${todayLog?.score ?? 0}/5`}
          subtitle={
            todayLog ? "Live consistency score for today." : "Log today to start the score."
          }
        />
        <MetricCard
          title="Streak"
          value={`${streak} day${streak === 1 ? "" : "s"}`}
          subtitle="Consecutive days scoring 4/5 or better."
          accent="success"
        />
        <MetricCard
          title="Current fast timer"
          subtitle="Assumes your fast starts at 8:00 PM."
          accent="warning"
        >
          <FastTimer />
        </MetricCard>
        <MetricCard
          title="Weekly goal progress"
          value={`${weeklySummary.totalScore}/${weeklySummary.targetScore}`}
          subtitle={`${weeklySummary.daysCompleted}/7 days logged in the rolling week.`}
          accent="success"
        >
          <div className="mt-4 space-y-2">
            <div className="h-2 rounded-full bg-black/6">
              <div
                className="h-full rounded-full bg-[var(--success)] transition-all"
                style={{ width: `${weeklySummary.goalCompletionPercent}%` }}
              />
            </div>
            <p className="text-sm text-[var(--muted)]">
              {formatPercent(weeklySummary.goalCompletionPercent)} toward the weekly
              target score.
            </p>
          </div>
        </MetricCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="panel-card rounded-[32px] p-6 sm:p-7">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.32em] text-[var(--muted)]">
                Daily log
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                Enter the facts.
              </h2>
            </div>
            <div className="rounded-2xl border border-black/8 bg-black/[0.02] px-4 py-3">
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
                Today
              </p>
              <p className="mt-2 text-sm font-medium text-[var(--foreground)]">
                {formatDateLabel(todayKey)}
              </p>
            </div>
          </div>
          <div className="mt-6">
            <DailyLogForm defaultValues={todayLog ?? undefined} />
          </div>
        </div>

        <div className="space-y-6">
          <section className="panel-card rounded-[32px] p-6 sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.32em] text-[var(--muted)]">
                  Score breakdown
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                  Today&apos;s discipline markers
                </h2>
              </div>
              <ScorePill score={todayLog?.score ?? 0} />
            </div>

            {todayLog ? (
              <div className="mt-6 space-y-4">
                {todayLog.breakdown.details.map((detail) => (
                  <div
                    key={detail.label}
                    className="flex items-center justify-between rounded-2xl border border-black/6 bg-black/[0.02] px-4 py-3"
                  >
                    <span className="text-sm font-medium text-[var(--foreground)]">
                      {detail.label}
                    </span>
                    <span
                      className={`font-mono text-xs uppercase tracking-[0.24em] ${
                        detail.met ? "text-[var(--success)]" : "text-[var(--muted)]"
                      }`}
                    >
                      {detail.met ? "hit" : "miss"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-[28px] border border-dashed border-black/10 bg-black/[0.02] px-5 py-6 text-sm leading-6 text-[var(--muted)]">
                No log for today yet. Submit the daily form to calculate the score and
                fill this breakdown automatically.
              </div>
            )}
          </section>

          <section className="panel-card rounded-[32px] p-6 sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.32em] text-[var(--muted)]">
                  Last 7 days
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                  Consistency snapshot
                </h2>
              </div>
              <p className="font-mono text-sm text-[var(--muted)]">
                {formatPercent(weeklySummary.consistencyPercent)} consistency
              </p>
            </div>
            <div className="mt-6 space-y-3">
              {[...lastSevenDays].reverse().map((entry) => (
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
                          ? `${formatInteger(entry.log.calories)} kcal`
                          : "No check-in"}
                      </p>
                      <p className="text-xs text-[var(--muted)]">
                        {entry.log
                          ? `${formatInteger(entry.log.steps)} steps`
                          : "Missed entry"}
                      </p>
                    </div>
                    <ScorePill score={entry.score} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
