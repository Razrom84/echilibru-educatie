import { describe, expect, test } from "vitest";
import { PROGRAM_YEAR_START_MONDAY_2026_27 } from "@/lib/fixtures/program-year-2026-27";
import { WEEK_THEMES } from "@/lib/week";
import {
  DIGEST_ANUL_URL,
  DIGEST_AZI_URL,
  DIGEST_CC_HELP,
  DIGEST_CC_INVALID,
  DIGEST_CC_LABEL,
  DIGEST_TEST_SKIPPED,
  DIGEST_TOGGLE_HELP,
  DIGEST_TOGGLE_LABEL,
  MONTHLY_INTRO,
  MONTHLY_NOTES_CAP,
  WEEKLY_INTRO,
  buildMonthlyDigest,
  buildWeeklyDigest,
  calendarMonthRange,
  capMonthlyNotes,
  closedWeekContext,
  countWeekProgress,
  digestCcAddress,
  digestSelection,
  familyWantsMondayDigest,
  formatRoMonthYear,
  isFirstMondayOfMonth,
  monthlyPeriodKey,
  monthlyProgressLine,
  monthlySubject,
  noteLine,
  parseOptionalEmail,
  previousCalendarMonth,
  progressLine,
  selectDigestKind,
  shouldSkipDigest,
  themeLine,
  visibleNotes,
  weeklyPeriodKey,
  weeklySubject,
  weeksOverlappingMonth,
} from "./monday-digest";

const FAMILY_2026_27 = {
  program_year_start: PROGRAM_YEAR_START_MONDAY_2026_27,
  joined_at: "2026-08-31T07:00:00.000Z",
};

describe("Cristina copy (V1.3)", () => {
  test("locks subjects, toggle, CTAs, and intros", () => {
    expect(weeklySubject("Casa și curtea")).toBe(
      "Săptămâna trecută · Casa și curtea — Echilibru educație",
    );
    expect(monthlySubject("august 2026")).toBe(
      "Luna trecută · august 2026 — Echilibru educație",
    );
    expect(DIGEST_TOGGLE_LABEL).toBe("Raport luni pe email");
    expect(DIGEST_TOGGLE_HELP).toBe(
      "Luni dimineața, un rezumat al săptămânii. Prima luni din lună: rezumatul lunii trecute.",
    );
    expect(WEEKLY_INTRO).toContain("Săptămâna trecută");
    expect(MONTHLY_INTRO).toContain("Luna trecută");
    expect(DIGEST_AZI_URL).toBe("https://educatie.echilibru-cartea.ro/azi");
    expect(DIGEST_ANUL_URL).toBe("https://educatie.echilibru-cartea.ro/anul");
    expect(DIGEST_CC_LABEL).toBe("Email al doilea părinte (opțional)");
    expect(DIGEST_CC_HELP).toBe(
      "Primește și el raportul de luni, în copie. Gol = fără copie.",
    );
    expect(DIGEST_CC_INVALID).toBe("Scrie un email valid, sau lasă gol.");
    expect(DIGEST_TEST_SKIPPED).toBe("Nimic de raportat săptămâna trecută");
  });

  test("copy stays Romanian", () => {
    const copy = [
      weeklySubject("Casa și curtea"),
      monthlySubject("august 2026"),
      DIGEST_TOGGLE_LABEL,
      DIGEST_CC_LABEL,
      DIGEST_CC_HELP,
      DIGEST_CC_INVALID,
      DIGEST_TEST_SKIPPED,
      WEEKLY_INTRO,
      MONTHLY_INTRO,
    ].join(" ");
    expect(copy).not.toMatch(/\b(Weekly|Monthly|Digest|Last week|optional)\b/);
  });
});

