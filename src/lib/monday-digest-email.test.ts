import { describe, expect, test } from "vitest";
import { PROGRAM_YEAR_START_MONDAY_2026_27 } from "@/lib/fixtures/program-year-2026-27";
import { WEEK_THEMES } from "@/lib/week";
import { renderDigestEmail } from "./monday-digest-email";
import {
  DIGEST_ANUL_URL,
  DIGEST_AZI_URL,
  MONTHLY_CTA_ANUL,
  MONTHLY_CTA_AZI,
  WEEKLY_CTA_LABEL,
  buildMonthlyDigest,
  buildWeeklyDigest,
} from "./monday-digest";

describe("digest email bodies", () => {
  test("weekly includes theme, progress, notes, and Azi CTA", () => {
    const email = renderDigestEmail(
      buildWeeklyDigest({
        week: 1,
        programYearStart: PROGRAM_YEAR_START_MONDAY_2026_27,
        start: "2026-08-31",
        end: "2026-09-06",
        children: [{ childId: "c1", childName: "Ana", done: 8, total: 28 }],
        notes: [
          { week: 1, dayOfWeek: 1, dayName: "Luni", body: "Am fost în curte." },
        ],
      }),
    );
    expect(email.subject).toBe(
      `Săptămâna trecută · ${WEEK_THEMES[1]} — Echilibru educație`,
    );
    expect(email.text).toContain("Săptămâna trecută s-a închis");
    expect(email.text).toContain("S1 ·");
    expect(email.text).toContain("8 din 28 activități.");
    expect(email.text).toContain("Luni — Am fost în curte.");
    expect(email.text).toContain(DIGEST_AZI_URL);
    expect(email.text).not.toContain(DIGEST_ANUL_URL);
    expect(email.html).toContain(WEEKLY_CTA_LABEL);
    expect(email.html).toContain(DIGEST_AZI_URL);
    expect(email.html).toContain("Am fost în curte.");
  });

  test("monthly includes themes, both CTAs, and escapes HTML in notes", () => {
    const email = renderDigestEmail(
      buildMonthlyDigest({
        year: 2026,
        month: 8,
        themes: [
          {
            week: 1,
            theme: WEEK_THEMES[1],
            season: "Toamnă",
            start: "2026-08-31",
            end: "2026-09-06",
          },
        ],
        children: [{ childId: "c1", childName: "Ana", done: 3, total: 28 }],
        notes: [
          {
            week: 1,
            dayOfWeek: 2,
            dayName: "Marți",
            body: 'Am zis <b>salut</b> & "pa".',
          },
        ],
      }),
    );
    expect(email.subject).toBe("Luna trecută · august 2026 — Echilibru educație");
    expect(email.text).toContain(`Toamnă · S1 ${WEEK_THEMES[1]}`);
    expect(email.text).toContain("3 activități bifate.");
    expect(email.text).toContain(DIGEST_ANUL_URL);
    expect(email.text).toContain(DIGEST_AZI_URL);
    expect(email.html).toContain(MONTHLY_CTA_ANUL);
    expect(email.html).toContain(MONTHLY_CTA_AZI);
    expect(email.html).toContain("&lt;b&gt;salut&lt;/b&gt;");
    expect(email.html).toContain("&amp;");
    expect(email.html).not.toContain("<b>salut</b>");
  });
});
