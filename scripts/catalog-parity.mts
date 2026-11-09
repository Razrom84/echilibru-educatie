/**
 * Compară titlul și textul fiecărei activități din copia locală
 * cu rândul din baza de date. Nu scrie nimic și nu corectează diferențele.
 *
 *   npm run catalog:parity
 *   npm run catalog:parity -- --summary
 *
 * Citește NEXT_PUBLIC_SUPABASE_URL și NEXT_PUBLIC_SUPABASE_ANON_KEY
 * din mediu sau din .env.local. Cheia anon are doar SELECT pe activities.
 */
import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  compareCatalog,
  formatParityReport,
  type CatalogBand,
  type CatalogRow,
} from "../src/lib/catalog-parity.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const PAGE = 1000;

function loadEnvFile(file: string) {
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] == null || process.env[key] === "") {
      process.env[key] = value;
    }
  }
}

function loadSeed(band: CatalogBand): CatalogRow[] {
  const suffix = band === "1-2" ? "-banda-1-2.json" : "-banda-2-3-v2.json";
  const dir = join(root, "content");
  return readdirSync(dir)
    .filter((name) => name.startsWith("seed-") && name.endsWith(suffix))
    .sort()
    .flatMap((name) => {
      const json = JSON.parse(readFileSync(join(dir, name), "utf8")) as {
        activitati?: CatalogRow[];
      };
      return json.activitati ?? [];
    });
}

async function loadLive(url: string, anonKey: string): Promise<CatalogRow[]> {
  const supabase = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const rows: CatalogRow[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from("activities")
      .select("id, banda, titlu, pasi")
      .order("id", { ascending: true })
      .range(from, from + PAGE - 1);
    if (error) {
      throw new Error(error.message);
    }
    const batch = (data ?? []) as (CatalogRow & { banda: string })[];
    rows.push(...batch);
    if (batch.length < PAGE) return rows;
  }
}

function configured(): { url: string; anonKey: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";
  if (!url || !anonKey || url.includes("YOUR_PROJECT") || anonKey.includes("YOUR_ANON")) {
    return null;
  }
  return { url, anonKey };
}

async function main() {
  loadEnvFile(join(root, ".env.local"));
  loadEnvFile(join(root, ".env"));
  const summaryOnly = process.argv.includes("--summary");
  const env = configured();
  if (!env) {
    console.log(
      "Nu am găsit adresa și cheia publică ale bazei (NEXT_PUBLIC_SUPABASE_URL și NEXT_PUBLIC_SUPABASE_ANON_KEY). Raportul a fost sărit.",
    );
    return;
  }

  const live = await loadLive(env.url, env.anonKey);
  const bands: CatalogBand[] = ["1-2", "2-3"];
  const reports = bands.map((band) =>
    compareCatalog(
      band,
      loadSeed(band),
      live.filter((row) => (row as { banda?: string }).banda === band),
    ),
  );
  const text = formatParityReport(reports);
  if (summaryOnly) {
    const cutoff = text.indexOf("Diferențe:");
    console.log(cutoff === -1 ? text : text.slice(0, cutoff).trimEnd());
    return;
  }
  console.log(text);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Citirea a eșuat.";
  console.error(`Nu am putut citi activitățile din baza de date: ${message}`);
  process.exitCode = 1;
});
