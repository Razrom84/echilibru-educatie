/** Default program week when the parent has not chosen another. */
export const PROGRAM_WEEK = 1;
export const PROGRAM_AGE_BAND = "2-3";

export const PROGRAM_WEEKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
export type ProgramWeek = (typeof PROGRAM_WEEKS)[number];

export const WEEK_THEMES: Record<ProgramWeek, string> = {
  1: "Casa și curtea",
  2: "Apa în casă și afară",
  3: "Sunete și liniște",
  4: "Mâini și degete",
  5: "Culori pe care le vedem",
  6: "Sus și jos",
  7: "Înăuntru și afară",
  8: "Frunze și pământ",
  9: "Vânt și aer",
  10: "Colectăm și sortăm",
  11: "Lumină și umbră",
  12: "Cald și rece (repetare)",
};

export function isProgramWeek(value: number): value is ProgramWeek {
  return (PROGRAM_WEEKS as readonly number[]).includes(value);
}

export function parseProgramWeek(raw: string | null | undefined): ProgramWeek {
  const n = Number(raw);
  return isProgramWeek(n) ? n : PROGRAM_WEEK;
}

export function getWeekTheme(week: number): string {
  return isProgramWeek(week) ? WEEK_THEMES[week] : WEEK_THEMES[PROGRAM_WEEK];
}

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
