import { describe, expect, test } from "vitest";
import {
  activityText,
  compareCatalog,
  formatParityReport,
  liveIdForSeed,
  seedIdForLive,
} from "./catalog-parity";

describe("seed ↔ database id map", () => {
  test("band 1–2 keeps the sN-2-3 id that already lives in the database", () => {
    expect(liveIdForSeed("s11-2-3-z1-fizic", "1-2")).toBe("s11-2-3-z1-fizic");
    expect(seedIdForLive("s45-2-3-z1-fizic", "1-2")).toBe("s45-2-3-z1-fizic");
  });

  test("band 2–3 maps the seed slug onto the live b23 id", () => {
    expect(liveIdForSeed("s32-2-3-z1-fizic", "2-3")).toBe("s32-b23-z1-fizic");
    expect(liveIdForSeed("s14-2-3-z5-mental", "2-3")).toBe("s14-b23-z5-mental");
    expect(seedIdForLive("s32-b23-z1-fizic", "2-3")).toBe("s32-2-3-z1-fizic");
  });
});

describe("catalog parity", () => {
  test("reports title and body differences and does not rewrite them", () => {
    const seed = [
      { id: "s11-2-3-z1-fizic", titlu: "Pași până la lumină", pasi: ["Mergeți."] },
      { id: "s11-2-3-z2-fizic", titlu: "Aceeași", pasi: ["Un pas.", "Al doilea."] },
    ];
    const live = [
      { id: "s11-2-3-z1-fizic", titlu: "Pași spre fereastră luminoasă", pasi: ["Mergeți."] },
      { id: "s11-2-3-z2-fizic", titlu: "Aceeași", pasi: ["Un pas.", "Alt pas."] },
      { id: "s11-2-3-z3-fizic", titlu: "Doar în bază", pasi: ["X"] },
    ];
    const before = JSON.stringify({ seed, live });
    const report = compareCatalog("1-2", seed, live);
    expect(JSON.stringify({ seed, live })).toBe(before);
    expect(report.titleDiffs).toBe(1);
    expect(report.textDiffs).toBe(1);
    expect(report.missingInDb).toBe(0);
    expect(report.missingInSeed).toBe(1);
    expect(report.diffs.find((diff) => diff.kind === "titlu")).toMatchObject({
      seedId: "s11-2-3-z1-fizic",
      liveId: "s11-2-3-z1-fizic",
      seed: "Pași până la lumină",
      live: "Pași spre fereastră luminoasă",
    });
    expect(activityText([" Un pas. ", "Alt pas."])).toBe("Un pas.\nAlt pas.");
  });

  test("pairs band 2–3 seed ids with live b23 ids", () => {
    const report = compareCatalog(
      "2-3",
      [{ id: "s45-2-3-z1-fizic", titlu: "Pași mulți", pasi: ["A"] }],
      [{ id: "s45-b23-z1-fizic", titlu: "Pași mulți", pasi: ["A"] }],
    );
    expect(report.titleDiffs).toBe(0);
    expect(report.textDiffs).toBe(0);
    expect(report.missingInDb).toBe(0);
    expect(report.missingInSeed).toBe(0);
    expect(formatParityReport([report])).toContain("Total titluri diferite: 0");
    expect(formatParityReport([report])).toContain("(nicio diferență)");
  });

  test("a seed row with no live partner is listed, not repaired", () => {
    const report = compareCatalog(
      "2-3",
      [{ id: "s1-2-3-z1-fizic", titlu: "În copie", pasi: ["A"] }],
      [],
    );
    expect(report.missingInDb).toBe(1);
    expect(report.diffs[0]).toMatchObject({
      kind: "lipsa-in-baza",
      seedId: "s1-2-3-z1-fizic",
      liveId: "s1-b23-z1-fizic",
    });
    expect(formatParityReport([report])).toContain("LIPSĂ ÎN BAZĂ");
    expect(formatParityReport([report])).not.toContain("UPDATE");
  });
});
