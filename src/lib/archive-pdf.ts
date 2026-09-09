/**
 * One PDF style for week / month / year booklets.
 * Date, what you did, the day's note, photo thumbnail. No scores, no video.
 */

import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, rgb, type PDFFont, type PDFImage, type PDFPage } from "pdf-lib";
import {
  ARCHIVE_EMPTY_PERIOD,
  ARCHIVE_HEADING,
  archiveDayHasContent,
  type ArchivePeriod,
} from "@/lib/archive";
import { formatRoLongDate } from "@/lib/monday-digest";
import { getDayName } from "@/lib/week";
import { civilDayOfWeek } from "@/lib/program-week";

export type ArchivePdfChild = {
  id: string;
  name: string;
};

export type ArchivePdfDay = {
  child_id: string;
  civil_date: string;
  age_band_label: string;
  day_note: string;
  done_titles: string[];
  photo_path: string | null;
};

export type ArchivePdfPhoto = {
  bytes: Uint8Array;
  mime?: string;
};

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 48;
const THUMB = 118;
const INK = rgb(74 / 255, 61 / 255, 50 / 255);
const GREEN = rgb(61 / 255, 90 / 255, 69 / 255);
const MUTED = rgb(122 / 255, 109 / 255, 94 / 255);
const RULE = rgb(230 / 255, 220 / 255, 200 / 255);
const FONT_PATH = "public/fonts/SourceSans3-LatinExt-Regular.ttf";

let cachedFontBytes: Uint8Array | null = null;

export async function loadArchiveFontBytes(): Promise<Uint8Array> {
  if (cachedFontBytes) return cachedFontBytes;
  if (typeof window === "undefined") {
    const { readFile } = await import("node:fs/promises");
    const { join } = await import("node:path");
    cachedFontBytes = new Uint8Array(await readFile(join(process.cwd(), FONT_PATH)));
    return cachedFontBytes;
  }
  const response = await fetch("/fonts/SourceSans3-LatinExt-Regular.ttf");
  if (!response.ok) throw new Error("Nu am putut încărca fontul pentru PDF.");
  cachedFontBytes = new Uint8Array(await response.arrayBuffer());
  return cachedFontBytes;
}

function wrapText(
  font: PDFFont,
  text: string,
  size: number,
  maxWidth: number,
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) <= maxWidth) {
      current = next;
      continue;
    }
    if (current) lines.push(current);
    current = word;
  }
  if (current) lines.push(current);
  return lines.length > 0 ? lines : [""];
}

async function embedPhoto(
  pdf: PDFDocument,
  bytes: Uint8Array,
): Promise<PDFImage | null> {
  try {
    return await pdf.embedJpg(bytes);
  } catch {
    try {
      return await pdf.embedPng(bytes);
    } catch {
      return null;
    }
  }
}

type Layout = {
  page: PDFPage;
  y: number;
  font: PDFFont;
  boldish: PDFFont;
};

function newPage(pdf: PDFDocument, font: PDFFont): Layout {
  const page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  return { page, y: PAGE_HEIGHT - MARGIN, font, boldish: font };
}

function ensureSpace(pdf: PDFDocument, layout: Layout, need: number): Layout {
  if (layout.y - need >= MARGIN) return layout;
  return newPage(pdf, layout.font);
}

function drawCover(
  layout: Layout,
  args: {
    period: ArchivePeriod;
    children: readonly ArchivePdfChild[];
  },
): Layout {
  const { page, font } = layout;
  page.drawText("ECHILIBRU EDUCAȚIE", {
    x: MARGIN,
    y: layout.y,
    size: 10,
    font,
    color: MUTED,
  });
  layout.y -= 28;
  page.drawText(ARCHIVE_HEADING, {
    x: MARGIN,
    y: layout.y,
    size: 26,
    font,
    color: GREEN,
  });
  layout.y -= 28;
  const who =
    args.children.length === 1
      ? args.children[0]!.name
      : args.children.map((child) => child.name).join(" · ");
  if (who) {
    page.drawText(who, {
      x: MARGIN,
      y: layout.y,
      size: 16,
      font,
      color: INK,
    });
    layout.y -= 22;
  }
  page.drawText(args.period.label, {
    x: MARGIN,
    y: layout.y,
    size: 13,
    font,
    color: MUTED,
  });
  layout.y -= 16;
  page.drawLine({
    start: { x: MARGIN, y: layout.y },
    end: { x: PAGE_WIDTH - MARGIN, y: layout.y },
    thickness: 1,
    color: RULE,
  });
  layout.y -= 24;
  return layout;
}

