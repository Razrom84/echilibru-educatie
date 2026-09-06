/**
 * Cristina lock for 2026/27 (docs/MAPPING-S1-S52-DATE-2026.md).
 * program_year_start_monday = Monday of the ISO week containing 1 Sept 2026.
 *
 * Pure helpers in program-week.ts stay year-generic; this fixture is the
 * default published year for tests and later tickets.
 */
export const PROGRAM_YEAR_START_MONDAY_2026_27 = "2026-08-31";

export const PROGRAM_YEAR_2026_27 = {
  startMonday: PROGRAM_YEAR_START_MONDAY_2026_27,
  /** Tuesday — inside S1, not the week start. */
  sept1: "2026-09-01",
  s1: { start: "2026-08-31", end: "2026-09-06" },
  s2: { start: "2026-09-07", end: "2026-09-13" },
  s21: { start: "2027-01-18", end: "2027-01-24" },
  s52: { start: "2027-08-23", end: "2027-08-29" },
  /** Sept 1 2027 is Wednesday → next S1 Monday. */
  nextStartMonday: "2027-08-30",
} as const;
