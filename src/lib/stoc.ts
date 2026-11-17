/** Teaching-materials stock: types, fixed lists and pure helpers. No I/O here. */

export const STOC_BUCKET = "stoc-familie";
export const STOC_DEMO_KEY = "echilibru-demo-stoc-v1";

export type StocTip = "cumparat" | "facut_acasa";
export type StocStare = "bun" | "uzat" | "de_reparat" | "pierdut";
export type StocSursa = "manual" | "lista_inceput" | "din_activitate";
export type StocCategorie =
  | "carti"
  | "sortare"
  | "motricitate_fina"
  | "miscare"
  | "senzorial"
  | "apa_nisip"
  | "arta"
  | "natura"
  | "viata_practica"
  | "joc_rol";

export type StocItem = {
  id: string;
  family_id: string;
  nume: string;
  tip: StocTip;
  categorie: StocCategorie;
  produs_cheie: string | null;
  material_id: string | null;
  stare: StocStare;
  loc: string | null;
  varsta_min_luni: number | null;
  varsta_max_luni: number | null;
  poza_url: string | null;
  sursa: StocSursa;
  data: string | null;
  pret_platit: number | null;
  note: string | null;
  created_at: string;
  updated_at: string;
};

export type StocFolosire = {
  id: string;
  stoc_id: string;
  activity_id: string;
  family_id: string;
  created_at: string;
};

export type StocDraft = {
  nume: string;
  tip: StocTip;
  categorie: StocCategorie;
  produs_cheie?: string | null;
  material_id?: string | null;
  stare?: StocStare;
  loc?: string | null;
  varsta_min_luni?: number | null;
  varsta_max_luni?: number | null;
  sursa: StocSursa;
  note?: string | null;
};

export const STOC_TIP_LABEL: Record<StocTip, string> = {
  cumparat: "Cumpărat",
  facut_acasa: "Făcut acasă",
};

export const STOC_STARE_LABEL: Record<StocStare, string> = {
  bun: "Bun",
  uzat: "Uzat",
  de_reparat: "De reparat",
  pierdut: "Pierdut",
};

export const STOC_CATEGORII: { key: StocCategorie; label: string }[] = [
  { key: "carti", label: "Cărți" },
  { key: "sortare", label: "Sortare și potrivire" },
  { key: "motricitate_fina", label: "Motricitate fină" },
  { key: "miscare", label: "Mișcare" },
  { key: "senzorial", label: "Senzorial și sunete" },
  { key: "apa_nisip", label: "Apă și nisip" },
  { key: "arta", label: "Artă" },
  { key: "natura", label: "Natură și afară" },
  { key: "viata_practica", label: "Viață practică" },
  { key: "joc_rol", label: "Joc de rol" },
];

export const STOC_CATEGORIE_LABEL = Object.fromEntries(
  STOC_CATEGORII.map((item) => [item.key, item.label]),
) as Record<StocCategorie, string>;

export function isStocCategorie(value: string): value is StocCategorie {
  return STOC_CATEGORII.some((item) => item.key === value);
}

export type StarterItem = {
  key: string;
  nume: string;
  categorie: StocCategorie;
  tip: StocTip;
  varsta_min_luni: number | null;
  produs_cheie?: string;
  material_id?: string;
  banda?: "1-2" | "2-3";
};

/**
 * Starter items that the 1–2 S13–S14 content also uses get the same
 * `produs_cheie` as Cristina's catalog, so ticking them here lights up
 * „Ai deja în stoc” there.
 */
export const STARTER_KEYS: Record<string, string> = {
  "Cărți cartonate": "carti-cartonate",
  "Păpușă sau ursuleț": "ursulet-papusa",
  "Minge moale mare": "minge-moale-mare",
  "Perne pentru traseu": "perne-traseu",
  "Castroane și linguri din bucătărie": "castroane-linguri",
  Tavă: "tava",
  "Găleată și lopățică": "galeata-si-lopatica",
};