function dayBlockHeight(
  font: PDFFont,
  day: ArchivePdfDay,
  textWidth: number,
  hasPhoto: boolean,
): number {
  const done = day.done_titles.filter((title) => title.trim());
  const note = day.day_note.trim();
  let lines = 2;
  if (done.length > 0) {
    lines += wrapText(font, `Ați făcut: ${done.join("; ")}`, 11, textWidth).length;
  }
  if (note) {
    lines += wrapText(font, `Notă: ${note}`, 11, textWidth).length;
  }
  const textH = lines * 14 + 12;
  return Math.max(hasPhoto ? THUMB + 16 : 56, textH);
}

function drawDay(
  pdf: PDFDocument,
  layout: Layout,
  day: ArchivePdfDay,
  photo: PDFImage | null,
  showChild: string | null,
): Layout {
  const textX = photo ? MARGIN + THUMB + 16 : MARGIN;
  const textWidth = PAGE_WIDTH - MARGIN - textX;
  const height = dayBlockHeight(layout.font, day, textWidth, Boolean(photo));
  layout = ensureSpace(pdf, layout, height + 8);
  const { page, font } = layout;
  const top = layout.y;

  if (photo) {
    const scale = Math.min(THUMB / photo.width, THUMB / photo.height);
    const w = photo.width * scale;
    const h = photo.height * scale;
    page.drawImage(photo, {
      x: MARGIN,
      y: top - h,
      width: w,
      height: h,
    });
  }

  let ty = top - 12;
  const weekday = getDayName(civilDayOfWeek(day.civil_date));
  const heading = `${weekday}, ${formatRoLongDate(day.civil_date)}`;
  page.drawText(heading, {
    x: textX,
    y: ty,
    size: 13,
    font,
    color: GREEN,
  });
  ty -= 16;
  const meta = [day.age_band_label ? `Banda ${day.age_band_label} ani` : "", showChild]
    .filter(Boolean)
    .join(" · ");
  if (meta) {
    page.drawText(meta, {
      x: textX,
      y: ty,
      size: 10,
      font,
      color: MUTED,
    });
    ty -= 14;
  }
  const done = day.done_titles.filter((title) => title.trim());
  if (done.length > 0) {
    for (const line of wrapText(font, `Ați făcut: ${done.join("; ")}`, 11, textWidth)) {
      page.drawText(line, { x: textX, y: ty, size: 11, font, color: INK });
      ty -= 14;
    }
  }
  const note = day.day_note.trim();
  if (note) {
    for (const line of wrapText(font, `Notă: ${note}`, 11, textWidth)) {
      page.drawText(line, { x: textX, y: ty, size: 11, font, color: INK });
      ty -= 14;
    }
  }

  layout.y = top - height;
  page.drawLine({
    start: { x: MARGIN, y: layout.y + 8 },
    end: { x: PAGE_WIDTH - MARGIN, y: layout.y + 8 },
    thickness: 0.5,
    color: RULE,
  });
  layout.y -= 4;
  return layout;
}

export async function buildArchiveBookletPdf(args: {
  period: ArchivePeriod;
  children: readonly ArchivePdfChild[];
  days: readonly ArchivePdfDay[];
  photos?: ReadonlyMap<string, ArchivePdfPhoto>;
  fontBytes?: Uint8Array;
}): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  const fontBytes = args.fontBytes ?? (await loadArchiveFontBytes());
  const font = await pdf.embedFont(fontBytes, { subset: true });
  let layout = newPage(pdf, font);
  layout = drawCover(layout, { period: args.period, children: args.children });

  const visible = args.days
    .filter((day) => archiveDayHasContent(day))
    .sort((a, b) => a.civil_date.localeCompare(b.civil_date) || a.child_id.localeCompare(b.child_id));

  if (visible.length === 0) {
    layout.page.drawText(ARCHIVE_EMPTY_PERIOD, {
      x: MARGIN,
      y: layout.y,
      size: 12,
      font,
      color: INK,
    });
  } else {
    const showChild = args.children.length > 1;
    const childName = new Map(args.children.map((child) => [child.id, child.name]));
    for (const day of visible) {
      const raw = day.photo_path ? args.photos?.get(day.photo_path) : undefined;
      const image = raw ? await embedPhoto(pdf, raw.bytes) : null;
      layout = drawDay(
        pdf,
        layout,
        day,
        image,
        showChild ? (childName.get(day.child_id) ?? null) : null,
      );
    }
  }

  pdf.setTitle(`${ARCHIVE_HEADING} · ${args.period.label}`);
  pdf.setAuthor("Echilibru educație");
  pdf.setLanguage("ro");
  return pdf.save();
}

export function pdfDownloadFilename(period: ArchivePeriod): string {
  return period.filename;
}
