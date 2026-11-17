import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { liveIdForSeed } from "./catalog-parity";
import {
  allCatalogMaterials,
  applyGiftedCatalog,
  buyCaption,
  listedMaterials,
  localWeekMaterials,
  materialSubtitle,
  materialsForActivity,
  priceAmount,
  showsActivityNote,
  visibleActivityExtras,
} from "./gifted";
import { getSeedActivities } from "./seed/week1";
import type { SeedActivity } from "./types";

type SourceActivity = {
  day: number;
  pillar: string;
  dur: number;
  title: string;
  live_id: string;
  materiale: string;
  baza: string[];
  gata: string;
  plus: string;
  provocare: string;
  siguranta?: string;
};

const source = JSON.parse(
  readFileSync(resolve("content/gifted-s1-s4-data.json"), "utf8"),
) as { weeks: { n: number; activities: SourceActivity[] }[] };

const sourceActivities = source.weeks.flatMap((week) =>
  week.activities.map((activity) => ({ week: week.n, activity })),
);

function migrationSql() {
  const dir = resolve("supabase/migrations");
  return readdirSync(dir)
    .filter((name) => name.includes("gifted_s1s4"))
    .sort()
    .map((name) => ({
      name,
      sql: readFileSync(resolve(dir, name), "utf8"),
    }));
}

