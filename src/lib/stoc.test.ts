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
  minAgeForMaterial,
  parseMinAgeMonths,
  saveManualItem,
  STOC_PHOTO_FAILED,
  StocPhotoError,
  STOC_SAFETY_NOTE,
  reuseSummary,
  STARTER_LIST,
  starterDrafts,
  STOC_CATEGORII,
  unusedForWeeks,
  validateDraft,
  type StocItem,
} from "@/lib/stoc";
import { getSeedActivities } from "@/lib/seed/week1";
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

  it("applyGiftedCatalog overlays the gifted 1–2 seed on the same live ids, not on S12", () => {
    const row = { id: "s13-2-3-z1-fizic", titlu: "Live", nota: "Vârsta 1–2" } as unknown as SeedActivity;
    const out = applyGiftedCatalog([row], "1-2", 13)[0];
    expect(out.id).toBe("s13-2-3-z1-fizic");
    expect(out.titlu).toBe("Haina pe umeri, mâna prin mânecă");
    expect(out.pas_in_plus?.trim()).toBeTruthy();
    expect(out.nota).toBeNull();
    const s12 = { id: "s12-2-3-z1-fizic", titlu: "Live" } as unknown as SeedActivity;
    expect(applyGiftedCatalog([s12], "1-2", 12)[0]).toBe(s12);
  });

  it("1–2 S13–S14 catalog: 11 materials, b12- ids, Cristina's keys, links to 56 live ids only", () => {
    const all = allCatalogMaterials("1-2");
    expect(all).toHaveLength(11);
    expect(localWeekMaterials("1-2", 13).materials).toHaveLength(5);
    expect(localWeekMaterials("1-2", 14).materials).toHaveLength(6);
    const keys = new Set(all.map((m) => m.produs_cheie));
    for (const key of ["galeata-si-lopatica", "cos-de-la-usa-diy", "cartea-lui-cezar-print", "toba-cratita"]) {
      expect(keys.has(key)).toBe(true);
    }
    for (const material of all) {
      expect(material.id).toMatch(/^b12-s1[34]-m\d$/);
      expect(material.activitati.every((id) => /^s1[34]-2-3-z[1-7]-[a-z]+$/.test(id))).toBe(true);
      expect(material.categorie && STOC_CATEGORII.some((c) => c.key === material.categorie)).toBe(true);
      expect(JSON.stringify(material)).not.toMatch(/\*\*|[şţŞŢ]/);
    }
  });

  it("1–2 seed S13–S14 has tiers on all 56 rows and no age note", () => {
    const rows = [13, 14].flatMap((week) => getSeedActivities(week, "1-2"));
    expect(rows).toHaveLength(56);
    for (const row of rows) {
      expect(row.pasi).toHaveLength(4);
      expect(row.pas_in_plus?.trim() && row.provocare?.trim() && row.gata_cand.trim()).toBeTruthy();
      expect(row.nota).toBeNull();
    }
    expect(getSeedActivities(15, "1-2").every((row) => !row.pas_in_plus)).toBe(true);
  });

  it("starter items share Cristina's keys, so a ticked bucket covers b12-s14-m4", () => {
    const bucket = STARTER_LIST.find((s) => s.nume === "Găleată și lopățică");
    expect(bucket?.produs_cheie).toBe("galeata-si-lopatica");
    expect(STARTER_LIST.find((s) => s.nume === "Păpușă sau ursuleț")?.produs_cheie).toBe("ursulet-papusa");
    const m4 = allCatalogMaterials("1-2").find((m) => m.id === "b12-s14-m4")!;
    expect(hasInStock([item({ produs_cheie: bucket!.produs_cheie! })], m4)).toBe(true);
    expect(categoryForMaterial(m4)).toBe("apa_nisip");
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

describe("catalog age and safety text", () => {
  it("age text: the lowest number anywhere, in months", () => {
    expect(parseMinAgeMonths("2–4 ani")).toBe(24);
    expect(parseMinAgeMonths("0–1, 1–3, 3–5 ani")).toBe(0);
    expect(parseMinAgeMonths("1–3 ani și 3–5 ani")).toBe(12);
    expect(parseMinAgeMonths("1 an+")).toBe(12);
    expect(parseMinAgeMonths("peste 1 an")).toBe(12);
    expect(parseMinAgeMonths("de la 18 luni")).toBe(18);
    expect(parseMinAgeMonths("1 lună")).toBe(1);
    expect(parseMinAgeMonths("18 luni – 3 ani")).toBe(18);
    expect(parseMinAgeMonths("12 luni+")).toBe(12);
    expect(parseMinAgeMonths("3 animale, 2 ani")).toBe(24);
    expect(parseMinAgeMonths("3–10 ani, peste vârsta lui Cezar; pagina spune „nu este recomandat copiilor sub 3 ani”")).toBe(36);
    expect(parseMinAgeMonths(null)).toBeNull();
    expect(parseMinAgeMonths("fără vârstă")).toBeNull();
  });

  it("explicit catalog ages for the 18 gifted materials; no band guess", () => {
    const expected: Record<string, number> = {
      "s1-m1": 24, "s1-m2": 12, "s1-m3": 12, "s1-m4": 12, "s2-m1": 12, "s2-m2": 36,
      "s2-m3": 24, "s2-m4": 24, "s2-m5": 12, "s3-m1": 12, "s3-m2": 36, "s3-m3": 12,
      "s3-m4": 12, "s4-m1": 12, "s4-m2": 36, "s4-m3": 36, "s4-m4": 24, "s4-m5": 24,
    };
    for (const material of allCatalogMaterials("2-3")) {
      expect(material.varsta_min_luni, material.id).toBe(expected[material.id]);
      expect(minAgeForMaterial(material), material.id).toBe(expected[material.id]);
    }
    for (const g of GIFTED_STARTER.flatMap((w) => w.items)) {
      expect(g.varsta_min_luni, g.material_id).toBe(expected[g.material_id!]);
    }
    // „Mergem la vânătoare de urși”: 12, not 36 from „3–5 ani”.
    expect(minAgeForMaterial(allCatalogMaterials("2-3").find((m) => m.id === "s3-m3"))).toBe(12);
    // The 11 home materials for 1–2 S13–S14: 12 months, never unknown.
    const b12 = allCatalogMaterials("1-2");
    expect(b12).toHaveLength(11);
    for (const material of b12) expect(minAgeForMaterial(material), material.id).toBe(12);
    expect(minAgeForMaterial({ varsta: null })).toBeNull();
  });

  it("starter list: no low coat rack, a low step instead; ages per QA", () => {
    expect(STARTER_LIST).toHaveLength(33);
    expect(STARTER_LIST.some((s) => /Cuier/.test(s.nume))).toBe(false);
    const step = STARTER_LIST.find((s) => s.nume === "Treaptă joasă");
    expect(step).toMatchObject({ categorie: "miscare", varsta_min_luni: 12 });
    const age = (nume: string) => STARTER_LIST.find((s) => s.nume.startsWith(nume))?.varsta_min_luni;
    expect(age("Tunel textil")).toBe(18);
    expect(age("Burete mare")).toBe(18);
    expect(age("Mătură și făraș")).toBe(18);
    expect(age("Aluat de jucat")).toBe(24);
    expect(age("Set de bucătărie")).toBe(36);
    expect(age("Creioane cerate groase")).toBe(36);
    const special = ["Tunel", "Burete", "Mătură", "Aluat", "Set de bucătărie", "Creioane"];
    for (const item of STARTER_LIST.filter((s) => !special.some((p) => s.nume.startsWith(p)))) {
      expect(item.varsta_min_luni, item.nume).toBe(12);
    }
  });

  it("safety note spells șnururi", () => {
    expect(STOC_SAFETY_NOTE).toContain("șnururi");
  });

  it("home-made 1–2 materials have no buy link", () => {
    expect(allCatalogMaterials("1-2").every((m) => m.doar_acasa && !m.link)).toBe(true);
  });
});

describe("photo retry", () => {
  const draft = { nume: "Tobă", tip: "cumparat", categorie: "senzorial", sursa: "manual" } as const;
  const photo = {} as File;

  it("a failed photo after save leaves one row; retry only re-uploads", async () => {
    const rows: StocItem[] = [];
    let uploads = 0;
    let failPhoto = true;
    const addItems = async () => {
      const saved = item({ id: `row-${rows.length + 1}` });
      rows.push(saved);
      if (failPhoto) throw new StocPhotoError(saved);
      return [saved];
    };
    const setPhoto = async (id: string) => {
      expect(id).toBe("row-1");
      uploads += 1;
    };
    const first = await saveManualItem({ savedId: null, draft, photo, addItems, setPhoto });
    expect(first).toEqual({ savedId: "row-1", error: "Articolul s-a salvat, dar poza nu s-a încărcat. Încercați din nou." });
    failPhoto = false;
    const second = await saveManualItem({ savedId: first.savedId, draft, photo, addItems, setPhoto });
    expect(second).toEqual({ savedId: null, error: null });
    expect(rows).toHaveLength(1);
    expect(uploads).toBe(1);
  });

  it("a failed retry keeps the saved id and still does not insert", async () => {
    let inserts = 0;
    const result = await saveManualItem({
      savedId: "row-1",
      draft,
      photo,
      addItems: async () => {
        inserts += 1;
        return [];
      },
      setPhoto: async () => {
        throw new Error(STOC_PHOTO_FAILED);
      },
    });
    expect(result).toEqual({ savedId: "row-1", error: STOC_PHOTO_FAILED });
    expect(inserts).toBe(0);
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
    const old = "2026-09-01T10:00:00Z";
    const items = [
      item({ id: "a", created_at: old }),
      item({ id: "b", created_at: old }),
      item({ id: "c", stare: "pierdut", created_at: old }),
      item({ id: "d" }),
    ];
    const uses = [{ id: "u", stoc_id: "a", activity_id: "z", family_id: "f", created_at: "2026-11-10T10:00:00Z" }];
    expect(unusedForWeeks(items, uses, now).map((i) => i.id)).toEqual(["b"]);
  });
});

describe("stock errors are Romanian", () => {
  it("stoc-context never shows a raw Supabase message", () => {
    const source = fs.readFileSync("src/lib/stoc-context.tsx", "utf8");
    expect(source).not.toMatch(/new Error\((?:error|upload\.error|updated\.error)\.message\)/);
    expect(source).not.toMatch(/\.message\)/);
  });

  it("stock rollback allows the bucket delete Familie guards", () => {
    const sql = fs.readFileSync("supabase/rollback/20261117120000_stoc_materiale_rollback.sql", "utf8");
    expect(sql.indexOf("set local storage.allow_delete_query = 'true';")).toBeGreaterThan(sql.indexOf("begin;"));
  });
});
