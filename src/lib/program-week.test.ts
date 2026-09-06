import { describe, expect, test } from "vitest";
import {
  PROGRAM_YEAR_2026_27,
  PROGRAM_YEAR_START_MONDAY_2026_27,
} from "@/lib/fixtures/program-year-2026-27";
import {
  bucharestToday,
  civilDayOfWeek,
  familyJoinFields,
  familyProgramWeek,
  familyProgramYearStart,
  formatCivilDate,
  mondayOf,
  programWeekNumber,
  programWeekRange,
  programWeekTable,
  programYearStartMonday,
  resolveProgramYearStartMonday,
} from "./program-week";

const START_2026_27 = PROGRAM_YEAR_START_MONDAY_2026_27;

describe("Cristina lock 2026/27", () => {
  test("program_year_start_monday is 2026-08-31", () => {
    expect(START_2026_27).toBe("2026-08-31");
    expect(formatCivilDate(programYearStartMonday(2026))).toBe(START_2026_27);
    expect(formatCivilDate(mondayOf(PROGRAM_YEAR_2026_27.sept1))).toBe(START_2026_27);
    expect(formatCivilDate(resolveProgramYearStartMonday("2026-09-01"))).toBe(
      START_2026_27,
    );
  });
});

describe("programYearStartMonday (generic years)", () => {
  test("Sept 1 on Monday is S1 Monday", () => {
    expect(formatCivilDate(programYearStartMonday(2025))).toBe("2025-09-01");
  });

  test("Sept 1 mid-week uses the Monday of that ISO week", () => {
    expect(formatCivilDate(programYearStartMonday(2026))).toBe("2026-08-31");
    expect(formatCivilDate(programYearStartMonday(2024))).toBe("2024-08-26");
    expect(formatCivilDate(programYearStartMonday(2023))).toBe("2023-08-28");
  });
});

describe("mondayOf (Europe/Bucharest)", () => {
  test("date-only strings stay on that civil week", () => {
    expect(formatCivilDate(mondayOf("2026-08-31"))).toBe("2026-08-31");
    expect(formatCivilDate(mondayOf("2026-09-01"))).toBe("2026-08-31");
    expect(formatCivilDate(mondayOf("2026-09-06"))).toBe("2026-08-31");
    expect(formatCivilDate(mondayOf("2026-09-07"))).toBe("2026-09-07");
  });

  test("uses Bucharest civil date, not UTC, at the 2026/27 lock", () => {
    // Sunday 30 Aug 2026 23:30 EEST = 20:30 UTC → still previous week
    expect(formatCivilDate(mondayOf(new Date("2026-08-30T20:30:00.000Z")))).toBe(
      "2026-08-24",
    );
    // Monday 31 Aug 2026 00:30 EEST = 21:30 UTC 30 Aug → lock Monday
    expect(formatCivilDate(mondayOf(new Date("2026-08-30T21:30:00.000Z")))).toBe(
      "2026-08-31",
    );
  });
});

describe("programWeekNumber — 2026/27 week boundaries", () => {
  test("S1 is Mon–Sun of the week containing 1 Sept 2026", () => {
    expect(programWeekNumber(PROGRAM_YEAR_2026_27.s1.start, START_2026_27)).toBe(1);
    expect(programWeekNumber(PROGRAM_YEAR_2026_27.sept1, START_2026_27)).toBe(1);
    expect(programWeekNumber(PROGRAM_YEAR_2026_27.s1.end, START_2026_27)).toBe(1);
  });

  test("next Monday is S2", () => {
    expect(programWeekNumber(PROGRAM_YEAR_2026_27.s2.start, START_2026_27)).toBe(2);
    expect(programWeekNumber(PROGRAM_YEAR_2026_27.s2.end, START_2026_27)).toBe(2);
  });

  test("S21 and S52 land on the fixture ranges", () => {
    expect(programWeekNumber(PROGRAM_YEAR_2026_27.s21.start, START_2026_27)).toBe(21);
    expect(programWeekNumber(PROGRAM_YEAR_2026_27.s21.end, START_2026_27)).toBe(21);
    expect(programWeekNumber(PROGRAM_YEAR_2026_27.s52.start, START_2026_27)).toBe(52);
    expect(programWeekNumber(PROGRAM_YEAR_2026_27.s52.end, START_2026_27)).toBe(52);
  });

  test("omitting start resolves the 2026/27 lock from the date", () => {
    expect(programWeekNumber("2026-09-06")).toBe(1);
    expect(programWeekNumber("2026-09-07")).toBe(2);
    expect(programWeekNumber("2027-01-18")).toBe(21);
  });
});