describe("second-parent email (CC)", () => {
  test("empty or whitespace is no CC", () => {
    expect(parseOptionalEmail("")).toEqual({ ok: true, email: null });
    expect(parseOptionalEmail("   ")).toEqual({ ok: true, email: null });
    expect(parseOptionalEmail(null)).toEqual({ ok: true, email: null });
    expect(digestCcAddress("", "ana@familie.ro")).toBeNull();
  });

  test("valid address is trimmed and lowercased", () => {
    expect(parseOptionalEmail("  Tata@Familie.RO ")).toEqual({
      ok: true,
      email: "tata@familie.ro",
    });
    expect(digestCcAddress("Tata@Familie.RO", "ana@familie.ro")).toBe(
      "tata@familie.ro",
    );
  });

  test("invalid format is rejected", () => {
    expect(parseOptionalEmail("nu-e-email")).toEqual({ ok: false });
    expect(parseOptionalEmail("a@b")).toEqual({ ok: false });
    expect(digestCcAddress("nu-e-email", "ana@familie.ro")).toBeNull();
  });

  test("same as primary To is not CC'd", () => {
    expect(digestCcAddress("Ana@Familie.RO", "ana@familie.ro")).toBeNull();
  });
});

describe("first Monday of month vs other Mondays", () => {
  test("7 Sep 2026 is the first Monday of September → monthly", () => {
    expect(isFirstMondayOfMonth("2026-09-07")).toBe(true);
    expect(selectDigestKind("2026-09-07")).toBe("monthly");
  });

  test("5 Oct 2026 is the first Monday of October → monthly", () => {
    expect(isFirstMondayOfMonth("2026-10-05")).toBe(true);
    expect(selectDigestKind("2026-10-05")).toBe("monthly");
  });

  test("1 Mar 2027 is a Monday and the 1st → monthly", () => {
    expect(isFirstMondayOfMonth("2027-03-01")).toBe(true);
    expect(selectDigestKind("2027-03-01")).toBe("monthly");
  });

  test("other Mondays stay weekly (including S1 start)", () => {
    expect(isFirstMondayOfMonth("2026-08-31")).toBe(false);
    expect(selectDigestKind("2026-08-31")).toBe("weekly");
    expect(selectDigestKind("2026-09-14")).toBe("weekly");
    expect(selectDigestKind("2026-10-12")).toBe("weekly");
  });

  test("non-Mondays are not first-Monday, so kind is weekly if forced by date", () => {
    expect(isFirstMondayOfMonth("2026-09-01")).toBe(false);
    expect(isFirstMondayOfMonth("2026-09-06")).toBe(false);
  });
});

describe("closed week = current_W − 1", () => {
  test("Monday 14 Sep 2026 (S3) closes S2", () => {
    const closed = closedWeekContext("2026-09-14", FAMILY_2026_27);
    expect(closed.week).toBe(2);
    expect(closed.programYearStart).toBe(PROGRAM_YEAR_START_MONDAY_2026_27);
    expect(closed.start).toBe("2026-09-07");
    expect(closed.end).toBe("2026-09-13");
    expect(closed.theme).toBe(WEEK_THEMES[2]);
  });

  test("Monday 21 Sep 2026 closes S3", () => {
    const closed = closedWeekContext("2026-09-21", FAMILY_2026_27);
    expect(closed.week).toBe(3);
    expect(closed.start).toBe("2026-09-14");
    expect(closed.end).toBe("2026-09-20");
  });

  test("S1 Monday 31 Aug 2026 closes S52 of the previous program year", () => {
    const closed = closedWeekContext("2026-08-31", FAMILY_2026_27);
    expect(closed.week).toBe(52);
    expect(closed.programYearStart).toBe("2025-09-01");
    expect(closed.start).toBe("2026-08-24");
    expect(closed.end).toBe("2026-08-30");
    expect(closed.theme).toBe(WEEK_THEMES[52]);
  });
});

