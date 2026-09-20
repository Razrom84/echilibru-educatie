/**
 * PLAYFUL PILOT — GO lock: S3 V–D + full S4 + S5–S13 L–D.
 * Characters, ritual lines, and daily surprises live here (not in activities.nota).
 * Zero sounds / wavs / Play button — clips were removed in #33.
 */

export const PLAYFUL_PILOT_WEEKS = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] as const;
export type PlayfulPilotWeek = (typeof PLAYFUL_PILOT_WEEKS)[number];

export type PlayfulCharacterId =
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
  | "hainuta";

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

const WEEK_3: WeekConfig = {
  week: 3,
  theme: "Sunete și liniște",
  character: PLAYFUL_CHARACTERS.suntel,
  ritualOpen: "Ascultăm. Gata?",
  ritualClose: "Sunete gata. Bravo.",
  surprises: {
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

const WEEK_CONFIG: Record<PlayfulPilotWeek, WeekConfig> = {
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
};

export function isPlayfulPilotWeek(week: number): week is PlayfulPilotWeek {
  return (PLAYFUL_PILOT_WEEKS as readonly number[]).includes(week);
}

/** Day overlay: S3 only V–D (5–7); S4–S13 L–D (1–7). */
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

/** Week-level ritual/character (Săptămâna header). S3 still shows ritual; days V–D get surprises. */
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
