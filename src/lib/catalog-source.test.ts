import type { SupabaseClient } from "@supabase/supabase-js";
import { describe, expect, test } from "vitest";
import {
  LOCAL_CATALOG_LABEL,
  LOCAL_CATALOG_NOTE,
  readActivityRows,
  readPreviewCatalog,
  readWeekCatalog,
  settleCatalog,
} from "./catalog-source";

const CEDILLA = /[şţŞŢ]/;

function fakeSupabase(options: {
  activities?: { data: unknown[] | null; error?: { message: string } | null };
  themes?: { data: unknown[] | null; error?: { message: string } | null };
  pages?: unknown[][];
}): SupabaseClient {
  let activityPage = 0;
  return {
    from() {
      return {
        select(columns: string) {
          const builder = {
            eq() {
              return builder;
            },
            order() {
              return builder;
            },
            range: async () => {
              if (columns === "*") {
                if (options.pages) {
                  const data = options.pages[activityPage] ?? [];
                  activityPage += 1;
                  return { data, error: null };
                }
                return {
                  data: options.activities?.data ?? [],
                  error: options.activities?.error ?? null,
                };
              }
              return {
                data: options.themes?.data ?? [],
                error: options.themes?.error ?? null,
              };
            },
          };
          return builder;
        },
      };
    },
  } as unknown as SupabaseClient;
}

const dbRow = {
  id: "s11-2-3-z1-fizic",
  banda: "1-2",
  saptamana: 11,
  zi: 1,
  pilon: "fizic",
  titlu: "Pași spre fereastră luminoasă",
  durata_min: 5,
  mod_default: "A",
  materiale: [],
  pasi: ["Mergeți împreună până la fereastră."],
  gata_cand: "A ajuns la fereastră.",
  nota: null,
  tema_saptamana: "Lumină și umbră",
};

describe("activity catalog source", () => {
  test("the offline banner is short Romanian with comma diacritics", () => {
    expect(LOCAL_CATALOG_LABEL).toBe("Catalog local");
    expect(LOCAL_CATALOG_NOTE).toBe(
      "Activitățile vin din copia locală, pentru că baza de date nu a răspuns.",
    );
    expect(LOCAL_CATALOG_NOTE).not.toMatch(CEDILLA);
    expect(LOCAL_CATALOG_LABEL).not.toMatch(CEDILLA);
  });

  test("a failed read keeps the local copy; a successful one keeps the database rows", () => {
    const local = settleCatalog({
      ok: false,
      value: [],
      fallback: ["copie"],
      canFallback: true,
    });
    expect(local).toEqual({ value: ["copie"], origin: "local" });

    const remote = settleCatalog({
      ok: true,
      value: ["bază"],
      fallback: ["copie"],
      canFallback: true,
    });
    expect(remote.origin).toBe("database");
    expect(remote.value).toEqual(["bază"]);

    const emptyBand = settleCatalog({
      ok: false,
      value: [],
      fallback: [],
      canFallback: false,
    });
    expect(emptyBand.origin).toBe("unavailable");
  });

  test("without a client, bands 1–2 and 2–3 fall back to the local copy", async () => {
    const band12 = await readWeekCatalog(null, "1-2", 11);
    expect(band12.origin).toBe("local");
    expect(band12.activities.find((row) => row.id === "s11-2-3-z1-fizic")?.titlu).toBe(
      "Pași până la lumină",
    );

    const band23 = await readWeekCatalog(null, "2-3", 11);
    expect(band23.origin).toBe("local");
    expect(band23.activities.every((row) => row.id.includes("-2-3-"))).toBe(true);
    expect(band23.activities.some((row) => row.id.includes("-b23-"))).toBe(false);

    const later = await readWeekCatalog(null, "6-7", 11);
    expect(later.origin).toBe("unavailable");
    expect(later.activities).toEqual([]);
  });

  test("a database row replaces the local title", async () => {
    const catalog = await readWeekCatalog(
      fakeSupabase({ activities: { data: [dbRow] } }),
      "1-2",
      11,
    );
    expect(catalog.origin).toBe("database");
    expect(catalog.activities).toHaveLength(1);
    expect(catalog.activities[0]?.title).toBe("Pași spre fereastră luminoasă");
    expect(catalog.activities[0]?.title).not.toBe("Pași până la lumină");
  });

  test("a database error falls back to the local copy", async () => {
    const catalog = await readWeekCatalog(
      fakeSupabase({
        activities: { data: null, error: { message: "rețea" } },
      }),
      "1-2",
      11,
    );
    expect(catalog.origin).toBe("local");
    expect(catalog.activities.find((row) => row.id === "s11-2-3-z1-fizic")?.titlu).toBe(
      "Pași până la lumină",
    );
  });

  test("preview reads the database week and themes, including a second page", async () => {
    const preview = await readPreviewCatalog(
      fakeSupabase({
        activities: { data: [dbRow] },
        themes: {
          data: [
            { saptamana: 11, tema_saptamana: "Lumină din bază" },
            { saptamana: 12, tema_saptamana: "Cald și rece" },
          ],
        },
      }),
      "1-2",
      11,
    );
    expect(preview.origin).toBe("database");
    expect(preview.activities[0]?.titlu).toBe("Pași spre fereastră luminoasă");
    expect(preview.themes[11]).toBe("Lumină din bază");
    expect(preview.themes[12]).toBe("Cald și rece");

    const paged = await readActivityRows(
      fakeSupabase({
        pages: [
          [
            { ...dbRow, id: "s11-2-3-z1-fizic" },
            { ...dbRow, id: "s11-2-3-z1-mental" },
          ],
          [{ ...dbRow, id: "s11-2-3-z1-social" }],
        ],
      }),
      "1-2",
      11,
      2,
    );
    expect(paged.error).toBeNull();
    expect(paged.rows.map((row) => row.id)).toEqual([
      "s11-2-3-z1-fizic",
      "s11-2-3-z1-mental",
      "s11-2-3-z1-social",
    ]);
  });

  test("preview falls back together when the week read fails", async () => {
    const preview = await readPreviewCatalog(null, "2-3", 32);
    expect(preview.origin).toBe("local");
    expect(preview.activities).toHaveLength(28);
    expect(preview.activities[0]?.id).toContain("-2-3-");
    expect(preview.themes[32]).toBeTruthy();
  });
});
