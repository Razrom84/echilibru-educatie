/** Seed ↔ live id map and title/text comparison. Read-only: never writes. */

export type CatalogBand = "1-2" | "2-3";

export type CatalogRow = {
  id: string;
  titlu: string;
  pasi: readonly string[] | null | undefined;
};

export type CatalogFieldDiff = {
  kind: "titlu" | "text";
  band: CatalogBand;
  seedId: string;
  liveId: string;
  seed: string;
  live: string;
};

export type CatalogMissingDiff = {
  kind: "lipsa-in-baza" | "lipsa-in-copie";
  band: CatalogBand;
  seedId: string;
  liveId: string;
};

export type CatalogDiff = CatalogFieldDiff | CatalogMissingDiff;

export type CatalogParityReport = {
  band: CatalogBand;
  seedCount: number;
  liveCount: number;
  titleDiffs: number;
  textDiffs: number;
  missingInDb: number;
  missingInSeed: number;
  diffs: CatalogDiff[];
};

/**
 * Band 1–2 keeps the seed id (`sN-2-3-…`) in the database.
 * Band 2–3 was remapped so the two catalogs do not collide: `sN-b23-…`.
 */
export function liveIdForSeed(seedId: string, band: CatalogBand): string {
  if (band === "2-3") return seedId.replace("-2-3-", "-b23-");
  return seedId;
}

export function seedIdForLive(liveId: string, band: CatalogBand): string {
  if (band === "2-3") return liveId.replace("-b23-", "-2-3-");
  return liveId;
}

/** Activity text: one trimmed step per line. This is the body we compare. */
export function activityText(pasi: readonly string[] | null | undefined): string {
  return (pasi ?? []).map((step) => String(step).trim()).join("\n");
}

export function compareCatalog(
  band: CatalogBand,
  seedRows: readonly CatalogRow[],
  liveRows: readonly CatalogRow[],
): CatalogParityReport {
  const liveById = new Map<string, CatalogRow>();
  for (const row of liveRows) {
    if (!liveById.has(row.id)) liveById.set(row.id, row);
  }

  const seenLive = new Set<string>();
  const diffs: CatalogDiff[] = [];
  let titleDiffs = 0;
  let textDiffs = 0;
  let missingInDb = 0;

  for (const seed of seedRows) {
    const liveId = liveIdForSeed(seed.id, band);
    const live = liveById.get(liveId);
    if (!live) {
      missingInDb += 1;
      diffs.push({
        kind: "lipsa-in-baza",
        band,
        seedId: seed.id,
        liveId,
      });
      continue;
    }
    seenLive.add(liveId);
    const seedTitle = seed.titlu.trim();
    const liveTitle = live.titlu.trim();
    if (seedTitle !== liveTitle) {
      titleDiffs += 1;
      diffs.push({
        kind: "titlu",
        band,
        seedId: seed.id,
        liveId,
        seed: seedTitle,
        live: liveTitle,
      });
    }
    const seedBody = activityText(seed.pasi);
    const liveBody = activityText(live.pasi);
    if (seedBody !== liveBody) {
      textDiffs += 1;
      diffs.push({
        kind: "text",
        band,
        seedId: seed.id,
        liveId,
        seed: seedBody,
        live: liveBody,
      });
    }
  }

  let missingInSeed = 0;
  for (const live of liveById.values()) {
    if (seenLive.has(live.id)) continue;
    missingInSeed += 1;
    diffs.push({
      kind: "lipsa-in-copie",
      band,
      seedId: seedIdForLive(live.id, band),
      liveId: live.id,
    });
  }

  return {
    band,
    seedCount: seedRows.length,
    liveCount: liveRows.length,
    titleDiffs,
    textDiffs,
    missingInDb,
    missingInSeed,
    diffs,
  };
}

const BAND_LABEL: Record<CatalogBand, string> = {
  "1-2": "1–2",
  "2-3": "2–3",
};

function fieldLabel(kind: CatalogFieldDiff["kind"]): string {
  return kind === "titlu" ? "TITLU" : "TEXT";
}

export function formatParityReport(reports: readonly CatalogParityReport[]): string {
  const lines: string[] = [
    "Compară copia locală cu baza de date (titlu și textul pașilor). Nu modifică nimic.",
    "",
  ];
  let titleTotal = 0;
  let textTotal = 0;
  for (const report of reports) {
    titleTotal += report.titleDiffs;
    textTotal += report.textDiffs;
    const label = BAND_LABEL[report.band];
    lines.push(`Bandă ${label}`);
    lines.push(`  copie locală: ${report.seedCount}`);
    lines.push(`  bază de date: ${report.liveCount}`);
    lines.push(`  titluri diferite: ${report.titleDiffs}`);
    lines.push(`  texte diferite: ${report.textDiffs}`);
    lines.push(`  lipsă în bază: ${report.missingInDb}`);
    lines.push(`  lipsă în copie: ${report.missingInSeed}`);
    lines.push("");
  }
  lines.push(`Total titluri diferite: ${titleTotal}`);
  lines.push(`Total texte diferite: ${textTotal}`);
  lines.push("");
  lines.push("Diferențe:");
  for (const report of reports) {
    for (const diff of report.diffs) {
      const label = BAND_LABEL[diff.band];
      if (diff.kind === "lipsa-in-baza") {
        lines.push(`LIPSĂ ÎN BAZĂ  ${label}  ${diff.seedId}  →  ${diff.liveId}`);
        continue;
      }
      if (diff.kind === "lipsa-in-copie") {
        lines.push(`LIPSĂ ÎN COPIE  ${label}  ${diff.liveId}`);
        continue;
      }
      if (diff.kind !== "titlu" && diff.kind !== "text") continue;
      const idNote =
        diff.seedId === diff.liveId ? diff.seedId : `${diff.seedId}  →  ${diff.liveId}`;
      lines.push(`${fieldLabel(diff.kind)}  ${label}  ${idNote}`);
      lines.push(`  copie: ${oneLine(diff.seed)}`);
      lines.push(`  bază:  ${oneLine(diff.live)}`);
    }
  }
  if (titleTotal === 0 && textTotal === 0 && reports.every((report) => report.missingInDb === 0 && report.missingInSeed === 0)) {
    lines.push("(nicio diferență)");
  }
  return `${lines.join("\n")}\n`;
}

function oneLine(value: string): string {
  return value.replaceAll("\n", " / ");
}
