/**
 * V1.5 — session view week vs official program week.
 *
 * `officialWeek` (`familyProgramWeek` / demo Settings tool) is what digests
 * and mail use. Navigating S# on Azi / Săptămâna only moves `sessionWeek`.
 *
 * Write lock (Răzvan GO, ambiguous "previous bands" fallback):
 * writable actions (bifă / notă / poză) only when viewing the **live** child's
 * band catalog for a **past or current** S#. Non-live preview bands stay
 * read-only. Future S# is read-only on every band.
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

export function weekWritesAllowed(args: {
  viewWeek: number;
  officialWeek: number;
  viewBand: string;
  liveBand: string;
}): boolean {
  if (args.viewBand !== args.liveBand) return false;
  return weekRelation(args.viewWeek, args.officialWeek) !== "future";
}

/** S# prev/next/picker on live Azi / Săptămâna, not only in band preview. */
export function showsLiveWeekNav(): boolean {
  return true;
}

export function viewWeekControlLabel(week: number): string {
  return `${VIEW_WEEK_LABEL} S${clampProgramWeek(week)}`;
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
): string | null {
  const relation = weekRelation(viewWeek, officialWeek);
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
