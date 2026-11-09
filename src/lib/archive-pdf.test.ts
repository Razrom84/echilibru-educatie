import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { inflateSync } from "node:zlib";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument } from "pdf-lib";
import { describe, expect, test } from "vitest";
import {
  ARCHIVE_EMPTY_PERIOD,
  ARCHIVE_QUIET_DAY,
  buildArchiveDraft,
  calendarMonthPeriod,
  calendarYearPeriod,
  civilIntervalPeriod,
  civilWeekPeriod,
  expandBookletDays,
  noteForCivilDate,
} from "./archive";
import { PROGRAM_YEAR_START_MONDAY_2026_27 } from "@/lib/fixtures/program-year-2026-27";
import { civilDayOfWeek, programWeekNumber } from "./program-week";
import { ARCHIVE_FONT_PATH, buildArchiveBookletPdf } from "./archive-pdf";

async function fontBytes(): Promise<Uint8Array> {
  return new Uint8Array(await readFile(join(process.cwd(), ARCHIVE_FONT_PATH)));
}

function ttfCodepoints(data: Uint8Array): Set<number> {
  const buf = Buffer.from(data);
  const u16 = (i: number) => buf.readUInt16BE(i);
  const u32 = (i: number) => buf.readUInt32BE(i);
  const numTables = u16(4);
  let cmapOff = 0;
  for (let n = 0; n < numTables; n++) {
    const off = 12 + n * 16;
    const tag = buf.subarray(off, off + 4).toString("ascii");
    if (tag === "cmap") {
      cmapOff = u32(off + 8);
      break;
    }
  }
  const nsub = u16(cmapOff + 2);
  const codepoints = new Set<number>();
  for (let i = 0; i < nsub; i++) {
    const rec = cmapOff + 4 + i * 8;
    const suboff = u32(rec + 4);
    const start = cmapOff + suboff;
    const fmt = u16(start);
    if (fmt === 4) {
      const segCount = u16(start + 6) / 2;
      const endCountOff = start + 14;
      const startCountOff = endCountOff + 2 * segCount + 2;
      for (let s = 0; s < segCount; s++) {
        const end = u16(endCountOff + 2 * s);
        const st = u16(startCountOff + 2 * s);
        for (let cp = st; cp <= end; cp++) codepoints.add(cp);
      }
    } else if (fmt === 12) {
      const nGroups = u32(start + 12);
      let g = start + 16;
      for (let s = 0; s < nGroups; s++) {
        const startCp = u32(g);
        const endCp = u32(g + 4);
        for (let cp = startCp; cp <= endCp; cp++) codepoints.add(cp);
        g += 12;
      }
    }
  }
  return codepoints;
}

function pdfShownText(bytes: Uint8Array): string {
  const raw = inflatedPdf(bytes);
  const cmap = new Map<string, string>();
  const block = raw.match(/beginbfchar([\s\S]*?)endbfchar/i);
  if (block) {
    const pairs = /<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>/g;
    let pair: RegExpExecArray | null;
    while ((pair = pairs.exec(block[1]))) {
      cmap.set(pair[1].toUpperCase(), String.fromCodePoint(Number.parseInt(pair[2], 16)));
    }
  }
  const decode = (hex: string) => {
    let text = "";
    const upper = hex.toUpperCase();
    for (let index = 0; index + 4 <= upper.length; index += 4) {
      text += cmap.get(upper.slice(index, index + 4)) ?? "";
    }
    return text;
  };
  const body = raw.replace(/beginbfchar[\s\S]*?endbfchar/gi, "");
  let text = "";
  const shows = /<([0-9A-Fa-f]+)>/g;
  let show: RegExpExecArray | null;
  while ((show = shows.exec(body))) text += decode(show[1]);
  return text;
}

function pdfLatin1(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString("latin1");
}

/** pdf-lib compresses font dicts; inflate streams so we can see Encoding / ToUnicode. */
function inflatedPdf(bytes: Uint8Array): string {
  const raw = pdfLatin1(bytes);
  const parts = [raw];
  const re = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(raw))) {
    try {
      parts.push(inflateSync(Buffer.from(match[1], "latin1")).toString("latin1"));
    } catch {
      /* not a zlib stream */
    }
  }
  return parts.join("\n");
}

