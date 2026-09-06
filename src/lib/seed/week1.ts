import seedS1 from "../../../content/seed-s1-banda-1-2.json";
import seedS2S4 from "../../../content/seed-s2-s4-banda-1-2.json";
import seedS5S8 from "../../../content/seed-s5-s8-banda-1-2.json";
import seedS9S12 from "../../../content/seed-s9-s12-banda-1-2.json";
import seedS13S16 from "../../../content/seed-s13-s16-banda-1-2.json";
import seedS17S20 from "../../../content/seed-s17-s20-banda-1-2.json";
import seedS21S24 from "../../../content/seed-s21-s24-banda-1-2.json";
import seedS25S28 from "../../../content/seed-s25-s28-banda-1-2.json";
import seedS29S32 from "../../../content/seed-s29-s32-banda-1-2.json";
import seedS33S36 from "../../../content/seed-s33-s36-banda-1-2.json";
import seedS37S40 from "../../../content/seed-s37-s40-banda-1-2.json";
import seedS41S44 from "../../../content/seed-s41-s44-banda-1-2.json";
import seedS45S48 from "../../../content/seed-s45-s48-banda-1-2.json";
import type { Activity, SeedActivity } from "@/lib/types";
import { getWeekTheme, PROGRAM_WEEK } from "@/lib/week";

const ALL_SEED = [
  ...(seedS1.activitati as SeedActivity[]),
  ...(seedS2S4.activitati as SeedActivity[]),
  ...(seedS5S8.activitati as SeedActivity[]),
  ...(seedS9S12.activitati as SeedActivity[]),
  ...(seedS13S16.activitati as SeedActivity[]),
  ...(seedS17S20.activitati as SeedActivity[]),
  ...(seedS21S24.activitati as SeedActivity[]),
  ...(seedS25S28.activitati as SeedActivity[]),
  ...(seedS29S32.activitati as SeedActivity[]),
  ...(seedS33S36.activitati as SeedActivity[]),
  ...(seedS37S40.activitati as SeedActivity[]),
  ...(seedS41S44.activitati as SeedActivity[]),
  ...(seedS45S48.activitati as SeedActivity[]),
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
