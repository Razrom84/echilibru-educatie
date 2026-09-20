import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { loadBanda23SeedActivities, scanEnTokens } from "./en-banda-23-scanner";
import { getSeedActivities } from "./seed/week1";
import { playfulPilotFor, playfulPilotWeek } from "./playful-pilot";

const MIGRATION = "supabase/migrations/20260920290000_s32_banda_2_3_balon.sql";

const LOCK: Record<
  string,
  {
    titlu: string;
    materiale: string[];
    pasi: string[];
    gata_cand: string;
    tema: string;
  }
> = {
  "s32-2-3-z1-fizic": {
    titlu: "Ținem balonul de sfoară",
    materiale: ["balon cu sfoară"],
    pasi: [
      "În curte: țineți sfoara împreună pe scurt.",
      "„Balon.” 10–20 de secunde.",
    ],
    gata_cand: "A ținut sfoara sau a atins balonul.",
    tema: "Balonul afară",
  },
  "s32-2-3-z1-mental": {
    titlu: "Balonul e ușor",
    materiale: ["balon cu sfoară"],
    pasi: ["Arătați balonul: „Balon.”", "„Ușor.” pe scurt."],
    gata_cand: "A auzit balon și ușor.",
    tema: "Balonul afară",
  },
  "s32-2-3-z1-resurse": {
    titlu: "Balonul lângă ușă",
    materiale: ["balon cu sfoară"],
    pasi: [
      "Așezați balonul (sfoara strânsă) lângă ușă înainte să ieșiți.",
      "„Balon. Aici.”",
    ],
    gata_cand: "A ajutat să așeze balonul.",
    tema: "Balonul afară",
  },
  "s32-2-3-z1-social": {
    titlu: "Ținem balonul împreună",
    materiale: ["balon cu sfoară"],
    pasi: [
      "Stați afară lângă adult, amândoi pe sfoară.",
      "„Împreună. Balon.” fără forțare.",
    ],
    gata_cand: "A fost prezent cu balonul afară.",
    tema: "Balonul afară",
  },
  "s32-2-3-z2-fizic": {
    titlu: "Bătem ușor în balon",
    materiale: ["balon cu sfoară"],
    pasi: [
      "Bateți ușor o dată în balon, cu adult.",
      "„Balon. Bătut.” fără grabă.",
    ],
    gata_cand: "A bătut în balon sau a atins-o.",
    tema: "Balonul afară",
  },
  "s32-2-3-z2-mental": {
    titlu: "Balonul e moale",
    materiale: ["balon cu sfoară"],
    pasi: ["Atingeți balonul: „Moale.” pe scurt.", "„Balon.”"],
    gata_cand: "A auzit moale (și balon).",
    tema: "Balonul afară",
  },
  "s32-2-3-z2-resurse": {
    titlu: "Balonul pe scaun, la loc",
    materiale: ["balon cu sfoară"],
    pasi: [
      "Așezați balonul pe scaun când nu jucați (sfoara strânsă).",
      "„Balon. Aici.”",
    ],
    gata_cand: "A așezat balonul sau a privit.",
    tema: "Balonul afară",
  },
  "s32-2-3-z2-social": {
    titlu: "Bătem pe rând",
    materiale: ["balon cu sfoară"],
    pasi: ["Voi bateți ușor. „Acum tu.”", "Așteptați fără forțare."],
    gata_cand: "A bătut sau a privit rândul.",
    tema: "Balonul afară",
  },
  "s32-2-3-z3-fizic": {
    titlu: "Balonul sus, deasupra capului",
    materiale: ["balon cu sfoară"],
    pasi: [
      "Ridicați balonul deasupra capului pe scurt, cu adult.",
      "„Sus. Balon.”",
    ],
    gata_cand: "A privit balonul sus sau a ținut sfoara.",
    tema: "Balonul afară",
  },
  "s32-2-3-z3-mental": {
    titlu: "Sus — sau jos?",
    materiale: ["balon cu sfoară"],
    pasi: ["Ridicați: „Sus.”", "Coborâți aproape de sol: „Jos.”"],
    gata_cand: "A auzit sus și jos.",
    tema: "Balonul afară",
  },
  "s32-2-3-z3-resurse": {
    titlu: "Sfoara strânsă în mână",
    materiale: ["balon cu sfoară"],
    pasi: ["Înfășurați sfoara pe scurt în mână.", "„Sfoară. Strâns.”"],
    gata_cand: "A atins sfoara strânsă sau a privit.",
    tema: "Balonul afară",
  },
  "s32-2-3-z3-social": {
    titlu: "Ridicăm balonul împreună",
    materiale: ["balon cu sfoară"],
    pasi: ["Ridicați împreună pe scurt.", "„Împreună. Sus.” fără forțare."],
    gata_cand: "A ținut sfoara la ridicare sau a privit.",
    tema: "Balonul afară",
  },
  "s32-2-3-z4-fizic": {
    titlu: "Umblăm cu balonul în curte",
    materiale: ["balon cu sfoară"],
    pasi: ["Mergeți câțiva pași ținând sfoara.", "„Balon. Pași.”"],
    gata_cand: "A mers cu sfoara sau a privit.",
    tema: "Balonul afară",
  },
  "s32-2-3-z4-mental": {
    titlu: "Balonul pe iarbă",
    materiale: ["balon cu sfoară"],
    pasi: [
      "Lăsați balonul să atingă iarba pe scurt. „Balon. Iarbă.”",
      "Întrebați: „Unde e?”",
    ],
    gata_cand: "A privit sau a arătat balonul.",
    tema: "Balonul afară",
  },
  "s32-2-3-z4-resurse": {
    titlu: "Balonul nu rămâne afară",
    materiale: ["balon cu sfoară"],
    pasi: ["Aduceți balonul lângă ușă după joacă.", "„Balon. La ușă.”"],
    gata_cand: "A adus balonul sau a ajutat.",
    tema: "Balonul afară",
  },
  "s32-2-3-z4-social": {
    titlu: "Ne jucăm cu balonul",
    materiale: ["balon cu sfoară"],
    pasi: [
      "Căutați / arătați balonul pe scurt lângă adult.",
      "„Împreună. Unde e?” fără grabă.",
    ],
    gata_cand: "A căutat sau a arătat balonul.",
    tema: "Balonul afară",
  },
  "s32-2-3-z5-fizic": {
    titlu: "Mergem ținând sfoara",
    materiale: ["balon cu sfoară"],
    pasi: [
      "Mergeți ținând sfoara (nu loviți cu piciorul).",
      "„Sfoară. Pași.”",
    ],
    gata_cand: "A ținut sfoara la mers sau a privit.",
    tema: "Balonul afară",
  },
  "s32-2-3-z5-mental": {
    titlu: "Sfoară lungă — sau scurtă?",
    materiale: ["balon cu sfoară"],
    pasi: ["Arătați sfoara desfășurată: „Lungă.”", "Apoi strânsă: „Scurtă.”"],
    gata_cand: "A auzit lungă și scurtă.",
    tema: "Balonul afară",
  },
  "s32-2-3-z5-resurse": {
    titlu: "Sfoara înfășurată, la loc",
    materiale: ["balon cu sfoară", "cui sau cutie"],
    pasi: [
      "Înfășurați sfoara; puneți balonul pe cui / în cutie.",
      "„La loc.”",
    ],
    gata_cand: "A ajutat să pună balonul la loc.",
    tema: "Balonul afară",
  },
  "s32-2-3-z5-social": {
    titlu: "Mergem cu balonul împreună",
    materiale: ["balon cu sfoară"],
    pasi: [
      "Mergeți amândoi pe sfoară pe scurt.",
      "„Împreună. Pași.” fără forțare.",
    ],
    gata_cand: "A mers lângă adult cu sfoara sau a privit.",
    tema: "Balonul afară",
  },
  "s32-2-3-z6-fizic": {
    titlu: "Balonul se leagănă",
    materiale: ["balon cu sfoară"],
    pasi: [
      "Legănați ușor balonul de sfoară pe scurt.",
      "„Balon. Legăn.”",
    ],
    gata_cand: "A privit legănatul sau a ținut sfoara.",
    tema: "Balonul afară",
  },
  "s32-2-3-z6-mental": {
    titlu: "Se mișcă în aer",
    materiale: ["balon cu sfoară"],
    pasi: ["Arătați mișcarea: „Aer.”", "„Balon.” pe scurt."],
    gata_cand: "A auzit aer / balon.",
    tema: "Balonul afară",
  },
  "s32-2-3-z6-resurse": {
    titlu: "Balonul în casă, la loc",
    materiale: ["balon cu sfoară", "cui sau cutie"],
    pasi: [
      "Intrați; puneți balonul pe cui / în cutie.",
      "„Balon. La loc.”",
    ],
    gata_cand: "A pus balonul la loc sau a ajutat.",
    tema: "Balonul afară",
  },
  "s32-2-3-z6-social": {
    titlu: "Arătăm balonul",
    materiale: ["balon cu sfoară"],
    pasi: [
      "Intrați lângă adult cu balonul.",
      "„Împreună. Uite.” fără grabă.",
    ],
    gata_cand: "A intrat cu balonul sau a privit.",
    tema: "Balonul afară",
  },
  "s32-2-3-z7-fizic": {
    titlu: "Plimbare cu balonul",
    materiale: ["balon cu sfoară dacă vrea"],
    pasi: [
      "El dictează direcția în curte pe scurt, cu adult.",
      "La final: sfoara în mână dacă vrea.",
    ],
    gata_cand: "A mers liber pe scurt în curte.",
    tema: "Balonul afară",
  },
  "s32-2-3-z7-mental": {
    titlu: "Cartea cu balonul",
    materiale: ["carte cu imagini"],
    pasi: [
      "El întoarce pagina.",
      "Arătați balon / sfoară / afară dacă e clar: „Balon.”",
    ],
    gata_cand: "A întors pagina sau a privit.",
    tema: "Balonul afară",
  },
  "s32-2-3-z7-resurse": {
    titlu: "Balonul pe cui",
    materiale: ["balon cu sfoară", "pantofi"],
    pasi: ["Balonul pe cui; pantofii lângă ușă.", "„La loc. Gata.”"],
    gata_cand: "A ajutat să pună la loc.",
    tema: "Balonul afară",
  },
  "s32-2-3-z7-social": {
    titlu: "Noapte bună",
    materiale: [],
    pasi: ["„Noapte bună.”", "Lumină mică, fără grabă."],
    gata_cand: "A auzit ritualul de noapte.",
    tema: "Balonul afară",
  },
};

