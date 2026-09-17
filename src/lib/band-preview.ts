import { clampProgramWeek, isProgramWeek, PROGRAM_AGE_BAND } from "@/lib/week";

/** Pilot bands the parent may preview. Live V1 stays `1-2`. */
export const PILOT_BANDS = ["1-2", "2-3", "3-4", "4-5", "5-6", "6-7"] as const;
export type PilotBand = (typeof PILOT_BANDS)[number];

export const PREVIEW_TITLE = "Previzualizare vârstă";
export const PREVIEW_HELP =
  "Vezi temele altei vârste fără să muți copilul de pe banda lui.";
export const PREVIEW_EXIT = "Înapoi la banda copilului";
export const PREVIEW_LIVE_MARK = "Azi copilul";
export const PREVIEW_EMPTY = "Conținutul pentru această vârstă vine curând.";
export const PREVIEW_WEEK_LABEL = "Săptămâna";
export const PREVIEW_WEEK_PREV = "Săptămâna anterioară";
export const PREVIEW_WEEK_NEXT = "Săptămâna următoare";

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

/** Session-only preview: chosen band + S#, never the child's live program week. */
export type PreviewSession = {
  previewBand: PilotBand | null;
  previewWeek: number | null;
};

/**
 * Preview is a Settings → Previzualizare session, including the live band.
 * Selecting `1-2` while the child is on `1-2` still enters preview so S# nav
 * can browse that catalog without moving the live week.
 */
export function isBandPreview(previewBand: string | null | undefined): boolean {
  return isPilotBand(previewBand);
}

export function viewBandFromSession(
  previewBand: PilotBand | null | undefined,
  liveBand: PilotBand,
): PilotBand {
  return isPilotBand(previewBand) ? previewBand : liveBand;
}

/** Any pilot band, including live, enters or stays in the preview session. */
export function applyPreviewBand(
  band: PilotBand,
  session: PreviewSession = { previewBand: null, previewWeek: null },
): PreviewSession {
  return { previewBand: band, previewWeek: session.previewWeek };
}

export function clearPreviewSession(): PreviewSession {
  return { previewBand: null, previewWeek: null };
}

/**
 * Session S# only. `liveWeek` is returned unchanged so callers cannot move
 * the child's program week from the preview picker.
 */
export function applyPreviewWeek(
  week: number,
  session: PreviewSession,
  liveWeek: number,
): { session: PreviewSession; liveWeek: number } {
  if (!isBandPreview(session.previewBand)) {
    return { session, liveWeek };
  }
  return {
    session: { ...session, previewWeek: clampProgramWeek(week) },
    liveWeek,
  };
}

/**
 * Week shown on Azi / Săptămâna / Anul.
 * In band preview, `previewWeek` is session-only and must not move the live S#.
 */
export function viewProgramWeek(
  isPreview: boolean,
  liveWeek: number,
  previewWeek: number | null | undefined,
): number {
  if (!isPreview || previewWeek == null) return liveWeek;
  return isProgramWeek(previewWeek)
    ? previewWeek
    : clampProgramWeek(previewWeek);
}

export function previewWeekControlLabel(week: number): string {
  return `${PREVIEW_WEEK_LABEL} S${clampProgramWeek(week)}`;
}

/** S# prev/next/picker is shown for every preview band, including empty catalogs. */
export function previewShowsWeekNav(isPreview: boolean): boolean {
  return isPreview;
}

/**
 * Week-activity refetch spinner. Empty bands stay on the empty copy while S#
 * changes; seeded bands wait so Azi does not flash PREVIEW_EMPTY for a week
 * that has rows.
 */
export function previewActivitiesPending(args: {
  catalogWeek: number | null | undefined;
  viewWeek: number;
  bandHasContent: boolean;
}): boolean {
  if (!args.bandHasContent) return false;
  return args.catalogWeek !== args.viewWeek;
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
