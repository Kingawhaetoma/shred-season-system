import type { DailyLog } from "@prisma/client";
import { saveDailyLog } from "@/app/actions";
import { getTodayKey } from "@/lib/date";
import { SubmitButton } from "./SubmitButton";

type DailyLogFormProps = {
  defaultValues?: Partial<DailyLog>;
  submitLabel?: string;
};

type FieldProps = {
  id: string;
  label: string;
  type?: "number" | "date";
  step?: string;
  min?: string;
  defaultValue?: string | number;
  suffix?: string;
};

function Field({
  id,
  label,
  type = "number",
  step,
  min,
  defaultValue,
  suffix,
}: FieldProps) {
  return (
    <label className="space-y-3">
      <span className="type-eyebrow">
        {label}
      </span>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={type}
          step={step}
          min={min}
          defaultValue={defaultValue}
          required
          className="w-full rounded-[14px] border border-[var(--border)] bg-[var(--surface)] px-4 py-3.5 text-base text-[var(--foreground)] outline-none transition hover:border-[rgba(47,93,80,0.14)] focus:border-[var(--accent)] focus:bg-[var(--surface-strong)] focus:shadow-[0_0_0_3px_rgba(47,93,80,0.07)]"
        />
        {suffix ? (
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--muted)]">
            {suffix}
          </span>
        ) : null}
      </div>
    </label>
  );
}

export function DailyLogForm({
  defaultValues,
  submitLabel = "Log Today",
}: DailyLogFormProps) {
  return (
    <form action={saveDailyLog} className="space-y-7">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Field
          id="date"
          label="Log date"
          type="date"
          defaultValue={defaultValues?.date ?? getTodayKey()}
        />
        <Field
          id="weight"
          label="Weight"
          step="0.1"
          min="0"
          defaultValue={defaultValues?.weight}
          suffix="lb"
        />
        <Field
          id="calories"
          label="Calories"
          min="0"
          defaultValue={defaultValues?.calories}
          suffix="kcal"
        />
        <Field
          id="protein"
          label="Protein"
          min="0"
          defaultValue={defaultValues?.protein}
          suffix="g"
        />
        <Field
          id="steps"
          label="Steps"
          min="0"
          defaultValue={defaultValues?.steps}
        />
        <Field
          id="water"
          label="Water"
          step="0.1"
          min="0"
          defaultValue={defaultValues?.water}
          suffix="L"
        />
        <Field
          id="fastingHours"
          label="Fasting hours"
          step="0.5"
          min="0"
          defaultValue={defaultValues?.fastingHours}
          suffix="hrs"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex items-center justify-between gap-3 rounded-[14px] border border-[var(--border)] bg-[var(--surface)] px-4 py-4 transition hover:border-[rgba(47,93,80,0.14)] hover:bg-[rgba(237,243,240,0.6)]">
          <span className="text-sm font-medium text-[var(--foreground)]">
            Stayed on plan
          </span>
          <input
            type="checkbox"
            name="stayedOnPlan"
            defaultChecked={defaultValues?.stayedOnPlan ?? false}
            className="h-4 w-4 rounded border-[var(--border-strong)] accent-[var(--accent)]"
          />
        </label>
        <label className="flex items-center justify-between gap-3 rounded-[14px] border border-[var(--border)] bg-[var(--surface)] px-4 py-4 transition hover:border-[rgba(47,93,80,0.14)] hover:bg-[rgba(237,243,240,0.6)]">
          <span className="text-sm font-medium text-[var(--foreground)]">
            No night eating
          </span>
          <input
            type="checkbox"
            name="noNightEating"
            defaultChecked={defaultValues?.noNightEating ?? false}
            className="h-4 w-4 rounded border-[var(--border-strong)] accent-[var(--accent)]"
          />
        </label>
      </div>

      <div className="section-divider flex flex-col gap-5 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="type-eyebrow">
            One entry per date
          </p>
          <p className="text-sm leading-6 text-[var(--secondary)]">
            Logging the same date again updates that day&apos;s record.
          </p>
        </div>
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}
