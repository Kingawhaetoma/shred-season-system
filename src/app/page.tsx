import type { Metadata } from "next";
import { DailyLogForm } from "@/components/DailyLogForm";
import { FastTimer } from "@/components/FastTimer";
import { MotivationBanner } from "@/components/MotivationBanner";
import { ScorePill } from "@/components/ScorePill";
import { GOAL_WEIGHT } from "@/lib/constants";
import { getAllLogs } from "@/lib/data";
import {
  attachScores,
  buildRollingWindow,
  getDangerAlert,
  getLatestLog,
  getStreak,
  getWeeklySummary,
} from "@/lib/analytics";
import { formatDateLabel, getTodayKey } from "@/lib/date";
import { formatInteger, formatWeightValue } from "@/lib/format";

export const metadata: Metadata = {
  title: "Dashboard",
};

export const dynamic = "force-dynamic";

type HomePageProps = {
  searchParams: Promise<{
    saved?: string;
    invalid?: string;
  }>;
};

type WeightHeroValueProps = {
  value: number | null;
  size?: "hero" | "stat";
};

type EntrySummarySource = {
  caloriesIn: number | null;
  caloriesOut: number | null;
  steps: number | null;
};

function formatCalorieSummary(entry: Pick<EntrySummarySource, "caloriesIn" | "caloriesOut">) {
  if (entry.caloriesIn !== null && entry.caloriesOut !== null) {
    return `${formatInteger(entry.caloriesIn)} in / ${formatInteger(entry.caloriesOut)} out`;
  }

  if (entry.caloriesIn !== null) {
    return `${formatInteger(entry.caloriesIn)} in`;
  }

  if (entry.caloriesOut !== null) {
    return `${formatInteger(entry.caloriesOut)} out`;
  }

  return "Calories not logged";
}

function formatSecondarySummary(entry: EntrySummarySource) {
  const parts: string[] = [];

  if (entry.caloriesIn !== null && entry.caloriesOut !== null) {
    parts.push(`${formatInteger(entry.caloriesIn - entry.caloriesOut)} net`);
  }

  if (entry.steps !== null) {
    parts.push(`${formatInteger(entry.steps)} steps`);
  }

  return parts.length > 0 ? parts.join(" · ") : "Weight-only entry";
}

function WeightHeroValue({ value, size = "hero" }: WeightHeroValueProps) {
  if (value === null) {
    return (
      <span className="text-[1.45rem] font-semibold leading-tight tracking-[-0.05em] text-[var(--foreground)]">
        Not enough data yet
      </span>
    );
  }

  return (
    <span className="flex items-end gap-2.5">
      <span
        className={
          size === "hero"
            ? "type-metric"
            : "type-metric-sm"
        }
      >
        {formatWeightValue(value)}
      </span>
      <span className={`type-unit ${size === "hero" ? "pb-[0.72rem]" : "pb-[0.45rem]"}`}>
        lb
      </span>
    </span>
  );
}

