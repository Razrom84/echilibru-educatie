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
  test("locks weeks to S14 and S15", () => {
    expect([...PLAYFUL_PILOT_WEEKS]).toEqual([14, 15]);
  });

  test("S14 overlay is only V–D", () => {
    expect(playfulPilotFor(14, 1)).toBeNull();
    expect(playfulPilotFor(14, 4)).toBeNull();
    expect(playfulPilotFor(14, 5)?.character.name).toBe("Pașorel");
    expect(playfulPilotFor(14, 6)?.surprise).toBe("el alege oprirea");
    expect(playfulPilotFor(14, 7)?.ritualClose).toBe("Pași gata. Bravo.");
  });

  test("S15 overlay is L–D with Farfurio", () => {
    expect(playfulPilotFor(15, 1)?.surprise).toBe("toc-toc pe farfurie");
    expect(playfulPilotFor(15, 4)?.surprise).toBe("pahar 2 pași");
    expect(playfulPilotFor(15, 7)?.character.id).toBe("farfurio");
    expect(playfulPilotFor(15, 7)?.ritualOpen).toBe("Hai la masă. Gata?");
  });

  test("other weeks stay untouched", () => {
    expect(playfulPilotFor(13, 5)).toBeNull();
    expect(playfulPilotFor(16, 1)).toBeNull();
    expect(playfulPilotWeek(1)).toBeNull();
    expect(playfulPilotWeek(13)).toBeNull();
  });

  test("week ritual exists for S14 even on Mon–Thu", () => {
    const week = playfulPilotWeek(14);
    expect(week?.character).toEqual(PLAYFUL_CHARACTERS.pasorel);
    expect(week?.ritualOpen).toBe("Hai la pași. Gata?");
    expect(playfulPilotFor(14, 2)).toBeNull();
  });
});

describe("PLAYFUL PILOT copy helpers", () => {
  test("header is character · theme", () => {
    expect(playfulHeaderLabel("Pașorel", "Pași pe drumul scurt")).toBe(
      "Pașorel · Pași pe drumul scurt",
    );
    expect(playfulHeaderLabel("Farfurio", "Mâncare împreună")).toBe(
      "Farfurio · Mâncare împreună",
    );
  });

  test("surprise chip uses locked prefix", () => {
    expect(playfulSurpriseLabel("pas pe vârfuri 2s")).toBe(
      "Surpriză: pas pe vârfuri 2s",
    );
    expect(playfulSurpriseLabel("Surpriză: deja")).toBe("Surpriză: deja");
  });
});

