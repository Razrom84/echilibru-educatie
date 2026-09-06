/** Default program week when the parent has not chosen another.
 *  Civil date → S# mapping lives in `program-week.ts` (R1). This file is the content catalog. */

import { civilDayOfWeek, PROGRAM_TIMEZONE } from "@/lib/program-week";

export const PROGRAM_WEEK = 1;
export const PROGRAM_AGE_BAND = "1-2";

export const PROGRAM_WEEKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40] as const;
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
  13: "Haine pe vreme",
  14: "Pași pe drumul scurt",
  15: "Mâncare împreună",
  16: "Apă și sete",
  17: "Animale pe care le auzim",
  18: "Joacă de-a rândul",
  19: "Cartea de seară",
  20: "Ordine mică în cameră",
  21: "Iarna pe pervaz",
  22: "Corp care se mișcă în casă",
  23: "Mirosuri din casă",
  24: "Familia și oaspeții",
  25: "Lumină de seară",
  26: "Jumătate de an: repetăm favoritele",
  27: "Zăpadă sau ploaie la geam",
  28: "Dezgheț și noroi",
  29: "Muguri și iarbă nouă",
  30: "Păsări dimineața",
  31: "Semințe și udat",
  32: "Mingea afară",
  33: "Nisip și găleată",
  34: "Umbre pe pământ",
  35: "Apă afară (joc scurt)",
  36: "Insecte de departe",
  37: "Umbră și loc răcoros",
  38: "Piciorul pe iarbă",
  39: "Fructe pe care le vedem",
  40: "Ajutor la treabă scurtă",
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

/** Monday = 1 … Sunday = 7 (Europe/Bucharest civil day). */
export function getDayOfWeek(date = new Date()): number {
  return civilDayOfWeek(date);
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
    timeZone: PROGRAM_TIMEZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}
