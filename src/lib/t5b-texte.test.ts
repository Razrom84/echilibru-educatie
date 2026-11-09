import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { seedIdForLive } from "./catalog-parity";
import { getSeedActivities } from "./seed/week1";
import type { SeedActivity } from "./types";

type LiveRow = {
  id: string;
  banda: "1-2" | "2-3";
  saptamana: number;
  titlu: string;
  materiale: string[];
  pasi: string[];
  gata_cand: string;
  nota: string | null;
  tema_saptamana: string;
};

const LIVE = JSON.parse(
  readFileSync(resolve("src/lib/fixtures/t5b-live.json"), "utf8"),
) as LiveRow[];

const A_STEP1: Record<string, string> = {
  "s9-2-3-z1-mental":
    "Stați pe loc afară sau la fereastră deschisă. Țineți-l în brațe sau de mână.",
  "s1-b23-z2-fizic":
    "Mergeți la o zonă (de exemplu iarbă sau hol), stați 20 de secunde. Pe balcon, țineți-l de mână.",
  "s3-b23-z1-fizic":
    "Ieșiți scurt; stați pe loc și ascultați aproximativ 1–2 minute. Pe balcon, țineți-l de mână.",
  "s5-b23-z6-fizic":
    "Stați afară sau la fereastră 30–60 de secunde. Rămâneți lângă el; pe balcon sau la fereastră deschisă, țineți-l de mână.",
  "s9-b23-z5-fizic":
    "Parcurgeți: de la interior până la ușă/fereastră deschisă. La fereastră, țineți-l de mână.",
  "s9-b23-z6-fizic":
    "Stați afară sau la fereastră 30–60 de secunde. Rămâneți lângă el; pe balcon sau la fereastră deschisă, țineți-l de mână.",
  "s9-b23-z7-mental":
    "Întrebați: „Îți place vântul sau liniștea?” — arătați ambele (fereastră deschisă / închisă). La fereastra deschisă, rămâneți lângă el.",
  "s10-b23-z6-fizic":
    "Colectați 2–3 lucruri sigure (frunză, piatră mare, jucărie). Pe balcon, rămâneți lângă el.",
  "s12-b23-z6-fizic":
    "Ieșiți 20–30 de secunde: „Rece afară.” Pe balcon, țineți-l de mână.",
  "s13-b23-z6-fizic":
    "Îmbrăcați-l, ieșiți 20–30 de secunde: „Rece afară.” Pe balcon, țineți-l de mână.",
  "s14-b23-z6-fizic":
    "Mergeți liber 30–60 de secunde: „Mergem.” Pe balcon, rămâneți lângă el.",
  "s17-b23-z1-fizic":
    "Ieșiți împreună 2–3 minute. Stați pe loc: „Urechi. Ascultăm.” Pe balcon, țineți-l de mână.",
  "s17-b23-z6-fizic":
    "Ieșiți 20–40 de secunde: „Uite. Ascultăm.” Pe balcon, țineți-l de mână.",
  "s30-b23-z1-fizic":
    "Stați liniștiți: „Uite. Privim.” — 30–60 secunde. La fereastra deschisă, țineți-l de mână.",
  "s41-b23-z6-fizic":
    "Mergeți liber 30–60 de secunde: „Mergem.” Pe balcon, rămâneți lângă el.",
  "s43-b23-z6-fizic":
    "Colectați 2–3 lucruri sigure (frunză, piatră mare, jucărie). Pe balcon, rămâneți lângă el.",
  "s51-b23-z1-fizic":
    "Mergeți pe drumul pe care îl știți: „Drum.” Pe balcon, rămâneți lângă el.",
};

const B_STEP1: Record<string, string> = {
  "s4-2-3-z4-resurse": "Ștergeți masa cu mișcări scurte.",
  "s15-2-3-z4-resurse": "După masă, duceți paharul la chiuvetă împreună.",
  "s15-2-3-z4-social": "La masă, după o înghițitură: „Mulțumesc.”",
  "s23-2-3-z1-resurse": "Puneți pâinea pe masă. După mirosit, puneți-o la loc.",
  "s46-2-3-z5-social": "Voi arătați scaunul, apoi masa, pe scurt.",
  "s5-b23-z6-mental":
    "Așezați trei pe masă: „Una. Două. Trei.” Numiți fiecare culoare.",
  "s8-b23-z6-mental":
    "Puneți-le pe masă și atingeți-le pe rând: „Frunză. Piatră. Pământ.”",
  "s10-b23-z6-mental": "Așezați pe masă: „Una. Două. Trei.” — trei grămezi.",
  "s42-b23-z6-mental":
    "Puneți-le pe masă și atingeți-le pe rând: „Frunză. Piatră. Pământ.”",
  "s43-b23-z6-mental": "Așezați pe masă: „Una. Două. Trei.” — trei grămezi.",
  "s46-b23-z2-mental":
    "Puneți-le pe masă. Arătați aproape: „Asta.” Apoi departe: „Aia.”",
  "s52-b23-z4-resurse": "Puneți-le pe masă: „Trei. Alege favorita.”",
};

