import { describe, expect, it } from "vitest";
import fs from "node:fs";
import {
  allCatalogMaterials,
  applyGiftedCatalog,
  formatPrice,
  giftedWeek,
  GIFTED_CONFIG,
  localWeekMaterials,
  mapDbMaterial,
  MATERIAL_ID_PREFIX,
  materialsForActivity,
  readWeekMaterials,
  type CatalogMaterial,
} from "@/lib/gifted";
import {
  ageBadge,
  ageInMonths,
  categoryForMaterial,
  GIFTED_STARTER,
  hasInStock,
  reuseSummary,
  STARTER_LIST,
  starterDrafts,
  STOC_CATEGORII,
  unusedForWeeks,
  validateDraft,
  type StocItem,
} from "@/lib/stoc";
import type { SeedActivity } from "@/lib/types";

const item = (over: Partial<StocItem>): StocItem => ({
  id: "x",
  family_id: "f",
  nume: "Tobă",
  tip: "cumparat",
  categorie: "senzorial",
  produs_cheie: null,
  material_id: null,
  stare: "bun",
  loc: null,
  varsta_min_luni: null,
  varsta_max_luni: null,
  poza_url: null,
  sursa: "manual",
  data: null,
  pret_platit: null,
  note: null,
  created_at: "2026-11-17T10:00:00Z",
  updated_at: "2026-11-17T10:00:00Z",
  ...over,
});

describe("gifted config", () => {
  it("2–3 S1–S4 stays gifted, 1–2 S13–S14 is added, nothing else", () => {
    expect([1, 2, 3, 4].every((week) => giftedWeek("2-3", week))).toBe(true);
    expect(giftedWeek("2-3", 5)).toBe(false);
    expect(giftedWeek("1-2", 13) && giftedWeek("1-2", 14)).toBe(true);
    expect(giftedWeek("1-2", 12) || giftedWeek("1-2", 15) || giftedWeek("1-2", 1)).toBe(false);
    expect(giftedWeek("3-4", 1)).toBe(false);
  });

  it("2–3 local materials are unchanged (18) and carry produs_cheie", () => {
    const all = allCatalogMaterials("2-3");
    expect(all).toHaveLength(18);
    expect(all.every((material) => material.produs_cheie)).toBe(true);
    expect(localWeekMaterials("2-3", 3).materials.map((m) => m.id)).toEqual(["s3-m1", "s3-m2", "s3-m3", "s3-m4"]);
  });

  it("1–2 material ids use the b12- prefix", () => {
    expect(MATERIAL_ID_PREFIX["1-2"]).toBe("b12-");
    for (const material of GIFTED_CONFIG["1-2"].catalog.materiale) {
      expect(material.id.startsWith("b12-")).toBe(true);
    }
  });

  it("1–2 materials never show outside S13–S14", () => {
    expect(localWeekMaterials("1-2", 12).materials).toEqual([]);
    expect(localWeekMaterials("1-2", 15).materials).toEqual([]);
  });

  it("readWeekMaterials asks Familie for 1–2 S13 even without a local catalog", async () => {
    const calls: string[] = [];
    const query = {
      select: () => query,
      eq: (column: string, value: unknown) => {
        calls.push(`${column}=${value}`);
        return query;
      },
      order: async () => ({
        data: [
          { id: "b12-s13-m1", banda: "1-2", saptamana: 13, ordine: 1, nume: "Ramă", sursa: "x", pret: null, moneda: null, note: [], doar_acasa: false, materiale_activitati: [{ activity_id: "s13-2-3-z5-mental" }] },
        ],
        error: null,
      }),
      maybeSingle: async () => ({ data: { gratuit: "șosete" }, error: null }),
    };
    const supabase = { from: () => query } as never;
    const result = await readWeekMaterials(supabase, "1-2", 13);
    expect(calls).toContain("banda=1-2");
    expect(result.materials[0].banda).toBe("1-2");
    expect(result.materials[0].id).toBe("b12-s13-m1");
    expect(materialsForActivity(result.materials, "s13-2-3-z5-mental")).toHaveLength(1);
    const none = await readWeekMaterials(supabase, "1-2", 12);
    expect(none.materials).toEqual([]);
  });

  it("applyGiftedCatalog leaves 1–2 live rows alone while the seed is not gifted yet", () => {
    const row = { id: "s13-2-3-z1-fizic", titlu: "Live", nota: "Vârsta 1–2" } as unknown as SeedActivity;
    expect(applyGiftedCatalog([row], "1-2", 13)[0]).toBe(row);
  });

  it("mapDbMaterial keeps the band and falls back to the known product key", () => {
    const mapped = mapDbMaterial({ id: "s3-m3", banda: "2-3", saptamana: 3, ordine: 3, nume: "x", sursa: "x", note: null } as never);
    expect(mapped.banda).toBe("2-3");
    expect(mapped.produs_cheie).toBe("carte-vanatoare-ursi");
  });
});

