import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { copyBlob, loadBanda23SeedActivities } from "./en-banda-23-scanner";
import { getSeedActivities } from "./seed/week1";

const MIGRATION = "supabase/migrations/20260920280000_align_banda_23_p1_p2_orto.sql";

const P1: Record<
  string,
  { titlu: string; tema: string; materiale: string[]; pasi: string[]; gata_cand: string }
> = {
  "s2-2-3-z4-resurse": {
    titlu: "Paharul la loc pe masă",
    tema: "Apa în casă și afară",
    materiale: ["pahar", "masă"],
    pasi: ["Luați paharul.", "Puneți-l pe masă: „La loc. Masă.”"],
    gata_cand: "Paharul e pe masă.",
  },
  "s28-2-3-z5-resurse": {
    titlu: "Cizmele curate lângă ușă",
    tema: "Dezgheț și noroi",
    materiale: ["cizme"],
    pasi: ["După șters: puneți cizmele lângă ușă.", "„Cizme. Ușă.”"],
    gata_cand: "Cizmele curate sunt lângă ușă.",
  },
  "s31-2-3-z2-resurse": {
    titlu: "Paharul după semințe — la loc",
    tema: "Semințe și udat",
    materiale: ["pahar"],
    pasi: ["După udatul semințelor: „La loc.”", "„Semințe. Gata.”"],
    gata_cand: "Paharul e la loc după semințe.",
  },
  "s34-2-3-z2-resurse": {
    titlu: "Cutia cu frunză — la loc",
    tema: "Umbre pe pământ",
    materiale: ["cutie", "frunză"],
    pasi: ["După colectat: puneți frunza în cutie, apoi cutia la loc.", "„Frunză. La loc.”"],
    gata_cand: "A ajutat cu frunza sau cutia.",
  },
  "s39-2-3-z1-resurse": {
    titlu: "Ajunge — farfuria cu fruct la loc",
    tema: "Fructe pe care le vedem",
    materiale: ["farfurie", "fruct"],
    pasi: ["După gustare: „Ajunge.”", "Farfuria cu fruct (sau goală) la loc."],
    gata_cand: "A ajutat cu farfuria după fruct.",
  },
  "s39-2-3-z3-resurse": {
    titlu: "Farfuria goală după fruct — la loc",
    tema: "Fructe pe care le vedem",
    materiale: ["farfurie"],
    pasi: ["„După fruct: goală. Ajunge.”", "Farfuria la loc."],
    gata_cand: "Farfuria goală după fruct e la loc.",
  },
  "s39-2-3-z5-resurse": {
    titlu: "Totul de masă cu fruct — la loc",
    tema: "Fructe pe care le vedem",
    materiale: ["farfurie", "pahar", "șervet"],
    pasi: ["Strângeți după fruct: „La loc.”", "„Masa cu fruct e gata.”"],
    gata_cand: "Obiectele de masă (după fruct) la loc.",
  },
  "s39-2-3-z7-resurse": {
    titlu: "Masa cu fruct strânsă înainte de calm",
    tema: "Fructe pe care le vedem",
    materiale: ["farfurie / pahar"],
    pasi: ["Strângeți masa cu fruct: „La loc.”", "„Gata. Liniște.”"],
    gata_cand: "Masa cu fruct e strânsă înainte de calm.",
  },
};

const P2: typeof P1 = {
  "s31-2-3-z6-resurse": {
    titlu: "Udatul de azi la semințe — gata",
    tema: "Semințe și udat",
    materiale: ["pahar", "ghiveci"],
    pasi: ["„Udatul la semințe — ajunge. Gata.”", "Paharul la loc."],
    gata_cand: "Udatul semințelor e închis.",
  },
  "s31-2-3-z2-mental": {
    titlu: "Uscat și ud — pământul seminței",
    tema: "Semințe și udat",
    materiale: ["pământ", "semințe / sămânță"],
    pasi: ["„Uscat.”", "„Ud — sămânța vrea ud.”"],
    gata_cand: "A deosebit uscat/ud la pământul seminței.",
  },
  "s42-2-3-z6-resurse": {
    titlu: "Cutia de frunze — plin destul",
    tema: "Vânt și frunze din nou",
    materiale: ["cutie", "frunze"],
    pasi: ["Puneți trei frunze: „Plin destul.”", "„Frunze. Gata.”"],
    gata_cand: "Cutia de frunze are trei.",
  },
};

const TITLE_BODY_STEMS: Record<string, string[]> = {
  "s2-2-3-z4-resurse": ["pahar", "masă"],
  "s28-2-3-z5-resurse": ["cizme", "ușă"],
  "s31-2-3-z2-resurse": ["pahar", "semințe"],
  "s34-2-3-z2-resurse": ["cutie", "frunză"],
  "s39-2-3-z1-resurse": ["farfurie", "fruct"],
  "s39-2-3-z3-resurse": ["farfurie", "fruct"],
  "s39-2-3-z5-resurse": ["fruct"],
  "s39-2-3-z7-resurse": ["fruct"],
  "s31-2-3-z6-resurse": ["semințe"],
  "s31-2-3-z2-mental": ["pământ", "sămânță"],
  "s42-2-3-z6-resurse": ["cutie", "frunze"],
};

const ENGLISH = /\b(the|ball|turn|look|hello|done|water|fruit|towel|stop|go|okay)\b/i;

