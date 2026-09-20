import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { getSeedActivities } from "./seed/week1";
import {
  loadBanda23SeedActivities,
  scanBanda23Seed,
  scanEnTokens,
} from "./en-banda-23-scanner";

function appendixIds(): string[] {
  return readFileSync(resolve("docs/APPENDIX-EN-STRIP-BANDA-2-3-IDS.txt"), "utf8")
    .split(/\s+/)
    .filter(Boolean);
}

describe("EN strip banda 2–3 (Lock A)", () => {
  test("local 1–2 seed is unchanged and has no b23 / banda 2-3 rows", () => {
    const rows = Array.from({ length: 52 }, (_, i) => i + 1).flatMap((week) =>
      getSeedActivities(week),
    );
    expect(rows).toHaveLength(1456);
    expect(rows.every((row) => row.banda === "1-2")).toBe(true);
    expect(rows.some((row) => row.id.includes("-b23-"))).toBe(false);
    expect(rows.filter((row) => row.banda === "2-3")).toHaveLength(0);
  });

  test("2–3 seed has 1456 rows, appendix 463, zero EN tokens", () => {
    const { rows, fails, tokens } = scanBanda23Seed();
    expect(rows).toHaveLength(1456);
    expect(rows.every((row) => row.banda === "2-3")).toBe(true);
    expect(rows.every((row) => row.id.includes("-2-3-"))).toBe(true);
    expect(rows.some((row) => row.id.includes("-b23-"))).toBe(false);

    const ids = new Set(rows.map((row) => row.id));
    const appendix = appendixIds();
    expect(appendix).toHaveLength(463);
    expect(appendix.filter((id) => !ids.has(id))).toEqual([]);

    expect(tokens).toEqual(expect.arrayContaining(["ball", "my turn", "turn"]));
    expect(fails, JSON.stringify(fails, null, 2)).toEqual([]);
  });

  test("S32 P0: zero Ball / My turn / Turn; minge / rând kept", () => {
    const s32 = loadBanda23SeedActivities().filter((row) => row.saptamana === 32);
    expect(s32).toHaveLength(28);
    const blob = s32
      .flatMap((row) => [row.titlu, ...row.materiale, ...row.pasi, row.gata_cand])
      .join("\n");
    expect(scanEnTokens(blob, ["ball", "my turn", "turn"])).toEqual([]);
    expect(blob.toLowerCase()).toMatch(/minge/);
    expect(blob.toLowerCase()).toMatch(/rând/);
    const z1fizic = s32.find((row) => row.id === "s32-2-3-z1-fizic");
    expect(z1fizic?.pasi.join(" ")).toMatch(/Minge/);
    expect(z1fizic?.pasi.join(" ")).not.toMatch(/\bBall\b/);
  });

  test("migration updates only live b23 ids on banda 2-3", () => {
    const sql = readFileSync(
      resolve("supabase/migrations/20260920270000_strip_en_banda_2_3.sql"),
      "utf8",
    );
    expect(sql).toMatch(/and a\.banda = '2-3'/);
    expect(sql).toMatch(/titlu = v\.titlu/);
    expect(sql).toMatch(/s32-b23-z1-fizic/);
    expect(sql).not.toMatch(/s32-2-3-z1-fizic/);
    const liveIds = sql.match(/s\d+-b23-z\d-[a-z]+/g) ?? [];
    const seedStyle = sql.match(/s\d+-2-3-z\d-[a-z]+/g) ?? [];
    expect(liveIds.length).toBeGreaterThan(400);
    expect(seedStyle).toEqual([]);
    expect(sql).not.toMatch(/banda = '1-2'/);
    expect(sql).not.toMatch(/bandFromBirthdate/);
  });
});
