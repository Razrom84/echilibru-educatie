import { describe, expect, test } from "vitest";
import { getSeedActivities, usesLocalSeedCatalog } from "./seed/week1";
import {
  clampProgramWeek,
  LIVE_AGE_BANDS,
  PROGRAM_AGE_BAND,
  PROGRAM_WEEKS,
} from "./week";
import {
  PILOT_BANDS,
  PREVIEW_EMPTY,
  PREVIEW_EXIT,
  PREVIEW_HELP,
  PREVIEW_LIVE_MARK,
  PREVIEW_TITLE,
  PREVIEW_WEEK_LABEL,
  PREVIEW_WEEK_NEXT,
  PREVIEW_WEEK_PREV,
  applyPreviewBand,
  applyPreviewWeek,
  bandHasCatalog,
  bandLabel,
  clearPreviewSession,
  isBandPreview,
  isPilotBand,
  liveChildBand,
  parsePilotBand,
  previewActivitiesPending,
  previewBannerText,
  previewShowsWeekNav,
  previewWeekControlLabel,
  themesFromActivityRows,
  viewBandFromSession,
  viewProgramWeek,
} from "./band-preview";

describe("V1.4 age-band preview", () => {
  test("locks Settings copy", () => {
    expect(PREVIEW_TITLE).toBe("Previzualizare vârstă");
    expect(PREVIEW_HELP).toBe(
      "Vezi temele altei vârste fără să muți copilul de pe banda lui.",
    );
    expect(PREVIEW_EXIT).toBe("Înapoi la banda copilului");
    expect(PREVIEW_LIVE_MARK).toBe("Azi copilul");
    expect(PREVIEW_EMPTY).toBe(
      "Conținutul pentru această vârstă vine curând.",
    );
  });

  test("lists the six pilot bands; live catalogs are 1-2 and 2-3", () => {
    expect(PILOT_BANDS).toEqual(["1-2", "2-3", "3-4", "4-5", "5-6", "6-7"]);
    expect(PROGRAM_AGE_BAND).toBe("1-2");
    expect(LIVE_AGE_BANDS).toEqual(["1-2", "2-3"]);
    expect(liveChildBand("1-2")).toBe("1-2");
    expect(liveChildBand("2-3")).toBe("2-3");
    expect(liveChildBand(null)).toBe("1-2");
    expect(liveChildBand("nope")).toBe("1-2");
  });

  test("display labels use an en dash", () => {
    expect(PILOT_BANDS.map(bandLabel)).toEqual([
      "1–2",
      "2–3",
      "3–4",
      "4–5",
      "5–6",
      "6–7",
    ]);
  });

  test("cookie/session values accept only pilot bands", () => {
    expect(parsePilotBand("2-3")).toBe("2-3");
    expect(parsePilotBand(" 6-7 ")).toBe("6-7");
    expect(parsePilotBand("1–2")).toBeNull();
    expect(parsePilotBand("7-8")).toBeNull();
    expect(parsePilotBand("")).toBeNull();
    expect(isPilotBand("3-4")).toBe(true);
    expect(isPilotBand("1-2")).toBe(true);
  });

  test("preview session is active for any chosen pilot band, including live", () => {
    expect(isBandPreview("1-2")).toBe(true);
    expect(isBandPreview("2-3")).toBe(true);
    expect(isBandPreview("6-7")).toBe(true);
    expect(isBandPreview(null)).toBe(false);
    expect(isBandPreview(undefined)).toBe(false);
  });

  test("banner copy names the preview band as read-only by default", () => {
    expect(previewBannerText("1-2")).toBe(
      "Previzualizare · bandă 1–2 (doar citire)",
    );
    expect(previewBannerText("2-3")).toBe(
      "Previzualizare · bandă 2–3 (doar citire)",
    );
    expect(previewBannerText("4-5")).toBe(
      "Previzualizare · bandă 4–5 (doar citire)",
    );
    expect(previewBannerText("1-2", true)).toBe("Previzualizare · bandă 1–2");
  });

  test("local v2 seed fills a 2-3 preview; default catalog stays 1-2", () => {
    const weekRows = getSeedActivities(1, "2-3");
    const themeRows = PROGRAM_WEEKS.flatMap((week) =>
      getSeedActivities(week, "2-3"),
    );
    expect(weekRows).toHaveLength(28);
    expect(weekRows.every((row) => row.banda === "2-3")).toBe(true);
    expect(themeRows).toHaveLength(1456);
    expect(bandHasCatalog(themesFromActivityRows(themeRows))).toBe(true);
    expect(getSeedActivities(1).filter((row) => row.banda === "1-2")).toHaveLength(
      28,
    );
    expect(getSeedActivities(1).some((row) => row.id.includes("-b23-"))).toBe(
      false,
    );
    expect(getSeedActivities(1, "3-4")).toHaveLength(0);
    expect(usesLocalSeedCatalog({ isDemo: true, band: "6-7" })).toBe(true);
    expect(usesLocalSeedCatalog({ isDemo: false, band: "2-3" })).toBe(true);
    expect(usesLocalSeedCatalog({ isDemo: false, band: "1-2" })).toBe(false);
  });

  test("catalog themes come from banda rows, not historical activity ids", () => {
    const themes = themesFromActivityRows([
      {
        saptamana: 1,
        tema_saptamana: "Apa în casă și afară",
      },
      {
        saptamana: 1,
        tema_saptamana: "Apa în casă și afară",
      },
      { saptamana: 2, tema_saptamana: "  " },
      { saptamana: 3, tema_saptamana: "Mâini și degete" },
    ]);
    expect(themes).toEqual({
      1: "Apa în casă și afară",
      3: "Mâini și degete",
    });
    expect(bandHasCatalog(themes)).toBe(true);
    expect(bandHasCatalog({})).toBe(false);
    expect(bandHasCatalog(null)).toBe(false);
  });
});

