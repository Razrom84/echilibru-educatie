/**
 * Completions belong to the activity's program weekday (Europe/Bucharest),
 * not the instant the parent ticked the box.
 */

import {
  bucharestToday,
  programDayCivilDate,
  toDateOnlyString,
  type DateInput,
} from "@/lib/program-week";

export type ActivityDayRef = {
  week_number?: number;
  day_of_week?: number;
  saptamana?: number;
  zi?: number;
};

export function activityProgramCivilDate(
  activity: ActivityDayRef,
  programYearStart: DateInput,
): string | null {
  const week = activity.week_number ?? activity.saptamana;
  const day = activity.day_of_week ?? activity.zi;
  if (week == null || day == null || week < 1 || day < 1 || day > 7) return null;
  return programDayCivilDate(week, day, programYearStart);
}

/** Program-day civil date when the catalog knows the weekday; else `completed_at`. */
export function completionCivilDate(args: {
  completedAt: DateInput;
  programYearStart?: DateInput;
  activity?: ActivityDayRef | null;
}): string {
  if (args.programYearStart && args.activity) {
    const civil = activityProgramCivilDate(args.activity, args.programYearStart);
    if (civil) return civil;
  }
  return toDateOnlyString(args.completedAt);
}

/**
 * Persist `completed_at` on the activity's civil day.
 * Same-day (Azi) keeps the click instant; other weekdays use midday UTC
 * so the Bucharest civil date cannot slip across a DST edge.
 */
export function completedAtForCivilDate(civilDate: string, now: Date = new Date()): string {
  if (bucharestToday(now) === civilDate) return now.toISOString();
  return `${civilDate}T10:00:00.000Z`;
}

export function restampDatesForToggle(args: {
  programCivilDate: string;
  previousCompletedAt?: DateInput | null;
}): string[] {
  const dates = new Set<string>([args.programCivilDate]);
  if (args.previousCompletedAt != null) {
    dates.add(toDateOnlyString(args.previousCompletedAt));
  }
  return [...dates].sort();
}
