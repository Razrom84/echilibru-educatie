export const PROGRAM_WEEK = 1;
export const PROGRAM_AGE_BAND = "2-3";

const DAY_NAMES = [
  "",
  "Luni",
  "Marți",
  "Miercuri",
  "Joi",
  "Vineri",
  "Sâmbătă",
  "Duminică",
] as const;

/** Monday = 1 … Sunday = 7 (European / Romanian week). */
export function getDayOfWeek(date = new Date()): number {
  const utcDay = date.getDay();
  return utcDay === 0 ? 7 : utcDay;
}

export function getDayName(dayOfWeek: number): string {
  return DAY_NAMES[dayOfWeek] ?? "";
}

/** ISO week 1–53, for later calendar mapping. V1 still shows program week 1. */
export function getIsoWeek(date = new Date()): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export function formatRoDate(date = new Date()): string {
  return new Intl.DateTimeFormat("ro-RO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}