const starter = (
  categorie: StocCategorie,
  items: [string, StocTip?, number?][],
): StarterItem[] =>
  items.map(([nume, tip = "cumparat", varsta = 12], index) => ({
    key: `${categorie}-${index + 1}`,
    nume,
    categorie,
    tip,
    varsta_min_luni: varsta,
    ...(STARTER_KEYS[nume] ? { produs_cheie: STARTER_KEYS[nume] } : {}),
  }));

/** The 33 starter items (plan, section 7.1). Age is prefilled, category comes from the group. */
export const STARTER_LIST: StarterItem[] = [
  ...starter("carti", [["Cărți cartonate"], ["Cărți cu clapete"], ["Carte cu texturi"]]),
  ...starter("sortare", [
    ["Cutie de sortare cu forme"],
    ["Pahare de stivuit"],
    ["Incastru cu butoni mari (3–5 piese)"],
  ]),
  ...starter("motricitate_fina", [
    ["Cuburi mari de lemn"],
    ["Bile mari (peste 4,5 cm)"],
    ["„Cutie poștală” cu fantă", "facut_acasa"],
    ["Borcane de plastic cu capac de deșurubat"],
  ]),
  ...starter("miscare", [
    ["Minge moale mare"],
    ["Jucărie de împins"],
    ["Tunel textil"],
    ["Perne pentru traseu"],
  ]),
  ...starter("senzorial", [
    ["Saci senzoriali cusuți", "facut_acasa"],
    ["Sticle senzoriale cu capac lipit", "facut_acasa"],
    ["Maracas mari"],
    ["Xilofon de copii"],
  ]),
  ...starter("apa_nisip", [["Găleată și lopățică"], ["Pâlnie și pahare"], ["Burete mare"]]),
  ...starter("arta", [
    ["Pensule mari, cu mâner gros"],
    ["Creioane cerate groase"],
    ["Aluat de jucat, cu adult", "facut_acasa"],
  ]),
  ...starter("natura", [["Coș pentru adunat"], ["Stropitoare mică"]]),
  ...starter("viata_practica", [
    ["Castroane și linguri din bucătărie"],
    ["Tavă"],
    ["Mătură și făraș mici"],
    ["Cuier jos", "facut_acasa"],
  ]),
  ...starter("joc_rol", [
    ["Păpușă sau ursuleț"],
    ["Set de bucătărie sau de ceai din lemn"],
    ["Telefon de jucărie (cu capacul bateriilor înșurubat)"],
  ]),
];

const gifted = (
  material_id: string,
  produs_cheie: string,
  nume: string,
  categorie: StocCategorie,
  tip: StocTip,
  varsta_min_luni: number | null,
): StarterItem => ({
  key: `gifted-${material_id}`,
  nume,
  categorie,
  tip,
  varsta_min_luni,
  produs_cheie,
  material_id,
  banda: "2-3",
});

/** „Din planul gifted”: the 18 materials of band 2–3, S1–S4, keyed by `produs_cheie`. */
export const GIFTED_STARTER: { saptamana: number; items: StarterItem[] }[] = [
  {
    saptamana: 1,
    items: [
      gifted("s1-m1", "carte-ce-facem-toamna", "„Ce facem toamna?”", "carti", "cumparat", 24),
      gifted("s1-m2", "lupa-jumbo-tickit", "Lupă jumbo Tickit", "natura", "cumparat", 12),
      gifted("s1-m3", "tava-lemn-mica", "Tavă de lemn mică", "viata_practica", "cumparat", null),
      gifted("s1-m4", "harta-casei-diy", "Harta casei", "joc_rol", "facut_acasa", null),
    ],
  },
  {
    saptamana: 2,
    items: [
      gifted("s2-m1", "carafa-mica", "Carafă mică", "viata_practica", "cumparat", null),
      gifted("s2-m2", "bile-pahare-montessori", "Bile și pahare Montessori", "motricitate_fina", "cumparat", 12),
      gifted("s2-m3", "set-plaja-dantoy", "Set de plajă Dantoy", "apa_nisip", "cumparat", 24),
      gifted("s2-m4", "carte-aparate-electrice", "„Aparatele electrice din casă”", "carti", "cumparat", 24),
      gifted("s2-m5", "carte-soare-vant-ploaie", "„Soarele, vântul și ploaia”", "carti", "cumparat", 12),
    ],
  },
  {
    saptamana: 3,
    items: [
      gifted("s3-m1", "percutie-hape", "Set de percuție Hape", "senzorial", "cumparat", 12),
      gifted("s3-m2", "cilindri-sonori", "Cilindri sonori", "senzorial", "cumparat", 36),
      gifted("s3-m3", "carte-vanatoare-ursi", "„Mergem la vânătoare de urși”", "carti", "cumparat", 12),
      gifted("s3-m4", "cartonase-sunete-diy", "Cartonașe cu surse de sunet", "senzorial", "facut_acasa", null),
    ],
  },
  {
    saptamana: 4,
    items: [
      gifted("s4-m1", "rama-velcro", "Ramă cu velcro", "viata_practica", "cumparat", null),
      gifted("s4-m2", "placa-incuietori", "Placă cu încuietori", "motricitate_fina", "cumparat", null),
      gifted("s4-m3", "pensete-colorate", "Pensete colorate", "motricitate_fina", "cumparat", 36),
      gifted("s4-m4", "suruburi-piulite-mari", "Șuruburi și piulițe mari", "motricitate_fina", "cumparat", 24),
      gifted("s4-m5", "aluat-de-sare-diy", "Aluat de sare", "arta", "facut_acasa", null),
    ],
  },
];

