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
import { familyProgramYearStart } from "@/lib/program-week";
import type { ArchiveDay } from "@/lib/types";

export type ArchiveChildRow = ArchivePdfChild & {
  family_id: string;
  age_band: string;
};

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
  const activities = seedTitlesForDates(dates, yearStart);

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

  const drafts = missingArchiveDrafts({
    dates,
    existing: existingRows ?? [],
    children: args.children,
    notes: noteRows ?? [],
    completions: doneRows ?? [],
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
  childIds: readonly string[];
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
  const activities = seedTitlesForDates(dates, yearStart);
  if (args.childIds.length === 0) {
    return { programYearStart: yearStart, notes: [], completions: [], activities };
  }
  const [
    { data: noteRows, error: noteError },
    { data: doneRows, error: doneError },
  ] = await Promise.all([
    args.supabase
      .from("day_notes")
      .select("child_id, program_year_start, week_number, day_of_week, body")
      .in("child_id", args.childIds),
    args.supabase
      .from("completions")
      .select("child_id, activity_id, completed_at")
      .in("child_id", args.childIds),
  ]);
  if (noteError) throw new Error(noteError.message);
  if (doneError) throw new Error(doneError.message);
  return {
    programYearStart: yearStart,
    notes: noteRows ?? [],
    completions: doneRows ?? [],
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
        childIds: args.children.map((child) => child.id),
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
