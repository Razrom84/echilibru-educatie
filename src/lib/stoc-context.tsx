"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { compressDayPhoto } from "@/lib/archive-photo";
import { useFamily } from "@/lib/family-context";
import { bucharestToday } from "@/lib/program-week";
import {
  ageInMonths,
  photoPath,
  STOC_BUCKET,
  STOC_DEMO_KEY,
  validateDraft,
  type StocDraft,
  type StocFolosire,
  type StocItem,
  type StocPatch,
} from "@/lib/stoc";
import { createBrowserSupabase } from "@/lib/supabase/client";

type StocStatus = "loading" | "ready" | "unavailable";

type StocContextValue = {
  status: StocStatus;
  items: StocItem[];
  uses: StocFolosire[];
  childMonths: number | null;
  addItems: (drafts: StocDraft[], photo?: File | null) => Promise<StocItem[]>;
  setPhoto: (itemId: string, file: File) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateItem: (itemId: string, patch: StocPatch) => Promise<void>;
  markUsed: (stocId: string, activityId: string) => Promise<void>;
  photoUrl: (item: StocItem) => Promise<string | null>;
};

const StocContext = createContext<StocContextValue | null>(null);

type DemoState = { items: StocItem[]; uses: StocFolosire[]; photos: Record<string, string> };

function readDemo(): DemoState {
  try {
    const raw = window.localStorage.getItem(STOC_DEMO_KEY);
    if (raw) return { photos: {}, ...(JSON.parse(raw) as Partial<DemoState>) } as DemoState;
  } catch {
    /* ignore */
  }
  return { items: [], uses: [], photos: {} };
}

