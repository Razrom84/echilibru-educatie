import { describe, expect, test } from "vitest";
import {
  ageInCompletedYears,
  bandFromBirthdate,
  bandFromCompletedYears,
  cohortCensusDate,
  LIVE_BAND_NOTE,
  LIVE_BAND_NOTE_2_3,
  PROGRAM_AGE_BAND_LABEL,
} from "./band";
import {
  PROGRAM_YEAR_2026_27,
  PROGRAM_YEAR_START_MONDAY_2026_27,
} from "@/lib/fixtures/program-year-2026-27";
import { addDemoChild, emptyDemoState } from "./demo/store";
import { getSeedActivities } from "./seed/week1";
import { LIVE_AGE_BANDS, PROGRAM_AGE_BAND, PROGRAM_WEEKS } from "./week";

const S1_2026 = PROGRAM_YEAR_START_MONDAY_2026_27;
const MID_YEAR_2026_27 = "2027-03-01";
const NEXT_S1 = PROGRAM_YEAR_2026_27.nextStartMonday;

describe("live bands 1–2 and 2–3", () => {
  test("app default is 1-2; 2-3 is also live", () => {
    expect(PROGRAM_AGE_BAND).toBe("1-2");
    expect(PROGRAM_AGE_BAND_LABEL).toBe("1–2");
    expect(LIVE_AGE_BANDS).toEqual(["1-2", "2-3"]);
    expect(bandFromBirthdate(null)).toBe("1-2");
  });

  test("1–2 live note stays Cristina-locked; 2–3 has a parallel note", () => {
    expect(LIVE_BAND_NOTE).toBe(
      "Vârsta 1–2: scurt, fără forțare; el poate refuza.",
    );
    expect(LIVE_BAND_NOTE_2_3).toBe(
      "Vârsta 2–3: scurt, fără forțare; el poate refuza.",
    );
  });

  test("demo seeds stay labeled 1-2; ids and titles stay put", () => {
    const rows = PROGRAM_WEEKS.flatMap((week) => getSeedActivities(week));
    expect(rows).toHaveLength(1456);
    expect(rows.every((row) => row.banda === "1-2")).toBe(true);
    expect(rows.every((row) => row.age_band === "1-2")).toBe(true);
    const s4FridayFizic = rows.find((row) => row.id === "s4-2-3-z5-fizic");
    expect(s4FridayFizic?.nota).toBe(
      "Vârsta 1–2: doar mâna, blând; el poate refuza.",
    );
    expect(
      rows
        .filter((row) => row.id !== "s4-2-3-z5-fizic")
        .every((row) => row.nota === LIVE_BAND_NOTE),
    ).toBe(true);
    expect(rows.some((row) => (row.nota ?? "").includes("2–3"))).toBe(false);
    expect(rows.some((row) => (row.nota ?? "").includes("2-3"))).toBe(false);
    expect(rows.every((row) => /-2-3-/.test(row.id))).toBe(true);
    expect(rows.find((row) => row.id === "s1-2-3-z1-fizic")?.titlu).toBe(
      "Pași în curte",
    );
    expect(rows.find((row) => row.id === "s1-2-3-z2-mental")?.gata_cand).toBe(
      "A rămas la 2–3 pagini.",
    );
  });
});

describe("school-year cohort band", () => {
  test("census date is the shared S1 Monday", () => {
    expect(cohortCensusDate(S1_2026)).toBe(S1_2026);
    expect(cohortCensusDate(PROGRAM_YEAR_2026_27.sept1)).toBe(S1_2026);
    expect(cohortCensusDate(MID_YEAR_2026_27)).toBe(S1_2026);
    expect(cohortCensusDate(PROGRAM_YEAR_2026_27.s52.end)).toBe(S1_2026);
    expect(cohortCensusDate(NEXT_S1)).toBe(NEXT_S1);
  });

  test("age at S1 Monday assigns 1-2 and 2-3", () => {
    // 1y 5m on 2026-08-31
    expect(bandFromBirthdate("2025-03-01", S1_2026)).toBe("1-2");
    // turns 2 on the census Monday
    expect(bandFromBirthdate("2024-08-31", S1_2026)).toBe("2-3");
    // 1y 11m 30d — not yet 2 on S1 Monday
    expect(bandFromBirthdate("2024-09-01", S1_2026)).toBe("1-2");
    // 2y 2m
    expect(bandFromBirthdate("2024-06-01", S1_2026)).toBe("2-3");
    expect(ageInCompletedYears("2024-08-31", S1_2026)).toBe(2);
    expect(ageInCompletedYears("2024-09-01", S1_2026)).toBe(1);
  });

  test("mid-year birthday does not switch band", () => {
    // Turns 2 on 2026-09-01 (day after S1 Monday) — stays 1-2 through S52
    expect(bandFromBirthdate("2024-09-01", S1_2026)).toBe("1-2");
    expect(bandFromBirthdate("2024-09-01", "2026-09-01")).toBe("1-2");
    expect(bandFromBirthdate("2024-09-01", MID_YEAR_2026_27)).toBe("1-2");
    expect(bandFromBirthdate("2024-09-01", PROGRAM_YEAR_2026_27.s52.end)).toBe(
      "1-2",
    );
    // Turns 2 in March 2027 — still 1-2 until next S1
    expect(bandFromBirthdate("2025-03-01", MID_YEAR_2026_27)).toBe("1-2");
    // Turns 3 in June 2027 — still 2-3 until next S1
    expect(bandFromBirthdate("2024-06-01", MID_YEAR_2026_27)).toBe("2-3");
    expect(bandFromBirthdate("2024-06-01", PROGRAM_YEAR_2026_27.s52.end)).toBe(
      "2-3",
    );
  });

  test("next S1 after S52 rolls the cohort band", () => {
    expect(bandFromBirthdate("2025-03-01", NEXT_S1)).toBe("2-3");
    expect(bandFromBirthdate("2024-09-01", NEXT_S1)).toBe("2-3");
    expect(bandFromBirthdate("2024-06-01", NEXT_S1)).toBe("3-4");
    // Turns 3 the day after next S1 Monday — still 2–3 that year
    expect(bandFromBirthdate("2024-08-31", NEXT_S1)).toBe("2-3");
    expect(bandFromCompletedYears(0)).toBe("1-2");
    expect(bandFromCompletedYears(1)).toBe("1-2");
    expect(bandFromCompletedYears(2)).toBe("2-3");
    expect(bandFromCompletedYears(6)).toBe("6-7");
  });

  test("demo signup stores the cohort band", () => {
    const toddler = addDemoChild(emptyDemoState(), {
      name: "Ana",
      birthdate: "2025-03-01",
    });
    expect(toddler.children[0]?.age_band).toBe(bandFromBirthdate("2025-03-01"));
    const older = addDemoChild(emptyDemoState(), {
      name: "Mara",
      birthdate: "2024-06-01",
    });
    expect(older.children[0]?.age_band).toBe(bandFromBirthdate("2024-06-01"));
    expect(bandFromBirthdate("2024-06-01", S1_2026)).toBe("2-3");
  });
});
