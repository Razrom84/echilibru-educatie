import type { SupabaseClient } from "@supabase/supabase-js";
import rawCatalog23 from "../../content/materiale-s1-s4-banda-2-3.json";
import rawCatalog12 from "../../content/materiale-s13-s14-banda-1-2.json";
import { liveIdForSeed, type CatalogBand } from "@/lib/catalog-parity";
import { PILLAR_META } from "@/lib/pillars";
import { getSeedActivities } from "@/lib/seed/week1";
import { produsCheieForMaterial } from "@/lib/stoc";
import type { Pillar, SeedActivity } from "@/lib/types";
import { getDayName, type LiveAgeBand } from "@/lib/week";

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
  banda: LiveAgeBand;
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
  /** Same product across weeks and bands. Stock is matched on this. */
  produs_cheie?: string | null;
};

export type WeekMaterials = {
  materials: CatalogMaterial[];
  gratuit: string | null;
};

type CatalogFile = {
  data_verificare: string | null;
  saptamani: { saptamana: number; tema: string; gratuit: string }[];
  materiale: CatalogMaterial[];
};

/**
 * Gifted weeks per band, each with its local catalog. Add a band or a week
 * here; nothing else in the code is tied to one band.
 * Band 1–2 material ids start with `b12-` so they never collide with 2–3.
 */
export const GIFTED_CONFIG: Record<CatalogBand, { weeks: readonly number[]; catalog: CatalogFile }> = {
  "2-3": { weeks: [1, 2, 3, 4], catalog: rawCatalog23 as CatalogFile },
  "1-2": { weeks: [13, 14], catalog: rawCatalog12 as unknown as CatalogFile },
};

export const MATERIAL_ID_PREFIX: Record<CatalogBand, string> = { "2-3": "", "1-2": "b12-" };

/** Kept for older callers: the 2–3 gifted weeks. */
export const GIFTED_WEEKS = GIFTED_CONFIG["2-3"].weeks;

function catalogBand(band: string): CatalogBand | null {
  return band === "1-2" || band === "2-3" ? band : null;
}

export const HOME_KIND_LABEL: Record<HomeKind, string> = {
  diy: "Făcut de mână",
  print: "Tipărit acasă",
  "3d": "Imprimare 3D",
  nu: "Nu se face acasă",
};

export function giftedWeek(band: string, week: number): boolean {
  const key = catalogBand(band);
  return key != null && GIFTED_CONFIG[key].weeks.includes(week);
}

/** Shown price. `pret` already carries the currency, so `moneda` is never appended twice. */
export function formatPrice(pret: string | null, moneda?: string | null): string | null {
  const text = pret?.replace(/\s+/g, " ").trim();
  if (!text) return null;
  const currency = moneda?.trim();
  const deduped = text.replace(/\b(lei)(\s+lei\b)+/gi, "$1");
  if (!currency || new RegExp(`\\b${currency}\\b`, "i").test(deduped)) return deduped;
  return `${deduped} ${currency}`;
}

/** The activity page prints a note only when this is true. */
export function showsActivityNote(nota?: string | null): boolean {
  return Boolean(nota?.trim());
}

/** „niciunul” means there is nothing to bring. Anything else is listed. */
export function listedMaterials(materiale: readonly string[]): string[] {
  const items = materiale.map((item) => item.trim()).filter(Boolean);
  if (items.length === 1 && items[0] === "niciunul") return [];
  return items;
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
  const key = catalogBand(band);
  if (!key || !giftedWeek(key, week) || rows.length === 0) return rows;
  const local = new Map(
    getSeedActivities(week, key).map((row) => [liveIdForSeed(row.id, key), row]),
  );
  return rows.map((row) => {
    if (row.pas_in_plus?.trim()) return row;
    const gift = local.get(row.id);
    // Only a seed that is already gifted may replace the live text.
    if (!gift || !gift.pas_in_plus?.trim()) return row;
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
  const key = catalogBand(band);
  if (!key || !giftedWeek(key, week)) return { materials: [], gratuit: null };
  const catalog = GIFTED_CONFIG[key].catalog;
  const meta = catalog.saptamani.find((item) => item.saptamana === week);
  return {
    materials: catalog.materiale
      .filter((item) => item.saptamana === week)
      .slice()
      .sort((a, b) => a.ordine - b.ordine)
      .map(withProdusCheie),
    gratuit: meta?.gratuit?.trim() ? meta.gratuit : null,
  };
}

function withProdusCheie(material: CatalogMaterial): CatalogMaterial {
  if (material.produs_cheie) return material;
  return { ...material, produs_cheie: produsCheieForMaterial(material.banda, material.id) };
}

export function allCatalogMaterials(band: CatalogBand = "2-3"): CatalogMaterial[] {
  return GIFTED_CONFIG[band].catalog.materiale
    .slice()
    .sort((a, b) => a.saptamana - b.saptamana || a.ordine - b.ordine)
    .map(withProdusCheie);
}

export function materialsForActivity(
  materials: readonly CatalogMaterial[],
  activityId: string,
): CatalogMaterial[] {
  return materials.filter((material) => {
    const liveId = activityId.includes("-b23-")
      ? activityId
      : liveIdForSeed(activityId, catalogBand(material.banda) ?? "2-3");
    return material.activitati.some((id) => id === activityId || id === liveId);
  });
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

/** Subtitle under a material name. The source line is shown whole, parentheses included. */
export function materialSubtitle(sursa: string): string {
  return sursa;
}

export function buyCaption(material: CatalogMaterial): string | null {
  const price = formatPrice(material.pret, material.moneda);
  if (!price) return null;
  const date = seenOn(material.data_verificare);
  return date ? `${price} · văzut pe ${date}` : price;
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
  produs_cheie?: string | null;
  materiale_acasa?: DbHome[] | null;
  materiale_activitati?: { activity_id: string }[] | null;
};

export function mapDbMaterial(row: DbMaterial): CatalogMaterial {
  const homes = (row.materiale_acasa ?? [])
    .slice()
    .sort((a, b) => (a.ordine ?? 0) - (b.ordine ?? 0));
  return {
    id: row.id,
    banda: (catalogBand(row.banda) ?? "2-3") as LiveAgeBand,
    produs_cheie:
      row.produs_cheie?.trim() || produsCheieForMaterial(row.banda, row.id),
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
  // Only gifted weeks have materials. A missing local catalog no longer
  // stops the read: Familie may already have the rows for this band.
  if (!supabase || !giftedWeek(band, week)) return local;
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
