/**
 * V1.5 — session view week vs official program week.
 *
 * `officialWeek` (`familyProgramWeek` / demo Settings tool) is what digests
 * and mail use. Navigating S# on Azi / Săptămâna only moves `sessionWeek`.
 *
 * Write lock (Răzvan / Cristina lock): bifă / notă / poză when
 * `viewBand` is the **live** cohort band **or** the immediately previous
 * band, **and** the viewed S# is not future. Example: child on 2–3 can
 * edit 2–3 and 1–2 for past/current S#; 3–4 is read-only; future S# is
 * read-only on both writable bands. Live `1-2` has no previous.
 */

import { clampProgramWeek, isProgramWeek } from "@/lib/week";
import { familyProgramWeek } from "@/lib/program-week";

export const VIEW_WEEK_LABEL = "Săptămâna";
export const VIEW_WEEK_PREV = "Săptămâna anterioară";
export const VIEW_WEEK_NEXT = "Săptămâna următoare";
export const VIEW_WEEK_BACK = "Înapoi la săptămâna de azi";
export const VIEW_WEEK_READ_ONLY = "doar citire";
export const VIEW_WEEK_FUTURE_HINT = "Săptămână viitoare — doar citire.";
export const VIEW_WEEK_PAST_HINT = "Săptămână trecută — poți bifa, nota și poza.";

export type WeekRelation = "past" | "current" | "future";

export type ViewWeekSession = {
  sessionWeek: number | null;
};

/** Session S# only. Callers get `officialWeek` back unchanged. */
export function applySessionViewWeek(
  week: number,
  officialWeek: number,
  session: ViewWeekSession = { sessionWeek: null },
): { session: ViewWeekSession; officialWeek: number } {
  return {
    session: { ...session, sessionWeek: clampProgramWeek(week) },
    officialWeek,
  };
}

export function clearSessionViewWeek(
  session: ViewWeekSession = { sessionWeek: null },
): ViewWeekSession {
  return { ...session, sessionWeek: null };
}

/**
 * Week shown on Azi / Săptămâna / Anul details.
 * A set session week wins on live **and** in band preview.
 */
export function resolveViewWeek(
  officialWeek: number,
  sessionWeek: number | null | undefined,
): number {
  if (sessionWeek == null) return officialWeek;
  return isProgramWeek(sessionWeek)
    ? sessionWeek
    : clampProgramWeek(sessionWeek);
}

export function weekRelation(
  viewWeek: number,
  officialWeek: number,
): WeekRelation {
  if (viewWeek < officialWeek) return "past";
  if (viewWeek > officialWeek) return "future";
  return "current";
}

/**
 * Same ladder as `PILOT_BANDS`. Kept here so the write lock does not import
 * `band-preview` (that module already imports this file).
 */
const COHORT_BAND_LADDER = ["1-2", "2-3", "3-4", "4-5", "5-6", "6-7"] as const;

/** Immediately previous cohort band, or `null` when the live band is first. */
export function previousBand(liveBand: string): string | null {
  const index = (COHORT_BAND_LADDER as readonly string[]).indexOf(liveBand);
  return index > 0 ? COHORT_BAND_LADDER[index - 1] : null;
}

export function isWritableCohortBand(viewBand: string, liveBand: string): boolean {
  return viewBand === liveBand || viewBand === previousBand(liveBand);
}

export function weekWritesAllowed(args: {
  viewWeek: number;
  officialWeek: number;
  viewBand: string;
  liveBand: string;
}): boolean {
  if (!isWritableCohortBand(args.viewBand, args.liveBand)) return false;
  return weekRelation(args.viewWeek, args.officialWeek) !== "future";
}

/** Join-day trim applies only to the official current week on the live band. */
export function trimsJoinDays(
  relation: WeekRelation,
  viewingOtherBand: boolean,
): boolean {
  return !viewingOtherBand && relation === "current";
}

/** S# prev/next/picker on live Azi / Săptămâna, not only in band preview. */
export function showsLiveWeekNav(): boolean {
  return true;
}

export function viewWeekControlLabel(week: number): string {
  return `${VIEW_WEEK_LABEL} ${clampProgramWeek(week)}`;
}

export function viewWeekBrowsingStatus(
  viewWeek: number,
  officialWeek: number,
): string | null {
  if (viewWeek === officialWeek) return null;
  return `Privești S${viewWeek}. Săptămâna oficială rămâne S${officialWeek}.`;
}

export function viewWeekModeHint(
  viewWeek: number,
  officialWeek: number,
  writesAllowed?: boolean,
): string | null {
  const relation = weekRelation(viewWeek, officialWeek);
  if (writesAllowed === true) {
    if (relation === "past") return VIEW_WEEK_PAST_HINT;
    return null;
  }
  if (writesAllowed === false) {
    return relation === "future" ? VIEW_WEEK_FUTURE_HINT : null;
  }
  if (relation === "future") return VIEW_WEEK_FUTURE_HINT;
  if (relation === "past") return VIEW_WEEK_PAST_HINT;
  return null;
}

/**
 * Official week for digests/mail. Session S# is ignored on purpose —
 * `familyProgramWeek` reads the calendar, never a view-week picker.
 */
export function officialProgramWeekForDigests(
  family: {
    program_year_start?: string | null;
    joined_at?: string | null;
    created_at?: string | null;
  } | null,
  now?: Date | string,
  _sessionWeek?: number | null,
): number {
  void _sessionWeek;
  return familyProgramWeek(family, now);
}