describe("price display", () => {
  it("never prints „lei lei”", () => {
    expect(formatPrice("41,44 lei", "lei")).toBe("41,44 lei");
    expect(formatPrice("41,44 lei lei", "lei")).toBe("41,44 lei");
    expect(formatPrice("41,44", "lei")).toBe("41,44 lei");
    expect(formatPrice("90,00 lei (de la 108,00)", "lei")).toBe("90,00 lei (de la 108,00)");
    expect(formatPrice(null, "lei")).toBeNull();
    for (const material of allCatalogMaterials("2-3")) {
      expect(formatPrice(material.pret, material.moneda) ?? "").not.toMatch(/lei\s+lei/);
    }
  });
});

describe("stock lists", () => {
  it("has 10 fixed categories, 33 starter items and 18 gifted ones", () => {
    expect(STOC_CATEGORII).toHaveLength(10);
    expect(STARTER_LIST).toHaveLength(33);
    const gifted = GIFTED_STARTER.flatMap((week) => week.items);
    expect(gifted).toHaveLength(18);
    expect(new Set(gifted.map((g) => g.produs_cheie)).size).toBe(18);
    const catalogIds = allCatalogMaterials("2-3").map((m) => m.id).sort();
    expect(gifted.map((g) => g.material_id).sort()).toEqual(catalogIds);
  });

  it("migration keys match the app keys", () => {
    const sql = fs.readFileSync("supabase/migrations/20261117120000_stoc_materiale.sql", "utf8");
    for (const g of GIFTED_STARTER.flatMap((week) => week.items)) {
      expect(sql).toContain(`('${g.material_id}', '${g.produs_cheie}')`);
    }
  });

  it("starter drafts are valid and marked lista_inceput", () => {
    for (const draft of starterDrafts([...STARTER_LIST, ...GIFTED_STARTER.flatMap((w) => w.items)])) {
      expect(validateDraft(draft)).toBeNull();
      expect(draft.sursa).toBe("lista_inceput");
    }
  });
});

describe("stock matching", () => {
  const book = { id: "s3-m3", produs_cheie: "carte-vanatoare-ursi" } as CatalogMaterial;

  it("matches on produs_cheie across bands, then material_id; lost items do not count", () => {
    expect(hasInStock([item({ produs_cheie: "carte-vanatoare-ursi" })], { id: "b12-s14-m1", produs_cheie: "carte-vanatoare-ursi" })).toBe(true);
    expect(hasInStock([item({ material_id: "s3-m3" })], book)).toBe(true);
    expect(hasInStock([item({ produs_cheie: "carte-vanatoare-ursi", stare: "pierdut" })], book)).toBe(false);
    expect(hasInStock([item({ produs_cheie: "alta" })], book)).toBe(false);
  });

  it("reuse summary", () => {
    expect(reuseSummary([item({ produs_cheie: "carte-vanatoare-ursi" })], [book, { id: "y" }], 0)).toBe(
      "1 din 2 materiale le aveți deja · de cumpărat: 0 lei",
    );
  });

  it("category for a catalog material", () => {
    expect(categoryForMaterial({ produs_cheie: "percutie-hape", nume: "x" })).toBe("senzorial");
    expect(categoryForMaterial({ nume: "Găleată mică" })).toBe("apa_nisip");
  });
});

describe("age and form", () => {
  it("age badges", () => {
    expect(ageInMonths("2025-06-11", "2026-11-17")).toBe(17);
    expect(ageInMonths("2025-06-20", "2026-11-17")).toBe(16);
    expect(ageBadge({ varsta_min_luni: 36 }, 17)?.label).toBe("Peste vârsta lui: doar cu adult");
    expect(ageBadge({ varsta_min_luni: 12 }, 17)).toBeNull();
    expect(ageBadge({ varsta_min_luni: null }, 17)?.label).toBe("Vârstă necunoscută: verificați piesele mici");
  });

  it("required fields", () => {
    expect(validateDraft({ nume: "", tip: "cumparat", categorie: "arta" })).toBe("Scrieți numele articolului.");
    expect(validateDraft({ nume: "a", categorie: "arta" })).toMatch(/cumpărat/);
    expect(validateDraft({ nume: "a", tip: "cumparat" })).toBe("Alegeți o categorie.");
    expect(validateDraft({ nume: "a", tip: "facut_acasa", categorie: "arta", varsta_min_luni: 24, varsta_max_luni: 12 })).toMatch(/mai mare/);
    expect(validateDraft({ nume: "a", tip: "facut_acasa", categorie: "arta" })).toBeNull();
  });

  it("unused report skips lost items and recent uses", () => {
    const now = new Date("2026-11-17T12:00:00Z");
    const items = [item({ id: "a" }), item({ id: "b" }), item({ id: "c", stare: "pierdut" })];
    const uses = [{ id: "u", stoc_id: "a", activity_id: "z", family_id: "f", created_at: "2026-11-10T10:00:00Z" }];
    expect(unusedForWeeks(items, uses, now).map((i) => i.id)).toEqual(["b"]);
  });
});
