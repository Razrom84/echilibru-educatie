/**
 * PLAYFUL PILOT — GO lock: S3 V–D + full S4 only.
 * Characters, ritual lines, and daily surprises live here (not in activities.nota).
 */

export const PLAYFUL_PILOT_WEEKS = [3, 4] as const;

export type PlayfulCharacterId = "suntel" | "manuta";

export type PlayfulCharacter = {
  id: PlayfulCharacterId;
  name: string;
  src: string;
};

export type PlayfulOverlay = {
  week: 3 | 4;
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
    name: "Sunțel",
    src: "/characters/suntel.svg",
  },
  manuta: {
    id: "manuta",
    name: "Mânuța",
    src: "/characters/manuta.svg",
  },
};

export const SURPRIZA_PREFIX = "Surpriză:";

const WEEK_3 = {
  week: 3 as const,
  theme: "Sunete și liniște",
  character: PLAYFUL_CHARACTERS.suntel,
  ritualOpen: "Hai la sunete. Gata?",
  ritualClose: "Sunete gata. Bravo.",
  surprises: {
    5: "șoaptă 2s",
    6: "o bătaie + liniște",
    7: "lumină stinsă 3s",
  } as Record<number, string>,
};

const WEEK_4 = {
  week: 4 as const,
  theme: "Mâini și degete",
  character: PLAYFUL_CHARACTERS.manuta,
  ritualOpen: "Hai cu mâinile. Gata?",
  ritualClose: "Mâini gata. Bravo.",
  surprises: {
    1: "unde-i degetul",
    2: "high-five",
    3: "degete pe masă",
    4: "strângere×2",
    5: "moale-aspru",
    6: "săpătură+1",
    7: "pagină+1",
  } as Record<number, string>,
};

export function isPlayfulPilotWeek(week: number): week is 3 | 4 {
  return week === 3 || week === 4;
}

/** Day overlay: S3 only V–D (5–7); S4 L–D (1–7). */
export function playfulPilotFor(
  week: number,
  dayOfWeek: number,
): PlayfulOverlay | null {
  if (week === 3) {
    const surprise = WEEK_3.surprises[dayOfWeek];
    if (!surprise) return null;
    return {
      week: 3,
      dayOfWeek,
      theme: WEEK_3.theme,
      character: WEEK_3.character,
      ritualOpen: WEEK_3.ritualOpen,
      ritualClose: WEEK_3.ritualClose,
      surprise,
    };
  }
  if (week === 4) {
    const surprise = WEEK_4.surprises[dayOfWeek];
    if (!surprise) return null;
    return {
      week: 4,
      dayOfWeek,
      theme: WEEK_4.theme,
      character: WEEK_4.character,
      ritualOpen: WEEK_4.ritualOpen,
      ritualClose: WEEK_4.ritualClose,
      surprise,
    };
  }
  return null;
}

/** Week-level ritual/character (Săptămâna header). S3 still shows ritual; days V–D get surprises. */
export function playfulPilotWeek(week: number): Omit<
  PlayfulOverlay,
  "dayOfWeek" | "surprise"
> | null {
  if (week === 3) {
    return {
      week: 3,
      theme: WEEK_3.theme,
      character: WEEK_3.character,
      ritualOpen: WEEK_3.ritualOpen,
      ritualClose: WEEK_3.ritualClose,
    };
  }
  if (week === 4) {
    return {
      week: 4,
      theme: WEEK_4.theme,
      character: WEEK_4.character,
      ritualOpen: WEEK_4.ritualOpen,
      ritualClose: WEEK_4.ritualClose,
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
