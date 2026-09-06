/**
 * Program week date model (R1).
 *
 * S1 is the Mon–Sun ISO week that contains 1 September (Europe/Bucharest).
 * S = clamp(1..52, floor((monday(today) − program_year_start_monday) / 7) + 1)
 * If S would be >52, rollover to the next program_year_start_monday (never S53).
 *
 * 2026/27 lock (Cristina): `PROGRAM_YEAR_START_MONDAY_2026_27` = 2026-08-31.
 * Functions stay year-generic; that constant is the published fixture.
 */

export const PROGRAM_TIMEZONE = "Europe/Bucharest";
export const PROGRAM_WEEKS_PER_YEAR = 52;

/** Cristina lock: 2026/27 start Monday (ISO week containing 1 Sept 2026). */
export { PROGRAM_YEAR_START_MONDAY_2026_27 } from "@/lib/fixtures/program-year-2026-27";

const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

const BUCHAREST_CIVIL = new Intl.DateTimeFormat("en-CA", {
  timeZone: PROGRAM_TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export type CivilDate = {
  year: number;
  month: number;
  day: number;
};

export type DateInput = Date | string;

export type ProgramWeekRange = {
  week: number;
  start: string;
  end: string;
};

export type FamilyJoinFields = {
  joined_at: string;
  program_year_start: string;
};

function utcDate(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month - 1, day));
}

function addUtcDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 86_400_000);
}

function isoDowMonday1(date: Date): number {
  const utcDay = date.getUTCDay();
  return utcDay === 0 ? 7 : utcDay;
}

export function formatCivilDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function formatCivilParts(civil: CivilDate): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${civil.year}-${pad(civil.month)}-${pad(civil.day)}`;
}

/** YYYY-MM-DD in Europe/Bucharest for instants; date-only strings stay as-is. */
export function toDateOnlyString(input: DateInput): string {
  if (typeof input === "string" && DATE_ONLY.test(input)) return input;
  return formatCivilParts(toCivilDate(input));
}

export function compareCivilDates(a: DateInput, b: DateInput): number {
  return toDateOnlyString(a).localeCompare(toDateOnlyString(b));
}

/** Monday = 1 … Sunday = 7 for the Bucharest civil date of `input`. */
export function civilDayOfWeek(input: DateInput): number {
  const civil = toCivilDate(input);
  return isoDowMonday1(utcDate(civil.year, civil.month, civil.day));
}

/** Today's civil date in Europe/Bucharest (`YYYY-MM-DD`). */
export function bucharestToday(now: Date = new Date()): string {
  return formatCivilParts(civilDateInBucharest(now));
}

export function civilDateInBucharest(instant: Date): CivilDate {
  const [year, month, day] = BUCHAREST_CIVIL.format(instant).split("-").map(Number);
  return { year, month, day };
}

export function toCivilDate(input: DateInput): CivilDate {
  if (typeof input === "string") {
    const match = DATE_ONLY.exec(input);
    if (match) {
      return { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) };
    }
    return civilDateInBucharest(new Date(input));
  }
  return civilDateInBucharest(input);
}

function mondayOfCivil(civil: CivilDate): Date {
  const utc = utcDate(civil.year, civil.month, civil.day);
  return addUtcDays(utc, 1 - isoDowMonday1(utc));
}

/** Monday of the ISO week that contains `input`, in Europe/Bucharest civil time. */
export function mondayOf(input: DateInput): Date {
  return mondayOfCivil(toCivilDate(input));
}

/** Monday of the ISO week that contains 1 September of `year`. */
export function programYearStartMonday(year: number): Date {
  return mondayOf(`${year}-09-01`);
}

function rawWeekNumber(monday: Date, programYearStart: Date): number {
  return Math.floor((monday.getTime() - programYearStart.getTime()) / 86_400_000 / 7) + 1;
}

function nextProgramYearStartMonday(start: Date): Date {
  return programYearStartMonday(start.getUTCFullYear() + 1);
}

/**
 * Latest `program_year_start_monday` that applies to `input`.
 * Rolls forward when the raw week would be S53+.
 */
export function resolveProgramYearStartMonday(input: DateInput): Date {
  const monday = mondayOf(input);
  const year = toCivilDate(input).year;
  const startThis = programYearStartMonday(year);
  const startPrev = programYearStartMonday(year - 1);
  let start = monday.getTime() >= startThis.getTime() ? startThis : startPrev;
  if (rawWeekNumber(monday, start) > PROGRAM_WEEKS_PER_YEAR) {
    start = start.getTime() === startThis.getTime() ? nextProgramYearStartMonday(startThis) : startThis;
  }
  return start;
}

function clampWeek(value: number): number {
  return Math.min(PROGRAM_WEEKS_PER_YEAR, Math.max(1, value));
}

/**
 * Program week 1..52 for a civil date.
 * If `programYearStart` is omitted, the start Monday is resolved from `input`.
 * Weeks past 52 rollover onto the next program year (never S53).
 */
export function programWeekNumber(input: DateInput, programYearStart?: DateInput): number {
  const monday = mondayOf(input);
  let start = programYearStart ? mondayOf(programYearStart) : resolveProgramYearStartMonday(input);
  let week = rawWeekNumber(monday, start);
  while (week > PROGRAM_WEEKS_PER_YEAR) {
    start = nextProgramYearStartMonday(start);
    week = rawWeekNumber(monday, start);
  }
  return clampWeek(week);
}

export function programWeekRange(
  week: number,
  programYearStart: DateInput,
): ProgramWeekRange {
  const start = addUtcDays(mondayOf(programYearStart), (week - 1) * 7);
  return {
    week,
    start: formatCivilDate(start),
    end: formatCivilDate(addUtcDays(start, 6)),
  };
}

/** Validation-F helper: S1–S52 → Mon–Sun ranges for a program year. */
export function programWeekTable(programYearStart?: DateInput): ProgramWeekRange[] {
  const start = programYearStart
    ? mondayOf(programYearStart)
    : resolveProgramYearStartMonday(new Date());
  return Array.from({ length: PROGRAM_WEEKS_PER_YEAR }, (_, index) =>
    programWeekRange(index + 1, start),
  );
}

/** Values to persist on `families` when a parent joins. */
export function familyJoinFields(joinedAt: DateInput = new Date()): FamilyJoinFields {
  const instant =
    typeof joinedAt === "string" && DATE_ONLY.test(joinedAt)
      ? utcDate(
          Number(joinedAt.slice(0, 4)),
          Number(joinedAt.slice(5, 7)),
          Number(joinedAt.slice(8, 10)),
        )
      : new Date(joinedAt);
  return {
    joined_at: instant.toISOString(),
    program_year_start: formatCivilDate(resolveProgramYearStartMonday(joinedAt)),
  };
}

/** Stored Monday, or the Monday implied by `joined_at` / `created_at`. */
export function familyProgramYearStart(family: {
  program_year_start?: string | null;
  joined_at?: string | null;
  created_at?: string | null;
}): string {
  if (family.program_year_start) return family.program_year_start;
  const source = family.joined_at ?? family.created_at ?? new Date();
  return formatCivilDate(resolveProgramYearStartMonday(source));
}

/** S# for `now` using the family's stored / derived program year start. */
export function familyProgramWeek(
  family: {
    program_year_start?: string | null;
    joined_at?: string | null;
    created_at?: string | null;
  } | null,
  now: DateInput = new Date(),
): number {
  return programWeekNumber(now, family ? familyProgramYearStart(family) : undefined);
}
