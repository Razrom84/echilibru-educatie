import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { getSeedActivities } from "./seed/week1";

/**
 * P5 / T4. Titluri aprobate. Corpul (materiale, pași, gata_cand, notă, temă)
 * rămâne cel de dinaintea schimbării: hash-ul SHA-256 de mai jos e calculat
 * pe acele câmpuri, fără titlu.
 */
type P5Row = {
  liveId: string;
  seedId: string;
  band: "1-2" | "2-3";
  week: number;
  titlu: string;
  /** Titlul din catalogul celeilalte benzi. Nu îl schimbăm în acest lot. */
  otherTitle: string;
  bodySha256: string;
};

const P5_TITLES: P5Row[] = [
  {
    liveId: "s2-2-3-z6-fizic",
    seedId: "s2-2-3-z6-fizic",
    band: "1-2",
    week: 2,
    titlu: "Pași lângă baltă",
    otherTitle: "Apă afară: baltă sau iarbă udă",
    bodySha256: "a407160eb22036a97ee8a91ce6261c4388a26efd45c4d76c452e167b80c01f44",
  },
  {
    liveId: "s6-2-3-z1-mental",
    seedId: "s6-2-3-z1-mental",
    band: "1-2",
    week: 6,
    titlu: "Sus și jos",
    otherTitle: "Sus și jos pe corp",
    bodySha256: "78a5024967788682e21a45db6cf969362e443a7533b48a59d17ef5773887b128",
  },
  {
    liveId: "s6-2-3-z6-resurse",
    seedId: "s6-2-3-z6-resurse",
    band: "1-2",
    week: 6,
    titlu: "Punem găleata jos",
    otherTitle: "Totul jos — cutia plină destul",
    bodySha256: "ae2cdcb2715406c2dcd15b888cc14b7c17f674c2fbd007ce13e25bd50206beab",
  },
  {
    liveId: "s8-2-3-z7-mental",
    seedId: "s8-2-3-z7-mental",
    band: "1-2",
    week: 8,
    titlu: "Întoarcem o pagină",
    otherTitle: "Favorita săptămânii: frunză sau pământ",
    bodySha256: "117e599618ffa533867fe4e5c553ccf0e378d73937188d0a4f75ab826a172cd6",
  },
  {
    liveId: "s11-2-3-z5-fizic",
    seedId: "s11-2-3-z5-fizic",
    band: "1-2",
    week: 11,
    titlu: "Dans scurt la fereastră",
    otherTitle: "Sărituri mici în lumină, pași lenți în umbră",
    bodySha256: "c7ae97fa8580588d47be1e6000ffe9f6824a98fd4a966a3338467730c9439c98",
  },
  {
    liveId: "s11-2-3-z6-social",
    seedId: "s11-2-3-z6-social",
    band: "1-2",
    week: 11,
    titlu: "Afară, lângă adult",
    otherTitle: "Joacă paralel: eu în lumină, tu în umbră",
    bodySha256: "1a9d60239c25e6a45794895c99ce02513468a4914e223ed80eb38574ff859252",
  },
  {
    liveId: "s16-2-3-z7-fizic",
    seedId: "s16-2-3-z7-fizic",
    band: "1-2",
    week: 16,
    titlu: "Plimbare, apoi bem apă",
    otherTitle: "Apă liberă — cum vrea el",
    bodySha256: "b5b9bae6aed5f7b2046a0bcf0e54cd590b4a539fe881d8390df8ba4a98b52315",
  },
  {
    liveId: "s21-2-3-z5-fizic",
    seedId: "s21-2-3-z5-fizic",
    band: "1-2",
    week: 21,
    titlu: "Mâna pe pervaz",
    otherTitle: "Traseu: cameră → geam → întindere → gata",
    bodySha256: "7a884decd47c66b23153a913cc5ceef16366cec3b7e70c17b0e1b2f92f101510",
  },
  {
    liveId: "s21-2-3-z6-resurse",
    seedId: "s21-2-3-z6-resurse",
    band: "1-2",
    week: 21,
    titlu: "Șosetele la loc",
    otherTitle: "Perdeaua / jucăria de pe pervaz la loc",
    bodySha256: "696eb86c3c17ce66010267ec51a3d2ebb0903d34120cbcd12d0c023b2b49b807",
  },
  {
    liveId: "s23-2-3-z4-fizic",
    seedId: "s23-2-3-z4-fizic",
    band: "1-2",
    week: 23,
    titlu: "Mirosim prosopul",
    otherTitle: "Traseu mirosuri: săpun → pâine",
    bodySha256: "f3cb0fd1e8af04b1edb574df2695a7feb8d73b8677bbf36d76b6749555579717",
  },
  {
    liveId: "s23-2-3-z4-mental",
    seedId: "s23-2-3-z4-mental",
    band: "1-2",
    week: 23,
    titlu: "Miroase a curat",
    otherTitle: "Miros, săpun, pâine — pe obiecte",
    bodySha256: "a68f45388a0cd5ad43a7cd44c2a2af7cf29f8dd609a0e170de6fbd5a97808f1a",
  },
  {
    liveId: "s24-2-3-z1-resurse",
    seedId: "s24-2-3-z1-resurse",
    band: "1-2",
    week: 24,
    titlu: "Jucăria-oaspete pe raft",
    otherTitle: "Loc pentru oaspete — scaunul",
    bodySha256: "48b2da30862ffa0124ba3c09f9416e0704d560b93f55f13c4ded002a36c3ee01",
  },
  {
    liveId: "s24-2-3-z2-resurse",
    seedId: "s24-2-3-z2-resurse",
    band: "1-2",
    week: 24,
    titlu: "Haina pe cârlig",
    otherTitle: "Jucăria de salut pe raft",
    bodySha256: "13db8517ff6d6c7962267b06264047133048c8c27d82544bb631af87be780a42",
  },
  {
    liveId: "s24-2-3-z3-fizic",
    seedId: "s24-2-3-z3-fizic",
    band: "1-2",
    week: 24,
    titlu: "Jucărie pe scaun",
    otherTitle: "Așezăm scaunul pentru prieten",
    bodySha256: "316e8aaa1d9deef77fc423a756597eee6f224d2f085231dffd38bc75c72d32f3",
  },
  {
    liveId: "s24-2-3-z3-social",
    seedId: "s24-2-3-z3-social",
    band: "1-2",
    week: 24,
    titlu: "Poftim, e pentru tine",
    otherTitle: "Rândul la bună",
    bodySha256: "543fa741891cdfe1763346b00aa6e6ef71c8c9000a03bf9fb855e3cc5cfedfc0",
  },
  {
    liveId: "s24-2-3-z4-fizic",
    seedId: "s24-2-3-z4-fizic",
    band: "1-2",
    week: 24,
    titlu: "Pe canapea, lângă adult",
    otherTitle: "La revedere cu mâna — pași spre ușă pe scurt",
    bodySha256: "410c38c850970e9b2299aedab226ada470ff446aaca745484cd0ea0a2bab0604",
  },
  {
    liveId: "s24-2-3-z4-social",
    seedId: "s24-2-3-z4-social",
    band: "1-2",
    week: 24,
    titlu: "Stăm puțin lângă adult",
    otherTitle: "Eu bună, tu la revedere — apoi invers",
    bodySha256: "908be155071580fcba25938d3b02f2677449966b6d60a44d979ff6a7a4797d6a",
  },
  {
    liveId: "s24-2-3-z6-fizic",
    seedId: "s24-2-3-z6-fizic",
    band: "1-2",
    week: 24,
    titlu: "Poza cu familia",
    otherTitle: "Joacă liberă — bună / la revedere pe scurt",
    bodySha256: "6ff2aa0b5296374a41e46debacb4be2eca3d54d3fba9f0f369fcb23961c070de",
  },
  {
    liveId: "s24-2-3-z7-fizic",
    seedId: "s24-2-3-z7-fizic",
    band: "1-2",
    week: 24,
    titlu: "Plimbare prin casă, cu salut",
    otherTitle: "Mișcare liberă — bună sau la revedere la final",
    bodySha256: "eccbba95d8ddecdd4210e142e0d10ed4a8975c48d7f0e7bf3830c0b013f4d1ba",
  },
  {
    liveId: "s25-2-3-z3-fizic",
    seedId: "s25-2-3-z3-fizic",
    band: "1-2",
    week: 25,
    titlu: "Pătura pe pat",
    otherTitle: "Dans scurt în lumină, apoi umbră",
    bodySha256: "ced63a0100b639d974fcbb988693f971ad31feaa4f94c91cfcd1ef42583aaecd",
  },
  {
    liveId: "s25-2-3-z3-mental",
    seedId: "s25-2-3-z3-mental",
    band: "1-2",
    week: 25,
    titlu: "Pat și somn",
    otherTitle: "Umbra mâinii pe perete",
    bodySha256: "0d99a3316d40646050d57a2ae2266d66a172633fefe56cb55e51240bb5df55b6",
  },
  {
    liveId: "s25-2-3-z3-social",
    seedId: "s25-2-3-z3-social",
    band: "1-2",
    week: 25,
    titlu: "Pe pat, împreună",
    otherTitle: "Umbra ta pe al meu — joc blând",
    bodySha256: "a085218c17e93960360e0b7b0c71411b782e6374846d49ea4fbbf4f116e1ccb7",
  },
  {
    liveId: "s25-2-3-z4-mental",
    seedId: "s25-2-3-z4-mental",
    band: "1-2",
    week: 25,
    titlu: "O poză din carte",
    otherTitle: "Obiect în lumină, obiect în umbră",
    bodySha256: "de0f947932512d004f106800c452830b950b1f36edbf4b5c3d498eb05f5705cd",
  },
  {
    liveId: "s25-2-3-z5-fizic",
    seedId: "s25-2-3-z5-fizic",
    band: "1-2",
    week: 25,
    titlu: "Ne spălăm pe mâini",
    otherTitle: "Sărituri mici în lumină, pași lenți în umbră",
    bodySha256: "0e266387fdd1ca53a86e5dbff0ca88325695382bb7a7dd12b4f23506d82a4a10",
  },
  {
    liveId: "s26-2-3-z6-resurse",
    seedId: "s26-2-3-z6-resurse",
    band: "1-2",
    week: 26,
    titlu: "Mirosim și punem la loc",
    otherTitle: "Alege 1 din 3 — apoi gata",
    bodySha256: "c80f04ab3d2ae5117ea3e9bacb0218064918ea2a7cc450970baed8d810e52235",
  },
  {
    liveId: "s27-2-3-z6-fizic",
    seedId: "s27-2-3-z6-fizic",
    band: "1-2",
    week: 27,
    titlu: "Numărăm ce vedem afară",
    otherTitle: "Privit liber scurt la geam",
    bodySha256: "4db3a61d870e8508ae2adc96e78ec59e3973d0efdefeceba28a44f6af031ecb8",
  },
  {
    liveId: "s29-2-3-z2-fizic",
    seedId: "s29-2-3-z2-fizic",
    band: "1-2",
    week: 29,
    titlu: "Atingem mugurele",
    otherTitle: "Deget pe mugure",
    bodySha256: "03e53fbe2fb68611bd1ccbca9f6d79cd88dd1417a9baf5b8f2ad928d3eaf8ab7",
  },
  {
    liveId: "s29-2-3-z2-mental",
    seedId: "s29-2-3-z2-mental",
    band: "1-2",
    week: 29,
    titlu: "Spunem: mugure, frunză",
    otherTitle: "Mugure și frunză — care e care?",
    bodySha256: "79396fc883007c61592258e4ad8a9805f2a7d51cc71c771dff765f034e9e2e25",
  },
  {
    liveId: "s29-2-3-z2-social",
    seedId: "s29-2-3-z2-social",
    band: "1-2",
    week: 29,
    titlu: "Arată mugurele adultului",
    otherTitle: "Arată mugurele adultului",
    bodySha256: "ddd7cf48491f6837c2b5a9b490e3d121f8a9eaa5745f04efc89ac60ddbb8fc27",
  },
  {
    liveId: "s29-2-3-z6-fizic",
    seedId: "s29-2-3-z6-fizic",
    band: "1-2",
    week: 29,
    titlu: "Frunză de pe pământ",
    otherTitle: "Plimbare scurtă: iarbă → plantă pe pervaz",
    bodySha256: "74b85a564f7e5ba390382ecf2805d25ac12a5a802165562abcebcffdb2ab490f",
  },
  {
    liveId: "s29-2-3-z6-social",
    seedId: "s29-2-3-z6-social",
    band: "1-2",
    week: 29,
    titlu: "Frunza pentru adult",
    otherTitle: "Împreună: verde pe iarbă și pe plantă",
    bodySha256: "83a296a7044dc5b0b57d09928792d0f56d17e9eb859652b88978556c971b0eb4",
  },
  {
    liveId: "s33-2-3-z5-resurse",
    seedId: "s33-2-3-z5-resurse",
    band: "1-2",
    week: 33,
    titlu: "Găleata și lopata pe raft",
    otherTitle: "Limită: nisip doar în zonă",
    bodySha256: "6e26c45a1a454a0420d8b1420bd6281b5c88df5372027c4642e107a10e20728e",
  },
  {
    liveId: "s33-2-3-z6-mental",
    seedId: "s33-2-3-z6-mental",
    band: "1-2",
    week: 33,
    titlu: "Urma rotundă a găleții",
    otherTitle: "Scopul zilei — una singură",
    bodySha256: "d69c20d31687f84372cacfa5885398203dabe69093fb98b277d13223b35d81eb",
  },
  {
    liveId: "s34-2-3-z1-fizic",
    seedId: "s34-2-3-z1-fizic",
    band: "1-2",
    week: 34,
    titlu: "Afară, la soare",
    otherTitle: "Strângem frunză de pe pământ pe scurt",
    bodySha256: "2354d2717a15fe70ee4d74ce7bd10927f534c1351aef3e76a9769f272846f09d",
  },
  {
    liveId: "s34-2-3-z1-resurse",
    seedId: "s34-2-3-z1-resurse",
    band: "1-2",
    week: 34,
    titlu: "Pantofii lângă ușă",
    otherTitle: "Colectăm 3 — în cutie — gata",
    bodySha256: "79c9fec7dfac7352957e57ce47b1af99a0c5d80269b40af189f2ec4c23ea3f69",
  },
  {
    liveId: "s34-2-3-z3-resurse",
    seedId: "s34-2-3-z3-resurse",
    band: "1-2",
    week: 34,
    titlu: "Intrăm, închidem ușa",
    otherTitle: "Alege: încă un frunză sau gata cutia",
    bodySha256: "b9324e6add71446cd577a4223d8524576c8c4d7239b0c8bdfb41c65a9f1d5900",
  },
  {
    liveId: "s34-2-3-z4-resurse",
    seedId: "s34-2-3-z4-resurse",
    band: "1-2",
    week: 34,
    titlu: "Frunză în coș",
    otherTitle: "După colectat — totul în cutie la loc",
    bodySha256: "19e3452b45764e24431e15540baaedf66686fe39e3090649f44d7ea7be0017e5",
  },
  {
    liveId: "s34-2-3-z5-resurse",
    seedId: "s34-2-3-z5-resurse",
    band: "1-2",
    week: 34,
    titlu: "Pălăria pe cuier",
    otherTitle: "Limită: 3 în cutie — nu mai mult",
    bodySha256: "cb580320ca180034283d5013e35e3b5cea8e532853acc46a3e04920e2fd676d0",
  },
  {
    liveId: "s36-2-3-z4-resurse",
    seedId: "s36-2-3-z4-resurse",
    band: "1-2",
    week: 36,
    titlu: "Intrăm, ușa se închide",
    otherTitle: "După uite — ne întoarcem în casă",
    bodySha256: "b81c10866d8ad40e12ba13d3a37eaa20c4111c6d666b374258a8ad6947210ae6",
  },
  {
    liveId: "s37-2-3-z1-resurse",
    seedId: "s37-2-3-z1-resurse",
    band: "1-2",
    week: 37,
    titlu: "Paharul cu apă, la umbră",
    otherTitle: "Stinge / aprinde — gata (adult)",
    bodySha256: "2a748e491d873749e3370ae7aed4ebb04128516bd743be259d696f28aca958d4",
  },
  {
    liveId: "s37-2-3-z3-social",
    seedId: "s37-2-3-z3-social",
    band: "1-2",
    week: 37,
    titlu: "Bem pe rând",
    otherTitle: "Umbrele se întâlnesc pe perete",
    bodySha256: "4ff487e6d55984a7bcbc7f407f29ba3f58ea37b10e31ee44508dedc119486989",
  },
  {
    liveId: "s37-2-3-z4-fizic",
    seedId: "s37-2-3-z4-fizic",
    band: "1-2",
    week: 37,
    titlu: "Câțiva pași spre umbră",
    otherTitle: "Traseu: lumină → umbră → lumină",
    bodySha256: "441c308b07c317f7cf9524e23af52c98774cef1b25a1854474c3b07452bd4ff3",
  },
  {
    liveId: "s37-2-3-z4-mental",
    seedId: "s37-2-3-z4-mental",
    band: "1-2",
    week: 37,
    titlu: "Soare cald, umbră răcoroasă",
    otherTitle: "Obiect în lumină, obiect în umbră",
    bodySha256: "bb80aaea07d630703a8ffe01a0b5615f709691db0fb5c7bb3a2583ff604ec9d9",
  },
  {
    liveId: "s37-2-3-z4-social",
    seedId: "s37-2-3-z4-social",
    band: "1-2",
    week: 37,
    titlu: "Împreună spre umbră",
    otherTitle: "Arată umbră unei persoane dragi",
    bodySha256: "6ab666f4012daa1d031ba50816931827b768300aaf9c5eb038ecb3da7c516b79",
  },
  {
    liveId: "s38-2-3-z3-resurse",
    seedId: "s38-2-3-z3-resurse",
    band: "1-2",
    week: 38,
    titlu: "Prosopul lângă pantofi",
    otherTitle: "Alege: udăm azi sau mâine",
    bodySha256: "1cc283618d5799e85b261f644941e42aac9ad287a265ea0fc219d597ef08412d",
  },
  {
    liveId: "s39-2-3-z2-resurse",
    seedId: "s39-2-3-z2-resurse",
    band: "1-2",
    week: 39,
    titlu: "Bolul pe masă",
    otherTitle: "Încă un fruct? — ajunge",
    bodySha256: "d11c07496c05fdb5c1f93d276f672c3402d246ae2dc69ab2e376573643621303",
  },
  {
    liveId: "s39-2-3-z4-resurse",
    seedId: "s39-2-3-z4-resurse",
    band: "1-2",
    week: 39,
    titlu: "Șervețelul lângă bol",
    otherTitle: "Alege: încă fruct sau ajunge",
    bodySha256: "b4088f6bac877119df5586d0a3b3099dd054915e8ac0b5f6deda9bdb2efece1c",
  },
  {
    liveId: "s39-2-3-z7-resurse",
    seedId: "s39-2-3-z7-resurse",
    band: "1-2",
    week: 39,
    titlu: "Bolul și farfuria la loc",
    otherTitle: "Masa cu fruct strânsă înainte de calm",
    bodySha256: "710b5166b7a14355ce970a033cfaa8a622a6e669ce3700778e21c778f059f951",
  },
  {
    liveId: "s43-2-3-z5-mental",
    seedId: "s43-2-3-z5-mental",
    band: "1-2",
    week: 43,
    titlu: "Piatră și frunză",
    otherTitle: "Sortăm culoare și mărime — lângă coș",
    bodySha256: "f94c375dde03c045e47bbc46928e56f3dc552e656bf5dc1f1289b9c5b1858f3f",
  },
  {
    liveId: "s45-2-3-z2-fizic",
    seedId: "s45-2-3-z2-fizic",
    band: "1-2",
    week: 45,
    titlu: "Sărituri mici împreună",
    otherTitle: "Mergem și oprim — corp puternic",
    bodySha256: "e2b0befa55fb610631f83922f2139135b1c647df920044e4065e51fe49e752a4",
  },
  {
    liveId: "s45-2-3-z4-mental",
    seedId: "s45-2-3-z4-mental",
    band: "1-2",
    week: 45,
    titlu: "Brațe și picioare",
    otherTitle: "Unde ne oprim? — Oprim la reper",
    bodySha256: "798afcd8023bb266b2a5cd43f7354a77b49cc9900ad1428fd7f3f1ea5e59f8b2",
  },
  {
    liveId: "s48-2-3-z2-mental",
    seedId: "s48-2-3-z2-mental",
    band: "1-2",
    week: 48,
    titlu: "Cine e? Salut!",
    otherTitle: "Bună la venire, la revedere la plecare",
    bodySha256: "8a090c551baf323be36c1b541932999e7c77ff04050e738a4c2fa76771180704",
  },
  {
    liveId: "s8-b23-z5-social",
    seedId: "s8-2-3-z5-social",
    band: "2-3",
    week: 8,
    titlu: "Privim împreună frunza",
    otherTitle: "Pe care frunză?",
    // T5 a scos paranteza goală din pas. Titlul P5 rămâne.
    bodySha256: "fdb072ec8f966d4ca754fd43eabc65ee043ad525bb8b807795520ea50497f572",
  },
  {
    liveId: "s10-b23-z6-fizic",
    seedId: "s10-2-3-z6-fizic",
    band: "2-3",
    week: 10,
    titlu: "Colectăm în cutie",
    otherTitle: "Trei pietre afară",
    bodySha256: "da0bf2fac3248768d26eff4503984f5e9a98483d754951bd72694ff94f344caf",
  },
  {
    liveId: "s31-b23-z4-social",
    seedId: "s31-2-3-z4-social",
    band: "2-3",
    week: 31,
    titlu: "Arată ghiveciul altcuiva",
    otherTitle: "Atingem pământul pe rând",
    bodySha256: "66f484633d3cb118777ba6d1072525946bf4d186403f36d8221041e49a4f3ea5",
  },
  {
    liveId: "s40-b23-z3-fizic",
    seedId: "s40-2-3-z3-fizic",
    band: "2-3",
    week: 40,
    titlu: "Ducem lucrurile la locul lor",
    otherTitle: "Ștergem masa",
    bodySha256: "97e85ad36e584f3370df76938736487fadaa31fe610a6d8958677485e1472e78",
  },
];

