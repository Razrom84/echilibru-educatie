/**
 * PLAYFUL PILOT — GO lock: S1–S52 L–D (full year, banda 1–2).
 * Characters, ritual lines, and daily surprises live here (not in activities.nota).
 * Zero sounds / wavs / Play button — clips were removed in #33.
 */

export const PLAYFUL_PILOT_WEEKS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
  41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52,
] as const;
export type PlayfulPilotWeek = (typeof PLAYFUL_PILOT_WEEKS)[number];

export type PlayfulCharacterId =
  | "casuta"
  | "galetusa"
  | "suntel"
  | "manuta"
  | "carioca"
  | "sageata"
  | "presulet"
  | "frunzulita"
  | "suflare"
  | "cutiuta"
  | "luminita"
  | "canuta"
  | "hainuta"
  | "potecuta"
  | "lingurita"
  | "picatura"
  | "pasarica"
  | "mingiuta"
  | "carticica"
  | "cosulet"
  | "ferestruica"
  | "ghemotoc"
  | "nasuc"
  | "usita"
  | "lampadar"
  | "amintire"
  | "fulgusor"
  | "murdarel"
  | "muguras"
  | "cioculet"
  | "samantica"
  | "balonas"
  | "lopetica"
  | "umbrita"
  | "stropulet"
  | "gandacel"
  | "racorica"
  | "talpita"
  | "merisor"
  | "maturica"
  | "portita"
  | "vantulet"
  | "saculet"
  | "inimioara"
  | "plimbarel"
  | "degetel"
  | "grijuliul"
  | "norocel"
  | "scumpicel"
  | "cumintel"
  | "gospodarel"
  | "blandut";

export type PlayfulCharacter = {
  id: PlayfulCharacterId;
  name: string;
  src: string;
};

export type PlayfulOverlay = {
  week: PlayfulPilotWeek;
  dayOfWeek: number;
  theme: string;
  character: PlayfulCharacter;
  ritualOpen: string;
  ritualClose: string;
  surprise: string;
};

export const PLAYFUL_CHARACTERS: Record<PlayfulCharacterId, PlayfulCharacter> = {
  casuta: {
    id: "casuta",
    name: "Căsuță",
    src: "/characters/casuta.svg",
  },
  galetusa: {
    id: "galetusa",
    name: "Găletușă",
    src: "/characters/galetusa.svg",
  },
  suntel: {
    id: "suntel",
    name: "Sunețel",
    src: "/characters/suntel.svg",
  },
  manuta: {
    id: "manuta",
    name: "Mânuță",
    src: "/characters/manuta.svg",
  },
  carioca: {
    id: "carioca",
    name: "Cariocă",
    src: "/characters/carioca.svg",
  },
  sageata: {
    id: "sageata",
    name: "Săgeată",
    src: "/characters/sageata.svg",
  },
  presulet: {
    id: "presulet",
    name: "Preșuleț",
    src: "/characters/presulet.svg",
  },
  frunzulita: {
    id: "frunzulita",
    name: "Frunzuliță",
    src: "/characters/frunzulita.svg",
  },
  suflare: {
    id: "suflare",
    name: "Suflare",
    src: "/characters/suflare.svg",
  },
  cutiuta: {
    id: "cutiuta",
    name: "Cutiuță",
    src: "/characters/cutiuta.svg",
  },
  luminita: {
    id: "luminita",
    name: "Luminiță",
    src: "/characters/luminita.svg",
  },
  canuta: {
    id: "canuta",
    name: "Cănuță",
    src: "/characters/canuta.svg",
  },
  hainuta: {
    id: "hainuta",
    name: "Hăinuță",
    src: "/characters/hainuta.svg",
  },
  potecuta: {
    id: "potecuta",
    name: "Potecuță",
    src: "/characters/potecuta.svg",
  },
  lingurita: {
    id: "lingurita",
    name: "Linguriță",
    src: "/characters/lingurita.svg",
  },
  picatura: {
    id: "picatura",
    name: "Picătură",
    src: "/characters/picatura.svg",
  },
  pasarica: {
    id: "pasarica",
    name: "Păsărică",
    src: "/characters/pasarica.svg",
  },
  mingiuta: {
    id: "mingiuta",
    name: "Mingiuță",
    src: "/characters/mingiuta.svg",
  },
  carticica: {
    id: "carticica",
    name: "Cărticică",
    src: "/characters/carticica.svg",
  },
  cosulet: {
    id: "cosulet",
    name: "Coșuleț",
    src: "/characters/cosulet.svg",
  },
  ferestruica: {
    id: "ferestruica",
    name: "Ferestruică",
    src: "/characters/ferestruica.svg",
  },
  ghemotoc: {
    id: "ghemotoc",
    name: "Ghemotoc",
    src: "/characters/ghemotoc.svg",
  },
  nasuc: {
    id: "nasuc",
    name: "Năsuc",
    src: "/characters/nasuc.svg",
  },
  usita: {
    id: "usita",
    name: "Ușiță",
    src: "/characters/usita.svg",
  },
  lampadar: {
    id: "lampadar",
    name: "Lampadar",
    src: "/characters/lampadar.svg",
  },
  amintire: {
    id: "amintire",
    name: "Amintire",
    src: "/characters/amintire.svg",
  },
  fulgusor: {
    id: "fulgusor",
    name: "Fulgușor",
    src: "/characters/fulgusor.svg",
  },
  murdarel: {
    id: "murdarel",
    name: "Murdărel",
    src: "/characters/murdarel.svg",
  },
  muguras: {
    id: "muguras",
    name: "Muguraș",
    src: "/characters/muguras.svg",
  },
  cioculet: {
    id: "cioculet",
    name: "Cioculeț",
    src: "/characters/cioculet.svg",
  },
  samantica: {
    id: "samantica",
    name: "Sămânțică",
    src: "/characters/samantica.svg",
  },
  balonas: {
    id: "balonas",
    name: "Balonaș",
    src: "/characters/balonas.svg",
  },
  lopetica: {
    id: "lopetica",
    name: "Lopățică",
    src: "/characters/lopetica.svg",
  },
  umbrita: {
    id: "umbrita",
    name: "Umbriță",
    src: "/characters/umbrita.svg",
  },
  stropulet: {
    id: "stropulet",
    name: "Stropuleț",
    src: "/characters/stropulet.svg",
  },
  gandacel: {
    id: "gandacel",
    name: "Gândăcel",
    src: "/characters/gandacel.svg",
  },
  racorica: {
    id: "racorica",
    name: "Răcorică",
    src: "/characters/racorica.svg",
  },
  talpita: {
    id: "talpita",
    name: "Tălpiță",
    src: "/characters/talpita.svg",
  },
  merisor: {
    id: "merisor",
    name: "Merișor",
    src: "/characters/merisor.svg",
  },
  maturica: {
    id: "maturica",
    name: "Măturică",
    src: "/characters/maturica.svg",
  },
  portita: {
    id: "portita",
    name: "Portiță",
    src: "/characters/portita.svg",
  },
  vantulet: {
    id: "vantulet",
    name: "Vântuleț",
    src: "/characters/vantulet.svg",
  },
  saculet: {
    id: "saculet",
    name: "Săculeț",
    src: "/characters/saculet.svg",
  },
  inimioara: {
    id: "inimioara",
    name: "Inimioară",
    src: "/characters/inimioara.svg",
  },
  plimbarel: {
    id: "plimbarel",
    name: "Plimbărel",
    src: "/characters/plimbarel.svg",
  },
  degetel: {
    id: "degetel",
    name: "Degețel",
    src: "/characters/degetel.svg",
  },
  grijuliul: {
    id: "grijuliul",
    name: "Grijuliul",
    src: "/characters/grijuliul.svg",
  },
  norocel: {
    id: "norocel",
    name: "Norocel",
    src: "/characters/norocel.svg",
  },
  scumpicel: {
    id: "scumpicel",
    name: "Scumpicel",
    src: "/characters/scumpicel.svg",
  },
  cumintel: {
    id: "cumintel",
    name: "Cumințel",
    src: "/characters/cumintel.svg",
  },
  gospodarel: {
    id: "gospodarel",
    name: "Gospodărel",
    src: "/characters/gospodarel.svg",
  },
  blandut: {
    id: "blandut",
    name: "Blânduț",
    src: "/characters/blandut.svg",
  },
};

