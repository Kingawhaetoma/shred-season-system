"use client";

import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  label: string;
};

export function SubmitButton({ label }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const copy = pending ? "Logging..." : label;

  return (
    <button
      type="submit"
      disabled={pending}
      className="button-premium min-w-44 font-mono text-[11px] font-semibold uppercase tracking-[0.3em] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span>{copy}</span>
      <span aria-hidden="true" className="button-premium-arrow">
        →
      </span>
    </button>
  );
}