const GIFTED_BY_MATERIAL = new Map(
  GIFTED_STARTER.flatMap((week) => week.items).map((item) => [`${item.banda}:${item.material_id}`, item]),
);
const GIFTED_BY_KEY = new Map(
  GIFTED_STARTER.flatMap((week) => week.items).map((item) => [item.produs_cheie!, item]),
);

/** Fallback when the catalog row has no `produs_cheie` yet (before the migration). */
export function produsCheieForMaterial(banda: string, materialId: string): string | null {
  return GIFTED_BY_MATERIAL.get(`${banda}:${materialId}`)?.produs_cheie ?? null;
}

const CATEGORY_WORDS: [StocCategorie, RegExp][] = [
  ["carti", /carte|carti|„/],
  ["apa_nisip", /galeat|lopatic|palnie|burete|plaj|nisip/],
  ["senzorial", /tob|percut|sunet|xilofon|maraca|clopot/],
  ["arta", /aluat|pensul|creio|vopsea|lipici/],
  ["natura", /lupa|stropitoare|cos |frunz/],
  ["miscare", /minge|tunel|treapt|perne/],
  ["motricitate_fina", /pensete|surub|piulit|bile|incuietor/],
  ["sortare", /sortare|pereche|stivui|incastru/],
  ["joc_rol", /papus|ursulet|telefon|harta/],
];

export function foldText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/** Category for a catalog material added from a card. Known products first, then words. */
export function categoryForMaterial(material: {
  produs_cheie?: string | null;
  nume: string;
  categorie?: string | null;
}): StocCategorie {
  if (material.categorie && isStocCategorie(material.categorie)) return material.categorie;
  const known = material.produs_cheie ? GIFTED_BY_KEY.get(material.produs_cheie) : undefined;
  if (known) return known.categorie;
  const name = foldText(material.nume);
  return CATEGORY_WORDS.find(([, words]) => words.test(name))?.[0] ?? "viata_practica";
}

export function minAgeForMaterial(produsCheie: string | null | undefined): number | null {
  return produsCheie ? (GIFTED_BY_KEY.get(produsCheie)?.varsta_min_luni ?? null) : null;
}

/** Stock items that cover a catalog material: by `produs_cheie`, then `material_id`. Lost ones never count. */
export function stockForMaterial(
  items: readonly StocItem[],
  material: { id: string; produs_cheie?: string | null },
): StocItem[] {
  return items.filter((item) => {
    if (item.stare === "pierdut") return false;
    if (material.produs_cheie && item.produs_cheie === material.produs_cheie) return true;
    return item.material_id != null && item.material_id === material.id;
  });
}

export function hasInStock(
  items: readonly StocItem[],
  material: { id: string; produs_cheie?: string | null },
): boolean {
  return stockForMaterial(items, material).length > 0;
}

