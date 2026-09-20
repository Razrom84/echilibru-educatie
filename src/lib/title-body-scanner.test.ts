import { describe, expect, test } from "vitest";
import { getSeedActivities } from "./seed/week1";
import {
  P4_OBJECT_FAMILY_IDS,
  TITLE_BODY_OBJECT_FAMILIES,
  scanTitleBody,
} from "./title-body-scanner";

function allSeedRows() {
  return Array.from({ length: 52 }, (_, i) => i + 1).flatMap((week) =>
    getSeedActivities(week),
  );
}

describe("title↔body scanner (Anti-P5)", () => {
  test("lexicon includes cizmă / șosete / rufe (+ coș on Rufele în coș)", () => {
    const byId = Object.fromEntries(
      TITLE_BODY_OBJECT_FAMILIES.map((family) => [family.id, family]),
    );
    expect(byId.cizma.titleStems).toEqual(
      expect.arrayContaining(["cizmă", "cizme", "cizma"]),
    );
    expect(byId.sosete.titleStems).toEqual(
      expect.arrayContaining(["șosetă", "șosete"]),
    );
    expect(byId.rufe.titleStems).toEqual(
      expect.arrayContaining(["rufă", "rufe"]),
    );
    expect(byId.rufe.extraBodyWhenTitle).toEqual({
      title: "Rufele în coș",
      stems: ["coș"],
    });
  });

  test("post-P4 seed has 0 FAIL on cizmă / șosete / rufe", () => {
    const rows = allSeedRows();
    expect(rows).toHaveLength(1456);
    const families = TITLE_BODY_OBJECT_FAMILIES.filter((family) =>
      (P4_OBJECT_FAMILY_IDS as readonly string[]).includes(family.id),
    );
    const { fails, nits } = scanTitleBody(rows, families);
    expect(fails, JSON.stringify(fails, null, 2)).toEqual([]);
    expect(nits.map((hit) => hit.id).sort()).toEqual([
      "s2-2-3-z6-fizic",
      "s23-2-3-z4-fizic",
      "s23-2-3-z4-mental",
    ]);
    const rufeInCos = rows.find((row) => row.id === "s23-2-3-z4-resurse");
    expect(rufeInCos?.titlu).toBe("Rufele în coș");
    const blob = [
      ...(rufeInCos?.materiale ?? []),
      ...(rufeInCos?.pasi ?? []),
      rufeInCos?.gata_cand ?? "",
    ].join("\n");
    expect(blob).toMatch(/rufe/i);
    expect(blob).toMatch(/coș/i);
  });
});
