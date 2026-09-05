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
  readDemoState,
  removeDemoCompletion,
  upsertDemoCompletion,
  writeDemoState,
  type DemoState,
} from "@/lib/demo/store";
import { createBrowserSupabase } from "@/lib/supabase/client";
import type {
  Activity,
  Child,
  Completion,
  CompletionMode,
  Family,
} from "@/lib/types";
import { bandFromBirthdate } from "@/lib/band";
import { normalizeActivity } from "@/lib/seed/week1";
import {
  getWeekTheme,
  PROGRAM_AGE_BAND,
  PROGRAM_WEEK,
  type ProgramWeek,
} from "@/lib/week";
import type { SeedActivity } from "@/lib/types";

type Status = "loading" | "ready" | "error";

type FamilyContextValue = {
  status: Status;
  error: string | null;
  isDemo: boolean;
  family: Family | null;
  children: Child[];
  selectedChild: Child | null;
  selectedWeek: ProgramWeek;
  weekTheme: string;
  activities: Activity[];
  completions: Completion[];
  refresh: () => Promise<void>;
  selectWeek: (week: ProgramWeek) => void;
  selectChild: (childId: string) => Promise<void>;
  addChild: (input: { name: string; birthdate: string | null }) => Promise<void>;
  updateFamily: (input: {
    display_name: string;
    default_mode: CompletionMode;
  }) => Promise<void>;
  toggleComplete: (activityId: string) => Promise<void>;
  approveCompletion: (activityId: string) => Promise<void>;
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

function writeWeekCookie(week: ProgramWeek) {
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
  initialWeek?: ProgramWeek;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);
  const [family, setFamily] = useState<Family | null>(null);
  const [kids, setKids] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<ProgramWeek>(initialWeek);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [completions, setCompletions] = useState<Completion[]>([]);

  const selectedChild = useMemo(
    () => kids.find((child) => child.id === selectedChildId) ?? kids[0] ?? null,
    [kids, selectedChildId],
  );

  const applyDemo = useCallback(
    (state: DemoState, week: ProgramWeek) => {
      setFamily(state.family);
      setKids(state.children.filter((child) => child.active));
      setSelectedChildId(state.selectedChildId);
      setActivities(demoActivities(week));
      setCompletions(state.completions);
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
      const { data: created, error: createError } = await supabase
        .from("families")
        .insert({ parent_id: user.id, display_name: user.email?.split("@")[0] })
        .select("*")
        .single();
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
      const { data: doneRows, error: doneError } = await supabase
        .from("completions")
        .select("*")
        .eq("child_id", nextSelected);
      if (doneError) {
        setError(doneError.message);
        setStatus("error");
        return;
      }
      setCompletions((doneRows ?? []) as Completion[]);
    } else {
      setCompletions([]);
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
        const state = readDemoState();
        writeDemoState({ ...state, selectedChildId: childId });
        setCompletions(state.completions);
        return;
      }
      const supabase = createBrowserSupabase();
      if (!supabase) return;
      const { data, error: doneError } = await supabase
        .from("completions")
        .select("*")
        .eq("child_id", childId);
      if (doneError) {
        setError(doneError.message);
        return;
      }
      setCompletions((data ?? []) as Completion[]);
    },
    [isDemo],
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
    },
    [applyDemo, family, isDemo, selectedWeek],
  );

  const updateFamily = useCallback(
    async (input: { display_name: string; default_mode: CompletionMode }) => {
      if (isDemo) {
        const state = readDemoState();
        const next = {
          ...state,
          family: {
            ...state.family,
            display_name: input.display_name,
            default_mode: input.default_mode,
          },
        };
        writeDemoState(next);
        setFamily(next.family);
        return;
      }
      const supabase = createBrowserSupabase();
      if (!supabase || !family) return;
      const { data, error: updateError } = await supabase
        .from("families")
        .update({
          display_name: input.display_name,
          default_mode: input.default_mode,
        })
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

  const selectWeek = useCallback((week: ProgramWeek) => {
    setSelectedWeek(week);
    writeWeekCookie(week);
  }, []);

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
      refresh,
      selectWeek,
      selectChild,
      addChild,
      updateFamily,
      toggleComplete,
      approveCompletion,
      signOut,
    }),
    [
      activities,
      addChild,
      approveCompletion,
      completions,
      error,
      family,
      isDemo,
      kids,
      refresh,
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