export const SURPRIZA_PREFIX = "Surpriză:";

type WeekConfig = {
  week: PlayfulPilotWeek;
  theme: string;
  character: PlayfulCharacter;
  ritualOpen: string;
  ritualClose: string;
  surprises: Record<number, string>;
};

const WEEK_1: WeekConfig = {
  week: 1,
  theme: "Casa și curtea",
  character: PLAYFUL_CHARACTERS.casuta,
  ritualOpen: "Casa și curtea.",
  ritualClose: "Pe curte, gata.",
  surprises: {
    1: "Ușa curții se deschide 2 cm",
    2: "El alege: piatră sau frunză",
    3: "Mingea „dispare” 2 sec în iarbă",
    4: "Un lucru ușor în mână 3 sec",
    5: "O treaptă sus, una jos",
    6: "O piatră secretă (doar el o arată)",
    7: "Ultima pagină: casa din imagine",
  },
};

const WEEK_2: WeekConfig = {
  week: 2,
  theme: "Apa în casă și afară",
  character: PLAYFUL_CHARACTERS.galetusa,
  ritualOpen: "Apa în casă.",
  ritualClose: "Afară, gata.",
  surprises: {
    1: "Robinetul 2 sec, apoi oprit",
    2: "Turnăm 2 picături",
    3: "Un strop pe mână",
    4: "Paharul gol stă 2 sec, apoi jos",
    5: "Stropi pe geam 2 sec",
    6: "O băltoacă (doar el o arată)",
    7: "Verificăm: prosopul la loc",
  },
};

const WEEK_3: WeekConfig = {
  week: 3,
  theme: "Sunete și liniște",
  character: PLAYFUL_CHARACTERS.suntel,
  ritualOpen: "Ascultăm. Gata?",
  ritualClose: "Sunete gata. Bravo.",
  surprises: {
    1: "pași, apoi liniște",
    2: "o bătaie din palme",
    3: "voce încet 2s",
    4: "ușa închisă încet",
    5: "șoaptă 2s",
    6: "o bătaie + liniște",
    7: "lumină stinsă 3s",
  },
};

const WEEK_4: WeekConfig = {
  week: 4,
  theme: "Mâini și degete",
  character: PLAYFUL_CHARACTERS.manuta,
  ritualOpen: "Mâinile. Gata?",
  ritualClose: "Mâini gata. Bravo.",
  surprises: {
    1: "unde-i degetul",
    2: "high-five",
    3: "degete pe masă",
    4: "strângere×2",
    5: "moale-aspru",
    6: "săpătură+1",
    7: "pagină+1",
  },
};

