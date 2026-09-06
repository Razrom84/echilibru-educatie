import { CHILD_COOKIE, DEMO_COOKIE, DEMO_STORAGE_KEY } from "@/lib/config";
import { bandFromBirthdate } from "@/lib/band";
import { getSeedActivities } from "@/lib/seed/week1";
import type { Child, Completion, CompletionMode, DayNote, Family } from "@/lib/types";
import { dayNoteMatches, normalizeDayNoteBody } from "@/lib/day-note";
import { familyJoinFields, familyProgramYearStart } from "@/lib/program-week";
import { PROGRAM_WEEK } from "@/lib/week";

export type DemoState = {
  family: Family;
  children: Child[];
  completions: Completion[];
  dayNotes: DayNote[];
  selectedChildId: string | null;
};

function nowIso() {
  return new Date().toISOString();
}

function id(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function emptyDemoState(): DemoState {
  const createdAt = nowIso();
  const join = familyJoinFields(createdAt);
  return {
    family: {
      id: "demo-family",
      parent_id: "demo-parent",
      display_name: "Familia mea",
      default_mode: "A",
      created_at: createdAt,
      joined_at: join.joined_at,
      program_year_start: join.program_year_start,
    },
    children: [],
    completions: [],
    dayNotes: [],
    selectedChildId: null,
  };
}

export function readDemoState(): DemoState {
  if (typeof window === "undefined") return emptyDemoState();
  try {
    const raw = window.localStorage.getItem(DEMO_STORAGE_KEY);
    if (!raw) return emptyDemoState();
    const parsed = JSON.parse(raw) as DemoState;
    const defaults = emptyDemoState();
    return {
      ...defaults,
      ...parsed,
      family: { ...defaults.family, ...parsed.family },
      dayNotes: parsed.dayNotes ?? [],
    };
  } catch {
    return emptyDemoState();
  }
}

export function writeDemoState(state: DemoState) {
  window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(state));
  if (state.selectedChildId) {
    document.cookie = `${CHILD_COOKIE}=${state.selectedChildId}; path=/; max-age=31536000; samesite=lax`;
  }
}

export function startDemoSession() {
  document.cookie = `${DEMO_COOKIE}=1; path=/; max-age=31536000; samesite=lax`;
  if (!window.localStorage.getItem(DEMO_STORAGE_KEY)) {
    writeDemoState(emptyDemoState());
  }
}

export function clearDemoSession() {
  document.cookie = `${DEMO_COOKIE}=; path=/; max-age=0`;
  document.cookie = `${CHILD_COOKIE}=; path=/; max-age=0`;
}

export function demoActivities(week = PROGRAM_WEEK) {
  return getSeedActivities(week);
}

export function addDemoChild(
  state: DemoState,
  input: { name: string; birthdate: string | null },
): DemoState {
  const child: Child = {
    id: id("child"),
    family_id: state.family.id,
    name: input.name.trim(),
    birthdate: input.birthdate,
    age_band: bandFromBirthdate(input.birthdate),
    active: true,
    created_at: nowIso(),
  };
  return {
    ...state,
    children: [...state.children, child],
    selectedChildId: child.id,
  };
}

export function upsertDemoCompletion(
  state: DemoState,
  input: {
    childId: string;
    activityId: string;
    mode: CompletionMode;
    parentApproved: boolean | null;
  },
): DemoState {
  const existing = state.completions.find(
    (row) => row.child_id === input.childId && row.activity_id === input.activityId,
  );
  const row: Completion = {
    id: existing?.id ?? id("done"),
    child_id: input.childId,
    activity_id: input.activityId,
    completed_at: existing?.completed_at ?? nowIso(),
    mode: input.mode,
    parent_approved: input.parentApproved,
  };
  return {
    ...state,
    completions: [
      ...state.completions.filter((item) => item.id !== row.id),
      row,
    ],
  };
}

export function removeDemoCompletion(
  state: DemoState,
  childId: string,
  activityId: string,
): DemoState {
  return {
    ...state,
    completions: state.completions.filter(
      (row) => !(row.child_id === childId && row.activity_id === activityId),
    ),
  };
}

export function demoDayNotesForWeek(state: DemoState, week: number): DayNote[] {
  const childId = state.selectedChildId;
  if (!childId) return [];
  const programYearStart = familyProgramYearStart(state.family);
  return state.dayNotes.filter((note) =>
    dayNoteMatches(note, {
      childId,
      programYearStart,
      weekNumber: week,
      dayOfWeek: note.day_of_week,
    }),
  );
}

export function upsertDemoDayNote(
  state: DemoState,
  input: { childId: string; weekNumber: number; dayOfWeek: number; body: string },
): DemoState {
  const programYearStart = familyProgramYearStart(state.family);
  const key = {
    childId: input.childId,
    programYearStart,
    weekNumber: input.weekNumber,
    dayOfWeek: input.dayOfWeek,
  };
  const body = normalizeDayNoteBody(input.body);
  const without = state.dayNotes.filter((note) => !dayNoteMatches(note, key));
  if (!body) {
    return { ...state, dayNotes: without };
  }
  const existing = state.dayNotes.find((note) => dayNoteMatches(note, key));
  const row: DayNote = {
    id: existing?.id ?? id("note"),
    child_id: input.childId,
    program_year_start: programYearStart,
    week_number: input.weekNumber,
    day_of_week: input.dayOfWeek,
    body,
    created_at: existing?.created_at ?? nowIso(),
    updated_at: nowIso(),
  };
  return { ...state, dayNotes: [...without, row] };
}
