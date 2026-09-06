import { NextResponse } from "next/server";
import {
  DEMO_CALENDAR_TOKEN,
  buildCalendarEvents,
  parseCalendarTokenParam,
  renderIcsCalendar,
  toCalendarActivities,
} from "@/lib/calendar";
import { bucharestToday } from "@/lib/program-week";
import { getSeedActivities } from "@/lib/seed/week1";
import { createAnonSupabase } from "@/lib/supabase/anon";
import type { Pillar } from "@/lib/types";
import { PROGRAM_WEEKS } from "@/lib/week";

export const dynamic = "force-dynamic";

type FeedPayload = {
  child_id: string;
  child_name: string;
  age_band: string;
  joined_at: string | null;
  program_year_start: string | null;
  activities: Array<{
    saptamana: number;
    zi: number;
    pilon: Pillar;
    titlu: string;
    tema_saptamana: string;
  }>;
};

function icsResponse(body: string) {
  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="echilibru.ics"',
      "Cache-Control": "public, max-age=300, must-revalidate",
    },
  });
}

function notFound() {
  return new NextResponse("Not found", {
    status: 404,
    headers: { "Cache-Control": "no-store" },
  });
}

function seedActivitiesForHorizon() {
  return PROGRAM_WEEKS.flatMap((week) => getSeedActivities(week));
}

function demoFeed() {
  const events = buildCalendarEvents({
    today: bucharestToday(),
    activities: toCalendarActivities(seedActivitiesForHorizon()),
  });
  return renderIcsCalendar({
    events,
    calendarName: "Echilibru educație",
    childId: DEMO_CALENDAR_TOKEN,
  });
}

async function liveFeed(token: string) {
  const supabase = createAnonSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase.rpc("calendar_feed_for_token", {
    p_token: token,
  });
  if (error || data == null) return null;
  const feed = data as FeedPayload;
  const events = buildCalendarEvents({
    today: bucharestToday(),
    joinedAt: feed.joined_at,
    programYearStart: feed.program_year_start,
    activities: toCalendarActivities(feed.activities ?? []),
  });
  const childName = feed.child_name?.trim();
  return renderIcsCalendar({
    events,
    calendarName: childName ? `Echilibru · ${childName}` : "Echilibru educație",
    childId: feed.child_id,
  });
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ token: string }> },
) {
  const { token: raw } = await context.params;
  const token = parseCalendarTokenParam(raw);
  if (!token) return notFound();

  if (token === DEMO_CALENDAR_TOKEN) {
    return icsResponse(demoFeed());
  }

  const ics = await liveFeed(token);
  if (!ics) return notFound();
  return icsResponse(ics);
}
