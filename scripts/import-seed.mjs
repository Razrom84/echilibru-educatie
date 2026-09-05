#!/usr/bin/env node
/**
 * Reads content/seed-s1-banda-2-3.json and prints UPSERT SQL for activities.
 * Usage: node scripts/import-seed.mjs > /tmp/seed.sql
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const seed = JSON.parse(
  readFileSync(join(root, "content/seed-s1-banda-2-3.json"), "utf8"),
);

function lit(value) {
  if (value === null || value === undefined) return "null";
  return `'${String(value).replaceAll("'", "''")}'`;
}

function textArray(values) {
  if (!values?.length) return "'{}'::text[]";
  return `ARRAY[${values.map(lit).join(", ")}]::text[]`;
}

const rows = seed.activitati.map((row) => {
  return `(
    ${lit(row.id)},
    ${lit(row.banda)},
    ${row.saptamana},
    ${row.zi},
    ${lit(row.pilon)}::public.pillar,
    ${lit(row.titlu)},
    ${row.durata_min},
    ${lit(row.mod_default)}::public.completion_mode,
    ${textArray(row.materiale)},
    ${textArray(row.pasi)},
    ${lit(row.gata_cand)},
    ${lit(row.nota ?? null)},
    ${lit(row.tema_saptamana)}
  )`;
});

const sql = `insert into public.activities (
  id, banda, saptamana, zi, pilon, titlu, durata_min, mod_default,
  materiale, pasi, gata_cand, nota, tema_saptamana
) values
${rows.join(",\n")}
on conflict (id) do update set
  banda = excluded.banda,
  saptamana = excluded.saptamana,
  zi = excluded.zi,
  pilon = excluded.pilon,
  titlu = excluded.titlu,
  durata_min = excluded.durata_min,
  mod_default = excluded.mod_default,
  materiale = excluded.materiale,
  pasi = excluded.pasi,
  gata_cand = excluded.gata_cand,
  nota = excluded.nota,
  tema_saptamana = excluded.tema_saptamana;
`;

process.stdout.write(sql);
