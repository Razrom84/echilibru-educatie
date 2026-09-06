import { describe, expect, test } from "vitest";
import {
  CALENDAR_BUTTON_LABEL,
  CALENDAR_COPIED,
  CALENDAR_HORIZON_DAYS,
  CALENDAR_OPEN_URL,
  CALENDAR_SUBSCRIBE_HELP,
  DEMO_CALENDAR_TOKEN,
  addCivilDays,
  buildCalendarEvents,
  calendarEventDescription,
  calendarEventTitle,
  calendarHorizonDates,
  calendarSubscribeHttpsUrl,
  calendarSubscribePath,
  calendarSubscribeWebcalUrl,
  generateCalendarToken,
  isCalendarDayAllowed,
  parseCalendarTokenParam,
  renderIcsCalendar,
  toCalendarActivities,
} from "./calendar";
import { getSeedActivities } from "./seed/week1";
import { PROGRAM_YEAR_START_MONDAY_2026_27 } from "./fixtures/program-year-2026-27";

const S1_THEME = "Casa și curtea";

describe("Cristina copy (R5)", () => {
  test("locks button, helper, and copied strings", () => {
    expect(CALENDAR_BUTTON_LABEL).toBe("Adaugă în calendar");
    expect(CALENDAR_SUBSCRIBE_HELP).toBe(
      "Apple / Google: abonează-te la link (nu e nevoie de parolă).",
    );
    expect(CALENDAR_COPIED).toBe(
      "Link copiat. Deschide Calendar → Abonament calendar → lipește linkul.",
    );
    expect(CALENDAR_OPEN_URL).toBe("https://educatie.echilibru-cartea.ro/azi");
  });

  test("event title is Echilibru · theme · day", () => {
    expect(calendarEventTitle(S1_THEME, "Duminică")).toBe(
      "Echilibru · Casa și curtea · Duminică",
    );
  });

  test("description is four titles plus Deschide URL", () => {
    expect(
      calendarEventDescription(["Pași în curte", "Uite copacul", "Cheia", "Salut"]),
    ).toBe(
      ["Pași în curte", "Uite copacul", "Cheia", "Salut", `Deschide: ${CALENDAR_OPEN_URL}`].join(
        "\n",
      ),
    );
  });
});

describe("subscribe URL", () => {
  test("https .ics path and webcal variant", () => {
    const token = "a".repeat(64);
    expect(calendarSubscribePath(token)).toBe(`/api/calendar/${token}.ics`);
    expect(calendarSubscribeHttpsUrl("https://educatie.echilibru-cartea.ro", token)).toBe(
      `https://educatie.echilibru-cartea.ro/api/calendar/${token}.ics`,
    );
    expect(calendarSubscribeWebcalUrl("https://educatie.echilibru-cartea.ro", token)).toBe(
      `webcal://educatie.echilibru-cartea.ro/api/calendar/${token}.ics`,
    );
  });

  test("parses token.ics and rejects junk", () => {
    const token = "ab".repeat(32);
    expect(parseCalendarTokenParam(`${token}.ics`)).toBe(token);
    expect(parseCalendarTokenParam(token.toUpperCase())).toBe(token);
    expect(parseCalendarTokenParam("demo")).toBe(DEMO_CALENDAR_TOKEN);
    expect(parseCalendarTokenParam("demo.ics")).toBe(DEMO_CALENDAR_TOKEN);
    expect(parseCalendarTokenParam("../secret")).toBeNull();
    expect(parseCalendarTokenParam("short")).toBeNull();
  });

  test("generated token is 64 hex chars", () => {
    const token = generateCalendarToken();
    expect(token).toMatch(/^[a-f0-9]{64}$/);
    expect(parseCalendarTokenParam(`${token}.ics`)).toBe(token);
  });
});

describe("14-day horizon (Europe/Bucharest civil)", () => {
  test("includes today and the next 13 days", () => {
    const dates = calendarHorizonDates("2026-09-06");
    expect(dates).toHaveLength(CALENDAR_HORIZON_DAYS);
    expect(dates[0]).toBe("2026-09-06");
    expect(dates[13]).toBe("2026-09-19");
    expect(addCivilDays("2026-09-06", 1)).toBe("2026-09-07");
  });
});

