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
  test("locks weeks to S1–S52", () => {
    expect([...PLAYFUL_PILOT_WEEKS]).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
      41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52,
    ]);
  });

  test("S1 overlay is L–D with Căsuță", () => {
    expect(playfulPilotFor(1, 1)?.character.name).toBe("Căsuță");
    expect(playfulPilotFor(1, 1)?.character.id).toBe("casuta");
    expect(playfulPilotFor(1, 1)?.character.src).toBe("/characters/casuta.svg");
    expect(playfulPilotFor(1, 1)?.theme).toBe("Casa și curtea");
    expect(playfulPilotFor(1, 1)?.ritualOpen).toBe("Casa și curtea.");
    expect(playfulPilotFor(1, 7)?.ritualClose).toBe("Pe curte, gata.");
    expect(playfulPilotFor(1, 1)?.ritualOpen).not.toMatch(/\bHai\b/);
    expect(playfulPilotFor(1, 1)?.surprise).toBe("Ușa curții se deschide 2 cm");
    expect(playfulPilotFor(1, 2)?.surprise).toBe("El alege: piatră sau frunză");
    expect(playfulPilotFor(1, 3)?.surprise).toBe("Mingea „dispare” 2 sec în iarbă");
    expect(playfulPilotFor(1, 4)?.surprise).toBe("Un lucru ușor în mână 3 sec");
    expect(playfulPilotFor(1, 5)?.surprise).toBe("O treaptă sus, una jos");
    expect(playfulPilotFor(1, 6)?.surprise).toBe("O piatră secretă (doar el o arată)");
    expect(playfulPilotFor(1, 7)?.surprise).toBe("Ultima pagină: casa din imagine");
  });

  test("S2 overlay is L–D with Găletușă", () => {
    expect(playfulPilotFor(2, 1)?.character.name).toBe("Găletușă");
    expect(playfulPilotFor(2, 1)?.character.id).toBe("galetusa");
    expect(playfulPilotFor(2, 1)?.character.src).toBe("/characters/galetusa.svg");
    expect(playfulPilotFor(2, 1)?.theme).toBe("Apa în casă și afară");
    expect(playfulPilotFor(2, 1)?.ritualOpen).toBe("Apa în casă.");
    expect(playfulPilotFor(2, 7)?.ritualClose).toBe("Afară, gata.");
    expect(playfulPilotFor(2, 1)?.surprise).toBe("Robinetul 2 sec, apoi oprit");
    expect(playfulPilotFor(2, 6)?.surprise).toBe("O băltoacă (doar el o arată)");
    expect(playfulPilotFor(2, 7)?.surprise).toBe("Verificăm: prosopul la loc");
  });

  test("S3 overlay is L–D with Sunețel", () => {
    expect(playfulPilotFor(3, 1)?.character.name).toBe("Sunețel");
    expect(playfulPilotFor(3, 1)?.surprise).toBe("pași, apoi liniște");
    expect(playfulPilotFor(3, 2)?.surprise).toBe("o bătaie din palme");
    expect(playfulPilotFor(3, 3)?.surprise).toBe("voce încet 2s");
    expect(playfulPilotFor(3, 4)?.surprise).toBe("ușa închisă încet");
    expect(playfulPilotFor(3, 5)?.character.name).toBe("Sunețel");
    expect(playfulPilotFor(3, 5)?.surprise).toBe("șoaptă 2s");
    expect(playfulPilotFor(3, 6)?.surprise).toBe("o bătaie + liniște");
    expect(playfulPilotFor(3, 7)?.ritualClose).toBe("Sunete gata. Bravo.");
    expect(playfulPilotFor(3, 7)?.ritualOpen).toBe("Ascultăm. Gata?");
    expect(playfulPilotFor(3, 7)?.ritualOpen).not.toBe("Hai la sunete. Gata?");
    expect(playfulPilotFor(3, 7)?.surprise).toBe("lumină stinsă 3s");
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


  test("S21–S52 overlays lock characters, rituals, surprises", () => {
    const rows = [
    {week:21,id:"ferestruica",name:"Ferestruică",open:"Iarna pe pervaz.",close:"Pe pervaz, gata.",s1:"Mâna pe geam 2 sec",theme:"Iarna pe pervaz"},
    {week:22,id:"ghemotoc",name:"Ghemotoc",open:"Corp în casă.",close:"Mișcat, gata.",s1:"Balans 2 sec pe loc",theme:"Corp care se mișcă în casă"},
    {week:23,id:"nasuc",name:"Năsuc",open:"Mirosuri din casă.",close:"Mirosit, gata.",s1:"Nas aproape de pâine 2 sec",theme:"Mirosuri din casă"},
    {week:24,id:"usita",name:"Ușiță",open:"Familia, oaspeții.",close:"La ușă, gata.",s1:"Mâna sus: salut",theme:"Familia și oaspeții"},
    {week:25,id:"lampadar",name:"Lampadar",open:"Lumină de seară.",close:"Seara, gata.",s1:"Lampa se aprinde 2 sec",theme:"Lumină de seară"},
    {week:26,id:"amintire",name:"Amintire",open:"Favoritele, din nou.",close:"Favorite, gata.",s1:"Geamul favorit 2 sec",theme:"Jumătate de an: repetăm favoritele"},
    {week:27,id:"fulgusor",name:"Fulgușor",open:"Zăpadă sau ploaie.",close:"La geam, gata.",s1:"Mâna pe geam: vremea",theme:"Zăpadă sau ploaie la geam"},
    {week:28,id:"murdarel",name:"Murdărel",open:"Dezgheț și noroi.",close:"Noroiul, gata.",s1:"Cizmele pe picioare",theme:"Dezgheț și noroi"},
    {week:29,id:"muguras",name:"Muguraș",open:"Muguri și iarbă.",close:"Mugurii, gata.",s1:"Un mugure pe creangă",theme:"Muguri și iarbă nouă"},
    {week:30,id:"cioculet",name:"Cioculeț",open:"Păsări dimineața.",close:"Păsări, gata.",s1:"Urechea la geam dimineața",theme:"Păsări dimineața"},
    {week:31,id:"samantica",name:"Sămânțică",open:"Semințe și udat.",close:"Udat, gata.",s1:"O sămânță în palmă",theme:"Semințe și udat"},
    {week:32,id:"balonas",name:"Balonaș",open:"Mingea afară.",close:"Mingea, gata.",s1:"Mingea rulează 1 sec afară",theme:"Mingea afară"},
    {week:33,id:"lopetica",name:"Lopețică",open:"Nisip și găleată.",close:"Nisipul, gata.",s1:"Mâna în nisip 2 sec",theme:"Nisip și găleată"},
    {week:34,id:"umbrita",name:"Umbriță",open:"Umbre pe pământ.",close:"Umbra, gata.",s1:"Mâna face umbră 2 sec",theme:"Umbre pe pământ"},
    {week:35,id:"stropulet",name:"Stropuleț",open:"Apă afară.",close:"Pe apă, gata.",s1:"Un strop pe mână",theme:"Apă afară (joc scurt)"},
    {week:36,id:"gandacel",name:"Gândăcel",open:"Insecte de departe.",close:"Departe, gata.",s1:"Privim de departe 2 sec",theme:"Insecte de departe"},
    {week:37,id:"racorica",name:"Răcorică",open:"Umbră răcoroasă.",close:"Răcoare, gata.",s1:"Stăm 2 sec la umbră",theme:"Umbră și loc răcoros"},
    {week:38,id:"talpita",name:"Tălpiță",open:"Picior pe iarbă.",close:"Pe iarbă, gata.",s1:"Tălpița pe iarbă 2 sec",theme:"Piciorul pe iarbă"},
    {week:39,id:"merisor",name:"Merișor",open:"Uite fructele.",close:"Fructe văzute.",s1:"Mărul pe masă 2 sec",theme:"Fructe pe care le vedem"},
    {week:40,id:"maturica",name:"Măturică",open:"Ajutor la treabă.",close:"Treaba, gata.",s1:"Mătura face 2 mișcări",theme:"Ajutor la treabă scurtă"},
    {week:41,id:"portita",name:"Portiță",open:"Drumul la poartă.",close:"La poartă, gata.",s1:"Pași până la poartă",theme:"Drumul până la poartă"},
    {week:42,id:"vantulet",name:"Vântuleț",open:"Vânt din nou.",close:"Vântul, gata.",s1:"O gură de vânt",theme:"Vânt și frunze din nou"},
    {week:43,id:"saculet",name:"Săculeț",open:"Coșul și strânsul.",close:"Strâns, gata.",s1:"Un lucru în săculeț",theme:"Coșul și strânsul"},
    {week:44,id:"inimioara",name:"Inimioară",open:"Prieteni și familie.",close:"Împreună, gata.",s1:"Mâna pe umăr 1 sec, dacă vrea",theme:"Prieteni și familie"},
    {week:45,id:"plimbarel",name:"Plimbărel",open:"Pași mulți.",close:"Pașii, gata.",s1:"Cinci pași, apoi stăm",theme:"Corp puternic, pași mulți"},
    {week:46,id:"degetel",name:"Degețel",open:"Arătăm împreună.",close:"Arătat, gata.",s1:"Arătăm mingea",theme:"Întrebări cu arătatul"},
    {week:47,id:"grijuliul",name:"Grijuliul",open:"Grijă de lucruri.",close:"Lucruri, gata.",s1:"Jucăria e a mea, 2 sec",theme:"Grijă de lucruri"},
    {week:48,id:"norocel",name:"Norocel",open:"Salut și pa.",close:"Pa, gata.",s1:"Mâna sus: salut",theme:"Salut și la revedere"},
    {week:49,id:"scumpicel",name:"Scumpicel",open:"Trei favorite.",close:"Cele trei, gata.",s1:"Mingea favorită 2 sec",theme:"Repetăm 3 favorite"},
    {week:50,id:"cumintel",name:"Cumințel",open:"Casă liniștită.",close:"Liniște, gata.",s1:"Pași moi 2 sec",theme:"Casă liniștită"},
    {week:51,id:"gospodarel",name:"Gospodărel",open:"Curtea știută.",close:"Curtea, gata.",s1:"Pași în curtea cunoscută",theme:"Curtea cunoscută"},
    {week:52,id:"blandut",name:"Blânduț",open:"Anul, blând.",close:"Anul, gata.",s1:"Pași blânzi prin casă",theme:"Anul se închide blând"},
    ] as const;
    expect(rows).toHaveLength(32);
    for (const row of rows) {
      const overlay = playfulPilotFor(row.week, 1);
      expect(overlay?.character.id).toBe(row.id);
      expect(overlay?.character.name).toBe(row.name);
      expect(overlay?.character.src).toBe(`/characters/${row.id}.svg`);
      expect(overlay?.theme).toBe(row.theme);
      expect(overlay?.ritualOpen).toBe(row.open);
      expect(overlay?.ritualOpen).not.toMatch(/\bHai\b/);
      expect(playfulPilotFor(row.week, 7)?.ritualClose).toBe(row.close);
      expect(overlay?.surprise).toBe(row.s1);
      expect(playfulPilotWeek(row.week)?.character.name).toBe(row.name);
    }
  });


  test("week ritual exists for S3 including Mon–Thu overlay", () => {
    const week = playfulPilotWeek(3);
    expect(week?.character).toEqual(PLAYFUL_CHARACTERS.suntel);
    expect(week?.ritualOpen).toBe("Ascultăm. Gata?");
    expect(playfulPilotFor(3, 2)?.character.name).toBe("Sunețel");
  });
});

