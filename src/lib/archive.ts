/**
 * Cezar growth archive — civil-day snapshots (Europe/Bucharest).
 * Photos only. Band label + done titles are copied at write time.
 */

import {
  calendarMonthRange,
  calendarYearRange,
  closedWeekContext,
  formatRoLongDate,
  formatRoMonthYear,
  monthlyPeriodKey,
  previousCalendarMonth,
  previousCalendarYear,
  weeklyPeriodKey,
  yearlyPeriodKey,
} from "@/lib/monday-digest";
import {
  civilDayOfWeek,
  formatCivilDate,
  mondayOf,
  programWeekNumber,
  toCivilDate,
  toDateOnlyString,
  type DateInput,
} from "@/lib/program-week";
import type { ArchiveDay, DayNote } from "@/lib/types";

export const ARCHIVE_BUCKET = "archive-photos";
export const ARCHIVE_HREF = "/arhiva";

export const ARCHIVE_TITLE = "Arhivă";
export const ARCHIVE_HEADING = "Arhiva de creștere";
export const ARCHIVE_SUBTITLE =
  "Zilele trecute: nota, ce ați bifat și fotografia, dacă ați ținut una.";
export const ARCHIVE_EMPTY_DAY =
  "Nu am notă, lucruri bifate sau fotografie pentru ziua asta.";
export const ARCHIVE_EMPTY_PERIOD =
  "Nu am găsit zile cu notă, lucruri bifate sau fotografie în perioada asta.";
export const ARCHIVE_QUIET_DAY = "Fără notă și fără fotografie.";
export const ARCHIVE_PDF_WEEK = "Descarcă caietul săptămânii";
export const ARCHIVE_PDF_MONTH = "Descarcă caietul lunii";
export const ARCHIVE_PDF_YEAR = "Descarcă caietul anului";
export const ARCHIVE_PDF_BUSY = "Pregătesc caietul…";
export const ARCHIVE_PICK_DAY = "Alege o zi";
export const ARCHIVE_BAND_PREFIX = "Banda";

export const PHOTO_LABEL = "Fotografia zilei";
export const PHOTO_HELP =
  "O singură poză pentru această zi, din galerie sau de pe calculator. O comprimăm aici, înainte să o salvăm. Originalul rămâne la tine.";
export const PHOTO_ADD = "Adaugă o fotografie";
export const PHOTO_REPLACE = "Înlocuiește fotografia";
export const PHOTO_REMOVE = "Șterge fotografia";
export const PHOTO_BUSY = "Salvez fotografia…";
export const PHOTO_REMOVED = "Fotografia a fost ștearsă.";
export const PHOTO_SAVED = "Fotografia e salvată.";
export const PHOTO_VIDEO_REJECTED = "Doar fotografii. Fără video.";
export const PHOTO_TYPE_REJECTED =
  "Alege o fotografie din galerie sau de pe calculator.";
export const PHOTO_READ_FAILED =
  "Nu pot citi această fotografie. Alege JPEG sau PNG.";
export const PHOTO_OPEN = "Deschide fotografia mai mare";
export const PHOTO_CLOSE = "Închide fotografia";

export type ArchivePeriodKind = "weekly" | "monthly" | "yearly";

export type ArchivePeriod = {
  kind: ArchivePeriodKind;
  start: string;
  end: string;
  periodKey: string;
  label: string;
  filename: string;
};

export type ArchiveDayDraft = {
  child_id: string;
  civil_date: string;
  age_band_label: string;
  day_note: string;
  done_titles: string[];
  photo_path: string | null;
};

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

export function isCivilDate(value: string): boolean {
  return DATE_ONLY.test(value);
}

export function addCivilDays(dateOnly: string, days: number): string {
  const civil = toCivilDate(dateOnly);
  return formatCivilDate(
    new Date(Date.UTC(civil.year, civil.month - 1, civil.day + days)),
  );
}

export function eachCivilDate(start: string, end: string): string[] {
  const dates: string[] = [];
  let current = start;
  while (current <= end) {
    dates.push(current);
    current = addCivilDays(current, 1);
    if (dates.length > 400) break;
  }
  return dates;
}

export function snapshotAgeBandLabel(ageBand: string): string {
  return ageBand.replace(/-/g, "–");
}

