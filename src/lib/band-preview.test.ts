import { describe, expect, test } from "vitest";
import { getSeedActivities } from "./seed/week1";
import { clampProgramWeek, PROGRAM_AGE_BAND, PROGRAM_WEEKS } from "./week";
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
  bandHasCatalog,
  bandLabel,
  isBandPreview,
  isPilotBand,
  liveChildBand,
  parsePilotBand,
  previewBannerText,
  previewWeekControlLabel,
  themesFromActivityRows,
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

  test("lists the six pilot bands and marks live as 1-2", () => {
    expect(PILOT_BANDS).toEqual(["1-2", "2-3", "3-4", "4-5", "5-6", "6-7"]);
    expect(PROGRAM_AGE_BAND).toBe("1-2");
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

  test("preview is only when the chosen band is not the child's live band", () => {
    expect(isBandPreview("1-2", "1-2")).toBe(false);
    expect(isBandPreview("2-3", "1-2")).toBe(true);
    expect(isBandPreview("6-7", "1-2")).toBe(true);
  });

  test("banner copy names the preview band as read-only", () => {
    expect(previewBannerText("2-3")).toBe(
      "Previzualizare · bandă 2–3 (doar citire)",
    );
    expect(previewBannerText("4-5")).toBe(
      "Previzualizare · bandă 4–5 (doar citire)",
    );
  });

  test("local seed cannot fill a 2-3 preview; empty only if that band has no rows", () => {
    const weekRows = getSeedActivities(1).filter((row) => row.banda === "2-3");
    const themeRows = PROGRAM_WEEKS.flatMap((week) =>
      getSeedActivities(week).filter((row) => row.banda === "2-3"),
    );
    expect(weekRows).toHaveLength(0);
    expect(themeRows).toHaveLength(0);
    expect(bandHasCatalog(themesFromActivityRows(themeRows))).toBe(false);
    expect(getSeedActivities(1).filter((row) => row.banda === "1-2")).toHaveLength(
      28,
    );
    expect(getSeedActivities(1).some((row) => row.id.includes("-b23-"))).toBe(
      false,
    );
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
  test("locks Săptămâna S# control copy", () => {
    expect(PREVIEW_WEEK_LABEL).toBe("Săptămâna");
    expect(PREVIEW_WEEK_PREV).toBe("Săptămâna anterioară");
    expect(PREVIEW_WEEK_NEXT).toBe("Săptămâna următoare");
    expect(previewWeekControlLabel(1)).toBe("Săptămâna S1");
    expect(previewWeekControlLabel(12)).toBe("Săptămâna S12");
    expect(previewWeekControlLabel(52)).toBe("Săptămâna S52");
  });

  test("preview S# is session-only and does not move the live week", () => {
    const live = 4;
    expect(viewProgramWeek(false, live, 12)).toBe(4);
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
});
