import type { SupabaseClient } from "@supabase/supabase-js";
import {
  ARCHIVE_BUCKET,
  bookletCivilDates,
  eachCivilDate,
  missingArchiveDrafts,
  seedTitlesForDates,
  snapshotAgeBandLabel,
  type ArchivePeriod,
  type BookletLiveSources,
} from "@/lib/archive";
import {
  buildArchiveBookletPdf,
  type ArchivePdfChild,
  type ArchivePdfDay,
} from "@/lib/archive-pdf";
import { attributeMissingChildId, childForUnscopedRows, childScopeNotice } from "@/lib/child-scope";
import { familyProgramYearStart } from "@/lib/program-week";
import type { ArchiveDay } from "@/lib/types";

export type ArchiveChildRow = ArchivePdfChild & {
  family_id: string;
  age_band: string;
  created_at?: string | null;
  active?: boolean | null;
};

function catalogsForChildren(
  dates: readonly string[],
  programYearStart: string,
  children: readonly { age_band?: string | null }[],
) {
  const bands = [
    ...new Set(
      children.map((child) => child.age_band?.trim() || "").filter((band) => band.length > 0),
    ),
  ];
  if (bands.length === 0) return seedTitlesForDates(dates, programYearStart);
  return bands.flatMap((band) => seedTitlesForDates(dates, programYearStart, band));
}

function logChildScopeNotices(
  children: readonly { id: string; name?: string | null; created_at?: string | null; active?: boolean | null }[],
  assigned: { bife: number; note: number; zile: number },
) {
  const { child, several } = childForUnscopedRows(children);
  const name = child?.name?.trim() || "copilul din familie";
  const notices = [
    childScopeNotice({ kind: "bife", childName: name, severalChildren: several, count: assigned.bife }),
    childScopeNotice({ kind: "note", childName: name, severalChildren: several, count: assigned.note }),
    childScopeNotice({ kind: "zile", childName: name, severalChildren: several, count: assigned.zile }),
  ].filter((line): line is string => Boolean(line));
  for (const notice of notices) console.info(notice);
}

export async function hydrateMissingArchiveDays(args: {
  supabase: SupabaseClient;
  children: readonly ArchiveChildRow[];
  period: ArchivePeriod;
  family: {
    program_year_start?: string | null;
    joined_at?: string | null;
    created_at?: string | null;
  };
}): Promise<void> {
  if (args.children.length === 0) return;
  const childIds = args.children.map((child) => child.id);
  const yearStart = familyProgramYearStart(args.family);
  const dates = eachCivilDate(args.period.start, args.period.end);
  const activities = catalogsForChildren(dates, yearStart, args.children);

  const [
    { data: existingRows, error: existingError },
    { data: noteRows, error: noteError },
    { data: doneRows, error: doneError },
  ] = await Promise.all([
    args.supabase
      .from("archive_days")
      .select("child_id, civil_date")
      .in("child_id", childIds)
      .gte("civil_date", args.period.start)
      .lte("civil_date", args.period.end),
    args.supabase
      .from("day_notes")
      .select("child_id, program_year_start, week_number, day_of_week, body")
      .in("child_id", childIds),
    args.supabase
      .from("completions")
      .select("child_id, activity_id, completed_at")
      .in("child_id", childIds),
  ]);
  if (existingError) throw new Error(existingError.message);
  if (noteError) throw new Error(noteError.message);
  if (doneError) throw new Error(doneError.message);

  const ownerId = childForUnscopedRows(args.children).child?.id ?? null;
  const notes = attributeMissingChildId(noteRows ?? [], ownerId);
  const completions = attributeMissingChildId(doneRows ?? [], ownerId);
  const existing = attributeMissingChildId(existingRows ?? [], ownerId);
  logChildScopeNotices(args.children, {
    bife: completions.assigned,
    note: notes.assigned,
    zile: existing.assigned,
  });

  const drafts = missingArchiveDrafts({
    dates,
    existing: existing.rows,
    children: args.children,
    notes: notes.rows,
    completions: completions.rows,
    activities,
    programYearStart: yearStart,
  });
  if (drafts.length === 0) return;

  const { error: insertError } = await args.supabase.from("archive_days").insert(
    drafts.map((draft) => ({
      ...draft,
      updated_at: new Date().toISOString(),
    })),
  );
  if (insertError && insertError.code !== "23505") {
    throw new Error(insertError.message);
  }
}

