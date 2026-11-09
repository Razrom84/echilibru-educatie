import { describe, expect, test } from "vitest";
import { PROGRAM_YEAR_START_MONDAY_2026_27 } from "./fixtures/program-year-2026-27";
import { closedWeekContext, familyWantsMondayDigest } from "./monday-digest";
import {
  bucharestToday,
  familyProgramWeek,
  programDayCivilDate,
} from "./program-week";
import { clampProgramWeek } from "./week";
import {
  VIEW_DAY_FUTURE_HINT,
  VIEW_WEEK_BACK,
  VIEW_WEEK_FUTURE_HINT,
  VIEW_WEEK_LABEL,
  VIEW_WEEK_NEXT,
  VIEW_WEEK_PAST_HINT,
  VIEW_WEEK_PREV,
  VIEW_WEEK_READ_ONLY,
  applySessionViewWeek,
  clearSessionViewWeek,
  dayWritesAllowed,
  futureDayHint,
  isCivilDayAfterToday,
  isWritableCohortBand,
  officialProgramWeekForDigests,
  previousBand,
  resolveViewWeek,
  showsLiveWeekNav,
  viewWeekBrowsingStatus,
  viewWeekControlLabel,
  viewWeekModeHint,
  weekRelation,
  weekWritesAllowed,
  trimsJoinDays,
} from "./view-week";

const FAMILY = {
  program_year_start: PROGRAM_YEAR_START_MONDAY_2026_27,
  joined_at: "2026-08-31T07:00:00.000Z",
};

describe("V1.5 session view week", () => {
  test("locks control copy", () => {
    expect(VIEW_WEEK_LABEL).toBe("Săptămâna");
    expect(VIEW_WEEK_PREV).toBe("Săptămâna anterioară");
    expect(VIEW_WEEK_NEXT).toBe("Săptămâna următoare");
    expect(VIEW_WEEK_BACK).toBe("Înapoi la săptămâna de azi");
    expect(VIEW_WEEK_READ_ONLY).toBe("doar citire");
    expect(VIEW_WEEK_FUTURE_HINT).toBe("Săptămână viitoare — doar citire.");
    expect(VIEW_WEEK_PAST_HINT).toBe(
      "Săptămână trecută — poți bifa, nota și poza.",
    );
    expect(VIEW_DAY_FUTURE_HINT).toBe("Ziua încă n-a venit — doar citire.");
    expect(viewWeekControlLabel(3)).toBe("Săptămâna 3");
    expect(viewWeekControlLabel(4)).toBe("Săptămâna 4");
    expect(viewWeekControlLabel(14)).toBe("Săptămâna 14");
    expect(showsLiveWeekNav()).toBe(true);
  });

  test("navigating S# does not mutate the official week", () => {
    const officialWeek = 4;
    const { session, officialWeek: unchanged } = applySessionViewWeek(
      12,
      officialWeek,
    );
    expect(session.sessionWeek).toBe(12);
    expect(unchanged).toBe(4);
    expect(officialWeek).toBe(4);
    expect(resolveViewWeek(officialWeek, session.sessionWeek)).toBe(12);
    expect(resolveViewWeek(officialWeek, null)).toBe(4);
    expect(resolveViewWeek(officialWeek, undefined)).toBe(4);
  });

  test("session week works on live, not only in band preview", () => {
    const officialWeek = 4;
    expect(resolveViewWeek(officialWeek, 1)).toBe(1);
    expect(resolveViewWeek(officialWeek, 4)).toBe(4);
    expect(resolveViewWeek(officialWeek, 52)).toBe(52);
    expect(resolveViewWeek(officialWeek, 99)).toBe(52);
    expect(clampProgramWeek(0)).toBe(1);
  });

  test("clearing the session returns the official week", () => {
    const officialWeek = 4;
    const browsing = applySessionViewWeek(2, officialWeek).session;
    const cleared = clearSessionViewWeek(browsing);
    expect(cleared.sessionWeek).toBeNull();
    expect(resolveViewWeek(officialWeek, cleared.sessionWeek)).toBe(4);
    expect(browsing.sessionWeek).toBe(2);
  });

  test("browsing copy names the temporary view and the official week", () => {
    expect(viewWeekBrowsingStatus(2, 4)).toBe(
      "Privești S2. Săptămâna oficială rămâne S4.",
    );
    expect(viewWeekBrowsingStatus(12, 4)).toBe(
      "Privești S12. Săptămâna oficială rămâne S4.",
    );
    expect(viewWeekBrowsingStatus(4, 4)).toBeNull();
    expect(viewWeekModeHint(2, 4)).toBe(VIEW_WEEK_PAST_HINT);
    expect(viewWeekModeHint(12, 4)).toBe(VIEW_WEEK_FUTURE_HINT);
    expect(viewWeekModeHint(4, 4)).toBeNull();
    expect(viewWeekModeHint(52, 4, true)).toBeNull();
    expect(viewWeekModeHint(2, 4, false)).toBeNull();
    expect(viewWeekModeHint(12, 4, false)).toBe(VIEW_WEEK_FUTURE_HINT);
  });
});

