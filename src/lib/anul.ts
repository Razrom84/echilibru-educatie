/**
 * Year preview (Anul · teme) — T6, read-only.
 * S1–S52 themes + meteorological season from the program-year calendar.
 * Season uses the Thursday of each Mon–Sun week (ISO week owner).
 */

import { PROGRAM_YEAR_START_MONDAY_2026_27 } from "@/lib/fixtures/program-year-2026-27";
import {
  familyProgramYearStart,
  PROGRAM_WEEKS_PER_YEAR,
  programWeekRange,
  toCivilDate,
  type DateInput,
} from "@/lib/program-week";
import { getWeekTheme, PROGRAM_WEEKS } from "@/lib/week";

export const ANUL_TITLE = "Anul · teme";
export const ANUL_SUBTITLE =
  "Doar privire. Activitățile se deschid pe săptămână.";
export const ANUL_ERROR = "Nu merge acum. Încearcă iar în curând.";
export const ANUL_LOCKED = "Se deschide când ajunge săptămâna";
export const ANUL_NOW = "Acum";

export const SEASONS = ["Toamnă", "Iarnă", "Primăvară", "Vară"] as const;
export type Season = (typeof SEASONS)[number];

export type YearWeekPreview = {
  week: number;
  theme: string;
  season: Season;
  start: string;
  end: string;
  current: boolean;
};

export type SeasonGroup = {
  season: Season;
  weeks: YearWeekPreview[];
};

export function meteorologicalSeason(input: DateInput): Season {
  const { month } = toCivilDate(input);
  if (month >= 9 && month <= 11) return "Toamnă";
  if (month === 12 || month <= 2) return "Iarnă";
  if (month >= 3 && month <= 5) return "Primăvară";
  return "Vară";
}

/** Thursday (ISO week owner) of a Monday `YYYY-MM-DD`. */
export function thursdayOfMonday(monday: string): string {
  const civil = toCivilDate(monday);
  const utc = new Date(Date.UTC(civil.year, civil.month - 1, civil.day + 3));
  return utc.toISOString().slice(0, 10);
}

export function programWeekSeason(
  week: number,
  programYearStart: DateInput,
): Season {
  const { start } = programWeekRange(week, programYearStart);
  return meteorologicalSeason(thursdayOfMonday(start));
}

export function resolveAnulYearStart(family?: {
  program_year_start?: string | null;
  joined_at?: string | null;
  created_at?: string | null;
} | null): string {
  if (family) return familyProgramYearStart(family);
  return PROGRAM_YEAR_START_MONDAY_2026_27;
}

export function yearWeekPreviews(args: {
  programYearStart?: DateInput;
  currentWeek: number;
  /** When set (age-band preview), use these themes instead of the live 1–2 catalog. */
  themes?: Partial<Record<number, string>> | null;
}): YearWeekPreview[] {
  const start = args.programYearStart ?? PROGRAM_YEAR_START_MONDAY_2026_27;
  return PROGRAM_WEEKS.map((week) => {
    const range = programWeekRange(week, start);
    return {
      week,
      theme: args.themes ? (args.themes[week] ?? "") : getWeekTheme(week),
      season: programWeekSeason(week, start),
      start: range.start,
      end: range.end,
      current: week === args.currentWeek,
    };
  });
}

/** Optional grouping used by the Anul screen (season headings, program-year order). */
export function yearWeeksBySeason(
  weeks: readonly YearWeekPreview[],
): SeasonGroup[] {
  const buckets = new Map<Season, YearWeekPreview[]>();
  for (const row of weeks) {
    const list = buckets.get(row.season) ?? [];
    list.push(row);
    buckets.set(row.season, list);
  }
  return SEASONS.filter((season) => buckets.has(season)).map((season) => ({
    season,
    weeks: buckets.get(season) ?? [],
  }));
}

export function anulPreviewReady(weeks: readonly YearWeekPreview[]): boolean {
  return weeks.length === PROGRAM_WEEKS_PER_YEAR;
}

/**
 * V1.5: every S# opens details (Săptămâna). Editability is a separate lock
 * (past/current on the live band). `isPreview` / `isCurrent` stay in the
 * signature so call sites do not fork.
 */
export function anulWeekOpen(_isPreview: boolean, _isCurrent: boolean): boolean {
  void _isPreview;
  void _isCurrent;
  return true;
}

/**
 * V1.4 hid Anul's S1–S52 list when a preview band had no seed.
 * V1.4.1 keeps that list navigable on every preview band (empty themes OK).
 */
const HIDE_EMPTY_PREVIEW_THEME_LIST = false;

export function anulHidesPreviewThemeList(
  isPreview: boolean,
  bandHasContent: boolean,
): boolean {
  return isPreview && !bandHasContent && HIDE_EMPTY_PREVIEW_THEME_LIST;
}
