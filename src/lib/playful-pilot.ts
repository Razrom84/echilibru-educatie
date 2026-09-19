/**
 * PLAYFUL PILOT — GO lock: S3 V–D + full S4 + S5–S7 L–D.
 * Characters, ritual lines, and daily surprises live here (not in activities.nota).
 * Zero sounds / wavs / Play button — clips were removed in #33.
 */

export const PLAYFUL_PILOT_WEEKS = [3, 4, 5, 6, 7] as const;
export type PlayfulPilotWeek = (typeof PLAYFUL_PILOT_WEEKS)[number];

export type PlayfulCharacterId =
  | "suntel"
  | "manuta"
  | "carioca"
  | "sageata"
  | "presulet";

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

const WEEK_CONFIG: Record<PlayfulPilotWeek, WeekConfig> = {
  3: WEEK_3,
  4: WEEK_4,
  5: WEEK_5,
  6: WEEK_6,
  7: WEEK_7,
};

export function isPlayfulPilotWeek(week: number): week is PlayfulPilotWeek {
  return (PLAYFUL_PILOT_WEEKS as readonly number[]).includes(week);
}

/** Day overlay: S3 only V–D (5–7); S4–S7 L–D (1–7). */
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
