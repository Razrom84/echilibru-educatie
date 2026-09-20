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
  test("locks weeks to S3–S20", () => {
    expect([...PLAYFUL_PILOT_WEEKS]).toEqual([
      3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    ]);
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

  test("S8 overlay is L–D with Frunzuliță", () => {
    expect(playfulPilotFor(8, 1)?.character.name).toBe("Frunzuliță");
    expect(playfulPilotFor(8, 1)?.character.id).toBe("frunzulita");
    expect(playfulPilotFor(8, 1)?.character.src).toBe("/characters/frunzulita.svg");
    expect(playfulPilotFor(8, 1)?.theme).toBe("Frunze și pământ");
    expect(playfulPilotFor(8, 1)?.ritualOpen).toBe("Frunze și pământ.");
    expect(playfulPilotFor(8, 7)?.ritualClose).toBe("Pe pământ, gata.");
    expect(playfulPilotFor(8, 1)?.ritualOpen).not.toMatch(/Hai/);
    expect(playfulPilotFor(8, 1)?.surprise).toBe("Atingem frunza cu obrazul 2 sec");
    expect(playfulPilotFor(8, 2)?.surprise).toBe("El alege frunza: mare sau mică");
    expect(playfulPilotFor(8, 3)?.surprise).toBe("Pământ uscat pe palmă, 2 sec");
    expect(playfulPilotFor(8, 4)?.surprise).toBe("Noroiul „dispare” pe prosop");
    expect(playfulPilotFor(8, 5)?.surprise).toBe("O frunză zboară 1 sec, apoi cade");
    expect(playfulPilotFor(8, 6)?.surprise).toBe(
      "O frunză „secretă” pe potecă (doar el o arată)",
    );
    expect(playfulPilotFor(8, 7)?.surprise).toBe(
      "Ultima pagină: o frunză din imagine",
    );
  });

  test("S9 overlay is L–D with Suflare", () => {
    expect(playfulPilotFor(9, 1)?.character.name).toBe("Suflare");
    expect(playfulPilotFor(9, 1)?.character.id).toBe("suflare");
    expect(playfulPilotFor(9, 1)?.character.src).toBe("/characters/suflare.svg");
    expect(playfulPilotFor(9, 1)?.theme).toBe("Vânt și aer");
    expect(playfulPilotFor(9, 1)?.ritualOpen).toBe("Vânt și aer.");
    expect(playfulPilotFor(9, 7)?.ritualClose).toBe("În aer, gata.");
    expect(playfulPilotFor(9, 1)?.ritualOpen).not.toMatch(/Hai/);
    expect(playfulPilotFor(9, 1)?.surprise).toBe("Aerul pe obraz 2 sec");
    expect(playfulPilotFor(9, 2)?.surprise).toBe("Suflăm o dată, apoi liniște");
    expect(playfulPilotFor(9, 3)?.surprise).toBe("Brațele aripă — o clipă");
    expect(playfulPilotFor(9, 4)?.surprise).toBe("Eșarfa zboară 2 sec");
    expect(playfulPilotFor(9, 5)?.surprise).toBe("El suflă, frunza se mișcă");
    expect(playfulPilotFor(9, 6)?.surprise).toBe(
      "Vântul pe obraz (doar el îl simte)",
    );
    expect(playfulPilotFor(9, 7)?.surprise).toBe(
      "Ultima pagină: un nor din imagine",
    );
  });

  test("S10 overlay is L–D with Cutiuță", () => {
    expect(playfulPilotFor(10, 1)?.character.name).toBe("Cutiuță");
    expect(playfulPilotFor(10, 1)?.character.id).toBe("cutiuta");
    expect(playfulPilotFor(10, 1)?.character.src).toBe("/characters/cutiuta.svg");
    expect(playfulPilotFor(10, 1)?.theme).toBe("Colectăm și sortăm");
    expect(playfulPilotFor(10, 1)?.ritualOpen).toBe("Adunăm și sortăm.");
    expect(playfulPilotFor(10, 7)?.ritualClose).toBe("La loc, gata.");
    expect(playfulPilotFor(10, 1)?.ritualOpen).not.toMatch(/Hai/);
    expect(playfulPilotFor(10, 1)?.surprise).toBe(
      "Un obiect „dispare” în cutie 2 sec",
    );
    expect(playfulPilotFor(10, 2)?.surprise).toBe(
      "El alege: mare sau mic în cutie",
    );
    expect(playfulPilotFor(10, 3)?.surprise).toBe(
      "Perechea de șosete se întâlnește",
    );
    expect(playfulPilotFor(10, 4)?.surprise).toBe(
      "Un cub stă afară 3 sec, apoi în cutie",
    );
    expect(playfulPilotFor(10, 5)?.surprise).toBe("El alege grămada");
    expect(playfulPilotFor(10, 6)?.surprise).toBe(
      "O piatră „vizită” scurtă în cutie, apoi afară",
    );
    expect(playfulPilotFor(10, 7)?.surprise).toBe(
      "Verificăm cutia: totul la loc",
    );
  });

  test("S11 overlay is L–D with Luminiță", () => {
    expect(playfulPilotFor(11, 1)?.character.name).toBe("Luminiță");
    expect(playfulPilotFor(11, 1)?.character.id).toBe("luminita");
    expect(playfulPilotFor(11, 1)?.character.src).toBe("/characters/luminita.svg");
    expect(playfulPilotFor(11, 1)?.theme).toBe("Lumină și umbră");
    expect(playfulPilotFor(11, 1)?.ritualOpen).toBe("Lumină și umbră.");
    expect(playfulPilotFor(11, 7)?.ritualClose).toBe("În umbră, gata.");
    expect(playfulPilotFor(11, 1)?.ritualOpen).not.toMatch(/\bHai\b/);
    expect(playfulPilotFor(11, 1)?.surprise).toBe(
      "Perdeaua se deschide 2 cm — „lumină?”",
    );
    expect(playfulPilotFor(11, 2)?.surprise).toBe("Umbra mâinii 2 sec pe perete");
    expect(playfulPilotFor(11, 3)?.surprise).toBe(
      "Lampa se stinge 2 sec, apoi se aprinde",
    );
    expect(playfulPilotFor(11, 4)?.surprise).toBe("Un petec de soare „dispare”");
    expect(playfulPilotFor(11, 5)?.surprise).toBe("El alege: lumină sau umbră");
    expect(playfulPilotFor(11, 6)?.surprise).toBe(
      "Umbra lui pe pământ (doar el o arată)",
    );
    expect(playfulPilotFor(11, 7)?.surprise).toBe("Ultima pagină: zi sau noapte");
  });

  test("S12 overlay is L–D with Cănuță", () => {
    expect(playfulPilotFor(12, 1)?.character.name).toBe("Cănuță");
    expect(playfulPilotFor(12, 1)?.character.id).toBe("canuta");
    expect(playfulPilotFor(12, 1)?.character.src).toBe("/characters/canuta.svg");
    expect(playfulPilotFor(12, 1)?.theme).toBe("Cald și rece (repetare)");
    expect(playfulPilotFor(12, 1)?.ritualOpen).toBe("Cald și rece.");
    expect(playfulPilotFor(12, 7)?.ritualClose).toBe("Cald-rece, gata.");
    expect(playfulPilotFor(12, 1)?.ritualOpen).not.toMatch(/\bHai\b/);
    expect(playfulPilotFor(12, 1)?.surprise).toBe("Cana caldă pe palmă 2 sec");
    expect(playfulPilotFor(12, 2)?.surprise).toBe("Sticla rece pe obraz 1 sec");
    expect(playfulPilotFor(12, 3)?.surprise).toBe("Mâini calde — apoi reci");
    expect(playfulPilotFor(12, 4)?.surprise).toBe("Haina pe umeri 3 sec");
    expect(playfulPilotFor(12, 5)?.surprise).toBe("Suflăm pe mâini o dată");
    expect(playfulPilotFor(12, 6)?.surprise).toBe(
      "Aer rece pe obraz (doar el îl simte)",
    );
    expect(playfulPilotFor(12, 7)?.surprise).toBe(
      "Verificăm cârligul: haina la loc",
    );
  });

  test("S13 overlay is L–D with Hăinuță", () => {
    expect(playfulPilotFor(13, 1)?.character.name).toBe("Hăinuță");
    expect(playfulPilotFor(13, 1)?.character.id).toBe("hainuta");
    expect(playfulPilotFor(13, 1)?.character.src).toBe("/characters/hainuta.svg");
    expect(playfulPilotFor(13, 1)?.theme).toBe("Haine pe vreme");
    expect(playfulPilotFor(13, 1)?.ritualOpen).toBe("Haine pe vreme.");
    expect(playfulPilotFor(13, 7)?.ritualClose).toBe("Pe cârlig, gata.");
    expect(playfulPilotFor(13, 1)?.ritualOpen).not.toMatch(/\bHai\b/);
    expect(playfulPilotFor(13, 1)?.surprise).toBe("Haina pe umeri 2 sec, apoi jos");
    expect(playfulPilotFor(13, 2)?.surprise).toBe("O șosetă „dispare” pe picior");
    expect(playfulPilotFor(13, 3)?.surprise).toBe(
      "Papucul stă 3 sec, apoi piciorul",
    );
    expect(playfulPilotFor(13, 4)?.surprise).toBe(
      "Căciula coboară 2 cm — „pe cap?”",
    );
    expect(playfulPilotFor(13, 5)?.surprise).toBe("El alege: cu mănușă sau fără");
    expect(playfulPilotFor(13, 6)?.surprise).toBe("Haina pe cârlig — el „trage”");
    expect(playfulPilotFor(13, 7)?.surprise).toBe(
      "Verificăm cârligul: totul la loc",
    );
  });

  test("S14 overlay is L–D with Potecuță", () => {
    expect(playfulPilotFor(14, 1)?.character.name).toBe("Potecuță");
    expect(playfulPilotFor(14, 1)?.character.id).toBe("potecuta");
    expect(playfulPilotFor(14, 1)?.character.src).toBe("/characters/potecuta.svg");
    expect(playfulPilotFor(14, 1)?.theme).toBe("Pași pe drumul scurt");
    expect(playfulPilotFor(14, 1)?.ritualOpen).toBe("Pași pe drum.");
    expect(playfulPilotFor(14, 7)?.ritualClose).toBe("Pe drum, gata.");
    expect(playfulPilotFor(14, 1)?.ritualOpen).not.toMatch(/\bHai\b/);
    expect(playfulPilotFor(14, 1)?.surprise).toBe("Trei pași pe hol, apoi stăm");
    expect(playfulPilotFor(14, 2)?.surprise).toBe("Ușa se deschide 2 cm — „ieșim?”");
    expect(playfulPilotFor(14, 3)?.surprise).toBe("O treaptă sus, o treaptă jos");
    expect(playfulPilotFor(14, 4)?.surprise).toBe("Pietricica „dispare” 2 sec pe drum");
    expect(playfulPilotFor(14, 5)?.surprise).toBe("El alege: repede sau încet");
    expect(playfulPilotFor(14, 6)?.surprise).toBe("Un pas pe drum (doar el îl arată)");
    expect(playfulPilotFor(14, 7)?.surprise).toBe("Ultima pagină: un drum din imagine");
  });

  test("S15 overlay is L–D with Linguriță", () => {
    expect(playfulPilotFor(15, 1)?.character.name).toBe("Linguriță");
    expect(playfulPilotFor(15, 1)?.character.id).toBe("lingurita");
    expect(playfulPilotFor(15, 1)?.theme).toBe("Mâncare împreună");
    expect(playfulPilotFor(15, 1)?.ritualOpen).toBe("Mâncare împreună.");
    expect(playfulPilotFor(15, 7)?.ritualClose).toBe("La masă, gata.");
    expect(playfulPilotFor(15, 1)?.surprise).toBe("Scaunul se apropie 2 cm de masă");
    expect(playfulPilotFor(15, 7)?.surprise).toBe(
      "Verificăm chiuveta: farfuria la loc",
    );
  });

  test("S16 overlay is L–D with Picătură", () => {
    expect(playfulPilotFor(16, 1)?.character.name).toBe("Picătură");
    expect(playfulPilotFor(16, 1)?.character.id).toBe("picatura");
    expect(playfulPilotFor(16, 1)?.theme).toBe("Apă și sete");
    expect(playfulPilotFor(16, 1)?.ritualOpen).toBe("Apă și sete.");
    expect(playfulPilotFor(16, 7)?.ritualClose).toBe("Apa, gata.");
    expect(playfulPilotFor(16, 2)?.surprise).toBe("Turnăm 2 picături — „apa?”");
  });

  test("S17 overlay is L–D with Păsărică", () => {
    expect(playfulPilotFor(17, 1)?.character.name).toBe("Păsărică");
    expect(playfulPilotFor(17, 1)?.character.id).toBe("pasarica");
    expect(playfulPilotFor(17, 1)?.theme).toBe("Animale pe care le auzim");
    expect(playfulPilotFor(17, 1)?.ritualOpen).toBe("Auzim animale.");
    expect(playfulPilotFor(17, 7)?.ritualClose).toBe("Auzite, gata.");
    expect(playfulPilotFor(17, 2)?.surprise).toBe("El face ham-ham o dată");
    expect(JSON.stringify(playfulPilotFor(17, 1))).not.toMatch(/\.wav/);
  });

  test("S18 overlay is L–D with Mingiuță", () => {
    expect(playfulPilotFor(18, 1)?.character.name).toBe("Mingiuță");
    expect(playfulPilotFor(18, 1)?.character.id).toBe("mingiuta");
    expect(playfulPilotFor(18, 1)?.theme).toBe("Joacă de-a rândul");
    expect(playfulPilotFor(18, 1)?.ritualOpen).toBe("Joacă de-a rândul.");
    expect(playfulPilotFor(18, 7)?.ritualClose).toBe("Rândul, gata.");
    expect(playfulPilotFor(18, 1)?.surprise).toBe("Mingea rulează 1 sec, apoi stă");
  });

  test("S19 overlay is L–D with Cărticică", () => {
    expect(playfulPilotFor(19, 1)?.character.name).toBe("Cărticică");
    expect(playfulPilotFor(19, 1)?.character.id).toBe("carticica");
    expect(playfulPilotFor(19, 1)?.theme).toBe("Cartea de seară");
    expect(playfulPilotFor(19, 1)?.ritualOpen).toBe("Cartea de seară.");
    expect(playfulPilotFor(19, 7)?.ritualClose).toBe("Cartea, gata.");
    expect(playfulPilotFor(19, 3)?.surprise).toBe("El alege pagina");
  });

  test("S20 overlay is L–D with Coșuleț", () => {
    expect(playfulPilotFor(20, 1)?.character.name).toBe("Coșuleț");
    expect(playfulPilotFor(20, 1)?.character.id).toBe("cosulet");
    expect(playfulPilotFor(20, 1)?.character.src).toBe("/characters/cosulet.svg");
    expect(playfulPilotFor(20, 1)?.theme).toBe("Ordine mică în cameră");
    expect(playfulPilotFor(20, 1)?.ritualOpen).toBe("Ordine în cameră.");
    expect(playfulPilotFor(20, 7)?.ritualClose).toBe("Camera, gata.");
    expect(playfulPilotFor(20, 1)?.ritualOpen).not.toMatch(/\bHai\b/);
    expect(playfulPilotFor(20, 1)?.surprise).toBe("Un lucru „dispare” 2 sec în coș");
    expect(playfulPilotFor(20, 7)?.surprise).toBe("Verificăm coșul: totul la loc");
  });

  test("S21 and other weeks stay untouched", () => {
    expect(playfulPilotFor(21, 1)).toBeNull();
    expect(playfulPilotWeek(21)).toBeNull();
    expect(playfulPilotFor(21, 5)).toBeNull();
    expect(playfulPilotFor(22, 1)).toBeNull();
    expect(playfulPilotWeek(1)).toBeNull();
    expect(playfulPilotWeek(22)).toBeNull();
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
    expect(playfulHeaderLabel("Frunzuliță", "Frunze și pământ")).toBe(
      "Frunzuliță · Frunze și pământ",
    );
    expect(playfulHeaderLabel("Suflare", "Vânt și aer")).toBe(
      "Suflare · Vânt și aer",
    );
    expect(playfulHeaderLabel("Cutiuță", "Colectăm și sortăm")).toBe(
      "Cutiuță · Colectăm și sortăm",
    );
    expect(playfulHeaderLabel("Luminiță", "Lumină și umbră")).toBe(
      "Luminiță · Lumină și umbră",
    );
    expect(playfulHeaderLabel("Cănuță", "Cald și rece (repetare)")).toBe(
      "Cănuță · Cald și rece (repetare)",
    );
    expect(playfulHeaderLabel("Hăinuță", "Haine pe vreme")).toBe(
      "Hăinuță · Haine pe vreme",
    );
    expect(playfulHeaderLabel("Potecuță", "Pași pe drumul scurt")).toBe(
      "Potecuță · Pași pe drumul scurt",
    );
    expect(playfulHeaderLabel("Linguriță", "Mâncare împreună")).toBe(
      "Linguriță · Mâncare împreună",
    );
    expect(playfulHeaderLabel("Picătură", "Apă și sete")).toBe(
      "Picătură · Apă și sete",
    );
    expect(playfulHeaderLabel("Păsărică", "Animale pe care le auzim")).toBe(
      "Păsărică · Animale pe care le auzim",
    );
    expect(playfulHeaderLabel("Mingiuță", "Joacă de-a rândul")).toBe(
      "Mingiuță · Joacă de-a rândul",
    );
    expect(playfulHeaderLabel("Cărticică", "Cartea de seară")).toBe(
      "Cărticică · Cartea de seară",
    );
    expect(playfulHeaderLabel("Coșuleț", "Ordine mică în cameră")).toBe(
      "Coșuleț · Ordine mică în cameră",
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

  test("S8–S10 names lock Romanian diacritics", () => {
    expect(PLAYFUL_CHARACTERS.frunzulita.name).toBe("Frunzuliță");
    expect(PLAYFUL_CHARACTERS.frunzulita.name).not.toBe("Frunzulita");
    expect(PLAYFUL_CHARACTERS.frunzulita.name).not.toBe("Frunzuliţa");
    expect([...PLAYFUL_CHARACTERS.frunzulita.name].map((ch) => ch.codePointAt(0))).toEqual([
      0x0046, 0x0072, 0x0075, 0x006e, 0x007a, 0x0075, 0x006c, 0x0069, 0x021b, 0x0103,
    ]);
    expect(PLAYFUL_CHARACTERS.suflare.name).toBe("Suflare");
    expect(PLAYFUL_CHARACTERS.suflare.name).not.toBe("Suflăre");
    expect([...PLAYFUL_CHARACTERS.suflare.name].map((ch) => ch.codePointAt(0))).toEqual([
      0x0053, 0x0075, 0x0066, 0x006c, 0x0061, 0x0072, 0x0065,
    ]);
    expect(PLAYFUL_CHARACTERS.cutiuta.name).toBe("Cutiuță");
    expect(PLAYFUL_CHARACTERS.cutiuta.name).not.toBe("Cutiuta");
    expect(PLAYFUL_CHARACTERS.cutiuta.name).not.toBe("Cutiuţa");
    expect([...PLAYFUL_CHARACTERS.cutiuta.name].map((ch) => ch.codePointAt(0))).toEqual([
      0x0043, 0x0075, 0x0074, 0x0069, 0x0075, 0x021b, 0x0103,
    ]);
    expect(svgTitle("frunzulita.svg")).toBe("Frunzuliță");
    expect(svgTitle("suflare.svg")).toBe("Suflare");
    expect(svgTitle("cutiuta.svg")).toBe("Cutiuță");
    expect([...svgTitle("frunzulita.svg")].map((ch) => ch.codePointAt(0))).toEqual([
      0x0046, 0x0072, 0x0075, 0x006e, 0x007a, 0x0075, 0x006c, 0x0069, 0x021b, 0x0103,
    ]);
    expect([...svgTitle("cutiuta.svg")].map((ch) => ch.codePointAt(0))).toEqual([
      0x0043, 0x0075, 0x0074, 0x0069, 0x0075, 0x021b, 0x0103,
    ]);
    const chrome = readFileSync(resolve("src/components/playful-chrome.tsx"), "utf8");
    expect(chrome).toContain("<title>Frunzuliță</title>");
    expect(chrome).toContain("<title>Suflare</title>");
    expect(chrome).toContain("<title>Cutiuță</title>");
    expect(chrome).not.toContain("<title>Frunzulita</title>");
    expect(chrome).not.toContain("<title>Cutiuta</title>");
    expect(chrome).not.toMatch(/Hai /);
  });

  test("S11–S13 names lock Romanian diacritics", () => {
    expect(PLAYFUL_CHARACTERS.luminita.name).toBe("Luminiță");
    expect(PLAYFUL_CHARACTERS.luminita.name).not.toBe("Luminita");
    expect(PLAYFUL_CHARACTERS.luminita.name).not.toBe("Luminiţa");
    expect([...PLAYFUL_CHARACTERS.luminita.name].map((ch) => ch.codePointAt(0))).toEqual([
      0x004c, 0x0075, 0x006d, 0x0069, 0x006e, 0x0069, 0x021b, 0x0103,
    ]);
    expect(PLAYFUL_CHARACTERS.canuta.name).toBe("Cănuță");
    expect(PLAYFUL_CHARACTERS.canuta.name).not.toBe("Canuta");
    expect(PLAYFUL_CHARACTERS.canuta.name).not.toBe("Cănuţa");
    expect(PLAYFUL_CHARACTERS.canuta.name).not.toBe("Mânuță");
    expect([...PLAYFUL_CHARACTERS.canuta.name].map((ch) => ch.codePointAt(0))).toEqual([
      0x0043, 0x0103, 0x006e, 0x0075, 0x021b, 0x0103,
    ]);
    expect(PLAYFUL_CHARACTERS.hainuta.name).toBe("Hăinuță");
    expect(PLAYFUL_CHARACTERS.hainuta.name).not.toBe("Hainuta");
    expect(PLAYFUL_CHARACTERS.hainuta.name).not.toBe("Hăinuţa");
    expect(PLAYFUL_CHARACTERS.hainuta.name).not.toBe("Mânuță");
    expect([...PLAYFUL_CHARACTERS.hainuta.name].map((ch) => ch.codePointAt(0))).toEqual([
      0x0048, 0x0103, 0x0069, 0x006e, 0x0075, 0x021b, 0x0103,
    ]);
    expect(svgTitle("luminita.svg")).toBe("Luminiță");
    expect(svgTitle("canuta.svg")).toBe("Cănuță");
    expect(svgTitle("hainuta.svg")).toBe("Hăinuță");
    expect([...svgTitle("luminita.svg")].map((ch) => ch.codePointAt(0))).toEqual([
      0x004c, 0x0075, 0x006d, 0x0069, 0x006e, 0x0069, 0x021b, 0x0103,
    ]);
    expect([...svgTitle("canuta.svg")].map((ch) => ch.codePointAt(0))).toEqual([
      0x0043, 0x0103, 0x006e, 0x0075, 0x021b, 0x0103,
    ]);
    expect([...svgTitle("hainuta.svg")].map((ch) => ch.codePointAt(0))).toEqual([
      0x0048, 0x0103, 0x0069, 0x006e, 0x0075, 0x021b, 0x0103,
    ]);
    const chrome = readFileSync(resolve("src/components/playful-chrome.tsx"), "utf8");
    expect(chrome).toContain("<title>Luminiță</title>");
    expect(chrome).toContain("<title>Cănuță</title>");
    expect(chrome).toContain("<title>Hăinuță</title>");
    expect(chrome).not.toContain("<title>Luminita</title>");
    expect(chrome).not.toContain("<title>Canuta</title>");
    expect(chrome).not.toContain("<title>Hainuta</title>");
    expect(chrome).not.toMatch(/Hai /);
  });

  test("S14–S20 names lock Romanian diacritics", () => {
    expect(PLAYFUL_CHARACTERS.potecuta.name).toBe("Potecuță");
    expect(PLAYFUL_CHARACTERS.potecuta.name).not.toBe("Potecuta");
    expect([...PLAYFUL_CHARACTERS.potecuta.name].map((ch) => ch.codePointAt(0))).toEqual([
      0x0050, 0x006f, 0x0074, 0x0065, 0x0063, 0x0075, 0x021b, 0x0103,
    ]);
    expect(PLAYFUL_CHARACTERS.lingurita.name).toBe("Linguriță");
    expect([...PLAYFUL_CHARACTERS.lingurita.name].map((ch) => ch.codePointAt(0))).toEqual([
      0x004c, 0x0069, 0x006e, 0x0067, 0x0075, 0x0072, 0x0069, 0x021b, 0x0103,
    ]);
    expect(PLAYFUL_CHARACTERS.picatura.name).toBe("Picătură");
    expect(PLAYFUL_CHARACTERS.picatura.name).not.toBe("Picatura");
    expect([...PLAYFUL_CHARACTERS.picatura.name].map((ch) => ch.codePointAt(0))).toEqual([
      0x0050, 0x0069, 0x0063, 0x0103, 0x0074, 0x0075, 0x0072, 0x0103,
    ]);
    expect(PLAYFUL_CHARACTERS.pasarica.name).toBe("Păsărică");
    expect(PLAYFUL_CHARACTERS.pasarica.name).not.toBe("Pasarica");
    expect([...PLAYFUL_CHARACTERS.pasarica.name].map((ch) => ch.codePointAt(0))).toEqual([
      0x0050, 0x0103, 0x0073, 0x0103, 0x0072, 0x0069, 0x0063, 0x0103,
    ]);
    expect(PLAYFUL_CHARACTERS.mingiuta.name).toBe("Mingiuță");
    expect([...PLAYFUL_CHARACTERS.mingiuta.name].map((ch) => ch.codePointAt(0))).toEqual([
      0x004d, 0x0069, 0x006e, 0x0067, 0x0069, 0x0075, 0x021b, 0x0103,
    ]);
    expect(PLAYFUL_CHARACTERS.carticica.name).toBe("Cărticică");
    expect(PLAYFUL_CHARACTERS.carticica.name).not.toBe("Carticica");
    expect([...PLAYFUL_CHARACTERS.carticica.name].map((ch) => ch.codePointAt(0))).toEqual([
      0x0043, 0x0103, 0x0072, 0x0074, 0x0069, 0x0063, 0x0069, 0x0063, 0x0103,
    ]);
    expect(PLAYFUL_CHARACTERS.cosulet.name).toBe("Coșuleț");
    expect(PLAYFUL_CHARACTERS.cosulet.name).not.toBe("Cosulet");
    expect(PLAYFUL_CHARACTERS.cosulet.name).not.toBe("Coşuleţ");
    expect([...PLAYFUL_CHARACTERS.cosulet.name].map((ch) => ch.codePointAt(0))).toEqual([
      0x0043, 0x006f, 0x0219, 0x0075, 0x006c, 0x0065, 0x021b,
    ]);
    expect(svgTitle("potecuta.svg")).toBe("Potecuță");
    expect(svgTitle("lingurita.svg")).toBe("Linguriță");
    expect(svgTitle("picatura.svg")).toBe("Picătură");
    expect(svgTitle("pasarica.svg")).toBe("Păsărică");
    expect(svgTitle("mingiuta.svg")).toBe("Mingiuță");
    expect(svgTitle("carticica.svg")).toBe("Cărticică");
    expect(svgTitle("cosulet.svg")).toBe("Coșuleț");
    const chrome = readFileSync(resolve("src/components/playful-chrome.tsx"), "utf8");
    expect(chrome).toContain("<title>Potecuță</title>");
    expect(chrome).toContain("<title>Linguriță</title>");
    expect(chrome).toContain("<title>Picătură</title>");
    expect(chrome).toContain("<title>Păsărică</title>");
    expect(chrome).toContain("<title>Mingiuță</title>");
    expect(chrome).toContain("<title>Cărticică</title>");
    expect(chrome).toContain("<title>Coșuleț</title>");
    expect(chrome).not.toContain("<title>Potecuta</title>");
    expect(chrome).not.toContain("<title>Pasarica</title>");
    expect(chrome).not.toContain("<title>Cosulet</title>");
  });

  test("S5–S20 overlays have no sound fields", () => {
    for (const week of [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]) {
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
  });

  test("S8–S10 titles are locked invitation lines for L–D × 4 pillars", () => {
    const expected: Record<string, string> = {
      "s8-2-3-z1-fizic": "Pași pe frunze",
      "s8-2-3-z1-mental": "Uite: frunza",
      "s8-2-3-z1-resurse": "Frunza jos, la loc",
      "s8-2-3-z1-social": "Arătăm frunza",
      "s8-2-3-z2-fizic": "Culegem trei frunze",
      "s8-2-3-z2-mental": "Frunză mare — sau mică?",
      "s8-2-3-z2-resurse": "Frunzele în găleată",
      "s8-2-3-z2-social": "Ține frunza",
      "s8-2-3-z3-fizic": "Săpăm puțin",
      "s8-2-3-z3-mental": "Pământ uscat — sau ud?",
      "s8-2-3-z3-resurse": "Lopățica la loc",
      "s8-2-3-z3-social": "Săpăm unul lângă altul",
      "s8-2-3-z4-fizic": "Noroi pe degete",
      "s8-2-3-z4-mental": "Frunză — sau pământ?",
      "s8-2-3-z4-resurse": "Mâinile pe prosop",
      "s8-2-3-z4-social": "Mâini curate",
      "s8-2-3-z5-fizic": "Frunze sus, pe scurt",
      "s8-2-3-z5-mental": "Frunză galbenă — sau verde?",
      "s8-2-3-z5-resurse": "Trei frunze la loc",
      "s8-2-3-z5-social": "Pe care frunză?",
      "s8-2-3-z6-fizic": "Pe poteca cu frunze",
      "s8-2-3-z6-mental": "Frunze sus pe copac",
      "s8-2-3-z6-resurse": "Găleata la loc",
      "s8-2-3-z6-social": "Eu frunza, tu pe lângă",
      "s8-2-3-z7-fizic": "Plimbare liberă",
      "s8-2-3-z7-mental": "Cartea cu frunze",
      "s8-2-3-z7-resurse": "Haina la loc",
      "s8-2-3-z7-social": "Noapte bună",
      "s9-2-3-z1-fizic": "Pași în aer",
      "s9-2-3-z1-mental": "Aerul pe față",
      "s9-2-3-z1-resurse": "Haina la ușă",
      "s9-2-3-z1-social": "Arătăm vântul",
      "s9-2-3-z2-fizic": "Alergăm cu vântul",
      "s9-2-3-z2-mental": "Frunza se mișcă",
      "s9-2-3-z2-resurse": "O frunză, apoi jos",
      "s9-2-3-z2-social": "Suflăm ușor împreună",
      "s9-2-3-z3-fizic": "Brațele: aripă",
      "s9-2-3-z3-mental": "Unde e vântul?",
      "s9-2-3-z3-resurse": "Punga se umflă",
      "s9-2-3-z3-social": "Uite aerul",
      "s9-2-3-z4-fizic": "Învârtim eșarfa",
      "s9-2-3-z4-mental": "Eșarfa zboară puțin",
      "s9-2-3-z4-resurse": "Eșarfa pe cârlig",
      "s9-2-3-z4-social": "Ținem eșarfa doi",
      "s9-2-3-z5-fizic": "Suflăm pe frunză",
      "s9-2-3-z5-mental": "Aer cald — sau rece?",
      "s9-2-3-z5-resurse": "Frunza înapoi afară",
      "s9-2-3-z5-social": "Acum tu sufli",
      "s9-2-3-z6-fizic": "Plimbare scurtă cu vânt",
      "s9-2-3-z6-mental": "Copacul se mișcă",
      "s9-2-3-z6-resurse": "Găleata jos pe iarbă",
      "s9-2-3-z6-social": "Eu vântul, tu pe lângă",
      "s9-2-3-z7-fizic": "Plimbare liberă",
      "s9-2-3-z7-mental": "Cartea: cer și nori",
      "s9-2-3-z7-resurse": "Haina sus pe cârlig",
      "s9-2-3-z7-social": "Noapte bună",
      "s10-2-3-z1-fizic": "Culegem trei de pe jos",
      "s10-2-3-z1-mental": "Trei pe masă",
      "s10-2-3-z1-resurse": "În cutie",
      "s10-2-3-z1-social": "Ține unul",
      "s10-2-3-z2-fizic": "Cărăm cutia cinci pași",
      "s10-2-3-z2-mental": "Mare — sau mic?",
      "s10-2-3-z2-resurse": "Mari în cutie",
      "s10-2-3-z2-social": "Pe care-l punem?",
      "s10-2-3-z3-fizic": "Șosetele de pe jos",
      "s10-2-3-z3-mental": "Perechea de șosete",
      "s10-2-3-z3-resurse": "Șosetele în sertar",
      "s10-2-3-z3-social": "Uite perechea",
      "s10-2-3-z4-fizic": "Cuburi de pe covor",
      "s10-2-3-z4-mental": "Cuburi, pe rând",
      "s10-2-3-z4-resurse": "Cuburile în cutie",
      "s10-2-3-z4-social": "Ține un cub",
      "s10-2-3-z5-fizic": "Două grămezi",
      "s10-2-3-z5-mental": "Aici — sau aici?",
      "s10-2-3-z5-resurse": "Totul la loc",
      "s10-2-3-z5-social": "Acum tu sortezi",
      "s10-2-3-z6-fizic": "Trei pietre afară",
      "s10-2-3-z6-mental": "Piatră — sau frunză?",
      "s10-2-3-z6-resurse": "Rămân afară",
      "s10-2-3-z6-social": "Uite ce-am cules",
      "s10-2-3-z7-fizic": "Plimbare liberă",
      "s10-2-3-z7-mental": "Cartea cu multe",
      "s10-2-3-z7-resurse": "Jucăriile în cutie",
      "s10-2-3-z7-social": "Noapte bună",
    };
    expect(Object.keys(expected)).toHaveLength(84);
    const byId = Object.fromEntries(
      [8, 9, 10].flatMap((week) =>
        getSeedActivities(week).map((row) => [row.id, row.titlu]),
      ),
    );
    for (const [id, titlu] of Object.entries(expected)) {
      expect(byId[id]).toBe(titlu);
    }
    expect(
      getSeedActivities(21).find((row) => row.id === "s21-2-3-z1-fizic")?.titlu,
    ).toBe("Mâna pe geam pe scurt");
  });

  test("S11–S13 titles are locked invitation lines for L–D × 4 pillars", () => {
    const expected: Record<string, string> = {
      "s11-2-3-z1-fizic": "Pași până la lumină",
      "s11-2-3-z1-mental": "Lumină pe mână",
      "s11-2-3-z1-resurse": "Perdeaua puțin",
      "s11-2-3-z1-social": "Arătăm lumina",
      "s11-2-3-z2-fizic": "Mâna face umbră",
      "s11-2-3-z2-mental": "Uite: umbra",
      "s11-2-3-z2-resurse": "Lampa la loc",
      "s11-2-3-z2-social": "Umbra împreună",
      "s11-2-3-z3-fizic": "Aprindem, stingem",
      "s11-2-3-z3-mental": "Lumină — sau întuneric?",
      "s11-2-3-z3-resurse": "Lanterna în sertar",
      "s11-2-3-z3-social": "Ținem lanterna doi",
      "s11-2-3-z4-fizic": "Petecul de soare",
      "s11-2-3-z4-mental": "Umbră pe podea",
      "s11-2-3-z4-resurse": "Jucăria din soare, la loc",
      "s11-2-3-z4-social": "În lumină, umăr lângă umăr",
      "s11-2-3-z5-fizic": "Dans la lumină",
      "s11-2-3-z5-mental": "În lumină — sau în umbră?",
      "s11-2-3-z5-resurse": "Perdeaua la loc",
      "s11-2-3-z5-social": "Uite umbra",
      "s11-2-3-z6-fizic": "Umbră afară, pe scurt",
      "s11-2-3-z6-mental": "Soare pe cer",
      "s11-2-3-z6-resurse": "Pălăria la loc",
      "s11-2-3-z6-social": "Eu umbra, tu pe lângă",
      "s11-2-3-z7-fizic": "Plimbare liberă",
      "s11-2-3-z7-mental": "Cartea: zi și noapte",
      "s11-2-3-z7-resurse": "Lumina mică de seară",
      "s11-2-3-z7-social": "Noapte bună",
      "s12-2-3-z1-fizic": "Atingem caldul",
      "s12-2-3-z1-mental": "E cald",
      "s12-2-3-z1-resurse": "Cana la loc",
      "s12-2-3-z1-social": "Arătăm: e cald",
      "s12-2-3-z2-fizic": "Atingem recele",
      "s12-2-3-z2-mental": "E rece",
      "s12-2-3-z2-resurse": "Sticla la frigider",
      "s12-2-3-z2-social": "Arătăm: e rece",
      "s12-2-3-z3-fizic": "Mâini calde, mâini reci",
      "s12-2-3-z3-mental": "Cald — sau rece?",
      "s12-2-3-z3-resurse": "Prosoapele la loc",
      "s12-2-3-z3-social": "Ținem mâinile: cald",
      "s12-2-3-z4-fizic": "Haina caldă pe umeri",
      "s12-2-3-z4-mental": "Cu haină — sau fără?",
      "s12-2-3-z4-resurse": "Haina pe cârlig",
      "s12-2-3-z4-social": "Te ajut la haină",
      "s12-2-3-z5-fizic": "Suflăm pe mâini",
      "s12-2-3-z5-mental": "Fereastră rece, cameră caldă",
      "s12-2-3-z5-resurse": "Mănușile în sertar",
      "s12-2-3-z5-social": "Încălzim mâinile",
      "s12-2-3-z6-fizic": "Aer rece afară, pe scurt",
      "s12-2-3-z6-mental": "Înăuntru cald, afară rece",
      "s12-2-3-z6-resurse": "Papucii calzi la ușă",
      "s12-2-3-z6-social": "Intrăm din frig",
      "s12-2-3-z7-fizic": "Plimbare liberă",
      "s12-2-3-z7-mental": "Cartea: cald și rece",
      "s12-2-3-z7-resurse": "Hainele groase pe cârlig",
      "s12-2-3-z7-social": "Noapte bună",
      "s13-2-3-z1-fizic": "Haina pe umeri",
      "s13-2-3-z1-mental": "Haina de afară",
      "s13-2-3-z1-resurse": "Haina pe cârlig",
      "s13-2-3-z1-social": "Uite haina",
      "s13-2-3-z2-fizic": "Șosetele pe picioare",
      "s13-2-3-z2-mental": "Șosetă și picior",
      "s13-2-3-z2-resurse": "Șosetele în sertar",
      "s13-2-3-z2-social": "Acum tu șoseta",
      "s13-2-3-z3-fizic": "Papucii la ușă",
      "s13-2-3-z3-mental": "Papuc — sau pantof?",
      "s13-2-3-z3-resurse": "Papucii la loc",
      "s13-2-3-z3-social": "Schimbăm papucii",
      "s13-2-3-z4-fizic": "Căciula pe cap",
      "s13-2-3-z4-mental": "Unde e căciula?",
      "s13-2-3-z4-resurse": "Căciula pe cârlig",
      "s13-2-3-z4-social": "Uite căciula",
      "s13-2-3-z5-fizic": "Mănușile pe mâini",
      "s13-2-3-z5-mental": "Cu mănușă — sau fără?",
      "s13-2-3-z5-resurse": "Mănușile în sertar",
      "s13-2-3-z5-social": "Ținem mâna cu mănușa",
      "s13-2-3-z6-fizic": "Ieșim îmbrăcați, pe scurt",
      "s13-2-3-z6-mental": "Afară cu haină, înăuntru fără",
      "s13-2-3-z6-resurse": "Haina după afară",
      "s13-2-3-z6-social": "Intrăm cu haina",
      "s13-2-3-z7-fizic": "Plimbare liberă",
      "s13-2-3-z7-mental": "Cartea cu haine",
      "s13-2-3-z7-resurse": "Hainele pe cârlig",
      "s13-2-3-z7-social": "Noapte bună",
    };
    expect(Object.keys(expected)).toHaveLength(84);
    const byId = Object.fromEntries(
      [11, 12, 13].flatMap((week) =>
        getSeedActivities(week).map((row) => [row.id, row.titlu]),
      ),
    );
    for (const [id, titlu] of Object.entries(expected)) {
      expect(byId[id]).toBe(titlu);
    }
    expect(
      getSeedActivities(21).find((row) => row.id === "s21-2-3-z1-fizic")?.titlu,
    ).toBe("Mâna pe geam pe scurt");
  });
  test("S14–S20 titles are locked invitation lines for L–D × 4 pillars", () => {
    const expected: Record<string, string> = {
      "s14-2-3-z1-fizic": "Pași pe hol",
      "s14-2-3-z1-mental": "Unde merge drumul?",
      "s14-2-3-z1-resurse": "Pantofii la ușă",
      "s14-2-3-z1-social": "Mergem de mână",
      "s14-2-3-z2-fizic": "Pași până la ușă",
      "s14-2-3-z2-mental": "Aproape — sau departe?",
      "s14-2-3-z2-resurse": "Cheia la loc",
      "s14-2-3-z2-social": "Batem în ușă",
      "s14-2-3-z3-fizic": "Pași pe treaptă",
      "s14-2-3-z3-mental": "Sus pe treaptă, jos",
      "s14-2-3-z3-resurse": "Găleata la loc",
      "s14-2-3-z3-social": "Ținem mâna",
      "s14-2-3-z4-fizic": "Pași până la poartă",
      "s14-2-3-z4-mental": "Drumul e scurt",
      "s14-2-3-z4-resurse": "Pietricica la loc",
      "s14-2-3-z4-social": "Uite drumul",
      "s14-2-3-z5-fizic": "Alergăm pe scurt",
      "s14-2-3-z5-mental": "Repede — sau încet?",
      "s14-2-3-z5-resurse": "Pantofii după drum",
      "s14-2-3-z5-social": "Pași pe rând",
      "s14-2-3-z6-fizic": "Plimbare scurtă",
      "s14-2-3-z6-mental": "Ce vedem pe drum?",
      "s14-2-3-z6-resurse": "Jucăria după plimbare",
      "s14-2-3-z6-social": "Eu pe drum, tu pe lângă",
      "s14-2-3-z7-fizic": "Plimbare liberă",
      "s14-2-3-z7-mental": "Cartea cu pași",
      "s14-2-3-z7-resurse": "Pantofii la ușă",
      "s14-2-3-z7-social": "Noapte bună",
      "s15-2-3-z1-fizic": "Pe scaun la masă",
      "s15-2-3-z1-mental": "Farfuria pe masă",
      "s15-2-3-z1-resurse": "Farfuria la chiuvetă",
      "s15-2-3-z1-social": "Stăm la masă",
      "s15-2-3-z2-fizic": "Gustare cu mâna",
      "s15-2-3-z2-mental": "Mâncare pe farfurie",
      "s15-2-3-z2-resurse": "Șervețelul la loc",
      "s15-2-3-z2-social": "Ține, gustarea",
      "s15-2-3-z3-fizic": "Lingura la gură",
      "s15-2-3-z3-mental": "Lingură și farfurie",
      "s15-2-3-z3-resurse": "Lingura la chiuvetă",
      "s15-2-3-z3-social": "Acum tu lingura",
      "s15-2-3-z4-fizic": "Paharul la masă",
      "s15-2-3-z4-mental": "Pahar lângă farfurie",
      "s15-2-3-z4-resurse": "Paharul la chiuvetă",
      "s15-2-3-z4-social": "Mulțumesc",
      "s15-2-3-z5-fizic": "Mâinile înainte de masă",
      "s15-2-3-z5-mental": "Înainte — sau după?",
      "s15-2-3-z5-resurse": "Prosopul la loc",
      "s15-2-3-z5-social": "Venim la masă",
      "s15-2-3-z6-fizic": "Gustare pe scurt",
      "s15-2-3-z6-mental": "Ce mâncăm azi?",
      "s15-2-3-z6-resurse": "Farfuria la loc",
      "s15-2-3-z6-social": "Împărțim",
      "s15-2-3-z7-fizic": "Plimbare liberă",
      "s15-2-3-z7-mental": "Cartea de la masă",
      "s15-2-3-z7-resurse": "Farfuriile la loc",
      "s15-2-3-z7-social": "Noapte bună",
      "s16-2-3-z1-fizic": "Bem din pahar",
      "s16-2-3-z1-mental": "Pahar cu apă",
      "s16-2-3-z1-resurse": "Paharul la chiuvetă",
      "s16-2-3-z1-social": "Bem împreună",
      "s16-2-3-z2-fizic": "Turnăm puțin",
      "s16-2-3-z2-mental": "Gol — sau cu apă?",
      "s16-2-3-z2-resurse": "Cana la loc",
      "s16-2-3-z2-social": "Turnăm pe rând",
      "s16-2-3-z3-fizic": "Cărăm paharul",
      "s16-2-3-z3-mental": "Unde e apa?",
      "s16-2-3-z3-resurse": "Paharul pe masă",
      "s16-2-3-z3-social": "Dăm paharul",
      "s16-2-3-z4-fizic": "Mâinile cu apă",
      "s16-2-3-z4-mental": "Apă de la robinet",
      "s16-2-3-z4-resurse": "Prosopul la loc",
      "s16-2-3-z4-social": "Spălăm pe rând",
      "s16-2-3-z5-fizic": "Bem când e sete",
      "s16-2-3-z5-mental": "Sete? Apă.",
      "s16-2-3-z5-resurse": "Paharul puțin, la loc",
      "s16-2-3-z5-social": "Oferim apă",
      "s16-2-3-z6-fizic": "Apă afară, pe scurt",
      "s16-2-3-z6-mental": "Plantă și apă",
      "s16-2-3-z6-resurse": "Paharul după afară",
      "s16-2-3-z6-social": "Bem după joacă",
      "s16-2-3-z7-fizic": "Plimbare liberă",
      "s16-2-3-z7-mental": "Cartea cu apa",
      "s16-2-3-z7-resurse": "Paharul pe raft",
      "s16-2-3-z7-social": "Noapte bună",
      "s17-2-3-z1-fizic": "Urechi afară, pe scurt",
      "s17-2-3-z1-mental": "Auzim ceva",
      "s17-2-3-z1-resurse": "Jucăria-animal la loc",
      "s17-2-3-z1-social": "Ascultăm",
      "s17-2-3-z2-fizic": "Pași de câine",
      "s17-2-3-z2-mental": "Auzim câinele",
      "s17-2-3-z2-resurse": "Plușul pe raft",
      "s17-2-3-z2-social": "Uite câinele",
      "s17-2-3-z3-fizic": "Brațe ca aripile",
      "s17-2-3-z3-mental": "Auzim pasărea",
      "s17-2-3-z3-resurse": "Pasărea de pluș la loc",
      "s17-2-3-z3-social": "Ciripim pe rând",
      "s17-2-3-z4-fizic": "Stăm la geam",
      "s17-2-3-z4-mental": "Mașină — sau liniște?",
      "s17-2-3-z4-resurse": "Mașinuța pe raft",
      "s17-2-3-z4-social": "Uite mașina",
      "s17-2-3-z5-fizic": "Corp liniștit",
      "s17-2-3-z5-mental": "Sunet — sau liniște?",
      "s17-2-3-z5-resurse": "Trei plușuri la loc",
      "s17-2-3-z5-social": "Facem sunetul",
      "s17-2-3-z6-fizic": "Păsări afară",
      "s17-2-3-z6-mental": "Câine, pasăre, mașină",
      "s17-2-3-z6-resurse": "Jucăriile de afară la loc",
      "s17-2-3-z6-social": "Ce-am auzit?",
      "s17-2-3-z7-fizic": "Plimbare liberă",
      "s17-2-3-z7-mental": "Cartea cu animale",
      "s17-2-3-z7-resurse": "Cartea pe raft",
      "s17-2-3-z7-social": "Noapte bună",
      "s18-2-3-z1-fizic": "Mingea pe jos",
      "s18-2-3-z1-mental": "A mea — a ta",
      "s18-2-3-z1-resurse": "Mingea în cutie",
      "s18-2-3-z1-social": "Dăm mingea",
      "s18-2-3-z2-fizic": "Mingea în mâini",
      "s18-2-3-z2-mental": "Unu, doi",
      "s18-2-3-z2-resurse": "Mingea pe raft",
      "s18-2-3-z2-social": "Rândul tău",
      "s18-2-3-z3-fizic": "Cub pe cub",
      "s18-2-3-z3-mental": "Acum eu, acum tu",
      "s18-2-3-z3-resurse": "Cuburile în cutie",
      "s18-2-3-z3-social": "Construim pe rând",
      "s18-2-3-z4-fizic": "Bătăi din palme",
      "s18-2-3-z4-mental": "Gata după două",
      "s18-2-3-z4-resurse": "Jucăria la loc",
      "s18-2-3-z4-social": "Schimbăm pe scurt",
      "s18-2-3-z5-fizic": "Mingea la perete",
      "s18-2-3-z5-mental": "Așteptăm puțin",
      "s18-2-3-z5-resurse": "Mingea și cubul la loc",
      "s18-2-3-z5-social": "Pe rând",
      "s18-2-3-z6-fizic": "Mingea afară, pe scurt",
      "s18-2-3-z6-mental": "Rând afară",
      "s18-2-3-z6-resurse": "Mingea după afară",
      "s18-2-3-z6-social": "Dăm mingea afară",
      "s18-2-3-z7-fizic": "Plimbare liberă",
      "s18-2-3-z7-mental": "Cartea cu mingea",
      "s18-2-3-z7-resurse": "Mingea pe raft",
      "s18-2-3-z7-social": "Noapte bună",
      "s19-2-3-z1-fizic": "Cartea pe canapea",
      "s19-2-3-z1-mental": "Aceeași carte",
      "s19-2-3-z1-resurse": "Cartea pe raft",
      "s19-2-3-z1-social": "Ne așezăm cu cartea",
      "s19-2-3-z2-fizic": "Întoarcem o pagină",
      "s19-2-3-z2-mental": "Pagina înainte",
      "s19-2-3-z2-resurse": "Cartea închisă",
      "s19-2-3-z2-social": "Uite imaginea",
      "s19-2-3-z3-fizic": "Două pagini",
      "s19-2-3-z3-mental": "Ce e pe pagină?",
      "s19-2-3-z3-resurse": "Cartea pe raft",
      "s19-2-3-z3-social": "Citim pe rând",
      "s19-2-3-z4-fizic": "Cartea pe genunchi",
      "s19-2-3-z4-mental": "Coperta din nou",
      "s19-2-3-z4-resurse": "Locul cărții",
      "s19-2-3-z4-social": "Lumină mică, carte",
      "s19-2-3-z5-fizic": "Trei pagini, gata",
      "s19-2-3-z5-mental": "Gata cu cartea",
      "s19-2-3-z5-resurse": "Cartea pe raft",
      "s19-2-3-z5-social": "După carte, noapte bună",
      "s19-2-3-z6-fizic": "Cartea și ziua",
      "s19-2-3-z6-mental": "Unde e cartea?",
      "s19-2-3-z6-resurse": "Cartea pe raft ziua",
      "s19-2-3-z6-social": "Alegem seara",
      "s19-2-3-z7-fizic": "Plimbare liberă",
      "s19-2-3-z7-mental": "Pagina favorită",
      "s19-2-3-z7-resurse": "Cartea pe raft",
      "s19-2-3-z7-social": "Noapte bună",
      "s20-2-3-z1-fizic": "Un lucru de pe jos",
      "s20-2-3-z1-mental": "Unde e locul?",
      "s20-2-3-z1-resurse": "Un lucru pe raft",
      "s20-2-3-z1-social": "Punem împreună",
      "s20-2-3-z2-fizic": "Două lucruri",
      "s20-2-3-z2-mental": "Unu și doi la loc",
      "s20-2-3-z2-resurse": "Două în coș",
      "s20-2-3-z2-social": "Pe rând, câte unul",
      "s20-2-3-z3-fizic": "Trei lucruri",
      "s20-2-3-z3-mental": "Trei la loc",
      "s20-2-3-z3-resurse": "Trei pe raft",
      "s20-2-3-z3-social": "Uite raftul",
      "s20-2-3-z4-fizic": "Cărțile pe raft",
      "s20-2-3-z4-mental": "Carte pe raft, jucărie în coș",
      "s20-2-3-z4-resurse": "Coșul închis",
      "s20-2-3-z4-social": "Ajutăm la coș",
      "s20-2-3-z5-fizic": "Pătura pe canapea",
      "s20-2-3-z5-mental": "Jos — și la loc",
      "s20-2-3-z5-resurse": "Raft, coș, canapea",
      "s20-2-3-z5-social": "Camera e mai liberă",
      "s20-2-3-z6-fizic": "Trei lucruri înainte",
      "s20-2-3-z6-mental": "Gata cu ordinea",
      "s20-2-3-z6-resurse": "Coșul la loc",
      "s20-2-3-z6-social": "Ordine scurtă",
      "s20-2-3-z7-fizic": "Plimbare liberă",
      "s20-2-3-z7-mental": "Cartea cu camera",
      "s20-2-3-z7-resurse": "Ultimele trei pe raft",
      "s20-2-3-z7-social": "Noapte bună",
    };
    expect(Object.keys(expected)).toHaveLength(196);
    const byId = Object.fromEntries(
      [14, 15, 16, 17, 18, 19, 20].flatMap((week) =>
        getSeedActivities(week).map((row) => [row.id, row.titlu]),
      ),
    );
    for (const [id, titlu] of Object.entries(expected)) {
      expect(byId[id]).toBe(titlu);
    }
    expect(
      getSeedActivities(21).find((row) => row.id === "s21-2-3-z1-fizic")?.titlu,
    ).toBe("Mâna pe geam pe scurt");
  });
  test("S21 titles stay pre-pilot wording", () => {
    const s21 = Object.fromEntries(
      getSeedActivities(21).map((row) => [row.id, row.titlu]),
    );
    expect(s21["s21-2-3-z1-fizic"]).toBe("Mâna pe geam pe scurt");
    expect(s21["s21-2-3-z1-mental"]).toBe("Geam și afară");
    expect(s21["s21-2-3-z1-resurse"]).toBe("Perdeaua la loc");
    expect(s21["s21-2-3-z1-social"]).toBe("Privim geamul împreună");
  });
});