const D_STEP2: Record<string, string> = {
  "s14-b23-z6-fizic": "Alegeți un reper și opriți-vă: „Ne oprim.”",
  "s41-b23-z6-fizic": "Alegeți un reper spre poartă și opriți-vă: „Ne oprim.”",
};

function seedOf(row: LiveRow): SeedActivity {
  const seedId = seedIdForLive(row.id, row.banda);
  const found = getSeedActivities(row.saptamana, row.banda).find(
    (activity) => activity.id === seedId,
  );
  expect(found, row.id).toBeTruthy();
  return found!;
}

function newTexts(): string[] {
  return [
    ...Object.values(A_STEP1),
    ...Object.values(B_STEP1),
    "Carte cu mâncare",
    "Aprindem lumina, ne spălăm pe mâini",
    "Seara, aprindeți împreună lumina din baie: „Lumină.”",
    "Spălați mâinile pe scurt împreună: „Mâini. Apă.” fără grabă.",
    "Intrăm, insecta rămâne afară",
    "Intrați din curte. Închideți ușa împreună, încet. Aveți grijă la degete.",
    "„Ușă. Insecta rămâne afară.”",
    ...Object.values(D_STEP2),
    "A stat afară pe scurt și a ascultat.",
    "3 obiecte preferate",
    "Mergem, ne oprim, pornim iar",
    "„Ne oprim” — stați; „Hai” — porniți din nou.",
    "A legat „mergem”, „ne oprim” și „hai” de mișcare.",
    "Salut — facem cu mâna",
    "Rămâneți la alegerea lui.",
  ];
}

describe("T5b texte aprobate", () => {
  test("32 de id-uri, cu câmpurile din A, B, C și D", () => {
    expect(LIVE).toHaveLength(32);
    expect(Object.keys(A_STEP1)).toHaveLength(17);
    expect(Object.keys(B_STEP1)).toHaveLength(12);
    expect(Object.keys(D_STEP2)).toHaveLength(2);
    const ids = new Set([
      ...Object.keys(A_STEP1),
      ...Object.keys(B_STEP1),
      "s15-2-3-z7-mental",
      "s25-2-3-z5-fizic",
      "s36-2-3-z4-resurse",
    ]);
    expect(ids.size).toBe(32);
    expect(LIVE.map((row) => row.id).sort()).toEqual([...ids].sort());
  });

  test("catalogul local are textul nou, iar câmpurile neatinse rămân ca în live", () => {
    for (const row of LIVE) {
      const seed = seedOf(row);
      const step1 = A_STEP1[row.id] ?? B_STEP1[row.id];
      const rewroteSteps =
        row.id === "s25-2-3-z5-fizic" || row.id === "s36-2-3-z4-resurse";
      if (step1) expect(seed.pasi[0], row.id).toBe(step1);
      else if (!rewroteSteps) expect(seed.pasi[0], row.id).toBe(row.pasi[0]);

      if (row.id === "s15-2-3-z7-mental") {
        expect(seed.titlu).toBe("Carte cu mâncare");
      } else if (row.id === "s25-2-3-z5-fizic") {
        expect(seed.titlu).toBe("Aprindem lumina, ne spălăm pe mâini");
        expect(seed.pasi).toEqual([
          "Seara, aprindeți împreună lumina din baie: „Lumină.”",
          "Spălați mâinile pe scurt împreună: „Mâini. Apă.” fără grabă.",
        ]);
      } else if (row.id === "s36-2-3-z4-resurse") {
        expect(seed.titlu).toBe("Intrăm, insecta rămâne afară");
        expect(seed.pasi).toEqual([
          "Intrați din curte. Închideți ușa împreună, încet. Aveți grijă la degete.",
          "„Ușă. Insecta rămâne afară.”",
        ]);
      } else {
        expect(seed.titlu, row.id).toBe(row.titlu);
      }

      const step2 = D_STEP2[row.id];
      if (step2) {
        expect(seed.pasi[1], row.id).toBe(step2);
        expect(seed.pasi.slice(2), row.id).toEqual(row.pasi.slice(2));
      } else if (row.id !== "s25-2-3-z5-fizic" && row.id !== "s36-2-3-z4-resurse") {
        expect(seed.pasi.slice(1), row.id).toEqual(row.pasi.slice(1));
      }

      if (row.id === "s17-b23-z1-fizic") {
        expect(seed.gata_cand).toBe("A stat afară pe scurt și a ascultat.");
      } else if (row.id !== "s25-2-3-z5-fizic" && row.id !== "s36-2-3-z4-resurse") {
        expect(seed.gata_cand, row.id).toBe(row.gata_cand);
      } else {
        expect(seed.gata_cand, row.id).toBe(row.gata_cand);
      }

      if (row.id === "s52-b23-z4-resurse") {
        expect(seed.materiale).toEqual(["3 obiecte preferate"]);
      } else {
        expect(seed.materiale, row.id).toEqual(row.materiale);
      }
      expect(seed.nota ?? null, row.id).toBe(row.nota);
      expect(seed.tema_saptamana, row.id).toBe(row.tema_saptamana);
    }
  });

  test("textele noi nu au „Oprim.” fără „ne”", () => {
    for (const text of newTexts()) {
      const rest = text.replace(/ne oprim/gi, "");
      expect(rest, text).not.toMatch(/Oprim\./);
      expect(rest, text).not.toMatch(/\boprim\b/i);
    }
  });

  test("migrarea T5b păzește id-ul, banda și textul vechi și e idempotentă", () => {
    const sql = readFileSync(
      resolve("supabase/migrations/20261109234500_t5b_texte_aprobate.sql"),
      "utf8",
    );
    expect(sql).toMatch(/and banda = /);
    expect(sql).toMatch(/nu e textul live și nici cel nou/);
    expect(sql).toMatch(/is distinct from/);
    const ids = [...sql.matchAll(/where id = '([^']+)' and banda = '([^']+)'/g)];
    const unique = new Set(ids.map((match) => `${match[2]}:${match[1]}`));
    expect(unique.size).toBe(32);
    expect([...unique].filter((key) => key.startsWith("1-2:")).length).toBe(9);
    expect([...unique].filter((key) => key.startsWith("2-3:")).length).toBe(23);
  });
});

