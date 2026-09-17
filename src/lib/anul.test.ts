import { describe, expect, test } from "vitest";
import {
  ANUL_ERROR,
  ANUL_LOCKED,
  ANUL_NOW,
  ANUL_SUBTITLE,
  ANUL_TITLE,
  anulHidesPreviewThemeList,
  anulPreviewReady,
  anulWeekOpen,
  meteorologicalSeason,
  programWeekSeason,
  resolveAnulYearStart,
  thursdayOfMonday,
  yearWeekPreviews,
  yearWeeksBySeason,
} from "./anul";
import { PROGRAM_YEAR_START_MONDAY_2026_27 } from "./fixtures/program-year-2026-27";
import { WEEK_THEMES } from "./week";

describe("Anul copy (Cristina)", () => {
  test("locks the published strings", () => {
    expect(ANUL_TITLE).toBe("Anul · teme");
    expect(ANUL_SUBTITLE).toBe(
      "Doar privire. Activitățile se deschid pe săptămână.",
    );
    expect(ANUL_ERROR).toBe("Nu merge acum. Încearcă iar în curând.");
    expect(ANUL_LOCKED).toBe("Se deschide când ajunge săptămâna");
    expect(ANUL_NOW).toBe("Acum");
  });
});

describe("season from program year dates (2026/27 lock)", () => {
  test("Thursday of S1 Monday is 2026-09-03", () => {
    expect(thursdayOfMonday("2026-08-31")).toBe("2026-09-03");
  });

  test("meteorological months map to Romanian seasons", () => {
    expect(meteorologicalSeason("2026-09-03")).toBe("Toamnă");
    expect(meteorologicalSeason("2026-12-03")).toBe("Iarnă");
    expect(meteorologicalSeason("2027-03-04")).toBe("Primăvară");
    expect(meteorologicalSeason("2027-06-03")).toBe("Vară");
    expect(meteorologicalSeason("2027-08-26")).toBe("Vară");
  });

  test("S1–S52 seasons follow Thursday of each week", () => {
    const start = PROGRAM_YEAR_START_MONDAY_2026_27;
    expect(programWeekSeason(1, start)).toBe("Toamnă");
    expect(programWeekSeason(13, start)).toBe("Toamnă");
    expect(programWeekSeason(14, start)).toBe("Iarnă");
    expect(programWeekSeason(26, start)).toBe("Iarnă");
    expect(programWeekSeason(27, start)).toBe("Primăvară");
    expect(programWeekSeason(39, start)).toBe("Primăvară");
    expect(programWeekSeason(40, start)).toBe("Vară");
    expect(programWeekSeason(52, start)).toBe("Vară");
  });
});

describe("yearWeekPreviews", () => {
  test("lists S1–S52 with theme, season, and a single Acum week", () => {
    const rows = yearWeekPreviews({
      programYearStart: PROGRAM_YEAR_START_MONDAY_2026_27,
      currentWeek: 1,
    });
    expect(anulPreviewReady(rows)).toBe(true);
    expect(rows).toHaveLength(52);
    expect(rows[0]).toMatchObject({
      week: 1,
      theme: WEEK_THEMES[1],
      season: "Toamnă",
      start: "2026-08-31",
      end: "2026-09-06",
      current: true,
    });
    expect(rows[51]).toMatchObject({
      week: 52,
      theme: WEEK_THEMES[52],
      season: "Vară",
      start: "2027-08-23",
      end: "2027-08-29",
      current: false,
    });
    expect(rows.filter((row) => row.current)).toHaveLength(1);
  });

  test("optional themes override live 1–2 copy for another band", () => {
    const rows = yearWeekPreviews({
      programYearStart: PROGRAM_YEAR_START_MONDAY_2026_27,
      currentWeek: 1,
      themes: { 1: "Temă 2–3", 2: "Altă temă" },
    });
    expect(rows[0]?.theme).toBe("Temă 2–3");
    expect(rows[1]?.theme).toBe("Altă temă");
    expect(rows[2]?.theme).toBe("");
  });

  test("current week follows the selected S#, not a tap target", () => {
    const rows = yearWeekPreviews({
      programYearStart: PROGRAM_YEAR_START_MONDAY_2026_27,
      currentWeek: 21,
    });
    expect(rows.find((row) => row.current)?.week).toBe(21);
    expect(rows.find((row) => row.week === 1)?.current).toBe(false);
  });

  test("groups in program-year season order", () => {
    const groups = yearWeeksBySeason(
      yearWeekPreviews({
        programYearStart: PROGRAM_YEAR_START_MONDAY_2026_27,
        currentWeek: 1,
      }),
    );
    expect(groups.map((group) => group.season)).toEqual([
      "Toamnă",
      "Iarnă",
      "Primăvară",
      "Vară",
    ]);
    expect(groups[0]?.weeks.map((row) => row.week)).toEqual(
      Array.from({ length: 13 }, (_, i) => i + 1),
    );
    expect(groups[3]?.weeks.at(-1)?.week).toBe(52);
  });
});

describe("anulWeekOpen", () => {
  test("live Anul only opens the current S#; preview opens any", () => {
    expect(anulWeekOpen(false, true)).toBe(true);
    expect(anulWeekOpen(false, false)).toBe(false);
    expect(anulWeekOpen(true, false)).toBe(true);
    expect(anulWeekOpen(true, true)).toBe(true);
  });
});

describe("V1.4.1 empty preview band still lists S#", () => {
  test("does not hide the Anul theme list when the preview catalog is empty", () => {
    expect(anulHidesPreviewThemeList(true, false)).toBe(false);
    expect(anulHidesPreviewThemeList(true, true)).toBe(false);
    expect(anulHidesPreviewThemeList(false, false)).toBe(false);
  });

  test("empty preview themes still yield 52 clickable weeks", () => {
    const rows = yearWeekPreviews({
      programYearStart: PROGRAM_YEAR_START_MONDAY_2026_27,
      currentWeek: 12,
      themes: {},
    });
    expect(anulPreviewReady(rows)).toBe(true);
    expect(rows).toHaveLength(52);
    expect(rows[11]?.current).toBe(true);
    expect(rows[11]?.theme).toBe("");
    expect(rows.every((row) => anulWeekOpen(true, row.current))).toBe(true);
  });
});

describe("resolveAnulYearStart", () => {
  test("prefers the family column, else the 2026/27 lock", () => {
    expect(
      resolveAnulYearStart({ program_year_start: "2025-09-01" }),
    ).toBe("2025-09-01");
    expect(resolveAnulYearStart(null)).toBe(PROGRAM_YEAR_START_MONDAY_2026_27);
  });
});