describe("first Monday replaces weekly that week", () => {
  test("7 Sep 2026 is monthly for August, not weekly for S1", () => {
    const selected = digestSelection("2026-09-07", FAMILY_2026_27);
    expect(selected.kind).toBe("monthly");
    if (selected.kind !== "monthly") return;
    expect(selected.month.label).toBe("august 2026");
    expect(selected.month.start).toBe("2026-08-01");
    expect(selected.month.end).toBe("2026-08-31");
  });

  test("kind override still builds the other report for QA", () => {
    const weekly = digestSelection("2026-09-07", FAMILY_2026_27, "weekly");
    expect(weekly.kind).toBe("weekly");
    if (weekly.kind !== "weekly") return;
    expect(weekly.closed.week).toBe(1);
    expect(weekly.closed.start).toBe("2026-08-31");
    expect(weekly.closed.end).toBe("2026-09-06");
  });
});

describe("previous calendar month + overlapping weeks", () => {
  test("formats Romanian month labels in lowercase running text", () => {
    expect(formatRoMonthYear(2026, 8)).toBe("august 2026");
    expect(previousCalendarMonth("2026-09-07").label).toBe("august 2026");
    expect(calendarMonthRange(2026, 2)).toEqual({
      start: "2026-02-01",
      end: "2026-02-28",
    });
  });

  test("August 2026 vs 2026/27 start includes only S1", () => {
    const rows = weeksOverlappingMonth({
      programYearStart: PROGRAM_YEAR_START_MONDAY_2026_27,
      year: 2026,
      month: 8,
    });
    expect(rows.map((row) => row.week)).toEqual([1]);
    expect(rows[0]).toMatchObject({
      theme: WEEK_THEMES[1],
      season: "Toamnă",
      start: "2026-08-31",
      end: "2026-09-06",
    });
  });

  test("September 2026 includes S1–S5 with seasons", () => {
    const rows = weeksOverlappingMonth({
      programYearStart: PROGRAM_YEAR_START_MONDAY_2026_27,
      year: 2026,
      month: 9,
    });
    expect(rows.map((row) => row.week)).toEqual([1, 2, 3, 4, 5]);
    expect(rows.every((row) => row.season === "Toamnă")).toBe(true);
    expect(themeLine(rows[0]!)).toBe(`Toamnă · S1 ${WEEK_THEMES[1]}`);
  });
});

describe("skip rules and empty days", () => {
  const child = {
    childId: "c1",
    childName: "Ana",
    done: 0,
    total: 28,
  };

  test("skip when zero progress AND zero notes", () => {
    expect(shouldSkipDigest({ children: [child], notes: [] })).toBe(true);
    expect(shouldSkipDigest({ children: [], notes: [] })).toBe(true);
  });

  test("do not skip when there is progress", () => {
    expect(
      shouldSkipDigest({
        children: [{ ...child, done: 1 }],
        notes: [],
      }),
    ).toBe(false);
  });

  test("do not skip when there are notes and no progress", () => {
    expect(
      shouldSkipDigest({
        children: [child],
        notes: [
          { week: 1, dayOfWeek: 1, dayName: "Luni", body: "Am fost în curte." },
        ],
      }),
    ).toBe(false);
  });

  test("visibleNotes omits empty / whitespace days", () => {
    const notes = visibleNotes([
      { week: 1, dayOfWeek: 1, body: "Am fost în curte." },
      { week: 1, dayOfWeek: 2, body: "   " },
      { week: 1, dayOfWeek: 3, body: "" },
      { week: 1, dayOfWeek: 4, body: "Am citit." },
    ]);
    expect(notes.map((note) => note.dayName)).toEqual(["Luni", "Joi"]);
    expect(notes).toHaveLength(2);
  });

  test("monthly notes keep at most ~10, preferring the latest", () => {
    const many = Array.from({ length: 14 }, (_, index) => ({
      week: 1,
      dayOfWeek: 1,
      dayName: "Luni",
      body: `n${index + 1}`,
    }));
    const capped = capMonthlyNotes(many);
    expect(capped).toHaveLength(MONTHLY_NOTES_CAP);
    expect(capped[0]?.body).toBe("n5");
    expect(capped.at(-1)?.body).toBe("n14");
  });
});

