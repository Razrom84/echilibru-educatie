"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { CHILD_COOKIE, isSupabaseConfigured, WEEK_COOKIE, WEEK_STORAGE_KEY } from "@/lib/config";
import {
  addDemoChild,
  clearDemoSession,
  demoActivities,
  demoArchiveDaysForChild,
  demoDayNotesForWeek,
  readDemoState,
  removeDemoArchiveDay,
  removeDemoCompletion,
  upsertDemoArchiveDay,
  upsertDemoCompletion,
  upsertDemoDayNote,
  writeDemoState,
  type DemoState,
} from "@/lib/demo/store";
import { createBrowserSupabase } from "@/lib/supabase/client";
import type {
  Activity,
  ArchiveDay,
  Child,
  Completion,
  CompletionMode,
  DayNote,
  Family,
} from "@/lib/types";
import { bandFromBirthdate } from "@/lib/band";
import { normalizeDayNoteBody } from "@/lib/day-note";
import { getSeedActivities, normalizeActivity } from "@/lib/seed/week1";
import { DEMO_CALENDAR_TOKEN, generateCalendarToken } from "@/lib/calendar";
import {
  ARCHIVE_BUCKET,
  addCivilDays,
  archiveDayHasContent,
  archivePhotoPath,
  bookletCivilDates,
  buildArchiveDraft,
  doneTitlesForCivilDate,
  noteForCivilDate,
  seedTitlesForDates,
  type BookletLiveSources,
} from "@/lib/archive";
import { compressDayPhoto, jpegFileFromBlob, rejectIfNotPhoto } from "@/lib/archive-photo";
import {
  deleteDemoPhoto,
  demoPhotoObjectUrl,
  readDemoPhoto,
  saveDemoPhoto,
} from "@/lib/demo/photos";
import {
  bucharestToday,
  civilDayOfWeek,
  familyJoinFields,
  familyProgramWeek,
  familyProgramYearStart,
  programWeekNumber,
  programWeekRange,
  toDateOnlyString,
} from "@/lib/program-week";
import { getWeekTheme, PROGRAM_AGE_BAND, PROGRAM_WEEK } from "@/lib/week";
import type { SeedActivity } from "@/lib/types";

type Status = "loading" | "ready" | "error";

type FamilyContextValue = {
  status: Status;
  error: string | null;
  isDemo: boolean;
  family: Family | null;
  children: Child[];
  selectedChild: Child | null;
  selectedWeek: number;
  weekTheme: string;
  activities: Activity[];
  completions: Completion[];
  dayNotes: DayNote[];
  todayArchive: ArchiveDay | null;
  todayPhotoUrl: string | null;
  refresh: () => Promise<void>;
  selectWeek: (week: number) => void;
  selectChild: (childId: string) => Promise<void>;
  addChild: (input: { name: string; birthdate: string | null }) => Promise<void>;
  updateFamily: (input: {
    display_name: string;
    default_mode: CompletionMode;
    monday_digest_email?: boolean;
    second_parent_email?: string | null;
  }) => Promise<void>;
  toggleComplete: (activityId: string) => Promise<void>;
  approveCompletion: (activityId: string) => Promise<void>;
  saveDayNote: (dayOfWeek: number, body: string) => Promise<void>;
  saveDayPhoto: (civilDate: string, file: File) => Promise<void>;
  removeDayPhoto: (civilDate: string) => Promise<void>;
  loadArchiveDays: (start: string, end: string) => Promise<ArchiveDay[]>;
  loadBookletLive: (start: string, end: string, today: string) => Promise<BookletLiveSources>;
  signedPhotoUrl: (path: string | null) => Promise<string | null>;
  downloadPhotoBytes: (path: string) => Promise<Uint8Array | null>;
  ensureCalendarToken: () => Promise<string>;
  signOut: () => Promise<void>;
};

const FamilyContext = createContext<FamilyContextValue | null>(null);

