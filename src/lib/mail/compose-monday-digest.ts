import { getSeedActivities } from "@/lib/seed/week1";
import {
  buildMonthlyDigest,
  buildWeeklyDigest,
  digestSelection,
  familyWantsMondayDigest,
  shouldSkipDigest,
  visibleNotes,
  weeksOverlappingMonth,
  type DigestChildProgress,
  type DigestKind,
  type DigestModel,
  type DigestNote,
} from "@/lib/monday-digest";
import { familyProgramYearStart, type DateInput } from "@/lib/program-week";

export type DigestActivity = {
  id: string;
  week_number: number;
};

export type DigestCompletion = {
  child_id: string;
  activity_id: string;
};

export type DigestDayNote = {
  child_id: string;
  week_number: number;
  day_of_week: number;
  body: string;
};

export type DigestChild = {
  id: string;
  name: string;
};

export type ComposeFamily = {
  id: string;
  program_year_start?: string | null;
  joined_at?: string | null;
  created_at?: string | null;
  monday_digest_email?: boolean | null;
  second_parent_email?: string | null;
};

export type ComposeResult =
  | { status: "skipped-toggle" }
  | { status: "skipped-empty"; model: DigestModel }
  | { status: "ready"; model: DigestModel };

function weekNumbersFromModel(weeks: readonly number[]): number[] {
  return [...new Set(weeks)].sort((a, b) => a - b);
}

export function catalogForWeeks(weeks: readonly number[]): DigestActivity[] {
  return weekNumbersFromModel(weeks).flatMap((week) =>
    getSeedActivities(week).map((row) => ({
      id: row.id,
      week_number: row.week_number,
    })),
  );
}

function childProgress(
  children: readonly DigestChild[],
  activities: readonly DigestActivity[],
  completions: readonly DigestCompletion[],
  weeks: readonly number[],
): DigestChildProgress[] {
  const weekSet = new Set(weeks);
  const weekActs = activities.filter((row) => weekSet.has(row.week_number));
  const ids = new Set(weekActs.map((row) => row.id));
  return children.map((child) => {
    const done = new Set(
      completions
        .filter((row) => row.child_id === child.id && ids.has(row.activity_id))
        .map((row) => row.activity_id),
    ).size;
    return {
      childId: child.id,
      childName: child.name,
      done,
      total: ids.size,
    };
  });
}

function notesForWeeks(
  children: readonly DigestChild[],
  notes: readonly DigestDayNote[],
  weeks: readonly number[],
): DigestNote[] {
  const weekSet = new Set(weeks);
  const childName = new Map(children.map((child) => [child.id, child.name]));
  const showChild = children.length > 1;
  return visibleNotes(
    notes
      .filter((note) => weekSet.has(note.week_number))
      .map((note) => ({
        week: note.week_number,
        dayOfWeek: note.day_of_week,
        body: note.body,
        childName: showChild ? childName.get(note.child_id) : undefined,
      })),
  );
}

export function composeMondayDigest(args: {
  now: DateInput;
  family: ComposeFamily;
  children: readonly DigestChild[];
  activities?: readonly DigestActivity[];
  completions: readonly DigestCompletion[];
  notes: readonly DigestDayNote[];
  kindOverride?: DigestKind | null;
  ignoreToggle?: boolean;
}): ComposeResult {
  if (!args.ignoreToggle && !familyWantsMondayDigest(args.family)) {
    return { status: "skipped-toggle" };
  }

  const selected = digestSelection(args.now, args.family, args.kindOverride);

  if (selected.kind === "weekly") {
    const weeks = [selected.closed.week];
    const activities = args.activities ?? catalogForWeeks(weeks);
    const model = buildWeeklyDigest({
      week: selected.closed.week,
      programYearStart: selected.closed.programYearStart,
      theme: selected.closed.theme,
      start: selected.closed.start,
      end: selected.closed.end,
      children: childProgress(args.children, activities, args.completions, weeks),
      notes: notesForWeeks(args.children, args.notes, weeks),
    });
    if (shouldSkipDigest(model)) return { status: "skipped-empty", model };
    return { status: "ready", model };
  }

  const yearStart = familyProgramYearStart(args.family);
  const themes = weeksOverlappingMonth({
    programYearStart: yearStart,
    year: selected.month.year,
    month: selected.month.month,
  });
  const weeks = themes.map((row) => row.week);
  const activities = args.activities ?? catalogForWeeks(weeks);
  const model = buildMonthlyDigest({
    year: selected.month.year,
    month: selected.month.month,
    themes,
    children: childProgress(args.children, activities, args.completions, weeks),
    notes: notesForWeeks(args.children, args.notes, weeks),
  });
  if (shouldSkipDigest(model)) return { status: "skipped-empty", model };
  return { status: "ready", model };
}
