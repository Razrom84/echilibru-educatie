import seedS1 from "../../../content/seed-s1-banda-2-3.json";
import seedS2S4 from "../../../content/seed-s2-s4-banda-2-3.json";
import type { Activity, SeedActivity } from "@/lib/types";
import { getWeekTheme, PROGRAM_WEEK } from "@/lib/week";

const ALL_SEED = [
  ...(seedS1.activitati as SeedActivity[]),
  ...(seedS2S4.activitati as SeedActivity[]),
];

/** Theme of the default week (S1). Prefer `getWeekTheme(selectedWeek)`. */
export const WEEK_THEME = getWeekTheme(PROGRAM_WEEK);

export function normalizeActivity(row: SeedActivity): Activity {
  return {
    ...row,
    nota: row.nota ?? null,
    week_number: row.saptamana,
    day_of_week: row.zi,
    pillar: row.pilon,
    title: row.titlu,
    body: row.pasi.join(" "),
    age_band: row.banda,
    is_placeholder: false,
  };
}

/** Demo / offline catalog for the active program week (V1 default: S1). */
export function getWeek1Activities(): Activity[] {
  return ALL_SEED.filter((row) => row.saptamana === PROGRAM_WEEK).map(
    normalizeActivity,
  );
}

export function getSeedActivities(week = PROGRAM_WEEK): Activity[] {
  return ALL_SEED.filter((row) => row.saptamana === week).map(normalizeActivity);
}
