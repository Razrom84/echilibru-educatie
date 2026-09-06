import { describe, expect, test } from "vitest";
import {
  addDemoChild,
  demoDayNotesForWeek,
  emptyDemoState,
  upsertDemoDayNote,
} from "./demo/store";
import {
  DAY_NOTE_HELP,
  DAY_NOTE_LABEL,
  DAY_NOTE_MAX_LENGTH,
  DAY_NOTE_PLACEHOLDER,
  DAY_NOTE_SAVED,
  dayNoteMatches,
  findDayNote,
  normalizeDayNoteBody,
} from "./day-note";

describe("Notă pe zi copy (Cristina)", () => {
  test("label, placeholder, saved, help stay Romanian", () => {
    expect(DAY_NOTE_LABEL).toBe("Notă pe zi");
    expect(DAY_NOTE_PLACEHOLDER).toBe("Ce ați mai făcut azi? (opțional)");
    expect(DAY_NOTE_SAVED).toBe("Salvat.");
    expect(DAY_NOTE_HELP).toBe("Doar dacă vrei — nu e temă.");
  });

  test("copy has no English words", () => {
    const copy = [
      DAY_NOTE_LABEL,
      DAY_NOTE_PLACEHOLDER,
      DAY_NOTE_SAVED,
      DAY_NOTE_HELP,
    ].join(" ");
    expect(copy).not.toMatch(/\b(Note|Saved|optional|homework)\b/i);
  });
});

describe("normalizeDayNoteBody", () => {
  test("empty or whitespace is no note", () => {
    expect(normalizeDayNoteBody("")).toBeNull();
    expect(normalizeDayNoteBody("   \n\t")).toBeNull();
  });

  test("trims and keeps short text", () => {
    expect(normalizeDayNoteBody("  Am mers în parc.  ")).toBe("Am mers în parc.");
  });

  test("caps at the short-text limit", () => {
    const long = "a".repeat(DAY_NOTE_MAX_LENGTH + 20);
    expect(normalizeDayNoteBody(long)?.length).toBe(DAY_NOTE_MAX_LENGTH);
  });
});

describe("day note identity", () => {
  test("matches child + program year + S# + day only", () => {
    const note = {
      child_id: "child-1",
      program_year_start: "2026-08-31",
      week_number: 1,
      day_of_week: 3,
    };
    expect(
      dayNoteMatches(note, {
        childId: "child-1",
        programYearStart: "2026-08-31",
        weekNumber: 1,
        dayOfWeek: 3,
      }),
    ).toBe(true);
    expect(
      dayNoteMatches(note, {
        childId: "child-1",
        programYearStart: "2026-08-31",
        weekNumber: 1,
        dayOfWeek: 4,
      }),
    ).toBe(false);
    expect(
      dayNoteMatches(note, {
        childId: "child-2",
        programYearStart: "2026-08-31",
        weekNumber: 1,
        dayOfWeek: 3,
      }),
    ).toBe(false);
  });

  test("findDayNote is per weekday, not per pillar", () => {
    const notes = [
      { day_of_week: 1, body: "luni" },
      { day_of_week: 2, body: "marți" },
    ];
    expect(findDayNote(notes, 2)?.body).toBe("marți");
    expect(findDayNote(notes, 7)).toBeUndefined();
  });
});

describe("demo day notes persist per child × week × day", () => {
  test("write, edit, and clear a note for one day", () => {
    let state = addDemoChild(emptyDemoState(), {
      name: "Ana",
      birthdate: "2025-03-01",
    });
    const childId = state.selectedChildId!;

    state = upsertDemoDayNote(state, {
      childId,
      weekNumber: 1,
      dayOfWeek: 2,
      body: "Am cules frunze.",
    });
    expect(demoDayNotesForWeek(state, 1)).toHaveLength(1);
    expect(demoDayNotesForWeek(state, 1)[0]?.body).toBe("Am cules frunze.");
    expect(demoDayNotesForWeek(state, 1)[0]?.day_of_week).toBe(2);

    state = upsertDemoDayNote(state, {
      childId,
      weekNumber: 1,
      dayOfWeek: 2,
      body: "Am cules frunze și am cântat.",
    });
    expect(demoDayNotesForWeek(state, 1)).toHaveLength(1);
    expect(demoDayNotesForWeek(state, 1)[0]?.body).toBe(
      "Am cules frunze și am cântat.",
    );

    state = upsertDemoDayNote(state, {
      childId,
      weekNumber: 1,
      dayOfWeek: 2,
      body: "   ",
    });
    expect(demoDayNotesForWeek(state, 1)).toEqual([]);
  });

  test("notes from another week or child stay separate", () => {
    let state = addDemoChild(emptyDemoState(), {
      name: "Ana",
      birthdate: "2025-03-01",
    });
    const ana = state.selectedChildId!;
    state = upsertDemoDayNote(state, {
      childId: ana,
      weekNumber: 1,
      dayOfWeek: 1,
      body: "S1 luni",
    });
    state = addDemoChild(state, { name: "Ion", birthdate: "2025-06-01" });
    const ion = state.selectedChildId!;
    state = upsertDemoDayNote(state, {
      childId: ion,
      weekNumber: 1,
      dayOfWeek: 1,
      body: "notă Ion",
    });

    expect(demoDayNotesForWeek(state, 1).map((row) => row.body)).toEqual([
      "notă Ion",
    ]);
    expect(demoDayNotesForWeek({ ...state, selectedChildId: ana }, 1)[0]?.body).toBe(
      "S1 luni",
    );
    expect(demoDayNotesForWeek(state, 2)).toEqual([]);
  });
});
