/**
 * Monday digest (V1.3) — weekly every Monday 08:00 Europe/Bucharest,
 * except the first Monday of a calendar month (monthly replaces weekly).
 *
 * Weekly looks at the closed civil week (Mon–Sun of S# = current_W − 1).
 * Monthly looks at the previous calendar month.
 */

import { programWeekSeason, type Season } from "@/lib/anul";
import {
  civilDayOfWeek,
  familyProgramWeek,
  familyProgramYearStart,
  formatCivilDate,
  mondayOf,
  PROGRAM_WEEKS_PER_YEAR,
  programWeekNumber,
  programWeekRange,
  programYearStartMonday,
  toCivilDate,
  type DateInput,
} from "@/lib/program-week";
import { getDayName, getWeekTheme } from "@/lib/week";

export const DIGEST_FROM = "Echilibru educație <noreply@echilibru-cartea.ro>";
export const DIGEST_SITE = "https://educatie.echilibru-cartea.ro";
export const DIGEST_AZI_URL = `${DIGEST_SITE}/azi`;
export const DIGEST_ANUL_URL = `${DIGEST_SITE}/anul`;

export const DIGEST_TOGGLE_LABEL = "Raport luni pe email";
export const DIGEST_TOGGLE_HELP =
  "Luni dimineața, un rezumat al săptămânii. Prima luni din lună: rezumatul lunii trecute.";
export const DIGEST_TEST_PREVIEW = "Arată un test";
export const DIGEST_TEST_SEND = "Trimite un test";
export const DIGEST_TEST_SENT = "Test trimis.";
export const DIGEST_TEST_SKIPPED = "Nimic de trimis — fără progres și fără note.";
export const DIGEST_TEST_DEMO =
  "În demonstrație poți doar privi testul. Emailul real cere un cont.";

export const WEEKLY_INTRO = "Săptămâna trecută s-a închis. Iată ce ați făcut, pe scurt.";
export const MONTHLY_INTRO = "Luna trecută, pe scurt — teme, progres și câteva note.";
export const NOTES_HEADING = "Note pe zi";
export const THEMES_HEADING = "Teme";
export const WEEKLY_CTA_LABEL = "Deschide Azi";
export const MONTHLY_CTA_ANUL = "Vezi anul";
export const MONTHLY_CTA_AZI = "Deschide Azi";
export const MONTHLY_NOTES_CAP = 10;

export type DigestKind = "weekly" | "monthly";

export type DigestNote = {
  week: number;
  dayOfWeek: number;
  dayName: string;
  body: string;
  childName?: string;
};

export type DigestChildProgress = {
  childId: string;
  childName: string;
  done: number;
  total: number;
};

export type DigestThemeRow = {
  week: number;
  theme: string;
  season: Season;
  start: string;
  end: string;
};

export type WeeklyDigestModel = {
  kind: "weekly";
  periodKey: string;
  week: number;
  theme: string;
  start: string;
  end: string;
  children: DigestChildProgress[];
  notes: DigestNote[];
  subject: string;
};

export type MonthlyDigestModel = {
  kind: "monthly";
  periodKey: string;
  monthLabel: string;
  year: number;
  month: number;
  start: string;
  end: string;
  themes: DigestThemeRow[];
  children: DigestChildProgress[];
  notes: DigestNote[];
  subject: string;
};

export type DigestModel = WeeklyDigestModel | MonthlyDigestModel;

export function weeklySubject(theme: string): string {
  const trimmed = theme.trim() || "săptămâna de program";
  return `Săptămâna trecută · ${trimmed} — Echilibru educație`;
}

export function monthlySubject(monthLabel: string): string {
  return `Luna trecută · ${monthLabel} — Echilibru educație`;
}

const RO_MONTHS = [
  "",
  "ianuarie",
  "februarie",
  "martie",
  "aprilie",
  "mai",
  "iunie",
  "iulie",
  "august",
  "septembrie",
  "octombrie",
  "noiembrie",
  "decembrie",
] as const;

export function formatRoMonthYear(year: number, month: number): string {
  return `${RO_MONTHS[month] ?? ""} ${year}`.trim();
}

export function formatRoDayMonth(dateOnly: string): string {
  const civil = toCivilDate(dateOnly);
  return `${civil.day} ${RO_MONTHS[civil.month] ?? ""}`.trim();
}

export function isMonday(input: DateInput): boolean {
  return civilDayOfWeek(input) === 1;
}