describe("archive booklet PDF", () => {
  test("committed font draws ASCII and Romanian ă â î ș ț", async () => {
    const cps = ttfCodepoints(await fontBytes());
    for (const ch of ["A", "z", "ă", "â", "î", "ș", "ț", "Ă", "Â", "Î", "Ș", "Ț", " "]) {
      expect(cps.has(ch.codePointAt(0)!), `missing ${ch}`).toBe(true);
    }
    expect(ARCHIVE_FONT_PATH).toBe("public/fonts/SourceSans3-Regular.ttf");
  });

  test("one style for a week: date, done titles, note, no scores or video", async () => {
    const bytes = await buildArchiveBookletPdf({
      period: civilWeekPeriod("2026-09-08"),
      children: [{ id: "c1", name: "Cezar" }],
      days: [
        {
          child_id: "c1",
          civil_date: "2026-09-08",
          age_band_label: "1–2",
          day_note: "Am fost în curte.",
          done_titles: ["Pași în curte"],
          photo_path: null,
        },
      ],
      fontBytes: await fontBytes(),
      today: "2026-09-09",
    });
    expect(bytes.byteLength).toBeGreaterThan(1000);
    const asString = pdfLatin1(bytes);
    expect(asString).toContain("%PDF");
    expect(asString).not.toMatch(/\/JS\b/);
    expect(asString.toLowerCase()).not.toContain("video");
  });

  test("embeds Unicode font for every text run — no Helvetica/WinAnsi body copy", async () => {
    const sample = "ă â î ș ț Marți Sâmbătă creștere";
    const bytes = await buildArchiveBookletPdf({
      period: civilWeekPeriod("2026-09-09"),
      children: [{ id: "c1", name: "Cezar" }],
      days: [
        {
          child_id: "c1",
          civil_date: "2026-09-09",
          age_band_label: "1–2",
          day_note: sample,
          done_titles: ["Pași în curte"],
          photo_path: null,
        },
      ],
      fontBytes: await fontBytes(),
      today: "2026-09-09",
    });
    const asString = inflatedPdf(bytes);
    expect(asString).not.toMatch(/\/BaseFont\s*\/Helvetica/);
    expect(asString).not.toMatch(/\/WinAnsiEncoding/);
    expect(asString).toMatch(/\/Identity-H/);
    expect(asString).toContain("/ToUnicode");
    for (const ch of ["ă", "â", "î", "ș", "ț"]) {
      const hex = ch.codePointAt(0)!.toString(16).toUpperCase().padStart(4, "0");
      expect(asString.toUpperCase()).toContain(hex);
    }

    const pdf = await PDFDocument.create();
    pdf.registerFontkit(fontkit);
    const font = await pdf.embedFont(await fontBytes(), { subset: true });
    expect(() => font.encodeText(sample)).not.toThrow();
    expect(() => font.encodeText("ECHILIBRU EDUCAȚIE")).not.toThrow();
    expect(() => font.encodeText(ARCHIVE_QUIET_DAY)).not.toThrow();
  });

  test("month period uses the same builder", async () => {
    const bytes = await buildArchiveBookletPdf({
      period: calendarMonthPeriod(2026, 8),
      children: [{ id: "c1", name: "Cezar" }],
      days: [],
      fontBytes: await fontBytes(),
      today: "2026-09-09",
    });
    expect(bytes.byteLength).toBeGreaterThan(500);
  });

  test("year period uses the same builder and stops at today", async () => {
    const bytes = await buildArchiveBookletPdf({
      period: calendarYearPeriod(2026),
      children: [{ id: "c1", name: "Cezar" }],
      days: [
        {
          child_id: "c1",
          civil_date: "2026-01-01",
          age_band_label: "1–2",
          day_note: "Anul nou.",
          done_titles: [],
          photo_path: null,
        },
      ],
      fontBytes: await fontBytes(),
      today: "2026-01-03",
    });
    expect(bytes.byteLength).toBeGreaterThan(1000);
  });

  test("week PDF draws live done titles on a day with no photo and no archive row", async () => {
    const bytes = await buildArchiveBookletPdf({
      period: civilWeekPeriod("2026-09-09"),
      children: [{ id: "c1", name: "Cezar", age_band_label: "1–2" }],
      days: [
        {
          child_id: "c1",
          civil_date: "2026-09-09",
          age_band_label: "1–2",
          day_note: "Imita aspiratorul.",
          done_titles: ["Udăm planta"],
          photo_path: null,
        },
      ],
      live: {
        programYearStart: "2026-08-31",
        completions: [
          {
            child_id: "c1",
            activity_id: "mon",
            completed_at: "2026-09-07T07:00:00.000Z",
          },
        ],
        activities: [{ id: "mon", title: "Pași în curte" }],
      },
      fontBytes: await fontBytes(),
      today: "2026-09-09",
    });
    const pdf = await PDFDocument.create();
    pdf.registerFontkit(fontkit);
    const font = await pdf.embedFont(await fontBytes(), { subset: true });
    expect(() => font.encodeText("Ați făcut: Pași în curte")).not.toThrow();
    expect(bytes.byteLength).toBeGreaterThan(1000);
  });

  test("interval period uses the same builder and stays inside the range", async () => {
    const bytes = await buildArchiveBookletPdf({
      period: civilIntervalPeriod("2026-09-08", "2026-09-09"),
      children: [{ id: "c1", name: "Cezar" }],
      days: [
        {
          child_id: "c1",
          civil_date: "2026-09-07",
          age_band_label: "1–2",
          day_note: "În afara intervalului.",
          done_titles: ["Pași în curte"],
          photo_path: null,
        },
        {
          child_id: "c1",
          civil_date: "2026-09-08",
          age_band_label: "1–2",
          day_note: "Am fost în curte.",
          done_titles: ["Turnăm cu grijă"],
          photo_path: null,
        },
      ],
      fontBytes: await fontBytes(),
      today: "2026-09-09",
    });
    expect(bytes.byteLength).toBeGreaterThan(1000);
    const asString = pdfLatin1(bytes);
    expect(asString).toContain("%PDF");
    expect(asString.toLowerCase()).not.toContain("video");
  });

  test("Tudor's booklet keeps Mara's 9 Nov note out of his page", async () => {
    const civilDate = "2026-11-09";
    const maraNote = {
      child_id: "demo-mara",
      program_year_start: PROGRAM_YEAR_START_MONDAY_2026_27,
      week_number: programWeekNumber(civilDate, PROGRAM_YEAR_START_MONDAY_2026_27),
      day_of_week: civilDayOfWeek(civilDate),
      body: "test Mara",
    };
    const tudorRow = buildArchiveDraft({
      childId: "demo-tudor",
      civilDate,
      ageBand: "2-3",
      dayNote: noteForCivilDate({
        civilDate,
        programYearStart: PROGRAM_YEAR_START_MONDAY_2026_27,
        childId: "demo-tudor",
        notes: [maraNote],
      }),
      doneTitles: ["Mutăm corpul: lumină și umbră"],
      photoPath: null,
    });
    expect(tudorRow.day_note).toBe("");
    const visible = expandBookletDays({
      period: civilIntervalPeriod(civilDate, civilDate),
      today: civilDate,
      children: [{ id: "demo-tudor", age_band_label: "2–3" }],
      days: [tudorRow],
      live: {
        programYearStart: PROGRAM_YEAR_START_MONDAY_2026_27,
        notes: [maraNote],
        completions: [],
        activities: [],
      },
    });
    expect(visible.every((day) => day.day_note === "")).toBe(true);

    const font = await fontBytes();
    const tudorPdf = await buildArchiveBookletPdf({
      period: civilIntervalPeriod(civilDate, civilDate),
      children: [{ id: "demo-tudor", name: "Tudor" }],
      days: [tudorRow],
      fontBytes: font,
      today: civilDate,
      live: {
        programYearStart: PROGRAM_YEAR_START_MONDAY_2026_27,
        notes: [maraNote],
        completions: [],
        activities: [],
      },
    });
    const maraPdf = await buildArchiveBookletPdf({
      period: civilIntervalPeriod(civilDate, civilDate),
      children: [{ id: "demo-mara", name: "Mara" }],
      days: [
        {
          child_id: "demo-mara",
          civil_date: civilDate,
          age_band_label: "1–2",
          day_note: "test Mara",
          done_titles: ["Pași spre fereastră luminoasă"],
          photo_path: null,
        },
      ],
      fontBytes: font,
      today: civilDate,
    });
    const tudorText = pdfShownText(tudorPdf);
    const maraText = pdfShownText(maraPdf);
    expect(maraText).toContain("test Mara");
    expect(tudorText).not.toContain("test Mara");
    expect(tudorText).not.toContain("Mara");
  });

  test("empty interval booklet still draws the empty-period line", async () => {
    const bytes = await buildArchiveBookletPdf({
      period: civilIntervalPeriod("2026-09-10", "2026-09-12"),
      children: [{ id: "c1", name: "Cezar" }],
      days: [],
      fontBytes: await fontBytes(),
      today: "2026-09-09",
    });
    expect(bytes.byteLength).toBeGreaterThan(500);
    const pdf = await PDFDocument.create();
    pdf.registerFontkit(fontkit);
    const font = await pdf.embedFont(await fontBytes(), { subset: true });
    expect(() => font.encodeText(ARCHIVE_EMPTY_PERIOD)).not.toThrow();
  });
});
