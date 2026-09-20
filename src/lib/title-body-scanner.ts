/**
 * Title↔body object-family scanner (audit / final-check).
 * FAIL = titled object missing from materiale + pasi + gata_cand.
 * Soft NITs stay classified, not FAIL (Cristina FINAL CHECK RERUN).
 */

export type TitleBodyRow = {
  id: string;
  titlu: string;
  materiale: string[];
  pasi: string[];
  gata_cand: string;
};

export type ObjectFamily = {
  id: string;
  /** Stems that trigger a scan when they appear in the title. */
  titleStems: string[];
  /** Any of these must appear in the body for a PASS. */
  bodyStems: string[];
  /** Extra body stems required when the title matches this exact string. */
  extraBodyWhenTitle?: { title: string; stems: string[] };
};

export type TitleBodyHit = {
  id: string;
  family: string;
  titlu: string;
  missing: string[];
  soft: boolean;
};

/** Documented soft proxies — NIT, not FAIL (FINAL-CHECK-BANDA-1-2-RERUN). */
export const SOFT_TITLE_BODY_NITS = new Set([
  "s2-2-3-z6-fizic", // Cizmele în băltoacă — outdoor implied
  "s23-2-3-z4-fizic", // Mirosim rufele — prosop smell proxy
  "s23-2-3-z4-mental", // Miroase a rufe curate? — acceptable soft
]);

/**
 * Pre-P3 lexicon (haină … făraș) plus P4 Anti-P5 stems:
 * cizmă / cizme / cizma · șosetă / șosete · rufă / rufe (+ coș on „Rufele în coș”).
 */
export const TITLE_BODY_OBJECT_FAMILIES: ObjectFamily[] = [
  {
    id: "cizma",
    titleStems: ["cizmă", "cizme", "cizma"],
    bodyStems: ["cizmă", "cizme", "cizma"],
  },
  {
    id: "sosete",
    titleStems: ["șosetă", "șosete", "șoseta"],
    bodyStems: ["șosetă", "șosete", "șoseta"],
  },
  {
    id: "rufe",
    titleStems: ["rufă", "rufe", "rufa"],
    bodyStems: ["rufă", "rufe", "rufa"],
    extraBodyWhenTitle: { title: "Rufele în coș", stems: ["coș"] },
  },
  {
    id: "haina",
    titleStems: ["haină", "haina", "haine"],
    bodyStems: ["haină", "haina", "haine"],
  },
  {
    id: "pantofi",
    titleStems: ["pantofi", "pantof"],
    bodyStems: ["pantofi", "pantof"],
  },
  {
    id: "cuier",
    titleStems: ["cuier"],
    bodyStems: ["cuier"],
  },
  {
    id: "faras",
    titleStems: ["făraș", "faras"],
    bodyStems: ["făraș", "faras"],
  },
  {
    id: "floare",
    titleStems: ["floare", "floarea"],
    bodyStems: ["floare", "floarea"],
  },
  {
    id: "lingura",
    titleStems: ["lingură", "lingura"],
    bodyStems: ["lingură", "lingura"],
  },
  {
    id: "carpa",
    titleStems: ["cârpă", "carpa"],
    bodyStems: ["cârpă", "carpa"],
  },
  {
    id: "mugure",
    titleStems: ["mugure"],
    bodyStems: ["mugure"],
  },
  {
    id: "ghiveci",
    titleStems: ["ghiveci"],
    bodyStems: ["ghiveci"],
  },
  {
    id: "prosop",
    titleStems: ["prosop"],
    bodyStems: ["prosop"],
  },
  {
    id: "servetel",
    titleStems: ["șervețel", "servetel"],
    bodyStems: ["șervețel", "servetel"],
  },
];

export const P4_OBJECT_FAMILY_IDS = ["cizma", "sosete", "rufe"] as const;

function fold(value: string): string {
  return value.toLocaleLowerCase("ro");
}

function hasStem(haystack: string, stem: string): boolean {
  return haystack.includes(fold(stem));
}

function anyStem(haystack: string, stems: string[]): boolean {
  return stems.some((stem) => hasStem(haystack, stem));
}

export function bodyBlob(row: TitleBodyRow): string {
  return fold([...row.materiale, ...row.pasi, row.gata_cand].join("\n"));
}

export function scanTitleBody(
  rows: TitleBodyRow[],
  families: ObjectFamily[] = TITLE_BODY_OBJECT_FAMILIES,
): { fails: TitleBodyHit[]; nits: TitleBodyHit[] } {
  const fails: TitleBodyHit[] = [];
  const nits: TitleBodyHit[] = [];
  for (const row of rows) {
    const title = fold(row.titlu);
    const body = bodyBlob(row);
    for (const family of families) {
      if (!anyStem(title, family.titleStems)) continue;
      const missing: string[] = [];
      if (!anyStem(body, family.bodyStems)) {
        missing.push(family.id);
      }
      if (
        family.extraBodyWhenTitle &&
        row.titlu === family.extraBodyWhenTitle.title &&
        !anyStem(body, family.extraBodyWhenTitle.stems)
      ) {
        missing.push(...family.extraBodyWhenTitle.stems);
      }
      if (missing.length === 0) continue;
      const hit: TitleBodyHit = {
        id: row.id,
        family: family.id,
        titlu: row.titlu,
        missing,
        soft: SOFT_TITLE_BODY_NITS.has(row.id),
      };
      if (hit.soft) nits.push(hit);
      else fails.push(hit);
    }
  }
  return { fails, nits };
}