describe("V1.4.1 preview week navigation", () => {
  test("locks Săptămâna n control copy (no leading S in the number)", () => {
    expect(PREVIEW_WEEK_LABEL).toBe("Săptămâna");
    expect(PREVIEW_WEEK_PREV).toBe("Săptămâna anterioară");
    expect(PREVIEW_WEEK_NEXT).toBe("Săptămâna următoare");
    expect(previewWeekControlLabel(1)).toBe("Săptămâna 1");
    expect(previewWeekControlLabel(3)).toBe("Săptămâna 3");
    expect(previewWeekControlLabel(12)).toBe("Săptămâna 12");
    expect(previewWeekControlLabel(52)).toBe("Săptămâna 52");
  });

  test("preview S# is session-only and does not move the live week", () => {
    const live = 4;
    expect(viewProgramWeek(false, live, 12)).toBe(12);
    expect(viewProgramWeek(true, live, 12)).toBe(12);
    expect(viewProgramWeek(true, live, null)).toBe(4);
    expect(viewProgramWeek(true, live, undefined)).toBe(4);
    expect(viewProgramWeek(false, live, null)).toBe(4);
  });

  test("preview picker stays on S1–S52", () => {
    expect(clampProgramWeek(1)).toBe(1);
    expect(clampProgramWeek(52)).toBe(52);
    expect(clampProgramWeek(0)).toBe(1);
    expect(clampProgramWeek(53)).toBe(52);
    expect(clampProgramWeek(Number.NaN)).toBe(1);
    expect(viewProgramWeek(true, 4, 99)).toBe(52);
  });

  test("selecting the live band enters a preview session instead of exiting", () => {
    const liveBand = "1-2" as const;
    const session = applyPreviewBand(liveBand);
    expect(isBandPreview(session.previewBand)).toBe(true);
    expect(session.previewBand).toBe("1-2");
    expect(viewBandFromSession(session.previewBand, liveBand)).toBe("1-2");
    expect(previewShowsWeekNav(isBandPreview(session.previewBand))).toBe(true);
  });

  test("switching from a non-live band to live 1-2 stays in preview", () => {
    const fromOther = applyPreviewWeek(12, applyPreviewBand("2-3"), 4).session;
    const toLive = applyPreviewBand("1-2", fromOther);
    expect(isBandPreview(toLive.previewBand)).toBe(true);
    expect(toLive.previewBand).toBe("1-2");
    expect(toLive.previewWeek).toBe(12);
  });

  test("applyPreviewWeek sets session S# on live and in preview, never live week", () => {
    const liveWeek = 4;
    const idle = { previewBand: null, previewWeek: null };
    const { session, liveWeek: unchanged } = applyPreviewWeek(12, idle, liveWeek);
    expect(session.previewWeek).toBe(12);
    expect(session.previewBand).toBeNull();
    expect(unchanged).toBe(4);
  });

  test("selectPreviewWeek does not mutate the live week", () => {
    const liveWeek = 4;
    const started = applyPreviewBand("1-2");
    const { session, liveWeek: unchanged } = applyPreviewWeek(
      12,
      started,
      liveWeek,
    );
    expect(session.previewWeek).toBe(12);
    expect(unchanged).toBe(4);
    expect(liveWeek).toBe(4);
    expect(
      viewProgramWeek(isBandPreview(session.previewBand), liveWeek, session.previewWeek),
    ).toBe(12);
  });

  test("Înapoi / clearPreview restores live band and live S#", () => {
    const liveBand = "1-2" as const;
    const liveWeek = 4;
    const previewing = applyPreviewWeek(
      12,
      applyPreviewBand(liveBand),
      liveWeek,
    ).session;
    const cleared = clearPreviewSession();
    expect(isBandPreview(cleared.previewBand)).toBe(false);
    expect(cleared.previewWeek).toBeNull();
    expect(viewBandFromSession(cleared.previewBand, liveBand)).toBe(liveBand);
    expect(
      viewProgramWeek(
        isBandPreview(cleared.previewBand),
        liveWeek,
        cleared.previewWeek,
      ),
    ).toBe(4);
    expect(previewing.previewWeek).toBe(12);
  });

  test("S# control is shown for every preview band, including live and empty catalogs", () => {
    for (const band of PILOT_BANDS) {
      expect(isBandPreview(band)).toBe(true);
      expect(previewShowsWeekNav(isBandPreview(band))).toBe(true);
    }
    expect(previewShowsWeekNav(true)).toBe(true);
    expect(previewShowsWeekNav(false)).toBe(false);
    expect(
      previewActivitiesPending({
        catalogWeek: 4,
        viewWeek: 12,
        bandHasContent: false,
      }),
    ).toBe(false);
    expect(
      previewActivitiesPending({
        catalogWeek: 4,
        viewWeek: 12,
        bandHasContent: true,
      }),
    ).toBe(true);
    expect(
      previewActivitiesPending({
        catalogWeek: 12,
        viewWeek: 12,
        bandHasContent: true,
      }),
    ).toBe(false);
  });
});