describe("PLAYFUL PILOT copy helpers", () => {
  test("header is character · theme", () => {
    expect(playfulHeaderLabel("Sunețel", "Sunete și liniște")).toBe(
      "Sunețel · Sunete și liniște",
    );
    expect(playfulHeaderLabel("Căsuță", "Casa și curtea")).toBe(
      "Căsuță · Casa și curtea",
    );
    expect(playfulHeaderLabel("Găletușă", "Apa în casă și afară")).toBe(
      "Găletușă · Apa în casă și afară",
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

    expect(playfulHeaderLabel("Ferestruică", "Iarna pe pervaz")).toBe(
      "Ferestruică · Iarna pe pervaz",
    );
    expect(playfulHeaderLabel("Ghemotoc", "Corp care se mișcă în casă")).toBe(
      "Ghemotoc · Corp care se mișcă în casă",
    );
    expect(playfulHeaderLabel("Năsuc", "Mirosuri din casă")).toBe(
      "Năsuc · Mirosuri din casă",
    );
    expect(playfulHeaderLabel("Ușiță", "Familia și oaspeții")).toBe(
      "Ușiță · Familia și oaspeții",
    );
    expect(playfulHeaderLabel("Lampadar", "Lumină de seară")).toBe(
      "Lampadar · Lumină de seară",
    );
    expect(playfulHeaderLabel("Amintire", "Jumătate de an: repetăm favoritele")).toBe(
      "Amintire · Jumătate de an: repetăm favoritele",
    );
    expect(playfulHeaderLabel("Fulgușor", "Zăpadă sau ploaie la geam")).toBe(
      "Fulgușor · Zăpadă sau ploaie la geam",
    );
    expect(playfulHeaderLabel("Murdărel", "Dezgheț și noroi")).toBe(
      "Murdărel · Dezgheț și noroi",
    );
    expect(playfulHeaderLabel("Muguraș", "Muguri și iarbă nouă")).toBe(
      "Muguraș · Muguri și iarbă nouă",
    );
    expect(playfulHeaderLabel("Cioculeț", "Păsări dimineața")).toBe(
      "Cioculeț · Păsări dimineața",
    );
    expect(playfulHeaderLabel("Sămânțică", "Semințe și udat")).toBe(
      "Sămânțică · Semințe și udat",
    );
    expect(playfulHeaderLabel("Balonaș", "Mingea afară")).toBe(
      "Balonaș · Mingea afară",
    );
    expect(playfulHeaderLabel("Lopețică", "Nisip și găleată")).toBe(
      "Lopețică · Nisip și găleată",
    );
    expect(playfulHeaderLabel("Umbriță", "Umbre pe pământ")).toBe(
      "Umbriță · Umbre pe pământ",
    );
    expect(playfulHeaderLabel("Stropuleț", "Apă afară (joc scurt)")).toBe(
      "Stropuleț · Apă afară (joc scurt)",
    );
    expect(playfulHeaderLabel("Gândăcel", "Insecte de departe")).toBe(
      "Gândăcel · Insecte de departe",
    );
    expect(playfulHeaderLabel("Răcorică", "Umbră și loc răcoros")).toBe(
      "Răcorică · Umbră și loc răcoros",
    );
    expect(playfulHeaderLabel("Tălpiță", "Piciorul pe iarbă")).toBe(
      "Tălpiță · Piciorul pe iarbă",
    );
    expect(playfulHeaderLabel("Merișor", "Fructe pe care le vedem")).toBe(
      "Merișor · Fructe pe care le vedem",
    );
    expect(playfulHeaderLabel("Măturică", "Ajutor la treabă scurtă")).toBe(
      "Măturică · Ajutor la treabă scurtă",
    );
    expect(playfulHeaderLabel("Portiță", "Drumul până la poartă")).toBe(
      "Portiță · Drumul până la poartă",
    );
    expect(playfulHeaderLabel("Vântuleț", "Vânt și frunze din nou")).toBe(
      "Vântuleț · Vânt și frunze din nou",
    );
    expect(playfulHeaderLabel("Săculeț", "Coșul și strânsul")).toBe(
      "Săculeț · Coșul și strânsul",
    );
    expect(playfulHeaderLabel("Inimioară", "Prieteni și familie")).toBe(
      "Inimioară · Prieteni și familie",
    );
    expect(playfulHeaderLabel("Plimbărel", "Corp puternic, pași mulți")).toBe(
      "Plimbărel · Corp puternic, pași mulți",
    );
    expect(playfulHeaderLabel("Degețel", "Întrebări cu arătatul")).toBe(
      "Degețel · Întrebări cu arătatul",
    );
    expect(playfulHeaderLabel("Grijuliul", "Grijă de lucruri")).toBe(
      "Grijuliul · Grijă de lucruri",
    );
    expect(playfulHeaderLabel("Norocel", "Salut și la revedere")).toBe(
      "Norocel · Salut și la revedere",
    );
    expect(playfulHeaderLabel("Scumpicel", "Repetăm 3 favorite")).toBe(
      "Scumpicel · Repetăm 3 favorite",
    );
    expect(playfulHeaderLabel("Cumințel", "Casă liniștită")).toBe(
      "Cumințel · Casă liniștită",
    );
    expect(playfulHeaderLabel("Gospodărel", "Curtea cunoscută")).toBe(
      "Gospodărel · Curtea cunoscută",
    );
    expect(playfulHeaderLabel("Blânduț", "Anul se închide blând")).toBe(
      "Blânduț · Anul se închide blând",
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

  test("S1–S2 names lock Romanian diacritics", () => {
    expect(PLAYFUL_CHARACTERS.casuta.name).toBe("Căsuță");
    expect(PLAYFUL_CHARACTERS.casuta.name).not.toBe("Casuta");
    expect(PLAYFUL_CHARACTERS.casuta.name).not.toBe("Cănuță");
    expect([...PLAYFUL_CHARACTERS.casuta.name].map((ch) => ch.codePointAt(0))).toEqual([
      0x0043, 0x0103, 0x0073, 0x0075, 0x021b, 0x0103,
    ]);
    expect(PLAYFUL_CHARACTERS.galetusa.name).toBe("Găletușă");
    expect(PLAYFUL_CHARACTERS.galetusa.name).not.toBe("Găletuță");
    expect(PLAYFUL_CHARACTERS.galetusa.name).not.toBe("Galetuta");
    expect(PLAYFUL_CHARACTERS.galetusa.name).not.toBe("Galetusa");
    expect(PLAYFUL_CHARACTERS.galetusa.name).not.toBe("Picătură");
    expect([...PLAYFUL_CHARACTERS.galetusa.name].map((ch) => ch.codePointAt(0))).toEqual([
      0x0047, 0x0103, 0x006c, 0x0065, 0x0074, 0x0075, 0x0219, 0x0103,
    ]);
    expect(svgTitle("casuta.svg")).toBe("Căsuță");
    expect(svgTitle("galetusa.svg")).toBe("Găletușă");
    const chrome = readFileSync(resolve("src/components/playful-chrome.tsx"), "utf8");
    expect(chrome).toContain("<title>Căsuță</title>");
    expect(chrome).toContain("<title>Găletușă</title>");
    expect(chrome).not.toContain("<title>Casuta</title>");
    expect(chrome).not.toContain("<title>Găletuță</title>");
    expect(chrome).not.toContain("<title>Galetuta</title>");
  });

  test("S21–S52 names lock Romanian diacritics on SVG + chrome", () => {
    const chrome = readFileSync(resolve("src/components/playful-chrome.tsx"), "utf8");
    expect(PLAYFUL_CHARACTERS.ferestruica.name).toBe("Ferestruică");
    expect(svgTitle("ferestruica.svg")).toBe("Ferestruică");
    expect(chrome).toContain("<title>Ferestruică</title>");
    expect(PLAYFUL_CHARACTERS.ghemotoc.name).toBe("Ghemotoc");
    expect(svgTitle("ghemotoc.svg")).toBe("Ghemotoc");
    expect(chrome).toContain("<title>Ghemotoc</title>");
    expect(PLAYFUL_CHARACTERS.nasuc.name).toBe("Năsuc");
    expect(svgTitle("nasuc.svg")).toBe("Năsuc");
    expect(chrome).toContain("<title>Năsuc</title>");
    expect(PLAYFUL_CHARACTERS.usita.name).toBe("Ușiță");
    expect(svgTitle("usita.svg")).toBe("Ușiță");
    expect(chrome).toContain("<title>Ușiță</title>");
    expect(PLAYFUL_CHARACTERS.lampadar.name).toBe("Lampadar");
    expect(svgTitle("lampadar.svg")).toBe("Lampadar");
    expect(chrome).toContain("<title>Lampadar</title>");
    expect(PLAYFUL_CHARACTERS.amintire.name).toBe("Amintire");
    expect(svgTitle("amintire.svg")).toBe("Amintire");
    expect(chrome).toContain("<title>Amintire</title>");
    expect(PLAYFUL_CHARACTERS.fulgusor.name).toBe("Fulgușor");
    expect(svgTitle("fulgusor.svg")).toBe("Fulgușor");
    expect(chrome).toContain("<title>Fulgușor</title>");
    expect(PLAYFUL_CHARACTERS.murdarel.name).toBe("Murdărel");
    expect(svgTitle("murdarel.svg")).toBe("Murdărel");
    expect(chrome).toContain("<title>Murdărel</title>");
    expect(PLAYFUL_CHARACTERS.muguras.name).toBe("Muguraș");
    expect(svgTitle("muguras.svg")).toBe("Muguraș");
    expect(chrome).toContain("<title>Muguraș</title>");
    expect(PLAYFUL_CHARACTERS.cioculet.name).toBe("Cioculeț");
    expect(svgTitle("cioculet.svg")).toBe("Cioculeț");
    expect(chrome).toContain("<title>Cioculeț</title>");
    expect(PLAYFUL_CHARACTERS.samantica.name).toBe("Sămânțică");
    expect(svgTitle("samantica.svg")).toBe("Sămânțică");
    expect(chrome).toContain("<title>Sămânțică</title>");
    expect(PLAYFUL_CHARACTERS.balonas.name).toBe("Balonaș");
    expect(svgTitle("balonas.svg")).toBe("Balonaș");
    expect(chrome).toContain("<title>Balonaș</title>");
    expect(PLAYFUL_CHARACTERS.lopetica.name).toBe("Lopețică");
    expect(svgTitle("lopetica.svg")).toBe("Lopețică");
    expect(chrome).toContain("<title>Lopețică</title>");
    expect(PLAYFUL_CHARACTERS.umbrita.name).toBe("Umbriță");
    expect(svgTitle("umbrita.svg")).toBe("Umbriță");
    expect(chrome).toContain("<title>Umbriță</title>");
    expect(PLAYFUL_CHARACTERS.stropulet.name).toBe("Stropuleț");
    expect(svgTitle("stropulet.svg")).toBe("Stropuleț");
    expect(chrome).toContain("<title>Stropuleț</title>");
    expect(PLAYFUL_CHARACTERS.gandacel.name).toBe("Gândăcel");
    expect(svgTitle("gandacel.svg")).toBe("Gândăcel");
    expect(chrome).toContain("<title>Gândăcel</title>");
    expect(PLAYFUL_CHARACTERS.racorica.name).toBe("Răcorică");
    expect(svgTitle("racorica.svg")).toBe("Răcorică");
    expect(chrome).toContain("<title>Răcorică</title>");
    expect(PLAYFUL_CHARACTERS.talpita.name).toBe("Tălpiță");
    expect(svgTitle("talpita.svg")).toBe("Tălpiță");
    expect(chrome).toContain("<title>Tălpiță</title>");
    expect(PLAYFUL_CHARACTERS.merisor.name).toBe("Merișor");
    expect(svgTitle("merisor.svg")).toBe("Merișor");
    expect(chrome).toContain("<title>Merișor</title>");
    expect(PLAYFUL_CHARACTERS.maturica.name).toBe("Măturică");
    expect(svgTitle("maturica.svg")).toBe("Măturică");
    expect(chrome).toContain("<title>Măturică</title>");
    expect(PLAYFUL_CHARACTERS.portita.name).toBe("Portiță");
    expect(svgTitle("portita.svg")).toBe("Portiță");
    expect(chrome).toContain("<title>Portiță</title>");
    expect(PLAYFUL_CHARACTERS.vantulet.name).toBe("Vântuleț");
    expect(svgTitle("vantulet.svg")).toBe("Vântuleț");
    expect(chrome).toContain("<title>Vântuleț</title>");
    expect(PLAYFUL_CHARACTERS.saculet.name).toBe("Săculeț");
    expect(svgTitle("saculet.svg")).toBe("Săculeț");
    expect(chrome).toContain("<title>Săculeț</title>");
    expect(PLAYFUL_CHARACTERS.inimioara.name).toBe("Inimioară");
    expect(svgTitle("inimioara.svg")).toBe("Inimioară");
    expect(chrome).toContain("<title>Inimioară</title>");
    expect(PLAYFUL_CHARACTERS.plimbarel.name).toBe("Plimbărel");
    expect(svgTitle("plimbarel.svg")).toBe("Plimbărel");
    expect(chrome).toContain("<title>Plimbărel</title>");
    expect(PLAYFUL_CHARACTERS.degetel.name).toBe("Degețel");
    expect(svgTitle("degetel.svg")).toBe("Degețel");
    expect(chrome).toContain("<title>Degețel</title>");
    expect(PLAYFUL_CHARACTERS.grijuliul.name).toBe("Grijuliul");
    expect(svgTitle("grijuliul.svg")).toBe("Grijuliul");
    expect(chrome).toContain("<title>Grijuliul</title>");
    expect(PLAYFUL_CHARACTERS.norocel.name).toBe("Norocel");
    expect(svgTitle("norocel.svg")).toBe("Norocel");
    expect(chrome).toContain("<title>Norocel</title>");
    expect(PLAYFUL_CHARACTERS.scumpicel.name).toBe("Scumpicel");
    expect(svgTitle("scumpicel.svg")).toBe("Scumpicel");
    expect(chrome).toContain("<title>Scumpicel</title>");
    expect(PLAYFUL_CHARACTERS.cumintel.name).toBe("Cumințel");
    expect(svgTitle("cumintel.svg")).toBe("Cumințel");
    expect(chrome).toContain("<title>Cumințel</title>");
    expect(PLAYFUL_CHARACTERS.gospodarel.name).toBe("Gospodărel");
    expect(svgTitle("gospodarel.svg")).toBe("Gospodărel");
    expect(chrome).toContain("<title>Gospodărel</title>");
    expect(PLAYFUL_CHARACTERS.blandut.name).toBe("Blânduț");
    expect(svgTitle("blandut.svg")).toBe("Blânduț");
    expect(chrome).toContain("<title>Blânduț</title>");
  });

  test("S1–S52 overlays have no sound fields (S3 ritual lock contains Ascultăm)", () => {
    for (const week of PLAYFUL_PILOT_WEEKS) {
      if (week === 3) continue; // ritual lock contains Ascultăm
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
  test("S1–S2 titles are locked invitation lines for L–D × 4 pillars", () => {
    const expected: Record<string, string> = {
      "s1-2-3-z1-fizic": "Pași în curte",
      "s1-2-3-z1-mental": "Uite copacul",
      "s1-2-3-z1-resurse": "Piatra mea",
      "s1-2-3-z1-social": "Salut",
      "s1-2-3-z2-fizic": "Sărituri mici",
      "s1-2-3-z2-mental": "Cartea scurt",
      "s1-2-3-z2-resurse": "Paharul gol — sau plin?",
      "s1-2-3-z2-social": "Mulțumesc",
      "s1-2-3-z3-fizic": "Dans scurt",
      "s1-2-3-z3-mental": "Unde e mingea?",
      "s1-2-3-z3-resurse": "Trei jucării la loc",
      "s1-2-3-z3-social": "Îmbrățișare, dacă vrea",
      "s1-2-3-z4-fizic": "Cărăm ceva ușor",
      "s1-2-3-z4-mental": "Cald — sau rece?",
      "s1-2-3-z4-resurse": "Apa la loc",
      "s1-2-3-z4-social": "Pe rând",
      "s1-2-3-z5-fizic": "Trepte sus, trepte jos",
      "s1-2-3-z5-mental": "Trei lucruri din cameră",
      "s1-2-3-z5-resurse": "Lumina aprinsă — sau stinsă?",
      "s1-2-3-z5-social": "Vizită scurtă",
      "s1-2-3-z6-fizic": "Nisip, iarbă, pietre",
      "s1-2-3-z6-mental": "Pasăre — sau mașină?",
      "s1-2-3-z6-resurse": "Udăm o plantă",
      "s1-2-3-z6-social": "Eu în curte, tu pe lângă",
      "s1-2-3-z7-fizic": "Plimbare liberă",
      "s1-2-3-z7-mental": "Cartea preferată",
      "s1-2-3-z7-resurse": "Hainele la loc",
      "s1-2-3-z7-social": "Noapte bună",
      "s2-2-3-z1-fizic": "Pași până la robinet",
      "s2-2-3-z1-mental": "Uite apa",
      "s2-2-3-z1-resurse": "Paharul cu apă",
      "s2-2-3-z1-social": "Cer apă",
      "s2-2-3-z2-fizic": "Turnăm cu grijă",
      "s2-2-3-z2-mental": "Gol — sau plin?",
      "s2-2-3-z2-resurse": "Udăm planta",
      "s2-2-3-z2-social": "Beau cu tine",
      "s2-2-3-z3-fizic": "Stropi pe mână",
      "s2-2-3-z3-mental": "Unde e paharul?",
      "s2-2-3-z3-resurse": "Ștergem apa",
      "s2-2-3-z3-social": "Mulțumesc pentru apă",
      "s2-2-3-z4-fizic": "Cărăm paharul gol",
      "s2-2-3-z4-mental": "Apă — sau uscat?",
      "s2-2-3-z4-resurse": "Paharul la loc",
      "s2-2-3-z4-social": "O înghițitură pe rând",
      "s2-2-3-z5-fizic": "Stropi pe geam",
      "s2-2-3-z5-mental": "Auzim apa",
      "s2-2-3-z5-resurse": "Oprim robinetul",
      "s2-2-3-z5-social": "Uite apa",
      "s2-2-3-z6-fizic": "Băltoaca, pe scurt",
      "s2-2-3-z6-mental": "Nor — sau soare?",
      "s2-2-3-z6-resurse": "Două frunze ude",
      "s2-2-3-z6-social": "Lângă apă",
      "s2-2-3-z7-fizic": "Plimbare liberă",
      "s2-2-3-z7-mental": "Cartea cu apa",
      "s2-2-3-z7-resurse": "Prosopul la loc",
      "s2-2-3-z7-social": "Noapte bună",
    };
    expect(Object.keys(expected)).toHaveLength(56);
    const byId = Object.fromEntries(
      [1, 2].flatMap((week) =>
        getSeedActivities(week).map((row) => [row.id, row.titlu]),
      ),
    );
    for (const [id, titlu] of Object.entries(expected)) {
      expect(byId[id]).toBe(titlu);
    }
  });
  test("S3 Mon–Thu titles are invitation lines (S3 complete L–D)", () => {
    const byId = Object.fromEntries(
      getSeedActivities(3).map((row) => [row.id, row.titlu]),
    );
    expect(byId["s3-2-3-z1-fizic"]).toBe("Pași care se aud");
    expect(byId["s3-2-3-z1-mental"]).toBe("Liniște scurtă");
    expect(byId["s3-2-3-z1-resurse"]).toBe("Jucăria sonoră la loc");
    expect(byId["s3-2-3-z1-social"]).toBe("Spunem numele");
    expect(byId["s3-2-3-z2-fizic"]).toBe("Bătăi din palme");
    expect(byId["s3-2-3-z2-mental"]).toBe("Unde e sunetul?");
    expect(byId["s3-2-3-z2-resurse"]).toBe("Jucăria la loc");
    expect(byId["s3-2-3-z2-social"]).toBe("Ascultăm");
    expect(byId["s3-2-3-z3-fizic"]).toBe("Dans scurt");
    expect(byId["s3-2-3-z3-mental"]).toBe("Tare — sau încet?");
    expect(byId["s3-2-3-z3-resurse"]).toBe("Gata cu cântatul");
    expect(byId["s3-2-3-z3-social"]).toBe("Cântăm puțin");
    expect(byId["s3-2-3-z4-fizic"]).toBe("Sărituri pe bătăi");
    expect(byId["s3-2-3-z4-mental"]).toBe("Pasăre — sau mașină?");
    expect(byId["s3-2-3-z4-resurse"]).toBe("Ușa închisă încet");
    expect(byId["s3-2-3-z4-social"]).toBe("Rândul tău");
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
  });
  test("S21–S52 titles are locked invitation lines for L–D × 4 pillars", () => {
    const expected: Record<string, string> = {
      "s21-2-3-z1-fizic": "Mâna pe geam",
      "s21-2-3-z1-mental": "Geam și afară",
      "s21-2-3-z1-resurse": "Perdeaua la loc",
      "s21-2-3-z1-social": "Privim geamul împreună",
      "s21-2-3-z2-fizic": "Deget pe geam rece",
      "s21-2-3-z2-mental": "Gheață pe geam?",
      "s21-2-3-z2-resurse": "Cârpa de geam",
      "s21-2-3-z2-social": "Arătăm geamul adultului",
      "s21-2-3-z3-fizic": "De la geam la canapea caldă",
      "s21-2-3-z3-mental": "Rece afară, cald în casă",
      "s21-2-3-z3-resurse": "Pătura pe canapea",
      "s21-2-3-z3-social": "Ne încălzim împreună",
      "s21-2-3-z4-fizic": "Suflăm pe geam",
      "s21-2-3-z4-mental": "Abur pe geam",
      "s21-2-3-z4-resurse": "Ștergem aburul și cârpa la loc",
      "s21-2-3-z4-social": "Suflăm pe rând pe geam",
      "s21-2-3-z5-fizic": "Pervazul: mână pe pervaz",
      "s21-2-3-z5-mental": "Lumină la geam",
      "s21-2-3-z5-resurse": "Obiectul de pe pervaz la loc",
      "s21-2-3-z5-social": "Pervazul cu adultul",
      "s21-2-3-z6-fizic": "Geam, apoi pași în casă",
      "s21-2-3-z6-mental": "Iarnă afară, casă caldă",
      "s21-2-3-z6-resurse": "Șosetele la loc după geam",
      "s21-2-3-z6-social": "Spunem adultului: geam rece",
      "s21-2-3-z7-fizic": "Plimbare liberă în casă, geam la final",
      "s21-2-3-z7-mental": "Carte: iarnă și casă",
      "s21-2-3-z7-resurse": "Cartea și pătura pe raft",
      "s21-2-3-z7-social": "Noapte bună",
      "s22-2-3-z1-fizic": "Balans ușor pe loc",
      "s22-2-3-z1-mental": "Corp care se mișcă",
      "s22-2-3-z1-resurse": "Spațiu liber pe jos",
      "s22-2-3-z1-social": "Dansăm împreună",
      "s22-2-3-z2-fizic": "Târâit pe jos câțiva pași",
      "s22-2-3-z2-mental": "Jos pe podea",
      "s22-2-3-z2-resurse": "Covorul — sau zona de joacă liberă",
      "s22-2-3-z2-social": "Târâim pe rând",
      "s22-2-3-z3-fizic": "Sărituri mici pe loc",
      "s22-2-3-z3-mental": "Unu, doi — sărituri",
      "s22-2-3-z3-resurse": "Pernuța pe canapea după sărituri",
      "s22-2-3-z3-social": "Sărim lângă adult",
      "s22-2-3-z4-fizic": "Brațe sus și jos",
      "s22-2-3-z4-mental": "Sus și jos cu brațele",
      "s22-2-3-z4-resurse": "Jucăria de dans la loc",
      "s22-2-3-z4-social": "Brațe sus împreună",
      "s22-2-3-z5-fizic": "Pași pe loc în casă",
      "s22-2-3-z5-mental": "Mișcare, apoi gata",
      "s22-2-3-z5-resurse": "Spațiul de mișcare strâns",
      "s22-2-3-z5-social": "Pași pe loc cu mama — sau tata",
      "s22-2-3-z6-fizic": "Dans scurt, apoi așezat",
      "s22-2-3-z6-mental": "Mișcare și liniște în corp",
      "s22-2-3-z6-resurse": "Mingea moale în cutie după dans",
      "s22-2-3-z6-social": "Arătăm mișcarea adultului",
      "s22-2-3-z7-fizic": "Plimbare liberă, un dans la final",
      "s22-2-3-z7-mental": "Carte: copii care se mișcă",
      "s22-2-3-z7-resurse": "Jucăriile de mișcare pe raft",
      "s22-2-3-z7-social": "Noapte bună",
      "s23-2-3-z1-fizic": "Nas aproape de pâine",
      "s23-2-3-z1-mental": "Pâine: miros",
      "s23-2-3-z1-resurse": "Pâinea în coș — sau pe masă la loc",
      "s23-2-3-z1-social": "Mirosim pâinea împreună",
      "s23-2-3-z2-fizic": "Mâini și săpun",
      "s23-2-3-z2-mental": "Săpun: miros curat",
      "s23-2-3-z2-resurse": "Săpunul la loc lângă chiuvetă",
      "s23-2-3-z2-social": "Spălăm mâinile cu adultul",
      "s23-2-3-z3-fizic": "Cană cu ceai răcit — miros",
      "s23-2-3-z3-mental": "Ceai: cald răcit, miros",
      "s23-2-3-z3-resurse": "Cana pe masă — sau la chiuvetă",
      "s23-2-3-z3-social": "Mirosim ceaiul cu adultul",
      "s23-2-3-z4-fizic": "Prosopul curat la nas",
      "s23-2-3-z4-mental": "Curat: miros de rufe",
      "s23-2-3-z4-resurse": "Prosopul pe cârlig — sau la loc",
      "s23-2-3-z4-social": "Arătăm prosopul adultului",
      "s23-2-3-z5-fizic": "Măr sau fruct — miros",
      "s23-2-3-z5-mental": "Trei mirosuri: pâine, săpun, ceai",
      "s23-2-3-z5-resurse": "Fructul în farfurie — sau coș",
      "s23-2-3-z5-social": "Spunem adultului ce am mirosit",
      "s23-2-3-z6-fizic": "Bucătăria: pași și miros",
      "s23-2-3-z6-mental": "Miros în casă, gata",
      "s23-2-3-z6-resurse": "Farfuria și cana la loc",
      "s23-2-3-z6-social": "Mirosim în bucătărie cu adultul",
      "s23-2-3-z7-fizic": "Plimbare liberă în casă, un miros la final",
      "s23-2-3-z7-mental": "Carte: mâncare și casă",
      "s23-2-3-z7-resurse": "Obiectele de miros la loc",
      "s23-2-3-z7-social": "Noapte bună",
      "s24-2-3-z1-fizic": "Mână ridicată: salut",
      "s24-2-3-z1-mental": "Bună — cuvânt scurt",
      "s24-2-3-z1-resurse": "Jucăria de salut pe raft",
      "s24-2-3-z1-social": "Spunem bună adultului",
      "s24-2-3-z2-fizic": "Fluturăm mâna: la revedere",
      "s24-2-3-z2-mental": "Bună și la revedere",
      "s24-2-3-z2-resurse": "Haina de oaspete pe cârlig",
      "s24-2-3-z2-social": "La revedere adultului",
      "s24-2-3-z3-fizic": "Ducem o jucărie „oaspetelui”",
      "s24-2-3-z3-mental": "Oaspete în casă",
      "s24-2-3-z3-resurse": "Scaunul liber pentru oaspete",
      "s24-2-3-z3-social": "Oferim jucăria adultului-oaspete",
      "s24-2-3-z4-fizic": "Ne așezăm lângă oaspete",
      "s24-2-3-z4-mental": "Aproape, lin",
      "s24-2-3-z4-resurse": "Paharul pe masă pentru oaspete",
      "s24-2-3-z4-social": "Stăm lângă oaspete fără forțare",
      "s24-2-3-z5-fizic": "Pași până la ușă: salut",
      "s24-2-3-z5-mental": "Familie: mama, tata, copil",
      "s24-2-3-z5-resurse": "Pantofii de oaspete la loc",
      "s24-2-3-z5-social": "Salut la ușă cu adultul",
      "s24-2-3-z6-fizic": "Poză de familie — arătăm cu degetul",
      "s24-2-3-z6-mental": "Cine e în poză",
      "s24-2-3-z6-resurse": "Poza — sau albumul pe raft",
      "s24-2-3-z6-social": "Arătăm poza adultului",
      "s24-2-3-z7-fizic": "Plimbare liberă, salut la final",
      "s24-2-3-z7-mental": "Carte: familie și casă",
      "s24-2-3-z7-resurse": "Jucăria-oaspete pe raft",
      "s24-2-3-z7-social": "Noapte bună",
      "s25-2-3-z1-fizic": "Aprindem lampa",
      "s25-2-3-z1-mental": "Lumină și seară",
      "s25-2-3-z1-resurse": "Lampa pe noptieră la loc",
      "s25-2-3-z1-social": "Lumina de seară împreună",
      "s25-2-3-z2-fizic": "Tragem perdeaua seara",
      "s25-2-3-z2-mental": "Întuneric blând afară",
      "s25-2-3-z2-resurse": "Perdeaua închisă la loc",
      "s25-2-3-z2-social": "Perdeaua cu adultul",
      "s25-2-3-z3-fizic": "Pătura pe pat seara",
      "s25-2-3-z3-mental": "Pat și somn",
      "s25-2-3-z3-resurse": "Perna și pătura la loc",
      "s25-2-3-z3-social": "Ne așezăm pe pat împreună",
      "s25-2-3-z4-fizic": "Cartea de seară: întoarcem pagina",
      "s25-2-3-z4-mental": "Imaginea din cartea de seară",
      "s25-2-3-z4-resurse": "Cartea pe noptieră",
      "s25-2-3-z4-social": "Citire scurtă lângă adult",
      "s25-2-3-z5-fizic": "Mâinile la chiuvetă seara",
      "s25-2-3-z5-mental": "Curat și gata de somn",
      "s25-2-3-z5-resurse": "Prosopul la loc după spălat",
      "s25-2-3-z5-social": "Spălăm mâinile pe rând",
      "s25-2-3-z6-fizic": "Stingem lumina",
      "s25-2-3-z6-mental": "Aprins și stins",
      "s25-2-3-z6-resurse": "Lumina de veghe pe noptieră",
      "s25-2-3-z6-social": "Stingem pe rând",
      "s25-2-3-z7-fizic": "Plimbare liberă, lumină la final",
      "s25-2-3-z7-mental": "Carte: noapte și lumină",
      "s25-2-3-z7-resurse": "Cartea și pătura la loc seara",
      "s25-2-3-z7-social": "Noapte bună",
      "s26-2-3-z1-fizic": "Geamul favorit",
      "s26-2-3-z1-mental": "Ne amintim: geam",
      "s26-2-3-z1-resurse": "Perdeaua la loc, ca înainte",
      "s26-2-3-z1-social": "Privim geamul împreună din nou",
      "s26-2-3-z2-fizic": "Dansul favorit pe loc",
      "s26-2-3-z2-mental": "Ne amintim: corp și dans",
      "s26-2-3-z2-resurse": "Spațiu liber pentru dansul vechi",
      "s26-2-3-z2-social": "Dansăm din nou împreună",
      "s26-2-3-z3-fizic": "Cartea iubită: pagina lui",
      "s26-2-3-z3-mental": "Ne amintim imaginea din carte",
      "s26-2-3-z3-resurse": "Cartea favorită pe raft",
      "s26-2-3-z3-social": "Citim favorita cu adultul",
      "s26-2-3-z4-fizic": "Mingea favorită: dat",
      "s26-2-3-z4-mental": "Ne amintim: minge și rând",
      "s26-2-3-z4-resurse": "Mingea în cutie din nou",
      "s26-2-3-z4-social": "Mingea pe rând, ca înainte",
      "s26-2-3-z5-fizic": "Trei obiecte favorite pe masă",
      "s26-2-3-z5-mental": "Ne amintim: unde e?",
      "s26-2-3-z5-resurse": "Trei lucruri la loc, ca înainte",
      "s26-2-3-z5-social": "Arătăm favoritele adultului",
      "s26-2-3-z6-fizic": "Mirosul favorit",
      "s26-2-3-z6-mental": "Pâine — sau săpun?",
      "s26-2-3-z6-resurse": "Obiectul de miros la loc",
      "s26-2-3-z6-social": "Mirosim din nou împreună",
      "s26-2-3-z7-fizic": "Plimbare liberă, un favorit la final",
      "s26-2-3-z7-mental": "Carte: jumătate de an împreună",
      "s26-2-3-z7-resurse": "Favoritele pe raft la final",
      "s26-2-3-z7-social": "Noapte bună",
      "s27-2-3-z1-fizic": "Mâna pe geam: vremea",
      "s27-2-3-z1-mental": "Zăpadă — sau ploaie?",
      "s27-2-3-z1-resurse": "Perdeaua trasă la geam",
      "s27-2-3-z1-social": "Privim vremea împreună",
      "s27-2-3-z2-fizic": "Deget pe geam: urmărim picături",
      "s27-2-3-z2-mental": "Picătură — sau fulg?",
      "s27-2-3-z2-resurse": "Cârpa de geam după privire",
      "s27-2-3-z2-social": "Arătăm vremea adultului",
      "s27-2-3-z3-fizic": "Urechea la geam",
      "s27-2-3-z3-mental": "Sunet afară, liniște în casă",
      "s27-2-3-z3-resurse": "Geamul și cârpa la loc",
      "s27-2-3-z3-social": "Ascultăm ploaia împreună",
      "s27-2-3-z4-fizic": "De la geam rece la cameră caldă",
      "s27-2-3-z4-mental": "Rece afară, cald în casă",
      "s27-2-3-z4-resurse": "Pătura după geamul rece",
      "s27-2-3-z4-social": "Ne încălzim după geam",
      "s27-2-3-z5-fizic": "Suflăm pe geam: abur și vreme",
      "s27-2-3-z5-mental": "Abur, apoi afară",
      "s27-2-3-z5-resurse": "Ștergem aburul, cârpa la loc",
      "s27-2-3-z5-social": "Suflăm pe rând la geam",
      "s27-2-3-z6-fizic": "Numărăm fulgi",
      "s27-2-3-z6-mental": "Multă zăpadă — sau ploaie?",
      "s27-2-3-z6-resurse": "Obiectul de pe pervaz la loc",
      "s27-2-3-z6-social": "Spunem adultului ce e afară",
      "s27-2-3-z7-fizic": "Plimbare liberă, geam la final",
      "s27-2-3-z7-mental": "Cartea cu vremea",
      "s27-2-3-z7-resurse": "Cartea și cârpa pe raft",
      "s27-2-3-z7-social": "Noapte bună",
      "s28-2-3-z1-fizic": "Cizmele pe picioare",
      "s28-2-3-z1-mental": "Cizmă și picior",
      "s28-2-3-z1-resurse": "Cizmele lângă ușă la loc",
      "s28-2-3-z1-social": "Cizmele cu adultul",
      "s28-2-3-z2-fizic": "Deget pe noroi",
      "s28-2-3-z2-mental": "Moale — sau tare?",
      "s28-2-3-z2-resurse": "Cârpa de noroi la loc",
      "s28-2-3-z2-social": "Privim noroiul împreună",
      "s28-2-3-z3-fizic": "Pași scurți în curte cu cizme",
      "s28-2-3-z3-mental": "Curte și casă",
      "s28-2-3-z3-resurse": "Cizmele scuturate la ușă",
      "s28-2-3-z3-social": "Pași în curte cu adultul",
      "s28-2-3-z4-fizic": "Apă pe pământ: dezgheț",
      "s28-2-3-z4-mental": "Dezgheț: apă și pământ",
      "s28-2-3-z4-resurse": "Paharul de apă la loc",
      "s28-2-3-z4-social": "Turnăm apa pe rând",
      "s28-2-3-z5-fizic": "Ștergem cizmele pe preș",
      "s28-2-3-z5-mental": "Murdar și curat",
      "s28-2-3-z5-resurse": "Cizmele curate lângă ușă",
      "s28-2-3-z5-social": "Ștergem pe rând pe preș",
      "s28-2-3-z6-fizic": "Mâini la chiuvetă după curte",
      "s28-2-3-z6-mental": "Texturi: noroi, apoi apă",
      "s28-2-3-z6-resurse": "Prosopul după curte la loc",
      "s28-2-3-z6-social": "Spălăm după curte împreună",
      "s28-2-3-z7-fizic": "Plimbare liberă în curte",
      "s28-2-3-z7-mental": "Carte: curte și primăvară",
      "s28-2-3-z7-resurse": "Cizmele și cârpa la loc",
      "s28-2-3-z7-social": "Noapte bună",
      "s29-2-3-z1-fizic": "Atingem iarba nouă",
      "s29-2-3-z1-mental": "Verde: iarbă nouă",
      "s29-2-3-z1-resurse": "Ghiveciul pe pervaz la loc",
      "s29-2-3-z1-social": "Privim iarba împreună",
      "s29-2-3-z2-fizic": "Deget pe mugure",
      "s29-2-3-z2-mental": "Mugure și frunză",
      "s29-2-3-z2-resurse": "Ramura la loc",
      "s29-2-3-z2-social": "Mugurele cu adultul",
      "s29-2-3-z3-fizic": "Pași scurți pe iarbă",
      "s29-2-3-z3-mental": "Iarbă și pământ",
      "s29-2-3-z3-resurse": "Pantofii lângă ușă după iarbă",
      "s29-2-3-z3-social": "Pași pe iarbă cu adultul",
      "s29-2-3-z4-fizic": "Mirosim planta verde",
      "s29-2-3-z4-mental": "Plantă: verde și frunză",
      "s29-2-3-z4-resurse": "Planta pe pervaz după miros",
      "s29-2-3-z4-social": "Mirosim planta pe rând",
      "s29-2-3-z5-fizic": "Udăm iarba",
      "s29-2-3-z5-mental": "Apă pentru plantă",
      "s29-2-3-z5-resurse": "Stropitoarea la loc",
      "s29-2-3-z5-social": "Udăm pe rând",
      "s29-2-3-z6-fizic": "Culegem o frunză căzută",
      "s29-2-3-z6-mental": "Frunză pe pământ, iarbă pe loc",
      "s29-2-3-z6-resurse": "Frunza în coș",
      "s29-2-3-z6-social": "Arătăm frunza adultului",
      "s29-2-3-z7-fizic": "Plimbare liberă la iarbă",
      "s29-2-3-z7-mental": "Carte: iarbă și plantă",
      "s29-2-3-z7-resurse": "Planta și stropitoarea la loc",
      "s29-2-3-z7-social": "Noapte bună",
      "s30-2-3-z1-fizic": "La geam dimineața: ascultăm",
      "s30-2-3-z1-mental": "Pasăre: sunet afară",
      "s30-2-3-z1-resurse": "Perdeaua trasă pentru sunet",
      "s30-2-3-z1-social": "Ascultăm păsările împreună",
      "s30-2-3-z2-fizic": "Arătăm spre cer",
      "s30-2-3-z2-mental": "Sus: pasăre pe creangă",
      "s30-2-3-z2-resurse": "Geamul liber după privit",
      "s30-2-3-z2-social": "Arătăm pasărea adultului",
      "s30-2-3-z3-fizic": "Ieșim scurt: urechi afară",
      "s30-2-3-z3-mental": "Casă și afară: sunete",
      "s30-2-3-z3-resurse": "Ușa închisă după ascultat",
      "s30-2-3-z3-social": "Ascultăm afară cu adultul",
      "s30-2-3-z4-fizic": "Imităm ciripit",
      "s30-2-3-z4-mental": "Ciripit și liniște",
      "s30-2-3-z4-resurse": "Jucăria-pasăre pe raft",
      "s30-2-3-z4-social": "Ciripim pe rând",
      "s30-2-3-z5-fizic": "Privim o pasăre",
      "s30-2-3-z5-mental": "Pasăre: zboară",
      "s30-2-3-z5-resurse": "Binoclul de jucărie la loc",
      "s30-2-3-z5-social": "Privim pasărea împreună",
      "s30-2-3-z6-fizic": "Brațe ca aripile",
      "s30-2-3-z6-mental": "Aripi și corp",
      "s30-2-3-z6-resurse": "Spațiu liber pentru aripi",
      "s30-2-3-z6-social": "Aripi împreună",
      "s30-2-3-z7-fizic": "Plimbare liberă, urechi la final",
      "s30-2-3-z7-mental": "Carte: păsări",
      "s30-2-3-z7-resurse": "Cartea și jucăria-pasăre la loc",
      "s30-2-3-z7-social": "Noapte bună",
      "s31-2-3-z1-fizic": "Ținem o sămânță",
      "s31-2-3-z1-mental": "Sămânță: mică",
      "s31-2-3-z1-resurse": "Semințele în cutie la loc",
      "s31-2-3-z1-social": "Arătăm sămânța adultului",
      "s31-2-3-z2-fizic": "Punem sămânța în pământ",
      "s31-2-3-z2-mental": "Sămânță și pământ",
      "s31-2-3-z2-resurse": "Ghiveciul pe masă după plantat",
      "s31-2-3-z2-social": "Plantăm pe rând",
      "s31-2-3-z3-fizic": "Udăm sămânța",
      "s31-2-3-z3-mental": "Udat: apă pe pământ",
      "s31-2-3-z3-resurse": "Paharul de udat la loc",
      "s31-2-3-z3-social": "Udăm împreună",
      "s31-2-3-z4-fizic": "Deget în pământ umed",
      "s31-2-3-z4-mental": "Umed și uscat",
      "s31-2-3-z4-resurse": "Mâinile pe prosop după pământ",
      "s31-2-3-z4-social": "Atingem pământul pe rând",
      "s31-2-3-z5-fizic": "Cărăm stropitoarea câțiva pași",
      "s31-2-3-z5-mental": "Stropitoare și grijă",
      "s31-2-3-z5-resurse": "Stropitoarea lângă plantă la loc",
      "s31-2-3-z5-social": "Cărăm pe rând stropitoarea",
      "s31-2-3-z6-fizic": "Privim ghiveciul: a crescut?",
      "s31-2-3-z6-mental": "Așteptăm: sămânță apoi plantă",
      "s31-2-3-z6-resurse": "Ghiveciul pe lumină la loc",
      "s31-2-3-z6-social": "Privim ghiveciul împreună",
      "s31-2-3-z7-fizic": "Plimbare liberă, udat la final",
      "s31-2-3-z7-mental": "Carte: sămânță și plantă",
      "s31-2-3-z7-resurse": "Semințele și stropitoarea la loc",
      "s31-2-3-z7-social": "Noapte bună",
      "s32-2-3-z1-fizic": "Ținem mingea afară",
      "s32-2-3-z1-mental": "Minge: rotundă",
      "s32-2-3-z1-resurse": "Mingea lângă ușă înainte de joacă",
      "s32-2-3-z1-social": "Mingea afară cu adultul",
      "s32-2-3-z2-fizic": "Dăm mingea afară",
      "s32-2-3-z2-mental": "Dat și primit",
      "s32-2-3-z2-resurse": "Mingea pe iarbă la loc scurt",
      "s32-2-3-z2-social": "Dăm mingea pe rând afară",
      "s32-2-3-z3-fizic": "Aruncăm mingea jos",
      "s32-2-3-z3-mental": "Sus și jos: minge",
      "s32-2-3-z3-resurse": "Mingea în coș după aruncat",
      "s32-2-3-z3-social": "Aruncăm pe rând jos",
      "s32-2-3-z4-fizic": "Urmărim mingea pe iarbă",
      "s32-2-3-z4-mental": "Minge: unde e?",
      "s32-2-3-z4-resurse": "Mingea adusă lângă ușă",
      "s32-2-3-z4-social": "Căutăm mingea împreună",
      "s32-2-3-z5-fizic": "Picioarele lângă minge",
      "s32-2-3-z5-mental": "Mână și picior la minge",
      "s32-2-3-z5-resurse": "Mingea în cutie după curte",
      "s32-2-3-z5-social": "Mingea cu piciorul pe rând",
      "s32-2-3-z6-fizic": "Aducem mingea în casă",
      "s32-2-3-z6-mental": "Afară și casă: minge",
      "s32-2-3-z6-resurse": "Mingea pe raft după afară",
      "s32-2-3-z6-social": "Intrăm cu mingea împreună",
      "s32-2-3-z7-fizic": "Plimbare liberă, minge la final",
      "s32-2-3-z7-mental": "Carte: minge și afară",
      "s32-2-3-z7-resurse": "Mingea și pantofii la loc",
      "s32-2-3-z7-social": "Noapte bună",
      "s33-2-3-z1-fizic": "Mâna în nisip",
      "s33-2-3-z1-mental": "Nisip: moale",
      "s33-2-3-z1-resurse": "Găleata lângă nisip",
      "s33-2-3-z1-social": "Privim nisipul împreună",
      "s33-2-3-z2-fizic": "Umplem găleata puțin",
      "s33-2-3-z2-mental": "Găleată: plină și goală",
      "s33-2-3-z2-resurse": "Găleata pe raft după joacă",
      "s33-2-3-z2-social": "Umplem pe rând",
      "s33-2-3-z3-fizic": "Turnăm nisip din găleată",
      "s33-2-3-z3-mental": "Jos: nisip pe pământ",
      "s33-2-3-z3-resurse": "Nisipul înapoi în cutie",
      "s33-2-3-z3-social": "Turnăm nisip cu adultul",
      "s33-2-3-z4-fizic": "Degete prin nisip",
      "s33-2-3-z4-mental": "Urme în nisip",
      "s33-2-3-z4-resurse": "Lopata mică la loc",
      "s33-2-3-z4-social": "Arătăm urma adultului",
      "s33-2-3-z5-fizic": "Cărăm găleata doi pași",
      "s33-2-3-z5-mental": "Greu și ușor: găleata",
      "s33-2-3-z5-resurse": "Găleata și lopata împreună la loc",
      "s33-2-3-z5-social": "Cărăm găleata împreună",
      "s33-2-3-z6-fizic": "Formă mică în nisip",
      "s33-2-3-z6-mental": "Rotund: găleata pe nisip",
      "s33-2-3-z6-resurse": "Forma și nisipul la loc",
      "s33-2-3-z6-social": "Facem forma pe rând",
      "s33-2-3-z7-fizic": "Plimbare liberă la nisip",
      "s33-2-3-z7-mental": "Carte: nisip și găleată",
      "s33-2-3-z7-resurse": "Găleata și lopata la loc",
      "s33-2-3-z7-social": "Noapte bună",
      "s34-2-3-z1-fizic": "Ieșim la soare",
      "s34-2-3-z1-mental": "Umbră pe pământ",
      "s34-2-3-z1-resurse": "Pantofii lângă ușă după soare",
      "s34-2-3-z1-social": "Privim umbra împreună",
      "s34-2-3-z2-fizic": "Mâna face umbră",
      "s34-2-3-z2-mental": "Mână și umbră",
      "s34-2-3-z2-resurse": "Spațiu liber pe pământ",
      "s34-2-3-z2-social": "Arătăm umbra adultului",
      "s34-2-3-z3-fizic": "Pași pe umbră",
      "s34-2-3-z3-mental": "Lungă și scurtă: umbra",
      "s34-2-3-z3-resurse": "Ușa închisă după umbre",
      "s34-2-3-z3-social": "Pași pe umbră cu adultul",
      "s34-2-3-z4-fizic": "Umbră de frunză",
      "s34-2-3-z4-mental": "Copac și umbră",
      "s34-2-3-z4-resurse": "Frunza căzută în coș",
      "s34-2-3-z4-social": "Privim umbra copacului împreună",
      "s34-2-3-z5-fizic": "Corpul face umbră mare",
      "s34-2-3-z5-mental": "Eu și umbra mea",
      "s34-2-3-z5-resurse": "Pălăria la loc",
      "s34-2-3-z5-social": "Umbrele noastre una lângă alta",
      "s34-2-3-z6-fizic": "Urmărim umbra care se mișcă",
      "s34-2-3-z6-mental": "Stă și se mișcă: umbra",
      "s34-2-3-z6-resurse": "Obiectul de umbră pe raft",
      "s34-2-3-z6-social": "Mișcăm umbra pe rând",
      "s34-2-3-z7-fizic": "Plimbare liberă, umbră la final",
      "s34-2-3-z7-mental": "Carte: soare și umbră",
      "s34-2-3-z7-resurse": "Pantofii și pălăria la loc",
      "s34-2-3-z7-social": "Noapte bună",
      "s35-2-3-z1-fizic": "Atingem apa afară",
      "s35-2-3-z1-mental": "Apă: udă",
      "s35-2-3-z1-resurse": "Vasul cu apă pe masă afară",
      "s35-2-3-z1-social": "Privim apa împreună",
      "s35-2-3-z2-fizic": "Turnăm apă din pahar",
      "s35-2-3-z2-mental": "Pahar: plin și gol",
      "s35-2-3-z2-resurse": "Paharul la loc după turnat",
      "s35-2-3-z2-social": "Turnăm pe rând",
      "s35-2-3-z3-fizic": "Udăm o plantă afară",
      "s35-2-3-z3-mental": "Plantă bea apă",
      "s35-2-3-z3-resurse": "Stropitoarea la loc",
      "s35-2-3-z3-social": "Udăm planta cu adultul",
      "s35-2-3-z4-fizic": "Stropim pământul",
      "s35-2-3-z4-mental": "Pământ ud și uscat",
      "s35-2-3-z4-resurse": "Apa rămasă înapoi în vas",
      "s35-2-3-z4-social": "Stropim pe rând",
      "s35-2-3-z5-fizic": "Mâinile în apă",
      "s35-2-3-z5-mental": "Rece: apa afară",
      "s35-2-3-z5-resurse": "Prosopul la loc după mâini",
      "s35-2-3-z5-social": "Mâinile în apă pe rând",
      "s35-2-3-z6-fizic": "Picături pe piatră",
      "s35-2-3-z6-mental": "Picătură: mică",
      "s35-2-3-z6-resurse": "Paharul și vasul la loc",
      "s35-2-3-z6-social": "Facem picături împreună",
      "s35-2-3-z7-fizic": "Plimbare liberă, apă la final",
      "s35-2-3-z7-mental": "Carte: apă afară",
      "s35-2-3-z7-resurse": "Vasul și stropitoarea la loc",
      "s35-2-3-z7-social": "Noapte bună",
      "s36-2-3-z1-fizic": "Ieșim: privim",
      "s36-2-3-z1-mental": "Insectă: mică",
      "s36-2-3-z1-resurse": "Pantofii lângă ușă după privit",
      "s36-2-3-z1-social": "Privim insecta împreună de departe",
      "s36-2-3-z2-fizic": "Arătăm cu degetul de departe",
      "s36-2-3-z2-mental": "Departe și aproape",
      "s36-2-3-z2-resurse": "Mâinile libere, fără prins",
      "s36-2-3-z2-social": "Arătăm insecta adultului",
      "s36-2-3-z3-fizic": "Urmărim o insectă cu ochii",
      "s36-2-3-z3-mental": "Merge: insecta pe frunză",
      "s36-2-3-z3-resurse": "Spațiu liber pe potecă",
      "s36-2-3-z3-social": "Urmărim împreună de departe",
      "s36-2-3-z4-fizic": "Ascultăm zumzet",
      "s36-2-3-z4-mental": "Zumzet și liniște",
      "s36-2-3-z4-resurse": "Ușa închisă după ascultat",
      "s36-2-3-z4-social": "Ascultăm zumzetul împreună",
      "s36-2-3-z5-fizic": "Privim fluturele de departe",
      "s36-2-3-z5-mental": "Zboară: insectă în aer",
      "s36-2-3-z5-resurse": "Binoclul de jucărie la loc",
      "s36-2-3-z5-social": "Privim fluturele împreună",
      "s36-2-3-z6-fizic": "Pași moi lângă insectă",
      "s36-2-3-z6-mental": "Grijă: nu atingem",
      "s36-2-3-z6-resurse": "Poteca liberă după pași",
      "s36-2-3-z6-social": "Pași moi cu adultul",
      "s36-2-3-z7-fizic": "Plimbare liberă, privit la final",
      "s36-2-3-z7-mental": "Carte: insecte",
      "s36-2-3-z7-resurse": "Cartea și binoclul la loc",
      "s36-2-3-z7-social": "Noapte bună",
      "s37-2-3-z1-fizic": "Intrăm în umbră",
      "s37-2-3-z1-mental": "Umbră: răcoare",
      "s37-2-3-z1-resurse": "Paharul cu apă la umbră",
      "s37-2-3-z1-social": "Stăm la umbră împreună",
      "s37-2-3-z2-fizic": "Așezăm pe scaun la umbră",
      "s37-2-3-z2-mental": "Soare și umbră",
      "s37-2-3-z2-resurse": "Pălăria pe scaun la umbră",
      "s37-2-3-z2-social": "Pauză scurtă cu adultul",
      "s37-2-3-z3-fizic": "Bem apă la umbră",
      "s37-2-3-z3-mental": "Apă: rece",
      "s37-2-3-z3-resurse": "Paharul gol pe masă",
      "s37-2-3-z3-social": "Bem pe rând la umbră",
      "s37-2-3-z4-fizic": "Din soare în umbră, doi pași",
      "s37-2-3-z4-mental": "Cald și răcoare",
      "s37-2-3-z4-resurse": "Pantofii la umbră lângă ușă",
      "s37-2-3-z4-social": "Mergem în umbră cu adultul",
      "s37-2-3-z5-fizic": "Aer pe față la umbră",
      "s37-2-3-z5-mental": "Aer: blând",
      "s37-2-3-z5-resurse": "Evantaiul pe masă după",
      "s37-2-3-z5-social": "Facem aer pe rând",
      "s37-2-3-z6-fizic": "Odihnă scurtă pe pătură la umbră",
      "s37-2-3-z6-mental": "Loc răcoros: aici",
      "s37-2-3-z6-resurse": "Pătura rulată la loc",
      "s37-2-3-z6-social": "Pe pătură unul lângă altul",
      "s37-2-3-z7-fizic": "Plimbare liberă, umbră la final",
      "s37-2-3-z7-mental": "Carte: umbră și răcoare",
      "s37-2-3-z7-resurse": "Paharul și pălăria la loc",
      "s37-2-3-z7-social": "Noapte bună",
      "s38-2-3-z1-fizic": "Piciorul pe iarbă",
      "s38-2-3-z1-mental": "Iarbă: verde",
      "s38-2-3-z1-resurse": "Pantofii lângă iarbă",
      "s38-2-3-z1-social": "Privim iarba împreună",
      "s38-2-3-z2-fizic": "Desculț pe iarbă, dacă e potrivit",
      "s38-2-3-z2-mental": "Moale: iarba",
      "s38-2-3-z2-resurse": "Șosetele în pantofi",
      "s38-2-3-z2-social": "Desculți pe rând pe iarbă",
      "s38-2-3-z3-fizic": "Degetele de la picioare pe iarbă",
      "s38-2-3-z3-mental": "Gâdilă: iarba",
      "s38-2-3-z3-resurse": "Prosopul mic lângă pantofi",
      "s38-2-3-z3-social": "Arătăm iarba adultului",
      "s38-2-3-z4-fizic": "Pași scurți pe iarbă",
      "s38-2-3-z4-mental": "Iarbă și drum",
      "s38-2-3-z4-resurse": "Ușa închisă după iarbă",
      "s38-2-3-z4-social": "Pași pe iarbă cu adultul",
      "s38-2-3-z5-fizic": "Ne așezăm pe iarbă",
      "s38-2-3-z5-mental": "Jos pe iarbă",
      "s38-2-3-z5-resurse": "Pătura pe iarbă, apoi la loc",
      "s38-2-3-z5-social": "Pe iarbă unul lângă altul",
      "s38-2-3-z6-fizic": "Picior pe iarbă, picior pe piatră",
      "s38-2-3-z6-mental": "Moale și tare",
      "s38-2-3-z6-resurse": "Pantofii pe raft după iarbă",
      "s38-2-3-z6-social": "Simțim pe rând: iarbă și piatră",
      "s38-2-3-z7-fizic": "Plimbare liberă, iarbă la final",
      "s38-2-3-z7-mental": "Carte: iarbă și picioare",
      "s38-2-3-z7-resurse": "Pantofii și prosopul la loc",
      "s38-2-3-z7-social": "Noapte bună",
      "s39-2-3-z1-fizic": "Ținem un fruct",
      "s39-2-3-z1-mental": "Fruct: rotund",
      "s39-2-3-z1-resurse": "Fructul în bol pe masă",
      "s39-2-3-z1-social": "Privim fructul împreună",
      "s39-2-3-z2-fizic": "Arătăm fructul cu degetul",
      "s39-2-3-z2-mental": "Măr — sau roșie?",
      "s39-2-3-z2-resurse": "Bolul pe masă, la locul lui",
      "s39-2-3-z2-social": "Arătăm fructul adultului",
      "s39-2-3-z3-fizic": "Mirosim fructul",
      "s39-2-3-z3-mental": "Miros dulce",
      "s39-2-3-z3-resurse": "Fructul înapoi în bol",
      "s39-2-3-z3-social": "Mirosim pe rând",
      "s39-2-3-z4-fizic": "Atingem coaja fructului",
      "s39-2-3-z4-mental": "Netedă: coaja",
      "s39-2-3-z4-resurse": "Șervețelul lângă bol",
      "s39-2-3-z4-social": "Atingem fructul împreună",
      "s39-2-3-z5-fizic": "Gust mic de fruct",
      "s39-2-3-z5-mental": "Dulce: gustul",
      "s39-2-3-z5-resurse": "Farfuria mică la chiuvetă",
      "s39-2-3-z5-social": "Gustăm pe rând",
      "s39-2-3-z6-fizic": "Spălăm fructul",
      "s39-2-3-z6-mental": "Ud: fructul spălat",
      "s39-2-3-z6-resurse": "Fructul pe prosopul de bucătărie",
      "s39-2-3-z6-social": "Spălăm împreună",
      "s39-2-3-z7-fizic": "Plimbare liberă, fruct la final",
      "s39-2-3-z7-mental": "Carte: fructe",
      "s39-2-3-z7-resurse": "Bolul și farfuria la loc",
      "s39-2-3-z7-social": "Noapte bună",
      "s40-2-3-z1-fizic": "Cărăm un obiect doi pași",
      "s40-2-3-z1-mental": "Ajutor: da",
      "s40-2-3-z1-resurse": "Obiectul pe masă după cărat",
      "s40-2-3-z1-social": "Cărăm împreună",
      "s40-2-3-z2-fizic": "Punem două lucruri la loc",
      "s40-2-3-z2-mental": "Unu și doi: la loc",
      "s40-2-3-z2-resurse": "Coșul pe raft după treabă",
      "s40-2-3-z2-social": "Punem pe rând la loc",
      "s40-2-3-z3-fizic": "Ștergem masa",
      "s40-2-3-z3-mental": "Curat: masa",
      "s40-2-3-z3-resurse": "Cârpa la chiuvetă",
      "s40-2-3-z3-social": "Ștergem pe rând",
      "s40-2-3-z4-fizic": "Aducem șervețelul",
      "s40-2-3-z4-mental": "Unde e șervețelul",
      "s40-2-3-z4-resurse": "Șervețelul în suport",
      "s40-2-3-z4-social": "Dăm șervețelul adultului",
      "s40-2-3-z5-fizic": "Așezăm lingura pe masă",
      "s40-2-3-z5-mental": "Lingură lângă farfurie",
      "s40-2-3-z5-resurse": "Lingura în sertar după",
      "s40-2-3-z5-social": "Pregătim masa pe rând",
      "s40-2-3-z6-fizic": "Sortăm trei lucruri",
      "s40-2-3-z6-mental": "Trei: la loc",
      "s40-2-3-z6-resurse": "Coșul plin pe raft",
      "s40-2-3-z6-social": "Sortăm împreună",
      "s40-2-3-z7-fizic": "Plimbare liberă, treabă scurtă la final",
      "s40-2-3-z7-mental": "Carte: ajutor acasă",
      "s40-2-3-z7-resurse": "Trei lucruri la loc, gata",
      "s40-2-3-z7-social": "Noapte bună",
      "s41-2-3-z1-fizic": "Pași spre poartă",
      "s41-2-3-z1-mental": "Drum: acolo",
      "s41-2-3-z1-resurse": "Pantofii lângă ușă înainte",
      "s41-2-3-z1-social": "Mergem pe drum împreună",
      "s41-2-3-z2-fizic": "Pași pe potecă",
      "s41-2-3-z2-mental": "Aproape și departe",
      "s41-2-3-z2-resurse": "Pălăria pe cuier după drum",
      "s41-2-3-z2-social": "Pași pe rând pe potecă",
      "s41-2-3-z3-fizic": "Atingem poarta",
      "s41-2-3-z3-mental": "Poartă: închisă",
      "s41-2-3-z3-resurse": "Mâna jos, poarta rămâne",
      "s41-2-3-z3-social": "Arătăm poarta adultului",
      "s41-2-3-z4-fizic": "Cărăm un obiect până la poartă",
      "s41-2-3-z4-mental": "Înainte pe drum",
      "s41-2-3-z4-resurse": "Obiectul înapoi lângă ușă",
      "s41-2-3-z4-social": "Cărăm împreună spre poartă",
      "s41-2-3-z5-fizic": "Pauză la poartă, apoi înapoi",
      "s41-2-3-z5-mental": "Casă și poartă",
      "s41-2-3-z5-resurse": "Pantofii pe raft după drum",
      "s41-2-3-z5-social": "Pauză la poartă cu adultul",
      "s41-2-3-z6-fizic": "Privim dincolo de poartă",
      "s41-2-3-z6-mental": "Curte și drum",
      "s41-2-3-z6-resurse": "Haina pe cuier după plimbare",
      "s41-2-3-z6-social": "Joacă paralel pe drumul scurt",
      "s41-2-3-z7-fizic": "Plimbare liberă, poarta la final",
      "s41-2-3-z7-mental": "Carte: drum și casă",
      "s41-2-3-z7-resurse": "Pantofii și haina la loc",
      "s41-2-3-z7-social": "Noapte bună",
      "s42-2-3-z1-fizic": "Pași pe frunze din nou",
      "s42-2-3-z1-mental": "Vânt și frunză",
      "s42-2-3-z1-resurse": "Frunza jos la loc",
      "s42-2-3-z1-social": "Simțim vântul împreună",
      "s42-2-3-z2-fizic": "Culegem o frunză căzută",
      "s42-2-3-z2-mental": "Frunza se mișcă",
      "s42-2-3-z2-resurse": "Frunza în coș, apoi afară",
      "s42-2-3-z2-social": "Dăm frunza din mână în mână",
      "s42-2-3-z3-fizic": "Aruncăm frunze în sus",
      "s42-2-3-z3-mental": "Galbenă — sau maro?",
      "s42-2-3-z3-resurse": "Maturăm trei frunze",
      "s42-2-3-z3-social": "Aruncăm frunza pe rând",
      "s42-2-3-z4-fizic": "Eșarfa în vânt",
      "s42-2-3-z4-mental": "Eșarfa zboară puțin",
      "s42-2-3-z4-resurse": "Eșarfa pe cârlig",
      "s42-2-3-z4-social": "Ținem eșarfa doi",
      "s42-2-3-z5-fizic": "Suflăm pe o frunză",
      "s42-2-3-z5-mental": "Aer pe față",
      "s42-2-3-z5-resurse": "Frunza înapoi afară",
      "s42-2-3-z5-social": "Suflăm pe rând",
      "s42-2-3-z6-fizic": "Plimbare scurtă cu vânt și frunze",
      "s42-2-3-z6-mental": "Copacul se mișcă din nou",
      "s42-2-3-z6-resurse": "Găleata la loc după frunze",
      "s42-2-3-z6-social": "Joacă paralel cu frunze",
      "s42-2-3-z7-fizic": "Plimbare liberă, frunză la final",
      "s42-2-3-z7-mental": "Carte: vânt și frunze",
      "s42-2-3-z7-resurse": "Haina de afară pe cârlig",
      "s42-2-3-z7-social": "Noapte bună",
      "s43-2-3-z1-fizic": "Punem trei lucruri în coș",
      "s43-2-3-z1-mental": "Trei în coș",
      "s43-2-3-z1-resurse": "Coșul pe raft",
      "s43-2-3-z1-social": "Dăm un obiect din coș",
      "s43-2-3-z2-fizic": "Cărăm coșul cinci pași",
      "s43-2-3-z2-mental": "Plin și gol",
      "s43-2-3-z2-resurse": "Golim coșul pe masă, apoi la loc",
      "s43-2-3-z2-social": "Cărăm coșul împreună",
      "s43-2-3-z3-fizic": "Strângem jucării în coș",
      "s43-2-3-z3-mental": "Unde e coșul",
      "s43-2-3-z3-resurse": "Coșul lângă jucării, pe raft",
      "s43-2-3-z3-social": "Arătăm coșul adultului",
      "s43-2-3-z4-fizic": "Două grămezi în coș",
      "s43-2-3-z4-mental": "Aici și aici",
      "s43-2-3-z4-resurse": "Totul în coș după sortare",
      "s43-2-3-z4-social": "Punem în coș pe rând",
      "s43-2-3-z5-fizic": "Culegem afară în coș",
      "s43-2-3-z5-mental": "Piatră — sau frunză?",
      "s43-2-3-z5-resurse": "Lăsăm afară ce am cules",
      "s43-2-3-z5-social": "Arătăm ce am cules",
      "s43-2-3-z6-fizic": "Strângem camera cu coșul",
      "s43-2-3-z6-mental": "Mult și puțin",
      "s43-2-3-z6-resurse": "Coșul pe locul lui acasă",
      "s43-2-3-z6-social": "Strângem paralel cu adultul",
      "s43-2-3-z7-fizic": "Plimbare liberă, coș dacă vrea",
      "s43-2-3-z7-mental": "Carte: multe obiecte",
      "s43-2-3-z7-resurse": "Jucăriile în coș",
      "s43-2-3-z7-social": "Noapte bună",
      "s44-2-3-z1-fizic": "Mână ridicată: bună",
      "s44-2-3-z1-mental": "Bună — cuvânt scurt",
      "s44-2-3-z1-resurse": "Jucăria-oaspete pe raft",
      "s44-2-3-z1-social": "Stăm unul lângă altul",
      "s44-2-3-z2-fizic": "Arătăm poza de familie",
      "s44-2-3-z2-mental": "Mama, tata, tu",
      "s44-2-3-z2-resurse": "Poza pe raft",
      "s44-2-3-z2-social": "Privim poza împreună",
      "s44-2-3-z3-fizic": "Dăm jucăria-prieten din mână",
      "s44-2-3-z3-mental": "Prieten: jucăria",
      "s44-2-3-z3-resurse": "Jucăria pe pat",
      "s44-2-3-z3-social": "Oferim jucăria adultului",
      "s44-2-3-z4-fizic": "Pași până la ușă: salut",
      "s44-2-3-z4-mental": "La revedere",
      "s44-2-3-z4-resurse": "Pantofii lângă ușă după salut",
      "s44-2-3-z4-social": "Salut la ușă cu adultul",
      "s44-2-3-z5-fizic": "Batem din palme o dată împreună",
      "s44-2-3-z5-mental": "Prieten și familie",
      "s44-2-3-z5-resurse": "Paharul de oaspete pe masă, apoi la loc",
      "s44-2-3-z5-social": "Salut pe rând cu mâna",
      "s44-2-3-z6-fizic": "Joacă liberă lângă jucăria-prieten",
      "s44-2-3-z6-mental": "Familie în carte",
      "s44-2-3-z6-resurse": "Jucăriile la loc după joacă",
      "s44-2-3-z6-social": "Joacă paralel cu adultul",
      "s44-2-3-z7-fizic": "Plimbare liberă, salut la final",
      "s44-2-3-z7-mental": "Carte: familie și casă",
      "s44-2-3-z7-resurse": "Haina și jucăria la loc",
      "s44-2-3-z7-social": "Noapte bună",
      "s45-2-3-z1-fizic": "Pași mulți în casă",
      "s45-2-3-z1-mental": "Corp: puternic",
      "s45-2-3-z1-resurse": "Pantofii înainte de pași",
      "s45-2-3-z1-social": "Pași puternici împreună",
      "s45-2-3-z2-fizic": "Sărituri mici pe loc",
      "s45-2-3-z2-mental": "Sus și jos: corp",
      "s45-2-3-z2-resurse": "Mingea ușoară în palmă",
      "s45-2-3-z2-social": "Sărim pe rând",
      "s45-2-3-z3-fizic": "Cărăm ceva ușor câțiva pași",
      "s45-2-3-z3-mental": "Greu și ușor",
      "s45-2-3-z3-resurse": "Obiectul pe masă după cărat",
      "s45-2-3-z3-social": "Cărăm pe rând",
      "s45-2-3-z4-fizic": "Brațe sus, corp puternic",
      "s45-2-3-z4-mental": "Brațe și picioare",
      "s45-2-3-z4-resurse": "Mâinile pe genunchi, apoi jos",
      "s45-2-3-z4-social": "Brațe sus împreună",
      "s45-2-3-z5-fizic": "Pași pe loc, apoi înainte",
      "s45-2-3-z5-mental": "Înainte și pe loc",
      "s45-2-3-z5-resurse": "Calea liberă pe podea",
      "s45-2-3-z5-social": "Pași înainte cu adultul",
      "s45-2-3-z6-fizic": "Pași mulți dus-întors",
      "s45-2-3-z6-mental": "Mulți pași: unu și doi",
      "s45-2-3-z6-resurse": "Pantofii la loc după pași",
      "s45-2-3-z6-social": "Dus-întors cu adultul",
      "s45-2-3-z7-fizic": "Plimbare liberă, pași mulți",
      "s45-2-3-z7-mental": "Carte: corp și pași",
      "s45-2-3-z7-resurse": "Mingea și pantofii la loc",
      "s45-2-3-z7-social": "Noapte bună",
      "s46-2-3-z1-fizic": "Arătăm cu degetul",
      "s46-2-3-z1-mental": "Unde e mingea?",
      "s46-2-3-z1-resurse": "Mingea pe masă, la vedere",
      "s46-2-3-z1-social": "Arătăm mingea adultului",
      "s46-2-3-z2-fizic": "Căutăm în cameră",
      "s46-2-3-z2-mental": "Unde e jucăria?",
      "s46-2-3-z2-resurse": "Jucăria pe scaun la vedere",
      "s46-2-3-z2-social": "Căutăm pe rând",
      "s46-2-3-z3-fizic": "Arătăm ușa cu degetul",
      "s46-2-3-z3-mental": "Unde e ușa?",
      "s46-2-3-z3-resurse": "Mâna pe ușă",
      "s46-2-3-z3-social": "Arătăm ușa împreună",
      "s46-2-3-z4-fizic": "Arătăm fereastra",
      "s46-2-3-z4-mental": "Unde e fereastra?",
      "s46-2-3-z4-resurse": "Perdeaua — sau geamul?",
      "s46-2-3-z4-social": "Privim pe fereastră împreună",
      "s46-2-3-z5-fizic": "Arătăm scaunul și masa",
      "s46-2-3-z5-mental": "Unde e scaunul?",
      "s46-2-3-z5-resurse": "Paharul pe masă, arătat",
      "s46-2-3-z5-social": "Arătăm pe rând: scaun, masă",
      "s46-2-3-z6-fizic": "Căutăm pantofii",
      "s46-2-3-z6-mental": "Unde sunt pantofii?",
      "s46-2-3-z6-resurse": "Pantofii la loc după arătat",
      "s46-2-3-z6-social": "Arătăm pantofii adultului",
      "s46-2-3-z7-fizic": "Plimbare liberă, arătăm",
      "s46-2-3-z7-mental": "Carte: unde e?",
      "s46-2-3-z7-resurse": "Jucăria și cartea la loc",
      "s46-2-3-z7-social": "Noapte bună",
      "s47-2-3-z1-fizic": "Luăm o jucărie",
      "s47-2-3-z1-mental": "Al meu: jucăria",
      "s47-2-3-z1-resurse": "Jucăria pe masă, a mea",
      "s47-2-3-z1-social": "Arătăm jucăria: a mea",
      "s47-2-3-z2-fizic": "Purtăm jucăria până la cutie",
      "s47-2-3-z2-mental": "La loc: cutie",
      "s47-2-3-z2-resurse": "Jucăria în cutie",
      "s47-2-3-z2-social": "Punem la loc pe rând",
      "s47-2-3-z3-fizic": "Strângem două lucruri",
      "s47-2-3-z3-mental": "Una și alta: la loc",
      "s47-2-3-z3-resurse": "Două lucruri în cutie",
      "s47-2-3-z3-social": "Strângem împreună",
      "s47-2-3-z4-fizic": "Haina pe cuier",
      "s47-2-3-z4-mental": "Haina: a mea, la loc",
      "s47-2-3-z4-resurse": "Haina pe cuier, grijă",
      "s47-2-3-z4-social": "Punem haina împreună",
      "s47-2-3-z5-fizic": "Cartea pe raft",
      "s47-2-3-z5-mental": "Cartea: unde stă?",
      "s47-2-3-z5-resurse": "Cartea pe raft, grijă",
      "s47-2-3-z5-social": "Cartea la loc pe rând",
      "s47-2-3-z6-fizic": "Trei lucruri la loc",
      "s47-2-3-z6-mental": "Grijă: al meu, la loc",
      "s47-2-3-z6-resurse": "Cutia cu lucruri la loc",
      "s47-2-3-z6-social": "Grijă de lucruri împreună",
      "s47-2-3-z7-fizic": "Plimbare liberă și un lucru la loc",
      "s47-2-3-z7-mental": "Carte: grijă de lucruri",
      "s47-2-3-z7-resurse": "Jucăria și haina la loc",
      "s47-2-3-z7-social": "Noapte bună",
      "s48-2-3-z1-fizic": "Mâna sus: salut",
      "s48-2-3-z1-mental": "Salut: bună",
      "s48-2-3-z1-resurse": "Ușa deschisă, salut",
      "s48-2-3-z1-social": "Salutăm împreună",
      "s48-2-3-z2-fizic": "Pași până la ușă, salut",
      "s48-2-3-z2-mental": "Cine e la ușă?",
      "s48-2-3-z2-resurse": "Haina pe cuier înainte de ieșire",
      "s48-2-3-z2-social": "Salut mamei",
      "s48-2-3-z3-fizic": "Mâna flutură: la revedere",
      "s48-2-3-z3-mental": "La revedere",
      "s48-2-3-z3-resurse": "Ușa închisă după la revedere",
      "s48-2-3-z3-social": "La revedere împreună",
      "s48-2-3-z4-fizic": "Salut, apoi câțiva pași",
      "s48-2-3-z4-mental": "Salut și la revedere",
      "s48-2-3-z4-resurse": "Pantofii lângă ușă la salut",
      "s48-2-3-z4-social": "Salut pe rând",
      "s48-2-3-z5-fizic": "La revedere la fereastră",
      "s48-2-3-z5-mental": "Aici și acolo: salut",
      "s48-2-3-z5-resurse": "Perdeaua trasă după la revedere",
      "s48-2-3-z5-social": "La revedere pe rând",
      "s48-2-3-z6-fizic": "Salut oaspetelui",
      "s48-2-3-z6-mental": "Mulțumesc",
      "s48-2-3-z6-resurse": "Haina pe cuier după oaspete",
      "s48-2-3-z6-social": "Salut și mulțumesc împreună",
      "s48-2-3-z7-fizic": "Plimbare liberă, salut la final",
      "s48-2-3-z7-mental": "Carte: salut și la revedere",
      "s48-2-3-z7-resurse": "Haina și pantofii la loc",
      "s48-2-3-z7-social": "Noapte bună",
      "s49-2-3-z1-fizic": "Alegem mingea favorită",
      "s49-2-3-z1-mental": "Prima favorită: minge",
      "s49-2-3-z1-resurse": "Mingea pe masă, aleasă",
      "s49-2-3-z1-social": "Arătăm mingea favorită adultului",
      "s49-2-3-z2-fizic": "Alegem cartea iubită: pagina lui",
      "s49-2-3-z2-mental": "A doua favorită: carte",
      "s49-2-3-z2-resurse": "Cartea pe raft, aleasă",
      "s49-2-3-z2-social": "Citim favorita împreună din nou",
      "s49-2-3-z3-fizic": "A treia favorită: dans pe loc",
      "s49-2-3-z3-mental": "Trei favorite: unu, doi, trei",
      "s49-2-3-z3-resurse": "Spațiu liber pentru dansul ales",
      "s49-2-3-z3-social": "Dansăm din nou pe rând",
      "s49-2-3-z4-fizic": "Repetăm mingea: dat",
      "s49-2-3-z4-mental": "Ne amintim: minge din nou",
      "s49-2-3-z4-resurse": "Mingea în cutie din nou",
      "s49-2-3-z4-social": "Mingea pe rând, ca înainte",
      "s49-2-3-z5-fizic": "Trei obiecte favorite pe masă",
      "s49-2-3-z5-mental": "Alege una din trei",
      "s49-2-3-z5-resurse": "Trei favorite la loc pe rând",
      "s49-2-3-z5-social": "Arătăm alegerea adultului",
      "s49-2-3-z6-fizic": "Repetăm pașii favoriți",
      "s49-2-3-z6-mental": "Ne amintim: pași și favorit",
      "s49-2-3-z6-resurse": "Pantofii la loc după pașii aleși",
      "s49-2-3-z6-social": "Pași favoriți împreună din nou",
      "s49-2-3-z7-fizic": "Plimbare liberă: alege un favorit",
      "s49-2-3-z7-mental": "Carte: trei favorite în an",
      "s49-2-3-z7-resurse": "Favoritele pe raft la final",
      "s49-2-3-z7-social": "Noapte bună",
      "s50-2-3-z1-fizic": "Pași moi în casă",
      "s50-2-3-z1-mental": "Liniște: casă",
      "s50-2-3-z1-resurse": "Ușa închisă blând",
      "s50-2-3-z1-social": "Stați liniștiți unul lângă altul",
      "s50-2-3-z2-fizic": "Așezare blândă pe pernă",
      "s50-2-3-z2-mental": "Calm: pernă și corp",
      "s50-2-3-z2-resurse": "Perna la loc după așezare",
      "s50-2-3-z2-social": "Pernă liniștită cu adultul",
      "s50-2-3-z3-fizic": "Carte pe genunchi",
      "s50-2-3-z3-mental": "Imagini blânde din carte",
      "s50-2-3-z3-resurse": "Cartea pe raft după liniște",
      "s50-2-3-z3-social": "Citim liniștiți împreună",
      "s50-2-3-z4-fizic": "Mâini pe genunchi, respirație blândă",
      "s50-2-3-z4-mental": "Liniște: mâini și corp",
      "s50-2-3-z4-resurse": "Lumina mică în cameră",
      "s50-2-3-z4-social": "Lumină mică împreună",
      "s50-2-3-z5-fizic": "Pași la geam, lin",
      "s50-2-3-z5-mental": "Afară e, în casă e calm",
      "s50-2-3-z5-resurse": "Perdeaua trasă blând",
      "s50-2-3-z5-social": "Privim geamul liniștiți",
      "s50-2-3-z6-fizic": "Balans blând pe loc",
      "s50-2-3-z6-mental": "Sunete mici în casă",
      "s50-2-3-z6-resurse": "Jucăriile la loc, casă liniștită",
      "s50-2-3-z6-social": "Casă liniștită împreună",
      "s50-2-3-z7-fizic": "Plimbare liberă blândă în casă",
      "s50-2-3-z7-mental": "Carte: casă liniștită",
      "s50-2-3-z7-resurse": "Cartea și perna la loc",
      "s50-2-3-z7-social": "Noapte bună",
      "s51-2-3-z1-fizic": "Pași în curtea cunoscută",
      "s51-2-3-z1-mental": "Curte: locul nostru",
      "s51-2-3-z1-resurse": "Pantofii la ușă înainte de curte",
      "s51-2-3-z1-social": "Ieșim în curte împreună",
      "s51-2-3-z2-fizic": "Mâna pe gardul cunoscut",
      "s51-2-3-z2-mental": "Uite: gardul",
      "s51-2-3-z2-resurse": "Mâna jos după gard",
      "s51-2-3-z2-social": "Arătăm gardul adultului",
      "s51-2-3-z3-fizic": "Pași până la copacul cunoscut",
      "s51-2-3-z3-mental": "Uite: frunza",
      "s51-2-3-z3-resurse": "O frunză ținută, apoi la loc",
      "s51-2-3-z3-social": "Privim copacul împreună",
      "s51-2-3-z4-fizic": "Atingem pământul cunoscut",
      "s51-2-3-z4-mental": "Uite: pământul",
      "s51-2-3-z4-resurse": "Mâinile curate după pământ",
      "s51-2-3-z4-social": "Atingem pământul pe rând",
      "s51-2-3-z5-fizic": "Drumul scurt la poarta cunoscută",
      "s51-2-3-z5-mental": "Uite: poarta",
      "s51-2-3-z5-resurse": "Mâna pe poartă, apoi jos",
      "s51-2-3-z5-social": "Arătăm poarta adultului",
      "s51-2-3-z6-fizic": "Urechi afară: sunete cunoscute",
      "s51-2-3-z6-mental": "Pasăre — sau mașină?",
      "s51-2-3-z6-resurse": "Înapoi la ușă, pantofii la loc",
      "s51-2-3-z6-social": "Ascultăm afară împreună",
      "s51-2-3-z7-fizic": "Plimbare liberă în curtea cunoscută",
      "s51-2-3-z7-mental": "Carte: curte și locuri",
      "s51-2-3-z7-resurse": "Haina și pantofii la loc",
      "s51-2-3-z7-social": "Noapte bună",
      "s52-2-3-z1-fizic": "Pași blânzi prin casă",
      "s52-2-3-z1-mental": "Anul: blând",
      "s52-2-3-z1-resurse": "O jucărie pe masă, lin",
      "s52-2-3-z1-social": "Stați blând unul lângă altul",
      "s52-2-3-z2-fizic": "Atingem trei locuri din casă",
      "s52-2-3-z2-mental": "Ne amintim casa",
      "s52-2-3-z2-resurse": "Trei lucruri la loc blând",
      "s52-2-3-z2-social": "Arătăm casa adultului",
      "s52-2-3-z3-fizic": "Cartea anului: pagina lui",
      "s52-2-3-z3-mental": "Imagini din an",
      "s52-2-3-z3-resurse": "Cartea pe raft la închidere",
      "s52-2-3-z3-social": "Citim blând împreună",
      "s52-2-3-z4-fizic": "Mingea blândă: dat",
      "s52-2-3-z4-mental": "Ne amintim: minge și rând",
      "s52-2-3-z4-resurse": "Mingea în cutie la final",
      "s52-2-3-z4-social": "Mingea pe rând, blând",
      "s52-2-3-z5-fizic": "Geamul: privim anul",
      "s52-2-3-z5-mental": "Afară și în casă: gata blând",
      "s52-2-3-z5-resurse": "Perdeaua la loc blând",
      "s52-2-3-z5-social": "Privim geamul împreună la final",
      "s52-2-3-z6-fizic": "Balans blând: anul se închide",
      "s52-2-3-z6-mental": "Gata blând",
      "s52-2-3-z6-resurse": "Favoritele pe raft, anul gata",
      "s52-2-3-z6-social": "Mulțumesc, blând",
      "s52-2-3-z7-fizic": "Plimbare liberă: anul se închide",
      "s52-2-3-z7-mental": "Carte: anul se închide blând",
      "s52-2-3-z7-resurse": "Totul la loc: an gata",
      "s52-2-3-z7-social": "Noapte bună",
    };
    expect(Object.keys(expected)).toHaveLength(896);
    const byId = Object.fromEntries(
      Array.from({ length: 32 }, (_, i) => i + 21).flatMap((week) =>
        getSeedActivities(week).map((row) => [row.id, row.titlu]),
      ),
    );
    for (const [id, titlu] of Object.entries(expected)) {
      expect(byId[id]).toBe(titlu);
    }
  });
});