describe("programWeekNumber — clamp", () => {
  test("dates before the given 2026/27 start clamp to S1", () => {
    expect(programWeekNumber("2026-08-24", START_2026_27)).toBe(1);
    expect(programWeekNumber("2025-12-01", START_2026_27)).toBe(1);
  });
});

describe("programWeekNumber — rollover past 52", () => {
  test("the Monday after S52 is S1 of 2027/28 (never S53)", () => {
    expect(programWeekNumber(PROGRAM_YEAR_2026_27.nextStartMonday, START_2026_27)).toBe(
      1,
    );
    expect(programWeekNumber("2027-09-01", START_2026_27)).toBe(1);
    expect(formatCivilDate(resolveProgramYearStartMonday("2027-08-30"))).toBe(
      PROGRAM_YEAR_2026_27.nextStartMonday,
    );
  });

  test("gap week after a 53-week span rolls to the new start (never S53)", () => {
    // 2024 start = 2024-08-26; 52 weeks later ends 2025-08-24
    expect(programWeekNumber("2025-08-24", "2024-08-26")).toBe(52);
    expect(programWeekNumber("2025-08-25", "2024-08-26")).toBe(1);
    expect(programWeekNumber("2025-08-31")).toBe(1);
    expect(formatCivilDate(resolveProgramYearStartMonday("2025-08-25"))).toBe(
      "2025-09-01",
    );
  });

  test("mid-year 2026/27 stays on the lock, not 2025-09-01", () => {
    expect(formatCivilDate(resolveProgramYearStartMonday("2027-03-15"))).toBe(
      START_2026_27,
    );
    expect(programWeekNumber("2027-03-15")).toBe(29);
  });
});

describe("programWeekTable — 2026/27 fixture", () => {
  test("lists S1–S52 Mon–Sun ranges from the lock", () => {
    const table = programWeekTable(START_2026_27);
    expect(table).toHaveLength(52);
    expect(table[0]).toEqual({ week: 1, ...PROGRAM_YEAR_2026_27.s1 });
    expect(table[1]).toEqual({ week: 2, ...PROGRAM_YEAR_2026_27.s2 });
    expect(table[20]).toEqual({ week: 21, ...PROGRAM_YEAR_2026_27.s21 });
    expect(table[51]).toEqual({ week: 52, ...PROGRAM_YEAR_2026_27.s52 });
    expect(programWeekRange(1, START_2026_27)).toEqual({
      week: 1,
      ...PROGRAM_YEAR_2026_27.s1,
    });
  });
});

describe("civilDayOfWeek (Europe/Bucharest)", () => {
  test("date-only strings use Monday=1 … Sunday=7", () => {
    expect(civilDayOfWeek("2026-08-31")).toBe(1);
    expect(civilDayOfWeek("2026-09-01")).toBe(2);
    expect(civilDayOfWeek("2026-09-06")).toBe(7);
    expect(civilDayOfWeek("2026-09-07")).toBe(1);
  });

  test("uses Bucharest civil date at the UTC Sunday/Monday edge", () => {
    expect(civilDayOfWeek(new Date("2026-09-06T20:30:00.000Z"))).toBe(7);
    expect(civilDayOfWeek(new Date("2026-09-06T21:30:00.000Z"))).toBe(1);
    expect(bucharestToday(new Date("2026-09-06T21:30:00.000Z"))).toBe("2026-09-07");
  });
});

describe("familyProgramWeek", () => {
  test("maps a family on the 2026/27 lock to S1 / S2", () => {
    const family = { program_year_start: START_2026_27 };
    expect(familyProgramWeek(family, "2026-09-06")).toBe(1);
    expect(familyProgramWeek(family, "2026-09-07")).toBe(2);
  });
});

describe("family.joined_at helpers", () => {
  test("a join in 2026/27 stores the locked start Monday", () => {
    const fields = familyJoinFields("2026-09-06");
    expect(fields.joined_at).toBe("2026-09-06T00:00:00.000Z");
    expect(fields.program_year_start).toBe(START_2026_27);
  });

  test("familyProgramYearStart prefers the stored column, else derives from joined_at", () => {
    expect(
      familyProgramYearStart({
        program_year_start: "2025-09-01",
        joined_at: "2026-09-06T00:00:00.000Z",
      }),
    ).toBe("2025-09-01");
    expect(
      familyProgramYearStart({
        program_year_start: null,
        joined_at: "2026-09-06T10:00:00.000Z",
      }),
    ).toBe(START_2026_27);
    expect(
      familyProgramYearStart({
        created_at: "2027-01-10T08:00:00.000Z",
      }),
    ).toBe(START_2026_27);
  });
});