describe("V1.5 past editable / future read-only", () => {
  test("S# relative to the official week", () => {
    expect(weekRelation(3, 4)).toBe("past");
    expect(weekRelation(4, 4)).toBe("current");
    expect(weekRelation(5, 4)).toBe("future");
  });

  test("live band: past and current are writable; future is read-only", () => {
    expect(
      weekWritesAllowed({
        viewWeek: 2,
        officialWeek: 4,
        viewBand: "1-2",
        liveBand: "1-2",
      }),
    ).toBe(true);
    expect(
      weekWritesAllowed({
        viewWeek: 4,
        officialWeek: 4,
        viewBand: "1-2",
        liveBand: "1-2",
      }),
    ).toBe(true);
    expect(
      weekWritesAllowed({
        viewWeek: 12,
        officialWeek: 4,
        viewBand: "1-2",
        liveBand: "1-2",
      }),
    ).toBe(false);
  });

  test("live 2-3: write on 2-3 and previous 1-2 for past/current; future S# is RO on both", () => {
    expect(previousBand("1-2")).toBeNull();
    expect(previousBand("2-3")).toBe("1-2");
    expect(previousBand("3-4")).toBe("2-3");
    expect(isWritableCohortBand("1-2", "2-3")).toBe(true);
    expect(isWritableCohortBand("2-3", "2-3")).toBe(true);
    expect(isWritableCohortBand("3-4", "2-3")).toBe(false);
    expect(isWritableCohortBand("1-2", "3-4")).toBe(false);
    expect(
      weekWritesAllowed({
        viewWeek: 2,
        officialWeek: 4,
        viewBand: "2-3",
        liveBand: "2-3",
      }),
    ).toBe(true);
    expect(
      weekWritesAllowed({
        viewWeek: 4,
        officialWeek: 4,
        viewBand: "2-3",
        liveBand: "2-3",
      }),
    ).toBe(true);
    expect(
      weekWritesAllowed({
        viewWeek: 2,
        officialWeek: 4,
        viewBand: "1-2",
        liveBand: "2-3",
      }),
    ).toBe(true);
    expect(
      weekWritesAllowed({
        viewWeek: 4,
        officialWeek: 4,
        viewBand: "1-2",
        liveBand: "2-3",
      }),
    ).toBe(true);
    expect(
      weekWritesAllowed({
        viewWeek: 52,
        officialWeek: 4,
        viewBand: "2-3",
        liveBand: "2-3",
      }),
    ).toBe(false);
    expect(
      weekWritesAllowed({
        viewWeek: 52,
        officialWeek: 4,
        viewBand: "1-2",
        liveBand: "2-3",
      }),
    ).toBe(false);
  });

  test("older than previous and newer than live stay read-only", () => {
    expect(
      weekWritesAllowed({
        viewWeek: 2,
        officialWeek: 4,
        viewBand: "2-3",
        liveBand: "1-2",
      }),
    ).toBe(false);
    expect(
      weekWritesAllowed({
        viewWeek: 2,
        officialWeek: 4,
        viewBand: "1-2",
        liveBand: "3-4",
      }),
    ).toBe(false);
    expect(
      weekWritesAllowed({
        viewWeek: 4,
        officialWeek: 4,
        viewBand: "3-4",
        liveBand: "2-3",
      }),
    ).toBe(false);
    expect(
      weekWritesAllowed({
        viewWeek: 12,
        officialWeek: 4,
        viewBand: "6-7",
        liveBand: "1-2",
      }),
    ).toBe(false);
  });

  test("previewing the live band keeps the same past/current/future lock", () => {
    expect(
      weekWritesAllowed({
        viewWeek: 1,
        officialWeek: 4,
        viewBand: "1-2",
        liveBand: "1-2",
      }),
    ).toBe(true);
    expect(
      weekWritesAllowed({
        viewWeek: 52,
        officialWeek: 4,
        viewBand: "1-2",
        liveBand: "1-2",
      }),
    ).toBe(false);
  });

  test("current week: today and yesterday stay writable, tomorrow does not", () => {
    const yearStart = PROGRAM_YEAR_START_MONDAY_2026_27;
    const monday = "2026-11-09";
    expect(programDayCivilDate(11, 1, yearStart)).toBe(monday);
    expect(programDayCivilDate(11, 2, yearStart)).toBe("2026-11-10");
    expect(programDayCivilDate(10, 7, yearStart)).toBe("2026-11-08");
    expect(familyProgramWeek({ program_year_start: yearStart }, monday)).toBe(11);

    const current = weekWritesAllowed({
      viewWeek: 11,
      officialWeek: 11,
      viewBand: "1-2",
      liveBand: "1-2",
    });
    expect(current).toBe(true);
    expect(
      dayWritesAllowed({
        civilDate: programDayCivilDate(11, 1, yearStart),
        today: monday,
        weekWritable: current,
      }),
    ).toBe(true);
    expect(
      dayWritesAllowed({
        civilDate: programDayCivilDate(11, 2, yearStart),
        today: monday,
        weekWritable: current,
      }),
    ).toBe(false);
    expect(
      futureDayHint({
        civilDate: "2026-11-10",
        today: monday,
        weekWritable: current,
      }),
    ).toBe(VIEW_DAY_FUTURE_HINT);
    expect(
      futureDayHint({
        civilDate: monday,
        today: monday,
        weekWritable: current,
      }),
    ).toBeNull();

    const previousWeek = weekWritesAllowed({
      viewWeek: 10,
      officialWeek: 11,
      viewBand: "1-2",
      liveBand: "1-2",
    });
    expect(
      dayWritesAllowed({
        civilDate: "2026-11-08",
        today: monday,
        weekWritable: previousWeek,
      }),
    ).toBe(true);
    expect(isCivilDayAfterToday("2026-11-08", monday)).toBe(false);
    expect(isCivilDayAfterToday("2026-11-10", monday)).toBe(true);
  });

  test("Wednesday splits the live week: Mon–Wed open, Thu–Sun closed", () => {
    const wednesday = "2026-11-11";
    const current = weekWritesAllowed({
      viewWeek: 11,
      officialWeek: 11,
      viewBand: "2-3",
      liveBand: "2-3",
    });
    for (const day of [1, 2, 3] as const) {
      expect(
        dayWritesAllowed({
          civilDate: programDayCivilDate(11, day, PROGRAM_YEAR_START_MONDAY_2026_27),
          today: wednesday,
          weekWritable: current,
        }),
      ).toBe(true);
    }
    for (const day of [4, 5, 6, 7] as const) {
      const civilDate = programDayCivilDate(
        11,
        day,
        PROGRAM_YEAR_START_MONDAY_2026_27,
      );
      expect(
        dayWritesAllowed({ civilDate, today: wednesday, weekWritable: current }),
      ).toBe(false);
      expect(
        futureDayHint({ civilDate, today: wednesday, weekWritable: current }),
      ).toBe(VIEW_DAY_FUTURE_HINT);
    }
  });

  test("previous band keeps today writable and a later weekday read-only", () => {
    const monday = "2026-11-09";
    const weekWritable = weekWritesAllowed({
      viewWeek: 11,
      officialWeek: 11,
      viewBand: "1-2",
      liveBand: "2-3",
    });
    expect(weekWritable).toBe(true);
    expect(
      dayWritesAllowed({
        civilDate: "2026-11-09",
        today: monday,
        weekWritable,
      }),
    ).toBe(true);
    expect(
      dayWritesAllowed({
        civilDate: "2026-11-10",
        today: monday,
        weekWritable,
      }),
    ).toBe(false);
  });

  test("a future S# stays read-only and does not repeat the day hint", () => {
    const weekWritable = weekWritesAllowed({
      viewWeek: 12,
      officialWeek: 11,
      viewBand: "1-2",
      liveBand: "1-2",
    });
    expect(weekWritable).toBe(false);
    const mondayNext = programDayCivilDate(
      12,
      1,
      PROGRAM_YEAR_START_MONDAY_2026_27,
    );
    expect(mondayNext).toBe("2026-11-16");
    expect(
      dayWritesAllowed({
        civilDate: mondayNext,
        today: "2026-11-09",
        weekWritable,
      }),
    ).toBe(false);
    expect(
      futureDayHint({
        civilDate: mondayNext,
        today: "2026-11-09",
        weekWritable,
      }),
    ).toBeNull();
  });

  test("Bucharest midnight opens the new day and keeps yesterday writable", () => {
    const yearStart = PROGRAM_YEAR_START_MONDAY_2026_27;
    const weekWritable = true;
    // 9 Nov 2026 is EET (UTC+2): 21:59 UTC is still Monday, 22:00 UTC is Tuesday.
    const mondayNight = new Date("2026-11-09T21:59:00.000Z");
    const tuesdayMidnight = new Date("2026-11-09T22:00:00.000Z");
    expect(bucharestToday(mondayNight)).toBe("2026-11-09");
    expect(bucharestToday(tuesdayMidnight)).toBe("2026-11-10");

    const tuesday = programDayCivilDate(11, 2, yearStart);
    expect(
      dayWritesAllowed({
        civilDate: tuesday,
        today: bucharestToday(mondayNight),
        weekWritable,
      }),
    ).toBe(false);
    expect(
      dayWritesAllowed({
        civilDate: tuesday,
        today: bucharestToday(tuesdayMidnight),
        weekWritable,
      }),
    ).toBe(true);
    expect(
      dayWritesAllowed({
        civilDate: "2026-11-09",
        today: bucharestToday(tuesdayMidnight),
        weekWritable,
      }),
    ).toBe(true);

    // 2 Sep 2026 is EEST (UTC+3): 20:59 UTC is still Wednesday, 21:00 UTC is Thursday.
    const wednesdayNight = new Date("2026-09-02T20:59:00.000Z");
    const thursdayMidnight = new Date("2026-09-02T21:00:00.000Z");
    expect(bucharestToday(wednesdayNight)).toBe("2026-09-02");
    expect(bucharestToday(thursdayMidnight)).toBe("2026-09-03");
    expect(
      dayWritesAllowed({
        civilDate: "2026-09-03",
        today: bucharestToday(wednesdayNight),
        weekWritable,
      }),
    ).toBe(false);
    expect(
      dayWritesAllowed({
        civilDate: "2026-09-03",
        today: bucharestToday(thursdayMidnight),
        weekWritable,
      }),
    ).toBe(true);
    expect(
      dayWritesAllowed({
        civilDate: "2026-09-02",
        today: bucharestToday(thursdayMidnight),
        weekWritable,
      }),
    ).toBe(true);
  });

  test("join-day trim stays on the official current week only", () => {
    expect(trimsJoinDays("current", false)).toBe(true);
    expect(trimsJoinDays("past", false)).toBe(false);
    expect(trimsJoinDays("future", false)).toBe(false);
    expect(trimsJoinDays("current", true)).toBe(false);
  });
});

describe("V1.5 nav does not move the digest week", () => {
  test("familyProgramWeek follows the civil calendar, not session S#", () => {
    const now = "2026-09-24";
    const official = familyProgramWeek(FAMILY, now);
    expect(official).toBe(4);
    const { session, officialWeek } = applySessionViewWeek(12, official);
    expect(session.sessionWeek).toBe(12);
    expect(officialWeek).toBe(4);
    expect(officialProgramWeekForDigests(FAMILY, now, session.sessionWeek)).toBe(
      4,
    );
    expect(familyProgramWeek(FAMILY, now)).toBe(4);
  });

  test("closed digest week stays official_W − 1 after browsing S12", () => {
    const now = "2026-09-24";
    const { session } = applySessionViewWeek(12, familyProgramWeek(FAMILY, now));
    expect(session.sessionWeek).toBe(12);
    const closed = closedWeekContext(now, FAMILY);
    expect(closed.week).toBe(3);
    expect(closed.week).not.toBe(session.sessionWeek);
    expect(familyWantsMondayDigest({ monday_digest_email: true })).toBe(true);
  });
});