export default async function Home({ searchParams }: HomePageProps) {
  const [logs, params] = await Promise.all([getAllLogs(), searchParams]);
  const scoredLogs = attachScores(logs);
  const latestLog = getLatestLog(scoredLogs);
  const todayKey = getTodayKey();
  const todayLog = scoredLogs.find((log) => log.date === todayKey) ?? null;
  const lastSevenDays = [...buildRollingWindow(scoredLogs, 7)].reverse();
  const weeklySummary = getWeeklySummary(scoredLogs);
  const streak = getStreak(scoredLogs);
  const dangerAlert = getDangerAlert(scoredLogs);

  const currentWeight = latestLog?.weight ?? null;
  const todayNetCalories =
    todayLog && todayLog.caloriesIn !== null && todayLog.caloriesOut !== null
      ? todayLog.caloriesIn - todayLog.caloriesOut
      : null;
  const poundsRemaining =
    currentWeight === null ? null : Math.max(currentWeight - GOAL_WEIGHT, 0);
  const heroRemainingLine =
    poundsRemaining !== null
      ? `${formatWeightValue(poundsRemaining)} lb remaining`
      : "Remaining measured from the first recorded weigh-in";
  const heroHeadline =
    currentWeight !== null
      ? `${formatWeightValue(currentWeight)} → ${formatWeightValue(GOAL_WEIGHT)}`
      : `Target: ${formatWeightValue(GOAL_WEIGHT)} lb`;
  const todayScoreTone =
    todayLog && todayLog.score >= 4
      ? "text-[var(--accent-strong)]"
      : "text-[var(--foreground)]";
  const streakTone =
    streak > 0 ? "text-[var(--accent-strong)]" : "text-[var(--foreground)]";
  const weekToDateTone =
    weeklySummary.daysCompleted > 0
      ? "text-[var(--accent-strong)]"
      : "text-[var(--foreground)]";
  const weeklyScoreTone =
    weeklySummary.totalScore > 0
      ? "text-[var(--accent-strong)]"
      : "text-[var(--foreground)]";

  const status = dangerAlert
    ? {
        label: "Off Track",
        detail: dangerAlert.message,
        action: "Correct today.",
        cardTone:
          "border-[rgba(164,87,69,0.11)] bg-[linear-gradient(180deg,rgba(246,237,234,0.9),rgba(251,250,247,0.98))]",
        badgeTone: "border-[rgba(164,87,69,0.11)] bg-[rgba(164,87,69,0.035)]",
        accent: "bg-[var(--danger)]",
        labelTone: "text-[var(--warning)]",
      }
    : todayLog
      ? todayLog.score >= 4
        ? {
            label: "On Track",
            detail: `Today is scoring ${todayLog.score}/5.`,
            action: "Hold the line.",
            cardTone:
              "border-[rgba(47,93,80,0.14)] bg-[linear-gradient(180deg,rgba(237,243,240,0.96),rgba(251,250,247,0.98))]",
            badgeTone: "border-[rgba(47,93,80,0.14)] bg-[rgba(47,93,80,0.04)]",
            accent: "bg-[var(--accent)]",
            labelTone: "text-[var(--accent-strong)]",
          }
        : {
            label: "Needs Correction",
            detail: `Today is scoring ${todayLog.score}/5.`,
            action: "Correct today.",
            cardTone:
              "border-[rgba(164,87,69,0.11)] bg-[linear-gradient(180deg,rgba(246,237,234,0.88),rgba(251,250,247,0.98))]",
            badgeTone: "border-[rgba(164,87,69,0.11)] bg-[rgba(164,87,69,0.03)]",
            accent: "bg-[var(--warning)]",
            labelTone: "text-[var(--warning)]",
          }
      : {
          label: "Needs Correction",
          detail: "No log has been entered for today yet.",
          action: "Log before close.",
          cardTone:
            "border-[var(--border)] bg-[linear-gradient(180deg,rgba(243,239,232,0.96),rgba(251,250,247,0.98))]",
          badgeTone: "border-[var(--border)] bg-[rgba(154,148,140,0.08)]",
          accent: "bg-[var(--muted)]",
          labelTone: "text-[var(--secondary)]",
        };

  return (
    <div className="space-y-7 lg:space-y-8">
      <MotivationBanner />

      {params.saved ? (
        <section className="glass-card rounded-2xl border border-[var(--border)] px-6 py-5">
          <p className="type-eyebrow type-eyebrow-accent">
            Entry recorded
          </p>
          <p className="mt-2 text-sm text-[var(--secondary)]">
            Logged {formatDateLabel(params.saved)}.
          </p>
        </section>
      ) : null}

      {params.invalid ? (
        <section className="glass-card rounded-2xl border border-[var(--border)] px-6 py-5">
          <p className="type-eyebrow text-[var(--warning)]">
            Save failed
          </p>
          <p className="mt-2 text-sm text-[var(--secondary)]">
            Check the values and submit again.
          </p>
        </section>
      ) : null}

      <section className="glass-card rounded-2xl px-6 py-6 sm:px-7 sm:py-7 xl:px-8">
        <div className="grid gap-7 xl:grid-cols-[1.32fr_0.68fr] xl:gap-8">
          <div className="space-y-7">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] px-6 py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.44)] sm:px-7 sm:py-7">
              <div className="grid gap-7 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
                <div className="space-y-7">
                  <div className="space-y-5">
                    <p className="type-eyebrow type-eyebrow-accent">
                      Shred Season
                    </p>
                    <div className="space-y-7">
                      <div className="space-y-3.5">
                        <h1 className="type-hero max-w-[8.8ch]">
                          {heroHeadline}
                        </h1>
                        <p className="font-mono text-[0.92rem] font-medium tracking-[-0.03em] text-[var(--secondary)]">
                          {heroRemainingLine}
                        </p>
                      </div>
                      <p className="type-body max-w-md">
                        Daily inputs, weekly discipline, long-horizon trend.
                      </p>
                    </div>
                  </div>

                  <a
                    href="#log-today"
                    className="button-premium min-w-44 font-mono text-[11px] font-semibold uppercase tracking-[0.3em]"
                  >
                    <span>Log Today</span>
                    <span aria-hidden="true" className="button-premium-arrow">
                      →
                    </span>
                  </a>
                </div>

                <div className="grid content-start gap-4 sm:grid-cols-2">
                  <div className="flex min-h-[196px] flex-col justify-between rounded-2xl border border-[var(--border)] bg-[linear-gradient(180deg,rgba(243,239,232,0.88),rgba(251,250,247,0.98))] px-6 py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.42)] sm:col-span-2">
                    <p className="type-eyebrow">
                      Current weight
                    </p>
                    <div className="mt-4">
                      <WeightHeroValue value={currentWeight} />
                    </div>
                    <p className="type-body-sm mt-4">
                      Latest recorded scale weight.
                    </p>
                  </div>

                  <div className="flex min-h-[144px] flex-col justify-between rounded-2xl border border-[var(--border)] bg-[linear-gradient(180deg,rgba(251,250,247,0.98),rgba(246,243,238,0.92))] px-6 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.38)]">
                    <p className="type-eyebrow">
                      Goal weight
                    </p>
                    <div className="mt-4">
                      <WeightHeroValue value={GOAL_WEIGHT} size="stat" />
                    </div>
                  </div>

                  <div className="flex min-h-[144px] flex-col justify-between rounded-2xl border border-[var(--border)] bg-[linear-gradient(180deg,rgba(251,250,247,0.98),rgba(246,243,238,0.92))] px-6 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.38)]">
                    <p className="type-eyebrow">
                      To target
                    </p>
                    <div className="mt-4">
                      <WeightHeroValue value={poundsRemaining} size="stat" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="section-divider mt-8 grid gap-6 pt-6 sm:grid-cols-[minmax(0,1.1fr)_auto_auto] sm:items-end sm:gap-8">
                <div className="space-y-1.5">
                  <p className="type-eyebrow">
                    Latest weigh-in
                  </p>
                  <p className="text-[1.28rem] font-semibold leading-tight tracking-[-0.045em] text-[var(--foreground)]">
                    {latestLog ? formatDateLabel(latestLog.date) : "Not enough data yet"}
                  </p>
                </div>

                <div className="space-y-1.5 sm:justify-self-end">
                  <p className="type-eyebrow">
                    Today&apos;s score
                  </p>
                  <div className="flex items-end gap-3">
                    <p className={`font-mono text-[2.15rem] font-semibold leading-none tracking-[-0.075em] ${todayScoreTone}`}>
                      {todayLog ? `${todayLog.score}/5` : "Not logged"}
                    </p>
                    {todayLog ? <ScorePill score={todayLog.score} /> : null}
                  </div>
                </div>

                <div className="space-y-1.5 sm:justify-self-end">
                  <p className="type-eyebrow">
                    Streak
                  </p>
                  <p className={`font-mono text-[2.15rem] font-semibold leading-none tracking-[-0.075em] ${streakTone}`}>
                    {streak}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <aside className="panel-card rounded-2xl px-6 py-6 sm:px-7 sm:py-7">
            <div className="space-y-2.5">
              <p className="type-eyebrow">
                System status
              </p>
              <p className="type-body-sm max-w-[30ch]">
                A read on execution quality and short-term scoring risk.
              </p>
            </div>

            <div className={`mt-5 rounded-2xl border px-6 py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.38)] ${status.cardTone}`}>
              <div className="space-y-5">
                <div
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 ${status.badgeTone}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${status.accent}`} />
                  <p className={`font-mono text-[9px] uppercase tracking-[0.24em] ${status.labelTone}`}>
                    Readout
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="type-status">
                    {status.label}
                  </p>
                  <p className="type-body-sm max-w-[28ch]">
                    {status.detail}
                  </p>
                  <p className={`text-[13px] font-medium tracking-[-0.01em] ${status.labelTone}`}>
                    {status.action}
                  </p>
                </div>
              </div>
            </div>

            <div className="section-divider mt-5 space-y-5 pt-5">
              <div className="space-y-2">
                <p className="type-eyebrow">
                  Fasting clock
                </p>
                <FastTimer className="font-mono text-[1.85rem] font-semibold leading-none tracking-[-0.055em] text-[var(--foreground)]" />
              </div>

              <div className="section-divider pt-5">
                <div className="flex items-center justify-between gap-4">
                  <p className="type-eyebrow">
                    Week to date
                  </p>
                  <p className={`font-mono text-sm ${weekToDateTone}`}>
                    {weeklySummary.daysCompleted}/7
                  </p>
                </div>
                <p className="type-body-sm mt-2">
                  Real entries logged this week.
                </p>
              </div>

              <div className="section-divider pt-5">
                <div className="flex items-center justify-between gap-4">
                  <p className="type-eyebrow">
                    Score ledger
                  </p>
                  <p className={`font-mono text-sm ${weeklyScoreTone}`}>
                    {weeklySummary.totalScore}/{weeklySummary.targetScore}
                  </p>
                </div>
                <p className="type-body-sm mt-2">
                  Score accumulated from real entries only.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-7 xl:grid-cols-[1.15fr_0.85fr] xl:gap-8">
        <div id="log-today" className="panel-card rounded-2xl px-6 py-6 sm:px-7 sm:py-7">
          <div className="flex flex-col gap-4 border-b border-[var(--border)] pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <p className="type-eyebrow">
                Daily entry
              </p>
              <h2 className="text-[1.85rem] font-semibold leading-tight tracking-[-0.055em] text-[var(--foreground)]">
                Record today&apos;s data
              </h2>
            </div>
            <p className="type-body-sm">Real data only.</p>
          </div>

          <div className="mt-7">
            <DailyLogForm
              defaultValues={todayLog ?? undefined}
              submitLabel={todayLog ? "Update Entry" : "Log Today"}
            />
          </div>
        </div>

        <div className="space-y-7">
          <section className="panel-card rounded-2xl px-6 py-6 sm:px-7 sm:py-7">
            <div className="flex items-end justify-between gap-5 border-b border-[var(--border)] pb-5">
              <div className="space-y-2">
                <p className="type-eyebrow">
                  Daily scorecard
                </p>
                <h2 className="text-[1.85rem] font-semibold leading-tight tracking-[-0.055em] text-[var(--foreground)]">
                  What moved the score
                </h2>
              </div>
              <ScorePill score={todayLog?.score ?? 0} />
            </div>

            <div className="mt-5 flex items-center justify-between gap-5 rounded-[18px] border border-[var(--border)] bg-[rgba(243,239,232,0.58)] px-4 py-3.5">
              <div className="space-y-1">
                <p className="type-eyebrow">
                  Net calories
                </p>
                <p className="text-xs leading-6 text-[var(--secondary)]">
                  Calories In minus Calories Out
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono text-[1rem] font-medium tracking-[-0.04em] text-[var(--foreground)]">
                  {todayNetCalories !== null
                    ? `${formatInteger(todayNetCalories)} kcal`
                    : "Will calculate after logging"}
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
                  {todayLog
                    ? formatCalorieSummary(todayLog)
                    : "Saved with today’s entry"}
                </p>
              </div>
            </div>

            {todayLog ? (
              <div className="mt-5 divide-y divide-[var(--border)]">
                {todayLog.breakdown.details.map((detail) => (
                  <div
                    key={detail.label}
                    className="flex items-center justify-between gap-4 py-4"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          detail.met ? "bg-[var(--accent)]" : "bg-[var(--border-strong)]"
                        }`}
                      />
                      <span className="text-sm font-medium text-[var(--foreground)]">
                        {detail.label}
                      </span>
                    </div>
                    <span
                      className={`font-mono text-[9px] uppercase tracking-[0.24em] ${
                        detail.met
                          ? "text-[var(--accent-strong)]"
                          : "text-[var(--muted)]"
                      }`}
                    >
                      {detail.met ? "Pass" : "Fail"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="type-body-sm mt-5">
                No real entry for today yet. Log today and the score will calculate
                automatically.
              </div>
            )}
          </section>

          <section className="panel-card rounded-2xl px-6 py-6 sm:px-7 sm:py-7">
            <div className="flex items-end justify-between gap-5 border-b border-[var(--border)] pb-5">
              <div className="space-y-2">
                <p className="type-eyebrow">
                  Recent entries
                </p>
                <h2 className="text-[1.85rem] font-semibold leading-tight tracking-[-0.055em] text-[var(--foreground)]">
                  Seven-day record
                </h2>
              </div>
              <p className="font-mono text-sm text-[var(--muted)]">
                {weeklySummary.daysCompleted}/7 logged
              </p>
            </div>

            <div className="mt-5 divide-y divide-[var(--border)]">
              {lastSevenDays.map((entry) => (
                <div
                  key={entry.date}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <div>
                    <p className="text-sm font-medium text-[var(--foreground)]">
                      {entry.dayLabel}
                    </p>
                    <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.24em] text-[var(--muted)]">
                      {entry.shortDate}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="hidden text-right sm:block">
                      <p className="text-sm text-[var(--foreground)]">
                        {entry.log
                          ? formatCalorieSummary(entry.log)
                          : "No real entry"}
                      </p>
                      <p className="mt-1 text-xs text-[var(--secondary)]">
                        {entry.log
                          ? formatSecondarySummary(entry.log)
                          : "No score recorded"}
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
