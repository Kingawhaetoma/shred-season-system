type ScorePillProps = {
  score: number;
};

function getTone(score: number) {
  if (score >= 4) {
    return "border-emerald-900/15 bg-emerald-50 text-[var(--success)]";
  }

  if (score >= 3) {
    return "border-amber-900/15 bg-amber-50 text-[var(--warning)]";
  }

  return "border-rose-900/15 bg-rose-50 text-[var(--danger)]";
}

export function ScorePill({ score }: ScorePillProps) {
  return (
    <div
      className={`inline-flex min-w-20 items-center justify-center rounded-full border px-3 py-2 font-mono text-sm font-semibold tracking-[0.06em] ${getTone(
        score,
      )}`}
    >
      {score}/5
    </div>
  );
}
