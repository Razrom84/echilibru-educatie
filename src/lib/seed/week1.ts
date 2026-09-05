import official from "../../../content/seed-s1-banda-2-3.json";
import type { Activity, SeedActivity } from "@/lib/types";

export const WEEK_THEME = official.tema;

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

export function getWeek1Activities(): Activity[] {
  return (official.activitati as SeedActivity[]).map(normalizeActivity);
}
