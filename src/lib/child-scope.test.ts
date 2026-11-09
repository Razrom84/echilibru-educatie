import { afterEach, describe, expect, test, vi } from "vitest";
import { cohortCensusDate } from "@/lib/band";
import { DEMO_STORAGE_KEY } from "@/lib/config";
import {
  addDemoChild,
  emptyDemoState,
  readDemoState,
  upsertDemoCompletion,
  type DemoState,
} from "@/lib/demo/store";
import { planUnscopedPhotoMoves } from "@/lib/demo/photos";
import { expandBookletDays } from "@/lib/archive";
import { PROGRAM_YEAR_START_MONDAY_2026_27 } from "@/lib/fixtures/program-year-2026-27";
import { composeMondayDigest } from "@/lib/mail/compose-monday-digest";
import { getSeedActivities } from "@/lib/seed/week1";
import {
  attributeMissingChildId,
  childForUnscopedRows,
  childScopeNotice,
  completionForActivity,
  completionsForChild,
  scopeFamilyRecords,
} from "@/lib/child-scope";

const SHARED_ID = "s11-2-3-z1-mental";

function birthdates() {
  const year = Number(cohortCensusDate().slice(0, 4));
  return {
    mara: `${year - 1}-06-11`,
    tudor: `${year - 2}-03-01`,
  };
}

function twoChildren() {
  const dates = birthdates();
  let state = addDemoChild(emptyDemoState(), {
    name: "Mara",
    birthdate: dates.mara,
  });
  const mara = state.selectedChildId!;
  state = addDemoChild(state, { name: "Tudor", birthdate: dates.tudor });
  const tudor = state.selectedChildId!;
  return { state, mara, tudor };
}

describe("bifele țin de copil", () => {
  test("aceeași activitate, bifată la Mara, rămâne nebifată la Tudor", () => {
    const { state, mara, tudor } = twoChildren();
    expect(state.children.find((child) => child.id === mara)?.age_band).toBe("1-2");
    expect(state.children.find((child) => child.id === tudor)?.age_band).toBe("2-3");

    const ticked = upsertDemoCompletion(state, {
      childId: mara,
      activityId: SHARED_ID,
      mode: "B",
      parentApproved: false,
    });

    expect(completionsForChild(ticked.completions, mara)).toHaveLength(1);
    expect(completionsForChild(ticked.completions, tudor)).toEqual([]);
    expect(completionForActivity(ticked.completions, tudor, SHARED_ID)).toBeNull();
    expect(completionForActivity(ticked.completions, mara, SHARED_ID)?.parent_approved).toBe(
      false,
    );

    const both = upsertDemoCompletion(ticked, {
      childId: tudor,
      activityId: SHARED_ID,
      mode: "A",
      parentApproved: true,
    });
    expect(completionForActivity(both.completions, mara, SHARED_ID)?.mode).toBe("B");
    expect(completionForActivity(both.completions, tudor, SHARED_ID)?.mode).toBe("A");
    expect(both.completions).toHaveLength(2);
  });

  test("bifa veche fără copil ajunge la singurul copil și nu se pierde la a doua rulare", () => {
    const dates = birthdates();
    const state = addDemoChild(emptyDemoState(), {
      name: "Mara",
      birthdate: dates.mara,
    });
    const legacy = {
      ...state,
      completions: [
        {
          id: "done-vechi",
          activity_id: SHARED_ID,
          completed_at: "2026-11-09T08:00:00.000Z",
          mode: "A" as const,
          parent_approved: true,
        },
      ],
    } as DemoState;

    const once = attributeMissingChildId(legacy.completions, state.selectedChildId);
    expect(once.assigned).toBe(1);
    expect(once.rows).toHaveLength(1);
    expect(once.rows[0]?.child_id).toBe(state.selectedChildId);

    const twice = attributeMissingChildId(once.rows, state.selectedChildId);
    expect(twice.assigned).toBe(0);
    expect(twice.rows).toEqual(once.rows);
    expect(
      childScopeNotice({
        kind: "bife",
        childName: "Mara",
        severalChildren: false,
        count: 1,
      }),
    ).toBe("Bifele vechi, fără copil, au fost puse la Mara.");
  });

  test("la mai mulți copii, bifa veche ajunge la primul și bifa lui Tudor rămâne", () => {
    const { state, mara, tudor } = twoChildren();
    const withTudor = upsertDemoCompletion(
      {
        ...state,
        children: state.children.map((child) => ({
          ...child,
          created_at:
            child.id === mara
              ? "2026-11-01T00:00:00.000Z"
              : "2026-11-02T00:00:00.000Z",
        })),
      },
      {
        childId: tudor,
        activityId: "s11-2-3-z1-fizic",
        mode: "A",
        parentApproved: true,
      },
    );
    const legacy = {
      ...withTudor,
      completions: [
        ...withTudor.completions,
        {
          id: "done-fara-copil",
          activity_id: SHARED_ID,
          completed_at: "2026-11-09T08:00:00.000Z",
          mode: "A" as const,
          parent_approved: true,
          childId: "  ",
        },
      ],
    } as unknown as DemoState;

    const { child, several } = childForUnscopedRows(legacy.children);
    expect(several).toBe(true);
    expect(child?.id).toBe(mara);

    const migrated = attributeMissingChildId(legacy.completions, child?.id ?? null);
    expect(migrated.rows).toHaveLength(2);
    expect(completionForActivity(migrated.rows, mara, SHARED_ID)?.id).toBe("done-fara-copil");
    expect(completionForActivity(migrated.rows, tudor, "s11-2-3-z1-fizic")).not.toBeNull();
    expect(completionForActivity(migrated.rows, tudor, SHARED_ID)).toBeNull();

    const again = attributeMissingChildId(migrated.rows, mara);
    expect(again.assigned).toBe(0);
    expect(again.rows).toHaveLength(2);

    expect(
      childScopeNotice({
        kind: "bife",
        childName: "Mara",
        severalChildren: true,
        count: 1,
      }),
    ).toContain("primul copil, Mara");
    expect(
      childScopeNotice({
        kind: "bife",
        childName: "Mara",
        severalChildren: true,
        count: 1,
      }),
    ).toContain("mai mulți copii");
  });
});

