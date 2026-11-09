import type { SupabaseClient } from "@supabase/supabase-js";
import { themesFromActivityRows } from "@/lib/band-preview";
import {
  getSeedActivities,
  hasLocalSeedBand,
  normalizeActivity,
} from "@/lib/seed/week1";
import type { Activity, SeedActivity } from "@/lib/types";
import { PROGRAM_WEEKS } from "@/lib/week";

export const ACTIVITY_PAGE_SIZE = 1000;

export type CatalogOrigin = "database" | "local" | "unavailable";

export const LOCAL_CATALOG_LABEL = "Catalog local";
export const LOCAL_CATALOG_NOTE =
  "Activitățile vin din copia locală, pentru că baza de date nu a răspuns.";

type PagePayload<T> = {
  data: T[] | null;
  error: { message: string } | null;
};

export function settleCatalog<T>(args: {
  ok: boolean;
  value: T;
  fallback: T;
  canFallback: boolean;
}): { value: T; origin: CatalogOrigin } {
  if (args.ok) return { value: args.value, origin: "database" };
  if (args.canFallback) return { value: args.fallback, origin: "local" };
  return { value: args.fallback, origin: "unavailable" };
}

async function readPages<T>(
  fetchPage: (from: number, to: number) => PromiseLike<PagePayload<T>>,
  pageSize = ACTIVITY_PAGE_SIZE,
): Promise<{ rows: T[]; error: string | null }> {
  const rows: T[] = [];
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await fetchPage(from, from + pageSize - 1);
    if (error) return { rows: [], error: error.message };
    const batch = data ?? [];
    rows.push(...batch);
    if (batch.length < pageSize) return { rows, error: null };
  }
}

function coerceSeedRow(row: SeedActivity): SeedActivity {
  return {
    ...row,
    materiale: row.materiale ?? [],
    pasi: row.pasi ?? [],
    nota: row.nota ?? null,
  };
}

export async function readActivityRows(
  supabase: SupabaseClient,
  band: string,
  week?: number,
  pageSize = ACTIVITY_PAGE_SIZE,
): Promise<{ rows: SeedActivity[]; error: string | null }> {
  return readPages(async (from, to) => {
    const query = supabase.from("activities").select("*").eq("banda", band);
    const filtered = week == null ? query : query.eq("saptamana", week);
    const { data, error } = await filtered
      .order("id", { ascending: true })
      .range(from, to);
    return {
      data: ((data ?? []) as SeedActivity[]).map(coerceSeedRow),
      error,
    };
  }, pageSize);
}

export async function readThemeRows(
  supabase: SupabaseClient,
  band: string,
  pageSize = ACTIVITY_PAGE_SIZE,
): Promise<{
  rows: { saptamana: number; tema_saptamana: string | null }[];
  error: string | null;
}> {
  return readPages(async (from, to) => {
    const { data, error } = await supabase
      .from("activities")
      .select("saptamana, tema_saptamana")
      .eq("banda", band)
      .order("id", { ascending: true })
      .range(from, to);
    return {
      data: (data ?? []) as { saptamana: number; tema_saptamana: string | null }[],
      error,
    };
  }, pageSize);
}

export async function readWeekCatalog(
  supabase: SupabaseClient | null,
  band: string,
  week: number,
): Promise<{ activities: Activity[]; origin: CatalogOrigin }> {
  const fallback = getSeedActivities(week, band);
  const canFallback = hasLocalSeedBand(band) && fallback.length > 0;
  let settled: { value: Activity[]; origin: CatalogOrigin };
  if (!supabase) {
    settled = settleCatalog({ ok: false, value: [], fallback, canFallback });
  } else {
    try {
      const read = await readActivityRows(supabase, band, week);
      settled = read.error
        ? settleCatalog({ ok: false, value: [], fallback, canFallback })
        : settleCatalog({
            ok: true,
            value: read.rows.map(normalizeActivity),
            fallback,
            canFallback,
          });
    } catch {
      settled = settleCatalog({ ok: false, value: [], fallback, canFallback });
    }
  }
  return { activities: settled.value, origin: settled.origin };
}

function seedThemesFor(band: string) {
  return themesFromActivityRows(
    PROGRAM_WEEKS.flatMap((week) => getSeedActivities(week, band)),
  );
}

export async function readPreviewCatalog(
  supabase: SupabaseClient | null,
  band: string,
  week: number,
): Promise<{
  activities: Activity[];
  themes: Partial<Record<number, string>>;
  origin: CatalogOrigin;
}> {
  const themePromise = supabase
    ? readThemeRows(supabase, band)
    : Promise.resolve({
        rows: [] as { saptamana: number; tema_saptamana: string | null }[],
        error: "no-client" as string | null,
      });
  const [weekCatalog, themeRead] = await Promise.all([
    readWeekCatalog(supabase, band, week),
    themePromise,
  ]);

  if (weekCatalog.origin !== "database") {
    return {
      activities: weekCatalog.activities,
      themes: weekCatalog.origin === "local" ? seedThemesFor(band) : {},
      origin: weekCatalog.origin,
    };
  }

  if (!themeRead.error) {
    return {
      activities: weekCatalog.activities,
      themes: themesFromActivityRows(themeRead.rows),
      origin: "database",
    };
  }

  return {
    activities: weekCatalog.activities,
    themes: hasLocalSeedBand(band) ? seedThemesFor(band) : {},
    origin: "database",
  };
}
