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
    expect(playfulPilotFor(3, 7)?.ritualOpen).toBe("Hai la sunete. Gata?");
  });

  test("S4 overlay is L–D with Mânuța", () => {
    expect(playfulPilotFor(4, 1)?.surprise).toBe("unde-i degetul");
    expect(playfulPilotFor(4, 2)?.surprise).toBe("high-five");
    expect(playfulPilotFor(4, 3)?.surprise).toBe("degete pe masă");
    expect(playfulPilotFor(4, 4)?.surprise).toBe("strângere×2");
    expect(playfulPilotFor(4, 5)?.surprise).toBe("moale-aspru");
    expect(playfulPilotFor(4, 6)?.surprise).toBe("săpătură+1");
    expect(playfulPilotFor(4, 7)?.surprise).toBe("pagină+1");
    expect(playfulPilotFor(4, 7)?.character.id).toBe("manuta");
    expect(playfulPilotFor(4, 7)?.ritualOpen).toBe("Hai cu mâinile. Gata?");
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
    expect(week?.ritualOpen).toBe("Hai la sunete. Gata?");
    expect(playfulPilotFor(3, 2)).toBeNull();
  });
});

describe("PLAYFUL PILOT copy helpers", () => {
  test("header is character · theme", () => {
    expect(playfulHeaderLabel("Sunețel", "Sunete și liniște")).toBe(
      "Sunețel · Sunete și liniște",
    );
    expect(playfulHeaderLabel("Mânuța", "Mâini și degete")).toBe(
      "Mânuța · Mâini și degete",
    );
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

  test("S3 V–D titles are invitation lines for sounds/silence", () => {
    const byId = Object.fromEntries(
      getSeedActivities(3).map((row) => [row.id, row.titlu]),
    );
    expect(byId["s3-2-3-z5-fizic"]).toBe("Hai pe vârfuri");
    expect(byId["s3-2-3-z5-mental"]).toBe("Uite 3 sunete din casă");
    expect(byId["s3-2-3-z5-resurse"]).toBe("Hai telefonul pe liniște");
    expect(byId["s3-2-3-z5-social"]).toBe("Hai, bună!");
    expect(byId["s3-2-3-z6-fizic"]).toBe("Hai pași pe iarbă");
    expect(byId["s3-2-3-z6-mental"]).toBe("Uite — vântul se aude?");
    expect(byId["s3-2-3-z6-resurse"]).toBe("Hai piatra fără sunet");
    expect(byId["s3-2-3-z6-social"]).toBe("Hai unul lângă altul");
    expect(byId["s3-2-3-z7-fizic"]).toBe("Hai — tu alegi plimbarea");
    expect(byId["s3-2-3-z7-mental"]).toBe("Hai cartea: liniște");
    expect(byId["s3-2-3-z7-resurse"]).toBe("Hai lumina stinsă");
    expect(byId["s3-2-3-z7-social"]).toBe("Hai noapte bună");
  });

  test("S4 titles are invitation voice for hands/fingers L–D", () => {
    const byId = Object.fromEntries(
      getSeedActivities(4).map((row) => [row.id, row.titlu]),
    );
    expect(byId["s4-2-3-z1-fizic"]).toBe("Hai pumnul: deschis, strâns");
    expect(byId["s4-2-3-z1-mental"]).toBe("Uite degetul");
    expect(byId["s4-2-3-z1-resurse"]).toBe("Hai capacul pe cutie");
    expect(byId["s4-2-3-z1-social"]).toBe("Hai, mână?");
    expect(byId["s4-2-3-z2-fizic"]).toBe("Hai 3 lucruri cu mâna");
    expect(byId["s4-2-3-z2-mental"]).toBe("Uite: mare, mic");
    expect(byId["s4-2-3-z2-resurse"]).toBe("Hai boabele în bol");
    expect(byId["s4-2-3-z2-social"]).toBe("Hai, mână? dă înapoi");
    expect(byId["s4-2-3-z3-fizic"]).toBe("Hai degetele pe masă");
    expect(byId["s4-2-3-z3-mental"]).toBe("Uite — unde e mânuța?");
    expect(byId["s4-2-3-z3-resurse"]).toBe("Hai fermoarul");
    expect(byId["s4-2-3-z3-social"]).toBe("Hai palma, blând");
    expect(byId["s4-2-3-z4-fizic"]).toBe("Hai împinge cutia");
    expect(byId["s4-2-3-z4-mental"]).toBe("Uite: unu, doi");
    expect(byId["s4-2-3-z4-resurse"]).toBe("Hai ștergem masa");
    expect(byId["s4-2-3-z4-social"]).toBe("Hai, mână? palmă pe palmă");
    expect(byId["s4-2-3-z5-fizic"]).toBe("Hai pe mâini pe pernă");
    expect(byId["s4-2-3-z5-mental"]).toBe("Uite: moale, aspru");
    expect(byId["s4-2-3-z5-resurse"]).toBe("Hai șoseta la loc");
    expect(byId["s4-2-3-z5-social"]).toBe("Hai mâna pe umăr");
    expect(byId["s4-2-3-z6-fizic"]).toBe("Hai săpăm cu mâna");
    expect(byId["s4-2-3-z6-mental"]).toBe("Uite piatra și frunza");
    expect(byId["s4-2-3-z6-resurse"]).toBe("Hai găleata la loc");
    expect(byId["s4-2-3-z6-social"]).toBe("Hai unul lângă altul");
    expect(byId["s4-2-3-z7-fizic"]).toBe("Hai — tu ții ceva");
    expect(byId["s4-2-3-z7-mental"]).toBe("Hai cartea: o pagină");
    expect(byId["s4-2-3-z7-resurse"]).toBe("Hai haina pe cârlig");
    expect(byId["s4-2-3-z7-social"]).toBe("Hai noapte bună");
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
