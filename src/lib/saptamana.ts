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
export type ProgramWeekDay = (typeof PROGRAM_WEEK_DAYS)[number];

/** Short chip labels: L M Mi J V S D (Marți vs Miercuri). */
export const WEEK_DAY_CHIP_LABELS: Record<ProgramWeekDay, string> = {
  1: "L",
  2: "M",
  3: "Mi",
  4: "J",
  5: "V",
  6: "S",
  7: "D",
};

export function isProgramWeekDay(value: number): value is ProgramWeekDay {
  return (PROGRAM_WEEK_DAYS as readonly number[]).includes(value);
}

export function weekDayChipLabel(dayOfWeek: number): string {
  return isProgramWeekDay(dayOfWeek) ? WEEK_DAY_CHIP_LABELS[dayOfWeek] : "";
}

export function weekDaySectionId(dayOfWeek: number): string {
  return `zi-${dayOfWeek}`;
}

export function weekDayHref(dayOfWeek: number): string {
  return `/saptamana?zi=${dayOfWeek}`;
}

export function parseWeekDayParam(
  raw: string | string[] | null | undefined,
): ProgramWeekDay | null {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (value == null || value === "") return null;
  const n = Number(value);
  return isProgramWeekDay(n) ? n : null;
}

/**
 * Chip / week-screen focus: explicit `?zi=` if still visible after trim,
 * else today, else the first remaining day.
 */
export function focusedWeekDay(args: {
  requestedDay?: number | null;
  todayDay: number;
  visibleDays: readonly number[];
}): number | null {
  const { requestedDay, todayDay, visibleDays } = args;
  if (requestedDay != null && visibleDays.includes(requestedDay)) {
    return requestedDay;
  }
  if (visibleDays.includes(todayDay)) return todayDay;
  return visibleDays[0] ?? null;
}

const MS_PER_DAY = 86_400_000;

export function saptamanaSubtitle(week: number, theme: string): string {
  const trimmed = theme.trim();
  return trimmed ? `S${week} · ${trimmed}` : `S${week}`;
}

export const MIDWEEK_JOIN_SUNDAY =
  "Doar duminică în săptămâna asta. De luni, toată săptămâna.";
export const MIDWEEK_JOIN_GENERIC =
  "Săptămâna asta începe de azi. De luni, zilele L–D.";

/** Helper under the week title when `joined_at` trims Monday–… */
export function midweekJoinHelper(visibleDays: readonly number[]): string | null {
  const first = visibleDays[0];
  if (first == null || first === 1) return null;
  if (first === 7) return MIDWEEK_JOIN_SUNDAY;
  if (first >= 2 && first <= 6) {
    return `De la ${weekDayName(first).toLocaleLowerCase("ro-RO")} până duminică. De luni, toată săptămâna.`;
  }
  return MIDWEEK_JOIN_GENERIC;
}

export function weekDayName(dayOfWeek: number): string {
  return getDayName(dayOfWeek);
}

/** Sunday week-chip / section label — recap framing, not a new lesson day. */
export const SUNDAY_RECAP_CHIP = "Duminică · recap";

export function weekDayHeading(dayOfWeek: number): string {
  return dayOfWeek === 7 ? SUNDAY_RECAP_CHIP : weekDayName(dayOfWeek);
}

export function weekDayChipSecondary(
  dayOfWeek: number,
  isToday: boolean,
): string {
  if (dayOfWeek === 7) return SUNDAY_RECAP_CHIP;
  return isToday ? "azi" : weekDayName(dayOfWeek);
}

export function weekDayAriaLabel(dayOfWeek: number, isToday: boolean): string {
  const base = weekDayHeading(dayOfWeek);
  if (isToday && dayOfWeek !== 7) return `${base} · azi`;
  return base;
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
