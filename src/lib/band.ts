import {
  formatCivilDate,
  resolveProgramYearStartMonday,
  toCivilDate,
  type DateInput,
} from "@/lib/program-week";
import type { AgeBand } from "@/lib/types";
import { PROGRAM_AGE_BAND } from "@/lib/week";

/** Display label for the default live band (en dash). */
export const PROGRAM_AGE_BAND_LABEL = "1–2";

/** Cristina lock (M2): every live 1–2 `nota` must be this exact string. */
export const LIVE_BAND_NOTE =
  "Vârsta 1–2: scurt, fără forțare; el poate refuza.";

/** Parallel 2–3 lock: same adult-led tone, no forcing. */
export const LIVE_BAND_NOTE_2_3 =
  "Vârsta 2–3: scurt, fără forțare; el poate refuza.";

export function ageBandLabel(band: string): string {
  return band.replace(/-/g, "–");
}

export function liveBandNote(band: string): string {
  if (band === "2-3") return LIVE_BAND_NOTE_2_3;
  return LIVE_BAND_NOTE;
}

/**
 * Completed years on `on` (civil YYYY-MM-DD). Birthday on the census day counts.
 */
export function ageInCompletedYears(
  birthdate: DateInput,
  on: DateInput,
): number {
  const birth = toCivilDate(birthdate);
  const census = toCivilDate(on);
  let years = census.year - birth.year;
  if (
    census.month < birth.month ||
    (census.month === birth.month && census.day < birth.day)
  ) {
    years -= 1;
  }
  return Math.max(0, years);
}

export function bandFromCompletedYears(years: number): AgeBand {
  if (years < 2) return "1-2";
  if (years < 3) return "2-3";
  if (years < 4) return "3-4";
  if (years < 5) return "4-5";
  if (years < 6) return "5-6";
  return "6-7";
}

/**
 * S1 Monday of the program year in force for `when`
 * (ISO week containing 1 September — same calendar as S#).
 */
export function cohortCensusDate(when: DateInput = new Date()): string {
  return formatCivilDate(resolveProgramYearStartMonday(when));
}

/**
 * School-year cohort band from birthdate.
 * Age is taken at the S1 Monday of the program year in force for `when`.
 * A birthday after that Monday does not change band until the next S1.
 * Missing birthdate falls back to live 1–2.
 */
export function bandFromBirthdate(
  isoDate: string | null,
  when: DateInput = new Date(),
): AgeBand {
  if (!isoDate) return PROGRAM_AGE_BAND;
  return bandFromCompletedYears(ageInCompletedYears(isoDate, cohortCensusDate(when)));
}

export function applyCohortAgeBand<T extends { birthdate?: string | null; age_band: string }>(
  child: T,
  when: DateInput = new Date(),
): T {
  return { ...child, age_band: bandFromBirthdate(child.birthdate ?? null, when) };
}
