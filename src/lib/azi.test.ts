import { describe, expect, test } from "vitest";
import {
  AZI_ALL_DONE,
  AZI_ALL_DONE_RECAP,
  AZI_BEFORE_JOIN,
  AZI_SUBTITLE,
  AZI_SUBTITLE_RECAP,
  aziAllDone,
  aziAllDoneMessage,
  aziDayOfWeek,
  aziFutureLocked,
  aziGate,
  aziSubtitle,
  aziTitle,
  isRecapDay,
} from "./azi";
import {
  bucharestToday,
  civilDayOfWeek,
  familyProgramWeek,
  programWeekNumber,
} from "./program-week";
import { PROGRAM_YEAR_START_MONDAY_2026_27 } from "./fixtures/program-year-2026-27";

describe("Azi copy (Cristina)", () => {
  test("title is Azi · week theme", () => {
    expect(aziTitle("Casa și curtea")).toBe("Azi · Casa și curtea");
    expect(aziTitle("Casa și curtea", 1)).toBe("Azi · Casa și curtea");
    expect(aziTitle("  ")).toBe("Azi");
  });

  test("Sunday title is Azi · recap · theme", () => {
    expect(aziTitle("Casa și curtea", 7)).toBe("Azi · recap · Casa și curtea");
    expect(aziTitle("  ", 7)).toBe("Azi · recap");
    expect(isRecapDay(7)).toBe(true);
    expect(isRecapDay(6)).toBe(false);
  });

  test("locks the published strings", () => {
    expect(AZI_SUBTITLE).toBe("Patru lucruri scurte — când vreți.");
    expect(AZI_SUBTITLE_RECAP).toBe(
      "Patru lucruri blânde — ce ați făcut săptămâna asta, fără grabă.",
    );
    expect(AZI_BEFORE_JOIN).toBe("Astăzi începe de aici.");
    expect(AZI_ALL_DONE).toBe("Gata pe azi. Mâine continuăm.");
    expect(AZI_ALL_DONE_RECAP).toBe("Recap gata. Luni începem iar.");
    expect(aziFutureLocked(5)).toBe("Se deschide Vineri.");
    expect(aziFutureLocked(1)).toBe("Se deschide Luni.");
    expect(aziSubtitle(3)).toBe(AZI_SUBTITLE);
    expect(aziSubtitle(7)).toBe(AZI_SUBTITLE_RECAP);
    expect(aziAllDoneMessage(2)).toBe(AZI_ALL_DONE);
    expect(aziAllDoneMessage(7)).toBe(AZI_ALL_DONE_RECAP);
  });
});

describe("aziGate — mid-week joined_at", () => {
  const joinedWednesday = "2026-09-02";

  test("days before joined_at in the same week are empty", () => {
    expect(
      aziGate({ viewDate: "2026-08-31", today: "2026-08-31", joinedAt: joinedWednesday }),
    ).toBe("before_join");
    expect(
      aziGate({ viewDate: "2026-09-01", today: "2026-09-01", joinedAt: joinedWednesday }),
    ).toBe("before_join");
  });

  test("join day and later days in the week are open", () => {
    expect(
      aziGate({ viewDate: joinedWednesday, today: joinedWednesday, joinedAt: joinedWednesday }),
    ).toBe("open");
    expect(
      aziGate({ viewDate: "2026-09-06", today: "2026-09-06", joinedAt: joinedWednesday }),
    ).toBe("open");
  });

  test("a future weekday is locked", () => {
    expect(
      aziGate({ viewDate: "2026-09-04", today: joinedWednesday, joinedAt: joinedWednesday }),
    ).toBe("locked");
  });

  test("missing joined_at does not block today", () => {
    expect(aziGate({ viewDate: "2026-09-06", today: "2026-09-06" })).toBe("open");
  });
});

describe("aziAllDone", () => {
  test("needs at least one activity, all completed", () => {
    expect(aziAllDone(0, 0)).toBe(false);
    expect(aziAllDone(4, 3)).toBe(false);
    expect(aziAllDone(4, 4)).toBe(true);
  });
});

describe("Azi maps today via R1 (Bucharest)", () => {
  test("Sunday 2026-09-06 is S1 day 7", () => {
    expect(programWeekNumber("2026-09-06", PROGRAM_YEAR_START_MONDAY_2026_27)).toBe(1);
    expect(aziDayOfWeek("2026-09-06")).toBe(7);
    expect(civilDayOfWeek("2026-09-06")).toBe(7);
  });

  test("Monday 2026-09-07 is S2 day 1", () => {
    expect(programWeekNumber("2026-09-07")).toBe(2);
    expect(aziDayOfWeek("2026-09-07")).toBe(1);
  });

  test("familyProgramWeek uses stored program_year_start", () => {
    expect(
      familyProgramWeek(
        { program_year_start: PROGRAM_YEAR_START_MONDAY_2026_27 },
        "2026-09-06",
      ),
    ).toBe(1);
    expect(
      familyProgramWeek(
        { program_year_start: PROGRAM_YEAR_START_MONDAY_2026_27 },
        "2026-09-07",
      ),
    ).toBe(2);
  });

  test("instant at UTC Sunday still uses Bucharest civil day", () => {
    // 2026-09-06 21:30 UTC = 2026-09-07 00:30 EEST → Monday S2
    expect(civilDayOfWeek(new Date("2026-09-06T21:30:00.000Z"))).toBe(1);
    expect(programWeekNumber(new Date("2026-09-06T21:30:00.000Z"))).toBe(2);
    // 2026-09-06 20:30 UTC = 2026-09-06 23:30 EEST → Sunday S1
    expect(civilDayOfWeek(new Date("2026-09-06T20:30:00.000Z"))).toBe(7);
    expect(programWeekNumber(new Date("2026-09-06T20:30:00.000Z"))).toBe(1);
  });

  test("bucharestToday follows the instant's Bucharest date", () => {
    expect(bucharestToday(new Date("2026-09-06T20:30:00.000Z"))).toBe("2026-09-06");
    expect(bucharestToday(new Date("2026-09-06T21:30:00.000Z"))).toBe("2026-09-07");
  });
});
