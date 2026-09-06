/**
 * ICS subscribe feed (R5).
 * One all-day event per civil day, 14 days from today (Europe/Bucharest).
 * Mid-week join trim matches R3 (`compareCivilDates` vs `joined_at`).
 */

import {
  civilDayOfWeek,
  compareCivilDates,
  familyProgramWeek,
  formatCivilDate,
  toCivilDate,
  type DateInput,
} from "@/lib/program-week";
import { PILLARS } from "@/lib/pillars";
import type { Pillar } from "@/lib/types";
import { getDayName, getWeekTheme } from "@/lib/week";

export const CALENDAR_HORIZON_DAYS = 14;
export const CALENDAR_OPEN_URL = "https://educatie.echilibru-cartea.ro/azi";
export const CALENDAR_SUBSCRIBE_HELP =
  "Apple / Google: abonează-te la link (nu e nevoie de parolă).";
export const CALENDAR_COPIED =
  "Link copiat. Deschide Calendar → Abonament calendar → lipește linkul.";
export const CALENDAR_BUTTON_LABEL = "Adaugă în calendar";
export const DEMO_CALENDAR_TOKEN = "demo";
export const CALENDAR_PRODID = "-//Echilibru//Educatie//RO";
export const CALENDAR_UID_HOST = "educatie.echilibru-cartea.ro";

const TOKEN_HEX = /^[a-f0-9]{64}$/;

export type CalendarActivity = {
  week_number: number;
  day_of_week: number;
  pillar: Pillar;
  title: string;
  theme?: string | null;
};

export type CalendarDayEvent = {
  date: string;
  week: number;
  dayOfWeek: number;
  dayName: string;
  theme: string;
  titles: string[];
  summary: string;
  description: string;
};

export function generateCalendarToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/** Dynamic `[token]` may include `.ics`. */
export function parseCalendarTokenParam(raw: string): string | null {
  const token = raw.replace(/\.ics$/i, "").trim();
  if (token === DEMO_CALENDAR_TOKEN) return token;
  if (TOKEN_HEX.test(token.toLowerCase())) return token.toLowerCase();
  return null;
}

export function calendarSubscribePath(token: string): string {
  return `/api/calendar/${token}.ics`;
}

export function calendarSubscribeHttpsUrl(origin: string, token: string): string {
  return `${origin.replace(/\/$/, "")}${calendarSubscribePath(token)}`;
}

export function calendarSubscribeWebcalUrl(origin: string, token: string): string {
  return calendarSubscribeHttpsUrl(origin, token)
    .replace(/^https:/i, "webcal:")
    .replace(/^http:/i, "webcal:");
}

export function calendarEventTitle(theme: string, dayName: string): string {
  return `Echilibru · ${theme} · ${dayName}`;
}

export function calendarEventDescription(titles: string[]): string {
  const lines = titles.map((title) => title.trim()).filter(Boolean);
  lines.push(`Deschide: ${CALENDAR_OPEN_URL}`);
  return lines.join("\n");
}

function utcFromDateOnly(dateOnly: string): Date {
  const civil = toCivilDate(dateOnly);
  return new Date(Date.UTC(civil.year, civil.month - 1, civil.day));
}

export function addCivilDays(dateOnly: string, days: number): string {
  return formatCivilDate(new Date(utcFromDateOnly(dateOnly).getTime() + days * 86_400_000));
}

/** `today` plus the next 13 civil days (14 total). */
export function calendarHorizonDates(
  today: string,
  days = CALENDAR_HORIZON_DAYS,
): string[] {
  return Array.from({ length: days }, (_, index) => addCivilDays(today, index));
}

/** Same civil-date compare as R3 week trim. */
export function isCalendarDayAllowed(
  date: DateInput,
  joinedAt?: DateInput | null,
): boolean {
  if (!joinedAt) return true;
  return compareCivilDates(date, joinedAt) >= 0;
}

export function calendarFeedDays(args: {
  today: string;
  joinedAt?: DateInput | null;
  programYearStart?: string | null;
}): { date: string; week: number; dayOfWeek: number }[] {
  const family = args.programYearStart
    ? { program_year_start: args.programYearStart }
    : null;

  return calendarHorizonDates(args.today)
    .filter((date) => isCalendarDayAllowed(date, args.joinedAt))
    .map((date) => ({
      date,
      week: familyProgramWeek(family, date),
      dayOfWeek: civilDayOfWeek(date),
    }));
}

