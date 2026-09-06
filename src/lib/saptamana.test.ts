import { describe, expect, test } from "vitest";
import {
  PROGRAM_WEEK_DAYS,
  SAPTAMANA_TITLE,
  saptamanaSubtitle,
  visibleProgramWeekDays,
  weekDayCivilDate,
  weekDayName,
} from "./saptamana";
import { mondayOf, programWeekNumber } from "./program-week";
import { PROGRAM_YEAR_START_MONDAY_2026_27 } from "./fixtures/program-year-2026-27";

const S1_MONDAY = "2026-08-31";

describe("Săptămâna asta copy (Cristina)", () => {
  test("screen title is Săptămâna asta", () => {
    expect(SAPTAMANA_TITLE).toBe("Săptămâna asta");
  });

  test("optional subtitle is S# · theme", () => {
    expect(saptamanaSubtitle(1, "Casa și curtea")).toBe("S1 · Casa și curtea");
    expect(saptamanaSubtitle(2, "  ")).toBe("S2");
  });

  test("days are Luni…Duminică", () => {
    expect(PROGRAM_WEEK_DAYS.map(weekDayName)).toEqual([
      "Luni",
      "Marți",
      "Miercuri",
      "Joi",
      "Vineri",
      "Sâmbătă",
      "Duminică",
    ]);
  });
});

describe("weekDayCivilDate — Bucharest civil week", () => {
  test("S1 Mon–Sun lands on the 2026/27 lock", () => {
    expect(weekDayCivilDate(S1_MONDAY, 1)).toBe("2026-08-31");
    expect(weekDayCivilDate("2026-09-01", 1)).toBe("2026-08-31");
    expect(weekDayCivilDate(S1_MONDAY, 2)).toBe("2026-09-01");
    expect(weekDayCivilDate(S1_MONDAY, 7)).toBe("2026-09-06");
  });
});

describe("visibleProgramWeekDays — mid-week joined_at", () => {
  test("join Sunday → only Duminică", () => {
    expect(
      visibleProgramWeekDays({ weekMonday: S1_MONDAY, joinedAt: "2026-09-06" }),
    ).toEqual([7]);
  });

  test("join Wednesday → Miercuri…Duminică", () => {
    expect(
      visibleProgramWeekDays({ weekMonday: S1_MONDAY, joinedAt: "2026-09-02" }),
    ).toEqual([3, 4, 5, 6, 7]);
  });

  test("join Monday or earlier keeps the full week", () => {
    expect(
      visibleProgramWeekDays({ weekMonday: S1_MONDAY, joinedAt: "2026-08-31" }),
    ).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(
      visibleProgramWeekDays({ weekMonday: S1_MONDAY, joinedAt: "2026-08-30" }),
    ).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  test("missing joined_at does not trim", () => {
    expect(visibleProgramWeekDays({ weekMonday: S1_MONDAY })).toEqual([
      1, 2, 3, 4, 5, 6, 7,
    ]);
  });

  test("join timestamp uses Bucharest civil date", () => {
    // Sunday 6 Sep 2026 23:30 EEST = 20:30 UTC → still Sunday → only D
    expect(
      visibleProgramWeekDays({
        weekMonday: S1_MONDAY,
        joinedAt: new Date("2026-09-06T20:30:00.000Z"),
      }),
    ).toEqual([7]);
    // Monday 7 Sep 2026 00:30 EEST = 21:30 UTC 6 Sep → next week → none of S1
    expect(
      visibleProgramWeekDays({
        weekMonday: S1_MONDAY,
        joinedAt: new Date("2026-09-06T21:30:00.000Z"),
      }),
    ).toEqual([]);
  });
});

describe("Săptămâna asta maps the current week via R1", () => {
  test("Sunday 2026-09-06 is S1; monday helper is the lock Monday", () => {
    expect(programWeekNumber("2026-09-06", PROGRAM_YEAR_START_MONDAY_2026_27)).toBe(1);
    expect(weekDayCivilDate(mondayOf("2026-09-06"), 1)).toBe(S1_MONDAY);
    expect(weekDayCivilDate(mondayOf("2026-09-06"), 7)).toBe("2026-09-06");
  });
});