const WEEK_5: WeekConfig = {
  week: 5,
  theme: "Culori pe care le vedem",
  character: PLAYFUL_CHARACTERS.carioca,
  ritualOpen: "Vedem culorile.",
  ritualClose: "Culori văzute.",
  surprises: {
    1: "Ascundem un obiect roșu 2 sec: „Unde e?”",
    2: "Două galbene — el alege pe care îl ține",
    3: "Albastru „dispare” sub o cârpă, apoi reapare",
    4: "Atingem verdele cu nasul (dacă vrea)",
    5: "El alege culoarea din două",
    6: "O culoare „secretă” afară (doar el o arată)",
    7: "Ultima pagină: o culoare din imagine",
  },
};

const WEEK_6: WeekConfig = {
  week: 6,
  theme: "Sus și jos",
  character: PLAYFUL_CHARACTERS.sageata,
  ritualOpen: "Sus și jos.",
  ritualClose: "Sus-jos gata.",
  surprises: {
    1: "Brațele sus 1 sec în plus, pe vârfuri",
    2: "„Tu ești sus” pe scaun — o clipă",
    3: "Mingea „cade” încet: sus → jos",
    4: "Ghemuit-jos, apoi sus ca o surpriză",
    5: "O săritură mică împreună",
    6: "Bordură: un pas sus, unul jos",
    7: "Haina pe cârlig — el „trage” sus",
  },
};

const WEEK_7: WeekConfig = {
  week: 7,
  theme: "Înăuntru și afară",
  character: PLAYFUL_CHARACTERS.presulet,
  ritualOpen: "Înăuntru și afară.",
  ritualClose: "Pe prag, gata.",
  surprises: {
    1: "Ușa se deschide 2 cm — „afar?”",
    2: "O gură de aer afară, apoi înăuntru",
    3: "„La revedere, curte” pe prag",
    4: "Jucăria stă pe prag 3 sec",
    5: "Dans scurt → ne oprim la ușă",
    6: "Piatră vizită scurtă în casă, apoi afară",
    7: "Verificăm pragul: nimic rămas",
  },
};

const WEEK_8: WeekConfig = {
  week: 8,
  theme: "Frunze și pământ",
  character: PLAYFUL_CHARACTERS.frunzulita,
  ritualOpen: "Frunze și pământ.",
  ritualClose: "Pe pământ, gata.",
  surprises: {
    1: "Atingem frunza cu obrazul 2 sec",
    2: "El alege frunza: mare sau mică",
    3: "Pământ uscat pe palmă, 2 sec",
    4: "Noroiul „dispare” pe prosop",
    5: "O frunză zboară 1 sec, apoi cade",
    6: "O frunză „secretă” pe potecă (doar el o arată)",
    7: "Ultima pagină: o frunză din imagine",
  },
};

const WEEK_9: WeekConfig = {
  week: 9,
  theme: "Vânt și aer",
  character: PLAYFUL_CHARACTERS.suflare,
  ritualOpen: "Vânt și aer.",
  ritualClose: "În aer, gata.",
  surprises: {
    1: "Aerul pe obraz 2 sec",
    2: "Suflăm o dată, apoi liniște",
    3: "Brațele aripă — o clipă",
    4: "Eșarfa zboară 2 sec",
    5: "El suflă, frunza se mișcă",
    6: "Vântul pe obraz (doar el îl simte)",
    7: "Ultima pagină: un nor din imagine",
  },
};

const WEEK_10: WeekConfig = {
  week: 10,
  theme: "Colectăm și sortăm",
  character: PLAYFUL_CHARACTERS.cutiuta,
  ritualOpen: "Adunăm și sortăm.",
  ritualClose: "La loc, gata.",
  surprises: {
    1: "Un obiect „dispare” în cutie 2 sec",
    2: "El alege: mare sau mic în cutie",
    3: "Perechea de șosete se întâlnește",
    4: "Un cub stă afară 3 sec, apoi în cutie",
    5: "El alege grămada",
    6: "O piatră „vizită” scurtă în cutie, apoi afară",
    7: "Verificăm cutia: totul la loc",
  },
};

const WEEK_11: WeekConfig = {
  week: 11,
  theme: "Lumină și umbră",
  character: PLAYFUL_CHARACTERS.luminita,
  ritualOpen: "Lumină și umbră.",
  ritualClose: "În umbră, gata.",
  surprises: {
    1: "Perdeaua se deschide 2 cm — „lumină?”",
    2: "Umbra mâinii 2 sec pe perete",
    3: "Lampa se stinge 2 sec, apoi se aprinde",
    4: "Un petec de soare „dispare”",
    5: "El alege: lumină sau umbră",
    6: "Umbra lui pe pământ (doar el o arată)",
    7: "Ultima pagină: zi sau noapte",
  },
};

const WEEK_12: WeekConfig = {
  week: 12,
  theme: "Cald și rece (repetare)",
  character: PLAYFUL_CHARACTERS.canuta,
  ritualOpen: "Cald și rece.",
  ritualClose: "Cald-rece, gata.",
  surprises: {
    1: "Cana caldă pe palmă 2 sec",
    2: "Sticla rece pe obraz 1 sec",
    3: "Mâini calde — apoi reci",
    4: "Haina pe umeri 3 sec",
    5: "Suflăm pe mâini o dată",
    6: "Aer rece pe obraz (doar el îl simte)",
    7: "Verificăm cârligul: haina la loc",
  },
};