describe("pozele vechi din Demo", () => {
  test("cheia doar cu data trece la copil, fără să acopere o poză care există", () => {
    const moves = planUnscopedPhotoMoves(
      ["2026-11-09", "mara:2026-11-09", "tudor:2026-11-08", "altceva"],
      "mara",
    );
    expect(moves).toEqual([]);
    expect(
      planUnscopedPhotoMoves(["2026-11-08.jpg", "tudor:2026-11-09"], "mara"),
    ).toEqual([{ from: "2026-11-08.jpg", to: "mara:2026-11-08" }]);
  });
});

describe("Demo păstrează bifele vechi la citire", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  test("localStorage fără copil primește copilul și a doua citire nu mai mută nimic", () => {
    const dates = birthdates();
    const state = addDemoChild(emptyDemoState(), {
      name: "Mara",
      birthdate: dates.mara,
    });
    const stored = {
      ...state,
      completions: [
        {
          id: "done-vechi",
          activity_id: SHARED_ID,
          completed_at: "2026-11-09T08:00:00.000Z",
          mode: "A",
          parent_approved: true,
        },
      ],
    };
    const memory = new Map<string, string>([[DEMO_STORAGE_KEY, JSON.stringify(stored)]]);
    vi.stubGlobal("window", {
      localStorage: {
        getItem: (key: string) => memory.get(key) ?? null,
        setItem: (key: string, value: string) => memory.set(key, value),
      },
    });
    vi.stubGlobal("document", { cookie: "" });
    const info = vi.spyOn(console, "info").mockImplementation(() => {});

    const first = readDemoState();
    expect(first.completions).toHaveLength(1);
    expect(first.completions[0]?.child_id).toBe(state.selectedChildId);
    expect(info).toHaveBeenCalledWith(
      "Bifele vechi, fără copil, au fost puse la Mara.",
    );

    info.mockClear();
    const second = readDemoState();
    expect(second.completions).toEqual(first.completions);
    expect(info).not.toHaveBeenCalled();
  });
});

