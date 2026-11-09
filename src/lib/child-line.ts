import { bandLabel } from "@/lib/band-preview";

const MONTHS = [
  "ian.",
  "feb.",
  "mar.",
  "apr.",
  "mai",
  "iun.",
  "iul.",
  "aug.",
  "sep.",
  "oct.",
  "nov.",
  "dec.",
] as const;

/** `2025-06-11` → `11 iun. 2025`. Null when the value is not a civil date. */
export function formatChildBirthdate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!match) return null;
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  return `${day} ${MONTHS[month - 1]} ${match[1]}`;
}

/** `1–2 ani · născut 11 iun. 2025`. Without a date, only the band. */
export function childBandLine(
  ageBand: string,
  birthdate: string | null | undefined,
): string {
  const band = `${bandLabel(ageBand)} ani`;
  const born = formatChildBirthdate(birthdate);
  return born ? `${band} · născut ${born}` : band;
}