const WEEK_13: WeekConfig = {
  week: 13,
  theme: "Haine pe vreme",
  character: PLAYFUL_CHARACTERS.hainuta,
  ritualOpen: "Haine pe vreme.",
  ritualClose: "Pe cârlig, gata.",
  surprises: {
    1: "Haina pe umeri 2 sec, apoi jos",
    2: "O șosetă „dispare” pe picior",
    3: "Papucul stă 3 sec, apoi piciorul",
    4: "Căciula coboară 2 cm — „pe cap?”",
    5: "El alege: cu mănușă sau fără",
    6: "Haina pe cârlig — el „trage”",
    7: "Verificăm cârligul: totul la loc",
  },
};

const WEEK_14: WeekConfig = {
  week: 14,
  theme: "Pași pe drumul scurt",
  character: PLAYFUL_CHARACTERS.potecuta,
  ritualOpen: "Pași pe drum.",
  ritualClose: "Pe drum, gata.",
  surprises: {
    1: "Trei pași pe hol, apoi stăm",
    2: "Ușa se deschide 2 cm — „ieșim?”",
    3: "O treaptă sus, o treaptă jos",
    4: "Pietricica „dispare” 2 sec pe drum",
    5: "El alege: repede sau încet",
    6: "Un pas pe drum (doar el îl arată)",
    7: "Ultima pagină: un drum din imagine",
  },
};

const WEEK_15: WeekConfig = {
  week: 15,
  theme: "Mâncare împreună",
  character: PLAYFUL_CHARACTERS.lingurita,
  ritualOpen: "Mâncare împreună.",
  ritualClose: "La masă, gata.",
  surprises: {
    1: "Scaunul se apropie 2 cm de masă",
    2: "Gustarea „dispare” 1 sec în palmă",
    3: "Lingura stă 2 sec la gură, apoi jos",
    4: "Paharul se așază lângă farfurie",
    5: "El alege: înainte de masă sau după",
    6: "O bucățică pe farfurie (doar el o arată)",
    7: "Verificăm chiuveta: farfuria la loc",
  },
};

const WEEK_16: WeekConfig = {
  week: 16,
  theme: "Apă și sete",
  character: PLAYFUL_CHARACTERS.picatura,
  ritualOpen: "Apă și sete.",
  ritualClose: "Apa, gata.",
  surprises: {
    1: "O înghițitură, apoi paharul jos",
    2: "Turnăm 2 picături — „apa?”",
    3: "Paharul merge 3 pași, apoi stă",
    4: "Robinetul se deschide 2 sec",
    5: "El alege: sete sau nu",
    6: "O picătură pe plantă (doar el o pune)",
    7: "Verificăm raftul: paharul la loc",
  },
};

const WEEK_17: WeekConfig = {
  week: 17,
  theme: "Animale pe care le auzim",
  character: PLAYFUL_CHARACTERS.pasarica,
  ritualOpen: "Auzim animale.",
  ritualClose: "Auzite, gata.",
  surprises: {
    1: "Urechea la geam 2 sec",
    2: "El face ham-ham o dată",
    3: "Aripi 1 sec, apoi jos",
    4: "La geam, stăm 2 sec",
    5: "El alege: sunet sau liniște",
    6: "O pasăre afară (doar el o arată)",
    7: "Ultima pagină: un animal din imagine",
  },
};

const WEEK_18: WeekConfig = {
  week: 18,
  theme: "Joacă de-a rândul",
  character: PLAYFUL_CHARACTERS.mingiuta,
  ritualOpen: "Joacă de-a rândul.",
  ritualClose: "Rândul, gata.",
  surprises: {
    1: "Mingea rulează 1 sec, apoi stă",
    2: "El dă mingea, adultul așteaptă",
    3: "Un cub al lui, un cub al tău",
    4: "Două bătăi din palme, pe rând",
    5: "El alege: acum eu sau acum tu",
    6: "Mingea afară 2 sec, apoi în mână",
    7: "Verificăm raftul: mingea la loc",
  },
};

const WEEK_19: WeekConfig = {
  week: 19,
  theme: "Cartea de seară",
  character: PLAYFUL_CHARACTERS.carticica,
  ritualOpen: "Cartea de seară.",
  ritualClose: "Cartea, gata.",
  surprises: {
    1: "Cartea se așază pe canapea 2 sec",
    2: "O pagină se întoarce, apoi stă",
    3: "El alege pagina",
    4: "Coperta se închide 2 sec",
    5: "Trei pagini, apoi gata",
    6: "Cartea „dispare” pe raft ziua",
    7: "Ultima pagină: imaginea favorită",
  },
};

const WEEK_20: WeekConfig = {
  week: 20,
  theme: "Ordine mică în cameră",
  character: PLAYFUL_CHARACTERS.cosulet,
  ritualOpen: "Ordine în cameră.",
  ritualClose: "Camera, gata.",
  surprises: {
    1: "Un lucru „dispare” 2 sec în coș",
    2: "El alege: raft sau coș",
    3: "Trei lucruri, apoi stăm",
    4: "Capacul coșului se închide 2 sec",
    5: "Pătura se așază 3 sec pe canapea",
    6: "Coșul merge până la ușă, apoi la loc",
    7: "Verificăm coșul: totul la loc",
  },
};

