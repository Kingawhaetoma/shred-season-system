import type { ReactNode } from "react";

type MetricCardProps = {
  title: string;
  value?: string;
  subtitle: string;
  accent?: "neutral" | "success" | "warning" | "danger";
  children?: ReactNode;
};

const accentClasses = {
  neutral: "border-[var(--border)]",
  success: "border-[var(--border)] bg-[var(--accent-soft)]",
  warning: "border-[var(--border)] bg-[var(--warning-soft)]",
  danger: "border-[var(--border)] bg-[var(--warning-soft)]",
} satisfies Record<NonNullable<MetricCardProps["accent"]>, string>;

export function MetricCard({
  title,
  value,
  subtitle,
  accent = "neutral",
  children,
}: MetricCardProps) {
  return (
    <section
      className={`glass-card rounded-[28px] px-5 py-5 sm:px-6 ${accentClasses[accent]}`}
    >
      <p className="font-mono text-xs uppercase tracking-[0.32em] text-[var(--muted)]">
        {title}
      </p>
      {value ? (
        <p className="mt-4 font-mono text-4xl font-semibold tracking-[-0.07em] text-[var(--foreground)]">
          {value}
        </p>
      ) : null}
      {children}
      <p className="mt-3 text-sm leading-6 text-[var(--secondary)]">{subtitle}</p>
    </section>
  );
}