function appendixOrtoIds(): string[] {
  return readFileSync(
    resolve("docs/APPENDIX-ORTO-SA-CRESTE-BANDA-2-3-IDS.txt"),
    "utf8",
  )
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function liveId(seedId: string): string {
  return seedId.replace("-2-3-", "-b23-");
}

function byId() {
  return Object.fromEntries(
    loadBanda23SeedActivities().map((row) => [row.id, row]),
  );
}

function assertLock(
  id: string,
  lock: (typeof P1)[string],
  rows: ReturnType<typeof byId>,
) {
  const row = rows[id];
  expect(row, id).toBeDefined();
  expect(row.banda).toBe("2-3");
  expect(row.titlu).toBe(lock.titlu);
  expect(row.tema_saptamana).toBe(lock.tema);
  expect(row.materiale).toEqual(lock.materiale);
  expect(row.pasi).toEqual(lock.pasi);
  expect(row.pasi.length).toBeLessThanOrEqual(3);
  expect(row.gata_cand).toBe(lock.gata_cand);
  const blob = [...row.materiale, ...row.pasi, row.gata_cand].join("\n");
  expect(blob).not.toMatch(ENGLISH);
  for (const stem of TITLE_BODY_STEMS[id] ?? []) {
    expect(blob.toLocaleLowerCase("ro"), `${id} missing ${stem}`).toContain(
      stem.toLocaleLowerCase("ro"),
    );
  }
}

describe("banda 2–3 Lock B P1+P2 + NIT orto", () => {
  test("1–2 seed is unchanged by this wave", () => {
    const rows = Array.from({ length: 52 }, (_, i) => i + 1).flatMap((week) =>
      getSeedActivities(week),
    );
    expect(rows).toHaveLength(1456);
    expect(rows.every((row) => row.banda === "1-2")).toBe(true);
    expect(rows.some((row) => row.id.includes("-b23-"))).toBe(false);
  });

  test("P1 Lock B: 8 ids keep title/theme; body names titled object", () => {
    expect(Object.keys(P1)).toHaveLength(8);
    const rows = byId();
    for (const [id, lock] of Object.entries(P1)) {
      assertLock(id, lock, rows);
    }
  });

  test("P2 Lock B: 3 ids keep title/theme; body names titled object", () => {
    expect(Object.keys(P2)).toHaveLength(3);
    const rows = byId();
    for (const [id, lock] of Object.entries(P2)) {
      assertLock(id, lock, rows);
    }
  });

  test("NIT orto: appendix 28 have să crească, zero să crește on 2–3 seed", () => {
    const appendix = appendixOrtoIds();
    expect(appendix).toHaveLength(28);
    const rows = loadBanda23SeedActivities();
    expect(rows).toHaveLength(1456);
    const map = Object.fromEntries(rows.map((row) => [row.id, row]));
    expect(appendix.filter((id) => !map[id])).toEqual([]);

    for (const id of appendix) {
      const blob = copyBlob(map[id]);
      const withNota = `${blob}\n${map[id].nota ?? ""}`;
      expect(withNota, id).not.toContain("să crește");
    }

    const leftover = rows.filter((row) =>
      `${copyBlob(row)}\n${row.nota ?? ""}`.includes("să crește"),
    );
    expect(leftover.map((row) => row.id)).toEqual([]);

    const withCreasca = appendix.filter((id) =>
      `${copyBlob(map[id])}\n${map[id].nota ?? ""}`.includes("să crească"),
    );
    // P2 rewrite on s31-2-3-z2-mental drops the old subjunctive clause.
    expect(withCreasca).toHaveLength(27);
    expect(appendix.filter((id) => !withCreasca.includes(id))).toEqual([
      "s31-2-3-z2-mental",
    ]);
    expect(copyBlob(map["s31-2-3-z2-mental"])).toMatch(/sămânță/);
  });

  test("migration updates only live b23 ids on banda 2-3", () => {
    const sql = readFileSync(resolve(MIGRATION), "utf8");
    expect(sql).toMatch(/and a\.banda = '2-3'/);
    expect(sql).toMatch(/^\s*materiale = v\.materiale,/m);
    expect(sql).toMatch(/^\s*pasi = v\.pasi,/m);
    expect(sql).toMatch(/^\s*gata_cand = v\.gata_cand$/m);
    expect(sql).not.toMatch(/titlu = v\.titlu/);
    expect(sql).not.toMatch(/tema_saptamana = v\.tema_saptamana/);
    expect(sql).toMatch(/să crește/u);
    expect(sql).toMatch(/să crească/u);
    expect(sql).not.toMatch(/banda = '1-2'/);
    expect(sql).not.toMatch(/bandFromBirthdate/);

    const liveIds = sql.match(/s\d+-b23-z\d-[a-z]+/g) ?? [];
    const seedStyle = sql.match(/s\d+-2-3-z\d-[a-z]+/g) ?? [];
    expect(seedStyle).toEqual([]);
    expect(new Set(liveIds).size).toBe(38);

    for (const id of [...Object.keys(P1), ...Object.keys(P2)]) {
      expect(sql).toContain(liveId(id));
      expect(sql).not.toContain(id);
    }
    for (const id of appendixOrtoIds()) {
      expect(sql).toContain(liveId(id));
    }
  });
});
