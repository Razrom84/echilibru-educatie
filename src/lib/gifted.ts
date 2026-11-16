import type { SupabaseClient } from "@supabase/supabase-js";
import rawCatalog from "../../content/materiale-s1-s4-banda-2-3.json";
import { liveIdForSeed } from "@/lib/catalog-parity";
import { PILLAR_META } from "@/lib/pillars";
import { getSeedActivities } from "@/lib/seed/week1";
import type { Pillar, SeedActivity } from "@/lib/types";
import { getDayName } from "@/lib/week";

export type HomeKind = "diy" | "print" | "3d" | "nu";

export type HomeVariant = {
  id: string;
  tip: HomeKind;
  titlu: string | null;
  pasi: string | null;
  materiale_unelte: string | null;
  cost_estimat: string | null;
  durata: string | null;
  siguranta: string | null;
  link_model: string | null;
  linii: string[];
};

export type CatalogMaterial = {
  id: string;
  banda: "2-3";
  saptamana: number;
  ordine: number;
  nume: string;
  producator: string | null;
  magazin: string | null;
  sursa: string;
  link: string | null;
  pret: string | null;
  moneda: "lei" | null;
  data_verificare: string | null;
  stoc: string | null;
  varsta: string | null;
  nota_siguranta: string | null;
  doar_acasa: boolean;
  folosita: string | null;
  detaliu_pret: string | null;
  note: string[];
  activitati: string[];
  acasa: HomeVariant[];
};

export type WeekMaterials = {
  materials: CatalogMaterial[];
  gratuit: string | null;
};

type CatalogFile = {
  data_verificare: string;
  saptamani: { saptamana: number; tema: string; gratuit: string }[];
  materiale: CatalogMaterial[];
};

const catalog = rawCatalog as CatalogFile;

export const GIFTED_WEEKS = [1, 2, 3, 4] as const;

export const HOME_KIND_LABEL: Record<HomeKind, string> = {
  diy: "Făcut de mână",
  print: "Tipărit acasă",
  "3d": "Imprimare 3D",
  nu: "Nu se face acasă",
};

export function giftedWeek(band: string, week: number): boolean {
  return band === "2-3" && week >= 1 && week <= 4;
}

/** The activity page prints a note only when this is true. */
export function showsActivityNote(nota?: string | null): boolean {
  return Boolean(nota?.trim());
}

/** Steps and notes the activity page may show. Missing text stays hidden. */
export function visibleActivityExtras(activity: {
  pas_in_plus?: string | null;
  provocare?: string | null;
  gata_cand?: string | null;
  siguranta?: string | null;
}) {
  const text = (value?: string | null) => Boolean(value?.trim());
  return {
    pasInPlus: text(activity.pas_in_plus),
    provocare: text(activity.provocare),
    gataCand: text(activity.gata_cand),
    siguranta: text(activity.siguranta),
  };
}

/**
 * When Familie does not have the gifted columns yet, `select *` still
 * succeeds and returns the old S1–S4 rows. Overlay the local catalog on
 * those ids so Preview can show the new text without writing anything.
 * A row that already has `pas_in_plus` is left as the database sent it.
 */
export function applyGiftedCatalog(
  rows: SeedActivity[],
  band: string,
  week: number,
): SeedActivity[] {
  if (!giftedWeek(band, week) || rows.length === 0) return rows;
  const local = new Map(
    getSeedActivities(week, "2-3").map((row) => [
      liveIdForSeed(row.id, "2-3"),
      row,
    ]),
  );
  return rows.map((row) => {
    if (row.pas_in_plus?.trim()) return row;
    const gift = local.get(row.id);
    if (!gift) return row;
    return {
      ...row,
      titlu: gift.titlu,
      durata_min: gift.durata_min,
      materiale: [...gift.materiale],
      pasi: [...gift.pasi],
      gata_cand: gift.gata_cand,
      pas_in_plus: gift.pas_in_plus ?? null,
      provocare: gift.provocare ?? null,
      siguranta: gift.siguranta ?? null,
      nota: null,
    };
  });
}

export function localWeekMaterials(band: string, week: number): WeekMaterials {
  if (!giftedWeek(band, week)) return { materials: [], gratuit: null };
  const meta = catalog.saptamani.find((item) => item.saptamana === week);
  return {
    materials: catalog.materiale
      .filter((item) => item.saptamana === week)
      .slice()
      .sort((a, b) => a.ordine - b.ordine),
    gratuit: meta?.gratuit?.trim() ? meta.gratuit : null,
  };
}

export function allCatalogMaterials(): CatalogMaterial[] {
  return catalog.materiale.slice().sort((a, b) => a.saptamana - b.saptamana || a.ordine - b.ordine);
}

