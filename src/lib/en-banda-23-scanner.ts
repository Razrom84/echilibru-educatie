import { readFileSync } from "node:fs";
import { resolve } from "node:path";

type TokenFile = { tokens: string[] };

type SeedFile = {
  banda: string;
  activitati: Array<{
    id: string;
    banda: string;
    saptamana: number;
    titlu: string;
    materiale: string[];
    pasi: string[];
    gata_cand: string;
    tema_saptamana: string;
    nota?: string | null;
  }>;
};

export const BANDA_23_SEED_FILES = [
  "content/seed-s1-banda-2-3-v2.json",
  "content/seed-s2-s4-banda-2-3-v2.json",
  "content/seed-s5-s8-banda-2-3-v2.json",
  "content/seed-s9-s12-banda-2-3-v2.json",
  "content/seed-s13-s16-banda-2-3-v2.json",
  "content/seed-s17-s20-banda-2-3-v2.json",
  "content/seed-s21-s24-banda-2-3-v2.json",
  "content/seed-s25-s28-banda-2-3-v2.json",
  "content/seed-s29-s32-banda-2-3-v2.json",
  "content/seed-s33-s36-banda-2-3-v2.json",
  "content/seed-s37-s40-banda-2-3-v2.json",
  "content/seed-s41-s44-banda-2-3-v2.json",
  "content/seed-s45-s48-banda-2-3-v2.json",
  "content/seed-s49-s52-banda-2-3-v2.json",
] as const;

export function loadEnBanda23Tokens(root = process.cwd()): string[] {
  const raw = JSON.parse(
    readFileSync(resolve(root, "content/en-banda-23-scan-tokens.json"), "utf8"),
  ) as TokenFile;
  return [...raw.tokens].sort((a, b) => b.length - a.length || a.localeCompare(b));
}

export function loadBanda23SeedActivities(root = process.cwd()) {
  return BANDA_23_SEED_FILES.flatMap((file) => {
    const seed = JSON.parse(readFileSync(resolve(root, file), "utf8")) as SeedFile;
    if (seed.banda !== "2-3") {
      throw new Error(`${file} must be banda 2-3`);
    }
    return seed.activitati.map((row) => ({ ...row, file }));
  });
}

export function copyBlob(row: {
  titlu: string;
  materiale: string[];
  pasi: string[];
  gata_cand: string;
  tema_saptamana: string;
}): string {
  return [
    row.titlu,
    ...(row.materiale ?? []),
    ...(row.pasi ?? []),
    row.gata_cand,
    row.tema_saptamana,
  ].join("\n");
}

function tokenPattern(token: string): RegExp {
  const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // JS \\b is ASCII-only and splits plantă / sortăm / Turnăm on ă.
  return new RegExp(`(?<![\\p{L}])${escaped}(?![\\p{L}])`, "iu");
}

export function scanEnTokens(
  text: string,
  tokens: string[],
): string[] {
  const hits: string[] = [];
  for (const token of tokens) {
    if (tokenPattern(token).test(text)) hits.push(token);
  }
  return hits;
}

export function scanBanda23Seed(root = process.cwd()) {
  const tokens = loadEnBanda23Tokens(root);
  const rows = loadBanda23SeedActivities(root);
  const fails = rows
    .map((row) => {
      const tokensHit = scanEnTokens(copyBlob(row), tokens);
      return tokensHit.length
        ? { id: row.id, file: row.file, tokens: tokensHit, titlu: row.titlu }
        : null;
    })
    .filter((hit): hit is NonNullable<typeof hit> => hit !== null);
  return { tokens, rows, fails };
}
