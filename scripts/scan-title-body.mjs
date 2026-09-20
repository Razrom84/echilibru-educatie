#!/usr/bin/env node
/**
 * Title↔body audit / final-check scanner.
 * Usage: node scripts/scan-title-body.mjs
 * Reads content/seed-*-banda-1-2.json (1456). Exit 1 on FAIL (soft NITs excluded).
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const SOFT_TITLE_BODY_NITS = new Set([
  "s2-2-3-z6-fizic",
  "s23-2-3-z4-fizic",
  "s23-2-3-z4-mental",
]);

const FAMILIES = [
  { id: "cizma", titleStems: ["cizmă", "cizme", "cizma"], bodyStems: ["cizmă", "cizme", "cizma"] },
  { id: "sosete", titleStems: ["șosetă", "șosete", "șoseta"], bodyStems: ["șosetă", "șosete", "șoseta"] },
  {
    id: "rufe",
    titleStems: ["rufă", "rufe", "rufa"],
    bodyStems: ["rufă", "rufe", "rufa"],
    extraBodyWhenTitle: { title: "Rufele în coș", stems: ["coș"] },
  },
  { id: "haina", titleStems: ["haină", "haina", "haine"], bodyStems: ["haină", "haina", "haine"] },
  { id: "pantofi", titleStems: ["pantofi", "pantof"], bodyStems: ["pantofi", "pantof"] },
  { id: "cuier", titleStems: ["cuier"], bodyStems: ["cuier"] },
  { id: "faras", titleStems: ["făraș", "faras"], bodyStems: ["făraș", "faras"] },
  { id: "floare", titleStems: ["floare", "floarea"], bodyStems: ["floare", "floarea"] },
  { id: "lingura", titleStems: ["lingură", "lingura"], bodyStems: ["lingură", "lingura"] },
  { id: "carpa", titleStems: ["cârpă", "carpa"], bodyStems: ["cârpă", "carpa"] },
  { id: "mugure", titleStems: ["mugure"], bodyStems: ["mugure"] },
  { id: "ghiveci", titleStems: ["ghiveci"], bodyStems: ["ghiveci"] },
  { id: "prosop", titleStems: ["prosop"], bodyStems: ["prosop"] },
  { id: "servetel", titleStems: ["șervețel", "servetel"], bodyStems: ["șervețel", "servetel"] },
];

function fold(value) {
  return value.toLocaleLowerCase("ro");
}

function anyStem(haystack, stems) {
  return stems.some((stem) => haystack.includes(fold(stem)));
}

function loadSeed() {
  const dir = join(root, "content");
  const files = readdirSync(dir)
    .filter((name) => name.startsWith("seed-") && name.endsWith("-banda-1-2.json"))
    .sort();
  return files.flatMap((name) => {
    const json = JSON.parse(readFileSync(join(dir, name), "utf8"));
    return json.activitati ?? [];
  });
}

function scan(rows, families = FAMILIES) {
  const fails = [];
  const nits = [];
  for (const row of rows) {
    const title = fold(row.titlu);
    const body = fold([...(row.materiale ?? []), ...(row.pasi ?? []), row.gata_cand ?? ""].join("\n"));
    for (const family of families) {
      if (!anyStem(title, family.titleStems)) continue;
      const missing = [];
      if (!anyStem(body, family.bodyStems)) missing.push(family.id);
      if (
        family.extraBodyWhenTitle &&
        row.titlu === family.extraBodyWhenTitle.title &&
        !anyStem(body, family.extraBodyWhenTitle.stems)
      ) {
        missing.push(...family.extraBodyWhenTitle.stems);
      }
      if (!missing.length) continue;
      const hit = { id: row.id, family: family.id, titlu: row.titlu, missing };
      if (SOFT_TITLE_BODY_NITS.has(row.id)) nits.push(hit);
      else fails.push(hit);
    }
  }
  return { fails, nits };
}

const rows = loadSeed();
const p4 = FAMILIES.filter((family) => ["cizma", "sosete", "rufe"].includes(family.id));
const all = scan(rows);
const p4Scan = scan(rows, p4);

console.log(`scanned ${rows.length}`);
console.log(`FAIL ${all.fails.length} · NIT ${all.nits.length}`);
console.log(`P4 objects FAIL ${p4Scan.fails.length} · NIT ${p4Scan.nits.length}`);
if (all.fails.length) {
  for (const hit of all.fails) {
    console.log(`FAIL ${hit.id} [${hit.family}] ${hit.titlu} missing=${hit.missing.join(",")}`);
  }
}
if (all.nits.length) {
  for (const hit of all.nits) {
    console.log(`NIT  ${hit.id} [${hit.family}] ${hit.titlu}`);
  }
}

if (p4Scan.fails.length) process.exit(1);
