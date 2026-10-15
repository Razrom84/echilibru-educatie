/**
 * Joc tabletă v0 — banda 1–2.
 * Un personaj și un singur obiect pe scenă. Fără voce, fără scor.
 * Textul misiunilor urmează secțiunea 3 din concept.
 */

export const JOC_LEVEL_IDS = ["balonas", "lopatica", "manuta", "sunetel", "maturica"] as const;

export type JocLevelId = (typeof JOC_LEVEL_IDS)[number];

export type JocMotion = "rise" | "sway" | "down" | "hold" | "scoop" | "clap" | "nod" | "sweep";

export type JocScene = {
  id: string;
  prompt: string;
  reaction: string;
  motion: JocMotion;
};

export type JocLevel = {
  id: JocLevelId;
  name: string;
  characterSrc: string;
  objectLabel: string;
  cardLine: string;
  missionParent: string;
  ritual: string;
  scenes: readonly JocScene[];
};

export const JOC_LEVELS: readonly JocLevel[] = [
  {
    id: "balonas",
    name: "Balonaș",
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
    name: "Lopățică",
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
    name: "Mănuță",
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
    name: "Sunețel",
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
    name: "Măturică",
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

export function jocLevelById(id: string): JocLevel | null {
  return JOC_LEVELS.find((level) => level.id === id) ?? null;
}

export function isJocLevelId(id: string): id is JocLevelId {
  return (JOC_LEVEL_IDS as readonly string[]).includes(id);
}
