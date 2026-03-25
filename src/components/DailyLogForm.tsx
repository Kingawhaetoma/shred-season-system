import type { DailyLog } from "@prisma/client";
import { saveDailyLog } from "@/app/actions";
import { getTodayKey } from "@/lib/date";
import { SubmitButton } from "./SubmitButton";

type DailyLogFormProps = {
  defaultValues?: Partial<DailyLog>;
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
    <label className="space-y-2">
      <span className="text-sm font-medium text-[var(--foreground)]">{label}</span>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={type}
          step={step}
          min={min}
          defaultValue={defaultValue}
          required
          className="w-full rounded-2xl border border-black/8 bg-white px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-black/20"
        />
        {suffix ? (
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
            {suffix}
          </span>
        ) : null}
      </div>
    </label>
  );
}

export function DailyLogForm({ defaultValues }: DailyLogFormProps) {
  return (
    <form action={saveDailyLog} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
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
          defaultValue={defaultValues?.weight ?? 241.4}
          suffix="lb"
        />
        <Field
          id="calories"
          label="Calories"
          min="0"
          defaultValue={defaultValues?.calories ?? 2100}
          suffix="kcal"
        />
        <Field
          id="protein"
          label="Protein"
          min="0"
          defaultValue={defaultValues?.protein ?? 185}
          suffix="g"
        />
        <Field
          id="steps"
          label="Steps"
          min="0"
          defaultValue={defaultValues?.steps ?? 10000}
        />
        <Field
          id="water"
          label="Water"
          step="0.1"
          min="0"
          defaultValue={defaultValues?.water ?? 3.5}
          suffix="L"
        />
        <Field
          id="fastingHours"
          label="Fasting hours"
          step="0.5"
          min="0"
          defaultValue={defaultValues?.fastingHours ?? 15}
          suffix="hrs"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex items-center gap-3 rounded-2xl border border-black/8 bg-black/[0.02] px-4 py-3">
          <input
            type="checkbox"
            name="stayedOnPlan"
            defaultChecked={defaultValues?.stayedOnPlan ?? false}
            className="h-4 w-4 rounded border-black/15"
          />
          <span className="text-sm font-medium text-[var(--foreground)]">
            Stayed on plan
          </span>
        </label>
        <label className="flex items-center gap-3 rounded-2xl border border-black/8 bg-black/[0.02] px-4 py-3">
          <input
            type="checkbox"
            name="noNightEating"
            defaultChecked={defaultValues?.noNightEating ?? false}
            className="h-4 w-4 rounded border-black/15"
          />
          <span className="text-sm font-medium text-[var(--foreground)]">
            No night eating
          </span>
        </label>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-[var(--muted)]">
          Submitting the same date again overwrites that day&apos;s entry. Keep it
          factual and keep it daily.
        </p>
        <SubmitButton label="Save daily log" />
      </div>
    </form>
  );
}
