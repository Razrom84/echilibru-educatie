import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { getSeedActivities } from "./seed/week1";
import {
  PLAYFUL_CHARACTERS,
  PLAYFUL_PILOT_WEEKS,
  playfulHeaderLabel,
  playfulPilotFor,
  playfulPilotWeek,
  playfulSurpriseLabel,
} from "./playful-pilot";

function svgTitle(filename: string): string {
  const xml = readFileSync(resolve("public/characters", filename), "utf8");
  const match = xml.match(/<title>(.*?)<\/title>/);
  return match?.[1] ?? "";
}

describe("PLAYFUL PILOT scope", () => {
  test("locks weeks to S3–S7", () => {
    expect([...PLAYFUL_PILOT_WEEKS]).toEqual([3, 4, 5, 6, 7]);
  });

  test("S3 overlay is only V–D", () => {
    expect(playfulPilotFor(3, 1)).toBeNull();
    expect(playfulPilotFor(3, 4)).toBeNull();
    expect(playfulPilotFor(3, 5)?.character.name).toBe("Sunețel");
    expect(playfulPilotFor(3, 5)?.surprise).toBe("șoaptă 2s");
    expect(playfulPilotFor(3, 6)?.surprise).toBe("o bătaie + liniște");
    expect(playfulPilotFor(3, 7)?.ritualClose).toBe("Sunete gata. Bravo.");
    expect(playfulPilotFor(3, 7)?.ritualOpen).toBe("Ascultăm. Gata?");
    expect(playfulPilotFor(3, 7)?.ritualOpen).not.toBe("Hai la sunete. Gata?");
  });

  test("S4 overlay is L–D with Mânuță", () => {
    expect(playfulPilotFor(4, 1)?.surprise).toBe("unde-i degetul");
    expect(playfulPilotFor(4, 2)?.surprise).toBe("high-five");
    expect(playfulPilotFor(4, 3)?.surprise).toBe("degete pe masă");
    expect(playfulPilotFor(4, 4)?.surprise).toBe("strângere×2");
    expect(playfulPilotFor(4, 5)?.surprise).toBe("moale-aspru");
    expect(playfulPilotFor(4, 6)?.surprise).toBe("săpătură+1");
    expect(playfulPilotFor(4, 7)?.surprise).toBe("pagină+1");
    expect(playfulPilotFor(4, 7)?.character.id).toBe("manuta");
    expect(playfulPilotFor(4, 7)?.character.name).toBe("Mânuță");
    expect(playfulPilotFor(4, 7)?.character.src).toBe("/characters/manuta.svg");
    expect(playfulPilotFor(4, 7)?.ritualOpen).toBe("Mâinile. Gata?");
    expect(playfulPilotFor(4, 7)?.ritualOpen).not.toBe("Hai cu mâinile. Gata?");
    expect(playfulPilotFor(4, 7)?.ritualClose).toBe("Mâini gata. Bravo.");
  });

  test("S5 overlay is L–D with Cariocă", () => {
    expect(playfulPilotFor(5, 1)?.character.name).toBe("Cariocă");
    expect(playfulPilotFor(5, 1)?.character.id).toBe("carioca");
    expect(playfulPilotFor(5, 1)?.character.src).toBe("/characters/carioca.svg");
    expect(playfulPilotFor(5, 1)?.theme).toBe("Culori pe care le vedem");
    expect(playfulPilotFor(5, 1)?.ritualOpen).toBe("Vedem culorile.");
    expect(playfulPilotFor(5, 1)?.ritualClose).toBe("Culori văzute.");
    expect(playfulPilotFor(5, 1)?.surprise).toBe(
      "Ascundem un obiect roșu 2 sec: „Unde e?”",
    );
    expect(playfulPilotFor(5, 2)?.surprise).toBe(
      "Două galbene — el alege pe care îl ține",
    );
    expect(playfulPilotFor(5, 3)?.surprise).toBe(
      "Albastru „dispare” sub o cârpă, apoi reapare",
    );
    expect(playfulPilotFor(5, 4)?.surprise).toBe(
      "Atingem verdele cu nasul (dacă vrea)",
    );
    expect(playfulPilotFor(5, 5)?.surprise).toBe("El alege culoarea din două");
    expect(playfulPilotFor(5, 6)?.surprise).toBe(
      "O culoare „secretă” afară (doar el o arată)",
    );
    expect(playfulPilotFor(5, 7)?.surprise).toBe(
      "Ultima pagină: o culoare din imagine",
    );
  });

  test("S6 overlay is L–D with Săgeată", () => {
    expect(playfulPilotFor(6, 1)?.character.name).toBe("Săgeată");
    expect(playfulPilotFor(6, 1)?.character.id).toBe("sageata");
    expect(playfulPilotFor(6, 1)?.character.src).toBe("/characters/sageata.svg");
    expect(playfulPilotFor(6, 1)?.theme).toBe("Sus și jos");
    expect(playfulPilotFor(6, 1)?.ritualOpen).toBe("Sus și jos.");
    expect(playfulPilotFor(6, 7)?.ritualClose).toBe("Sus-jos gata.");
    expect(playfulPilotFor(6, 1)?.surprise).toBe(
      "Brațele sus 1 sec în plus, pe vârfuri",
    );
    expect(playfulPilotFor(6, 2)?.surprise).toBe(
      "„Tu ești sus” pe scaun — o clipă",
    );
    expect(playfulPilotFor(6, 3)?.surprise).toBe(
      "Mingea „cade” încet: sus → jos",
    );
    expect(playfulPilotFor(6, 4)?.surprise).toBe(
      "Ghemuit-jos, apoi sus ca o surpriză",
    );
    expect(playfulPilotFor(6, 5)?.surprise).toBe("O săritură mică împreună");
    expect(playfulPilotFor(6, 6)?.surprise).toBe("Bordură: un pas sus, unul jos");
    expect(playfulPilotFor(6, 7)?.surprise).toBe(
      "Haina pe cârlig — el „trage” sus",
    );
  });

  test("S7 overlay is L–D with Preșuleț", () => {
    expect(playfulPilotFor(7, 1)?.character.name).toBe("Preșuleț");
    expect(playfulPilotFor(7, 1)?.character.id).toBe("presulet");
    expect(playfulPilotFor(7, 1)?.character.src).toBe("/characters/presulet.svg");
    expect(playfulPilotFor(7, 1)?.theme).toBe("Înăuntru și afară");
    expect(playfulPilotFor(7, 1)?.ritualOpen).toBe("Înăuntru și afară.");
    expect(playfulPilotFor(7, 7)?.ritualClose).toBe("Pe prag, gata.");
    expect(playfulPilotFor(7, 1)?.surprise).toBe(
      "Ușa se deschide 2 cm — „afar?”",
    );
    expect(playfulPilotFor(7, 2)?.surprise).toBe(
      "O gură de aer afară, apoi înăuntru",
    );
    expect(playfulPilotFor(7, 3)?.surprise).toBe("„La revedere, curte” pe prag");
    expect(playfulPilotFor(7, 4)?.surprise).toBe("Jucăria stă pe prag 3 sec");
    expect(playfulPilotFor(7, 5)?.surprise).toBe("Dans scurt → ne oprim la ușă");
    expect(playfulPilotFor(7, 6)?.surprise).toBe(
      "Piatră vizită scurtă în casă, apoi afară",
    );
    expect(playfulPilotFor(7, 7)?.surprise).toBe(
      "Verificăm pragul: nimic rămas",
    );
  });

  test("S8/S14/S15 and other weeks stay untouched", () => {
    expect(playfulPilotFor(8, 1)).toBeNull();
    expect(playfulPilotWeek(8)).toBeNull();
    expect(playfulPilotFor(14, 5)).toBeNull();
    expect(playfulPilotFor(14, 7)).toBeNull();
    expect(playfulPilotFor(15, 1)).toBeNull();
    expect(playfulPilotFor(13, 5)).toBeNull();
    expect(playfulPilotFor(16, 1)).toBeNull();
    expect(playfulPilotWeek(1)).toBeNull();
    expect(playfulPilotWeek(14)).toBeNull();
    expect(playfulPilotWeek(15)).toBeNull();
  });

  test("week ritual exists for S3 even on Mon–Thu", () => {
    const week = playfulPilotWeek(3);
    expect(week?.character).toEqual(PLAYFUL_CHARACTERS.suntel);
    expect(week?.ritualOpen).toBe("Ascultăm. Gata?");
    expect(playfulPilotFor(3, 2)).toBeNull();
  });
});