export function archivePhotoPath(childId: string, civilDate: string): string {
  return `${childId}/${civilDate}.jpg`;
}

export function archiveDayHasContent(day: {
  day_note?: string | null;
  done_titles?: readonly string[] | null;
  photo_path?: string | null;
}): boolean {
  const note = day.day_note?.trim() ?? "";
  const done = day.done_titles?.filter((title) => title.trim().length > 0) ?? [];
  return note.length > 0 || done.length > 0 || Boolean(day.photo_path);
}

export function normalizeDoneTitles(titles: readonly string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const raw of titles) {
    const title = raw.trim();
    if (!title || seen.has(title)) continue;
    seen.add(title);
    result.push(title);
  }
  return result;
}

export function doneTitlesForCivilDate(args: {
  civilDate: string;
  activities: readonly { id: string; title: string }[];
  completions: readonly { activity_id: string; completed_at: string }[];
}): string[] {
  const titlesById = new Map(args.activities.map((row) => [row.id, row.title]));
  const titles: string[] = [];
  for (const row of args.completions) {
    if (toDateOnlyString(row.completed_at) !== args.civilDate) continue;
    const title = titlesById.get(row.activity_id);
    if (title) titles.push(title);
  }
  return normalizeDoneTitles(titles);
}

export function noteForCivilDate(args: {
  civilDate: string;
  programYearStart: string;
  notes: readonly Pick<
    DayNote,
    "program_year_start" | "week_number" | "day_of_week" | "body"
  >[];
}): string {
  const week = programWeekNumber(args.civilDate, args.programYearStart);
  const day = civilDayOfWeek(args.civilDate);
  const note = args.notes.find(
    (row) =>
      row.program_year_start === args.programYearStart &&
      row.week_number === week &&
      row.day_of_week === day,
  );
  return note?.body.trim() ?? "";
}

export function buildArchiveDraft(args: {
  childId: string;
  civilDate: string;
  ageBand: string;
  existingBandLabel?: string | null;
  dayNote: string;
  doneTitles: readonly string[];
  photoPath: string | null;
}): ArchiveDayDraft {
  return {
    child_id: args.childId,
    civil_date: args.civilDate,
    age_band_label: args.existingBandLabel?.trim() || snapshotAgeBandLabel(args.ageBand),
    day_note: args.dayNote.trim(),
    done_titles: normalizeDoneTitles(args.doneTitles),
    photo_path: args.photoPath,
  };
}

/** Inserts only — never overwrite an already-stamped day. */
export function missingArchiveDrafts(args: {
  dates: readonly string[];
  existing: readonly Pick<ArchiveDay, "child_id" | "civil_date">[];
  children: readonly { id: string; age_band: string }[];
  notes: readonly Pick<
    DayNote,
    "child_id" | "program_year_start" | "week_number" | "day_of_week" | "body"
  >[];
  completions: readonly {
    child_id: string;
    activity_id: string;
    completed_at: string;
  }[];
  activities: readonly { id: string; title: string }[];
  programYearStart: string;
}): ArchiveDayDraft[] {
  const have = new Set(
    args.existing.map((row) => `${row.child_id}:${row.civil_date}`),
  );
  const drafts: ArchiveDayDraft[] = [];
  for (const child of args.children) {
    for (const civilDate of args.dates) {
      if (have.has(`${child.id}:${civilDate}`)) continue;
      const dayNote = noteForCivilDate({
        civilDate,
        programYearStart: args.programYearStart,
        notes: args.notes.filter((note) => note.child_id === child.id),
      });
      const doneTitles = doneTitlesForCivilDate({
        civilDate,
        activities: args.activities,
        completions: args.completions.filter((row) => row.child_id === child.id),
      });
      const draft = buildArchiveDraft({
        childId: child.id,
        civilDate,
        ageBand: child.age_band,
        dayNote,
        doneTitles,
        photoPath: null,
      });
      if (!archiveDayHasContent(draft)) continue;
      drafts.push(draft);
    }
  }
  return drafts;
}

