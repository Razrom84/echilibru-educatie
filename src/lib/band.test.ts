import { describe, expect, test } from "vitest";
import { bandFromBirthdate, PROGRAM_AGE_BAND_LABEL } from "./band";
import { getSeedActivities } from "./seed/week1";
import { PROGRAM_AGE_BAND, PROGRAM_WEEKS } from "./week";

const LIVE_NOTE = "Vârsta 1–2: scurt, fără forțare; el poate refuza.";

describe("M1+M2 live band 1–2", () => {
  test("app default and birthdate helper use 1-2", () => {
    expect(PROGRAM_AGE_BAND).toBe("1-2");
    expect(PROGRAM_AGE_BAND_LABEL).toBe("1–2");
    expect(bandFromBirthdate("2025-03-01")).toBe("1-2");
    expect(bandFromBirthdate(null)).toBe("1-2");
  });

  test("demo seeds are labeled 1-2; ids and titles stay put", () => {
    const rows = PROGRAM_WEEKS.flatMap((week) => getSeedActivities(week));
    expect(rows).toHaveLength(560);
    expect(rows.every((row) => row.banda === "1-2")).toBe(true);
    expect(rows.every((row) => row.age_band === "1-2")).toBe(true);
    expect(rows.every((row) => row.nota === LIVE_NOTE)).toBe(true);
    expect(rows.every((row) => /-2-3-/.test(row.id))).toBe(true);
    expect(rows.find((row) => row.id === "s1-2-3-z1-fizic")?.titlu).toBe(
      "Pași în curte",
    );
    expect(rows.find((row) => row.id === "s1-2-3-z2-mental")?.gata_cand).toBe(
      "A rămas la 2–3 pagini.",
    );
  });
});