export function materialsForActivity(
  materials: readonly CatalogMaterial[],
  activityId: string,
): CatalogMaterial[] {
  const liveId = activityId.includes("-b23-")
    ? activityId
    : liveIdForSeed(activityId, "2-3");
  return materials.filter((material) =>
    material.activitati.some((id) => id === activityId || id === liveId),
  );
}

export function materialUseLabel(activityId: string): string {
  const match = /z(\d)-([a-z]+)$/.exec(activityId);
  if (!match) return activityId;
  const day = Number(match[1]);
  const pillar = match[2] as Pillar;
  return `${getDayName(day)} · ${PILLAR_META[pillar]?.label ?? pillar}`;
}

export function seenOn(iso: string | null): string | null {
  if (!iso) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!match) return null;
  return `${match[3]}.${match[2]}.${match[1]}`;
}

export function buyCaption(material: CatalogMaterial): string | null {
  if (!material.pret) return null;
  const date = seenOn(material.data_verificare);
  return date ? `${material.pret} · văzut pe ${date}` : material.pret;
}

export function priceAmount(pret: string | null): number {
  if (!pret) return 0;
  const match = /^([\d.]+(?:,\d+)?)/.exec(pret);
  if (!match) return 0;
  return Number(match[1].replace(/\./g, "").replace(",", "."));
}

export function weekBuyTotal(materials: readonly CatalogMaterial[]): number {
  return materials.reduce((sum, material) => sum + priceAmount(material.pret), 0);
}

type DbHome = {
  id: string;
  tip: HomeKind;
  titlu: string | null;
  pasi: string | null;
  materiale_unelte: string | null;
  cost_estimat: string | null;
  durata: string | null;
  siguranta: string | null;
  link_model: string | null;
  text_complet?: string | null;
  linii?: string[];
  ordine?: number;
};
type DbMaterial = Omit<CatalogMaterial, "acasa" | "activitati" | "banda"> & {
  banda: string;
  materiale_acasa?: DbHome[] | null;
  materiale_activitati?: { activity_id: string }[] | null;
};

function mapDbMaterial(row: DbMaterial): CatalogMaterial {
  const homes = (row.materiale_acasa ?? [])
    .slice()
    .sort((a, b) => (a.ordine ?? 0) - (b.ordine ?? 0));
  return {
    id: row.id,
    banda: "2-3",
    saptamana: row.saptamana,
    ordine: row.ordine,
    nume: row.nume,
    producator: row.producator,
    magazin: row.magazin,
    sursa: row.sursa,
    link: row.link,
    pret: row.pret,
    moneda: row.moneda === "lei" ? "lei" : null,
    data_verificare: row.data_verificare,
    stoc: row.stoc,
    varsta: row.varsta,
    nota_siguranta: row.nota_siguranta,
    doar_acasa: row.doar_acasa,
    folosita: row.folosita,
    detaliu_pret: row.detaliu_pret,
    note: row.note ?? [],
    activitati: (row.materiale_activitati ?? []).map((link) => link.activity_id),
    acasa: homes.map((home) => ({
      id: home.id,
      tip: home.tip,
      titlu: home.titlu,
      pasi: home.pasi,
      materiale_unelte: home.materiale_unelte,
      cost_estimat: home.cost_estimat,
      durata: home.durata,
      siguranta: home.siguranta,
      link_model: home.link_model,
      linii: home.linii?.length
        ? home.linii
        : (home.text_complet ?? home.pasi ?? "")
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean),
    })),
  };
}

/**
 * Read the week's materials. If the new tables are not in Familie yet,
 * or the read fails, use the local catalog. This never writes.
 */
export async function readWeekMaterials(
  supabase: SupabaseClient | null,
  band: string,
  week: number,
): Promise<WeekMaterials> {
  const local = localWeekMaterials(band, week);
  if (!supabase || local.materials.length === 0) return local;
  try {
    const { data, error } = await supabase
      .from("materiale")
      .select("*, materiale_acasa(*), materiale_activitati(activity_id)")
      .eq("banda", band)
      .eq("saptamana", week)
      .order("ordine", { ascending: true });
    if (error || !data || data.length === 0) return local;
    const meta = await supabase
      .from("materiale_saptamana")
      .select("gratuit")
      .eq("banda", band)
      .eq("saptamana", week)
      .maybeSingle();
    const gratuit = meta.error
      ? local.gratuit
      : ((meta.data?.gratuit as string | null | undefined)?.trim() || local.gratuit);
    return {
      materials: (data as DbMaterial[]).map(mapDbMaterial),
      gratuit,
    };
  } catch {
    return local;
  }
}
