/**
 * Azi (today) screen model — R2.
 * Civil day + S# come from program-week.ts (Europe/Bucharest).
 */

import {
  civilDayOfWeek,
  compareCivilDates,
  type DateInput,
} from "@/lib/program-week";
import { getDayName } from "@/lib/week";

export const AZI_SUBTITLE = "Patru lucruri scurte — când vreți.";
export const AZI_BEFORE_JOIN = "Astăzi începe de aici.";
export const AZI_ALL_DONE = "Gata pe azi. Mâine continuăm.";

export function aziTitle(weekTheme: string): string {
  const theme = weekTheme.trim();
  return theme ? `Azi · ${theme}` : "Azi";
}

export function aziFutureLocked(dayOfWeek: number): string {
  return `Se deschide ${getDayName(dayOfWeek)}.`;
}

export type AziGate = "before_join" | "locked" | "open";

/**
 * Access for a civil day:
 * - before `joined_at` (same week or earlier) → empty start
 * - after today → future locked
 * - otherwise open (today or a past day since join)
 */
export function aziGate(args: {
  viewDate: DateInput;
  today: DateInput;
  joinedAt?: DateInput | null;
}): AziGate {
  if (args.joinedAt && compareCivilDates(args.viewDate, args.joinedAt) < 0) {
    return "before_join";
  }
  if (compareCivilDates(args.viewDate, args.today) > 0) {
    return "locked";
  }
  return "open";
}

export function aziAllDone(activityCount: number, completedCount: number): boolean {
  return activityCount > 0 && completedCount >= activityCount;
}

export function aziDayOfWeek(today: DateInput): number {
  return civilDayOfWeek(today);
}