const WEEK_21: WeekConfig = {
  week: 21,
  theme: "Iarna pe pervaz",
  character: PLAYFUL_CHARACTERS.ferestruica,
  ritualOpen: "Iarna pe pervaz.",
  ritualClose: "Pe pervaz, gata.",
  surprises: {
    1: "Mâna pe geam 2 sec",
    2: "Un deget pe geamul rece",
    3: "De la geam la canapea",
    4: "Un suflu pe geam",
    5: "El atinge pervazul",
    6: "O privire afară (doar el o arată)",
    7: "Ultima pagină: iarna din imagine",
  },
};
const WEEK_22: WeekConfig = {
  week: 22,
  theme: "Corp care se mișcă în casă",
  character: PLAYFUL_CHARACTERS.ghemotoc,
  ritualOpen: "Corp în casă.",
  ritualClose: "Mișcat, gata.",
  surprises: {
    1: "Balans 2 sec pe loc",
    2: "Târâit doi pași",
    3: "O săritură mică",
    4: "Brațele sus 1 sec",
    5: "Trei pași pe loc",
    6: "Un dans, apoi așezat",
    7: "Ultima pagină: un copil care se mișcă",
  },
};
const WEEK_23: WeekConfig = {
  week: 23,
  theme: "Mirosuri din casă",
  character: PLAYFUL_CHARACTERS.nasuc,
  ritualOpen: "Mirosuri din casă.",
  ritualClose: "Mirosit, gata.",
  surprises: {
    1: "Nas aproape de pâine 2 sec",
    2: "Săpunul la nas 1 sec",
    3: "Ceaiul răcit, un miros",
    4: "Prosopul curat la nas",
    5: "El alege: pâine sau măr",
    6: "Un miros în bucătărie (doar el)",
    7: "Verificăm: cana la loc",
  },
};
const WEEK_24: WeekConfig = {
  week: 24,
  theme: "Familia și oaspeții",
  character: PLAYFUL_CHARACTERS.usita,
  ritualOpen: "Familia, oaspeții.",
  ritualClose: "La ușă, gata.",
  surprises: {
    1: "Mâna sus: salut",
    2: "Fluturăm: la revedere",
    3: "O jucărie pentru oaspete",
    4: "Ne așezăm 2 sec lângă",
    5: "Pași până la ușă",
    6: "El arată cine e în poză",
    7: "Un salut la final",
  },
};
const WEEK_25: WeekConfig = {
  week: 25,
  theme: "Lumină de seară",
  character: PLAYFUL_CHARACTERS.lampadar,
  ritualOpen: "Lumină de seară.",
  ritualClose: "Seara, gata.",
  surprises: {
    1: "Lampa se aprinde 2 sec",
    2: "Perdeaua se trage",
    3: "Pătura pe pat",
    4: "O pagină din cartea de seară",
    5: "Mâinile la chiuvetă",
    6: "Lumina se stinge 2 sec",
    7: "Verificăm: lampa pe noptieră",
  },
};
const WEEK_26: WeekConfig = {
  week: 26,
  theme: "Jumătate de an: repetăm favoritele",
  character: PLAYFUL_CHARACTERS.amintire,
  ritualOpen: "Favoritele, din nou.",
  ritualClose: "Favorite, gata.",
  surprises: {
    1: "Geamul favorit 2 sec",
    2: "Dansul de atunci, o dată",
    3: "El alege pagina",
    4: "Mingea favorită rulează 1 sec",
    5: "Trei favorite pe masă, alege una",
    6: "Mirosul favorit 2 sec",
    7: "Un favorit la final",
  },
};
const WEEK_27: WeekConfig = {
  week: 27,
  theme: "Zăpadă sau ploaie la geam",
  character: PLAYFUL_CHARACTERS.fulgusor,
  ritualOpen: "Zăpadă sau ploaie.",
  ritualClose: "La geam, gata.",
  surprises: {
    1: "Mâna pe geam: vremea",
    2: "Urmărim o picătură",
    3: "Urechea la geam 2 sec",
    4: "De la geam rece la cameră",
    5: "Un suflu, apoi vremea",
    6: "El arată: fulg sau picătură",
    7: "Ultima pagină: ploaie sau zăpadă",
  },
};
const WEEK_28: WeekConfig = {
  week: 28,
  theme: "Dezgheț și noroi",
  character: PLAYFUL_CHARACTERS.murdarel,
  ritualOpen: "Dezgheț și noroi.",
  ritualClose: "Noroiul, gata.",
  surprises: {
    1: "Cizmele pe picioare",
    2: "Un pas în noroi, dacă e",
    3: "Noroiul pe cizmă, uităm",
    4: "Mâna pe pământul ud",
    5: "El alege: cizmă sau șosetă",
    6: "O baltă (doar el o arată)",
    7: "Cizmele la loc",
  },
};
const WEEK_29: WeekConfig = {
  week: 29,
  theme: "Muguri și iarbă nouă",
  character: PLAYFUL_CHARACTERS.muguras,
  ritualOpen: "Muguri și iarbă.",
  ritualClose: "Mugurii, gata.",
  surprises: {
    1: "Un mugure pe creangă",
    2: "Mâna pe iarba nouă",
    3: "El atinge un mugure",
    4: "O frunză mică 2 sec",
    5: "Udăm o dată",
    6: "Un mugure secret (doar el)",
    7: "Ultima pagină: iarba din imagine",
  },
};
const WEEK_30: WeekConfig = {
  week: 30,
  theme: "Păsări dimineața",
  character: PLAYFUL_CHARACTERS.cioculet,
  ritualOpen: "Păsări dimineața.",
  ritualClose: "Păsări, gata.",
  surprises: {
    1: "Urechea la geam dimineața",
    2: "Arătăm spre cer",
    3: "El face un ciripit cu gura",
    4: "O pasăre (doar el o arată)",
    5: "Trei secunde: auzim",
    6: "Pași afară, urechi deschise",
    7: "Ultima pagină: o pasăre",
  },
};
const WEEK_31: WeekConfig = {
  week: 31,
  theme: "Semințe și udat",
  character: PLAYFUL_CHARACTERS.samantica,
  ritualOpen: "Semințe și udat.",
  ritualClose: "Udat, gata.",
  surprises: {
    1: "O sămânță în palmă",
    2: "Turnăm 2 picături",
    3: "El alege sămânța",
    4: "Pământul peste sămânță",
    5: "Udăm o dată",
    6: "Sămânța secretă (doar el)",
    7: "Verificăm: sticla cu apă la loc",
  },
};
const WEEK_32: WeekConfig = {
  week: 32,
  theme: "Balonul afară",
  character: PLAYFUL_CHARACTERS.balonas,
  ritualOpen: "Balonul afară.",
  ritualClose: "Balonul, gata.",
  surprises: {
    1: "Balonul se leagănă 1 sec pe sfoară",
    2: "El alege: sfoară lungă sau scurtă",
    3: "O bătaie ușoară pe balon",
    4: "Balonul „dispare” 2 sec după un arbore / mobilă",
    5: "Ținem sfoara pe rând",
    6: "Un pas cu balonul (sfoara în mână)",
    7: "Balonul pe cui / la loc",
  },
};
const WEEK_33: WeekConfig = {
  week: 33,
  theme: "Nisip și găleată",
  character: PLAYFUL_CHARACTERS.lopetica,
  ritualOpen: "Nisip și găleată.",
  ritualClose: "Nisipul, gata.",
  surprises: {
    1: "Mâna în nisip 2 sec",
    2: "Turnăm nisip în găleată",
    3: "O urmă de palmă",
    4: "El alege: nisip sau găleată",
    5: "Găleata se răstoarnă 1 sec",
    6: "O pietricică în nisip (doar el)",
    7: "Găleata la loc",
  },
};
const WEEK_34: WeekConfig = {
  week: 34,
  theme: "Umbre pe pământ",
  character: PLAYFUL_CHARACTERS.umbrita,
  ritualOpen: "Umbre pe pământ.",
  ritualClose: "Umbra, gata.",
  surprises: {
    1: "Mâna face umbră 2 sec",
    2: "Umbra se mișcă, apoi stă",
    3: "El calcă umbra",
    4: "Umbră de frunză",
    5: "El alege: soare sau umbră",
    6: "O umbră secretă (doar el)",
    7: "Ultima pagină: o umbră",
  },
};
const WEEK_35: WeekConfig = {
  week: 35,
  theme: "Apă afară (joc scurt)",
  character: PLAYFUL_CHARACTERS.stropulet,
  ritualOpen: "Apă afară.",
  ritualClose: "Pe apă, gata.",
  surprises: {
    1: "Un strop pe mână",
    2: "Picături pe piatră",
    3: "El atinge apa 1 sec",
    4: "Turnăm 2 picături afară",
    5: "El alege: ud sau uscat",
    6: "O băltoacă (doar el)",
    7: "Prosopul la loc",
  },
};
const WEEK_36: WeekConfig = {
  week: 36,
  theme: "Insecte de departe",
  character: PLAYFUL_CHARACTERS.gandacel,
  ritualOpen: "Insecte de departe.",
  ritualClose: "Departe, gata.",
  surprises: {
    1: "Privim de departe 2 sec",
    2: "Arătăm cu degetul, fără a atinge",
    3: "El alege: pe frunză sau pe pământ",
    4: "Un gândac (doar el îl arată)",
    5: "Trei pași înapoi, apoi uităm",
    6: "Urechea: zumzet, dacă e",
    7: "Ultima pagină: o insectă",
  },
};
const WEEK_37: WeekConfig = {
  week: 37,
  theme: "Umbră și loc răcoros",
  character: PLAYFUL_CHARACTERS.racorica,
  ritualOpen: "Umbră răcoroasă.",
  ritualClose: "Răcoare, gata.",
  surprises: {
    1: "Stăm 2 sec la umbră",
    2: "Din soare în umbră",
    3: "El alege locul răcoros",
    4: "Mâna pe pământul umbrit",
    5: "O gură de aer la umbră",
    6: "Locul secret (doar el)",
    7: "Înapoi în casă, lin",
  },
};
const WEEK_38: WeekConfig = {
  week: 38,
  theme: "Piciorul pe iarbă",
  character: PLAYFUL_CHARACTERS.talpita,
  ritualOpen: "Picior pe iarbă.",
  ritualClose: "Pe iarbă, gata.",
  surprises: {
    1: "Tălpița pe iarbă 2 sec",
    2: "Un pas desculț, dacă vrea",
    3: "Iarba gâdilă piciorul",
    4: "El alege: iarbă sau piatră",
    5: "Două tălpi, una după alta",
    6: "Urma lui (doar el o arată)",
    7: "Pantofii la loc",
  },
};
const WEEK_39: WeekConfig = {
  week: 39,
  theme: "Fructe pe care le vedem",
  character: PLAYFUL_CHARACTERS.merisor,
  ritualOpen: "Uite fructele.",
  ritualClose: "Fructe văzute.",
  surprises: {
    1: "Mărul pe masă 2 sec",
    2: "El alege: măr sau altă culoare",
    3: "Mirosim mărul",
    4: "Tăiem cu ochii: rotund",
    5: "Un fruct secret (doar el)",
    6: "Punem mărul în coș",
    7: "Ultima pagină: un fruct",
  },
};
const WEEK_40: WeekConfig = {
  week: 40,
  theme: "Ajutor la treabă scurtă",
  character: PLAYFUL_CHARACTERS.maturica,
  ritualOpen: "Ajutor la treabă.",
  ritualClose: "Treaba, gata.",
  surprises: {
    1: "Mătura face 2 mișcări",
    2: "El ține coada 2 sec",
    3: "Un lucru la loc",
    4: "El alege: mătură sau cârpă",
    5: "Ștergem masa o dată",
    6: "Treaba secretă (doar el o arată)",
    7: "Mătura la loc",
  },
};
const WEEK_41: WeekConfig = {
  week: 41,
  theme: "Drumul până la poartă",
  character: PLAYFUL_CHARACTERS.portita,
  ritualOpen: "Drumul la poartă.",
  ritualClose: "La poartă, gata.",
  surprises: {
    1: "Pași până la poartă",
    2: "Mâna pe poartă 2 sec",
    3: "Poarta se deschide 2 cm",
    4: "El alege: înăuntru sau afară",
    5: "Un pas dincolo de prag",
    6: "Poarta (doar el o arată)",
    7: "Înapoi, poarta închisă",
  },
};
const WEEK_42: WeekConfig = {
  week: 42,
  theme: "Vânt și frunze din nou",
  character: PLAYFUL_CHARACTERS.vantulet,
  ritualOpen: "Vânt din nou.",
  ritualClose: "Vântul, gata.",
  surprises: {
    1: "O gură de vânt",
    2: "Frunza zboară 1 sec",
    3: "El prinde o frunză, dacă vrea",
    4: "Părul se mișcă în vânt",
    5: "El alege: vânt sau liniște",
    6: "O frunză secretă (doar el)",
    7: "Frunza în coș",
  },
};
const WEEK_43: WeekConfig = {
  week: 43,
  theme: "Coșul și strânsul",
  character: PLAYFUL_CHARACTERS.saculet,
  ritualOpen: "Coșul și strânsul.",
  ritualClose: "Strâns, gata.",
  surprises: {
    1: "Un lucru în săculeț",
    2: "El alege: coș sau săculeț",
    3: "Trei lucruri, apoi gata",
    4: "Săculețul se închide 2 sec",
    5: "Piatra sau frunza în coș",
    6: "Săculețul secret (doar el)",
    7: "Verificăm: totul strâns",
  },
};
const WEEK_44: WeekConfig = {
  week: 44,
  theme: "Prieteni și familie",
  character: PLAYFUL_CHARACTERS.inimioara,
  ritualOpen: "Prieteni și familie.",
  ritualClose: "Împreună, gata.",
  surprises: {
    1: "Mâna pe umăr 1 sec, dacă vrea",
    2: "Arătăm pe cineva din poză",
    3: "El alege: mama sau tata",
    4: "O îmbrățișare scurtă, dacă vrea",
    5: "Stați doi, lângă",
    6: "Inima din palmă (doar el)",
    7: "Noapte bună împreună",
  },
};
const WEEK_45: WeekConfig = {
  week: 45,
  theme: "Corp puternic, pași mulți",
  character: PLAYFUL_CHARACTERS.plimbarel,
  ritualOpen: "Pași mulți.",
  ritualClose: "Pașii, gata.",
  surprises: {
    1: "Cinci pași, apoi stăm",
    2: "Pași mari, apoi mici",
    3: "El alege: repede sau încet",
    4: "O săritură mică după pași",
    5: "Pași pe hol dus-întors",
    6: "Urma lui (doar el)",
    7: "Pantofii la loc",
  },
};
const WEEK_46: WeekConfig = {
  week: 46,
  theme: "Întrebări cu arătatul",
  character: PLAYFUL_CHARACTERS.degetel,
  ritualOpen: "Arătăm împreună.",
  ritualClose: "Arătat, gata.",
  surprises: {
    1: "Arătăm mingea",
    2: "Unde e jucăria? 2 sec",
    3: "Arătăm ușa",
    4: "Arătăm fereastra",
    5: "El alege ce arată",
    6: "Degețelul secret (doar el arată)",
    7: "Ultima pagină: unde e?",
  },
};
const WEEK_47: WeekConfig = {
  week: 47,
  theme: "Grijă de lucruri",
  character: PLAYFUL_CHARACTERS.grijuliul,
  ritualOpen: "Grijă de lucruri.",
  ritualClose: "Lucruri, gata.",
  surprises: {
    1: "Jucăria e a mea, 2 sec",
    2: "Punem în cutie",
    3: "Două lucruri la loc",
    4: "Haina pe cuier",
    5: "Cartea pe raft",
    6: "El alege un lucru de grijă",
    7: "Verificăm: cutia la loc",
  },
};
const WEEK_48: WeekConfig = {
  week: 48,
  theme: "Salut și la revedere",
  character: PLAYFUL_CHARACTERS.norocel,
  ritualOpen: "Salut și pa.",
  ritualClose: "Pa, gata.",
  surprises: {
    1: "Mâna sus: salut",
    2: "Pași până la ușă",
    3: "Fluturăm: la revedere",
    4: "Salut, apoi câțiva pași",
    5: "La revedere la fereastră",
    6: "El salută oaspetele, dacă vrea",
    7: "Un salut la final",
  },
};
const WEEK_49: WeekConfig = {
  week: 49,
  theme: "Repetăm 3 favorite",
  character: PLAYFUL_CHARACTERS.scumpicel,
  ritualOpen: "Trei favorite.",
  ritualClose: "Cele trei, gata.",
  surprises: {
    1: "Mingea favorită 2 sec",
    2: "El alege pagina iubită",
    3: "Dansul ales, o dată",
    4: "Mingea din nou, pe rând",
    5: "Alege una din trei",
    6: "Pașii favoriți",
    7: "Un favorit la final",
  },
};
const WEEK_50: WeekConfig = {
  week: 50,
  theme: "Casă liniștită",
  character: PLAYFUL_CHARACTERS.cumintel,
  ritualOpen: "Casă liniștită.",
  ritualClose: "Liniște, gata.",
  surprises: {
    1: "Pași moi 2 sec",
    2: "Așezare pe pernă",
    3: "Carte pe genunchi",
    4: "Mâinile pe genunchi",
    5: "Perdeaua se trage blând",
    6: "Balans blând pe loc",
    7: "Verificăm: casa e liniștită",
  },
};
const WEEK_51: WeekConfig = {
  week: 51,
  theme: "Curtea cunoscută",
  character: PLAYFUL_CHARACTERS.gospodarel,
  ritualOpen: "Curtea știută.",
  ritualClose: "Curtea, gata.",
  surprises: {
    1: "Pași în curtea cunoscută",
    2: "Mâna pe gard",
    3: "Pași până la copac",
    4: "Atingem pământul",
    5: "Mâna pe poartă",
    6: "El arată un loc știut",
    7: "Înapoi la ușă",
  },
};
const WEEK_52: WeekConfig = {
  week: 52,
  theme: "Anul se închide blând",
  character: PLAYFUL_CHARACTERS.blandut,
  ritualOpen: "Anul, blând.",
  ritualClose: "Anul, gata.",
  surprises: {
    1: "Pași blânzi prin casă",
    2: "Trei locuri din casă",
    3: "El alege pagina anului",
    4: "Mingea blândă, pe rând",
    5: "Privim geamul la final",
    6: "Balans: anul se închide",
    7: "Totul la loc, an gata",
  },
};

