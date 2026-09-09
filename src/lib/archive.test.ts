import { describe, expect, test } from "vitest";
import { PROGRAM_YEAR_START_MONDAY_2026_27 } from "@/lib/fixtures/program-year-2026-27";
import {
  addCivilDays,
  archiveDayHasContent,
  archivePhotoPath,
  buildArchiveDraft,
  calendarMonthPeriod,
  calendarYearPeriod,
  civilWeekPeriod,
  closedMonthPeriod,
  closedWeekPeriod,
  closedYearPeriod,
  doneTitlesForCivilDate,
  eachCivilDate,
  missingArchiveDrafts,
  noteForCivilDate,
  shouldSkipArchivePeriod,
  snapshotAgeBandLabel,
} from "./archive";
import { isLikelyVideoFile, rejectIfNotPhoto } from "./archive-photo";
import { renderArchiveReadyEmail } from "./archive-email";
import { composeArchiveMail } from "./mail/compose-archive-mail";
import { DIGEST_ARHIVA_URL } from "./monday-digest";

describe("archive snapshots", () => {
  test("age-band label is copied with an en dash and not a live join key", () => {
    expect(snapshotAgeBandLabel("1-2")).toBe("1–2");
    expect(snapshotAgeBandLabel("1–2")).toBe("1–2");
  });

  test("photo path is private per child and civil date", () => {
    expect(archivePhotoPath("child-1", "2026-09-08")).toBe("child-1/2026-09-08.jpg");
  });

  test("a day has content when note, done titles, or photo exist", () => {
    expect(archiveDayHasContent({ day_note: "", done_titles: [], photo_path: null })).toBe(
      false,
    );
    expect(archiveDayHasContent({ day_note: "A plouat.", done_titles: [], photo_path: null })).toBe(
      true,
    );
    expect(
      archiveDayHasContent({ day_note: "", done_titles: ["Pași în curte"], photo_path: null }),
    ).toBe(true);
    expect(archiveDayHasContent({ day_note: "", done_titles: [], photo_path: "c/d.jpg" })).toBe(
      true,
    );
  });

  test("done titles follow completed_at civil date, not live catalog ids", () => {
    const titles = doneTitlesForCivilDate({
      civilDate: "2026-09-08",
      activities: [
        { id: "a1", title: "Pași în curte" },
        { id: "a2", title: "Uite copacul" },
      ],
      completions: [
        { activity_id: "a1", completed_at: "2026-09-08T07:00:00.000Z" },
        { activity_id: "a2", completed_at: "2026-09-09T07:00:00.000Z" },
      ],
    });
    expect(titles).toEqual(["Pași în curte"]);
  });

  test("band label is frozen on later writes", () => {
    const first = buildArchiveDraft({
      childId: "c1",
      civilDate: "2026-09-08",
      ageBand: "1-2",
      dayNote: "Azi.",
      doneTitles: [],
      photoPath: null,
    });
    const later = buildArchiveDraft({
      childId: "c1",
      civilDate: "2026-09-08",
      ageBand: "3-4",
      existingBandLabel: first.age_band_label,
      dayNote: "Azi, din nou.",
      doneTitles: ["Pași"],
      photoPath: null,
    });
    expect(later.age_band_label).toBe("1–2");
    expect(later.day_note).toBe("Azi, din nou.");
  });

  test("hydrate fills missing days from notes/completions without touching existing rows", () => {
    const drafts = missingArchiveDrafts({
      dates: ["2026-08-31", "2026-09-01"],
      existing: [{ child_id: "c1", civil_date: "2026-08-31" }],
      children: [{ id: "c1", age_band: "1-2" }],
      notes: [
        {
          child_id: "c1",
          program_year_start: PROGRAM_YEAR_START_MONDAY_2026_27,
          week_number: 1,
          day_of_week: 2,
          body: "Marți în curte.",
        },
      ],
      completions: [],
      activities: [],
      programYearStart: PROGRAM_YEAR_START_MONDAY_2026_27,
    });
    expect(drafts).toHaveLength(1);
    expect(drafts[0]?.civil_date).toBe("2026-09-01");
    expect(drafts[0]?.day_note).toBe("Marți în curte.");
    expect(drafts[0]?.age_band_label).toBe("1–2");
  });
});

describe("archive periods", () => {
  test("civil week is Monday–Sunday", () => {
    const week = civilWeekPeriod("2026-09-09");
    expect(week.start).toBe("2026-09-07");
    expect(week.end).toBe("2026-09-13");
    expect(week.filename).toBe("caiet-saptamana-2026-09-07.pdf");
  });

  test("closed week on 14 Sep 2026 is S2", () => {
    const week = closedWeekPeriod("2026-09-14", {
      program_year_start: PROGRAM_YEAR_START_MONDAY_2026_27,
    });
    expect(week.start).toBe("2026-09-07");
    expect(week.end).toBe("2026-09-13");
    expect(week.periodKey).toBe(`weekly:${PROGRAM_YEAR_START_MONDAY_2026_27}:S2`);
  });

  test("first Monday monthly period is the previous calendar month", () => {
    const month = closedMonthPeriod("2026-09-07");
    expect(month.start).toBe("2026-08-01");
    expect(month.end).toBe("2026-08-31");
    expect(month.label).toBe("august 2026");
    expect(month.periodKey).toBe("monthly:2026-08");
  });

  test("2 January yearly period is the previous calendar year", () => {
    const year = closedYearPeriod("2027-01-02");
    expect(year.start).toBe("2026-01-01");
    expect(year.end).toBe("2026-12-31");
    expect(year.periodKey).toBe("yearly:2026");
    expect(year.filename).toBe("caiet-an-2026.pdf");
  });

  test("eachCivilDate walks inclusive bounds", () => {
    expect(eachCivilDate("2026-01-30", "2026-02-01")).toEqual([
      "2026-01-30",
      "2026-01-31",
      "2026-02-01",
    ]);
    expect(addCivilDays("2026-12-31", 1)).toBe("2027-01-01");
  });

  test("calendar month and year helpers", () => {
    expect(calendarMonthPeriod(2026, 2).end).toBe("2026-02-28");
    expect(calendarYearPeriod(2026).end).toBe("2026-12-31");
  });
});

