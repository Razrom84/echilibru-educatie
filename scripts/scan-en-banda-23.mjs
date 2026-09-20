#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const files = [
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
];
const tokens = JSON.parse(
  readFileSync(resolve(root, "content/en-banda-23-scan-tokens.json"), "utf8"),
).tokens.sort((a, b) => b.length - a.length || a.localeCompare(b));

let fails = 0;
for (const file of files) {
  const seed = JSON.parse(readFileSync(resolve(root, file), "utf8"));
  for (const row of seed.activitati) {
    const blob = [
      row.titlu,
      ...(row.materiale ?? []),
      ...(row.pasi ?? []),
      row.gata_cand,
      row.tema_saptamana,
    ].join("\n");
    const hits = tokens.filter((tok) => {
      const escaped = tok.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return new RegExp(`(?<![\\p{L}])${escaped}(?![\\p{L}])`, "iu").test(blob);
    });
    if (hits.length) {
      fails += 1;
      console.error(`${row.id} ${hits.join(",")}  ${row.titlu}`);
    }
  }
}
if (fails) {
  console.error(`EN FAIL: ${fails}`);
  process.exit(1);
}
console.log("EN FAIL: 0");
