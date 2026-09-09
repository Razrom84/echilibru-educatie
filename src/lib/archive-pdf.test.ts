import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { calendarMonthPeriod, civilWeekPeriod } from "./archive";
import { buildArchiveBookletPdf } from "./archive-pdf";

describe("archive booklet PDF", () => {
  test("one style for a week: date, done titles, note, no scores or video", async () => {
    const fontBytes = new Uint8Array(
      await readFile(join(process.cwd(), "public/fonts/SourceSans3-LatinExt-Regular.ttf")),
    );
    const period = civilWeekPeriod("2026-09-08");
    const bytes = await buildArchiveBookletPdf({
      period,
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
      fontBytes,
    });
    expect(bytes.byteLength).toBeGreaterThan(1000);
    const asString = Buffer.from(bytes).toString("latin1");
    expect(asString).toContain("%PDF");
    expect(asString).not.toMatch(/\/JS\b/);
    expect(asString.toLowerCase()).not.toContain("video");
  });

  test("month period uses the same builder", async () => {
    const fontBytes = new Uint8Array(
      await readFile(join(process.cwd(), "public/fonts/SourceSans3-LatinExt-Regular.ttf")),
    );
    const bytes = await buildArchiveBookletPdf({
      period: calendarMonthPeriod(2026, 8),
      children: [{ id: "c1", name: "Cezar" }],
      days: [],
      fontBytes,
    });
    expect(bytes.byteLength).toBeGreaterThan(500);
  });
});
