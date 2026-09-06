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
  demoDayNotesForWeek,
  readDemoState,
  removeDemoCompletion,
  upsertDemoCompletion,
  upsertDemoDayNote,
  writeDemoState,
  type DemoState,
} from "@/lib/demo/store";
import { createBrowserSupabase } from "@/lib/supabase/client";
import type {
  Activity,
  Child,
  Completion,
  CompletionMode,
  DayNote,
  Family,
} from "@/lib/types";
import { bandFromBirthdate } from "@/lib/band";
import { normalizeDayNoteBody } from "@/lib/day-note";
import { normalizeActivity } from "@/lib/seed/week1";
import { DEMO_CALENDAR_TOKEN, generateCalendarToken } from "@/lib/calendar";
import {
  familyJoinFields,
  familyProgramWeek,
  familyProgramYearStart,
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
  refresh: () => Promise<void>;
  selectWeek: (week: number) => void;
  selectChild: (childId: string) => Promise<void>;
  addChild: (input: { name: string; birthdate: string | null }) => Promise<void>;
  updateFamily: (input: {
    display_name: string;
    default_mode: CompletionMode;
    monday_digest_email?: boolean;
  }) => Promise<void>;
  toggleComplete: (activityId: string) => Promise<void>;
  approveCompletion: (activityId: string) => Promise<void>;
  saveDayNote: (dayOfWeek: number, body: string) => Promise<void>;
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
    },
    [],
  );

  const refresh = useCallback(async () => {
    setError(null);
    if (isDemo) {
      applyDemo(readDemoState(), selectedWeek);
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
      const [
        { data: doneRows, error: doneError },
        { data: noteRows, error: noteError },
      ] = await Promise.all([
        supabase.from("completions").select("*").eq("child_id", nextSelected),
        supabase
          .from("day_notes")
          .select("*")
          .eq("child_id", nextSelected)
          .eq("program_year_start", yearStart)
          .eq("week_number", selectedWeek),
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
      setCompletions((doneRows ?? []) as Completion[]);
      setDayNotes((noteRows ?? []) as DayNote[]);
    } else {
      setCompletions([]);
      setDayNotes([]);
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
        return;
      }
      const supabase = createBrowserSupabase();
      if (!supabase || !family) return;
      const yearStart = familyProgramYearStart(family);
      const [
        { data, error: doneError },
        { data: noteRows, error: noteError },
      ] = await Promise.all([
        supabase.from("completions").select("*").eq("child_id", childId),
        supabase
          .from("day_notes")
          .select("*")
          .eq("child_id", childId)
          .eq("program_year_start", yearStart)
          .eq("week_number", selectedWeek),
      ]);
      if (doneError) {
        setError(doneError.message);
        return;
      }
      if (noteError) {
        setError(noteError.message);
        return;
      }
      setCompletions((data ?? []) as Completion[]);
      setDayNotes((noteRows ?? []) as DayNote[]);
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
    },
    [applyDemo, family, isDemo, selectedWeek],
  );

  const updateFamily = useCallback(
    async (input: {
      display_name: string;
      default_mode: CompletionMode;
      monday_digest_email?: boolean;
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
      } = {
        display_name: input.display_name,
        default_mode: input.default_mode,
      };
      if (input.monday_digest_email !== undefined) {
        payload.monday_digest_email = input.monday_digest_email;
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

  const toggleComplete = useCallback(
    async (activityId: string) => {
      if (!selectedChild || !family) return;
      const existing = completions.find((row) => row.activity_id === activityId);
      if (existing) {
        if (isDemo) {
          const next = removeDemoCompletion(readDemoState(), selectedChild.id, activityId);
          writeDemoState(next);
          setCompletions(next.completions);
          return;
        }
        const supabase = createBrowserSupabase();
        if (!supabase) return;
        const { error: deleteError } = await supabase
          .from("completions")
          .delete()
          .eq("id", existing.id);
        if (deleteError) throw new Error(deleteError.message);
        setCompletions((current) => current.filter((row) => row.id !== existing.id));
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
      setCompletions((current) => [...current, data as Completion]);
    },
    [completions, family, isDemo, selectedChild],
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
        setDayNotes(demoDayNotesForWeek(next, selectedWeek));
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
        setDayNotes((current) =>
          current.filter((note) => note.day_of_week !== dayOfWeek),
        );
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
      setDayNotes((current) => [
        ...current.filter((note) => note.day_of_week !== dayOfWeek),
        saved,
      ]);
    },
    [dayNotes, family, isDemo, selectedChild, selectedWeek],
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
      refresh,
      selectWeek,
      selectChild,
      addChild,
      updateFamily,
      toggleComplete,
      approveCompletion,
      saveDayNote,
      ensureCalendarToken,
      signOut,
    }),
    [
      activities,
      addChild,
      approveCompletion,
      completions,
      dayNotes,
      ensureCalendarToken,
      error,
      family,
      isDemo,
      kids,
      refresh,
      saveDayNote,
      selectChild,
      selectWeek,
      selectedChild,
      selectedWeek,
      signOut,
      status,
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