function titlesForDay(
  activities: readonly CalendarActivity[],
  week: number,
  dayOfWeek: number,
): { titles: string[]; theme: string } {
  const rows = activities
    .filter((row) => row.week_number === week && row.day_of_week === dayOfWeek)
    .slice()
    .sort((a, b) => PILLARS.indexOf(a.pillar) - PILLARS.indexOf(b.pillar));
  const theme =
    rows.find((row) => row.theme?.trim())?.theme?.trim() || getWeekTheme(week);
  return { titles: rows.map((row) => row.title), theme };
}

export function buildCalendarEvents(args: {
  today: string;
  activities: readonly CalendarActivity[];
  joinedAt?: DateInput | null;
  programYearStart?: string | null;
}): CalendarDayEvent[] {
  return calendarFeedDays(args).map((day) => {
    const { titles, theme } = titlesForDay(args.activities, day.week, day.dayOfWeek);
    const dayName = getDayName(day.dayOfWeek);
    return {
      date: day.date,
      week: day.week,
      dayOfWeek: day.dayOfWeek,
      dayName,
      theme,
      titles,
      summary: calendarEventTitle(theme, dayName),
      description: calendarEventDescription(titles),
    };
  });
}

function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
}

function foldIcsLine(line: string): string {
  const encoder = new TextEncoder();
  if (encoder.encode(line).length <= 75) return line;
  const parts: string[] = [];
  let remaining = line;
  let first = true;
  while (remaining.length > 0) {
    const limit = first ? 75 : 74;
    let take = remaining.length;
    while (take > 0 && encoder.encode(remaining.slice(0, take)).length > limit) {
      take -= 1;
    }
    if (take === 0) take = 1;
    parts.push(`${first ? "" : " "}${remaining.slice(0, take)}`);
    remaining = remaining.slice(take);
    first = false;
  }
  return parts.join("\r\n");
}

function dateToIcsDate(dateOnly: string): string {
  return dateOnly.replaceAll("-", "");
}

function formatIcsUtcStamp(instant: Date): string {
  return instant.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

export function renderIcsCalendar(args: {
  events: readonly CalendarDayEvent[];
  calendarName?: string;
  childId?: string;
  now?: Date;
}): string {
  const now = args.now ?? new Date();
  const stamp = formatIcsUtcStamp(now);
  const calName = args.calendarName ?? "Echilibru educație";
  const childKey = args.childId ?? "feed";
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:${CALENDAR_PRODID}`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeIcsText(calName)}`,
    "X-WR-TIMEZONE:Europe/Bucharest",
  ];

  for (const event of args.events) {
    const uid = `${childKey}-${event.date}@${CALENDAR_UID_HOST}`;
    lines.push(
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${dateToIcsDate(event.date)}`,
      `DTEND;VALUE=DATE:${dateToIcsDate(addCivilDays(event.date, 1))}`,
      `SUMMARY:${escapeIcsText(event.summary)}`,
      `DESCRIPTION:${escapeIcsText(event.description)}`,
      "TRANSP:TRANSPARENT",
      "END:VEVENT",
    );
  }

  lines.push("END:VCALENDAR");
  return `${lines.map(foldIcsLine).join("\r\n")}\r\n`;
}

export function toCalendarActivities(
  rows: readonly {
    week_number?: number;
    day_of_week?: number;
    saptamana?: number;
    zi?: number;
    pillar?: Pillar;
    pilon?: Pillar;
    title?: string;
    titlu?: string;
    theme?: string | null;
    tema_saptamana?: string | null;
  }[],
): CalendarActivity[] {
  return rows.map((row) => ({
    week_number: row.week_number ?? row.saptamana ?? 0,
    day_of_week: row.day_of_week ?? row.zi ?? 0,
    pillar: row.pillar ?? row.pilon ?? "fizic",
    title: row.title ?? row.titlu ?? "",
    theme: row.theme ?? row.tema_saptamana ?? null,
  }));
}
