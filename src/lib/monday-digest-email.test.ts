import { describe, expect, test } from "vitest";
import { PROGRAM_YEAR_START_MONDAY_2026_27 } from "@/lib/fixtures/program-year-2026-27";
import { WEEK_THEMES } from "@/lib/week";
import { renderDigestEmail } from "./monday-digest-email";
import {
  ARCHIVE_CTA_LABEL,
  DIGEST_ARHIVA_URL,
  MONTHLY_INTRO,
  WEEKLY_INTRO,
  buildMonthlyDigest,
  buildWeeklyDigest,
} from "./monday-digest";

describe("digest email bodies", () => {
  test("weekly is a short booklet-ready note with Archive CTA and no scores", () => {
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
    expect(email.text).toContain(WEEKLY_INTRO);
    expect(email.text).toContain(DIGEST_ARHIVA_URL);
    expect(email.text).not.toContain("8 din 28");
    expect(email.text).not.toContain("%");
    expect(email.html).toContain(ARCHIVE_CTA_LABEL);
    expect(email.html).toContain(DIGEST_ARHIVA_URL);
    expect(email.html).not.toContain("<video");
  });

  test("monthly is a short booklet-ready note", () => {
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
    expect(email.text).toContain(MONTHLY_INTRO);
    expect(email.text).toContain(DIGEST_ARHIVA_URL);
    expect(email.text).not.toContain("3 activități bifate");
    expect(email.html).toContain(ARCHIVE_CTA_LABEL);
    expect(email.html).not.toContain("<b>salut</b>");
  });
});