describe("PLAYFUL PILOT copy helpers", () => {
  test("header is character · theme", () => {
    expect(playfulHeaderLabel("Sunețel", "Sunete și liniște")).toBe(
      "Sunețel · Sunete și liniște",
    );
    expect(playfulHeaderLabel("Mânuță", "Mâini și degete")).toBe(
      "Mânuță · Mâini și degete",
    );
    expect(playfulHeaderLabel("Cariocă", "Culori pe care le vedem")).toBe(
      "Cariocă · Culori pe care le vedem",
    );
    expect(playfulHeaderLabel("Săgeată", "Sus și jos")).toBe(
      "Săgeată · Sus și jos",
    );
    expect(playfulHeaderLabel("Preșuleț", "Înăuntru și afară")).toBe(
      "Preșuleț · Înăuntru și afară",
    );
    expect(PLAYFUL_CHARACTERS.manuta.name).toBe("Mânuță");
    expect(PLAYFUL_CHARACTERS.manuta.name).not.toBe("Mănuță");
    expect(PLAYFUL_CHARACTERS.manuta.name).not.toBe("Mânuța");
    expect(PLAYFUL_CHARACTERS.manuta.name).not.toBe("Mănuța");
    expect(PLAYFUL_CHARACTERS.manuta.id).toBe("manuta");
    expect([...PLAYFUL_CHARACTERS.manuta.name].map((ch) => ch.codePointAt(0))).toEqual([
      0x004d, 0x00e2, 0x006e, 0x0075, 0x021b, 0x0103,
    ]);
  });

  test("surprise chip uses locked prefix", () => {
    expect(playfulSurpriseLabel("șoaptă 2s")).toBe("Surpriză: șoaptă 2s");
    expect(playfulSurpriseLabel("Surpriză: deja")).toBe("Surpriză: deja");
    expect(
      playfulSurpriseLabel("Ascundem un obiect roșu 2 sec: „Unde e?”"),
    ).toBe("Surpriză: Ascundem un obiect roșu 2 sec: „Unde e?”");
  });

  test("S5–S7 names lock Romanian diacritics", () => {
    expect(PLAYFUL_CHARACTERS.carioca.name).toBe("Cariocă");
    expect(PLAYFUL_CHARACTERS.carioca.name).not.toBe("Carioca");
    expect([...PLAYFUL_CHARACTERS.carioca.name].map((ch) => ch.codePointAt(0))).toEqual([
      0x0043, 0x0061, 0x0072, 0x0069, 0x006f, 0x0063, 0x0103,
    ]);
    expect(PLAYFUL_CHARACTERS.sageata.name).toBe("Săgeată");
    expect(PLAYFUL_CHARACTERS.sageata.name).not.toBe("Săgeata");
    expect(PLAYFUL_CHARACTERS.sageata.name).not.toBe("Sageata");
    expect(PLAYFUL_CHARACTERS.sageata.name.at(-1)).toBe("ă");
    expect(PLAYFUL_CHARACTERS.sageata.name.at(-1)?.codePointAt(0)).toBe(0x0103);
    expect([...PLAYFUL_CHARACTERS.sageata.name].map((ch) => ch.codePointAt(0))).toEqual([
      0x0053, 0x0103, 0x0067, 0x0065, 0x0061, 0x0074, 0x0103,
    ]);
    expect(PLAYFUL_CHARACTERS.presulet.name).toBe("Preșuleț");
    expect(PLAYFUL_CHARACTERS.presulet.name).not.toBe("Presulet");
    expect(PLAYFUL_CHARACTERS.presulet.name).not.toBe("Preşuleţ");
    expect([...PLAYFUL_CHARACTERS.presulet.name].map((ch) => ch.codePointAt(0))).toEqual([
      0x0050, 0x0072, 0x0065, 0x0219, 0x0075, 0x006c, 0x0065, 0x021b,
    ]);
    expect(svgTitle("carioca.svg")).toBe("Cariocă");
    expect(svgTitle("sageata.svg")).toBe("Săgeată");
    expect(svgTitle("sageata.svg")).not.toBe("Săgeata");
    expect(svgTitle("sageata.svg")).not.toBe("Sageata");
    expect([...svgTitle("sageata.svg")].map((ch) => ch.codePointAt(0))).toEqual([
      0x0053, 0x0103, 0x0067, 0x0065, 0x0061, 0x0074, 0x0103,
    ]);
    expect(svgTitle("presulet.svg")).toBe("Preșuleț");
    const chrome = readFileSync(resolve("src/components/playful-chrome.tsx"), "utf8");
    expect(chrome).toContain("<title>Cariocă</title>");
    expect(chrome).toContain("<title>Săgeată</title>");
    expect(chrome).toContain("<title>Preșuleț</title>");
    expect(chrome).not.toContain("<title>Săgeata</title>");
    expect(chrome).not.toContain("<title>Sageata</title>");
  });

  test("S5–S7 overlays have no sound fields", () => {
    for (const week of [5, 6, 7]) {
      const overlay = playfulPilotFor(week, 1);
      expect(overlay).not.toBeNull();
      expect(overlay).not.toHaveProperty("sound");
      expect(overlay).not.toHaveProperty("sounds");
      expect(overlay).not.toHaveProperty("audio");
      expect(overlay).not.toHaveProperty("wav");
      expect(JSON.stringify(overlay)).not.toMatch(/\.wav|Ascultă|play button/i);
    }
  });
});

