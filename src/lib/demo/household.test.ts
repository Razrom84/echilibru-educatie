import { describe, expect, test } from "vitest";
import { bandFromBirthdate } from "@/lib/band";
import { PROGRAM_YEAR_START_MONDAY_2026_27 } from "@/lib/fixtures/program-year-2026-27";
import {
  DEMO_MARA_ID,
  DEMO_TUDOR_ID,
  addDemoChild,
  emptyDemoState,
  freshDemoState,
  withDemoHousehold,
} from "./store";

const CENSUS = PROGRAM_YEAR_START_MONDAY_2026_27;

describe("demo household", () => {
  test("a fresh demo starts with Mara on 1–2 and Tudor on 2–3", () => {
    const state = freshDemoState();
    expect(state.children.map((child) => child.name)).toEqual(["Mara", "Tudor"]);
    expect(state.children.map((child) => child.birthdate)).toEqual([
      "2025-06-11",
      "2024-06-01",
    ]);
    expect(state.children.map((child) => child.id)).toEqual([
      DEMO_MARA_ID,
      DEMO_TUDOR_ID,
    ]);
    expect(bandFromBirthdate("2025-06-11", CENSUS)).toBe("1-2");
    expect(bandFromBirthdate("2024-06-01", CENSUS)).toBe("2-3");
    expect(state.children[0]?.age_band).toBe(bandFromBirthdate("2025-06-11"));
    expect(state.children[1]?.age_band).toBe(bandFromBirthdate("2024-06-01"));
    expect(state.selectedChildId).toBe(DEMO_MARA_ID);
    expect(state.completions).toEqual([]);
    expect(state.dayNotes).toEqual([]);
  });

  test("an empty saved demo is filled, and a family that already has a child is left as it is", () => {
    const filled = withDemoHousehold(emptyDemoState());
    expect(filled.children.map((child) => child.name)).toEqual(["Mara", "Tudor"]);
    expect(filled.selectedChildId).toBe(DEMO_MARA_ID);

    const custom = addDemoChild(emptyDemoState(), {
      name: "Ana",
      birthdate: "2025-03-01",
    });
    expect(withDemoHousehold(custom)).toBe(custom);
    expect(withDemoHousehold(custom).children).toHaveLength(1);
  });
});