describe("T5 rânduri reluate după textul live", () => {
  test("s45-b23-z5-mental: titlu, pasul 2 și gata când", () => {
    const row = getSeedActivities(45, "2-3").find(
      (activity) => activity.id === "s45-2-3-z5-mental",
    );
    expect(row?.titlu).toBe("Mergem, ne oprim, pornim iar");
    expect(row?.pasi[0]).toBe("Spuneți: „Mergem” și mergeți.");
    expect(row?.pasi[1]).toBe("„Ne oprim” — stați; „Hai” — porniți din nou.");
    expect(row?.pasi[2]).toBe(
      "Dacă vrea: el spune unul din cele trei cuvinte (sau arată).",
    );
    expect(row?.gata_cand).toBe(
      "A legat „mergem”, „ne oprim” și „hai” de mișcare.",
    );
  });

  test("s48-b23-z1-fizic: titlul nou, pașii neschimbați", () => {
    const row = getSeedActivities(48, "2-3").find(
      (activity) => activity.id === "s48-2-3-z1-fizic",
    );
    expect(row?.titlu).toBe("Salut — facem cu mâna");
    expect(row?.pasi.join("\n")).not.toContain("unda mâinii");
    expect(row?.pasi).toEqual([
      "Modelați unda: „Bună.” — mâna se mișcă.",
      "El încearcă unda (sau privește) — fără forțare.",
      "Dacă vrea: alege formula — bună sau salut (cu același gest).",
    ]);
  });

  test("s48-b23-z7-mental: titlul și pasul 1 rămân live, pasul 2 se îndreaptă", () => {
    const row = getSeedActivities(48, "2-3").find(
      (activity) => activity.id === "s48-2-3-z7-mental",
    );
    expect(row?.titlu).toBe("Favoritul: bună, salut sau la revedere?");
    expect(row?.pasi[0]).toBe(
      "Întrebați: „Îți place bună, salut sau la revedere?” — gesturi.",
    );
    expect(row?.pasi[1]).toBe("Rămâneți la alegerea lui.");
    expect(row?.pasi[2]).toBe("Dacă vrea: o rundă scurtă doar pe favorit.");
    const sql = readFileSync(
      resolve("supabase/migrations/20261109233000_t5_formulari_p3.sql"),
      "utf8",
    );
    expect(sql).not.toContain("bună, bună");
    expect(sql).toContain("Favoritul: bună, salut sau la revedere?");
    expect(sql).toContain("Rămâneți la alegerea lui.");
    expect(sql).toContain("Salut — facem cu mâna");
    expect(sql).toContain("Mergem, ne oprim, pornim iar");
    expect(sql).not.toContain("Pași, ne oprim, hai — pe corpul puternic");
    expect(sql).not.toContain("unda mâinii");
  });
});
