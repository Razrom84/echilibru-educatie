/**
 * Joc tabletă v0 — banda 1–2.
 * Un personaj și un singur obiect pe scenă. Fără voce, fără scor.
 * Textul misiunilor urmează secțiunea 3 din concept.
 */

export const JOC_LEGACY_LEVEL_IDS = ["balonas", "lopatica", "manuta", "sunetel", "maturica"] as const;

export type JocLegacyLevelId = (typeof JOC_LEGACY_LEVEL_IDS)[number];

/** Day levels are `s{week}-z{day}` for the viewed week. Legacy ids still parse. */
export type JocLevelId = string;

export type JocMotion = "rise" | "sway" | "down" | "hold" | "scoop" | "clap" | "nod" | "sweep";

export type JocObjectKind = "balloon" | "bucket" | "palm" | "cow" | "leaf" | "stone";

export type JocScene = {
  id: string;
  prompt: string;
  reaction: string;
  motion: JocMotion;
  object?: JocObjectKind;
};

export type JocLevel = {
  id: string;
  day: number;
  name: string;
  characterName: string;
  characterSrc: string;
  objectLabel: string;
  cardLine: string;
  missionParent: string;
  ritual: string;
  scenes: readonly JocScene[];
};

const JOC_LEGACY_LEVELS_RAW: readonly JocLevel[] = [
  {
    id: "balonas",
    day: 0,
    name: "Balonaș",
    characterName: "Balonaș",
    characterSrc: "/characters/balonas.svg",
    objectLabel: "Balon",
    cardLine: "Atinge balonul",
    missionParent: "Găsiți balonul real și țineți-l împreună de sfoară.",
    ritual: "Balonul, gata.",
    scenes: [
      {
        id: "balon-urca",
        prompt: "Balon! Atinge balonul.",
        reaction: "Balonul urcă încet.",
        motion: "rise",
      },
      {
        id: "balon-leagan",
        prompt: "Atinge balonul.",
        reaction: "Balonul se leagănă.",
        motion: "sway",
      },
      {
        id: "balon-coboara",
        prompt: "Atinge balonul.",
        reaction: "Balonul coboară încet.",
        motion: "down",
      },
      {
        id: "balon-impreuna",
        prompt: "Atinge balonul.",
        reaction: "Ținem balonul împreună.",
        motion: "hold",
      },
    ],
  },
  {
    id: "lopatica",
    day: 0,
    name: "Lopățică",
    characterName: "Lopățică",
    characterSrc: "/characters/lopetica.svg",
    objectLabel: "Găleată",
    cardLine: "Atinge găleata",
    missionParent: "Afară, puneți 3 lopățele de pământ în găleată.",
    ritual: "Pământul, gata.",
    scenes: [
      {
        id: "pamant-1",
        prompt: "Atinge găleata.",
        reaction: "O lopățică de pământ.",
        motion: "scoop",
      },
      {
        id: "pamant-2",
        prompt: "Atinge găleata.",
        reaction: "Încă o lopățică.",
        motion: "scoop",
      },
      {
        id: "pamant-3",
        prompt: "Atinge găleata.",
        reaction: "A treia lopățică.",
        motion: "scoop",
      },
      {
        id: "pamant-liniste",
        prompt: "Atinge găleata.",
        reaction: "Găleata stă liniștită.",
        motion: "hold",
      },
    ],
  },
  {
    id: "manuta",
    day: 0,
    name: "Mănuță",
    characterName: "Mănuță",
    characterSrc: "/characters/manuta.svg",
    objectLabel: "Palmă",
    cardLine: "Batem din palme",
    missionParent: "Bateți din palme cu mama sau tata, apoi „gata”.",
    ritual: "Palmele, gata.",
    scenes: [
      {
        id: "palme-1",
        prompt: "Batem din palme.",
        reaction: "O dată, încet.",
        motion: "clap",
      },
      {
        id: "palme-2",
        prompt: "Batem din palme.",
        reaction: "Încă o dată.",
        motion: "clap",
      },
      {
        id: "palme-3",
        prompt: "Batem din palme.",
        reaction: "Încă o dată.",
        motion: "clap",
      },
      {
        id: "palme-4",
        prompt: "Batem din palme.",
        reaction: "Încet, împreună.",
        motion: "clap",
      },
    ],
  },
  {
    id: "sunetel",
    day: 0,
    name: "Sunețel",
    characterName: "Sunețel",
    characterSrc: "/characters/suntel.svg",
    objectLabel: "Vacă",
    cardLine: "Atinge vaca",
    missionParent: "Arătați vaca dintr-o carte sau o jucărie din casă.",
    ritual: "Vaca, gata.",
    scenes: [
      {
        id: "vaca-mu",
        prompt: "Atinge vaca.",
        reaction: "Mu.",
        motion: "nod",
      },
      {
        id: "vaca-cap",
        prompt: "Atinge vaca.",
        reaction: "Vaca dă din cap.",
        motion: "nod",
      },
      {
        id: "vaca-mu-2",
        prompt: "Atinge vaca.",
        reaction: "Mu, încă o dată.",
        motion: "nod",
      },
      {
        id: "vaca-liniste",
        prompt: "Atinge vaca.",
        reaction: "Vaca stă liniștită.",
        motion: "hold",
      },
    ],
  },
  {
    id: "maturica",
    day: 0,
    name: "Măturică",
    characterName: "Măturică",
    characterSrc: "/characters/maturica.svg",
    objectLabel: "Frunză",
    cardLine: "Atinge frunza",
    missionParent: "Strângeți împreună 3 frunze din curte într-o cutie.",
    ritual: "Frunzele, gata.",
    scenes: [
      {
        id: "frunza-1",
        prompt: "Atinge frunza.",
        reaction: "Frunza merge încet în cutie.",
        motion: "sweep",
      },
      {
        id: "frunza-2",
        prompt: "Atinge frunza.",
        reaction: "Încă o frunză, încet.",
        motion: "sweep",
      },
      {
        id: "frunza-3",
        prompt: "Atinge frunza.",
        reaction: "A treia frunză.",
        motion: "sweep",
      },
      {
        id: "frunza-4",
        prompt: "Atinge frunza.",
        reaction: "Frunza se așază.",
        motion: "sweep",
      },
    ],
  },
];