function bodySha256(row: {
  materiale: string[];
  pasi: string[];
  gata_cand: string;
  nota?: string | null;
  tema_saptamana: string;
}): string {
  const blob = JSON.stringify({
    materiale: row.materiale,
    pasi: row.pasi,
    gata_cand: row.gata_cand,
    nota: row.nota ?? null,
    tema_saptamana: row.tema_saptamana,
  });
  return createHash("sha256").update(blob).digest("hex");
}

describe("P5 titluri aprobate (T4)", () => {
  test("52 în banda 1–2 și 4 în banda 2–3, corpul neschimbat", () => {
    const band12 = P5_TITLES.filter((row) => row.band === "1-2");
    const band23 = P5_TITLES.filter((row) => row.band === "2-3");
    expect(band12).toHaveLength(52);
    expect(band23).toHaveLength(4);
    expect(band12.every((row) => /-2-3-/.test(row.liveId))).toBe(true);
    expect(band12.every((row) => row.liveId === row.seedId)).toBe(true);
    expect(band23.every((row) => /-b23-/.test(row.liveId))).toBe(true);
    expect(band23.every((row) => row.seedId === row.liveId.replace("-b23-", "-2-3-"))).toBe(
      true,
    );

    for (const row of P5_TITLES) {
      const own = getSeedActivities(row.week, row.band).find(
        (activity) => activity.id === row.seedId,
      );
      expect(own, row.liveId).toBeTruthy();
      expect(own?.banda, row.liveId).toBe(row.band);
      expect(own?.titlu, row.liveId).toBe(row.titlu);
      expect(bodySha256(own!), row.liveId).toBe(row.bodySha256);

      const otherBand = row.band === "1-2" ? "2-3" : "1-2";
      const other = getSeedActivities(row.week, otherBand).find(
        (activity) => activity.id === row.seedId,
      );
      expect(other?.banda, row.liveId).toBe(otherBand);
      expect(other?.titlu, row.liveId).toBe(row.otherTitle);
    }
  });

  test("migrarea actualizează doar titlu, cu banda așteptată, și se oprește dacă lipsește un id", () => {
    const sql = readFileSync(
      resolve("supabase/migrations/20261109230000_p5_titluri_56.sql"),
      "utf8",
    );
    expect(sql).toMatch(/set titlu = v\.titlu/);
    expect(sql).toMatch(/and a\.banda = v\.banda/);
    expect(sql).toMatch(/raise exception 'P5: id lipsă din banda așteptată/);
    expect(sql).not.toMatch(/materiale = v\.materiale/);
    expect(sql).not.toMatch(/pasi = v\.pasi/);
    expect(sql).not.toMatch(/gata_cand = v\.gata_cand/);
    expect(sql).not.toMatch(/tema_saptamana = v\.tema/);

    const tuples = [
      ...sql.matchAll(/\('([^']+)', '([^']+)', '((?:[^']|'')*)'\)/g),
    ];
    expect(tuples).toHaveLength(56);
    const byId = new Map(
      tuples.map((match) => [
        match[1],
        { band: match[2], titlu: match[3].replaceAll("''", "'") },
      ]),
    );
    expect(byId.size).toBe(56);
    for (const row of P5_TITLES) {
      expect(byId.get(row.liveId), row.liveId).toEqual({
        band: row.band,
        titlu: row.titlu,
      });
    }
    const bands = tuples.map((match) => match[2]);
    expect(bands.filter((band) => band === "1-2")).toHaveLength(52);
    expect(bands.filter((band) => band === "2-3")).toHaveLength(4);
  });
});
