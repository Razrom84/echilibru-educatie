import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { getSeedActivities, getSeedActivityById } from "./seed/week1";
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
    {week:32,id:"balonas",name:"Balonaș",open:"Balonul afară.",close:"Balonul, gata.",s1:"Balonul se leagănă 1 sec pe sfoară",theme:"Balonul afară"},
    {week:33,id:"lopetica",name:"Lopățică",open:"Nisip și găleată.",close:"Nisipul, gata.",s1:"Mâna în nisip 2 sec",theme:"Nisip și găleată"},
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
    expect(playfulHeaderLabel("Balonaș", "Balonul afară")).toBe(
      "Balonaș · Balonul afară",
    );
    expect(playfulHeaderLabel("Lopățică", "Nisip și găleată")).toBe(
      "Lopățică · Nisip și găleată",
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
    expect(PLAYFUL_CHARACTERS.lopetica.name).toBe("Lopățică");
    expect(PLAYFUL_CHARACTERS.lopetica.name).not.toBe("Lopețică");
    expect([...PLAYFUL_CHARACTERS.lopetica.name].map((ch) => ch.codePointAt(0))).toEqual([
      0x004c, 0x006f, 0x0070, 0x0103, 0x021b, 0x0069, 0x0063, 0x0103,
    ]);
    expect(svgTitle("lopetica.svg")).toBe("Lopățică");
    expect(chrome).toContain("<title>Lopățică</title>");
    expect(chrome).not.toContain("<title>Lopețică</title>");
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
      "s1-2-3-z2-mental": "Citim puțin",
      "s1-2-3-z2-resurse": "Paharul gol — sau plin?",
      "s1-2-3-z2-social": "Spunem mulțumesc",
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
      "s1-2-3-z6-social": "Jucăm unul lângă altul",
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
      "s2-2-3-z5-social": "Bem lângă apă",
      "s2-2-3-z6-fizic": "Cizmele în băltoacă",
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
    expect(byId["s3-2-3-z5-fizic"]).toBe("Mergem pe vârfuri, încet");
    expect(byId["s3-2-3-z5-mental"]).toBe("Ascultăm trei sunete din casă");
    expect(byId["s3-2-3-z5-resurse"]).toBe("Telefonul pe silențios");
    expect(byId["s3-2-3-z5-social"]).toBe("Spunem „Bună” cu vocea");
    expect(byId["s3-2-3-z6-fizic"]).toBe("Ieșim afară. Auzi pașii?");
    expect(byId["s3-2-3-z6-mental"]).toBe("Se aude vântul?");
    expect(byId["s3-2-3-z6-resurse"]).toBe("Piatra care nu scoate sunete");
    expect(byId["s3-2-3-z6-social"]).toBe("Îți spun ce auzi tu");
    expect(byId["s3-2-3-z7-fizic"]).toBe("Plimbare liberă");
    expect(byId["s3-2-3-z7-mental"]).toBe("Carte în liniște");
    expect(byId["s3-2-3-z7-resurse"]).toBe("Stingem lumina încet");
    expect(byId["s3-2-3-z7-social"]).toBe("Noapte bună, șoptit");
  });

  test("S4 titles are natural RO invitation lines for hands/fingers L–D", () => {
    const byId = Object.fromEntries(
      getSeedActivities(4).map((row) => [row.id, row.titlu]),
    );
    expect(byId["s4-2-3-z1-fizic"]).toBe("Deschidem și strângem pumnul");
    expect(byId["s4-2-3-z1-mental"]).toBe("Arată degetul");
    expect(byId["s4-2-3-z1-resurse"]).toBe("Punem capacul pe cutie");
    expect(byId["s4-2-3-z1-social"]).toBe("Ținem mâna");
    expect(byId["s4-2-3-z2-fizic"]).toBe("Culegem trei lucruri");
    expect(byId["s4-2-3-z2-mental"]).toBe("Mare și mic");
    expect(byId["s4-2-3-z2-resurse"]).toBe("Boabele în bol");
    expect(byId["s4-2-3-z2-social"]).toBe("Din mână în mână");
    expect(byId["s4-2-3-z3-fizic"]).toBe("Ritm cu degetele");
    expect(byId["s4-2-3-z3-mental"]).toBe("Unde e mânuța?");
    expect(byId["s4-2-3-z3-resurse"]).toBe("Fermoarul, puțin");
    expect(byId["s4-2-3-z3-social"]).toBe("Gâdilat pe palmă, blând");
    expect(byId["s4-2-3-z4-fizic"]).toBe("Împingem cutia");
    expect(byId["s4-2-3-z4-mental"]).toBe("Unu, doi — degete");
    expect(byId["s4-2-3-z4-resurse"]).toBe("Ștergem masa");
    expect(byId["s4-2-3-z4-social"]).toBe("Palmă pe palmă");
    expect(byId["s4-2-3-z5-fizic"]).toBe("Mâna alunecă pe pernă");
    expect(byId["s4-2-3-z5-fizic"]).not.toBe("Târâit pe pernă.");
    expect(byId["s4-2-3-z5-fizic"]).not.toBe("Alunecăm pe pernă.");
    expect(byId["s4-2-3-z5-mental"]).toBe("Moale sau aspru?");
    expect(byId["s4-2-3-z5-resurse"]).toBe("Șoseta la loc");
    expect(byId["s4-2-3-z5-social"]).toBe("Mâna pe umăr");
    expect(byId["s4-2-3-z6-fizic"]).toBe("Săpăm cu mâna");
    expect(byId["s4-2-3-z6-mental"]).toBe("Piatră sau frunză?");
    expect(byId["s4-2-3-z6-resurse"]).toBe("Găleata la loc");
    expect(byId["s4-2-3-z6-social"]).toBe("Săpăm unul lângă altul");
    expect(byId["s4-2-3-z7-fizic"]).toBe("Plimbare cu ceva în mână");
    expect(byId["s4-2-3-z7-mental"]).toBe("Cartea — tu întorci");
    expect(byId["s4-2-3-z7-resurse"]).toBe("Haina pe cârlig");
    expect(byId["s4-2-3-z7-social"]).toBe("Noapte bună");

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
      "s5-2-3-z6-fizic": "Culori afară",
      "s5-2-3-z6-mental": "Cer albastru — sau nor?",
      "s5-2-3-z6-resurse": "O frunză colorată",
      "s5-2-3-z6-social": "Tu atingi, eu numesc",
      "s5-2-3-z7-fizic": "Plimbare liberă cu culori",
      "s5-2-3-z7-mental": "Cartea cu culori",
      "s5-2-3-z7-resurse": "Jucăriile colorate la loc",
      "s5-2-3-z7-social": "Noapte bună",
      "s6-2-3-z1-fizic": "Brațele sus, brațele jos",
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
      "s6-2-3-z6-fizic": "Pe bordură, sus și jos",
      "s6-2-3-z6-mental": "Frunză sus, frunză jos",
      "s6-2-3-z6-resurse": "Găleata jos pe iarbă",
      "s6-2-3-z6-social": "Sus și jos, împreună",
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
      "s7-2-3-z4-mental": "Jucăria e afară — sau în casă?",
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
      "s8-2-3-z5-fizic": "Frunze în vânt",
      "s8-2-3-z5-mental": "Frunză galbenă — sau verde?",
      "s8-2-3-z5-resurse": "Trei frunze la loc",
      "s8-2-3-z5-social": "Pe care frunză?",
      "s8-2-3-z6-fizic": "Pe poteca cu frunze",
      "s8-2-3-z6-mental": "Frunze sus pe copac",
      "s8-2-3-z6-resurse": "Găleata la loc",
      "s8-2-3-z6-social": "Frunza, unul lângă altul",
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
      "s9-2-3-z3-fizic": "Brațele ca aripile",
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
      "s9-2-3-z6-social": "Simțim vântul împreună",
      "s9-2-3-z7-fizic": "Plimbare liberă",
      "s9-2-3-z7-mental": "Cartea cu cerul",
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
      "s11-2-3-z6-fizic": "Umbră afară",
      "s11-2-3-z6-mental": "Soare pe cer",
      "s11-2-3-z6-resurse": "Pălăria la loc",
      "s11-2-3-z6-social": "Umbra, unul lângă altul",
      "s11-2-3-z7-fizic": "Plimbare liberă",
      "s11-2-3-z7-mental": "Cartea cu ziua și noaptea",
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
      "s12-2-3-z3-social": "Ținem mâinile calde",
      "s12-2-3-z4-fizic": "Haina caldă pe umeri",
      "s12-2-3-z4-mental": "Cu haină — sau fără?",
      "s12-2-3-z4-resurse": "Haina pe cârlig",
      "s12-2-3-z4-social": "Te ajut la haină",
      "s12-2-3-z5-fizic": "Suflăm pe mâini",
      "s12-2-3-z5-mental": "Fereastră rece, cameră caldă",
      "s12-2-3-z5-resurse": "Mănușile în sertar",
      "s12-2-3-z5-social": "Încălzim mâinile",
      "s12-2-3-z6-fizic": "Aer rece afară",
      "s12-2-3-z6-mental": "Înăuntru cald, afară rece",
      "s12-2-3-z6-resurse": "Papucii calzi la ușă",
      "s12-2-3-z6-social": "Intrăm din frig",
      "s12-2-3-z7-fizic": "Plimbare liberă",
      "s12-2-3-z7-mental": "Cartea cu cald și rece",
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
      "s13-2-3-z6-fizic": "Ieșim îmbrăcați",
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
      "s14-2-3-z5-fizic": "Alergăm până la poartă",
      "s14-2-3-z5-mental": "Repede — sau încet?",
      "s14-2-3-z5-resurse": "Pantofii după drum",
      "s14-2-3-z5-social": "Pași pe rând",
      "s14-2-3-z6-fizic": "Plimbare scurtă",
      "s14-2-3-z6-mental": "Ce vedem pe drum?",
      "s14-2-3-z6-resurse": "Jucăria după plimbare",
      "s14-2-3-z6-social": "Mergem unul lângă altul",
      "s14-2-3-z7-fizic": "Plimbare liberă",
      "s14-2-3-z7-mental": "Cartea cu pași",
      "s14-2-3-z7-resurse": "Pantofii și haina la loc",
      "s14-2-3-z7-social": "Noapte bună",
      "s15-2-3-z1-fizic": "Pe scaun la masă",
      "s15-2-3-z1-mental": "Farfuria pe masă",
      "s15-2-3-z1-resurse": "Farfuria la chiuvetă",
      "s15-2-3-z1-social": "Stăm la masă",
      "s15-2-3-z2-fizic": "Gustare cu mâna",
      "s15-2-3-z2-mental": "Mâncare pe farfurie",
      "s15-2-3-z2-resurse": "Șervețelul la loc",
      "s15-2-3-z2-social": "Ține gustarea",
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
      "s15-2-3-z6-fizic": "Gustare în curte",
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
      "s16-2-3-z5-mental": "Ți-e sete?",
      "s16-2-3-z5-resurse": "Paharul puțin, la loc",
      "s16-2-3-z5-social": "Oferim apă",
      "s16-2-3-z6-fizic": "Bem afară",
      "s16-2-3-z6-mental": "Plantă și apă",
      "s16-2-3-z6-resurse": "Paharul după afară",
      "s16-2-3-z6-social": "Bem după joacă",
      "s16-2-3-z7-fizic": "Plimbare liberă",
      "s16-2-3-z7-mental": "Cartea cu apa",
      "s16-2-3-z7-resurse": "Paharul pe raft",
      "s16-2-3-z7-social": "Noapte bună",
      "s17-2-3-z1-fizic": "Ascultăm afară",
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
      "s18-2-3-z4-social": "Schimbăm jucăria",
      "s18-2-3-z5-fizic": "Mingea la perete",
      "s18-2-3-z5-mental": "Așteptăm puțin",
      "s18-2-3-z5-resurse": "Mingea și cubul la loc",
      "s18-2-3-z5-social": "Pe rând",
      "s18-2-3-z6-fizic": "Mingea în curte",
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
      "s19-2-3-z4-resurse": "Cartea la locul ei",
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
      "s20-2-3-z6-social": "Am strâns camera",
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
      "s21-2-3-z1-mental": "Ce se vede afară?",
      "s21-2-3-z1-resurse": "Tragem perdeaua",
      "s21-2-3-z1-social": "Privim pe geam împreună",
      "s21-2-3-z2-fizic": "Degetul pe geamul rece",
      "s21-2-3-z2-mental": "E gheață pe geam?",
      "s21-2-3-z2-resurse": "Ștergem geamul",
      "s21-2-3-z2-social": "Arătăm afară",
      "s21-2-3-z3-fizic": "De la geam la canapea",
      "s21-2-3-z3-mental": "Afară e rece, în casă e cald",
      "s21-2-3-z3-resurse": "Pătura pe canapea",
      "s21-2-3-z3-social": "Ne încălzim împreună",
      "s21-2-3-z4-fizic": "Suflăm pe geam",
      "s21-2-3-z4-mental": "Uite aburul",
      "s21-2-3-z4-resurse": "Ștergem aburul",
      "s21-2-3-z4-social": "Suflăm pe rând",
      "s21-2-3-z5-fizic": "Stăm la fereastră",
      "s21-2-3-z5-mental": "Lumină la geam",
      "s21-2-3-z5-resurse": "Floarea de pe pervaz, la loc",
      "s21-2-3-z5-social": "Uităm zăpada împreună",
      "s21-2-3-z6-fizic": "De la geam, câțiva pași",
      "s21-2-3-z6-mental": "Iarnă afară, casă caldă",
      "s21-2-3-z6-resurse": "Șosetele după geam",
      "s21-2-3-z6-social": "Spunem: e rece afară",
      "s21-2-3-z7-fizic": "Plimbare prin casă, apoi la geam",
      "s21-2-3-z7-mental": "Cartea de iarnă",
      "s21-2-3-z7-resurse": "Cartea și pătura la loc",
      "s21-2-3-z7-social": "Noapte bună",
      "s22-2-3-z1-fizic": "Ne ghemuim și ne ridicăm",
      "s22-2-3-z1-mental": "Facem ghemotoc",
      "s22-2-3-z1-resurse": "Eliberăm covorul",
      "s22-2-3-z1-social": "Dansăm împreună",
      "s22-2-3-z2-fizic": "Ne târâm câțiva pași",
      "s22-2-3-z2-mental": "Jos pe podea",
      "s22-2-3-z2-resurse": "Covorul la loc",
      "s22-2-3-z2-social": "Ne târâm unul lângă altul",
      "s22-2-3-z3-fizic": "Ne rostogolim încet",
      "s22-2-3-z3-mental": "Rotund ca un ghem",
      "s22-2-3-z3-resurse": "Perna de pe jos, la loc",
      "s22-2-3-z3-social": "Ne rostogolim pe rând",
      "s22-2-3-z4-fizic": "Sărituri mici pe loc",
      "s22-2-3-z4-mental": "Sus și jos",
      "s22-2-3-z4-resurse": "Jucăria din drum, la loc",
      "s22-2-3-z4-social": "Sărim pe rând",
      "s22-2-3-z5-fizic": "Brațele se învârt",
      "s22-2-3-z5-mental": "Învârtim încet",
      "s22-2-3-z5-resurse": "Facem loc în cameră",
      "s22-2-3-z5-social": "Învârtim împreună",
      "s22-2-3-z6-fizic": "Dans scurt prin casă",
      "s22-2-3-z6-mental": "Corpul se mișcă",
      "s22-2-3-z6-resurse": "Pantofii de casă, la loc",
      "s22-2-3-z6-social": "Dansăm unul lângă altul",
      "s22-2-3-z7-fizic": "Plimbare prin casă",
      "s22-2-3-z7-mental": "Cartea cu copii care sar",
      "s22-2-3-z7-resurse": "Perna și cartea la loc",
      "s22-2-3-z7-social": "Noapte bună",
      "s23-2-3-z1-fizic": "Mirosim pâinea",
      "s23-2-3-z1-mental": "Miroase a pâine?",
      "s23-2-3-z1-resurse": "Pâinea pe masă, apoi la loc",
      "s23-2-3-z1-social": "Mirosim împreună",
      "s23-2-3-z2-fizic": "Mirosim săpunul",
      "s23-2-3-z2-mental": "Miroase a curat?",
      "s23-2-3-z2-resurse": "Săpunul la chiuvetă",
      "s23-2-3-z2-social": "Spălăm mâinile împreună",
      "s23-2-3-z3-fizic": "Mirosim ceaiul răcit",
      "s23-2-3-z3-mental": "E cald — sau a răcit?",
      "s23-2-3-z3-resurse": "Cana la loc",
      "s23-2-3-z3-social": "Mirosim ceaiul pe rând",
      "s23-2-3-z4-fizic": "Mirosim rufele",
      "s23-2-3-z4-mental": "Miroase a rufe curate?",
      "s23-2-3-z4-resurse": "Rufele în coș",
      "s23-2-3-z4-social": "Aducem o husă împreună",
      "s23-2-3-z5-fizic": "Mirosim în bucătărie",
      "s23-2-3-z5-mental": "Ce miroase?",
      "s23-2-3-z5-resurse": "Lingura la chiuvetă",
      "s23-2-3-z5-social": "Arătăm: uite, miroase",
      "s23-2-3-z6-fizic": "Mirosim o floare",
      "s23-2-3-z6-mental": "Floare — sau frunză?",
      "s23-2-3-z6-resurse": "Floarea rămâne afară",
      "s23-2-3-z6-social": "Mirosim afară împreună",
      "s23-2-3-z7-fizic": "Plimbare, nasul pe vânt",
      "s23-2-3-z7-mental": "Cartea cu mâncare",
      "s23-2-3-z7-resurse": "Cana și cartea la loc",
      "s23-2-3-z7-social": "Noapte bună",
      "s24-2-3-z1-fizic": "Mâna sus: bună",
      "s24-2-3-z1-mental": "Spunem „Bună”",
      "s24-2-3-z1-resurse": "Ușa se deschide",
      "s24-2-3-z1-social": "Spunem bună împreună",
      "s24-2-3-z2-fizic": "Fluturăm mâna: pa",
      "s24-2-3-z2-mental": "Spunem „Pa”",
      "s24-2-3-z2-resurse": "Ușa se închide",
      "s24-2-3-z2-social": "Spunem pa împreună",
      "s24-2-3-z3-fizic": "Batem în ușă",
      "s24-2-3-z3-mental": "Cine e la ușă?",
      "s24-2-3-z3-resurse": "Pantofii lângă ușă",
      "s24-2-3-z3-social": "Batem în ușă împreună",
      "s24-2-3-z4-fizic": "Deschidem ușa, apoi o închidem",
      "s24-2-3-z4-mental": "Deschisă — sau închisă?",
      "s24-2-3-z4-resurse": "Mânerul, apoi mâna jos",
      "s24-2-3-z4-social": "Deschidem ușa împreună",
      "s24-2-3-z5-fizic": "Pași până la ușă, bună",
      "s24-2-3-z5-mental": "Mama, tata, tu",
      "s24-2-3-z5-resurse": "Haina oaspetelui pe cuier",
      "s24-2-3-z5-social": "Bună la ușă",
      "s24-2-3-z6-fizic": "Stăm lângă ușă",
      "s24-2-3-z6-mental": "Cine a venit?",
      "s24-2-3-z6-resurse": "Haina pe cuier după vizită",
      "s24-2-3-z6-social": "Mulțumim pentru vizită",
      "s24-2-3-z7-fizic": "Plimbare până la ușă",
      "s24-2-3-z7-mental": "Cartea cu familia",
      "s24-2-3-z7-resurse": "Pantofii și haina la loc",
      "s24-2-3-z7-social": "Noapte bună",
      "s25-2-3-z1-fizic": "Aprindem lampa",
      "s25-2-3-z1-mental": "E lumină",
      "s25-2-3-z1-resurse": "Lampa stă pe locul ei",
      "s25-2-3-z1-social": "Aprindem împreună",
      "s25-2-3-z2-fizic": "Stingem lampa",
      "s25-2-3-z2-mental": "E întuneric — sau lumină?",
      "s25-2-3-z2-resurse": "Întrerupătorul, apoi mâna jos",
      "s25-2-3-z2-social": "Stingem împreună",
      "s25-2-3-z3-fizic": "Lumină mică de seară",
      "s25-2-3-z3-mental": "Lumină — sau umbră?",
      "s25-2-3-z3-resurse": "Perdeaua trasă seara",
      "s25-2-3-z3-social": "Lumină mică împreună",
      "s25-2-3-z4-fizic": "Întoarcem o pagină la lampă",
      "s25-2-3-z4-mental": "Imagini la lumină",
      "s25-2-3-z4-resurse": "Cartea pe raft după seară",
      "s25-2-3-z4-social": "Citim la lampă împreună",
      "s25-2-3-z5-fizic": "Pași prin camera luminată",
      "s25-2-3-z5-mental": "Unde e lampa?",
      "s25-2-3-z5-resurse": "Lampa rămâne pe loc",
      "s25-2-3-z5-social": "Arătăm lampa",
      "s25-2-3-z6-fizic": "Stăm lângă lampă",
      "s25-2-3-z6-mental": "Seară în casă",
      "s25-2-3-z6-resurse": "Perdeaua la loc",
      "s25-2-3-z6-social": "Seară liniștită împreună",
      "s25-2-3-z7-fizic": "Plimbare prin casă, seara",
      "s25-2-3-z7-mental": "Cartea de noapte",
      "s25-2-3-z7-resurse": "Cartea și lampa la loc",
      "s25-2-3-z7-social": "Noapte bună",
      "s26-2-3-z1-fizic": "Ne uităm din nou pe geam",
      "s26-2-3-z1-mental": "Ți-aduci aminte geamul?",
      "s26-2-3-z1-resurse": "Perdeaua la loc, ca înainte",
      "s26-2-3-z1-social": "Privim geamul din nou",
      "s26-2-3-z2-fizic": "Dansăm din nou, ca atunci",
      "s26-2-3-z2-mental": "Ți-aduci aminte dansul?",
      "s26-2-3-z2-resurse": "Facem loc, ca înainte",
      "s26-2-3-z2-social": "Dansăm din nou împreună",
      "s26-2-3-z3-fizic": "Cartea iubită, pagina ta",
      "s26-2-3-z3-mental": "Aceeași carte",
      "s26-2-3-z3-resurse": "Cartea pe raft, ca întotdeauna",
      "s26-2-3-z3-social": "Citim din nou împreună",
      "s26-2-3-z4-fizic": "Mingea favorită, o dăm",
      "s26-2-3-z4-mental": "Ți-aduci aminte mingea?",
      "s26-2-3-z4-resurse": "Mingea în cutie din nou",
      "s26-2-3-z4-social": "Dăm mingea din nou, pe rând",
      "s26-2-3-z5-fizic": "Căutăm jucăria cunoscută",
      "s26-2-3-z5-mental": "Unde era?",
      "s26-2-3-z5-resurse": "Jucăria la locul ei",
      "s26-2-3-z5-social": "Arătăm jucăria cunoscută",
      "s26-2-3-z6-fizic": "Alegem o favorită",
      "s26-2-3-z6-mental": "Care îți place?",
      "s26-2-3-z6-resurse": "Favorita pe raft",
      "s26-2-3-z6-social": "Alegem împreună",
      "s26-2-3-z7-fizic": "Plimbare, ca de obicei",
      "s26-2-3-z7-mental": "Cartea de la jumătatea anului",
      "s26-2-3-z7-resurse": "Cartea și mingea la loc",
      "s26-2-3-z7-social": "Noapte bună",
      "s27-2-3-z1-fizic": "Mâna pe geam, uităm vremea",
      "s27-2-3-z1-mental": "Ninge — sau plouă?",
      "s27-2-3-z1-resurse": "Perdeaua la loc",
      "s27-2-3-z1-social": "Privim vremea împreună",
      "s27-2-3-z2-fizic": "Urmărim picăturile pe geam",
      "s27-2-3-z2-mental": "Picătura coboară",
      "s27-2-3-z2-resurse": "Ștergem o picătură",
      "s27-2-3-z2-social": "Urmărim picăturile pe rând",
      "s27-2-3-z3-fizic": "Cizmele la ușă",
      "s27-2-3-z3-mental": "Ieșim — sau stăm?",
      "s27-2-3-z3-resurse": "Cizmele după geam",
      "s27-2-3-z3-social": "Ne încălțăm împreună",
      "s27-2-3-z4-fizic": "Suflăm pe geamul ud",
      "s27-2-3-z4-mental": "Abur și ploaie",
      "s27-2-3-z4-resurse": "Cârpa de geam, la loc",
      "s27-2-3-z4-social": "Suflăm pe rând",
      "s27-2-3-z5-fizic": "Haina de ploaie pe umeri",
      "s27-2-3-z5-mental": "Haină — sau fără?",
      "s27-2-3-z5-resurse": "Haina pe cârlig",
      "s27-2-3-z5-social": "Te ajut la haină",
      "s27-2-3-z6-fizic": "Stăm la geam, vremea trece",
      "s27-2-3-z6-mental": "Zăpadă — sau ploaie?",
      "s27-2-3-z6-resurse": "Șosetele după geam",
      "s27-2-3-z6-social": "Privim fulgii împreună",
      "s27-2-3-z7-fizic": "Plimbare până la geam",
      "s27-2-3-z7-mental": "Cartea cu zăpadă",
      "s27-2-3-z7-resurse": "Haina și cartea la loc",
      "s27-2-3-z7-social": "Noapte bună",
      "s28-2-3-z1-fizic": "Cizmele pe picioare",
      "s28-2-3-z1-mental": "Cizme pentru noroi",
      "s28-2-3-z1-resurse": "Cizmele la ușă, gata de ieșit",
      "s28-2-3-z1-social": "Ne încălțăm împreună",
      "s28-2-3-z2-fizic": "Pași în noroi, doi-trei",
      "s28-2-3-z2-mental": "Noroi moale",
      "s28-2-3-z2-resurse": "Cizmele se scutură",
      "s28-2-3-z2-social": "Pași în noroi, unul lângă altul",
      "s28-2-3-z3-fizic": "Mâna pe cizmă, uităm noroiul",
      "s28-2-3-z3-mental": "Murdar — sau curat?",
      "s28-2-3-z3-resurse": "Cârpa de cizme, la loc",
      "s28-2-3-z3-social": "Arătăm cizma",
      "s28-2-3-z4-fizic": "Băltoaca de dezgheț",
      "s28-2-3-z4-mental": "Apă pe pământ",
      "s28-2-3-z4-resurse": "Cizmele după băltoacă",
      "s28-2-3-z4-social": "Sărim băltoaca împreună",
      "s28-2-3-z5-fizic": "Spălăm mâinile după noroi",
      "s28-2-3-z5-mental": "Mâini curate",
      "s28-2-3-z5-resurse": "Prosopul la loc",
      "s28-2-3-z5-social": "Spălăm mâinile împreună",
      "s28-2-3-z6-fizic": "Noroi, apoi apă",
      "s28-2-3-z6-mental": "Moale, apoi ud",
      "s28-2-3-z6-resurse": "Cizmele la loc, după curte",
      "s28-2-3-z6-social": "Ne ștergem împreună",
      "s28-2-3-z7-fizic": "Plimbare cu cizmele",
      "s28-2-3-z7-mental": "Cartea cu curtea",
      "s28-2-3-z7-resurse": "Cizmele și haina la loc",
      "s28-2-3-z7-social": "Noapte bună",
      "s29-2-3-z1-fizic": "Degetul pe mugure",
      "s29-2-3-z1-mental": "Uite iarba nouă",
      "s29-2-3-z1-resurse": "Ramura rămâne pe loc",
      "s29-2-3-z1-social": "Arătăm mugurele",
      "s29-2-3-z2-fizic": "Pași scurți pe iarbă",
      "s29-2-3-z2-mental": "Verde, iarbă nouă",
      "s29-2-3-z2-resurse": "Pantofii după iarbă",
      "s29-2-3-z2-social": "Pași pe iarbă împreună",
      "s29-2-3-z3-fizic": "Atingem o frunză mică",
      "s29-2-3-z3-mental": "Mică — sau mare?",
      "s29-2-3-z3-resurse": "Frunza rămâne pe plantă",
      "s29-2-3-z3-social": "Atingem frunza pe rând",
      "s29-2-3-z4-fizic": "Udăm puțin la rădăcină",
      "s29-2-3-z4-mental": "Plantă verde",
      "s29-2-3-z4-resurse": "Stropitoarea la loc",
      "s29-2-3-z4-social": "Udăm împreună",
      "s29-2-3-z5-fizic": "Ne aplecăm la mugure",
      "s29-2-3-z5-mental": "Mugure și frunză",
      "s29-2-3-z5-resurse": "Mâinile după plantă",
      "s29-2-3-z5-social": "Privim planta împreună",
      "s29-2-3-z6-fizic": "Trei pași printre fire de iarbă",
      "s29-2-3-z6-mental": "Iarbă nouă sub picior",
      "s29-2-3-z6-resurse": "Pantofii la ușă după iarbă",
      "s29-2-3-z6-social": "Iarba, unul lângă altul",
      "s29-2-3-z7-fizic": "Plimbare pe iarbă",
      "s29-2-3-z7-mental": "Cartea cu plante",
      "s29-2-3-z7-resurse": "Stropitoarea și pantofii la loc",
      "s29-2-3-z7-social": "Noapte bună",
      "s30-2-3-z1-fizic": "Stăm la geam dimineața",
      "s30-2-3-z1-mental": "Auzim o pasăre?",
      "s30-2-3-z1-resurse": "Perdeaua la loc după geam",
      "s30-2-3-z1-social": "Ascultăm împreună",
      "s30-2-3-z2-fizic": "Arătăm sus, pe creangă",
      "s30-2-3-z2-mental": "Pasărea e sus",
      "s30-2-3-z2-resurse": "Mâna jos după arătat",
      "s30-2-3-z2-social": "Arătăm pasărea",
      "s30-2-3-z3-fizic": "Ieșim scurt, urechile afară",
      "s30-2-3-z3-mental": "Sunet în casă — sau afară?",
      "s30-2-3-z3-resurse": "Pantofii după ascultat",
      "s30-2-3-z3-social": "Ascultăm afară împreună",
      "s30-2-3-z4-fizic": "Brațele ca aripile",
      "s30-2-3-z4-mental": "Aripile se mișcă",
      "s30-2-3-z4-resurse": "Facem loc pentru aripi",
      "s30-2-3-z4-social": "Aripile împreună",
      "s30-2-3-z5-fizic": "Privim pasărea care zboară",
      "s30-2-3-z5-mental": "Pasărea zboară",
      "s30-2-3-z5-resurse": "Rămânem pe loc, privim",
      "s30-2-3-z5-social": "Zborul, unul lângă altul",
      "s30-2-3-z6-fizic": "Ciripim încet, ca pasărea",
      "s30-2-3-z6-mental": "Cioc, un sunet",
      "s30-2-3-z6-resurse": "Gura, apoi liniște",
      "s30-2-3-z6-social": "Ciripim pe rând",
      "s30-2-3-z7-fizic": "Plimbare de dimineață",
      "s30-2-3-z7-mental": "Cartea cu păsări",
      "s30-2-3-z7-resurse": "Cartea pe raft",
      "s30-2-3-z7-social": "Noapte bună",
      "s31-2-3-z1-fizic": "Punem sămânța în pământ",
      "s31-2-3-z1-mental": "Sămânța e mică",
      "s31-2-3-z1-resurse": "Pământul acoperă sămânța",
      "s31-2-3-z1-social": "Punem sămânța împreună",
      "s31-2-3-z2-fizic": "Udăm sămânța",
      "s31-2-3-z2-mental": "Pământ ud — sau uscat?",
      "s31-2-3-z2-resurse": "Stropitoarea la loc",
      "s31-2-3-z2-social": "Udăm pe rând",
      "s31-2-3-z3-fizic": "Așteptăm lângă ghiveci",
      "s31-2-3-z3-mental": "Încă nu se vede",
      "s31-2-3-z3-resurse": "Ghiveciul pe pervaz",
      "s31-2-3-z3-social": "Privim ghiveciul împreună",
      "s31-2-3-z4-fizic": "Degetul pe pământul ud",
      "s31-2-3-z4-mental": "Umed și uscat",
      "s31-2-3-z4-resurse": "Mâna pe prosop",
      "s31-2-3-z4-social": "Atingem pământul pe rând",
      "s31-2-3-z5-fizic": "Cărăm stropitoarea",
      "s31-2-3-z5-mental": "Greu cu apă — sau ușor?",
      "s31-2-3-z5-resurse": "Stropitoarea lângă plantă",
      "s31-2-3-z5-social": "Cărăm împreună",
      "s31-2-3-z6-fizic": "A crescut ceva?",
      "s31-2-3-z6-mental": "Sămânță, apoi plantă",
      "s31-2-3-z6-resurse": "Ghiveciul rămâne la loc",
      "s31-2-3-z6-social": "Privim dacă a crescut",
      "s31-2-3-z7-fizic": "Plimbare până la ghiveci",
      "s31-2-3-z7-mental": "Cartea cu grădina",
      "s31-2-3-z7-resurse": "Stropitoarea la loc",
      "s31-2-3-z7-social": "Noapte bună",
      "s32-2-3-z1-fizic": "Ținem balonul de sfoară",
      "s32-2-3-z1-mental": "Balonul e ușor",
      "s32-2-3-z1-resurse": "Balonul lângă ușă",
      "s32-2-3-z1-social": "Ținem balonul împreună",
      "s32-2-3-z2-fizic": "Bătem ușor în balon",
      "s32-2-3-z2-mental": "Balonul e moale",
      "s32-2-3-z2-resurse": "Balonul pe scaun, la loc",
      "s32-2-3-z2-social": "Bătem pe rând",
      "s32-2-3-z3-fizic": "Balonul sus, deasupra capului",
      "s32-2-3-z3-mental": "Sus — sau jos?",
      "s32-2-3-z3-resurse": "Sfoara strânsă în mână",
      "s32-2-3-z3-social": "Ridicăm balonul împreună",
      "s32-2-3-z4-fizic": "Umblăm cu balonul în curte",
      "s32-2-3-z4-mental": "Balonul pe iarbă",
      "s32-2-3-z4-resurse": "Balonul nu rămâne afară",
      "s32-2-3-z4-social": "Ne jucăm cu balonul",
      "s32-2-3-z5-fizic": "Mergem ținând sfoara",
      "s32-2-3-z5-mental": "Sfoară lungă — sau scurtă?",
      "s32-2-3-z5-resurse": "Sfoara înfășurată, la loc",
      "s32-2-3-z5-social": "Mergem cu balonul împreună",
      "s32-2-3-z6-fizic": "Balonul se leagănă",
      "s32-2-3-z6-mental": "Se mișcă în aer",
      "s32-2-3-z6-resurse": "Balonul în casă, la loc",
      "s32-2-3-z6-social": "Arătăm balonul",
      "s32-2-3-z7-fizic": "Plimbare cu balonul",
      "s32-2-3-z7-mental": "Cartea cu balonul",
      "s32-2-3-z7-resurse": "Balonul pe cui",
      "s32-2-3-z7-social": "Noapte bună",
      "s33-2-3-z1-fizic": "Lopățica în nisip",
      "s33-2-3-z1-mental": "Nisipul e moale",
      "s33-2-3-z1-resurse": "Găleata lângă nisip",
      "s33-2-3-z1-social": "Umplem împreună",
      "s33-2-3-z2-fizic": "Punem nisip în găleată",
      "s33-2-3-z2-mental": "Plină — sau goală?",
      "s33-2-3-z2-resurse": "Lopățica la loc",
      "s33-2-3-z2-social": "Umplem pe rând",
      "s33-2-3-z3-fizic": "Săpăm o gropiță",
      "s33-2-3-z3-mental": "Adânc — sau la suprafață?",
      "s33-2-3-z3-resurse": "Nisipul înapoi",
      "s33-2-3-z3-social": "Săpăm unul lângă altul",
      "s33-2-3-z4-fizic": "Facem o formă",
      "s33-2-3-z4-mental": "Rotundă — sau lungă?",
      "s33-2-3-z4-resurse": "Nisipul rămâne afară",
      "s33-2-3-z4-social": "Arătăm forma",
      "s33-2-3-z5-fizic": "Cărăm găleata",
      "s33-2-3-z5-mental": "Greu — sau ușor?",
      "s33-2-3-z5-resurse": "Turnăm nisipul înapoi",
      "s33-2-3-z5-social": "Cărăm împreună",
      "s33-2-3-z6-fizic": "Lopățica și găleata, apoi gata",
      "s33-2-3-z6-mental": "Nisip pe mână",
      "s33-2-3-z6-resurse": "Mâinile pe prosop",
      "s33-2-3-z6-social": "La nisip, unul lângă altul",
      "s33-2-3-z7-fizic": "Plimbare pe nisip",
      "s33-2-3-z7-mental": "Cartea cu plaja",
      "s33-2-3-z7-resurse": "Lopățica și găleata la loc",
      "s33-2-3-z7-social": "Noapte bună",
      "s34-2-3-z1-fizic": "Mâna face umbră",
      "s34-2-3-z1-mental": "Uite umbra",
      "s34-2-3-z1-resurse": "Mâna jos, umbra dispare",
      "s34-2-3-z1-social": "Facem umbră împreună",
      "s34-2-3-z2-fizic": "Umbra pe perete",
      "s34-2-3-z2-mental": "Mare — sau mică?",
      "s34-2-3-z2-resurse": "Ne dăm la o parte",
      "s34-2-3-z2-social": "Umbra pe rând",
      "s34-2-3-z3-fizic": "Umbra pe jos, lungă",
      "s34-2-3-z3-mental": "Lungă — sau scurtă?",
      "s34-2-3-z3-resurse": "Pașii lângă umbră",
      "s34-2-3-z3-social": "Urmărim umbra împreună",
      "s34-2-3-z4-fizic": "Intrăm în umbră",
      "s34-2-3-z4-mental": "Soare — sau umbră?",
      "s34-2-3-z4-resurse": "Ieșim din umbră",
      "s34-2-3-z4-social": "Stăm în umbră împreună",
      "s34-2-3-z5-fizic": "Umbra merge cu noi",
      "s34-2-3-z5-mental": "Umbra se mișcă",
      "s34-2-3-z5-resurse": "Ne oprim, umbra stă",
      "s34-2-3-z5-social": "Mergem cu umbra",
      "s34-2-3-z6-fizic": "Umbra unui copac",
      "s34-2-3-z6-mental": "Stă — sau se mișcă?",
      "s34-2-3-z6-resurse": "Ieșim de sub copac",
      "s34-2-3-z6-social": "Sub copac, unul lângă altul",
      "s34-2-3-z7-fizic": "Plimbare după umbră",
      "s34-2-3-z7-mental": "Cartea cu soarele",
      "s34-2-3-z7-resurse": "Pălăria la loc",
      "s34-2-3-z7-social": "Noapte bună",
      "s35-2-3-z1-fizic": "Stropi pe mână, afară",
      "s35-2-3-z1-mental": "E ud",
      "s35-2-3-z1-resurse": "Prosopul afară, apoi la loc",
      "s35-2-3-z1-social": "Stropi împreună",
      "s35-2-3-z2-fizic": "Turnăm puțin pe pământ",
      "s35-2-3-z2-mental": "Pahar plin — sau gol?",
      "s35-2-3-z2-resurse": "Paharul la loc",
      "s35-2-3-z2-social": "Turnăm pe rând",
      "s35-2-3-z3-fizic": "O băltoacă mică",
      "s35-2-3-z3-mental": "Adâncă — sau mică?",
      "s35-2-3-z3-resurse": "Cizmele după băltoacă",
      "s35-2-3-z3-social": "Sărim băltoaca",
      "s35-2-3-z4-fizic": "Udăm o plantă afară",
      "s35-2-3-z4-mental": "Planta bea apă",
      "s35-2-3-z4-resurse": "Stropitoarea la loc",
      "s35-2-3-z4-social": "Udăm împreună",
      "s35-2-3-z5-fizic": "Apa e rece afară",
      "s35-2-3-z5-mental": "Apa e rece",
      "s35-2-3-z5-resurse": "Mâinile pe prosop",
      "s35-2-3-z5-social": "Atingem apa pe rând",
      "s35-2-3-z6-fizic": "O picătură pe frunză",
      "s35-2-3-z6-mental": "Picătura e mică",
      "s35-2-3-z6-resurse": "Frunza rămâne afară",
      "s35-2-3-z6-social": "Uităm picătura împreună",
      "s35-2-3-z7-fizic": "Plimbare lângă apă",
      "s35-2-3-z7-mental": "Cartea cu apa",
      "s35-2-3-z7-resurse": "Paharul și prosopul la loc",
      "s35-2-3-z7-social": "Noapte bună",
      "s36-2-3-z1-fizic": "Ieșim și privim",
      "s36-2-3-z1-mental": "E mic, gândăcelul",
      "s36-2-3-z1-resurse": "Rămânem pe loc, departe",
      "s36-2-3-z1-social": "Privim împreună",
      "s36-2-3-z2-fizic": "Arătăm gândăcelul",
      "s36-2-3-z2-mental": "Pe frunză",
      "s36-2-3-z2-resurse": "Mâna jos, nu-l luăm",
      "s36-2-3-z2-social": "Arătăm pe rând",
      "s36-2-3-z3-fizic": "Gândăcelul merge",
      "s36-2-3-z3-mental": "Merge încet",
      "s36-2-3-z3-resurse": "Nu-l atingem",
      "s36-2-3-z3-social": "Îl urmărim din ochi",
      "s36-2-3-z4-fizic": "Unul zboară",
      "s36-2-3-z4-mental": "Zumzet și liniște",
      "s36-2-3-z4-resurse": "Rămânem pe iarbă",
      "s36-2-3-z4-social": "Privim zborul împreună",
      "s36-2-3-z5-fizic": "Doar ne uităm, de departe",
      "s36-2-3-z5-mental": "Avem grijă, nu atingem",
      "s36-2-3-z5-resurse": "Ne dăm un pas înapoi",
      "s36-2-3-z5-social": "Privim de departe împreună",
      "s36-2-3-z6-fizic": "Uite, pe pământ",
      "s36-2-3-z6-mental": "Pământ — sau frunză?",
      "s36-2-3-z6-resurse": "Pământul rămâne, noi plecăm",
      "s36-2-3-z6-social": "Arătăm pământul",
      "s36-2-3-z7-fizic": "Plimbare, ochii pe jos",
      "s36-2-3-z7-mental": "Cartea cu gândăcei",
      "s36-2-3-z7-resurse": "Cartea pe raft",
      "s36-2-3-z7-social": "Noapte bună",
      "s37-2-3-z1-fizic": "Stăm la umbră",
      "s37-2-3-z1-mental": "E răcoare",
      "s37-2-3-z1-resurse": "Pătura pe iarbă, la umbră",
      "s37-2-3-z1-social": "Stăm la umbră împreună",
      "s37-2-3-z2-fizic": "Din soare, în umbră",
      "s37-2-3-z2-mental": "Cald — sau răcoare?",
      "s37-2-3-z2-resurse": "Pălăria pe cap, la soare",
      "s37-2-3-z2-social": "Intrăm în umbră împreună",
      "s37-2-3-z3-fizic": "Bem apă la umbră",
      "s37-2-3-z3-mental": "Apa e rece",
      "s37-2-3-z3-resurse": "Paharul după umbră",
      "s37-2-3-z3-social": "Bem împreună, la umbră",
      "s37-2-3-z4-fizic": "Piciorul pe iarbă, la umbră",
      "s37-2-3-z4-mental": "Iarbă răcoroasă",
      "s37-2-3-z4-resurse": "Pantofii lângă patură",
      "s37-2-3-z4-social": "Pe iarbă, unul lângă altul",
      "s37-2-3-z5-fizic": "Aerul e blând",
      "s37-2-3-z5-mental": "Suflă încet",
      "s37-2-3-z5-resurse": "Haina pe braț, la umbră",
      "s37-2-3-z5-social": "Simțim aerul împreună",
      "s37-2-3-z6-fizic": "Aici e locul răcoros",
      "s37-2-3-z6-mental": "Aici, nu acolo",
      "s37-2-3-z6-resurse": "Pătura strânsă, la loc",
      "s37-2-3-z6-social": "Ne așezăm la umbră",
      "s37-2-3-z7-fizic": "Plimbare până la umbră",
      "s37-2-3-z7-mental": "Cartea de la umbră",
      "s37-2-3-z7-resurse": "Pătura și paharul la loc",
      "s37-2-3-z7-social": "Noapte bună",
      "s38-2-3-z1-fizic": "Descălțați, pe iarbă",
      "s38-2-3-z1-mental": "Iarba e verde",
      "s38-2-3-z1-resurse": "Pantofii lângă iarbă",
      "s38-2-3-z1-social": "Pe iarbă împreună",
      "s38-2-3-z2-fizic": "Tălpile pe iarbă",
      "s38-2-3-z2-mental": "Iarba e moale",
      "s38-2-3-z2-resurse": "Pantofii rămân lângă",
      "s38-2-3-z2-social": "Tălpile, unul lângă altul",
      "s38-2-3-z3-fizic": "Iarba gâdilă",
      "s38-2-3-z3-mental": "Iarba gâdilă",
      "s38-2-3-z3-resurse": "Ne așezăm, tălpile pe iarbă",
      "s38-2-3-z3-social": "Râdem, gâdilă iarba",
      "s38-2-3-z4-fizic": "Trei pași desculți",
      "s38-2-3-z4-mental": "Iarbă — sau piatră?",
      "s38-2-3-z4-resurse": "Pantofii după pași",
      "s38-2-3-z4-social": "Pași desculți împreună",
      "s38-2-3-z5-fizic": "Tălpi pe piatră, scurt",
      "s38-2-3-z5-mental": "Tare — sau moale?",
      "s38-2-3-z5-resurse": "Înapoi pe iarbă",
      "s38-2-3-z5-social": "Piatră, apoi iarbă",
      "s38-2-3-z6-fizic": "Ne ștergem tălpile",
      "s38-2-3-z6-mental": "Moale și tare",
      "s38-2-3-z6-resurse": "Pantofii la loc",
      "s38-2-3-z6-social": "Ne încălțăm împreună",
      "s38-2-3-z7-fizic": "Plimbare desculți, apoi pantofi",
      "s38-2-3-z7-mental": "Cartea cu picioarele",
      "s38-2-3-z7-resurse": "Pantofii la ușă",
      "s38-2-3-z7-social": "Noapte bună",
      "s39-2-3-z1-fizic": "Ținem un fruct",
      "s39-2-3-z1-mental": "E rotund",
      "s39-2-3-z1-resurse": "Fructul în bol",
      "s39-2-3-z1-social": "Ținem fructul împreună",
      "s39-2-3-z2-fizic": "Mirosim fructul",
      "s39-2-3-z2-mental": "Miroase a dulce?",
      "s39-2-3-z2-resurse": "Fructul pe masă",
      "s39-2-3-z2-social": "Mirosim împreună",
      "s39-2-3-z3-fizic": "Măr — sau cireașă?",
      "s39-2-3-z3-mental": "Roșu — sau verde?",
      "s39-2-3-z3-resurse": "Fructele în bol, la loc",
      "s39-2-3-z3-social": "Alegem un fruct",
      "s39-2-3-z4-fizic": "Mâna pe coajă",
      "s39-2-3-z4-mental": "Coaja e netedă",
      "s39-2-3-z4-resurse": "Fructul se spală",
      "s39-2-3-z4-social": "Atingem pe rând",
      "s39-2-3-z5-fizic": "Gustăm puțin, dacă vrea",
      "s39-2-3-z5-mental": "Gust dulce",
      "s39-2-3-z5-resurse": "Șervețelul la loc",
      "s39-2-3-z5-social": "Mulțumim pentru fruct",
      "s39-2-3-z6-fizic": "Spălăm fructul",
      "s39-2-3-z6-mental": "E ud după spălat",
      "s39-2-3-z6-resurse": "Bolul la chiuvetă",
      "s39-2-3-z6-social": "Spălăm împreună",
      "s39-2-3-z7-fizic": "Plimbare până la fructe",
      "s39-2-3-z7-mental": "Cartea cu fructe",
      "s39-2-3-z7-resurse": "Bolul cu fructe, la loc",
      "s39-2-3-z7-social": "Noapte bună",
      "s40-2-3-z1-fizic": "Ținem mătura",
      "s40-2-3-z1-mental": "Ajutor pe scurt",
      "s40-2-3-z1-resurse": "Mătura lângă ușă",
      "s40-2-3-z1-social": "Măturăm împreună",
      "s40-2-3-z2-fizic": "Două lucruri de pe jos",
      "s40-2-3-z2-mental": "Unu și doi, la loc",
      "s40-2-3-z2-resurse": "Lucrurile în coș",
      "s40-2-3-z2-social": "Punem la loc pe rând",
      "s40-2-3-z3-fizic": "Ștergem masa",
      "s40-2-3-z3-mental": "Masa e curată",
      "s40-2-3-z3-resurse": "Cârpa la loc",
      "s40-2-3-z3-social": "Ștergem împreună",
      "s40-2-3-z4-fizic": "Haina pe cuier",
      "s40-2-3-z4-mental": "Haina la locul ei",
      "s40-2-3-z4-resurse": "Cuierul e gata",
      "s40-2-3-z4-social": "Punem haina împreună",
      "s40-2-3-z5-fizic": "Măturăm trei fire",
      "s40-2-3-z5-mental": "Jos, apoi în făraș",
      "s40-2-3-z5-resurse": "Fărașul golit, la loc",
      "s40-2-3-z5-social": "Măturăm pe rând",
      "s40-2-3-z6-fizic": "Trei lucruri la loc",
      "s40-2-3-z6-mental": "Gata treaba",
      "s40-2-3-z6-resurse": "Mătura la loc",
      "s40-2-3-z6-social": "Am ajutat împreună",
      "s40-2-3-z7-fizic": "Plimbare după treabă",
      "s40-2-3-z7-mental": "Cartea cu casa",
      "s40-2-3-z7-resurse": "Mătura și cârpa la loc",
      "s40-2-3-z7-social": "Noapte bună",
      "s41-2-3-z1-fizic": "Pași până la poartă",
      "s41-2-3-z1-mental": "Poarta e acolo",
      "s41-2-3-z1-resurse": "Pantofii înainte de drum",
      "s41-2-3-z1-social": "Mergem de mână până la poartă",
      "s41-2-3-z2-fizic": "Mâna pe poartă",
      "s41-2-3-z2-mental": "Închisă — sau deschisă?",
      "s41-2-3-z2-resurse": "Mâna jos după poartă",
      "s41-2-3-z2-social": "Arătăm poarta",
      "s41-2-3-z3-fizic": "Deschidem poarta, apoi o închidem",
      "s41-2-3-z3-mental": "Poarta se închide",
      "s41-2-3-z3-resurse": "Zăvorul, apoi mâna jos",
      "s41-2-3-z3-social": "Deschidem împreună",
      "s41-2-3-z4-fizic": "Cărăm ceva ușor spre poartă",
      "s41-2-3-z4-mental": "Spre poartă",
      "s41-2-3-z4-resurse": "Obiectul înapoi lângă ușă",
      "s41-2-3-z4-social": "Cărăm împreună spre poartă",
      "s41-2-3-z5-fizic": "Pauză la poartă, apoi înapoi",
      "s41-2-3-z5-mental": "Casă și poartă",
      "s41-2-3-z5-resurse": "Pantofii pe raft după drum",
      "s41-2-3-z5-social": "Pauză la poartă împreună",
      "s41-2-3-z6-fizic": "Privim dincolo de poartă",
      "s41-2-3-z6-mental": "Curte și drum",
      "s41-2-3-z6-resurse": "Haina pe cuier după plimbare",
      "s41-2-3-z6-social": "La poartă, unul lângă altul",
      "s41-2-3-z7-fizic": "Plimbare până la poartă",
      "s41-2-3-z7-mental": "Cartea cu drumul și casa",
      "s41-2-3-z7-resurse": "Pantofii și haina la loc",
      "s41-2-3-z7-social": "Noapte bună",
      "s42-2-3-z1-fizic": "Pași pe frunze",
      "s42-2-3-z1-mental": "Vânt și frunză",
      "s42-2-3-z1-resurse": "Frunza jos, la loc",
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
      "s42-2-3-z4-social": "Ținem eșarfa amândoi",
      "s42-2-3-z5-fizic": "Suflăm pe o frunză",
      "s42-2-3-z5-mental": "Aer pe față",
      "s42-2-3-z5-resurse": "Frunza înapoi afară",
      "s42-2-3-z5-social": "Suflăm pe rând",
      "s42-2-3-z6-fizic": "Plimbare scurtă cu vânt",
      "s42-2-3-z6-mental": "Copacul se mișcă",
      "s42-2-3-z6-resurse": "Găleata la loc după frunze",
      "s42-2-3-z6-social": "Frunze, unul lângă altul",
      "s42-2-3-z7-fizic": "Plimbare, o frunză la final",
      "s42-2-3-z7-mental": "Cartea cu vântul",
      "s42-2-3-z7-resurse": "Haina de afară pe cârlig",
      "s42-2-3-z7-social": "Noapte bună",
      "s43-2-3-z1-fizic": "Punem trei lucruri în coș",
      "s43-2-3-z1-mental": "Trei în coș",
      "s43-2-3-z1-resurse": "Coșul pe raft",
      "s43-2-3-z1-social": "Dăm un obiect din coș",
      "s43-2-3-z2-fizic": "Cărăm coșul cinci pași",
      "s43-2-3-z2-mental": "Plin — sau gol?",
      "s43-2-3-z2-resurse": "Golim coșul pe masă, apoi la loc",
      "s43-2-3-z2-social": "Cărăm coșul împreună",
      "s43-2-3-z3-fizic": "Strângem jucăriile în coș",
      "s43-2-3-z3-mental": "Unde e coșul?",
      "s43-2-3-z3-resurse": "Coșul lângă jucării, pe raft",
      "s43-2-3-z3-social": "Arătăm coșul",
      "s43-2-3-z4-fizic": "Două grămezi în coș",
      "s43-2-3-z4-mental": "Aici și aici",
      "s43-2-3-z4-resurse": "Totul în coș după sortare",
      "s43-2-3-z4-social": "Punem în coș pe rând",
      "s43-2-3-z5-fizic": "Culegem afară în coș",
      "s43-2-3-z5-mental": "Piatră — sau frunză?",
      "s43-2-3-z5-resurse": "Lăsăm afară ce am cules",
      "s43-2-3-z5-social": "Arătăm ce am cules",
      "s43-2-3-z6-fizic": "Strângem camera cu coșul",
      "s43-2-3-z6-mental": "Mult — sau puțin?",
      "s43-2-3-z6-resurse": "Coșul pe locul lui",
      "s43-2-3-z6-social": "Strângem împreună",
      "s43-2-3-z7-fizic": "Plimbare, coșul dacă vrea",
      "s43-2-3-z7-mental": "Cartea cu multe obiecte",
      "s43-2-3-z7-resurse": "Jucăriile în coș",
      "s43-2-3-z7-social": "Noapte bună",
      "s44-2-3-z1-fizic": "Mâna sus: bună",
      "s44-2-3-z1-mental": "Spunem „Bună”",
      "s44-2-3-z1-resurse": "Jucăria-prieten pe raft",
      "s44-2-3-z1-social": "Stăm unul lângă altul",
      "s44-2-3-z2-fizic": "Arătăm poza de familie",
      "s44-2-3-z2-mental": "Mama, tata, tu",
      "s44-2-3-z2-resurse": "Poza pe raft",
      "s44-2-3-z2-social": "Privim poza împreună",
      "s44-2-3-z3-fizic": "Dăm jucăria-prieten din mână",
      "s44-2-3-z3-mental": "Prietenul e jucăria",
      "s44-2-3-z3-resurse": "Jucăria pe pat",
      "s44-2-3-z3-social": "Oferim jucăria",
      "s44-2-3-z4-fizic": "Pași până la ușă, salut",
      "s44-2-3-z4-mental": "La revedere",
      "s44-2-3-z4-resurse": "Pantofii lângă ușă după salut",
      "s44-2-3-z4-social": "Salut la ușă",
      "s44-2-3-z5-fizic": "Batem din palme o dată împreună",
      "s44-2-3-z5-mental": "Prieteni și familie",
      "s44-2-3-z5-resurse": "Paharul de oaspete pe masă, apoi la loc",
      "s44-2-3-z5-social": "Salut pe rând, cu mâna",
      "s44-2-3-z6-fizic": "Joacă lângă jucăria-prieten",
      "s44-2-3-z6-mental": "Familia în carte",
      "s44-2-3-z6-resurse": "Jucăriile la loc după joacă",
      "s44-2-3-z6-social": "Jucăm unul lângă altul",
      "s44-2-3-z7-fizic": "Plimbare, salut la final",
      "s44-2-3-z7-mental": "Cartea cu familia",
      "s44-2-3-z7-resurse": "Haina și jucăria la loc",
      "s44-2-3-z7-social": "Noapte bună",
      "s45-2-3-z1-fizic": "Mergem prin casă",
      "s45-2-3-z1-mental": "Pași mulți",
      "s45-2-3-z1-resurse": "Pantofii de casă",
      "s45-2-3-z1-social": "Mergem de mână",
      "s45-2-3-z2-fizic": "Plimbare până la ușă",
      "s45-2-3-z2-mental": "Departe — sau aproape?",
      "s45-2-3-z2-resurse": "Pantofii la ușă",
      "s45-2-3-z2-social": "Mergem împreună",
      "s45-2-3-z3-fizic": "Cărăm ceva în plimbare",
      "s45-2-3-z3-mental": "Greu — sau ușor?",
      "s45-2-3-z3-resurse": "Obiectul la loc după plimbare",
      "s45-2-3-z3-social": "Cărăm pe rând",
      "s45-2-3-z4-fizic": "Pași în curte",
      "s45-2-3-z4-mental": "Iarbă — sau pietre?",
      "s45-2-3-z4-resurse": "Pantofii după curte",
      "s45-2-3-z4-social": "Plimbare unul lângă altul",
      "s45-2-3-z5-fizic": "Dus-întors pe hol",
      "s45-2-3-z5-mental": "Unu, doi, unu, doi",
      "s45-2-3-z5-resurse": "Calea liberă pe hol",
      "s45-2-3-z5-social": "Dus-întors împreună",
      "s45-2-3-z6-fizic": "Plimbare până la poartă",
      "s45-2-3-z6-mental": "Poartă și casă",
      "s45-2-3-z6-resurse": "Haina după plimbare",
      "s45-2-3-z6-social": "Plimbare de mână",
      "s45-2-3-z7-fizic": "Plimbare liberă",
      "s45-2-3-z7-mental": "Cartea cu drumul",
      "s45-2-3-z7-resurse": "Pantofii la loc",
      "s45-2-3-z7-social": "Noapte bună",
      "s46-2-3-z1-fizic": "Arătăm cu degetul",
      "s46-2-3-z1-mental": "Unde e mingea?",
      "s46-2-3-z1-resurse": "Mingea pe masă, la vedere",
      "s46-2-3-z1-social": "Arătăm mingea",
      "s46-2-3-z2-fizic": "Căutăm în cameră",
      "s46-2-3-z2-mental": "Unde e jucăria?",
      "s46-2-3-z2-resurse": "Jucăria pe scaun, la vedere",
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
      "s46-2-3-z5-social": "Arătăm scaunul, apoi masa",
      "s46-2-3-z6-fizic": "Căutăm pantofii",
      "s46-2-3-z6-mental": "Unde sunt pantofii?",
      "s46-2-3-z6-resurse": "Pantofii la loc după arătat",
      "s46-2-3-z6-social": "Arătăm pantofii",
      "s46-2-3-z7-fizic": "Plimbare, arătăm ce vedem",
      "s46-2-3-z7-mental": "Căutăm în carte: unde e?",
      "s46-2-3-z7-resurse": "Jucăria și cartea la loc",
      "s46-2-3-z7-social": "Noapte bună",
      "s47-2-3-z1-fizic": "Luăm jucăria cu grijă",
      "s47-2-3-z1-mental": "E jucăria mea",
      "s47-2-3-z1-resurse": "Jucăria pe masă",
      "s47-2-3-z1-social": "Arătăm jucăria",
      "s47-2-3-z2-fizic": "Purtăm jucăria până la cutie",
      "s47-2-3-z2-mental": "La loc, în cutie",
      "s47-2-3-z2-resurse": "Jucăria în cutie",
      "s47-2-3-z2-social": "Punem la loc pe rând",
      "s47-2-3-z3-fizic": "Strângem două lucruri",
      "s47-2-3-z3-mental": "Una și alta, la loc",
      "s47-2-3-z3-resurse": "Două lucruri în cutie",
      "s47-2-3-z3-social": "Strângem împreună",
      "s47-2-3-z4-fizic": "Haina pe cuier",
      "s47-2-3-z4-mental": "Haina mea, la loc",
      "s47-2-3-z4-resurse": "Haina pe cuier, cu grijă",
      "s47-2-3-z4-social": "Punem haina împreună",
      "s47-2-3-z5-fizic": "Cartea pe raft",
      "s47-2-3-z5-mental": "Unde stă cartea?",
      "s47-2-3-z5-resurse": "Cartea pe raft, cu grijă",
      "s47-2-3-z5-social": "Cartea la loc pe rând",
      "s47-2-3-z6-fizic": "Trei lucruri la loc",
      "s47-2-3-z6-mental": "Avem grijă de lucrurile noastre",
      "s47-2-3-z6-resurse": "Cutia cu lucruri, la loc",
      "s47-2-3-z6-social": "Grijă împreună",
      "s47-2-3-z7-fizic": "Plimbare și un lucru la loc",
      "s47-2-3-z7-mental": "Cartea despre grijă",
      "s47-2-3-z7-resurse": "Jucăria și haina la loc",
      "s47-2-3-z7-social": "Noapte bună",
      "s48-2-3-z1-fizic": "Mâna sus: bună",
      "s48-2-3-z1-mental": "Spunem „Bună”",
      "s48-2-3-z1-resurse": "Ușa deschisă la salut",
      "s48-2-3-z1-social": "Spunem bună împreună",
      "s48-2-3-z2-fizic": "Pași până la ușă, bună",
      "s48-2-3-z2-mental": "Cine e la ușă?",
      "s48-2-3-z2-resurse": "Haina pe cuier înainte de ieșire",
      "s48-2-3-z2-social": "Bună mamei",
      "s48-2-3-z3-fizic": "Mâna flutură: pa",
      "s48-2-3-z3-mental": "Spunem „Pa”",
      "s48-2-3-z3-resurse": "Ușa închisă după pa",
      "s48-2-3-z3-social": "Spunem pa împreună",
      "s48-2-3-z4-fizic": "Bună, apoi câțiva pași",
      "s48-2-3-z4-mental": "Bună și pa",
      "s48-2-3-z4-resurse": "Pantofii lângă ușă la salut",
      "s48-2-3-z4-social": "Bună pe rând",
      "s48-2-3-z5-fizic": "Pa de la fereastră",
      "s48-2-3-z5-mental": "Aici și acolo",
      "s48-2-3-z5-resurse": "Perdeaua după pa",
      "s48-2-3-z5-social": "Pa pe rând",
      "s48-2-3-z6-fizic": "Bună oaspetelui, noroc",
      "s48-2-3-z6-mental": "Mulțumesc",
      "s48-2-3-z6-resurse": "Haina pe cuier după oaspete",
      "s48-2-3-z6-social": "Noroc și mulțumesc",
      "s48-2-3-z7-fizic": "Plimbare, bună la poartă",
      "s48-2-3-z7-mental": "Cartea cu salutul",
      "s48-2-3-z7-resurse": "Haina și pantofii la loc",
      "s48-2-3-z7-social": "Noapte bună",
      "s49-2-3-z1-fizic": "Alegem mingea scumpă",
      "s49-2-3-z1-mental": "Prima: mingea",
      "s49-2-3-z1-resurse": "Mingea pe masă, aleasă",
      "s49-2-3-z1-social": "Arătăm mingea scumpă",
      "s49-2-3-z2-fizic": "Alegem cartea iubită",
      "s49-2-3-z2-mental": "A doua: cartea",
      "s49-2-3-z2-resurse": "Cartea pe raft, aleasă",
      "s49-2-3-z2-social": "Citim favorita din nou",
      "s49-2-3-z3-fizic": "Dansul preferat, pe loc",
      "s49-2-3-z3-mental": "Trei favorite: unu, doi, trei",
      "s49-2-3-z3-resurse": "Facem loc pentru dans",
      "s49-2-3-z3-social": "Dansăm din nou pe rând",
      "s49-2-3-z4-fizic": "Dăm mingea din nou",
      "s49-2-3-z4-mental": "Mingea, ca înainte",
      "s49-2-3-z4-resurse": "Mingea în cutie din nou",
      "s49-2-3-z4-social": "Mingea pe rând, ca altădată",
      "s49-2-3-z5-fizic": "Trei lucruri scumpe pe masă",
      "s49-2-3-z5-mental": "Alege una din trei",
      "s49-2-3-z5-resurse": "Cele trei, la loc",
      "s49-2-3-z5-social": "Arătăm alegerea",
      "s49-2-3-z6-fizic": "Pașii preferați, din nou",
      "s49-2-3-z6-mental": "Ți-aduci aminte pașii?",
      "s49-2-3-z6-resurse": "Pantofii după pașii aleși",
      "s49-2-3-z6-social": "Pași preferați împreună",
      "s49-2-3-z7-fizic": "Plimbare: alege un lucru scump",
      "s49-2-3-z7-mental": "Cartea celor trei favorite",
      "s49-2-3-z7-resurse": "Favoritele pe raft",
      "s49-2-3-z7-social": "Noapte bună",
      "s50-2-3-z1-fizic": "Pași moi în casă",
      "s50-2-3-z1-mental": "În casă e liniște",
      "s50-2-3-z1-resurse": "Ușa se închide încet",
      "s50-2-3-z1-social": "Stăm cuminți, unul lângă altul",
      "s50-2-3-z2-fizic": "Ne așezăm pe pernă",
      "s50-2-3-z2-mental": "Pernă și liniște",
      "s50-2-3-z2-resurse": "Perna la loc după așezare",
      "s50-2-3-z2-social": "Pe pernă împreună",
      "s50-2-3-z3-fizic": "Carte pe genunchi, încet",
      "s50-2-3-z3-mental": "Imagini liniștite",
      "s50-2-3-z3-resurse": "Cartea pe raft după liniște",
      "s50-2-3-z3-social": "Citim încet împreună",
      "s50-2-3-z4-fizic": "Mâinile pe genunchi",
      "s50-2-3-z4-mental": "Respirăm încet",
      "s50-2-3-z4-resurse": "Lumina mică în cameră",
      "s50-2-3-z4-social": "Lumină mică împreună",
      "s50-2-3-z5-fizic": "Pași la geam, lin",
      "s50-2-3-z5-mental": "Afară e vuiet, în casă e calm",
      "s50-2-3-z5-resurse": "Perdeaua se trage încet",
      "s50-2-3-z5-social": "Privim geamul cuminți",
      "s50-2-3-z6-fizic": "Ne leagănăm încet, pe loc",
      "s50-2-3-z6-mental": "Sunete mici în casă",
      "s50-2-3-z6-resurse": "Jucăriile la loc, casa e liniștită",
      "s50-2-3-z6-social": "Casă liniștită împreună",
      "s50-2-3-z7-fizic": "Plimbare lină prin casă",
      "s50-2-3-z7-mental": "Cartea de liniște",
      "s50-2-3-z7-resurse": "Cartea și perna la loc",
      "s50-2-3-z7-social": "Noapte bună",
      "s51-2-3-z1-fizic": "Pași în curtea noastră",
      "s51-2-3-z1-mental": "E curtea noastră",
      "s51-2-3-z1-resurse": "Pantofii la ușă înainte de curte",
      "s51-2-3-z1-social": "Ieșim în curte împreună",
      "s51-2-3-z2-fizic": "Mâna pe gardul cunoscut",
      "s51-2-3-z2-mental": "Uite gardul",
      "s51-2-3-z2-resurse": "Mâna jos după gard",
      "s51-2-3-z2-social": "Arătăm gardul",
      "s51-2-3-z3-fizic": "Pași până la copacul nostru",
      "s51-2-3-z3-mental": "Uite frunza",
      "s51-2-3-z3-resurse": "O frunză ținută, apoi jos",
      "s51-2-3-z3-social": "Privim copacul împreună",
      "s51-2-3-z4-fizic": "Atingem pământul din curte",
      "s51-2-3-z4-mental": "Uite pământul",
      "s51-2-3-z4-resurse": "Mâinile curate după pământ",
      "s51-2-3-z4-social": "Atingem pământul pe rând",
      "s51-2-3-z5-fizic": "Drumul scurt la poarta noastră",
      "s51-2-3-z5-mental": "Uite poarta",
      "s51-2-3-z5-resurse": "Mâna pe poartă, apoi jos",
      "s51-2-3-z5-social": "Arătăm poarta",
      "s51-2-3-z6-fizic": "Ascultăm în curte",
      "s51-2-3-z6-mental": "Pasăre — sau mașină?",
      "s51-2-3-z6-resurse": "Înapoi la ușă, pantofii la loc",
      "s51-2-3-z6-social": "Ascultăm afară împreună",
      "s51-2-3-z7-fizic": "Plimbare în curtea cunoscută",
      "s51-2-3-z7-mental": "Cartea cu curtea",
      "s51-2-3-z7-resurse": "Haina și pantofii la loc",
      "s51-2-3-z7-social": "Noapte bună",
      "s52-2-3-z1-fizic": "Pași liniștiți prin casă",
      "s52-2-3-z1-mental": "Anul se încheie",
      "s52-2-3-z1-resurse": "O jucărie pe masă, lin",
      "s52-2-3-z1-social": "Stăm blând, unul lângă altul",
      "s52-2-3-z2-fizic": "Atingem trei locuri din casă",
      "s52-2-3-z2-mental": "Ți-aduci aminte casa?",
      "s52-2-3-z2-resurse": "Trei lucruri la loc, încet",
      "s52-2-3-z2-social": "Arătăm casa",
      "s52-2-3-z3-fizic": "Cartea anului, pagina ta",
      "s52-2-3-z3-mental": "Imagini din an",
      "s52-2-3-z3-resurse": "Cartea pe raft, la încheiere",
      "s52-2-3-z3-social": "Citim blând împreună",
      "s52-2-3-z4-fizic": "Dăm mingea încet",
      "s52-2-3-z4-mental": "Mingea și rândul, ca înainte",
      "s52-2-3-z4-resurse": "Mingea în cutie, la final",
      "s52-2-3-z4-social": "Mingea pe rând, blând",
      "s52-2-3-z5-fizic": "Privim pe geam, încet",
      "s52-2-3-z5-mental": "Afară și în casă, e bine",
      "s52-2-3-z5-resurse": "Perdeaua la loc, încet",
      "s52-2-3-z5-social": "Privim geamul la final",
      "s52-2-3-z6-fizic": "Ne leagănăm, anul se încheie",
      "s52-2-3-z6-mental": "Gata, încet",
      "s52-2-3-z6-resurse": "Favoritele pe raft",
      "s52-2-3-z6-social": "Spunem mulțumim",
      "s52-2-3-z7-fizic": "Plimbare lină, anul se încheie",
      "s52-2-3-z7-mental": "Cartea de la capăt de an",
      "s52-2-3-z7-resurse": "Totul la loc",
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

  test("S1–S52 titles stay spoken Romanian: no jargon, no adultul, no pe scurt", () => {
    const weeks = Array.from({ length: 52 }, (_, i) => i + 1);
    const rows = weeks.flatMap((week) => getSeedActivities(week));
    expect(rows).toHaveLength(1456);
    for (const row of rows) {
      expect(row.titlu).not.toMatch(/\bparalel\b/i);
      if (row.id !== "s40-2-3-z1-mental") {
        expect(row.titlu).not.toMatch(/pe scurt/i);
      }
      expect(row.titlu).not.toMatch(/cu adultul/);
      expect(row.titlu).not.toMatch(/^Carte:/);
      expect(row.titlu).not.toMatch(/\bHai\b/);
      expect(row.titlu).not.toMatch(/\b(Play|worksheet|okay|cool)\b/i);
    }
    expect(rows.find((row) => row.id === "s40-2-3-z1-mental")?.titlu).toBe(
      "Ajutor pe scurt",
    );
    const s32 = getSeedActivities(32).map((row) => row.titlu).join(" ");
    expect(s32).toMatch(/Balon/);
    expect(s32).not.toMatch(/[Mm]inge/);
    const s21 = getSeedActivities(21).map((row) => row.titlu).join(" ");
    expect(s21).toMatch(/geam/i);
    expect(s21).not.toMatch(/Pervazul:/);
    const s33 = getSeedActivities(33).map((row) => row.titlu).join(" ");
    expect(s33).toMatch(/Lopăți/);
  });

  test("S32 lock is balloon: theme, ritual, surprises, zero minge in body", () => {
    expect(playfulPilotFor(32, 1)?.theme).toBe("Balonul afară");
    expect(playfulPilotFor(32, 1)?.ritualOpen).toBe("Balonul afară.");
    expect(playfulPilotFor(32, 7)?.ritualClose).toBe("Balonul, gata.");
    expect(
      [1, 2, 3, 4, 5, 6, 7].map((day) => playfulPilotFor(32, day)?.surprise),
    ).toEqual([
      "Balonul se leagănă 1 sec pe sfoară",
      "El alege: sfoară lungă sau scurtă",
      "O bătaie ușoară pe balon",
      "Balonul „dispare” 2 sec după un arbore / mobilă",
      "Ținem sfoara pe rând",
      "Un pas cu balonul (sfoara în mână)",
      "Balonul pe cui / la loc",
    ]);
    const rows = getSeedActivities(32);
    expect(rows).toHaveLength(28);
    for (const row of rows) {
      const blob = [
        row.titlu,
        row.tema_saptamana,
        row.gata_cand,
        ...row.materiale,
        ...row.pasi,
      ].join("\n");
      expect(blob).not.toMatch(/minge/i);
      expect(row.tema_saptamana).toBe("Balonul afară");
    }
    expect(rows.find((row) => row.id === "s32-2-3-z2-mental")?.titlu).toBe(
      "Balonul e moale",
    );
    expect(rows.find((row) => row.id === "s32-2-3-z1-fizic")?.pasi).toEqual([
      "În curte: țineți sfoara împreună pe scurt.",
      "„Balon.” 10–20 de secunde.",
    ]);
  });

  test("S33 lock: Lopățică chrome name; Z1 fizic / Z2 resurse / Z6 fizic aligned", () => {
    expect(PLAYFUL_CHARACTERS.lopetica.name).toBe("Lopățică");
    const z1 = getSeedActivities(33).find((row) => row.id === "s33-2-3-z1-fizic");
    expect(z1?.titlu).toBe("Lopățica în nisip");
    expect(z1?.materiale).toEqual([
      "lopățică",
      "nisip în cutie sau pe plajă mică",
    ]);
    expect(z1?.pasi).toEqual([
      "Luați lopățica. Scoateți puțin nisip pe scurt.",
      "„Lopățică. Nisip.” 10–20 de secunde.",
    ]);
    expect(z1?.gata_cand).toBe("A atins lopățica / nisipul sau a privit.");
    const z2 = getSeedActivities(33).find(
      (row) => row.id === "s33-2-3-z2-resurse",
    );
    expect(z2?.titlu).toBe("Lopățica la loc");
    expect(z2?.materiale).toEqual(["lopățică"]);
    expect(z2?.pasi).toEqual([
      "Puneți lopățica pe raft sau lângă găleată.",
      "„Lopățică. La loc.”",
    ]);
    expect(z2?.gata_cand).toBe("A ajutat să pună lopățica la loc.");
    const z6 = getSeedActivities(33).find((row) => row.id === "s33-2-3-z6-fizic");
    expect(z6?.titlu).toBe("Lopățica și găleata, apoi gata");
    expect(z6?.materiale).toEqual(["lopățică", "găleată", "nisip"]);
    expect(z6?.pasi).toEqual([
      "Cu lopățica, puneți puțin nisip în găleată.",
      "Apoi: „Gata.” pe scurt, cu adult.",
    ]);
    expect(z6?.gata_cand).toBe("A folosit lopățica / găleata sau a privit.");
  });

  test("P2 LOCK A: 12 mono titles → 2–4 words; body/theme unchanged; S32 skipped", () => {
    const expected: Record<
      string,
      {
        titlu: string;
        tema: string;
        materiale: string[];
        pasi: string[];
        gata_cand: string;
      }
    > = {
      "s1-2-3-z2-social": {
        titlu: "Spunem mulțumesc",
        tema: "Casa și curtea",
        materiale: [],
        pasi: [
          "După o gustare: „Mulțumesc.”",
          "Modelați voi; el imită dacă vrea.",
        ],
        gata_cand: "A auzit și/sau a încercat cuvântul.",
      },
      "s30-2-3-z5-mental": {
        titlu: "Pasărea zboară",
        tema: "Păsări dimineața",
        materiale: [],
        pasi: ["Arătați: „Pasăre.”", "„Zboară.” pe scurt, dacă e cazul."],
        gata_cand: "A auzit pasăre și zboară.",
      },
      "s31-2-3-z4-mental": {
        titlu: "Umed și uscat",
        tema: "Semințe și udat",
        materiale: [],
        pasi: [
          "Arătați pământul: „Umed.” pe scurt.",
          "Dacă e uscat undeva: „Uscat.”",
        ],
        gata_cand: "A auzit umed și uscat.",
      },
      "s35-2-3-z5-mental": {
        titlu: "Apa e rece",
        tema: "Apă afară (joc scurt)",
        materiale: [],
        pasi: ['Atingeți apa: „Rece.” pe scurt.', "„Apă.”"],
        gata_cand: "A auzit rece și apă.",
      },
      "s36-2-3-z4-mental": {
        titlu: "Zumzet și liniște",
        tema: "Insecte de departe",
        materiale: [],
        pasi: [
          "„Zumzet.” pe scurt dacă e.",
          "Apoi: „Liniște.” câteva secunde.",
        ],
        gata_cand: "A auzit zumzet sau liniște.",
      },
      "s38-2-3-z2-mental": {
        titlu: "Iarba e moale",
        tema: "Piciorul pe iarbă",
        materiale: [],
        pasi: ["Arătați iarba: „Iarbă.”", "„Moale.” pe scurt."],
        gata_cand: "A auzit iarbă și moale.",
      },
      "s38-2-3-z3-mental": {
        titlu: "Iarba gâdilă",
        tema: "Piciorul pe iarbă",
        materiale: [],
        pasi: [
          "Arătați iarba la picior: „Iarbă.”",
          "„Gâdilă.” pe scurt, dacă simte.",
        ],
        gata_cand: "A auzit iarbă și gâdilă.",
      },
      "s38-2-3-z6-mental": {
        titlu: "Moale și tare",
        tema: "Piciorul pe iarbă",
        materiale: [],
        pasi: ["Pe iarbă: „Moale.” pe scurt.", "Pe piatră: „Tare.”"],
        gata_cand: "A auzit moale și tare.",
      },
      "s39-2-3-z4-mental": {
        titlu: "Coaja e netedă",
        tema: "Fructe pe care le vedem",
        materiale: ["fruct"],
        pasi: ["Arătați coaja: „Coajă.”", "„Netedă.” pe scurt, dacă e."],
        gata_cand: "A auzit coajă și netedă.",
      },
      "s39-2-3-z5-mental": {
        titlu: "Gust dulce",
        tema: "Fructe pe care le vedem",
        materiale: ["bucățică de fruct"],
        pasi: ["Arătați bucățica: „Gust.”", "„Dulce.” pe scurt, dacă e."],
        gata_cand: "A auzit gust și dulce.",
      },
      "s40-2-3-z1-mental": {
        titlu: "Ajutor pe scurt",
        tema: "Ajutor la treabă scurtă",
        materiale: [],
        pasi: [
          "Arătați obiectul: „Ajutor.”",
          "„Da.” pe scurt, dacă vrea să ajute.",
        ],
        gata_cand: "A auzit ajutor.",
      },
      "s52-2-3-z6-social": {
        titlu: "Spunem mulțumim",
        tema: "Anul se închide blând",
        materiale: [],
        pasi: [
          "„Mulțumesc.” pe scurt.",
          "Modelați voi; el imită dacă vrea, fără forțare.",
        ],
        gata_cand: "A auzit sau a încercat mulțumesc.",
      },
    };
    expect(Object.keys(expected)).toHaveLength(12);
    for (const [id, lock] of Object.entries(expected)) {
      const row = getSeedActivityById(id);
      expect(row?.titlu).toBe(lock.titlu);
      expect(row?.tema_saptamana).toBe(lock.tema);
      expect(row?.materiale).toEqual(lock.materiale);
      expect(row?.pasi).toEqual(lock.pasi);
      expect(row?.gata_cand).toBe(lock.gata_cand);
    }
    expect(getSeedActivityById("s32-2-3-z2-mental")?.titlu).toBe(
      "Balonul e moale",
    );
  });

  test("Lock B: 35 ids keep title/theme; body names the object (zero proxy)", () => {
    const expected: Record<
      string,
      {
        titlu: string;
        tema: string;
        materiale: string[];
        pasi: string[];
        gata_cand: string;
      }
    > = {
      "s1-2-3-z6-fizic": {
        titlu: "Nisip, iarbă, pietre",
        tema: "Casa și curtea",
        materiale: ["nisip, iarbă sau pietre"],
        pasi: [
          "Atingeți pe scurt nisip, iarbă sau o piatră, cu adult.",
          "„Moale. Aspru.”",
        ],
        gata_cand: "A explorat 2 texturi denumite.",
      },
      "s22-2-3-z6-resurse": {
        titlu: "Pantofii de casă, la loc",
        tema: "Corp care se mișcă în casă",
        materiale: ["pantofi de casă"],
        pasi: [
          "Puneți pantofii de casă la loc lângă ușă sau pe raft.",
          "„Pantofi. La loc.”",
        ],
        gata_cand: "A ajutat cu pantofii de casă.",
      },
      "s22-2-3-z7-resurse": {
        titlu: "Perna și cartea la loc",
        tema: "Corp care se mișcă în casă",
        materiale: ["pernă", "carte"],
        pasi: [
          "Puneți perna și cartea la loc după joacă.",
          "„La loc. Gata.”",
        ],
        gata_cand: "A ajutat cu perna sau cartea.",
      },
      "s23-2-3-z6-mental": {
        titlu: "Floare — sau frunză?",
        tema: "Mirosuri din casă",
        materiale: [],
        pasi: [
          "Arătați o floare: „Floare.”",
          "Arătați o frunză: „Frunză.” pe scurt.",
        ],
        gata_cand: "A auzit floare și frunză.",
      },
      "s23-2-3-z7-resurse": {
        titlu: "Cana și cartea la loc",
        tema: "Mirosuri din casă",
        materiale: ["cană", "carte"],
        pasi: ["Puneți cana și cartea la loc.", "„La loc. Gata.”"],
        gata_cand: "A ajutat cu cana sau cartea.",
      },
      "s24-2-3-z3-resurse": {
        titlu: "Pantofii lângă ușă",
        tema: "Familia și oaspeții",
        materiale: ["pantofi"],
        pasi: ["Așezați pantofii lângă ușă.", "„Pantofi. La ușă.”"],
        gata_cand: "A ajutat cu pantofii lângă ușă.",
      },
      "s24-2-3-z7-resurse": {
        titlu: "Pantofii și haina la loc",
        tema: "Familia și oaspeții",
        materiale: ["pantofi", "haină"],
        pasi: ["Puneți pantofii și haina la loc.", "„La loc. Gata.”"],
        gata_cand: "A ajutat cu pantofii sau haina.",
      },
      "s26-2-3-z7-resurse": {
        titlu: "Cartea și mingea la loc",
        tema: "Jumătate de an: repetăm favoritele",
        materiale: ["carte", "minge"],
        pasi: ["Puneți cartea și mingea pe raft.", "„La loc. Gata.”"],
        gata_cand: "A ajutat să pună cartea sau mingea.",
      },
      "s29-2-3-z2-resurse": {
        titlu: "Pantofii după iarbă",
        tema: "Muguri și iarbă nouă",
        materiale: ["pantofi"],
        pasi: ["După iarbă: pantofii lângă ușă.", "„Pantofi. La loc.”"],
        gata_cand: "A ajutat cu pantofii după iarbă.",
      },
      "s29-2-3-z3-fizic": {
        titlu: "Atingem o frunză mică",
        tema: "Muguri și iarbă nouă",
        materiale: ["frunză pe plantă"],
        pasi: [
          "Atingeți pe scurt o frunză mică, cu adult.",
          "„Frunză.” 10–20 de secunde.",
        ],
        gata_cand: "A atins frunza sau a privit.",
      },
      "s29-2-3-z3-resurse": {
        titlu: "Frunza rămâne pe plantă",
        tema: "Muguri și iarbă nouă",
        materiale: ["plantă cu frunze"],
        pasi: [
          "Arătați: frunza rămâne pe plantă.",
          "„Frunză. Pe plantă.” fără a smulge.",
        ],
        gata_cand: "A privit frunza pe plantă.",
      },
      "s29-2-3-z3-social": {
        titlu: "Atingem frunza pe rând",
        tema: "Muguri și iarbă nouă",
        materiale: ["frunză pe plantă"],
        pasi: ["Pe rând: atingeți frunza mică.", "„Acum tu.” fără forțare."],
        gata_cand: "A atins pe rând sau a privit.",
      },
      "s29-2-3-z5-mental": {
        titlu: "Mugure și frunză",
        tema: "Muguri și iarbă nouă",
        materiale: [],
        pasi: [
          "Arătați un mugure: „Mugure.”",
          "Arătați o frunză: „Frunză.” pe scurt.",
        ],
        gata_cand: "A auzit mugure și frunză.",
      },
      "s29-2-3-z6-resurse": {
        titlu: "Pantofii la ușă după iarbă",
        tema: "Muguri și iarbă nouă",
        materiale: ["pantofi"],
        pasi: ["După iarbă: pantofii la ușă.", "„Pantofi. La ușă.”"],
        gata_cand: "A ajutat cu pantofii la ușă.",
      },
      "s29-2-3-z7-resurse": {
        titlu: "Stropitoarea și pantofii la loc",
        tema: "Muguri și iarbă nouă",
        materiale: ["stropitoare", "pantofi"],
        pasi: [
          "Stropitoarea la loc; pantofii lângă ușă.",
          "„La loc. Gata.”",
        ],
        gata_cand: "A ajutat cu stropitoarea sau pantofii.",
      },
      "s30-2-3-z3-resurse": {
        titlu: "Pantofii după ascultat",
        tema: "Păsări dimineața",
        materiale: ["pantofi"],
        pasi: ["După ascultat: pantofii lângă ușă.", "„Pantofi. Gata.”"],
        gata_cand: "A ajutat cu pantofii sau a privit.",
      },
      "s35-2-3-z6-fizic": {
        titlu: "O picătură pe frunză",
        tema: "Apă afară (joc scurt)",
        materiale: ["pahar cu puțină apă", "frunză"],
        pasi: [
          "Lăsați o picătură pe o frunză, cu adult.",
          "„Picătură. Frunză.” pe scurt.",
        ],
        gata_cand: "A lăsat picătura pe frunză sau a privit.",
      },
      "s35-2-3-z6-resurse": {
        titlu: "Frunza rămâne afară",
        tema: "Apă afară (joc scurt)",
        materiale: ["frunză afară"],
        pasi: [
          "Frunza rămâne afară — nu o aduceți în casă.",
          "„Frunză. Afară.”",
        ],
        gata_cand: "A lăsat frunza afară sau a privit.",
      },
      "s36-2-3-z2-mental": {
        titlu: "Pe frunză",
        tema: "Insecte de departe",
        materiale: [],
        pasi: [
          "Arătați pe frunză: „Pe frunză.”",
          "Privire scurtă, fără atingere dacă e insectă.",
        ],
        gata_cand: "A auzit pe frunză.",
      },
      "s36-2-3-z6-mental": {
        titlu: "Pământ — sau frunză?",
        tema: "Insecte de departe",
        materiale: [],
        pasi: [
          "Arătați pământul: „Pământ.”",
          "Arătați o frunză: „Frunză.” pe scurt.",
        ],
        gata_cand: "A auzit pământ și frunză.",
      },
      "s38-2-3-z4-resurse": {
        titlu: "Pantofii după pași",
        tema: "Piciorul pe iarbă",
        materiale: ["pantofi"],
        pasi: ["După pași: pantofii lângă ușă.", "„Pantofi. Gata.”"],
        gata_cand: "A ajutat cu pantofii sau a privit.",
      },
      "s38-2-3-z7-fizic": {
        titlu: "Plimbare desculți, apoi pantofi",
        tema: "Piciorul pe iarbă",
        materiale: ["pantofi"],
        pasi: [
          "Câțiva pași desculți pe iarbă, cu adult.",
          "Apoi pantofii: „Pantofi.”",
        ],
        gata_cand: "A mers desculț pe scurt, apoi pantofi.",
      },
      "s40-2-3-z1-fizic": {
        titlu: "Ținem mătura",
        tema: "Ajutor la treabă scurtă",
        materiale: ["mătură de copil"],
        pasi: [
          "Țineți mătura pe scurt, cu adult.",
          "„Mătură.” 10–20 de secunde.",
        ],
        gata_cand: "A ținut mătura sau a atins-o.",
      },
      "s40-2-3-z1-resurse": {
        titlu: "Mătura lângă ușă",
        tema: "Ajutor la treabă scurtă",
        materiale: ["mătură de copil"],
        pasi: [
          "Puneți mătura lângă ușă sau la locul ei.",
          "„Mătură. Aici.”",
        ],
        gata_cand: "A ajutat să pună mătura.",
      },
      "s40-2-3-z1-social": {
        titlu: "Măturăm împreună",
        tema: "Ajutor la treabă scurtă",
        materiale: ["mătură de copil"],
        pasi: [
          "Țineți mătura împreună pe scurt.",
          "„Împreună. Mătură.” fără forțare.",
        ],
        gata_cand: "A ținut mătura cu adultul sau a privit.",
      },
      "s40-2-3-z4-fizic": {
        titlu: "Haina pe cuier",
        tema: "Ajutor la treabă scurtă",
        materiale: ["haină", "cuier"],
        pasi: [
          "Puneți haina pe cuier, cu adult.",
          "„Haină. Cuier.” pe scurt.",
        ],
        gata_cand: "A ajutat cu haina pe cuier.",
      },
      "s40-2-3-z4-mental": {
        titlu: "Haina la locul ei",
        tema: "Ajutor la treabă scurtă",
        materiale: ["haină"],
        pasi: ['Întrebați: „Unde e haina?”', 'Arătați: „Aici. La loc.”'],
        gata_cand: "A auzit unde și aici.",
      },
      "s40-2-3-z4-social": {
        titlu: "Punem haina împreună",
        tema: "Ajutor la treabă scurtă",
        materiale: ["haină", "cuier"],
        pasi: [
          "Puneți haina pe cuier împreună.",
          "„Împreună. Haină.” fără forțare.",
        ],
        gata_cand: "A ajutat cu haina sau a privit.",
      },
      "s40-2-3-z5-fizic": {
        titlu: "Măturăm trei fire",
        tema: "Ajutor la treabă scurtă",
        materiale: ["mătură de copil"],
        pasi: [
          "Măturați pe scurt trei fire / o zonă mică.",
          "„Mătură. Trei.”",
        ],
        gata_cand: "A măturat pe scurt sau a privit.",
      },
      "s40-2-3-z5-social": {
        titlu: "Măturăm pe rând",
        tema: "Ajutor la treabă scurtă",
        materiale: ["mătură de copil"],
        pasi: ["Voi măturați. „Acum tu.”", "Așteptați fără forțare."],
        gata_cand: "A măturat pe rând sau a privit.",
      },
      "s40-2-3-z6-resurse": {
        titlu: "Mătura la loc",
        tema: "Ajutor la treabă scurtă",
        materiale: ["mătură de copil"],
        pasi: ["Puneți mătura la loc.", "„Mătură. Gata.”"],
        gata_cand: "A ajutat să pună mătura la loc.",
      },
      "s40-2-3-z7-resurse": {
        titlu: "Mătura și cârpa la loc",
        tema: "Ajutor la treabă scurtă",
        materiale: ["mătură de copil", "cârpă"],
        pasi: ["Mătura și cârpa la loc.", "„La loc. Gata.”"],
        gata_cand: "A ajutat cu mătura sau cârpa.",
      },
      "s42-2-3-z6-resurse": {
        titlu: "Găleata la loc după frunze",
        tema: "Vânt și frunze din nou",
        materiale: ["găleată"],
        pasi: [
          "După frunze: găleata pe treaptă sau în casă.",
          "„Găleată. La loc.”",
        ],
        gata_cand: "A ajutat să pună găleata.",
      },
      "s45-2-3-z2-resurse": {
        titlu: "Pantofii la ușă",
        tema: "Corp puternic, pași mulți",
        materiale: ["pantofi"],
        pasi: ["Pantofii lângă ușă.", "„Pantofi. La ușă.”"],
        gata_cand: "A ajutat cu pantofii.",
      },
      "s45-2-3-z4-resurse": {
        titlu: "Pantofii după curte",
        tema: "Corp puternic, pași mulți",
        materiale: ["pantofi"],
        pasi: ["După curte: pantofii la loc.", "„Pantofi. Gata.”"],
        gata_cand: "A ajutat cu pantofii după curte.",
      },
    };
    expect(Object.keys(expected)).toHaveLength(35);
    expect(playfulPilotFor(40, 1)?.character.name).toBe("Măturică");
    expect(playfulPilotFor(40, 1)?.theme).toBe("Ajutor la treabă scurtă");
    const proxy = /prosop|șervețel|lingură/;
    const english = /\b(the|towel|spoon|basket|okay|worksheet)\b/i;
    for (const [id, lock] of Object.entries(expected)) {
      const row = getSeedActivityById(id);
      expect(row, id).toBeDefined();
      expect(row?.titlu).toBe(lock.titlu);
      expect(row?.tema_saptamana).toBe(lock.tema);
      expect(row?.materiale).toEqual(lock.materiale);
      expect(row?.pasi).toEqual(lock.pasi);
      expect(row?.pasi).toHaveLength(2);
      expect(row?.gata_cand).toBe(lock.gata_cand);
      const blob = [...row!.materiale, ...row!.pasi, row!.gata_cand].join("\n");
      expect(blob).not.toMatch(proxy);
      expect(blob).not.toMatch(english);
    }
    const migration = readFileSync(
      resolve("supabase/migrations/20260920240000_align_title_body_35.sql"),
      "utf8",
    );
    expect(migration).toMatch(/^\s*materiale = v\.materiale,/m);
    expect(migration).toMatch(/^\s*pasi = v\.pasi,/m);
    expect(migration).toMatch(/^\s*gata_cand = v\.gata_cand$/m);
    expect(migration).not.toMatch(/titlu =/);
    expect(migration).not.toMatch(/tema_saptamana =/);
    expect(migration).not.toMatch(/s32-2-3-/);
    expect(migration).not.toMatch(/s33-2-3-/);
    expect(migration).not.toMatch(/-b23-/);
    expect(migration.match(/s\d+-2-3-z\d-[a-z]+/g)).toHaveLength(35);
  });

  test("P3 Lock B: 32 residual ids keep title/theme; body names the object (zero proxy)", () => {
    const expected: Record<
      string,
      {
        titlu: string;
        tema: string;
        materiale: string[];
        pasi: string[];
        gata_cand: string;
      }
    > = {
      "s14-2-3-z7-resurse": {
        titlu: "Pantofii și haina la loc",
        tema: "Pași pe drumul scurt",
        materiale: ["pantofi", "haină"],
        pasi: ["Puneți pantofii și haina la loc.", "„La loc. Gata.”"],
        gata_cand: "A ajutat cu pantofii sau haina.",
      },
      "s21-2-3-z5-resurse": {
        titlu: "Floarea de pe pervaz, la loc",
        tema: "Iarna pe pervaz",
        materiale: ["floare pe pervaz"],
        pasi: [
          "Luați floarea pe scurt.",
          "Puneți-o la loc: „Floare. Pervaz.”",
        ],
        gata_cand: "A ajutat cu floarea pe pervaz.",
      },
      "s23-2-3-z5-resurse": {
        titlu: "Lingura la chiuvetă",
        tema: "Mirosuri din casă",
        materiale: ["lingură"],
        pasi: ["Puneți lingura la chiuvetă.", "„Lingură. La loc.”"],
        gata_cand: "A ajutat cu lingura.",
      },
      "s23-2-3-z6-fizic": {
        titlu: "Mirosim o floare",
        tema: "Mirosuri din casă",
        materiale: ["floare (sau plantă cu floare)"],
        pasi: ["Mirosiți pe scurt o floare, cu adult.", "„Floare. Miros.”"],
        gata_cand: "A mirosit sau a privit floarea.",
      },
      "s23-2-3-z6-resurse": {
        titlu: "Floarea rămâne afară",
        tema: "Mirosuri din casă",
        materiale: ["floare afară"],
        pasi: [
          "Floarea rămâne afară — nu o aduceți în casă.",
          "„Floare. Afară.”",
        ],
        gata_cand: "A lăsat floarea afară sau a privit.",
      },
      "s24-2-3-z5-resurse": {
        titlu: "Haina oaspetelui pe cuier",
        tema: "Familia și oaspeții",
        materiale: ["haină", "cuier"],
        pasi: ["Puneți haina oaspetelui pe cuier.", "„Haină. Cuier.”"],
        gata_cand: "A ajutat cu haina pe cuier.",
      },
      "s24-2-3-z6-resurse": {
        titlu: "Haina pe cuier după vizită",
        tema: "Familia și oaspeții",
        materiale: ["haină", "cuier"],
        pasi: ["După vizită: haina pe cuier.", "„Haină. La loc.”"],
        gata_cand: "A ajutat cu haina după vizită.",
      },
      "s27-2-3-z4-resurse": {
        titlu: "Cârpa de geam, la loc",
        tema: "Zăpadă sau ploaie la geam",
        materiale: ["cârpă de geam"],
        pasi: ["Puneți cârpa de geam la loc.", "„Cârpă. La loc.”"],
        gata_cand: "A ajutat cu cârpa.",
      },
      "s27-2-3-z5-fizic": {
        titlu: "Haina de ploaie pe umeri",
        tema: "Zăpadă sau ploaie la geam",
        materiale: ["haină de ploaie"],
        pasi: [
          "Puneți haina de ploaie pe umeri pe scurt, cu adult.",
          "„Haină.” 10–20 de secunde.",
        ],
        gata_cand: "A purtat haina pe scurt sau a privit.",
      },
      "s27-2-3-z5-mental": {
        titlu: "Haină — sau fără?",
        tema: "Zăpadă sau ploaie la geam",
        materiale: ["haină de ploaie"],
        pasi: [
          "Arătați haina: „Haină.”",
          "Arătați fără: „Fără.” pe scurt.",
        ],
        gata_cand: "A auzit haină și fără.",
      },
      "s27-2-3-z5-resurse": {
        titlu: "Haina pe cârlig",
        tema: "Zăpadă sau ploaie la geam",
        materiale: ["haină"],
        pasi: ["Puneți haina pe cârlig.", "„Haină. La loc.”"],
        gata_cand: "A ajutat să pună haina.",
      },
      "s27-2-3-z5-social": {
        titlu: "Te ajut la haină",
        tema: "Zăpadă sau ploaie la geam",
        materiale: ["haină"],
        pasi: ["Voi țineți haina. „Acum tu.”", "Așteptați fără forțare."],
        gata_cand: "A ajutat la haină sau a privit.",
      },
      "s27-2-3-z7-resurse": {
        titlu: "Haina și cartea la loc",
        tema: "Zăpadă sau ploaie la geam",
        materiale: ["haină", "carte"],
        pasi: ["Puneți haina pe cârlig, cartea pe raft.", "„La loc.”"],
        gata_cand: "A ajutat cu haina sau cartea.",
      },
      "s28-2-3-z3-resurse": {
        titlu: "Cârpa de cizme, la loc",
        tema: "Dezgheț și noroi",
        materiale: ["cârpă", "cizme"],
        pasi: ["Ștergeți pe scurt cizma cu cârpa.", "„Cârpă. La loc.”"],
        gata_cand: "A ajutat cu cârpa sau a privit.",
      },
      "s28-2-3-z5-resurse": {
        titlu: "Prosopul la loc",
        tema: "Dezgheț și noroi",
        materiale: ["prosop"],
        pasi: ["Puneți prosopul la loc după șters.", "„Prosop. La loc.”"],
        gata_cand: "A ajutat cu prosopul.",
      },
      "s28-2-3-z7-resurse": {
        titlu: "Cizmele și haina la loc",
        tema: "Dezgheț și noroi",
        materiale: ["cizme", "haină"],
        pasi: ["Puneți cizmele lângă ușă, haina pe cârlig.", "„La loc. Gata.”"],
        gata_cand: "A ajutat cu cizmele sau haina.",
      },
      "s29-2-3-z1-fizic": {
        titlu: "Degetul pe mugure",
        tema: "Muguri și iarbă nouă",
        materiale: ["mugure pe plantă"],
        pasi: [
          "Atingeți pe scurt un mugure, cu adult.",
          "„Mugure.” 10–20 de secunde.",
        ],
        gata_cand: "A atins mugurele sau a privit.",
      },
      "s29-2-3-z1-social": {
        titlu: "Arătăm mugurele",
        tema: "Muguri și iarbă nouă",
        materiale: ["mugure pe plantă"],
        pasi: [
          "Arătați mugurele împreună.",
          "„Împreună. Mugure.” fără grabă.",
        ],
        gata_cand: "A privit mugurele cu adultul.",
      },
      "s29-2-3-z5-fizic": {
        titlu: "Ne aplecăm la mugure",
        tema: "Muguri și iarbă nouă",
        materiale: ["mugure pe plantă"],
        pasi: ["Aplecați-vă pe scurt spre mugure, cu adult.", "„Mugure.”"],
        gata_cand: "A privit mugurele de aproape.",
      },
      "s31-2-3-z3-fizic": {
        titlu: "Așteptăm lângă ghiveci",
        tema: "Semințe și udat",
        materiale: ["ghiveci"],
        pasi: ["Stați lângă ghiveci pe scurt.", "„Ghiveci.” 10–20 de secunde."],
        gata_cand: "A stat lângă ghiveci sau a privit.",
      },
      "s31-2-3-z3-resurse": {
        titlu: "Ghiveciul pe pervaz",
        tema: "Semințe și udat",
        materiale: ["ghiveci"],
        pasi: ["Puneți ghiveciul pe pervaz.", "„Ghiveci. Pervaz.”"],
        gata_cand: "A ajutat cu ghiveciul.",
      },
      "s31-2-3-z3-social": {
        titlu: "Privim ghiveciul împreună",
        tema: "Semințe și udat",
        materiale: ["ghiveci"],
        pasi: ["Priviti ghiveciul împreună pe scurt.", "„Împreună. Ghiveci.”"],
        gata_cand: "A privit ghiveciul cu adultul.",
      },
      "s31-2-3-z7-fizic": {
        titlu: "Plimbare până la ghiveci",
        tema: "Semințe și udat",
        materiale: ["ghiveci"],
        pasi: [
          "Mergeți pe scurt până la ghiveci, cu adult.",
          "„Ghiveci.” la final.",
        ],
        gata_cand: "A ajuns la ghiveci sau a privit.",
      },
      "s33-2-3-z6-resurse": {
        titlu: "Mâinile pe prosop",
        tema: "Nisip și găleată",
        materiale: ["prosop"],
        pasi: ["Ștergeți mâinile pe prosop pe scurt.", "„Prosop. La loc.”"],
        gata_cand: "A atins prosopul sau a privit.",
      },
      "s35-2-3-z1-resurse": {
        titlu: "Prosopul afară, apoi la loc",
        tema: "Apă afară (joc scurt)",
        materiale: ["prosop"],
        pasi: ["Prosopul afară pe scurt, apoi la loc.", "„Prosop. La loc.”"],
        gata_cand: "A ajutat cu prosopul.",
      },
      "s35-2-3-z7-resurse": {
        titlu: "Paharul și prosopul la loc",
        tema: "Apă afară (joc scurt)",
        materiale: ["pahar", "prosop"],
        pasi: ["Puneți paharul și prosopul la loc.", "„La loc. Gata.”"],
        gata_cand: "A ajutat cu paharul sau prosopul.",
      },
      "s37-2-3-z5-resurse": {
        titlu: "Haina pe braț, la umbră",
        tema: "Umbră și loc răcoros",
        materiale: ["haină"],
        pasi: ["Puneți haina pe braț la umbră pe scurt.", "„Haină. Umbră.”"],
        gata_cand: "A ținut haina sau a privit.",
      },
      "s39-2-3-z5-resurse": {
        titlu: "Șervețelul la loc",
        tema: "Fructe pe care le vedem",
        materiale: ["șervețel"],
        pasi: ["După gust: șervețelul la loc.", "„Șervețel. La loc.”"],
        gata_cand: "A ajutat cu șervețelul.",
      },
      "s40-2-3-z4-resurse": {
        titlu: "Cuierul e gata",
        tema: "Ajutor la treabă scurtă",
        materiale: ["cuier"],
        pasi: ["Arătați: cuierul e gata.", "„Cuier. Gata.”"],
        gata_cand: "A privit cuierul sau a arătat.",
      },
      "s40-2-3-z5-mental": {
        titlu: "Jos, apoi în făraș",
        tema: "Ajutor la treabă scurtă",
        materiale: ["făraș", "mătură de copil"],
        pasi: ["Arătați: „Jos.”", "„În făraș.” pe scurt."],
        gata_cand: "A auzit jos și făraș.",
      },
      "s40-2-3-z5-resurse": {
        titlu: "Fărașul golit, la loc",
        tema: "Ajutor la treabă scurtă",
        materiale: ["făraș"],
        pasi: ["Goliți fărașul pe scurt, apoi la loc.", "„Făraș. La loc.”"],
        gata_cand: "A ajutat cu fărașul.",
      },
      "s45-2-3-z6-resurse": {
        titlu: "Haina după plimbare",
        tema: "Corp puternic, pași mulți",
        materiale: ["haină"],
        pasi: [
          "După plimbare: haina pe cârlig sau cuier.",
          "„Haină. La loc.”",
        ],
        gata_cand: "A ajutat cu haina.",
      },
    };
    expect(Object.keys(expected)).toHaveLength(32);
    const english = /\b(the|towel|spoon|basket|okay|worksheet|hanger|dustpan)\b/i;
    const leftoverProxy = /șervețel|lingură|farfurie|evantai/;
    const leftoverIds = new Set([
      "s40-2-3-z4-resurse",
      "s40-2-3-z5-mental",
      "s40-2-3-z5-resurse",
    ]);
    for (const [id, lock] of Object.entries(expected)) {
      const row = getSeedActivityById(id);
      expect(row, id).toBeDefined();
      expect(row?.titlu).toBe(lock.titlu);
      expect(row?.tema_saptamana).toBe(lock.tema);
      expect(row?.materiale).toEqual(lock.materiale);
      expect(row?.pasi).toEqual(lock.pasi);
      expect(row?.pasi).toHaveLength(2);
      expect(row?.gata_cand).toBe(lock.gata_cand);
      const blob = [...row!.materiale, ...row!.pasi, row!.gata_cand].join("\n");
      expect(blob).not.toMatch(english);
      if (leftoverIds.has(id)) {
        expect(blob).not.toMatch(leftoverProxy);
      }
    }
    const migration = readFileSync(
      resolve("supabase/migrations/20260920260000_align_title_body_32.sql"),
      "utf8",
    );
    expect(migration).toMatch(/^\s*materiale = v\.materiale,/m);
    expect(migration).toMatch(/^\s*pasi = v\.pasi,/m);
    expect(migration).toMatch(/^\s*gata_cand = v\.gata_cand$/m);
    expect(migration).not.toMatch(/titlu =/);
    expect(migration).not.toMatch(/tema_saptamana =/);
    expect(migration).not.toMatch(/s32-2-3-/);
    expect(migration).not.toMatch(/s33-2-3-z1-fizic/);
    expect(migration).not.toMatch(/s33-2-3-z2-resurse/);
    expect(migration).not.toMatch(/s33-2-3-z6-fizic/);
    expect(migration).not.toMatch(/-b23-/);
    expect(migration.match(/s\d+-2-3-z\d-[a-z]+/g)).toHaveLength(32);
  });

  test("P4 Lock B: 8 residual ids keep title/theme; body names cizme/șosete/rufe (zero proxy)", () => {
    const expected: Record<
      string,
      {
        titlu: string;
        tema: string;
        materiale: string[];
        pasi: string[];
        gata_cand: string;
      }
    > = {
      "s27-2-3-z3-fizic": {
        titlu: "Cizmele la ușă",
        tema: "Zăpadă sau ploaie la geam",
        materiale: ["cizme"],
        pasi: ["Puneți cizmele la ușă pe scurt.", "„Cizme. Ușă.”"],
        gata_cand: "A ajutat cu cizmele sau a privit.",
      },
      "s27-2-3-z3-resurse": {
        titlu: "Cizmele după geam",
        tema: "Zăpadă sau ploaie la geam",
        materiale: ["cizme"],
        pasi: ["După geam: cizmele la loc.", "„Cizme. La loc.”"],
        gata_cand: "A ajutat cu cizmele.",
      },
      "s27-2-3-z6-resurse": {
        titlu: "Șosetele după geam",
        tema: "Zăpadă sau ploaie la geam",
        materiale: ["șosete"],
        pasi: ["După geam: șosetele la loc.", "„Șosete. La loc.”"],
        gata_cand: "A ajutat cu șosetele.",
      },
      "s28-2-3-z3-social": {
        titlu: "Arătăm cizma",
        tema: "Dezgheț și noroi",
        materiale: ["cizmă"],
        pasi: ["Arătați cizma împreună.", "„Împreună. Cizmă.”"],
        gata_cand: "A privit cizma cu adultul.",
      },
      "s28-2-3-z4-resurse": {
        titlu: "Cizmele după băltoacă",
        tema: "Dezgheț și noroi",
        materiale: ["cizme"],
        pasi: ["După băltoacă: cizmele la loc.", "„Cizme. La loc.”"],
        gata_cand: "A ajutat cu cizmele.",
      },
      "s28-2-3-z6-resurse": {
        titlu: "Cizmele la loc, după curte",
        tema: "Dezgheț și noroi",
        materiale: ["cizme"],
        pasi: ["După curte: cizmele la loc.", "„Cizme. La loc.”"],
        gata_cand: "A ajutat cu cizmele.",
      },
      "s35-2-3-z3-resurse": {
        titlu: "Cizmele după băltoacă",
        tema: "Apă afară (joc scurt)",
        materiale: ["cizme"],
        pasi: ["După băltoacă: cizmele la loc.", "„Cizme. La loc.”"],
        gata_cand: "A ajutat cu cizmele.",
      },
      "s23-2-3-z4-resurse": {
        titlu: "Rufele în coș",
        tema: "Mirosuri din casă",
        materiale: ["rufe", "coș"],
        pasi: ["Puneți rufele în coș.", "„Rufele. Coș.”"],
        gata_cand: "A ajutat cu rufele în coș.",
      },
    };
    expect(Object.keys(expected)).toHaveLength(8);
    const english = /\b(the|towel|spoon|basket|okay|worksheet|hanger|dustpan)\b/i;
    const leftoverProxy = /cârpă|pahar|prosop|stropitoare|obiect de pe pervaz/;
    for (const [id, lock] of Object.entries(expected)) {
      const row = getSeedActivityById(id);
      expect(row, id).toBeDefined();
      expect(row?.titlu).toBe(lock.titlu);
      expect(row?.tema_saptamana).toBe(lock.tema);
      expect(row?.materiale).toEqual(lock.materiale);
      expect(row?.pasi).toEqual(lock.pasi);
      expect(row?.pasi).toHaveLength(2);
      expect(row?.gata_cand).toBe(lock.gata_cand);
      const blob = [...row!.materiale, ...row!.pasi, row!.gata_cand].join("\n");
      expect(blob).not.toMatch(english);
      expect(blob).not.toMatch(leftoverProxy);
    }
    const migration = readFileSync(
      resolve("supabase/migrations/20260920270000_align_title_body_8.sql"),
      "utf8",
    );
    expect(migration).toMatch(/^\s*materiale = v\.materiale,/m);
    expect(migration).toMatch(/^\s*pasi = v\.pasi,/m);
    expect(migration).toMatch(/^\s*gata_cand = v\.gata_cand$/m);
    expect(migration).not.toMatch(/titlu =/);
    expect(migration).not.toMatch(/tema_saptamana =/);
    expect(migration).not.toMatch(/s32-2-3-/);
    expect(migration).not.toMatch(/s33-2-3-z1-fizic/);
    expect(migration).not.toMatch(/s33-2-3-z2-resurse/);
    expect(migration).not.toMatch(/s33-2-3-z6-fizic/);
    expect(migration).not.toMatch(/-b23-/);
    expect(migration.match(/s\d+-2-3-z\d-[a-z]+/g)).toHaveLength(8);
  });
});
