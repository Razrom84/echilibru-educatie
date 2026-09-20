import { describe, expect, test } from "vitest";
import { scanEnTokens, loadEnBanda23Tokens } from "../en-banda-23-scanner";
import {
  getSeedActivities,
  hasLocalSeedBand,
  usesLocalSeedCatalog,
} from "./week1";

const SPOT_WEEKS = [14, 15, 18, 30, 32, 36, 39, 48, 52] as const;
const EN_CUE =
  /\b(Ball|My turn|Walk|Fruit|Look|Hello|Again|Stop|Go|Turn)\b/;

describe("Demo / preview 2–3 seed wiring", () => {
  test("default getSeedActivities stays banda 1–2 only", () => {
    const s32 = getSeedActivities(32);
    expect(s32).toHaveLength(28);
    expect(s32.every((row) => row.banda === "1-2")).toBe(true);
    expect(s32.map((row) => row.titlu).join(" ")).toMatch(/Balon/);
    expect(s32.map((row) => row.titlu).join(" ")).not.toMatch(/[Mm]inge/);
  });

  test("getSeedActivities(week, '2-3') serves stripped v2 RO, not Familie ids", () => {
    const s32 = getSeedActivities(32, "2-3");
    expect(s32).toHaveLength(28);
    expect(s32.every((row) => row.banda === "2-3")).toBe(true);
    expect(s32.every((row) => row.id.includes("-2-3-"))).toBe(true);
    expect(s32.some((row) => row.id.includes("-b23-"))).toBe(false);

    const titles = s32.map((row) => row.titlu).join(" ");
    expect(titles).not.toMatch(EN_CUE);
    expect(titles).toMatch(/Balon/);
    expect(titles).not.toMatch(/[Mm]inge/);
    expect(s32.find((row) => row.id === "s32-2-3-z1-fizic")?.titlu).toBe(
      "Ținem balonul de sfoară",
    );
    expect(s32.find((row) => row.id === "s32-2-3-z1-mental")?.titlu).toBe(
      "Balonul e ușor",
    );
    expect(s32.every((row) => row.tema_saptamana === "Balonul afară")).toBe(
      true,
    );
  });

  test("spot weeks S14/15/18/30/36/39/48/52 are RO from local 2–3 seed", () => {
    const tokens = loadEnBanda23Tokens();
    for (const week of SPOT_WEEKS) {
      const rows = getSeedActivities(week, "2-3");
      expect(rows, `S${week}`).toHaveLength(28);
      const titles = rows.map((row) => row.titlu).join("\n");
      expect(scanEnTokens(titles, tokens), `S${week} titles`).toEqual([]);
      expect(titles).not.toMatch(EN_CUE);
    }
  });

  test("Demo and preview 2–3 never fall through to Familie", () => {
    expect(hasLocalSeedBand("2-3")).toBe(true);
    expect(hasLocalSeedBand("1-2")).toBe(true);
    expect(hasLocalSeedBand("3-4")).toBe(false);
    expect(usesLocalSeedCatalog({ isDemo: true, band: "2-3" })).toBe(true);
    expect(usesLocalSeedCatalog({ isDemo: true, band: "1-2" })).toBe(true);
    expect(usesLocalSeedCatalog({ isDemo: true, band: "6-7" })).toBe(true);
    expect(usesLocalSeedCatalog({ isDemo: false, band: "2-3" })).toBe(true);
    expect(usesLocalSeedCatalog({ isDemo: false, band: "1-2" })).toBe(false);
    expect(usesLocalSeedCatalog({ isDemo: false, band: "4-5" })).toBe(false);
  });
});
