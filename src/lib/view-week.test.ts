import { describe, expect, test } from "vitest";
import { PROGRAM_YEAR_START_MONDAY_2026_27 } from "./fixtures/program-year-2026-27";
import { closedWeekContext, familyWantsMondayDigest } from "./monday-digest";
import { familyProgramWeek } from "./program-week";
import { clampProgramWeek } from "./week";
import {
  VIEW_WEEK_BACK,
  VIEW_WEEK_FUTURE_HINT,
  VIEW_WEEK_LABEL,
  VIEW_WEEK_NEXT,
  VIEW_WEEK_PAST_HINT,
  VIEW_WEEK_PREV,
  VIEW_WEEK_READ_ONLY,
  applySessionViewWeek,
  clearSessionViewWeek,
  officialProgramWeekForDigests,
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

  test("non-live preview band stays read-only even for past S#", () => {
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
        viewWeek: 4,
        officialWeek: 4,
        viewBand: "2-3",
        liveBand: "1-2",
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
