import { describe, expect, test } from "vitest";
import { PROGRAM_YEAR_START_MONDAY_2026_27 } from "@/lib/fixtures/program-year-2026-27";
import {
  activityProgramCivilDate,
  completedAtForCivilDate,
  completionCivilDate,
  restampDatesForToggle,
} from "./completion-date";
import { programDayCivilDate, toDateOnlyString } from "./program-week";

const START = PROGRAM_YEAR_START_MONDAY_2026_27;

describe("programDayCivilDate", () => {
  test("S2 Luni–Duminică are 7–13 Sep 2026", () => {
    expect(programDayCivilDate(2, 1, START)).toBe("2026-09-07");
    expect(programDayCivilDate(2, 2, START)).toBe("2026-09-08");
    expect(programDayCivilDate(2, 7, START)).toBe("2026-09-13");
  });

  test("S1 Luni is the lock Monday", () => {
    expect(programDayCivilDate(1, 1, START)).toBe("2026-08-31");
    expect(programDayCivilDate(1, 7, START)).toBe("2026-09-06");
  });
});

describe("completionCivilDate — program day wins over click instant", () => {
  test("a Luni activity ticked on Sunday stays on Luni", () => {
    expect(
      completionCivilDate({
        completedAt: "2026-09-13T14:22:00.000Z",
        programYearStart: START,
        activity: { week_number: 2, day_of_week: 1 },
      }),
    ).toBe("2026-09-07");
  });

  test("seed fields saptamana/zi also map", () => {
    expect(
      activityProgramCivilDate({ saptamana: 2, zi: 6 }, START),
    ).toBe("2026-09-12");
  });

  test("without week/day, completed_at civil date is the fallback", () => {
    expect(
      completionCivilDate({
        completedAt: "2026-09-13T07:00:00.000Z",
        programYearStart: START,
        activity: {},
      }),
    ).toBe("2026-09-13");
    expect(toDateOnlyString("2026-09-13T07:00:00.000Z")).toBe("2026-09-13");
  });
});

describe("completedAtForCivilDate", () => {
  test("same Bucharest day keeps the click instant", () => {
    const now = new Date("2026-09-13T12:34:56.000Z");
    expect(completedAtForCivilDate("2026-09-13", now)).toBe(now.toISOString());
  });

  test("another weekday is midday UTC on that civil date", () => {
    const now = new Date("2026-09-13T12:34:56.000Z");
    expect(completedAtForCivilDate("2026-09-07", now)).toBe("2026-09-07T10:00:00.000Z");
    expect(toDateOnlyString("2026-09-07T10:00:00.000Z")).toBe("2026-09-07");
  });
});

describe("restampDatesForToggle", () => {
  test("uncomplete restamps the program day and the old click day", () => {
    expect(
      restampDatesForToggle({
        programCivilDate: "2026-09-07",
        previousCompletedAt: "2026-09-13T12:00:00.000Z",
      }),
    ).toEqual(["2026-09-07", "2026-09-13"]);
  });

  test("complete only restamps the program day", () => {
    expect(restampDatesForToggle({ programCivilDate: "2026-09-08" })).toEqual([
      "2026-09-08",
    ]);
  });
});
