/**
 * PLAYFUL PILOT — GO lock: S1–S20 L–D (S3 was V–D; now full week).
 * Characters, ritual lines, and daily surprises live here (not in activities.nota).
 * Zero sounds / wavs / Play button — clips were removed in #33.
 */

export const PLAYFUL_PILOT_WEEKS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
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
  | "cosulet";

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
};

export function isPlayfulPilotWeek(week: number): week is PlayfulPilotWeek {
  return (PLAYFUL_PILOT_WEEKS as readonly number[]).includes(week);
}

/** Day overlay: S1–S20 L–D (1–7). */
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