/** „5 din 6 materiale le aveți deja · de cumpărat: 0 lei”. */
export function reuseSummary(
  items: readonly StocItem[],
  materials: readonly { id: string; produs_cheie?: string | null; doar_acasa?: boolean }[],
  buyTotalLei: number,
): string | null {
  if (materials.length === 0) return null;
  const have = materials.filter((material) => hasInStock(items, material)).length;
  return `${have} din ${materials.length} materiale le aveți deja · de cumpărat: ${Math.round(buyTotalLei)} lei`;
}

/** Whole months between birthdate and today (both YYYY-MM-DD). */
export function ageInMonths(birthdate: string | null | undefined, today: string): number | null {
  const birth = /^(\d{4})-(\d{2})-(\d{2})/.exec(birthdate ?? "");
  const now = /^(\d{4})-(\d{2})-(\d{2})/.exec(today);
  if (!birth || !now) return null;
  let months = (Number(now[1]) - Number(birth[1])) * 12 + (Number(now[2]) - Number(birth[2]));
  if (Number(now[3]) < Number(birth[3])) months -= 1;
  return Math.max(0, months);
}

export const STOC_SAFETY_NOTE = "Atenție la piese sub 3,2 cm, snururi și sticlă.";

export type AgeBadge = { kind: "peste" | "necunoscut"; label: string } | null;

export function ageBadge(item: Pick<StocItem, "varsta_min_luni">, childMonths: number | null): AgeBadge {
  if (item.varsta_min_luni == null) {
    return { kind: "necunoscut", label: "Vârstă necunoscută: verificați piesele mici" };
  }
  if (childMonths != null && item.varsta_min_luni > childMonths) {
    return { kind: "peste", label: "Peste vârsta lui: doar cu adult" };
  }
  return null;
}

export function ageRangeLabel(min: number | null, max: number | null): string | null {
  const part = (months: number) =>
    months % 12 === 0 ? `${months / 12} ${months === 12 ? "an" : "ani"}` : `${months} luni`;
  if (min != null && max != null) return `${part(min)} – ${part(max)}`;
  if (min != null) return `de la ${part(min)}`;
  if (max != null) return `până la ${part(max)}`;
  return null;
}

/**
 * Items with no use in the last 28 days, lost ones excluded. An item never
 * used counts once it has been in stock for 28 days. Read-only report.
 */
export function unusedForWeeks(
  items: readonly StocItem[],
  uses: readonly StocFolosire[],
  now: Date,
  days = 28,
): StocItem[] {
  const cutoff = now.getTime() - days * 86_400_000;
  return items.filter((item) => {
    if (item.stare === "pierdut") return false;
    if (new Date(item.created_at).getTime() >= cutoff) return false;
    return !uses.some(
      (use) => use.stoc_id === item.id && new Date(use.created_at).getTime() >= cutoff,
    );
  });
}

export function photoPath(familyId: string, itemId: string): string {
  return `${familyId}/${itemId}.jpg`;
}

/** Validates the manual form. Returns a Romanian message or null. */
export function validateDraft(draft: Partial<StocDraft>): string | null {
  if (!draft.nume?.trim()) return "Scrieți numele articolului.";
  if (draft.tip !== "cumparat" && draft.tip !== "facut_acasa") return "Alegeți dacă e cumpărat sau făcut acasă.";
  if (!draft.categorie || !isStocCategorie(draft.categorie)) return "Alegeți o categorie.";
  const { varsta_min_luni: min, varsta_max_luni: max } = draft;
  for (const value of [min, max]) {
    if (value != null && (!Number.isInteger(value) || value < 0 || value > 144)) {
      return "Vârsta se scrie în luni, între 0 și 144.";
    }
  }
  if (min != null && max != null && min > max) return "Vârsta „de la” e mai mare decât „până la”.";
  return null;
}

export function starterDrafts(items: readonly StarterItem[]): StocDraft[] {
  return items.map((item) => ({
    nume: item.nume,
    tip: item.tip,
    categorie: item.categorie,
    produs_cheie: item.produs_cheie ?? null,
    material_id: item.material_id ?? null,
    varsta_min_luni: item.varsta_min_luni,
    sursa: "lista_inceput",
  }));
}