describe("mid-week join trim (same as R3)", () => {
  test("days before joined_at are omitted", () => {
    expect(isCalendarDayAllowed("2026-08-31", "2026-09-02")).toBe(false);
    expect(isCalendarDayAllowed("2026-09-01", "2026-09-02")).toBe(false);
    expect(isCalendarDayAllowed("2026-09-02", "2026-09-02")).toBe(true);
    expect(isCalendarDayAllowed("2026-09-06", "2026-09-02")).toBe(true);
  });

  test("join Wednesday + today Monday → skip Luni–Marți of S1", () => {
    const events = buildCalendarEvents({
      today: "2026-08-31",
      joinedAt: "2026-09-02",
      programYearStart: PROGRAM_YEAR_START_MONDAY_2026_27,
      activities: toCalendarActivities(getSeedActivities(1)),
    });
    expect(events.map((event) => event.date)).toEqual([
      "2026-09-02",
      "2026-09-03",
      "2026-09-04",
      "2026-09-05",
      "2026-09-06",
      "2026-09-07",
      "2026-09-08",
      "2026-09-09",
      "2026-09-10",
      "2026-09-11",
      "2026-09-12",
      "2026-09-13",
    ]);
    expect(events).toHaveLength(12);
    expect(events[0]?.dayName).toBe("Miercuri");
  });

  test("missing joined_at does not trim the horizon", () => {
    const events = buildCalendarEvents({
      today: "2026-09-06",
      programYearStart: PROGRAM_YEAR_START_MONDAY_2026_27,
      activities: [],
    });
    expect(events).toHaveLength(14);
    expect(events[0]?.date).toBe("2026-09-06");
    expect(events[13]?.date).toBe("2026-09-19");
  });
});

describe("buildCalendarEvents — one event / day from seed", () => {
  test("S1 Sunday has four titles in pillar order and S2 Monday follows", () => {
    const activities = [
      ...toCalendarActivities(getSeedActivities(1)),
      ...toCalendarActivities(getSeedActivities(2)),
    ];
    const events = buildCalendarEvents({
      today: "2026-09-06",
      programYearStart: PROGRAM_YEAR_START_MONDAY_2026_27,
      activities,
    });
    expect(events).toHaveLength(14);
    expect(events[0]?.summary).toBe("Echilibru · Casa și curtea · Duminică");
    expect(events[0]?.titles).toHaveLength(4);
    expect(events[0]?.description.split("\n").at(-1)).toBe(`Deschide: ${CALENDAR_OPEN_URL}`);
    expect(events[1]?.date).toBe("2026-09-07");
    expect(events[1]?.week).toBe(2);
    expect(events[1]?.dayName).toBe("Luni");
    expect(events[1]?.summary.startsWith("Echilibru · ")).toBe(true);
  });
});

describe("renderIcsCalendar", () => {
  test("emits a subscribe-ready VCALENDAR with all-day DATE events", () => {
    const events = buildCalendarEvents({
      today: "2026-09-06",
      programYearStart: PROGRAM_YEAR_START_MONDAY_2026_27,
      activities: toCalendarActivities(getSeedActivities(1)),
    });
    const ics = renderIcsCalendar({
      events: events.slice(0, 1),
      calendarName: "Echilibru · Ana",
      childId: "child-1",
      now: new Date("2026-09-06T10:00:00.000Z"),
    });
    expect(ics.startsWith("BEGIN:VCALENDAR")).toBe(true);
    expect(ics).toContain("BEGIN:VEVENT");
    expect(ics).toContain("DTSTART;VALUE=DATE:20260906");
    expect(ics).toContain("DTEND;VALUE=DATE:20260907");
    expect(ics).toContain("SUMMARY:Echilibru · Casa și curtea · Duminică");
    expect(ics).toContain("Deschide:");
    expect(ics).toContain("UID:child-1-2026-09-06@educatie.echilibru-cartea.ro");
    expect(ics).toContain("X-WR-CALNAME:Echilibru · Ana");
    expect(ics).toContain("END:VCALENDAR");
  });
});
