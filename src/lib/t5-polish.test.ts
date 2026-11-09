import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { previewSessionLabel, PREVIEW_NOT_CHILD_BAND } from "./band-preview";
import { nextBirthdateValue } from "./birthdate";
import { childBandLine } from "./child-line";
import { liveIdForSeed } from "./catalog-parity";
import { hasEmptyParens } from "./empty-parens";
import {
  PROGRESS_ACTIVITY_COLUMNS,
  PROGRESS_COMPLETION_COLUMNS,
  approvedActivitiesLabel,
  weekProgress,
} from "./progress";
import { getSeedActivities } from "./seed/week1";
import { MOBILE_WEEK_NAV_LABEL, WEEK_ACTIVITY_TITLE_CLASS } from "./saptamana";
import { PROGRAM_WEEKS } from "./week";

const CEDILLA = /[şţŞŢ]/;

type CopyFix = {
  seedId: string;
  liveId: string;
  week: number;
  titlu?: string;
  step?: string;
  untouchedOnBand12: string;
};

const COPY_FIXES: CopyFix[] = [
  {
    seedId: "s45-2-3-z5-mental",
    liveId: "s45-b23-z5-mental",
    week: 45,
    titlu: "Pași, ne oprim, hai — pe corpul puternic",
    untouchedOnBand12: "Unu, doi, unu, doi",
  },
  {
    seedId: "s48-2-3-z1-fizic",
    liveId: "s48-b23-z1-fizic",
    week: 48,
    titlu: "Gest de salut — unda mâinii",
    untouchedOnBand12: "Mâna sus: bună",
  },
  {
    seedId: "s46-2-3-z3-mental",
    liveId: "s46-b23-z3-mental",
    week: 46,
    titlu: "Unde în cameră — două locuri",
    untouchedOnBand12: "Unde e ușa?",
  },
  {
    seedId: "s46-2-3-z4-fizic",
    liveId: "s46-b23-z4-fizic",
    week: 46,
    titlu: "Vânătoare: aia de departe",
    untouchedOnBand12: "Arătăm fereastra",
  },
  {
    seedId: "s46-2-3-z1-resurse",
    liveId: "s46-b23-z1-resurse",
    week: 46,
    titlu: "Găsit — gata jocul",
    untouchedOnBand12: "Mingea pe masă, la vedere",
  },
  {
    seedId: "s45-2-3-z7-mental",
    liveId: "s45-b23-z7-mental",
    week: 45,
    step: "Rămâneți la alegerea lui.",
    untouchedOnBand12: "Cartea cu drumul",
  },
  {
    seedId: "s46-2-3-z7-mental",
    liveId: "s46-b23-z7-mental",
    week: 46,
    step: "Rămâneți la alegerea lui.",
    untouchedOnBand12: "Căutăm în carte: unde e?",
  },
  {
    seedId: "s47-2-3-z7-mental",
    liveId: "s47-b23-z7-mental",
    week: 47,
    step: "Rămâneți la alegerea lui.",
    untouchedOnBand12: "Cartea despre grijă",
  },
  {
    seedId: "s48-2-3-z7-mental",
    liveId: "s48-b23-z7-mental",
    week: 48,
    step: "Rămâneți la alegerea lui.",
    untouchedOnBand12: "Cartea cu salutul",
  },
  {
    seedId: "s48-2-3-z7-social",
    liveId: "s48-b23-z7-social",
    week: 48,
    step: "„Noapte bună.” — fără forțare.",
    untouchedOnBand12: "Noapte bună",
  },
  {
    seedId: "s45-2-3-z7-social",
    liveId: "s45-b23-z7-social",
    week: 45,
    titlu: "Ritual: bună seara — ne oprim, gata cu pașii",
    step: "Șoptiți: „Bună seara. Ne oprim. Gata cu pașii.”",
    untouchedOnBand12: "Noapte bună",
  },
  {
    seedId: "s8-2-3-z5-social",
    liveId: "s8-b23-z5-social",
    week: 8,
    step: "Stați umăr lângă umăr: „Uite — frunză.”",
    untouchedOnBand12: "Pe care frunză?",
  },
];

function activityText(row: {
  titlu: string;
  pasi: string[];
  gata_cand: string;
  tema_saptamana: string;
  nota?: string | null;
  materiale: string[];
}): string[] {
  return [
    row.titlu,
    row.gata_cand,
    row.tema_saptamana,
    row.nota ?? "",
    ...row.materiale,
    ...row.pasi,
  ];
}