describe("photo file guards", () => {
  test("rejects video even if the picker labelled it oddly", () => {
    expect(isLikelyVideoFile({ type: "video/mp4", name: "clip.mp4" })).toBe(true);
    expect(rejectIfNotPhoto({ type: "video/mp4", name: "ziua.mp4" })).toMatch(/video/i);
    expect(rejectIfNotPhoto({ type: "", name: "seara.mov" })).toMatch(/video/i);
    expect(rejectIfNotPhoto({ type: "image/jpeg", name: "poza.jpg" })).toBeNull();
  });
});

describe("archive mail", () => {
  const family = {
    id: "fam-1",
    program_year_start: PROGRAM_YEAR_START_MONDAY_2026_27,
    monday_digest_email: true,
  };

  test("skips when the toggle is off", () => {
    const result = composeArchiveMail({
      now: "2026-09-14",
      family: { ...family, monday_digest_email: false },
      days: [
        {
          child_id: "c1",
          civil_date: "2026-09-08",
          age_band_label: "1–2",
          day_note: "Azi.",
          done_titles: [],
          photo_path: null,
        },
      ],
    });
    expect(result.status).toBe("skipped-toggle");
  });

  test("weekly skip when the closed week has no archive content", () => {
    const empty = composeArchiveMail({
      now: "2026-09-14",
      family,
      days: [],
    });
    expect(empty.status).toBe("skipped-empty");
    if (empty.status === "skipped-toggle") return;
    expect(empty.period.kind).toBe("weekly");
  });

  test("weekly is ready when a photo exists even without notes", () => {
    const result = composeArchiveMail({
      now: "2026-09-14",
      family,
      days: [
        {
          child_id: "c1",
          civil_date: "2026-09-08",
          age_band_label: "1–2",
          day_note: "",
          done_titles: [],
          photo_path: "c1/2026-09-08.jpg",
        },
      ],
    });
    expect(result.status).toBe("ready");
  });

  test("first Monday of September sends August, not the closed week", () => {
    const result = composeArchiveMail({
      now: "2026-09-07",
      family,
      days: [
        {
          child_id: "c1",
          civil_date: "2026-08-20",
          age_band_label: "1–2",
          day_note: "August.",
          done_titles: [],
          photo_path: null,
        },
      ],
    });
    expect(result.status).toBe("ready");
    if (result.status !== "ready") return;
    expect(result.period.kind).toBe("monthly");
    expect(result.period.periodKey).toBe("monthly:2026-08");
  });

  test("yearly kind uses the previous calendar year", () => {
    const result = composeArchiveMail({
      now: "2027-01-02",
      family,
      kindOverride: "yearly",
      days: [
        {
          child_id: "c1",
          civil_date: "2026-06-01",
          age_band_label: "1–2",
          day_note: "Vară.",
          done_titles: [],
          photo_path: null,
        },
      ],
    });
    expect(result.status).toBe("ready");
    if (result.status !== "ready") return;
    expect(result.period.periodKey).toBe("yearly:2026");
  });

  test("ready email is a short note with Archive CTA and no scores", () => {
    const period = closedWeekPeriod("2026-09-14", family);
    const email = renderArchiveReadyEmail({ period, theme: "Apa în casă și afară" });
    expect(email.subject).toContain("Săptămâna trecută");
    expect(email.text).toContain("Caietul săptămânii este gata");
    expect(email.text).toContain(DIGEST_ARHIVA_URL);
    expect(email.text).not.toMatch(/\d+ din \d+/);
    expect(email.text).not.toMatch(/%/);
    expect(email.html).not.toContain("<video");
    expect(email.html).toContain(DIGEST_ARHIVA_URL);
  });

  test("shouldSkipArchivePeriod ignores empty rows", () => {
    expect(
      shouldSkipArchivePeriod([
        { day_note: "  ", done_titles: [], photo_path: null },
      ]),
    ).toBe(true);
  });
});

describe("note mapping", () => {
  test("reads the program-week note for a civil date", () => {
    const body = noteForCivilDate({
      civilDate: "2026-09-01",
      programYearStart: PROGRAM_YEAR_START_MONDAY_2026_27,
      notes: [
        {
          program_year_start: PROGRAM_YEAR_START_MONDAY_2026_27,
          week_number: 1,
          day_of_week: 2,
          body: "Marți.",
        },
      ],
    });
    expect(body).toBe("Marți.");
  });
});