describe("PDF-ul și rezumatul pe e-mail", () => {
  const activities = [
    ...getSeedActivities(11, "1-2").map((row) => ({
      id: row.id,
      title: row.title,
      week_number: row.week_number,
      day_of_week: row.day_of_week,
      age_band: "1-2",
    })),
    ...getSeedActivities(11, "2-3").map((row) => ({
      id: row.id,
      title: row.title,
      week_number: row.week_number,
      day_of_week: row.day_of_week,
      age_band: "2-3",
    })),
  ];

  const children = [
    {
      id: "mara",
      name: "Mara",
      age_band: "1-2",
      age_band_label: "1–2",
      created_at: "2026-11-01T00:00:00.000Z",
    },
    {
      id: "tudor",
      name: "Tudor",
      age_band: "2-3",
      age_band_label: "2–3",
      created_at: "2026-11-02T00:00:00.000Z",
    },
  ];

  test("caietul pune „Lumină pe mână” doar la Mara, iar Tudor rămâne curat", () => {
    const days = expandBookletDays({
      period: { start: "2026-11-09", end: "2026-11-15" },
      today: "2026-11-09",
      children,
      days: [],
      live: {
        programYearStart: PROGRAM_YEAR_START_MONDAY_2026_27,
        completions: [
          {
            child_id: "mara",
            activity_id: SHARED_ID,
            completed_at: "2026-11-09T08:00:00.000Z",
          },
        ],
        activities,
      },
    });
    const onMonday = (id: string) =>
      days.find((day) => day.child_id === id && day.civil_date === "2026-11-09");
    expect(onMonday("mara")?.done_titles).toEqual(["Lumină pe mână"]);
    expect(onMonday("tudor")?.done_titles).toEqual([]);
    expect(days.some((day) => day.child_id === "tudor" && day.done_titles.length > 0)).toBe(
      false,
    );
  });

  test("bifa lui Tudor nu apare în caietul Marei, nici invers", () => {
    const days = expandBookletDays({
      period: { start: "2026-11-09", end: "2026-11-15" },
      today: "2026-11-09",
      children,
      days: [],
      live: {
        programYearStart: PROGRAM_YEAR_START_MONDAY_2026_27,
        notes: [
          {
            child_id: "mara",
            program_year_start: PROGRAM_YEAR_START_MONDAY_2026_27,
            week_number: 11,
            day_of_week: 1,
            body: "Mara a privit lumina.",
          },
        ],
        completions: [
          {
            child_id: "tudor",
            activity_id: SHARED_ID,
            completed_at: "2026-11-09T08:00:00.000Z",
          },
        ],
        activities,
      },
    });
    const onMonday = (id: string) =>
      days.find((day) => day.child_id === id && day.civil_date === "2026-11-09");
    expect(onMonday("tudor")?.done_titles).toEqual(["Ce s-a schimbat?"]);
    expect(onMonday("mara")?.done_titles).toEqual([]);
    expect(onMonday("mara")?.day_note).toBe("Mara a privit lumina.");
    expect(onMonday("tudor")?.day_note).toBe("");
  });

  test("rezumatul de luni numără bifa doar la copilul care a făcut-o", () => {
    const result = composeMondayDigest({
      now: "2026-11-16",
      family: {
        id: "fam",
        program_year_start: PROGRAM_YEAR_START_MONDAY_2026_27,
        joined_at: "2026-08-31T07:00:00.000Z",
        monday_digest_email: true,
      },
      children,
      completions: [{ child_id: "mara", activity_id: SHARED_ID }],
      notes: [
        {
          child_id: "mara",
          week_number: 11,
          day_of_week: 1,
          body: "Doar la Mara.",
        },
      ],
    });
    expect(result.status).toBe("ready");
    if (result.status !== "ready" || result.model.kind !== "weekly") return;
    const mara = result.model.children.find((row) => row.childId === "mara");
    const tudor = result.model.children.find((row) => row.childId === "tudor");
    expect(mara?.done).toBe(1);
    expect(tudor?.done).toBe(0);
    expect(result.model.notes.map((note) => note.body)).toEqual(["Doar la Mara."]);
    expect(result.model.notes[0]?.childName).toBe("Mara");
  });

  test("o bifă veche fără copil nu se numără la amândoi", () => {
    const scoped = scopeFamilyRecords(children, {
      completions: [{ activity_id: SHARED_ID, child_id: null }],
      notes: [
        {
          child_id: null,
          week_number: 11,
          day_of_week: 1,
          body: "Notă veche.",
        },
      ],
    });
    expect(scoped.completions[0]?.child_id).toBe("mara");
    expect(scoped.notes[0]?.child_id).toBe("mara");
    expect(scoped.notices[0]).toContain("primul copil, Mara");

    const result = composeMondayDigest({
      now: "2026-11-16",
      family: {
        id: "fam",
        program_year_start: PROGRAM_YEAR_START_MONDAY_2026_27,
        monday_digest_email: true,
      },
      children,
      completions: scoped.completions.map((row) => ({
        child_id: row.child_id ?? "",
        activity_id: row.activity_id,
      })),
      notes: scoped.notes.map((note) => ({
        child_id: note.child_id ?? "",
        week_number: 11,
        day_of_week: 1,
        body: "Notă veche.",
      })),
    });
    if (result.status !== "ready" || result.model.kind !== "weekly") {
      throw new Error("Rezumatul trebuia să fie gata.");
    }
    expect(result.model.children.find((row) => row.childId === "tudor")?.done).toBe(0);
    expect(result.model.children.find((row) => row.childId === "mara")?.done).toBe(1);
  });
});