describe("gifted S1–S4 catalog", () => {
  test("replaces all 112 live ids, each once, with the source text", () => {
    const rows = [1, 2, 3, 4].flatMap((week) => getSeedActivities(week, "2-3"));
    expect(rows).toHaveLength(112);
    expect(sourceActivities).toHaveLength(112);

    const liveIds = rows.map((row) => liveIdForSeed(row.id, "2-3"));
    expect(new Set(liveIds).size).toBe(112);
    expect(liveIds.slice().sort()).toEqual(
      sourceActivities.map((item) => item.activity.live_id).sort(),
    );

    for (const { week, activity } of sourceActivities) {
      const row = rows.find((item) => item.id === activity.live_id.replace("-b23-", "-2-3-"));
      expect(row, activity.live_id).toBeTruthy();
      expect(row?.saptamana).toBe(week);
      expect(row?.zi).toBe(activity.day);
      expect(row?.pilon).toBe(activity.pillar);
      expect(row?.titlu).toBe(activity.title);
      expect(row?.durata_min).toBe(activity.dur);
      expect(row?.materiale).toEqual([activity.materiale]);
      expect(row?.pasi).toEqual(activity.baza);
      expect(row?.pasi).toHaveLength(4);
      expect(row?.gata_cand).toBe(activity.gata);
      expect(row?.pas_in_plus).toBe(activity.plus);
      expect(row?.provocare).toBe(activity.provocare);
      expect(row?.siguranta ?? "").toBe(activity.siguranta ?? "");
    }
  });

  test("leaves every other catalog row without the new steps", () => {
    const later = getSeedActivities(5, "2-3");
    expect(later).toHaveLength(28);
    expect(later.find((row) => row.id === "s5-2-3-z1-fizic")?.titlu).toBe(
      "Plimbare după culoare",
    );
    expect(later.every((row) => !row.pas_in_plus && !row.provocare && !row.siguranta)).toBe(
      true,
    );

    const band12 = getSeedActivities(1);
    expect(band12.find((row) => row.id === "s1-2-3-z1-fizic")?.titlu).toBe("Pași în curte");
    expect(band12.every((row) => !row.pas_in_plus && !row.provocare && !row.siguranta)).toBe(
      true,
    );

    const s32 = getSeedActivities(32, "2-3");
    expect(s32.find((row) => row.id === "s32-2-3-z1-fizic")?.titlu).toBe(
      "Ținem balonul de sfoară",
    );
    expect(visibleActivityExtras(s32[0] ?? { gata_cand: "x" })).toEqual({
      pasInPlus: false,
      provocare: false,
      gataCand: true,
      siguranta: false,
    });
  });

  test("shows the extra steps only where the row has them", () => {
    const rows = [1, 2, 3, 4].flatMap((week) => getSeedActivities(week, "2-3"));
    expect(rows.every((row) => visibleActivityExtras(row).pasInPlus)).toBe(true);
    expect(rows.every((row) => visibleActivityExtras(row).provocare)).toBe(true);
    expect(rows.every((row) => visibleActivityExtras(row).gataCand)).toBe(true);
    const withSafety = rows.filter((row) => visibleActivityExtras(row).siguranta);
    const withoutSafety = rows.filter((row) => !visibleActivityExtras(row).siguranta);
    expect(withSafety.length).toBeGreaterThan(0);
    expect(withoutSafety.length).toBeGreaterThan(0);
    expect(withSafety.length + withoutSafety.length).toBe(112);

    expect(
      visibleActivityExtras({
        gata_cand: "Gata.",
        pas_in_plus: "   ",
        provocare: "",
        siguranta: null,
      }),
    ).toEqual({
      pasInPlus: false,
      provocare: false,
      gataCand: true,
      siguranta: false,
    });
  });

  test("puts the 18 materials on S1–S4 only, with home first and a dated price", () => {
    const all = allCatalogMaterials();
    expect(all).toHaveLength(18);
    expect(all.every((material) => material.banda === "2-3")).toBe(true);
    expect(new Set(all.map((material) => material.saptamana))).toEqual(
      new Set([1, 2, 3, 4]),
    );
    for (const week of [1, 2, 3, 4]) {
      const bundle = localWeekMaterials("2-3", week);
      expect(bundle.materials.length).toBeGreaterThan(0);
      expect(bundle.gratuit).toBeTruthy();
      expect(bundle.materials.every((material) => material.acasa.length > 0)).toBe(true);
    }
    expect(localWeekMaterials("2-3", 5).materials).toEqual([]);
    expect(localWeekMaterials("1-2", 1).materials).toEqual([]);

    const book = all.find((material) => material.id === "s1-m1");
    expect(book?.nume).toBe("„Ce facem toamna?”");
    expect(buyCaption(book!)).toBe("41,44 lei · văzut pe 16.11.2026");
    expect(book?.acasa[0]?.tip).toBe("print");
    expect(priceAmount(book?.pret ?? null)).toBeCloseTo(41.44);

    const homeOnly = all.find((material) => material.id === "s1-m4");
    expect(homeOnly?.doar_acasa).toBe(true);
    expect(homeOnly?.link).toBeNull();
    expect(buyCaption(homeOnly!)).toBeNull();
    expect(homeOnly?.acasa.length).toBeGreaterThan(0);

    const linked = materialsForActivity(all, "s1-b23-z2-mental");
    expect(linked.map((material) => material.id)).toEqual(["s1-m1"]);
    expect(materialsForActivity(all, "s1-2-3-z2-mental").map((material) => material.id)).toEqual([
      "s1-m1",
    ]);
    const known = new Set(
      [1, 2, 3, 4].flatMap((week) =>
        getSeedActivities(week, "2-3").map((row) => liveIdForSeed(row.id, "2-3")),
      ),
    );
    for (const material of all) {
      expect(material.activitati.length).toBeGreaterThan(0);
      for (const activityId of material.activitati) {
        expect(known.has(activityId), activityId).toBe(true);
      }
    }
  });

  test("overlays local gifted text when the database row has no new column yet", () => {
    const old: SeedActivity = {
      id: "s1-b23-z1-mental",
      banda: "2-3",
      saptamana: 1,
      zi: 1,
      pilon: "mental",
      titlu: "Trei locuri din casă",
      durata_min: 5,
      mod_default: "A",
      materiale: ["ușă"],
      pasi: ["Arătați trei locuri."],
      gata_cand: "A auzit.",
      tema_saptamana: "Casa și curtea",
    };
    const overlaid = applyGiftedCatalog([old], "2-3", 1);
    expect(overlaid[0]?.id).toBe("s1-b23-z1-mental");
    expect(overlaid[0]?.titlu).toBe("Turul casei: ce e și la ce folosește");
    expect(overlaid[0]?.pasi).toHaveLength(4);
    expect(overlaid[0]?.pas_in_plus?.length).toBeGreaterThan(0);
    expect(overlaid[0]?.tema_saptamana).toBe("Casa și curtea");
    expect(overlaid[0]?.nota).toBeNull();

    const already = applyGiftedCatalog(
      [{ ...old, titlu: "Din bază", pas_in_plus: "Deja scris." }],
      "2-3",
      1,
    );
    expect(already[0]?.titlu).toBe("Din bază");

    const otherWeek = applyGiftedCatalog([old], "2-3", 5);
    expect(otherWeek[0]?.titlu).toBe("Trei locuri din casă");
    const otherBand = applyGiftedCatalog([{ ...old, banda: "1-2" }], "1-2", 1);
    expect(otherBand[0]?.titlu).toBe("Trei locuri din casă");
  });

  test("migrations are additive, ordered, and the rollback is not auto-applied", () => {
    const files = migrationSql();
    expect(files.map((file) => file.name)).toEqual([
      "20261116105922_gifted_s1s4_schema.sql",
      "20261116110022_gifted_s1s4_continut.sql",
      "20261117080400_gifted_s1s4_retusuri.sql",
    ]);
    const names = readdirSync(resolve("supabase/migrations")).sort();
    const previous = names.filter((name) => name < files[0]!.name);
    expect(previous.at(-1)).toBe("20261109234500_t5b_texte_aprobate.sql");

    const sql = files.map((file) => file.sql).join("\n");
    const withoutTempDrop = sql.replace(/on commit drop/gi, "");
    expect(withoutTempDrop).not.toMatch(/\bDROP\b/);
    expect(sql).toMatch(/create temporary table gifted_plan \([\s\S]*?\) on commit drop;/);
    expect(sql).not.toMatch(/\bDELETE\b/);
    expect(sql).not.toMatch(/\balter\s+column\b/i);
    expect(sql).toContain("pas_in_plus");
    expect(sql).toContain("backup_20261116_gifted_s1s4");
    expect(sql).toContain("enable row level security");
    expect(sql).toMatch(/banda = '2-3'/);
    expect(sql).toContain("raise exception");

    const content = files[1]!.sql;
    const ids = content.match(/s[1-4]-b23-z[1-7]-(?:fizic|mental|resurse|social)/g) ?? [];
    expect(new Set(ids).size).toBe(112);

    const rollback = readFileSync(
      resolve("supabase/rollback/20261116110022_gifted_s1s4_rollback.sql"),
      "utf8",
    );
    expect(rollback).toContain("backup_20261116_gifted_s1s4");
    expect(rollback).toContain("NU se aplică automat");
    expect(readdirSync(resolve("supabase/migrations")).some((name) => name.includes("rollback"))).toBe(
      false,
    );

    const backup = JSON.parse(
      readFileSync(resolve("docs/backup/live-2-3-S1-S4-backup-20261116.json"), "utf8"),
    ) as { id: string; titlu: string; pasi: string[] }[];
    expect(backup).toHaveLength(112);
    expect(new Set(backup.map((row) => row.id)).size).toBe(112);
    for (const row of backup) {
      expect(content).toContain(row.titlu);
      expect(content).toContain(row.pasi[0]!);
    }
    for (const { activity } of sourceActivities) {
      expect(content).toContain(activity.title);
    }
  });

  test("material texts carry no markdown bold markers", () => {
    const catalog = readFileSync(
      resolve("content/materiale-s1-s4-banda-2-3.json"),
      "utf8",
    );
    const migration = readFileSync(
      resolve("supabase/migrations/20261116110022_gifted_s1s4_continut.sql"),
      "utf8",
    );
    expect(catalog).not.toContain("**");
    expect(migration).not.toContain("**");
    for (const file of [
      "content/seed-s1-banda-2-3-v2.json",
      "content/seed-s2-s4-banda-2-3-v2.json",
    ]) {
      expect(readFileSync(resolve(file), "utf8")).not.toContain("**");
    }

    const cylinders = allCatalogMaterials().find((material) => material.id === "s3-m2");
    expect(cylinders?.link).toBe(
      "https://www.edudrag.ro/jucarii-educative/tamburina-girafa-719.html",
    );
    expect(cylinders?.varsta).toBe("3 ani+, peste vârsta lui Cezar");
    expect(cylinders?.detaliu_pret).toContain("Vârsta: 3 ani+, peste vârsta lui Cezar.");
    expect(cylinders?.detaliu_pret).not.toContain("**");
  });

  test("S1–S4 on band 2–3 have an empty note; other rows keep theirs", () => {
    const gifted = [1, 2, 3, 4].flatMap((week) => getSeedActivities(week, "2-3"));
    expect(gifted.every((row) => !showsActivityNote(row.nota))).toBe(true);
    expect(showsActivityNote(null)).toBe(false);
    expect(showsActivityNote("  ")).toBe(false);
    expect(showsActivityNote("Vârsta 2–3: scurt.")).toBe(true);

    const later = getSeedActivities(5, "2-3");
    expect(later.every((row) => showsActivityNote(row.nota))).toBe(true);
    expect(later[0]?.nota).toBe(
      "Vârsta 2–3: scurt, fără forțare; el poate refuza. Extensia e opțională.",
    );

    const band12 = getSeedActivities(1);
    expect(band12.find((row) => row.id === "s1-2-3-z1-fizic")?.nota).toBe(
      "Vârsta 1–2: scurt, fără forțare; el poate refuza.",
    );

    const cleared = applyGiftedCatalog(
      [
        {
          id: "s1-b23-z1-mental",
          banda: "2-3",
          saptamana: 1,
          zi: 1,
          pilon: "mental",
          titlu: "Vechi",
          durata_min: 5,
          mod_default: "A",
          materiale: [],
          pasi: ["Vechi."],
          gata_cand: "Vechi.",
          tema_saptamana: "Casa și curtea",
          nota: "Vârsta 2–3: scurt, fără forțare; el poate refuza. Extensia e opțională.",
        },
      ],
      "2-3",
      1,
    );
    expect(showsActivityNote(cleared[0]?.nota)).toBe(false);

    const untouched = applyGiftedCatalog(
      [
        {
          id: "s5-b23-z1-fizic",
          banda: "2-3",
          saptamana: 5,
          zi: 1,
          pilon: "fizic",
          titlu: "Plimbare după culoare",
          durata_min: 5,
          mod_default: "A",
          materiale: [],
          pasi: ["Un pas."],
          gata_cand: "Gata.",
          tema_saptamana: "Temă",
          nota: "Vârsta 2–3: scurt, fără forțare; el poate refuza. Extensia e opțională.",
        },
      ],
      "2-3",
      5,
    );
    expect(untouched[0]?.nota).toContain("Vârsta 2–3");

    const sql = readFileSync(
      resolve("supabase/migrations/20261116110022_gifted_s1s4_continut.sql"),
      "utf8",
    );
    expect(sql).toContain("nota = null");
    expect(sql).toContain("snap_nota is distinct from plan.old_nota");
    expect(sql).toContain("and nota is not distinct from plan.old_nota");
    expect(sql).toContain("backup-ul nu are coloana nota");
    const rollback = readFileSync(
      resolve("supabase/rollback/20261116110022_gifted_s1s4_rollback.sql"),
      "utf8",
    );
    expect(rollback).toContain("nota = snap.nota");
    for (const row of gifted) {
      expect(row.nota ?? "").not.toContain("Vârsta 2–3");
    }
  });

  test("material subtitles keep the opening parenthesis", () => {
    const lines = [
      "(colecția „De ce? De ce? De ce?”), Editura Casa",
      "(tamburină, maracas, clapetă), Eurostoc",
      "(6 cilindri de 10 cm), Edudrag",
    ];
    const stored = allCatalogMaterials().map((material) => material.sursa);
    const sql = readFileSync(
      resolve("supabase/migrations/20261116110022_gifted_s1s4_continut.sql"),
      "utf8",
    );
    for (const line of lines) {
      expect(stored).toContain(line);
      expect(materialSubtitle(line)).toBe(line);
      expect(sql).toContain(line);
    }
  });

  test("plain Acasă lines start with a capital; the S4 household list does not", () => {
    const byId = new Map(allCatalogMaterials().map((material) => [material.id, material]));
    expect(byId.get("s1-m2")?.acasa[0]?.linii[0]).toMatch(/^Nu recomand\./);
    expect(byId.get("s2-m1")?.acasa[0]?.linii[0]).toMatch(/^O cană gradată/);
    expect(byId.get("s2-m4")?.acasa[0]?.linii[0]).toMatch(/^Nu se face acasă\./);
    expect(byId.get("s2-m5")?.acasa[0]?.linii[0]).toMatch(/^Nu se face acasă\./);
    expect(byId.get("s3-m3")?.acasa[0]?.linii[0]).toMatch(/^Nu se face acasă\./);
    expect(byId.get("s3-m2")?.link).toBe(
      "https://www.edudrag.ro/jucarii-educative/tamburina-girafa-719.html",
    );
    expect(localWeekMaterials("2-3", 4).gratuit).toContain("linguri și teluri");
    expect(localWeekMaterials("2-3", 4).gratuit?.startsWith("Linguri")).toBe(false);
  });

  test("two approved wording fixes stay in the new text only", () => {
    const rows = getSeedActivities(2, "2-3");
    expect(rows.find((row) => row.id === "s2-2-3-z3-mental")?.pas_in_plus).toBe(
      "Cine ia cea mai multă apă: stoarceți fiecare obiect într-un pahar și comparați.",
    );
    expect(rows.find((row) => row.id === "s2-2-3-z3-fizic")?.gata_cand).toBe(
      "A mutat apa dintr-un bol în altul prin stoarcere, de cel puțin 4 ori.",
    );
    const sql = readFileSync(
      resolve("supabase/migrations/20261116110022_gifted_s1s4_continut.sql"),
      "utf8",
    );
    expect(sql).toContain("stoarceți fiecare obiect");
    expect(sql).toContain("prin stoarcere, de cel puțin 4 ori.");
    expect(sql).not.toContain("storceți");
    expect(sql).toContain("Stropi pe mână");
  });

  test("„niciunul” is shown as no extra materials", () => {
    const rows = [1, 2, 3, 4].flatMap((week) => getSeedActivities(week, "2-3"));
    const none = rows.filter((row) => row.materiale.length === 1 && row.materiale[0] === "niciunul");
    expect(none).toHaveLength(7);
    expect(none.every((row) => listedMaterials(row.materiale).length === 0)).toBe(true);
    expect(listedMaterials(["niciunul sau o tobă"])).toEqual(["niciunul sau o tobă"]);
    expect(listedMaterials([])).toEqual([]);
  });
});