/** First Monday of a civil month is always day 1–7. */
export function isFirstMondayOfMonth(input: DateInput): boolean {
  const civil = toCivilDate(input);
  return isMonday(input) && civil.day <= 7;
}

export function selectDigestKind(input: DateInput): DigestKind {
  return isFirstMondayOfMonth(input) ? "monthly" : "weekly";
}

export function previousCalendarMonth(input: DateInput): {
  year: number;
  month: number;
  start: string;
  end: string;
  label: string;
} {
  const civil = toCivilDate(input);
  const monthIndex = civil.month - 2;
  const year = monthIndex < 0 ? civil.year - 1 : civil.year;
  const month = monthIndex < 0 ? 12 : monthIndex + 1;
  const start = formatCivilDate(new Date(Date.UTC(year, month - 1, 1)));
  const end = formatCivilDate(new Date(Date.UTC(year, month, 0)));
  return {
    year,
    month,
    start,
    end,
    label: formatRoMonthYear(year, month),
  };
}

export function calendarMonthRange(
  year: number,
  month: number,
): { start: string; end: string } {
  return {
    start: formatCivilDate(new Date(Date.UTC(year, month - 1, 1))),
    end: formatCivilDate(new Date(Date.UTC(year, month, 0))),
  };
}

export function weeklyPeriodKey(programYearStart: string, week: number): string {
  return `weekly:${programYearStart}:S${week}`;
}

export function monthlyPeriodKey(year: number, month: number): string {
  return `monthly:${year}-${String(month).padStart(2, "0")}`;
}

export function testPeriodKey(now: Date = new Date()): string {
  return `test:${now.toISOString()}`;
}

export function familyWantsMondayDigest(family: {
  monday_digest_email?: boolean | null;
}): boolean {
  return family.monday_digest_email !== false;
}

/**
 * Closed S# = current_W − 1.
 * On S1 Monday, that is S52 of the previous program year.
 */
export function closedWeekContext(
  now: DateInput,
  family: {
    program_year_start?: string | null;
    joined_at?: string | null;
    created_at?: string | null;
  } | null,
): {
  week: number;
  programYearStart: string;
  start: string;
  end: string;
  theme: string;
} {
  const currentWeek = familyProgramWeek(family, now);
  const currentStart = family
    ? familyProgramYearStart(family)
    : formatCivilDate(mondayOf(now));

  if (currentWeek > 1) {
    const week = currentWeek - 1;
    const range = programWeekRange(week, currentStart);
    return {
      week,
      programYearStart: currentStart,
      start: range.start,
      end: range.end,
      theme: getWeekTheme(week),
    };
  }

  const thisMonday = mondayOf(currentStart);
  const prevStart = formatCivilDate(
    programYearStartMonday(thisMonday.getUTCFullYear() - 1),
  );
  const range = programWeekRange(PROGRAM_WEEKS_PER_YEAR, prevStart);
  return {
    week: PROGRAM_WEEKS_PER_YEAR,
    programYearStart: prevStart,
    start: range.start,
    end: range.end,
    theme: getWeekTheme(PROGRAM_WEEKS_PER_YEAR),
  };
}

export function weeksOverlappingMonth(args: {
  programYearStart: DateInput;
  year: number;
  month: number;
}): DigestThemeRow[] {
  const { start: monthStart, end: monthEnd } = calendarMonthRange(
    args.year,
    args.month,
  );
  const rows: DigestThemeRow[] = [];
  for (let week = 1; week <= PROGRAM_WEEKS_PER_YEAR; week += 1) {
    const range = programWeekRange(week, args.programYearStart);
    if (range.end < monthStart || range.start > monthEnd) continue;
    rows.push({
      week,
      theme: getWeekTheme(week),
      season: programWeekSeason(week, args.programYearStart),
      start: range.start,
      end: range.end,
    });
  }
  return rows;
}

export function countWeekProgress(args: {
  activityIds: readonly string[];
  completions: readonly { activity_id: string }[];
}): { done: number; total: number } {
  const ids = new Set(args.activityIds);
  const done = new Set(
    args.completions
      .filter((row) => ids.has(row.activity_id))
      .map((row) => row.activity_id),
  ).size;
  return { done, total: ids.size };
}

export function shouldSkipDigest(args: {
  children: readonly DigestChildProgress[];
  notes: readonly DigestNote[];
}): boolean {
  const progress = args.children.reduce((sum, child) => sum + child.done, 0);
  return progress === 0 && args.notes.length === 0;
}