export function civilWeekPeriod(input: DateInput): ArchivePeriod {
  const start = formatCivilDate(mondayOf(input));
  const end = addCivilDays(start, 6);
  return {
    kind: "weekly",
    start,
    end,
    periodKey: `weekly-civil:${start}`,
    label: `${formatRoLongDate(start)} – ${formatRoLongDate(end)}`,
    filename: `caiet-saptamana-${start}.pdf`,
  };
}

export function closedWeekPeriod(
  now: DateInput,
  family: {
    program_year_start?: string | null;
    joined_at?: string | null;
    created_at?: string | null;
  } | null,
): ArchivePeriod {
  const closed = closedWeekContext(now, family);
  return {
    kind: "weekly",
    start: closed.start,
    end: closed.end,
    periodKey: weeklyPeriodKey(closed.programYearStart, closed.week),
    label: `S${closed.week} · ${closed.theme}`,
    filename: `caiet-saptamana-${closed.start}.pdf`,
  };
}

export function calendarMonthPeriod(year: number, month: number): ArchivePeriod {
  const range = calendarMonthRange(year, month);
  return {
    kind: "monthly",
    start: range.start,
    end: range.end,
    periodKey: monthlyPeriodKey(year, month),
    label: formatRoMonthYear(year, month),
    filename: `caiet-luna-${year}-${String(month).padStart(2, "0")}.pdf`,
  };
}

export function closedMonthPeriod(now: DateInput): ArchivePeriod {
  const month = previousCalendarMonth(now);
  return calendarMonthPeriod(month.year, month.month);
}

export function calendarYearPeriod(year: number): ArchivePeriod {
  const range = calendarYearRange(year);
  return {
    kind: "yearly",
    start: range.start,
    end: range.end,
    periodKey: yearlyPeriodKey(year),
    label: String(year),
    filename: `caiet-an-${year}.pdf`,
  };
}

export function closedYearPeriod(now: DateInput): ArchivePeriod {
  const year = previousCalendarYear(now);
  return calendarYearPeriod(year.year);
}

export function daysInPeriod<T extends { civil_date: string }>(
  days: readonly T[],
  period: Pick<ArchivePeriod, "start" | "end">,
): T[] {
  return days
    .filter((day) => day.civil_date >= period.start && day.civil_date <= period.end)
    .sort((a, b) => a.civil_date.localeCompare(b.civil_date));
}

/** Europe/Bucharest civil `today` — never emit future days. */
export function clipArchivePeriodToToday(
  period: ArchivePeriod,
  today: string,
): ArchivePeriod {
  const end = period.end <= today ? period.end : today;
  return { ...period, end };
}

export function bookletCivilDates(
  period: Pick<ArchivePeriod, "start" | "end">,
  today: string,
): string[] {
  const end = period.end <= today ? period.end : today;
  if (period.start > end) return [];
  return eachCivilDate(period.start, end);
}

export type BookletChild = {
  id: string;
  age_band_label?: string | null;
};

/** Every civil day in range, including quiet days with no photo and no note. */
export function expandBookletDays<T extends ArchiveDayDraft>(args: {
  period: Pick<ArchivePeriod, "start" | "end">;
  today: string;
  children: readonly BookletChild[];
  days: readonly T[];
}): ArchiveDayDraft[] {
  const dates = bookletCivilDates(args.period, args.today);
  const byKey = new Map(
    args.days.map((day) => [`${day.child_id}:${day.civil_date}`, day] as const),
  );
  const result: ArchiveDayDraft[] = [];
  for (const date of dates) {
    for (const child of args.children) {
      const existing = byKey.get(`${child.id}:${date}`);
      if (existing) {
        result.push({
          child_id: existing.child_id,
          civil_date: existing.civil_date,
          age_band_label: existing.age_band_label,
          day_note: existing.day_note,
          done_titles: [...existing.done_titles],
          photo_path: existing.photo_path,
        });
        continue;
      }
      result.push({
        child_id: child.id,
        civil_date: date,
        age_band_label: child.age_band_label?.trim() || "",
        day_note: "",
        done_titles: [],
        photo_path: null,
      });
    }
  }
  return result;
}

export function shouldSkipArchivePeriod(days: readonly {
  day_note?: string | null;
  done_titles?: readonly string[] | null;
  photo_path?: string | null;
}[]): boolean {
  return !days.some((day) => archiveDayHasContent(day));
}
