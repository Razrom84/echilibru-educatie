import { describe, expect, test } from "vitest";
import {
  familyJoinFields,
  familyProgramYearStart,
  formatCivilDate,
  mondayOf,
  programWeekNumber,
  programWeekRange,
  programWeekTable,
  programYearStartMonday,
  resolveProgramYearStartMonday,
} from "./program-week";

describe("programYearStartMonday", () => {
  test("Sept 1 on Monday is S1 Monday", () => {
    expect(formatCivilDate(programYearStartMonday(2025))).toBe("2025-09-01");
  });

  test("Sept 1 mid-week uses the Monday of that ISO week", () => {
    // 2026-09-01 is Tuesday → week starts Monday 31 August
    expect(formatCivilDate(programYearStartMonday(2026))).toBe("2026-08-31");
    // 2024-09-01 is Sunday → week starts Monday 26 August
    expect(formatCivilDate(programYearStartMonday(2024))).toBe("2024-08-26");
    // 2023-09-01 is Friday → week starts Monday 28 August
    expect(formatCivilDate(programYearStartMonday(2023))).toBe("2023-08-28");
  });
});

describe("mondayOf (Europe/Bucharest)", () => {
  test("date-only strings stay on that civil week", () => {
    expect(formatCivilDate(mondayOf("2025-09-01"))).toBe("2025-09-01");
    expect(formatCivilDate(mondayOf("2025-09-07"))).toBe("2025-09-01");
    expect(formatCivilDate(mondayOf("2025-09-08"))).toBe("2025-09-08");
    expect(formatCivilDate(mondayOf("2026-09-01"))).toBe("2026-08-31");
  });

  test("uses Bucharest civil date, not UTC", () => {
    // Sunday 31 Aug 2025 23:30 EEST = 20:30 UTC → still Sunday in Bucharest
    expect(formatCivilDate(mondayOf(new Date("2025-08-31T20:30:00.000Z")))).toBe(
      "2025-08-25",
    );
    // Monday 1 Sept 2025 00:30 EEST = 21:30 UTC 31 Aug → Monday in Bucharest
    expect(formatCivilDate(mondayOf(new Date("2025-08-31T21:30:00.000Z")))).toBe(
      "2025-09-01",
    );
  });
});

describe("programWeekNumber — week boundaries", () => {
  const start2025 = programYearStartMonday(2025);

  test("S1 is Mon–Sun of the Sept 1 week", () => {
    expect(programWeekNumber("2025-09-01", start2025)).toBe(1);
    expect(programWeekNumber("2025-09-07", start2025)).toBe(1);
  });

  test("next Monday is S2", () => {
    expect(programWeekNumber("2025-09-08", start2025)).toBe(2);
  });

  test("S52 is the 52nd Mon–Sun week", () => {
    expect(programWeekNumber("2026-08-24", start2025)).toBe(52);
    expect(programWeekNumber("2026-08-30", start2025)).toBe(52);
  });

  test("mid-year dates land on the expected week", () => {
    // 20 weeks after 2025-09-01 = 2026-01-19 (Monday) → S21
    expect(programWeekNumber("2026-01-19", start2025)).toBe(21);
    expect(programWeekNumber("2026-01-25", start2025)).toBe(21);
  });
});

describe("programWeekNumber — clamp", () => {
  const start2025 = "2025-09-01";

  test("dates before the given start clamp to S1", () => {
    expect(programWeekNumber("2025-08-20", start2025)).toBe(1);
    expect(programWeekNumber("2024-12-01", start2025)).toBe(1);
  });
});

describe("programWeekNumber — rollover past 52", () => {
  test("the Monday after S52 is S1 of the next program year (never S53)", () => {
    // 2026-08-31 is programYearStartMonday(2026)
    expect(programWeekNumber("2026-08-31", "2025-09-01")).toBe(1);
    expect(programWeekNumber("2026-09-01", "2025-09-01")).toBe(1);
    expect(formatCivilDate(resolveProgramYearStartMonday("2026-08-31"))).toBe(
      "2026-08-31",
    );
  });

  test("gap week after a 53-week span rolls to the new start (never S53)", () => {
    // 2024 start = 2024-08-26; 52 weeks later ends 2025-08-24
    // 2025-08-25..31 would be S53; new start is 2025-09-01
    expect(programWeekNumber("2025-08-24", "2024-08-26")).toBe(52);
    expect(programWeekNumber("2025-08-25", "2024-08-26")).toBe(1);
    expect(programWeekNumber("2025-08-31")).toBe(1);
    expect(programWeekNumber("2025-09-01")).toBe(1);
    expect(formatCivilDate(resolveProgramYearStartMonday("2025-08-25"))).toBe(
      "2025-09-01",
    );
  });

  test("resolving start from a mid-year date keeps the current program year", () => {
    expect(formatCivilDate(resolveProgramYearStartMonday("2026-03-15"))).toBe(
      "2025-09-01",
    );
    expect(programWeekNumber("2026-03-15")).toBe(28);
    expect(programWeekNumber("2026-03-16")).toBe(29);
  });
});

describe("programWeekTable", () => {
  test("lists S1–S52 Mon–Sun ranges", () => {
    const table = programWeekTable("2025-09-01");
    expect(table).toHaveLength(52);
    expect(table[0]).toEqual({ week: 1, start: "2025-09-01", end: "2025-09-07" });
    expect(table[51]).toEqual({ week: 52, start: "2026-08-24", end: "2026-08-30" });
    expect(programWeekRange(2, "2025-09-01")).toEqual({
      week: 2,
      start: "2025-09-08",
      end: "2025-09-14",
    });
  });
});

describe("family.joined_at helpers", () => {
  test("familyJoinFields stores ISO joined_at and the resolved start Monday", () => {
    const fields = familyJoinFields("2025-10-08");
    expect(fields.joined_at).toBe("2025-10-08T00:00:00.000Z");
    expect(fields.program_year_start).toBe("2025-09-01");
  });

  test("familyProgramYearStart prefers the stored column, else derives from joined_at", () => {
    expect(
      familyProgramYearStart({
        program_year_start: "2024-08-26",
        joined_at: "2025-10-08T00:00:00.000Z",
      }),
    ).toBe("2024-08-26");
    expect(
      familyProgramYearStart({
        program_year_start: null,
        joined_at: "2025-10-08T10:00:00.000Z",
      }),
    ).toBe("2025-09-01");
    expect(
      familyProgramYearStart({
        created_at: "2026-01-10T08:00:00.000Z",
      }),
    ).toBe("2025-09-01");
  });
});