describe("PLAYFUL PILOT seed titles (invitation voice)", () => {
  test("S3 Mon–Thu titles stay worksheet-era", () => {
    const rows = getSeedActivities(3);
    expect(rows.find((row) => row.id === "s3-2-3-z1-fizic")?.titlu).toBe(
      "Pași care se aud",
    );
    expect(rows.find((row) => row.id === "s3-2-3-z4-social")?.titlu).toBe(
      "Rândul la sunet",
    );
  });

  test("S3 V–D titles are natural RO invitation lines for sounds/silence", () => {
    const byId = Object.fromEntries(
      getSeedActivities(3).map((row) => [row.id, row.titlu]),
    );
    expect(byId["s3-2-3-z5-fizic"]).toBe("Mergem pe vârfuri, încet.");
    expect(byId["s3-2-3-z5-mental"]).toBe("Ascultăm trei sunete din casă.");
    expect(byId["s3-2-3-z5-resurse"]).toBe("Telefonul pe silențios");
    expect(byId["s3-2-3-z5-social"]).toBe("Spunem „Bună” cu vocea.");
    expect(byId["s3-2-3-z6-fizic"]).toBe("Ieșim afară. Auzi pașii?");
    expect(byId["s3-2-3-z6-mental"]).toBe("Se aude vântul?");
    expect(byId["s3-2-3-z6-resurse"]).toBe("Piatra care nu scoate sunete");
    expect(byId["s3-2-3-z6-social"]).toBe("Îți spun ce auzi tu.");
    expect(byId["s3-2-3-z7-fizic"]).toBe("Plimbare liberă.");
    expect(byId["s3-2-3-z7-mental"]).toBe("Carte în liniște");
    expect(byId["s3-2-3-z7-resurse"]).toBe("Stingem lumina încet");
    expect(byId["s3-2-3-z7-social"]).toBe("Noapte bună, șoptit");
  });

  test("S4 titles are natural RO invitation lines for hands/fingers L–D", () => {
    const byId = Object.fromEntries(
      getSeedActivities(4).map((row) => [row.id, row.titlu]),
    );
    expect(byId["s4-2-3-z1-fizic"]).toBe("Deschidem și strângem pumnul.");
    expect(byId["s4-2-3-z1-mental"]).toBe("Arată degetul.");
    expect(byId["s4-2-3-z1-resurse"]).toBe("Punem capacul pe cutie.");
    expect(byId["s4-2-3-z1-social"]).toBe("Ținem mâna.");
    expect(byId["s4-2-3-z2-fizic"]).toBe("Culegem trei lucruri.");
    expect(byId["s4-2-3-z2-mental"]).toBe("Mare și mic.");
    expect(byId["s4-2-3-z2-resurse"]).toBe("Boabele în bol.");
    expect(byId["s4-2-3-z2-social"]).toBe("Din mână în mână.");
    expect(byId["s4-2-3-z3-fizic"]).toBe("Ritm cu degetele.");
    expect(byId["s4-2-3-z3-mental"]).toBe("Unde e mânuța?");
    expect(byId["s4-2-3-z3-resurse"]).toBe("Fermoarul, puțin.");
    expect(byId["s4-2-3-z3-social"]).toBe("Gâdilat pe palmă, blând.");
    expect(byId["s4-2-3-z4-fizic"]).toBe("Împingem cutia.");
    expect(byId["s4-2-3-z4-mental"]).toBe("Unu, doi — degete.");
    expect(byId["s4-2-3-z4-resurse"]).toBe("Ștergem masa.");
    expect(byId["s4-2-3-z4-social"]).toBe("Palmă pe palmă.");
    expect(byId["s4-2-3-z5-fizic"]).toBe("Alunecăm cu mâna ușor pe pernă.");
    expect(byId["s4-2-3-z5-fizic"]).not.toBe("Târâit pe pernă.");
    expect(byId["s4-2-3-z5-fizic"]).not.toBe("Alunecăm pe pernă.");
    expect(byId["s4-2-3-z5-mental"]).toBe("Moale sau aspru?");
    expect(byId["s4-2-3-z5-resurse"]).toBe("Șoseta la loc.");
    expect(byId["s4-2-3-z5-social"]).toBe("Mâna pe umăr.");
    expect(byId["s4-2-3-z6-fizic"]).toBe("Săpăm cu mâna.");
    expect(byId["s4-2-3-z6-mental"]).toBe("Piatră sau frunză?");
    expect(byId["s4-2-3-z6-resurse"]).toBe("Găleata la loc.");
    expect(byId["s4-2-3-z6-social"]).toBe("Săpăm unul lângă altul.");
    expect(byId["s4-2-3-z7-fizic"]).toBe("Plimbare cu ceva în mână.");
    expect(byId["s4-2-3-z7-mental"]).toBe("Cartea — tu întorci.");
    expect(byId["s4-2-3-z7-resurse"]).toBe("Haina pe cârlig.");
    expect(byId["s4-2-3-z7-social"]).toBe("Noapte bună.");

    const fridayFizic = getSeedActivities(4).find(
      (row) => row.id === "s4-2-3-z5-fizic",
    );
    expect(fridayFizic?.pasi).toEqual([
      "Pune mâna pe pernă.",
      "Alunecă ușor mâna pe pernă.",
      "Scurt — gata.",
    ]);
    expect(fridayFizic?.gata_cand).toBe("A alunecat mâna pe pernă.");
    expect(fridayFizic?.nota).toBe(
      "Vârsta 1–2: doar mâna, blând; el poate refuza.",
    );
    expect(JSON.stringify(fridayFizic)).not.toMatch(/Târâit|târâit/);
    expect(fridayFizic?.titlu).not.toBe("Alunecăm pe pernă.");
  });

  test("S5–S7 titles are locked invitation lines for L–D × 4 pillars", () => {
    const expected: Record<string, string> = {
      "s5-2-3-z1-fizic": "Pași până la roșu",
      "s5-2-3-z1-mental": "Uite: roșu",
      "s5-2-3-z1-resurse": "Paharul colorat la loc",
      "s5-2-3-z1-social": "Arătăm roșul împreună",
      "s5-2-3-z2-fizic": "Căutăm două galbene",
      "s5-2-3-z2-mental": "Galben — sau nu?",
      "s5-2-3-z2-resurse": "În cutia galbenă",
      "s5-2-3-z2-social": "Ține galbenul",
      "s5-2-3-z3-fizic": "Atingem albastrul",
      "s5-2-3-z3-mental": "Unde e albastru?",
      "s5-2-3-z3-resurse": "Haina albastră pe cârlig",
      "s5-2-3-z3-social": "Uite albastru",
      "s5-2-3-z4-fizic": "Dans lângă verde",
      "s5-2-3-z4-mental": "Verde pe frunză",
      "s5-2-3-z4-resurse": "Dăm apă plantei",
      "s5-2-3-z4-social": "Privim verdele",
      "s5-2-3-z5-fizic": "Cărăm culoarea",
      "s5-2-3-z5-mental": "Trei culori pe masă",
      "s5-2-3-z5-resurse": "Culorile la loc",
      "s5-2-3-z5-social": "Pe care culoare?",
      "s5-2-3-z6-fizic": "Culori afară, pe scurt",
      "s5-2-3-z6-mental": "Cer albastru — sau nor?",
      "s5-2-3-z6-resurse": "O frunză colorată",
      "s5-2-3-z6-social": "Tu atingi, eu numesc",
      "s5-2-3-z7-fizic": "Plimbare liberă cu culori",
      "s5-2-3-z7-mental": "Cartea cu culori",
      "s5-2-3-z7-resurse": "Jucăriile colorate la loc",
      "s5-2-3-z7-social": "Noapte bună",
      "s6-2-3-z1-fizic": "Brațele: sus, jos",
      "s6-2-3-z1-mental": "Sus pe raft, jos pe podea",
      "s6-2-3-z1-resurse": "Jucăria jos, la loc",
      "s6-2-3-z1-social": "Ridicăm brațele împreună",
      "s6-2-3-z2-fizic": "Sus pe scaun (cu adult)",
      "s6-2-3-z2-mental": "Tu ești sus pe scaun",
      "s6-2-3-z2-resurse": "Farfuria sus pe masă",
      "s6-2-3-z2-social": "Mâna pe treaptă",
      "s6-2-3-z3-fizic": "O treaptă sus, una jos",
      "s6-2-3-z3-mental": "Mingea sus, mingea jos",
      "s6-2-3-z3-resurse": "Șosetele jos în sertar",
      "s6-2-3-z3-social": "Acum tu urci",
      "s6-2-3-z4-fizic": "Jos ghemuit, sus drept",
      "s6-2-3-z4-mental": "Unde e? Sus sau jos?",
      "s6-2-3-z4-resurse": "Cartea sus pe raft",
      "s6-2-3-z4-social": "Sus? Te ridic",
      "s6-2-3-z5-fizic": "Săritură mică în sus",
      "s6-2-3-z5-mental": "Capul sus, picioarele jos",
      "s6-2-3-z5-resurse": "Paharul jos la chiuvetă",
      "s6-2-3-z5-social": "Sus la fereastră",
      "s6-2-3-z6-fizic": "Bordură: sus și jos",
      "s6-2-3-z6-mental": "Frunză sus, frunză jos",
      "s6-2-3-z6-resurse": "Găleata jos pe iarbă",
      "s6-2-3-z6-social": "Eu sus-jos, tu pe lângă",
      "s6-2-3-z7-fizic": "Plimbare liberă",
      "s6-2-3-z7-mental": "Cartea — tu întorci",
      "s6-2-3-z7-resurse": "Haina sus pe cârlig",
      "s6-2-3-z7-social": "Noapte bună",
      "s7-2-3-z1-fizic": "Pași până la ușă",
      "s7-2-3-z1-mental": "Înăuntru — sau afară?",
      "s7-2-3-z1-resurse": "Papucii la ușă",
      "s7-2-3-z1-social": "Deschidem ușa împreună",
      "s7-2-3-z2-fizic": "În curte, două minute",
      "s7-2-3-z2-mental": "Aer afară, aer în casă",
      "s7-2-3-z2-resurse": "Haina după afară",
      "s7-2-3-z2-social": "Bună, afară",
      "s7-2-3-z3-fizic": "Pași înăuntru",
      "s7-2-3-z3-mental": "Unde e? Înăuntru",
      "s7-2-3-z3-resurse": "La loc, în casă",
      "s7-2-3-z3-social": "La revedere, curte",
      "s7-2-3-z4-fizic": "Afară și înapoi",
      "s7-2-3-z4-mental": "Jucăria: afară sau înăuntru?",
      "s7-2-3-z4-resurse": "Jucăria înăuntru, la loc",
      "s7-2-3-z4-social": "Mână pe prag",
      "s7-2-3-z5-fizic": "Dans, apoi la ușă",
      "s7-2-3-z5-mental": "Noi înăuntru, curtea afară",
      "s7-2-3-z5-resurse": "Ușa închisă",
      "s7-2-3-z5-social": "Uite afară",
      "s7-2-3-z6-fizic": "Plimbare scurtă în curte",
      "s7-2-3-z6-mental": "Lumină afară, umbră în casă",
      "s7-2-3-z6-resurse": "Piatra rămâne afară",
      "s7-2-3-z6-social": "Pe prag, unul lângă altul",
      "s7-2-3-z7-fizic": "Plimbare liberă",
      "s7-2-3-z7-mental": "Carte pe canapea, înăuntru",
      "s7-2-3-z7-resurse": "Totul de pe prag la loc",
      "s7-2-3-z7-social": "Noapte bună în casă",
    };
    expect(Object.keys(expected)).toHaveLength(84);
    const byId = Object.fromEntries(
      [5, 6, 7].flatMap((week) =>
        getSeedActivities(week).map((row) => [row.id, row.titlu]),
      ),
    );
    for (const [id, titlu] of Object.entries(expected)) {
      expect(byId[id]).toBe(titlu);
    }
    expect(getSeedActivities(8).find((row) => row.id === "s8-2-3-z1-fizic")?.titlu).toBe(
      "Pași pe frunze",
    );
  });

  test("S14 V–D and S15 titles are back to pre-pilot wording", () => {
    const s14 = Object.fromEntries(
      getSeedActivities(14).map((row) => [row.id, row.titlu]),
    );
    const s15 = Object.fromEntries(
      getSeedActivities(15).map((row) => [row.id, row.titlu]),
    );
    expect(s14["s14-2-3-z5-fizic"]).toBe("Alergăm scurt pe drum");
    expect(s14["s14-2-3-z5-mental"]).toBe("Repede și încet pe pași");
    expect(s14["s14-2-3-z6-fizic"]).toBe("Plimbare scurtă pe drum");
    expect(s14["s14-2-3-z7-social"]).toBe("Noapte bună");
    expect(s15["s15-2-3-z1-fizic"]).toBe("La masă pe scaun");
    expect(s15["s15-2-3-z2-social"]).toBe("Oferim gustarea");
    expect(s15["s15-2-3-z5-fizic"]).toBe("Spălăm mâinile înainte de masă");
    expect(s15["s15-2-3-z7-mental"]).toBe("Carte: mâncare pe masă");
  });
});