function writeDemo(state: DemoState) {
  try {
    window.localStorage.setItem(STOC_DEMO_KEY, JSON.stringify(state));
  } catch {
    /* quota or private mode: keep in memory only */
  }
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function newId(): string {
  return crypto.randomUUID();
}

const COLUMNS =
  "id, family_id, nume, tip, categorie, produs_cheie, material_id, stare, loc, varsta_min_luni, varsta_max_luni, poza_url, sursa, data, pret_platit, note, created_at, updated_at";

export function StocProvider({ children }: { children: React.ReactNode }) {
  const { isDemo, family, selectedChild } = useFamily();
  const familyId = family?.id ?? null;
  const [status, setStatus] = useState<StocStatus>("loading");
  const [items, setItems] = useState<StocItem[]>([]);
  const [uses, setUses] = useState<StocFolosire[]>([]);
  const childMonths = ageInMonths(selectedChild?.birthdate, bucharestToday());

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (isDemo) {
        const state = readDemo();
        if (cancelled) return;
        setItems(state.items);
        setUses(state.uses);
        setStatus("ready");
        return;
      }
      const supabase = createBrowserSupabase();
      if (!supabase || !familyId) {
        setStatus("unavailable");
        return;
      }
      const [stock, used] = await Promise.all([
        supabase.from("stoc_materiale").select(COLUMNS).eq("family_id", familyId).order("created_at"),
        supabase.from("stoc_folosiri").select("*").eq("family_id", familyId),
      ]);
      if (cancelled) return;
      if (stock.error) {
        // Table not in Familie yet, or no access: the rest of the app keeps working.
        setStatus("unavailable");
        return;
      }
      setItems((stock.data ?? []) as StocItem[]);
      setUses(used.error ? [] : ((used.data ?? []) as StocFolosire[]));
      setStatus("ready");
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [familyId, isDemo]);

  const addItems = useCallback(
    async (drafts: StocDraft[], photo?: File | null) => {
      if (!familyId) throw new Error("Nu găsim familia.");
      for (const draft of drafts) {
        const problem = validateDraft(draft);
        if (problem) throw new Error(problem);
      }
      const now = new Date().toISOString();
      const rows: StocItem[] = drafts.map((draft) => ({
        id: newId(),
        family_id: familyId,
        nume: draft.nume.trim(),
        tip: draft.tip,
        categorie: draft.categorie,
        produs_cheie: draft.produs_cheie ?? null,
        material_id: draft.material_id ?? null,
        stare: draft.stare ?? "bun",
        loc: draft.loc?.trim() || null,
        varsta_min_luni: draft.varsta_min_luni ?? null,
        varsta_max_luni: draft.varsta_max_luni ?? null,
        poza_url: null,
        sursa: draft.sursa,
        data: null,
        pret_platit: null,
        note: draft.note?.trim() || null,
        created_at: now,
        updated_at: now,
      }));
      if (isDemo) {
        const state = readDemo();
        if (photo && rows.length === 1) {
          const jpeg = await compressDayPhoto(photo);
          state.photos[rows[0].id] = await blobToDataUrl(jpeg);
          rows[0].poza_url = `demo:${rows[0].id}`;
        }
        const next = { ...state, items: [...state.items, ...rows] };
        writeDemo(next);
        setItems(next.items);
        return rows;
      }
      const supabase = createBrowserSupabase();
      if (!supabase) throw new Error("Supabase nu este configurat.");
      const insert = rows.map((row) => {
        const { created_at: _c, updated_at: _u, ...rest } = row;
        void _c;
        void _u;
        return rest;
      });
      const { data, error } = await supabase.from("stoc_materiale").insert(insert).select(COLUMNS);
      if (error) throw new Error(error.message);
      let saved = (data ?? []) as StocItem[];
      if (photo && saved.length === 1) {
        const path = photoPath(familyId, saved[0].id);
        const jpeg = await compressDayPhoto(photo);
        const upload = await supabase.storage
          .from(STOC_BUCKET)
          .upload(path, jpeg, { upsert: true, contentType: "image/jpeg", cacheControl: "3600" });
        if (upload.error) throw new Error(upload.error.message);
        const updated = await supabase
          .from("stoc_materiale")
          .update({ poza_url: path })
          .eq("id", saved[0].id)
          .select(COLUMNS)
          .single();
        if (!updated.error && updated.data) saved = [updated.data as StocItem];
      }
      setItems((current) => [...current, ...saved]);
      return saved;
    },
    [familyId, isDemo],
  );

  const setPhoto = useCallback(
    async (itemId: string, file: File) => {
      if (!familyId) return;
      const jpeg = await compressDayPhoto(file);
      if (isDemo) {
        const state = readDemo();
        state.photos[itemId] = await blobToDataUrl(jpeg);
        state.items = state.items.map((item) =>
          item.id === itemId ? { ...item, poza_url: `demo:${itemId}` } : item,
        );
        writeDemo(state);
        setItems(state.items);
        return;
      }
      const supabase = createBrowserSupabase();
      if (!supabase) return;
      const path = photoPath(familyId, itemId);
      const upload = await supabase.storage
        .from(STOC_BUCKET)
        .upload(path, jpeg, { upsert: true, contentType: "image/jpeg", cacheControl: "3600" });
      if (upload.error) throw new Error(upload.error.message);
      const { error } = await supabase.from("stoc_materiale").update({ poza_url: path }).eq("id", itemId);
      if (error) throw new Error(error.message);
      setItems((current) =>
        current.map((item) => (item.id === itemId ? { ...item, poza_url: path } : item)),
      );
    },
    [familyId, isDemo],
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      if (isDemo) {
        const state = readDemo();
        delete state.photos[itemId];
        state.items = state.items.filter((item) => item.id !== itemId);
        state.uses = state.uses.filter((use) => use.stoc_id !== itemId);
        writeDemo(state);
        setItems(state.items);
        setUses(state.uses);
        return;
      }
      const supabase = createBrowserSupabase();
      if (!supabase) return;
      const item = items.find((row) => row.id === itemId);
      const { error } = await supabase.from("stoc_materiale").delete().eq("id", itemId);
      if (error) throw new Error(error.message);
      if (item?.poza_url) await supabase.storage.from(STOC_BUCKET).remove([item.poza_url]);
      setItems((current) => current.filter((row) => row.id !== itemId));
      setUses((current) => current.filter((use) => use.stoc_id !== itemId));
    },
    [isDemo, items],
  );

  const updateItem = useCallback(
    async (itemId: string, patch: StocPatch) => {
      const current = items.find((row) => row.id === itemId);
      if (!current) return;
      const problem = validateDraft({ ...current, ...patch });
      if (problem) throw new Error(problem);
      const clean: StocPatch = {
        ...patch,
        ...(patch.loc !== undefined ? { loc: patch.loc?.trim() || null } : {}),
        ...(patch.note !== undefined ? { note: patch.note?.trim() || null } : {}),
      };
      if (isDemo) {
        const state = readDemo();
        state.items = state.items.map((row) =>
          row.id === itemId ? { ...row, ...clean, updated_at: new Date().toISOString() } : row,
        );
        writeDemo(state);
        setItems(state.items);
        return;
      }
      const supabase = createBrowserSupabase();
      if (!supabase) return;
      const { data, error } = await supabase
        .from("stoc_materiale")
        .update(clean)
        .eq("id", itemId)
        .select(COLUMNS)
        .single();
      if (error) throw new Error(error.message);
      setItems((rows) => rows.map((row) => (row.id === itemId ? (data as StocItem) : row)));
    },
    [isDemo, items],
  );

  const markUsed = useCallback(
    async (stocId: string, activityId: string) => {
      if (!familyId) return;
      if (uses.some((use) => use.stoc_id === stocId && use.activity_id === activityId)) return;
      const row: StocFolosire = {
        id: newId(),
        stoc_id: stocId,
        activity_id: activityId,
        family_id: familyId,
        created_at: new Date().toISOString(),
      };
      if (isDemo) {
        const state = readDemo();
        state.uses = [...state.uses, row];
        writeDemo(state);
        setUses(state.uses);
        return;
      }
      const supabase = createBrowserSupabase();
      if (!supabase) return;
      // Only stoc_folosiri. Ticks (completions) are never touched from here.
      const { data, error } = await supabase
        .from("stoc_folosiri")
        .insert({ stoc_id: stocId, activity_id: activityId, family_id: familyId })
        .select("*")
        .single();
      if (error) throw new Error(error.message);
      setUses((current) => [...current, data as StocFolosire]);
    },
    [familyId, isDemo, uses],
  );

  const photoUrl = useCallback(
    async (item: StocItem) => {
      if (!item.poza_url) return null;
      if (isDemo) return readDemo().photos[item.id] ?? null;
      const supabase = createBrowserSupabase();
      if (!supabase) return null;
      const signed = await supabase.storage.from(STOC_BUCKET).createSignedUrl(item.poza_url, 3600);
      return signed.data?.signedUrl ?? null;
    },
    [isDemo],
  );

  const value = useMemo(
    () => ({ status, items, uses, childMonths, addItems, setPhoto, removeItem, updateItem, markUsed, photoUrl }),
    [status, items, uses, childMonths, addItems, setPhoto, removeItem, updateItem, markUsed, photoUrl],
  );
  return <StocContext.Provider value={value}>{children}</StocContext.Provider>;
}

const EMPTY: StocContextValue = {
  status: "unavailable",
  items: [],
  uses: [],
  childMonths: null,
  addItems: async () => [],
  setPhoto: async () => {},
  removeItem: async () => {},
  updateItem: async () => {},
  markUsed: async () => {},
  photoUrl: async () => null,
};

/** Outside the provider (tests, isolated renders) the stock is simply empty. */
export function useStoc(): StocContextValue {
  return useContext(StocContext) ?? EMPTY;
}