describe("PLAYFUL PILOT seed titles (invitation voice)", () => {
  test("S14 Mon–Thu titles stay worksheet-era", () => {
    const rows = getSeedActivities(14);
    expect(rows.find((row) => row.id === "s14-2-3-z1-fizic")?.titlu).toBe(
      "Zece pași pe hol",
    );
    expect(rows.find((row) => row.id === "s14-2-3-z4-social")?.titlu).toBe(
      "Arătăm drumul adultului",
    );
  });

  test("S14 V–D titles are Cristina invitation lines", () => {
    const byId = Object.fromEntries(
      getSeedActivities(14).map((row) => [row.id, row.titlu]),
    );
    expect(byId["s14-2-3-z5-fizic"]).toBe("Hai să alergăm puțin pe drum");
    expect(byId["s14-2-3-z5-mental"]).toBe("Hai: încet, apoi repede");
    expect(byId["s14-2-3-z5-resurse"]).toBe("Hai pantofii la loc");
    expect(byId["s14-2-3-z5-social"]).toBe("Hai pe rând: un pas");
    expect(byId["s14-2-3-z6-fizic"]).toBe("Hai o plimbare scurtă");
    expect(byId["s14-2-3-z6-mental"]).toBe("Uite pe drum — ce e?");
    expect(byId["s14-2-3-z6-resurse"]).toBe("Hai găleata, apoi la loc");
    expect(byId["s14-2-3-z6-social"]).toBe("Hai unul lângă altul");
    expect(byId["s14-2-3-z7-fizic"]).toBe("Hai — tu alegi drumul");
    expect(byId["s14-2-3-z7-mental"]).toBe("Hai cartea: drum și pași");
    expect(byId["s14-2-3-z7-resurse"]).toBe("Hai pantofii pe cârlig");
    expect(byId["s14-2-3-z7-social"]).toBe("Hai noapte bună");
  });

  test("S15 titles are invitation voice for all four pillars L–D", () => {
    const byId = Object.fromEntries(
      getSeedActivities(15).map((row) => [row.id, row.titlu]),
    );
    expect(byId["s15-2-3-z1-fizic"]).toBe("Hai la masă pe scaun");
    expect(byId["s15-2-3-z1-mental"]).toBe("Uite farfuria pe masă");
    expect(byId["s15-2-3-z1-resurse"]).toBe("Hai farfuria la chiuvetă");
    expect(byId["s15-2-3-z1-social"]).toBe("Hai împreună la masă");
    expect(byId["s15-2-3-z2-fizic"]).toBe("Hai gustarea cu mâna");
    expect(byId["s15-2-3-z2-mental"]).toBe("Uite mâncarea pe farfurie");
    expect(byId["s15-2-3-z2-resurse"]).toBe("Hai șervețelul la loc");
    expect(byId["s15-2-3-z2-social"]).toBe("Hai, mână? gustarea");
    expect(byId["s15-2-3-z3-fizic"]).toBe("Hai lingura la gură");
    expect(byId["s15-2-3-z3-mental"]).toBe("Uite lingura și farfuria");
    expect(byId["s15-2-3-z3-resurse"]).toBe("Hai lingura la chiuvetă");
    expect(byId["s15-2-3-z3-social"]).toBe("Hai pe rând: o lingură");
    expect(byId["s15-2-3-z4-fizic"]).toBe("Hai paharul la masă");
    expect(byId["s15-2-3-z4-mental"]).toBe("Uite paharul lângă farfurie");
    expect(byId["s15-2-3-z4-resurse"]).toBe("Hai paharul la chiuvetă");
    expect(byId["s15-2-3-z4-social"]).toBe("Hai, mulțumesc la masă");
    expect(byId["s15-2-3-z5-fizic"]).toBe("Hai mâinile înainte de masă");
    expect(byId["s15-2-3-z5-mental"]).toBe("Hai: înainte, apoi după");
    expect(byId["s15-2-3-z5-resurse"]).toBe("Hai prosopul la loc");
    expect(byId["s15-2-3-z5-social"]).toBe("Hai, la masă!");
    expect(byId["s15-2-3-z6-fizic"]).toBe("Hai gustarea pe pătură");
    expect(byId["s15-2-3-z6-mental"]).toBe("Uite — ce mâncăm azi?");
    expect(byId["s15-2-3-z6-resurse"]).toBe("Hai farfuria la loc");
    expect(byId["s15-2-3-z6-social"]).toBe("Hai unul câte unul");
    expect(byId["s15-2-3-z7-fizic"]).toBe("Hai — tu alegi după masă");
    expect(byId["s15-2-3-z7-mental"]).toBe("Hai cartea: mâncare pe masă");
    expect(byId["s15-2-3-z7-resurse"]).toBe("Hai farfuriile la loc");
    expect(byId["s15-2-3-z7-social"]).toBe("Hai noapte bună");
  });

  test("S13 and S16 titles are unchanged by the pilot", () => {
    expect(
      getSeedActivities(13).find((row) => row.id === "s13-2-3-z1-fizic")?.titlu,
    ).toBe("Haina pe umeri pe scurt");
    expect(
      getSeedActivities(16).find((row) => row.id === "s16-2-3-z1-fizic")?.titlu,
    ).toBe("Bem apă din pahar");
  });
});