describe("T5 copy and agreement", () => {
  test("approved count agrees in the singular", () => {
    expect(approvedActivitiesLabel(0)).toBe("0 aprobate");
    expect(approvedActivitiesLabel(1)).toBe("1 aprobată");
    expect(approvedActivitiesLabel(2)).toBe("2 aprobate");
    expect(
      weekProgress({
        week: 11,
        activities: [
          { id: "a", week_number: 11, pillar: "fizic", day_of_week: 1 },
          { id: "b", week_number: 11, pillar: "mental", day_of_week: 1 },
          { id: "c", week_number: 12, pillar: "social", day_of_week: 1 },
        ],
        completions: [
          { activity_id: "a", mode: "A", parent_approved: true },
          { activity_id: "c", mode: "A", parent_approved: true },
        ],
      }).approvedLabel,
    ).toBe("1 aprobată");
  });

  test("a child line names the band in years and the birth date", () => {
    expect(childBandLine("1-2", "2025-06-11")).toBe("1–2 ani · născut 11 iun. 2025");
    expect(childBandLine("2-3", "2024-06-01")).toBe("2–3 ani · născut 1 iun. 2024");
    expect(childBandLine("1-2", null)).toBe("1–2 ani");
    expect(childBandLine("1-2", "2025-06-11")).not.toContain("ş");
    expect(childBandLine("1-2", "2025-06-11")).not.toContain("ţ");
  });

  test("the first empty date event does not wipe a chosen day", () => {
    expect(nextBirthdateValue("", "")).toBe("");
    expect(nextBirthdateValue("", "2025-06-11")).toBe("2025-06-11");
    expect(nextBirthdateValue("2025-06-11", "")).toBe("2025-06-11");
    expect(nextBirthdateValue("2025-06-11", "2024-06-01")).toBe("2024-06-01");
  });

  test("settings name a preview that is not the child's band", () => {
    expect(previewSessionLabel("2-3")).toBe("Previzualizare 2–3");
    expect(previewSessionLabel("1-2")).toBe("Previzualizare 1–2");
    expect(PREVIEW_NOT_CHILD_BAND).toBe(
      "Nu e banda copilului. Îl lași pe banda lui și doar privești.",
    );
    expect(PREVIEW_NOT_CHILD_BAND).not.toMatch(CEDILLA);
  });

  test("the week menu fits on one line and titles are not cut", () => {
    expect(MOBILE_WEEK_NAV_LABEL).toBe("Săptămâna");
    expect(MOBILE_WEEK_NAV_LABEL).not.toContain("asta");
    expect(WEEK_ACTIVITY_TITLE_CLASS).not.toContain("truncate");
    expect(WEEK_ACTIVITY_TITLE_CLASS).toContain("whitespace-normal");
  });

  test("progress reads the week already loaded, without select *", () => {
    expect(PROGRESS_ACTIVITY_COLUMNS).not.toContain("*");
    expect(PROGRESS_COMPLETION_COLUMNS).not.toContain("*");
    expect(PROGRESS_ACTIVITY_COLUMNS).toContain("saptamana");
    expect(PROGRESS_COMPLETION_COLUMNS).toContain("activity_id");
    expect(PROGRESS_COMPLETION_COLUMNS).toContain("parent_approved");
  });
});

describe("T5 activity copy", () => {
  test("P3, the Sunday ritual and the empty parentheses are fixed on band 2–3 only", () => {
    expect(COPY_FIXES).toHaveLength(12);
    for (const fix of COPY_FIXES) {
      expect(liveIdForSeed(fix.seedId, "2-3")).toBe(fix.liveId);
      const row = getSeedActivities(fix.week, "2-3").find(
        (activity) => activity.id === fix.seedId,
      );
      expect(row, fix.seedId).toBeTruthy();
      expect(row?.banda).toBe("2-3");
      if (fix.titlu) expect(row?.titlu).toBe(fix.titlu);
      if (fix.step) expect(row?.pasi).toContain(fix.step);
      const other = getSeedActivities(fix.week, "1-2").find(
        (activity) => activity.id === fix.seedId,
      );
      expect(other?.titlu, fix.seedId).toBe(fix.untouchedOnBand12);
      for (const field of activityText(row!)) {
        expect(field, fix.seedId).not.toMatch(CEDILLA);
        expect(hasEmptyParens(field), fix.seedId).toBe(false);
      }
    }
  });

  test("no activity in either band contains an empty () or ( )", () => {
    const hits: string[] = [];
    for (const band of ["1-2", "2-3"] as const) {
      for (const week of PROGRAM_WEEKS) {
        for (const row of getSeedActivities(week, band)) {
          for (const field of activityText(row)) {
            if (hasEmptyParens(field)) hits.push(`${band}:${row.id}`);
          }
        }
      }
    }
    expect(hits).toEqual([]);
  });

  test("sql seeds have no empty parentheses in activity text", () => {
    const dir = resolve("supabase/seed");
    const files = readdirSync(dir).filter((name) => name.endsWith(".sql"));
    expect(files.length).toBeGreaterThan(0);
    for (const name of files) {
      const sql = readFileSync(resolve(dir, name), "utf8");
      expect(sql, name).not.toMatch(/\(\s*\)/);
    }
  });

  test("the migration updates each id only in band 2–3 and stops if one is missing", () => {
    const sql = readFileSync(
      resolve("supabase/migrations/20261109233000_t5_formulari_p3.sql"),
      "utf8",
    );
    expect(sql).toMatch(/and a\.banda = v\.banda/);
    expect(sql).toMatch(/raise exception 'T5: id lipsă din banda așteptată/);
    expect(sql).not.toMatch(/\(\s*\)/);
    expect(sql).not.toMatch(CEDILLA);
    for (const fix of COPY_FIXES) {
      expect(sql).toContain(`'${fix.liveId}'`);
      expect(sql).not.toContain(`'${fix.seedId}'`);
    }
    const ids = [...sql.matchAll(/'(s\d+-b23-[a-z0-9-]+)'/g)].map((match) => match[1]);
    expect(new Set(ids)).toEqual(new Set(COPY_FIXES.map((fix) => fix.liveId)));
    expect(sql.match(/'2-3'/g)?.length).toBeGreaterThanOrEqual(12);
  });
});