describe("progress + period keys + toggle", () => {
  test("counts unique activity completions in the week catalog", () => {
    expect(
      countWeekProgress({
        activityIds: ["a", "b", "c"],
        completions: [
          { activity_id: "a" },
          { activity_id: "a" },
          { activity_id: "c" },
          { activity_id: "other" },
        ],
      }),
    ).toEqual({ done: 2, total: 3 });
  });

  test("progress lines stay Romanian", () => {
    expect(progressLine(8, 28)).toBe("8 din 28 activități.");
    expect(progressLine(0, 28)).toBe("0 din 28 activități.");
    expect(monthlyProgressLine(0)).toBe("Nicio activitate bifată.");
    expect(monthlyProgressLine(1)).toBe("1 activitate bifată.");
    expect(monthlyProgressLine(8)).toBe("8 activități bifate.");
  });

  test("period keys are unique per family period", () => {
    expect(weeklyPeriodKey(PROGRAM_YEAR_START_MONDAY_2026_27, 1)).toBe(
      "weekly:2026-08-31:S1",
    );
    expect(monthlyPeriodKey(2026, 8)).toBe("monthly:2026-08");
  });

  test("toggle defaults on; only explicit false opts out", () => {
    expect(familyWantsMondayDigest({})).toBe(true);
    expect(familyWantsMondayDigest({ monday_digest_email: true })).toBe(true);
    expect(familyWantsMondayDigest({ monday_digest_email: null })).toBe(true);
    expect(familyWantsMondayDigest({ monday_digest_email: false })).toBe(false);
  });

  test("note line omits empty-day callers and can show S#", () => {
    expect(
      noteLine({
        week: 1,
        dayOfWeek: 1,
        dayName: "Luni",
        body: "Am fost în curte.",
      }),
    ).toBe("Luni — Am fost în curte.");
    expect(
      noteLine(
        {
          week: 2,
          dayOfWeek: 3,
          dayName: "Miercuri",
          body: "A plouat.",
          childName: "Ana",
        },
        { showWeek: true },
      ),
    ).toBe("Ana · Miercuri (S2) — A plouat.");
  });
});

describe("build digest models", () => {
  test("weekly model uses closed week + subject + visible notes", () => {
    const model = buildWeeklyDigest({
      week: 1,
      programYearStart: PROGRAM_YEAR_START_MONDAY_2026_27,
      start: "2026-08-31",
      end: "2026-09-06",
      children: [{ childId: "c1", childName: "Ana", done: 4, total: 28 }],
      notes: [
        { week: 1, dayOfWeek: 2, dayName: "Marți", body: "Frunze." },
        { week: 1, dayOfWeek: 1, dayName: "Luni", body: "" },
      ],
    });
    expect(model.kind).toBe("weekly");
    expect(model.periodKey).toBe("weekly:2026-08-31:S1");
    expect(model.theme).toBe(WEEK_THEMES[1]);
    expect(model.subject).toBe(weeklySubject(WEEK_THEMES[1]));
    expect(model.notes).toHaveLength(1);
    expect(model.notes[0]?.dayName).toBe("Marți");
    expect(shouldSkipDigest(model)).toBe(false);
  });

  test("monthly model caps notes and lists themes", () => {
    const themes = weeksOverlappingMonth({
      programYearStart: PROGRAM_YEAR_START_MONDAY_2026_27,
      year: 2026,
      month: 8,
    });
    const model = buildMonthlyDigest({
      year: 2026,
      month: 8,
      themes,
      children: [{ childId: "c1", childName: "Ana", done: 0, total: 28 }],
      notes: Array.from({ length: 12 }, (_, index) => ({
        week: 1,
        dayOfWeek: 1,
        dayName: "Luni",
        body: `n${index + 1}`,
      })),
    });
    expect(model.subject).toBe("Luna trecută · august 2026 — Echilibru educație");
    expect(model.periodKey).toBe("monthly:2026-08");
    expect(model.themes).toHaveLength(1);
    expect(model.notes).toHaveLength(10);
    expect(shouldSkipDigest({ children: model.children, notes: [] })).toBe(true);
    expect(shouldSkipDigest(model)).toBe(false);
  });
});