export async function loadArchiveDaysInPeriod(
  supabase: SupabaseClient,
  childIds: readonly string[],
  period: ArchivePeriod,
): Promise<ArchiveDay[]> {
  if (childIds.length === 0) return [];
  const { data, error } = await supabase
    .from("archive_days")
    .select("*")
    .in("child_id", childIds)
    .gte("civil_date", period.start)
    .lte("civil_date", period.end)
    .order("civil_date", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as ArchiveDay[];
}

export async function downloadArchivePhotos(
  supabase: SupabaseClient,
  days: readonly ArchivePdfDay[],
): Promise<Map<string, { bytes: Uint8Array }>> {
  const photos = new Map<string, { bytes: Uint8Array }>();
  const paths = [...new Set(days.map((day) => day.photo_path).filter(Boolean))] as string[];
  for (const path of paths) {
    const { data, error } = await supabase.storage.from(ARCHIVE_BUCKET).download(path);
    if (error || !data) continue;
    photos.set(path, { bytes: new Uint8Array(await data.arrayBuffer()) });
  }
  return photos;
}

export async function loadBookletLiveSources(args: {
  supabase: SupabaseClient;
  children: readonly {
    id: string;
    name?: string | null;
    age_band?: string | null;
    created_at?: string | null;
    active?: boolean | null;
  }[];
  period: Pick<ArchivePeriod, "start" | "end">;
  today: string;
  family: {
    program_year_start?: string | null;
    joined_at?: string | null;
    created_at?: string | null;
  };
}): Promise<BookletLiveSources> {
  const yearStart = familyProgramYearStart(args.family);
  const dates = bookletCivilDates(args.period, args.today);
  const activities = catalogsForChildren(dates, yearStart, args.children);
  const childIds = args.children.map((child) => child.id);
  if (childIds.length === 0) {
    return { programYearStart: yearStart, notes: [], completions: [], activities };
  }
  const [
    { data: noteRows, error: noteError },
    { data: doneRows, error: doneError },
  ] = await Promise.all([
    args.supabase
      .from("day_notes")
      .select("child_id, program_year_start, week_number, day_of_week, body")
      .in("child_id", childIds),
    args.supabase
      .from("completions")
      .select("child_id, activity_id, completed_at")
      .in("child_id", childIds),
  ]);
  if (noteError) throw new Error(noteError.message);
  if (doneError) throw new Error(doneError.message);
  const ownerId = childForUnscopedRows(args.children).child?.id ?? null;
  const notes = attributeMissingChildId(noteRows ?? [], ownerId);
  const completions = attributeMissingChildId(doneRows ?? [], ownerId);
  logChildScopeNotices(args.children, {
    bife: completions.assigned,
    note: notes.assigned,
    zile: 0,
  });
  return {
    programYearStart: yearStart,
    notes: notes.rows,
    completions: completions.rows,
    activities,
  };
}

export async function buildFamilyArchivePdf(args: {
  supabase: SupabaseClient;
  period: ArchivePeriod;
  children: readonly (ArchivePdfChild & { age_band?: string })[];
  days: readonly ArchivePdfDay[];
  today: string;
  family?: {
    program_year_start?: string | null;
    joined_at?: string | null;
    created_at?: string | null;
  };
}): Promise<Uint8Array> {
  const photos = await downloadArchivePhotos(args.supabase, args.days);
  const live = args.family
    ? await loadBookletLiveSources({
        supabase: args.supabase,
        children: args.children,
        period: args.period,
        today: args.today,
        family: args.family,
      })
    : undefined;
  return buildArchiveBookletPdf({
    period: args.period,
    children: args.children.map((child) => ({
      id: child.id,
      name: child.name,
      age_band_label:
        child.age_band_label ??
        (child.age_band ? snapshotAgeBandLabel(child.age_band) : ""),
    })),
    days: args.days,
    photos,
    today: args.today,
    live,
  });
}