const WEEK_CONFIG: Record<PlayfulPilotWeek, WeekConfig> = {
  1: WEEK_1,
  2: WEEK_2,
  3: WEEK_3,
  4: WEEK_4,
  5: WEEK_5,
  6: WEEK_6,
  7: WEEK_7,
  8: WEEK_8,
  9: WEEK_9,
  10: WEEK_10,
  11: WEEK_11,
  12: WEEK_12,
  13: WEEK_13,
  14: WEEK_14,
  15: WEEK_15,
  16: WEEK_16,
  17: WEEK_17,
  18: WEEK_18,
  19: WEEK_19,
  20: WEEK_20,
  21: WEEK_21,
  22: WEEK_22,
  23: WEEK_23,
  24: WEEK_24,
  25: WEEK_25,
  26: WEEK_26,
  27: WEEK_27,
  28: WEEK_28,
  29: WEEK_29,
  30: WEEK_30,
  31: WEEK_31,
  32: WEEK_32,
  33: WEEK_33,
  34: WEEK_34,
  35: WEEK_35,
  36: WEEK_36,
  37: WEEK_37,
  38: WEEK_38,
  39: WEEK_39,
  40: WEEK_40,
  41: WEEK_41,
  42: WEEK_42,
  43: WEEK_43,
  44: WEEK_44,
  45: WEEK_45,
  46: WEEK_46,
  47: WEEK_47,
  48: WEEK_48,
  49: WEEK_49,
  50: WEEK_50,
  51: WEEK_51,
  52: WEEK_52,
};

