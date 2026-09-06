/**
 * Săptămâna asta (current civil week) — R3.
 * Mon–Sun in Europe/Bucharest; days before `joined_at` are trimmed.
 */

import { getDayName } from "@/lib/week";
import {
  compareCivilDates,
  formatCivilDate,
  mondayOf,
  type DateInput,
} from "@/lib/program-week";

export const SAPTAMANA_TITLE = "Săptămâna asta";

export const PROGRAM_WEEK_DAYS = [1, 2, 3, 4, 5, 6, 7] as const;

const MS_PER_DAY = 86_400_000;

export function saptamanaSubtitle(week: number, theme: string): string {
  const trimmed = theme.trim();
  return trimmed ? `S${week} · ${trimmed}` : `S${week}`;
}

export function weekDayName(dayOfWeek: number): string {
  return getDayName(dayOfWeek);
}

/** Civil `YYYY-MM-DD` for weekday `1…7` in the ISO week of `weekMonday`. */
export function weekDayCivilDate(weekMonday: DateInput, dayOfWeek: number): string {
  const monday = mondayOf(weekMonday);
  return formatCivilDate(new Date(monday.getTime() + (dayOfWeek - 1) * MS_PER_DAY));
}

/**
 * Weekdays to show for the current civil week.
 * Days before `joined_at` (same week or earlier) are omitted — not locked cards.
 */
export function visibleProgramWeekDays(args: {
  weekMonday: DateInput;
  joinedAt?: DateInput | null;
}): number[] {
  if (!args.joinedAt) return [...PROGRAM_WEEK_DAYS];
  const joinedAt = args.joinedAt;
  return PROGRAM_WEEK_DAYS.filter(
    (day) => compareCivilDates(weekDayCivilDate(args.weekMonday, day), joinedAt) >= 0,
  );
}