function readChildCookie() {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${CHILD_COOKIE}=`));
  return match?.split("=")[1] ?? null;
}

function writeChildCookie(childId: string) {
  document.cookie = `${CHILD_COOKIE}=${childId}; path=/; max-age=31536000; samesite=lax`;
}

function writeWeekCookie(week: number) {
  document.cookie = `${WEEK_COOKIE}=${week}; path=/; max-age=31536000; samesite=lax`;
  try {
    window.localStorage.setItem(WEEK_STORAGE_KEY, String(week));
  } catch {
    /* ignore quota / private mode */
  }
}

function demoRowId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function FamilyProvider({
  isDemo,
  initialWeek = PROGRAM_WEEK,
  children: tree,
}: {
  isDemo: boolean;
  initialWeek?: number;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);
  const [family, setFamily] = useState<Family | null>(null);
  const [kids, setKids] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [demoWeek, setDemoWeek] = useState<number | null>(isDemo ? initialWeek : null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [completions, setCompletions] = useState<Completion[]>([]);
  const [dayNotes, setDayNotes] = useState<DayNote[]>([]);
  const [todayArchive, setTodayArchive] = useState<ArchiveDay | null>(null);
  const [todayPhotoUrl, setTodayPhotoUrl] = useState<string | null>(null);

  const selectedChild = useMemo(
    () => kids.find((child) => child.id === selectedChildId) ?? kids[0] ?? null,
    [kids, selectedChildId],
  );

  const selectedWeek = useMemo(() => {
    if (isDemo && demoWeek != null) return demoWeek;
    if (family) return familyProgramWeek(family);
    return initialWeek;
  }, [demoWeek, family, initialWeek, isDemo]);

  const applyDemo = useCallback(
    (state: DemoState, week: number) => {
      setFamily(state.family);
      setKids(state.children.filter((child) => child.active));
      setSelectedChildId(state.selectedChildId);
      setActivities(demoActivities(week));
      setCompletions(state.completions);
      setDayNotes(demoDayNotesForWeek(state, week));
      const today = bucharestToday();
      const childId = state.selectedChildId;
      const row =
        demoArchiveDaysForChild(state, childId).find((item) => item.civil_date === today) ??
        null;
      setTodayArchive(row);
    },
    [],
  );

  const refresh = useCallback(async () => {
    setError(null);
    if (isDemo) {
      const state = readDemoState();
      applyDemo(state, selectedWeek);
      const today = bucharestToday();
      const childId = state.selectedChildId;
      const row =
        demoArchiveDaysForChild(state, childId).find((item) => item.civil_date === today) ??
        null;
      setTodayArchive(row);
      if (childId && row?.photo_path) {
        const url = await demoPhotoObjectUrl(childId, today);
        setTodayPhotoUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
      } else {
        setTodayPhotoUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return null;
        });
      }
      setStatus("ready");
      return;
    }

    const supabase = createBrowserSupabase();
    if (!supabase) {
      setError("Supabase nu este configurat.");
      setStatus("error");
      return;
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      setError("Sesiunea a expirat. Intră din nou.");
      setStatus("error");
      return;
    }

    const { data: familyRow, error: familyError } = await supabase
      .from("families")
      .select("*")
      .eq("parent_id", user.id)
      .maybeSingle();

    if (familyError) {
      setError(familyError.message);
      setStatus("error");
      return;
    }

    let currentFamily = familyRow as Family | null;
    if (!currentFamily) {
      const base = {
        parent_id: user.id,
        display_name: user.email?.split("@")[0],
      };
      let { data: created, error: createError } = await supabase
        .from("families")
        .insert({ ...base, ...familyJoinFields() })
        .select("*")
        .single();
      if (createError) {
        const retry = await supabase.from("families").insert(base).select("*").single();
        created = retry.data;
        createError = retry.error;
      }
      if (createError || !created) {
        setError(createError?.message ?? "Nu am putut crea familia.");
        setStatus("error");
        return;
      }
      currentFamily = created as Family;
    }

    setFamily(currentFamily);
    const idForChildren = currentFamily.id;

    const [{ data: childRows, error: childError }, { data: activityRows, error: activityError }] =
      await Promise.all([
        supabase
          .from("children")
          .select("*")
          .eq("family_id", idForChildren)
          .eq("active", true)
          .order("created_at", { ascending: true }),
        supabase
          .from("activities")
          .select("*")
          .eq("saptamana", selectedWeek)
          .eq("banda", PROGRAM_AGE_BAND)
          .order("zi", { ascending: true }),
      ]);

    if (childError) {
      setError(childError.message);
      setStatus("error");
      return;
    }
    if (activityError) {
      setError(activityError.message);
      setStatus("error");
      return;
    }

    const nextKids = (childRows ?? []) as Child[];
    setKids(nextKids);

    const cookieChild = readChildCookie();
    const nextSelected =
      nextKids.find((child) => child.id === cookieChild)?.id ??
      nextKids[0]?.id ??
      null;
    setSelectedChildId(nextSelected);
    if (nextSelected) writeChildCookie(nextSelected);

    const catalog = ((activityRows ?? []) as SeedActivity[]).map(normalizeActivity);
    setActivities(catalog);

    if (nextSelected) {
      const yearStart = familyProgramYearStart(currentFamily);
      const today = bucharestToday();
      const [
        { data: doneRows, error: doneError },
        { data: noteRows, error: noteError },
        { data: archiveRow, error: archiveError },
      ] = await Promise.all([
        supabase.from("completions").select("*").eq("child_id", nextSelected),
        supabase
          .from("day_notes")
          .select("*")
          .eq("child_id", nextSelected)
          .eq("program_year_start", yearStart)
          .eq("week_number", selectedWeek),
        supabase
          .from("archive_days")
          .select("*")
          .eq("child_id", nextSelected)
          .eq("civil_date", today)
          .maybeSingle(),
      ]);
      if (doneError) {
        setError(doneError.message);
        setStatus("error");
        return;
      }
      if (noteError) {
        setError(noteError.message);
        setStatus("error");
        return;
      }
      if (archiveError) {
        setError(archiveError.message);
        setStatus("error");
        return;
      }
      setCompletions((doneRows ?? []) as Completion[]);
      setDayNotes((noteRows ?? []) as DayNote[]);
      const archive = (archiveRow as ArchiveDay | null) ?? null;
      setTodayArchive(archive);
      if (archive?.photo_path) {
        const signed = await supabase.storage
          .from(ARCHIVE_BUCKET)
          .createSignedUrl(archive.photo_path, 3600);
        setTodayPhotoUrl(signed.data?.signedUrl ?? null);
      } else {
        setTodayPhotoUrl(null);
      }
    } else {
      setCompletions([]);
      setDayNotes([]);
      setTodayArchive(null);
      setTodayPhotoUrl(null);
    }

    setStatus("ready");
  }, [applyDemo, isDemo, selectedWeek]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      void refresh();
    });
    return () => cancelAnimationFrame(frame);
  }, [refresh]);

  const selectChild = useCallback(
    async (childId: string) => {
      setSelectedChildId(childId);
      writeChildCookie(childId);
      if (isDemo) {
        const state = { ...readDemoState(), selectedChildId: childId };
        writeDemoState(state);
        setCompletions(state.completions);
        setDayNotes(demoDayNotesForWeek(state, selectedWeek));
        const today = bucharestToday();
        const row =
          demoArchiveDaysForChild(state, childId).find((item) => item.civil_date === today) ??
          null;
        setTodayArchive(row);
        if (row?.photo_path) {
          const url = await demoPhotoObjectUrl(childId, today);
          setTodayPhotoUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return url;
          });
        } else {
          setTodayPhotoUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return null;
          });
        }
        return;
      }
      const supabase = createBrowserSupabase();
      if (!supabase || !family) return;
      const yearStart = familyProgramYearStart(family);
      const today = bucharestToday();
      const [
        { data, error: doneError },
        { data: noteRows, error: noteError },
        { data: archiveRow, error: archiveError },
      ] = await Promise.all([
        supabase.from("completions").select("*").eq("child_id", childId),
        supabase
          .from("day_notes")
          .select("*")
          .eq("child_id", childId)
          .eq("program_year_start", yearStart)
          .eq("week_number", selectedWeek),
        supabase
          .from("archive_days")
          .select("*")
          .eq("child_id", childId)
          .eq("civil_date", today)
          .maybeSingle(),
      ]);
      if (doneError) {
        setError(doneError.message);
        return;
      }
      if (noteError) {
        setError(noteError.message);
        return;
      }
      if (archiveError) {
        setError(archiveError.message);
        return;
      }
      setCompletions((data ?? []) as Completion[]);
      setDayNotes((noteRows ?? []) as DayNote[]);
      const archive = (archiveRow as ArchiveDay | null) ?? null;
      setTodayArchive(archive);
      if (archive?.photo_path) {
        const signed = await supabase.storage
          .from(ARCHIVE_BUCKET)
          .createSignedUrl(archive.photo_path, 3600);
        setTodayPhotoUrl(signed.data?.signedUrl ?? null);
      } else {
        setTodayPhotoUrl(null);
      }
    },
    [family, isDemo, selectedWeek],
  );

  const addChild = useCallback(
    async (input: { name: string; birthdate: string | null }) => {
      if (isDemo) {
        const next = addDemoChild(readDemoState(), input);
        writeDemoState(next);
        applyDemo(next, selectedWeek);
        return;
      }
      const supabase = createBrowserSupabase();
      if (!supabase || !family) throw new Error("Familia lipsește.");
      const { data, error: insertError } = await supabase
        .from("children")
        .insert({
          family_id: family.id,
          name: input.name.trim(),
          birthdate: input.birthdate,
          age_band: bandFromBirthdate(input.birthdate),
          active: true,
        })
        .select("*")
        .single();
      if (insertError || !data) throw new Error(insertError?.message ?? "Nu am putut salva copilul.");
      const child = data as Child;
      setKids((current) => [...current, child]);
      setSelectedChildId(child.id);
      writeChildCookie(child.id);
      setCompletions([]);
      setDayNotes([]);
      setTodayArchive(null);
      setTodayPhotoUrl(null);
    },
    [applyDemo, family, isDemo, selectedWeek],
  );

  const updateFamily = useCallback(
    async (input: {
      display_name: string;
      default_mode: CompletionMode;
      monday_digest_email?: boolean;
      second_parent_email?: string | null;
    }) => {
      if (isDemo) {
        const state = readDemoState();
        const next = {
          ...state,
          family: {
            ...state.family,
            display_name: input.display_name,
            default_mode: input.default_mode,
            monday_digest_email:
              input.monday_digest_email ?? state.family.monday_digest_email ?? true,
            second_parent_email:
              input.second_parent_email !== undefined
                ? input.second_parent_email
                : state.family.second_parent_email ?? null,
          },
        };
        writeDemoState(next);
        setFamily(next.family);
        return;
      }
      const supabase = createBrowserSupabase();
      if (!supabase || !family) return;
      const payload: {
        display_name: string;
        default_mode: CompletionMode;
        monday_digest_email?: boolean;
        second_parent_email?: string | null;
      } = {
        display_name: input.display_name,
        default_mode: input.default_mode,
      };
      if (input.monday_digest_email !== undefined) {
        payload.monday_digest_email = input.monday_digest_email;
      }
      if (input.second_parent_email !== undefined) {
        payload.second_parent_email = input.second_parent_email;
      }
      const { data, error: updateError } = await supabase
        .from("families")
        .update(payload)
        .eq("id", family.id)
        .select("*")
        .single();
      if (updateError) throw new Error(updateError.message);
      setFamily(data as Family);
    },
    [family, isDemo],
  );

  const stampArchiveDay = useCallback(
    async (args: {
      civilDate: string;
      completions: Completion[];
      dayNotes: DayNote[];
      photoPath?: string | null;
      clearPhoto?: boolean;
      preferExistingDone?: boolean;
    }): Promise<ArchiveDay | null> => {
      if (!selectedChild || !family) return null;
      const yearStart = familyProgramYearStart(family);
      const week = programWeekNumber(args.civilDate, yearStart);
      const catalog = getSeedActivities(week);
      let existing: ArchiveDay | null = null;
      if (isDemo) {
        existing =
          demoArchiveDaysForChild(readDemoState(), selectedChild.id).find(
            (row) => row.civil_date === args.civilDate,
          ) ?? null;
      } else {
        const supabase = createBrowserSupabase();
        if (!supabase) return null;
        const { data } = await supabase
          .from("archive_days")
          .select("*")
          .eq("child_id", selectedChild.id)
          .eq("civil_date", args.civilDate)
          .maybeSingle();
        existing = (data as ArchiveDay | null) ?? null;
      }

      const photoPath = args.clearPhoto
        ? null
        : args.photoPath !== undefined
          ? args.photoPath
          : (existing?.photo_path ?? null);

      let notesForDay = args.dayNotes;
      const hasNote = notesForDay.some(
        (note) =>
          note.child_id === selectedChild.id &&
          note.program_year_start === yearStart &&
          note.week_number === week &&
          note.day_of_week === civilDayOfWeek(args.civilDate),
      );
      if (!hasNote) {
        if (isDemo) {
          notesForDay = readDemoState().dayNotes;
        } else {
          const notesClient = createBrowserSupabase();
          if (notesClient) {
            const { data: extraNotes } = await notesClient
              .from("day_notes")
              .select("*")
              .eq("child_id", selectedChild.id)
              .eq("program_year_start", yearStart)
              .eq("week_number", week)
              .eq("day_of_week", civilDayOfWeek(args.civilDate));
            if (extraNotes?.length) {
              notesForDay = [...notesForDay, ...(extraNotes as DayNote[])];
            }
          }
        }
      }

      const draft = buildArchiveDraft({
        childId: selectedChild.id,
        civilDate: args.civilDate,
        ageBand: selectedChild.age_band,
        existingBandLabel: existing?.age_band_label,
        dayNote:
          noteForCivilDate({
            civilDate: args.civilDate,
            programYearStart: yearStart,
            notes: notesForDay,
          }) || (existing?.day_note ?? ""),
        doneTitles: (() => {
          const computed = doneTitlesForCivilDate({
            civilDate: args.civilDate,
            activities: catalog,
            completions: args.completions.filter((row) => row.child_id === selectedChild.id),
          });
          if (computed.length > 0) return computed;
          if (args.preferExistingDone) return existing?.done_titles ?? [];
          return [];
        })(),
        photoPath,
      });

      if (!archiveDayHasContent(draft)) {
        if (isDemo) {
          writeDemoState(
            removeDemoArchiveDay(readDemoState(), selectedChild.id, args.civilDate),
          );
        } else {
          const supabase = createBrowserSupabase();
          await supabase
            ?.from("archive_days")
            .delete()
            .eq("child_id", selectedChild.id)
            .eq("civil_date", args.civilDate);
        }
        if (args.civilDate === bucharestToday()) {
          setTodayArchive(null);
          setTodayPhotoUrl((prev) => {
            if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
            return null;
          });
        }
        return null;
      }

      if (isDemo) {
        const row: ArchiveDay = {
          id: existing?.id ?? demoRowId("archive"),
          ...draft,
          created_at: existing?.created_at ?? new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        writeDemoState(upsertDemoArchiveDay(readDemoState(), row));
        if (args.civilDate === bucharestToday()) setTodayArchive(row);
        return row;
      }

      const supabase = createBrowserSupabase();
      if (!supabase) return null;
      const { data, error } = await supabase
        .from("archive_days")
        .upsert(
          {
            child_id: draft.child_id,
            civil_date: draft.civil_date,
            age_band_label: draft.age_band_label,
            day_note: draft.day_note,
            done_titles: draft.done_titles,
            photo_path: draft.photo_path,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "child_id,civil_date" },
        )
        .select("*")
        .single();
      if (error || !data) throw new Error(error?.message ?? "Nu am putut salva arhiva.");
      const row = data as ArchiveDay;
      if (args.civilDate === bucharestToday()) setTodayArchive(row);
      return row;
    },
    [family, isDemo, selectedChild],
  );

  const toggleComplete = useCallback(
    async (activityId: string) => {
      if (!selectedChild || !family) return;
      const existing = completions.find((row) => row.activity_id === activityId);
      if (existing) {
        if (isDemo) {
          const next = removeDemoCompletion(readDemoState(), selectedChild.id, activityId);
          writeDemoState(next);
          setCompletions(next.completions);
          const dates = new Set<string>([bucharestToday()]);
          dates.add(toDateOnlyString(existing.completed_at));
          for (const civilDate of dates) {
            await stampArchiveDay({
              civilDate,
              completions: next.completions,
              dayNotes,
            });
          }
          return;
        }
        const supabase = createBrowserSupabase();
        if (!supabase) return;
        const { error: deleteError } = await supabase
          .from("completions")
          .delete()
          .eq("id", existing.id);
        if (deleteError) throw new Error(deleteError.message);
        const nextCompletions = completions.filter((row) => row.id !== existing.id);
        setCompletions(nextCompletions);
        const dates = new Set<string>([bucharestToday()]);
        dates.add(toDateOnlyString(existing.completed_at));
        for (const civilDate of dates) {
          await stampArchiveDay({
            civilDate,
            completions: nextCompletions,
            dayNotes,
          });
        }
        return;
      }

      const mode = family.default_mode;
      const parentApproved = mode === "A" ? true : false;
      if (isDemo) {
        const next = upsertDemoCompletion(readDemoState(), {
          childId: selectedChild.id,
          activityId,
          mode,
          parentApproved,
        });
        writeDemoState(next);
        setCompletions(next.completions);
        await stampArchiveDay({
          civilDate: bucharestToday(),
          completions: next.completions,
          dayNotes,
        });
        return;
      }

      const supabase = createBrowserSupabase();
      if (!supabase) return;
      const { data, error: insertError } = await supabase
        .from("completions")
        .insert({
          child_id: selectedChild.id,
          activity_id: activityId,
          mode,
          parent_approved: parentApproved,
        })
        .select("*")
        .single();
      if (insertError || !data) throw new Error(insertError?.message ?? "Nu am putut salva.");
      const row = data as Completion;
      const nextCompletions = [...completions, row];
      setCompletions(nextCompletions);
      await stampArchiveDay({
        civilDate: bucharestToday(),
        completions: nextCompletions,
        dayNotes,
      });
    },
    [completions, dayNotes, family, isDemo, selectedChild, stampArchiveDay],
  );

  const saveDayNote = useCallback(
    async (dayOfWeek: number, body: string) => {
      if (!selectedChild || !family) return;
      const programYearStart = familyProgramYearStart(family);
      const normalized = normalizeDayNoteBody(body);
      if (isDemo) {
        const next = upsertDemoDayNote(readDemoState(), {
          childId: selectedChild.id,
          weekNumber: selectedWeek,
          dayOfWeek,
          body,
        });
        writeDemoState(next);
        const nextNotes = demoDayNotesForWeek(next, selectedWeek);
        setDayNotes(nextNotes);
        const range = programWeekRange(selectedWeek, programYearStart);
        await stampArchiveDay({
          civilDate: addCivilDays(range.start, dayOfWeek - 1),
          completions,
          dayNotes: next.dayNotes,
        });
        return;
      }
      const supabase = createBrowserSupabase();
      if (!supabase) return;
      const existing = dayNotes.find((note) => note.day_of_week === dayOfWeek);
      if (!normalized) {
        if (existing) {
          const { error: deleteError } = await supabase
            .from("day_notes")
            .delete()
            .eq("id", existing.id);
          if (deleteError) throw new Error(deleteError.message);
        }
        const nextNotes = dayNotes.filter((note) => note.day_of_week !== dayOfWeek);
        setDayNotes(nextNotes);
        const range = programWeekRange(selectedWeek, programYearStart);
        await stampArchiveDay({
          civilDate: addCivilDays(range.start, dayOfWeek - 1),
          completions,
          dayNotes: nextNotes,
        });
        return;
      }
      const payload = {
        child_id: selectedChild.id,
        program_year_start: programYearStart,
        week_number: selectedWeek,
        day_of_week: dayOfWeek,
        body: normalized,
        updated_at: new Date().toISOString(),
      };
      const { data, error: upsertError } = await supabase
        .from("day_notes")
        .upsert(payload, {
          onConflict: "child_id,program_year_start,week_number,day_of_week",
        })
        .select("*")
        .single();
      if (upsertError || !data) {
        throw new Error(upsertError?.message ?? "Nu am putut salva.");
      }
      const saved = data as DayNote;
      const nextNotes = [
        ...dayNotes.filter((note) => note.day_of_week !== dayOfWeek),
        saved,
      ];
      setDayNotes(nextNotes);
      const range = programWeekRange(selectedWeek, programYearStart);
      await stampArchiveDay({
        civilDate: addCivilDays(range.start, dayOfWeek - 1),
        completions,
        dayNotes: nextNotes,
      });
    },
    [completions, dayNotes, family, isDemo, selectedChild, selectedWeek, stampArchiveDay],
  );

  const signedPhotoUrl = useCallback(
    async (path: string | null): Promise<string | null> => {
      if (!path || !selectedChild) return null;
      if (isDemo) {
        const [, civilDate] = path.split("/");
        const date = civilDate?.replace(/\.jpg$/, "") ?? "";
        return demoPhotoObjectUrl(selectedChild.id, date);
      }
      const supabase = createBrowserSupabase();
      if (!supabase) return null;
      const { data, error } = await supabase.storage
        .from(ARCHIVE_BUCKET)
        .createSignedUrl(path, 3600);
      if (error) return null;
      return data.signedUrl;
    },
    [isDemo, selectedChild],
  );

  const downloadPhotoBytes = useCallback(
    async (path: string): Promise<Uint8Array | null> => {
      if (!selectedChild) return null;
      if (isDemo) {
        const date = path.split("/")[1]?.replace(/\.jpg$/, "") ?? "";
        const blob = await readDemoPhoto(selectedChild.id, date);
        if (!blob) return null;
        return new Uint8Array(await blob.arrayBuffer());
      }
      const supabase = createBrowserSupabase();
      if (!supabase) return null;
      const { data, error } = await supabase.storage.from(ARCHIVE_BUCKET).download(path);
      if (error || !data) return null;
      return new Uint8Array(await data.arrayBuffer());
    },
    [isDemo, selectedChild],
  );

  const saveDayPhoto = useCallback(
    async (civilDate: string, file: File) => {
      if (!selectedChild) throw new Error("Alege un copil mai întâi.");
      const rejected = rejectIfNotPhoto(file);
      if (rejected) throw new Error(rejected);
      const blob = await compressDayPhoto(file);
      const jpeg = jpegFileFromBlob(blob, civilDate);
      const path = archivePhotoPath(selectedChild.id, civilDate);

      if (isDemo) {
        await saveDemoPhoto(selectedChild.id, civilDate, jpeg);
        const row = await stampArchiveDay({
          civilDate,
          completions,
          dayNotes,
          photoPath: path,
          preferExistingDone: true,
        });
        if (civilDate === bucharestToday()) {
          const url = URL.createObjectURL(jpeg);
          setTodayPhotoUrl((prev) => {
            if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
            return url;
          });
          setTodayArchive(row);
        }
        return;
      }

      const supabase = createBrowserSupabase();
      if (!supabase) throw new Error("Supabase nu este configurat.");
      const { error: uploadError } = await supabase.storage
        .from(ARCHIVE_BUCKET)
        .upload(path, jpeg, {
          upsert: true,
          contentType: "image/jpeg",
          cacheControl: "3600",
        });
      if (uploadError) throw new Error(uploadError.message);
      const row = await stampArchiveDay({
        civilDate,
        completions,
        dayNotes,
        photoPath: path,
        preferExistingDone: true,
      });
      if (civilDate === bucharestToday()) {
        const signed = await supabase.storage.from(ARCHIVE_BUCKET).createSignedUrl(path, 3600);
        setTodayPhotoUrl(signed.data?.signedUrl ?? null);
        setTodayArchive(row);
      }
    },
    [completions, dayNotes, isDemo, selectedChild, stampArchiveDay],
  );

  const removeDayPhoto = useCallback(
    async (civilDate: string) => {
      if (!selectedChild) return;
      const path = archivePhotoPath(selectedChild.id, civilDate);
      if (isDemo) {
        await deleteDemoPhoto(selectedChild.id, civilDate);
      } else {
        const supabase = createBrowserSupabase();
        await supabase?.storage.from(ARCHIVE_BUCKET).remove([path]);
      }
      const row = await stampArchiveDay({
        civilDate,
        completions,
        dayNotes,
        clearPhoto: true,
        preferExistingDone: true,
      });
      if (civilDate === bucharestToday()) {
        setTodayPhotoUrl((prev) => {
          if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
          return null;
        });
        setTodayArchive(row);
      }
    },
    [completions, dayNotes, isDemo, selectedChild, stampArchiveDay],
  );

  const loadArchiveDays = useCallback(
    async (start: string, end: string): Promise<ArchiveDay[]> => {
      if (!selectedChild) return [];
      if (isDemo) {
        return demoArchiveDaysForChild(readDemoState(), selectedChild.id)
          .filter((row) => row.civil_date >= start && row.civil_date <= end)
          .sort((a, b) => a.civil_date.localeCompare(b.civil_date));
      }
      const supabase = createBrowserSupabase();
      if (!supabase) return [];
      const { data, error } = await supabase
        .from("archive_days")
        .select("*")
        .eq("child_id", selectedChild.id)
        .gte("civil_date", start)
        .lte("civil_date", end)
        .order("civil_date", { ascending: true });
      if (error) throw new Error(error.message);
      return (data ?? []) as ArchiveDay[];
    },
    [isDemo, selectedChild],
  );

  const loadBookletLive = useCallback(
    async (start: string, end: string, today: string): Promise<BookletLiveSources> => {
      const yearStart = family ? familyProgramYearStart(family) : familyProgramYearStart({});
      const dates = bookletCivilDates({ start, end }, today);
      const activities = seedTitlesForDates(dates, yearStart);
      if (!selectedChild) {
        return { programYearStart: yearStart, notes: [], completions: [], activities };
      }
      if (isDemo) {
        const state = readDemoState();
        return {
          programYearStart: yearStart,
          notes: state.dayNotes.filter((note) => note.child_id === selectedChild.id),
          completions: state.completions.filter((row) => row.child_id === selectedChild.id),
          activities,
        };
      }
      const supabase = createBrowserSupabase();
      if (!supabase) {
        return {
          programYearStart: yearStart,
          notes: dayNotes.filter((note) => note.child_id === selectedChild.id),
          completions: completions.filter((row) => row.child_id === selectedChild.id),
          activities,
        };
      }
      const [
        { data: noteRows, error: noteError },
        { data: doneRows, error: doneError },
      ] = await Promise.all([
        supabase
          .from("day_notes")
          .select("child_id, program_year_start, week_number, day_of_week, body")
          .eq("child_id", selectedChild.id),
        supabase
          .from("completions")
          .select("child_id, activity_id, completed_at")
          .eq("child_id", selectedChild.id),
      ]);
      if (noteError) throw new Error(noteError.message);
      if (doneError) throw new Error(doneError.message);
      return {
        programYearStart: yearStart,
        notes: noteRows ?? [],
        completions: doneRows ?? [],
        activities,
      };
    },
    [completions, dayNotes, family, isDemo, selectedChild],
  );

  const approveCompletion = useCallback(
    async (activityId: string) => {
      if (!selectedChild) return;
      const existing = completions.find((row) => row.activity_id === activityId);
      if (!existing) return;
      if (isDemo) {
        const next = upsertDemoCompletion(readDemoState(), {
          childId: selectedChild.id,
          activityId,
          mode: "B",
          parentApproved: true,
        });
        writeDemoState(next);
        setCompletions(next.completions);
        return;
      }
      const supabase = createBrowserSupabase();
      if (!supabase) return;
      const { data, error: updateError } = await supabase
        .from("completions")
        .update({ parent_approved: true })
        .eq("id", existing.id)
        .select("*")
        .single();
      if (updateError || !data) throw new Error(updateError?.message ?? "Nu am putut aproba.");
      setCompletions((current) =>
        current.map((row) => (row.id === existing.id ? (data as Completion) : row)),
      );
    },
    [completions, isDemo, selectedChild],
  );

  const ensureCalendarToken = useCallback(async () => {
    if (isDemo) return DEMO_CALENDAR_TOKEN;
    if (!selectedChild) throw new Error("Alege un copil mai întâi.");
    if (selectedChild.calendar_token) return selectedChild.calendar_token;

    const token = generateCalendarToken();
    const supabase = createBrowserSupabase();
    if (!supabase) throw new Error("Supabase nu este configurat.");
    const { data, error: updateError } = await supabase
      .from("children")
      .update({ calendar_token: token })
      .eq("id", selectedChild.id)
      .select("*")
      .single();
    if (updateError || !data) {
      throw new Error(updateError?.message ?? "Nu am putut crea linkul de calendar.");
    }
    const child = data as Child;
    setKids((current) =>
      current.map((row) => (row.id === child.id ? child : row)),
    );
    return child.calendar_token ?? token;
  }, [isDemo, selectedChild]);

  const selectWeek = useCallback(
    (week: number) => {
      if (!isDemo) return;
      setDemoWeek(week);
      writeWeekCookie(week);
    },
    [isDemo],
  );

  const signOut = useCallback(async () => {
    if (isDemo) {
      clearDemoSession();
      router.replace("/login");
      router.refresh();
      return;
    }
    const supabase = createBrowserSupabase();
    await supabase?.auth.signOut();
    document.cookie = `${CHILD_COOKIE}=; path=/; max-age=0`;
    router.replace("/login");
    router.refresh();
  }, [isDemo, router]);

  const value = useMemo<FamilyContextValue>(
    () => ({
      status,
      error,
      isDemo,
      family,
      children: kids,
      selectedChild,
      selectedWeek,
      weekTheme: getWeekTheme(selectedWeek),
      activities,
      completions,
      dayNotes,
      todayArchive,
      todayPhotoUrl,
      refresh,
      selectWeek,
      selectChild,
      addChild,
      updateFamily,
      toggleComplete,
      approveCompletion,
      saveDayNote,
      saveDayPhoto,
      removeDayPhoto,
      loadArchiveDays,
      loadBookletLive,
      signedPhotoUrl,
      downloadPhotoBytes,
      ensureCalendarToken,
      signOut,
    }),
    [
      activities,
      addChild,
      approveCompletion,
      completions,
      dayNotes,
      downloadPhotoBytes,
      ensureCalendarToken,
      error,
      family,
      isDemo,
      kids,
      loadArchiveDays,
      loadBookletLive,
      refresh,
      removeDayPhoto,
      saveDayNote,
      saveDayPhoto,
      selectChild,
      selectWeek,
      selectedChild,
      selectedWeek,
      signOut,
      signedPhotoUrl,
      status,
      todayArchive,
      todayPhotoUrl,
      toggleComplete,
      updateFamily,
    ],
  );

  return <FamilyContext.Provider value={value}>{tree}</FamilyContext.Provider>;
}

export function useFamily() {
  const value = useContext(FamilyContext);
  if (!value) {
    throw new Error("useFamily trebuie folosit în FamilyProvider.");
  }
  return value;
}

export function useOptionalSupabaseFlag() {
  return isSupabaseConfigured();
}
