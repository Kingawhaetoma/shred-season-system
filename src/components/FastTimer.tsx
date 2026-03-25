"use client";

import { useEffect, useState } from "react";
import { FAST_START_HOUR } from "@/lib/constants";

function getFastStart(now: Date) {
  const start = new Date(now);
  start.setHours(FAST_START_HOUR, 0, 0, 0);

  if (now < start) {
    start.setDate(start.getDate() - 1);
  }

  return start;
}

function formatDuration(milliseconds: number) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) => value.toString().padStart(2, "0"))
    .join(":");
}

export function FastTimer() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  return (
    <div className="mt-4">
      <p className="font-mono text-4xl font-semibold tracking-[-0.07em] text-[var(--foreground)]">
        {formatDuration(now.getTime() - getFastStart(now).getTime())}
      </p>
    </div>
  );
}
