/**
 * PLAYFUL PILOT — GO lock: S14 V–D + full S15 only.
 * Characters, ritual lines, and daily surprises live here (not in activities.nota).
 */

export const PLAYFUL_PILOT_WEEKS = [14, 15] as const;

export type PlayfulCharacterId = "pasorel" | "farfurio";

export type PlayfulCharacter = {
  id: PlayfulCharacterId;
  name: string;
  src: string;
};

export type PlayfulOverlay = {
  week: 14 | 15;
  dayOfWeek: number;
  theme: string;
  character: PlayfulCharacter;
  ritualOpen: string;
  ritualClose: string;
  surprise: string;
};

export const PLAYFUL_CHARACTERS: Record<PlayfulCharacterId, PlayfulCharacter> = {
  pasorel: {
    id: "pasorel",
    name: "Pașorel",
    src: "/characters/pasorel.svg",
  },
  farfurio: {
    id: "farfurio",
    name: "Farfurio",
    src: "/characters/farfurio.svg",
  },
};

export const SURPRIZA_PREFIX = "Surpriză:";

const WEEK_14 = {
  week: 14 as const,
  theme: "Pași pe drumul scurt",
  character: PLAYFUL_CHARACTERS.pasorel,
  ritualOpen: "Hai la pași. Gata?",
  ritualClose: "Pași gata. Bravo.",
  surprises: {
    5: "pas pe vârfuri 2s",
    6: "el alege oprirea",
    7: "o pagină în plus la carte",
  } as Record<number, string>,
};

const WEEK_15 = {
  week: 15 as const,
  theme: "Mâncare împreună",
  character: PLAYFUL_CHARACTERS.farfurio,
  ritualOpen: "Hai la masă. Gata?",
  ritualClose: "Masă gata. Bravo.",
  surprises: {
    1: "toc-toc pe farfurie",
    2: "bucățică sub șervețel",
    3: "lingură „drum lung”",
    4: "pahar 2 pași",
    5: "strop jucăuș la mâini",
    6: "el alege pătură/treaptă",
    7: "pagină în plus carte mâncare",
  } as Record<number, string>,
};

export function isPlayfulPilotWeek(week: number): week is 14 | 15 {
  return week === 14 || week === 15;
}

/** Day overlay: S14 only V–D (5–7); S15 L–D (1–7). */
export function playfulPilotFor(
  week: number,
  dayOfWeek: number,
): PlayfulOverlay | null {
  if (week === 14) {
    const surprise = WEEK_14.surprises[dayOfWeek];
    if (!surprise) return null;
    return {
      week: 14,
      dayOfWeek,
      theme: WEEK_14.theme,
      character: WEEK_14.character,
      ritualOpen: WEEK_14.ritualOpen,
      ritualClose: WEEK_14.ritualClose,
      surprise,
    };
  }
  if (week === 15) {
    const surprise = WEEK_15.surprises[dayOfWeek];
    if (!surprise) return null;
    return {
      week: 15,
      dayOfWeek,
      theme: WEEK_15.theme,
      character: WEEK_15.character,
      ritualOpen: WEEK_15.ritualOpen,
      ritualClose: WEEK_15.ritualClose,
      surprise,
    };
  }
  return null;
}

/** Week-level ritual/character (Săptămâna header). S14 still shows ritual; days V–D get surprises. */
export function playfulPilotWeek(week: number): Omit<
  PlayfulOverlay,
  "dayOfWeek" | "surprise"
> | null {
  if (week === 14) {
    return {
      week: 14,
      theme: WEEK_14.theme,
      character: WEEK_14.character,
      ritualOpen: WEEK_14.ritualOpen,
      ritualClose: WEEK_14.ritualClose,
    };
  }
  if (week === 15) {
    return {
      week: 15,
      theme: WEEK_15.theme,
      character: WEEK_15.character,
      ritualOpen: WEEK_15.ritualOpen,
      ritualClose: WEEK_15.ritualClose,
    };
  }
  return null;
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
