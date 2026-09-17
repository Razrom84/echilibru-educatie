/**
 * Day-level note (notă pe zi) — V1.2.
 * One short free-text per (child, program year, S#, weekday). Not per pillar.
 */

export const DAY_NOTE_LABEL = "Notă pe zi";
export const DAY_NOTE_PLACEHOLDER = "Ce ați mai făcut azi? (opțional)";
export const DAY_NOTE_SAVED = "Salvat.";
export const DAY_NOTE_HELP = "Doar dacă vrei — nu e temă.";
export const DAY_NOTE_SAVE = "Salvează";
export const DAY_NOTE_MAX_LENGTH = 500;

export type DayNoteKey = {
  childId: string;
  programYearStart: string;
  weekNumber: number;
  dayOfWeek: number;
};

export function dayNoteMatches(
  note: {
    child_id: string;
    program_year_start: string;
    week_number: number;
    day_of_week: number;
  },
  key: DayNoteKey,
): boolean {
  return (
    note.child_id === key.childId &&
    note.program_year_start === key.programYearStart &&
    note.week_number === key.weekNumber &&
    note.day_of_week === key.dayOfWeek
  );
}

/** Trim; empty / whitespace-only → null (no note). Caps at DAY_NOTE_MAX_LENGTH. */
export function normalizeDayNoteBody(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  return trimmed.length > DAY_NOTE_MAX_LENGTH
    ? trimmed.slice(0, DAY_NOTE_MAX_LENGTH)
    : trimmed;
}

export function findDayNote<T extends { day_of_week: number }>(
  notes: readonly T[],
  dayOfWeek: number,
): T | undefined {
  return notes.find((note) => note.day_of_week === dayOfWeek);
}

/** Remount identity: child + viewed S# + weekday. */
export function dayNoteEditorKey(
  childId: string,
  viewWeek: number,
  dayOfWeek: number,
): string {
  return `${childId}-${viewWeek}-${dayOfWeek}`;
}

type StoredNote = {
  day_of_week: number;
  week_number?: number;
  body: string | null;
};

/**
 * Body shown in the editor for `(viewWeek, dayOfWeek)`.
 * `dayNotes` is week-scoped, but on S# change the previous week's rows can
 * still be in memory until the fetch completes — ignore those leftovers.
 */
export function storedDayNoteBody(
  notes: readonly StoredNote[],
  dayOfWeek: number,
  viewWeek: number,
): string {
  const note = notes.find(
    (row) =>
      row.day_of_week === dayOfWeek &&
      (row.week_number == null || row.week_number === viewWeek),
  );
  return note?.body ?? "";
}
