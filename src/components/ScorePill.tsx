type ScorePillProps = {
  score: number;
};

function getTone(score: number) {
  if (score >= 4) {
    return "border-[rgba(47,93,80,0.16)] bg-[var(--accent-soft)] text-[var(--accent-strong)]";
  }

  if (score >= 3) {
    return "border-[var(--border)] bg-[var(--surface)] text-[var(--secondary)]";
  }

  return "border-[rgba(164,87,69,0.14)] bg-[var(--warning-soft)] text-[var(--warning)]";
}

export function ScorePill({ score }: ScorePillProps) {
  return (
    <div
      className={`inline-flex min-w-[76px] items-center justify-center rounded-full border px-3.5 py-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.22em] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] ${getTone(
        score,
      )}`}
    >
      {score}/5
    </div>
  );
}