describe("S32 banda 2–3 → balon (GO A)", () => {
  test("LOCK table: all 28 seed rows match 1–2 S32 copy", () => {
    expect(Object.keys(LOCK)).toHaveLength(28);
    const s32 = loadBanda23SeedActivities().filter((row) => row.saptamana === 32);
    expect(s32).toHaveLength(28);
    expect(s32.map((row) => row.id).sort()).toEqual(Object.keys(LOCK).sort());

    for (const row of s32) {
      const lock = LOCK[row.id];
      expect(row.banda).toBe("2-3");
      expect(row.titlu).toBe(lock.titlu);
      expect(row.materiale).toEqual(lock.materiale);
      expect(row.pasi).toEqual(lock.pasi);
      expect(row.gata_cand).toBe(lock.gata_cand);
      expect(row.tema_saptamana).toBe(lock.tema);
      const blob = [
        row.titlu,
        ...row.materiale,
        ...row.pasi,
        row.gata_cand,
        row.tema_saptamana,
      ].join("\n");
      expect(blob, row.id).not.toMatch(/minge/i);
      expect(scanEnTokens(blob, ["ball", "my turn", "turn"]), row.id).toEqual([]);
    }
  });

  test("Demo preview 2–3 S32 matches LOCK; 1–2 S32 unchanged", () => {
    const preview = getSeedActivities(32, "2-3");
    expect(preview).toHaveLength(28);
    for (const row of preview) {
      const lock = LOCK[row.id];
      expect(row.titlu).toBe(lock.titlu);
      expect(row.tema_saptamana).toBe("Balonul afară");
    }
    const live12 = getSeedActivities(32);
    expect(live12.every((row) => row.banda === "1-2")).toBe(true);
    expect(live12.find((row) => row.id === "s32-2-3-z1-fizic")?.titlu).toBe(
      "Ținem balonul de sfoară",
    );
    const blob12 = live12
      .flatMap((row) => [row.titlu, ...row.materiale, ...row.pasi, row.gata_cand])
      .join("\n");
    expect(blob12).not.toMatch(/minge/i);
  });

  test("playful chrome stays Balonaș · Balonul afară", () => {
    expect(playfulPilotFor(32, 1)?.character.name).toBe("Balonaș");
    expect(playfulPilotWeek(32)?.theme).toBe("Balonul afară");
    expect(playfulPilotFor(32, 1)?.theme).toBe("Balonul afară");
    expect(playfulPilotFor(32, 1)?.ritualOpen).toBe("Balonul afară.");
    expect(playfulPilotFor(32, 7)?.ritualClose).toBe("Balonul, gata.");
  });

  test("SQL updates only live s32-b23-* on banda 2-3 (28 ids)", () => {
    const sql = readFileSync(resolve(MIGRATION), "utf8");
    expect(sql).toMatch(/and a\.banda = '2-3'/);
    expect(sql).toMatch(/titlu = v\.titlu/);
    expect(sql).toMatch(/tema_saptamana = v\.tema_saptamana/);
    expect(sql).toMatch(/s32-b23-z1-fizic/);
    expect(sql).toMatch(/Ținem balonul de sfoară/);
    expect(sql).not.toMatch(/s32-2-3-/);
    expect(sql).not.toMatch(/minge/i);
    expect(sql).not.toMatch(/banda = '1-2'/);
    expect(sql).not.toMatch(/bandFromBirthdate/);
    const liveIds = sql.match(/s32-b23-z\d-[a-z]+/g) ?? [];
    expect(new Set(liveIds).size).toBe(28);
    const seedStyle = sql.match(/s\d+-2-3-z\d-[a-z]+/g) ?? [];
    expect(seedStyle).toEqual([]);
  });
});
