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

describe("PLAYFUL PILOT scope", () => {
  test("locks weeks to S3 and S4", () => {
    expect([...PLAYFUL_PILOT_WEEKS]).toEqual([3, 4]);
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

  test("S14/S15 and other weeks stay untouched", () => {
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