export function isPlayfulPilotWeek(week: number): week is PlayfulPilotWeek {
  return (PLAYFUL_PILOT_WEEKS as readonly number[]).includes(week);
}

/** Day overlay: S1–S52 L–D (1–7). */
export function playfulPilotFor(
  week: number,
  dayOfWeek: number,
): PlayfulOverlay | null {
  if (!isPlayfulPilotWeek(week)) return null;
  const config = WEEK_CONFIG[week];
  const surprise = config.surprises[dayOfWeek];
  if (!surprise) return null;
  return {
    week,
    dayOfWeek,
    theme: config.theme,
    character: config.character,
    ritualOpen: config.ritualOpen,
    ritualClose: config.ritualClose,
    surprise,
  };
}

/** Week-level ritual/character (Săptămâna header). */
export function playfulPilotWeek(week: number): Omit<
  PlayfulOverlay,
  "dayOfWeek" | "surprise"
> | null {
  if (!isPlayfulPilotWeek(week)) return null;
  const config = WEEK_CONFIG[week];
  return {
    week,
    theme: config.theme,
    character: config.character,
    ritualOpen: config.ritualOpen,
    ritualClose: config.ritualClose,
  };
}

export function playfulHeaderLabel(characterName: string, theme: string): string {
  const name = characterName.trim();
  const trimmed = theme.trim();
  if (!name) return trimmed;
  if (!trimmed) return name;
  return `${name} · ${trimmed}`;
}

export function playfulSurpriseLabel(surprise: string): string {
  const text = surprise.trim();
  if (!text) return SURPRIZA_PREFIX;
  if (text.toLocaleLowerCase("ro-RO").startsWith("surpriză:")) return text;
  return `${SURPRIZA_PREFIX} ${text}`;
}