/** Drop blank notes; keep weekday order. Monthly callers cap afterwards. */
export function visibleNotes(
  notes: readonly {
    week: number;
    dayOfWeek: number;
    body: string;
    childName?: string;
  }[],
): DigestNote[] {
  return notes
    .map((note) => ({
      week: note.week,
      dayOfWeek: note.dayOfWeek,
      dayName: getDayName(note.dayOfWeek),
      body: note.body.trim(),
      childName: note.childName,
    }))
    .filter((note) => note.body.length > 0)
    .sort((a, b) => a.week - b.week || a.dayOfWeek - b.dayOfWeek);
}

export function capMonthlyNotes(notes: readonly DigestNote[]): DigestNote[] {
  if (notes.length <= MONTHLY_NOTES_CAP) return [...notes];
  return notes.slice(notes.length - MONTHLY_NOTES_CAP);
}

export function progressLine(done: number, total: number): string {
  if (total <= 0 && done <= 0) return "Nicio activitate de numărat.";
  if (done === 0) return `0 din ${total} activități.`;
  return `${done} din ${total} activități.`;
}

export function monthlyProgressLine(done: number): string {
  if (done === 0) return "Nicio activitate bifată.";
  if (done === 1) return "1 activitate bifată.";
  return `${done} activități bifate.`;
}

export function themeLine(row: DigestThemeRow): string {
  return `${row.season} · S${row.week} ${row.theme}`;
}

export function noteLine(note: DigestNote, opts?: { showWeek?: boolean }): string {
  const day = opts?.showWeek ? `${note.dayName} (S${note.week})` : note.dayName;
  const who = note.childName ? `${note.childName} · ` : "";
  return `${who}${day} — ${note.body}`;
}

export function buildWeeklyDigest(args: {
  week: number;
  programYearStart: string;
  theme?: string;
  start: string;
  end: string;
  children: DigestChildProgress[];
  notes: DigestNote[];
}): WeeklyDigestModel {
  const theme = args.theme?.trim() || getWeekTheme(args.week);
  return {
    kind: "weekly",
    periodKey: weeklyPeriodKey(args.programYearStart, args.week),
    week: args.week,
    theme,
    start: args.start,
    end: args.end,
    children: args.children,
    notes: visibleNotes(args.notes),
    subject: weeklySubject(theme),
  };
}

export function buildMonthlyDigest(args: {
  year: number;
  month: number;
  themes: DigestThemeRow[];
  children: DigestChildProgress[];
  notes: DigestNote[];
}): MonthlyDigestModel {
  const range = calendarMonthRange(args.year, args.month);
  const label = formatRoMonthYear(args.year, args.month);
  return {
    kind: "monthly",
    periodKey: monthlyPeriodKey(args.year, args.month),
    monthLabel: label,
    year: args.year,
    month: args.month,
    start: range.start,
    end: range.end,
    themes: args.themes,
    children: args.children,
    notes: capMonthlyNotes(visibleNotes(args.notes)),
    subject: monthlySubject(label),
  };
}

export function selectDigestForDate(
  now: DateInput,
  family: {
    program_year_start?: string | null;
    joined_at?: string | null;
    created_at?: string | null;
  } | null,
):
  | { kind: "weekly"; closed: ReturnType<typeof closedWeekContext> }
  | { kind: "monthly"; month: ReturnType<typeof previousCalendarMonth> } {
  if (selectDigestKind(now) === "monthly") {
    return { kind: "monthly", month: previousCalendarMonth(now) };
  }
  return { kind: "weekly", closed: closedWeekContext(now, family) };
}

/** Used when QA forces weekly/monthly regardless of the civil date. */
export function digestSelection(
  now: DateInput,
  family: {
    program_year_start?: string | null;
    joined_at?: string | null;
    created_at?: string | null;
  } | null,
  kindOverride?: DigestKind | null,
):
  | { kind: "weekly"; closed: ReturnType<typeof closedWeekContext> }
  | { kind: "monthly"; month: ReturnType<typeof previousCalendarMonth> } {
  const kind = kindOverride ?? selectDigestKind(now);
  if (kind === "monthly") {
    return { kind: "monthly", month: previousCalendarMonth(now) };
  }
  return { kind: "weekly", closed: closedWeekContext(now, family) };
}

export function weekNumberForCivilDate(
  dateOnly: string,
  programYearStart: DateInput,
): number {
  return programWeekNumber(dateOnly, programYearStart);
}
