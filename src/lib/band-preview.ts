import { PROGRAM_AGE_BAND } from "@/lib/week";

/** Pilot bands the parent may preview. Live V1 stays `1-2`. */
export const PILOT_BANDS = ["1-2", "2-3", "3-4", "4-5", "5-6", "6-7"] as const;
export type PilotBand = (typeof PILOT_BANDS)[number];

export const PREVIEW_TITLE = "Previzualizare vârstă";
export const PREVIEW_HELP =
  "Vezi temele altei vârste fără să muți copilul de pe banda lui.";
export const PREVIEW_EXIT = "Înapoi la banda copilului";
export const PREVIEW_LIVE_MARK = "Azi copilul";
export const PREVIEW_EMPTY = "Conținutul pentru această vârstă vine curând.";

export function isPilotBand(value: string | null | undefined): value is PilotBand {
  return (PILOT_BANDS as readonly string[]).includes(value ?? "");
}

export function parsePilotBand(raw: string | null | undefined): PilotBand | null {
  const value = raw?.trim() ?? "";
  return isPilotBand(value) ? value : null;
}

/** Display label with an en dash (`1-2` → `1–2`). */
export function bandLabel(band: string): string {
  return band.replace("-", "–");
}

export function liveChildBand(ageBand: string | null | undefined): PilotBand {
  return parsePilotBand(ageBand) ?? PROGRAM_AGE_BAND;
}

export function isBandPreview(viewBand: string, liveBand: string): boolean {
  return viewBand !== liveBand;
}

export function previewBannerText(band: string): string {
  return `Previzualizare · bandă ${bandLabel(band)} (doar citire)`;
}

export function themesFromActivityRows(
  rows: readonly { saptamana: number; tema_saptamana?: string | null }[],
): Partial<Record<number, string>> {
  const themes: Partial<Record<number, string>> = {};
  for (const row of rows) {
    const theme = row.tema_saptamana?.trim();
    if (!theme || themes[row.saptamana]) continue;
    themes[row.saptamana] = theme;
  }
  return themes;
}

export function bandHasCatalog(
  themes: Partial<Record<number, string>> | null | undefined,
): boolean {
  if (!themes) return false;
  return Object.keys(themes).length > 0;
}
