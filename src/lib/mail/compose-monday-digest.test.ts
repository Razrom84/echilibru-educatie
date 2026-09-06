import { describe, expect, test } from "vitest";
import { PROGRAM_YEAR_START_MONDAY_2026_27 } from "@/lib/fixtures/program-year-2026-27";
import { WEEK_THEMES } from "@/lib/week";
import { composeMondayDigest } from "./compose-monday-digest";

const family = {
  id: "fam-1",
  program_year_start: PROGRAM_YEAR_START_MONDAY_2026_27,
  joined_at: "2026-08-31T07:00:00.000Z",
  monday_digest_email: true,
};

const children = [{ id: "c1", name: "Ana" }];

describe("composeMondayDigest", () => {
  test("skips when the settings toggle is off", () => {
    const result = composeMondayDigest({
      now: "2026-09-14",
      family: { ...family, monday_digest_email: false },
      children,
      completions: [{ child_id: "c1", activity_id: "s2-2-3-z1-fizic" }],
      notes: [],
    });
    expect(result.status).toBe("skipped-toggle");
  });

  test("weekly on 14 Sep closes S2 and skips empty families", () => {
    const empty = composeMondayDigest({
      now: "2026-09-14",
      family,
      children,
      completions: [],
      notes: [],
    });
    expect(empty.status).toBe("skipped-empty");
    if (empty.status === "skipped-toggle") return;
    expect(empty.model.kind).toBe("weekly");
    if (empty.model.kind !== "weekly") return;
    expect(empty.model.week).toBe(2);
    expect(empty.model.theme).toBe(WEEK_THEMES[2]);
  });

  test("weekly is ready when only a day note exists", () => {
    const result = composeMondayDigest({
      now: "2026-09-14",
      family,
      children,
      completions: [],
      notes: [
        { child_id: "c1", week_number: 2, day_of_week: 3, body: "A plouat." },
        { child_id: "c1", week_number: 2, day_of_week: 4, body: "  " },
        { child_id: "c1", week_number: 1, day_of_week: 1, body: "S1, nu intra." },
      ],
    });
    expect(result.status).toBe("ready");
    if (result.status !== "ready" || result.model.kind !== "weekly") return;
    expect(result.model.notes).toHaveLength(1);
    expect(result.model.notes[0]?.body).toBe("A plouat.");
  });

  test("first Monday of September is monthly for August (replaces S1 weekly)", () => {
    const result = composeMondayDigest({
      now: "2026-09-07",
      family,
      children,
      completions: [{ child_id: "c1", activity_id: "s1-2-3-z1-fizic" }],
      notes: [],
    });
    expect(result.status).toBe("ready");
    if (result.status !== "ready" || result.model.kind !== "monthly") return;
    expect(result.model.monthLabel).toBe("august 2026");
    expect(result.model.periodKey).toBe("monthly:2026-08");
    expect(result.model.themes.map((row) => row.week)).toEqual([1]);
    expect(result.model.children[0]?.done).toBe(1);
  });
});