/** Older trial entries. The picker no longer offers these five levels. */
export const JOC_LEGACY_LEVELS = JOC_LEGACY_LEVELS_RAW;

const DAY_LEVEL_ID = /^s(\d+)-z([1-7])$/;

export function isDayJocLevelId(id: string): boolean {
  const match = DAY_LEVEL_ID.exec(id);
  if (!match) return false;
  const week = Number(match[1]);
  return week >= 1 && week <= 52;
}

export function isLegacyJocLevelId(id: string): id is JocLegacyLevelId {
  return (JOC_LEGACY_LEVEL_IDS as readonly string[]).includes(id);
}

export function isJocLevelId(id: string): id is JocLevelId {
  return isLegacyJocLevelId(id) || isDayJocLevelId(id);
}

export function jocLegacyLevelById(id: string): JocLevel | null {
  return JOC_LEGACY_LEVELS.find((level) => level.id === id) ?? null;
}

export function sceneObject(levelId: string, scene: JocScene): JocObjectKind {
  if (scene.object) return scene.object;
  if (levelId === "balonas") return "balloon";
  if (levelId === "lopatica") return "bucket";
  if (levelId === "manuta") return "palm";
  if (levelId === "sunetel") return "cow";
  if (levelId === "maturica") return "leaf";
  return "stone";
}

export function objectLabel(kind: JocObjectKind): string {
  if (kind === "balloon") return "Balon";
  if (kind === "bucket") return "Găleată";
  if (kind === "palm") return "Palmă";
  if (kind === "cow") return "Vacă";
  if (kind === "leaf") return "Frunză";
  return "Piatră";
}
