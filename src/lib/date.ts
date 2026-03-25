import { format, parseISO } from "date-fns";

export function getTodayKey(date = new Date()) {
  return format(date, "yyyy-MM-dd");
}

export function formatDateLabel(value: string) {
  return format(parseISO(value), "EEEE, MMMM d");
}

export function formatShortDate(value: string) {
  return format(parseISO(value), "MMM d");
}
