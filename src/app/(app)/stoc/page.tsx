"use client";

import { useEffect, useMemo, useState } from "react";
import { Camera, ListChecks, Package, PackagePlus, Pencil, Trash2 } from "lucide-react";
import { EmptyState } from "@/components/status-blocks";
import { useFamily } from "@/lib/family-context";
import {
  ageBadge,
  ageRangeLabel,
  foldText,
  GIFTED_STARTER,
  STARTER_LIST,
  starterDrafts,
  STOC_CATEGORII,
  STOC_CATEGORIE_LABEL,
  STOC_SAFETY_NOTE,
  STOC_STARE_LABEL,
  STOC_TIP_LABEL,
  unusedForWeeks,
  saveManualItem,
  validateDraft,
  type StarterItem,
  type StocCategorie,
  type StocItem,
  type StocPatch,
  type StocStare,
  type StocTip,
} from "@/lib/stoc";
import { useStoc } from "@/lib/stoc-context";
import { cn } from "@/lib/utils";

type View = "lista" | "adauga" | "inceput";

const field = "w-full rounded-xl border border-border bg-background px-3 py-2 text-base";
const chip = (active: boolean) =>
  cn(
    "rounded-full border px-3 py-1.5 text-sm font-medium",
    active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card",
  );

function numberOrNull(value: string): number | null {
  if (!value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function ManualForm({ onDone }: { onDone: () => void }) {
  const stoc = useStoc();
  const [nume, setNume] = useState("");
  const [tip, setTip] = useState<StocTip | null>(null);
  const [categorie, setCategorie] = useState<StocCategorie | null>(null);
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [loc, setLoc] = useState("");
  const [stare, setStare] = useState<StocStare>("bun");
  const [note, setNote] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  // Set when the row is saved but its photo failed: retry uploads only.
  const [savedId, setSavedId] = useState<string | null>(null);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    const draft = {
      nume,
      tip: tip ?? undefined,
      categorie: categorie ?? undefined,
      varsta_min_luni: numberOrNull(min),
      varsta_max_luni: numberOrNull(max),
      loc,
      stare,
      note,
      sursa: "manual" as const,
    };
    const problem = savedId ? null : validateDraft(draft);
    if (problem) {
      setError(problem);
      return;
    }
    setSaving(true);
    setError(null);
    const result = await saveManualItem({
      savedId,
      draft: { ...draft, tip: tip!, categorie: categorie! },
      photo,
      addItems: stoc.addItems,
      setPhoto: stoc.setPhoto,
    });
    setSaving(false);
    setSavedId(result.savedId);
    if (result.error) {
      setError(result.error);
      return;
    }
    onDone();
  }

  return (
    <form onSubmit={save} className="space-y-4 rounded-2xl border border-border bg-card p-4" data-testid="stoc-formular">
      <h2 className="font-heading text-xl">Adaugă manual</h2>
      <div className="space-y-1">
        <label htmlFor="stoc-nume" className="text-sm font-medium">
          Nume *
        </label>
        <input
          id="stoc-nume"
          className={field}
          value={nume}
          onChange={(event) => {
            setNume(event.target.value);
            if (error) setError(null);
          }}
          placeholder="de exemplu: tobă veche, găleată albastră"
          autoComplete="off"
        />
      </div>
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Tip *</legend>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(STOC_TIP_LABEL) as StocTip[]).map((key) => (
            <button
              key={key}
              type="button"
              className={chip(tip === key)}
              aria-pressed={tip === key}
              onClick={() => {
                setTip(key);
                setError(null);
              }}
            >
              {STOC_TIP_LABEL[key]}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Categorie *</legend>
        <div className="flex flex-wrap gap-2">
          {STOC_CATEGORII.map((item) => (
            <button
              key={item.key}
              type="button"
              className={chip(categorie === item.key)}
              aria-pressed={categorie === item.key}
              onClick={() => {
                setCategorie(item.key);
                setError(null);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </fieldset>
      <details className="rounded-xl bg-muted/40 px-3 py-2">
        <summary className="cursor-pointer text-sm font-medium">Opțional: vârstă, poză, loc, stare, note</summary>
        <div className="mt-3 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="stoc-min" className="text-sm">Vârsta de la (luni)</label>
              <input id="stoc-min" inputMode="numeric" className={field} value={min} onChange={(event) => setMin(event.target.value)} />
            </div>
            <div className="space-y-1">
              <label htmlFor="stoc-max" className="text-sm">până la (luni)</label>
              <input id="stoc-max" inputMode="numeric" className={field} value={max} onChange={(event) => setMax(event.target.value)} />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm">Poză</p>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium">
              <Camera className="size-4" aria-hidden />
              {photo ? "Schimbă poza" : "Alege o poză"}
              <input
                id="stoc-poza"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) => setPhoto(event.target.files?.[0] ?? null)}
              />
            </label>
            {photo ? <p className="truncate text-xs text-muted-foreground">{photo.name}</p> : null}
          </div>
          <div className="space-y-1">
            <label htmlFor="stoc-loc" className="text-sm">Unde e ținut</label>
            <input id="stoc-loc" className={field} value={loc} onChange={(event) => setLoc(event.target.value)} placeholder="de exemplu: raftul din hol" />
          </div>
          <div className="space-y-1">
            <label htmlFor="stoc-stare" className="text-sm">Stare</label>
            <select id="stoc-stare" className={field} value={stare} onChange={(event) => setStare(event.target.value as StocStare)}>
              {(Object.keys(STOC_STARE_LABEL) as StocStare[]).map((key) => (
                <option key={key} value={key}>
                  {STOC_STARE_LABEL[key]}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label htmlFor="stoc-note" className="text-sm">Note</label>
            <textarea id="stoc-note" className={field} rows={2} value={note} onChange={(event) => setNote(event.target.value)} />
          </div>
        </div>
      </details>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <div className="flex flex-wrap gap-2">
        <button type="submit" disabled={saving} className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60">
          {saving ? "Se salvează…" : savedId ? "Încearcă din nou poza" : "Salvează în stoc"}
        </button>
        <button type="button" onClick={onDone} className="rounded-xl border border-border px-4 py-2 text-sm font-medium">
          Renunță
        </button>
      </div>
    </form>
  );
}

function StarterChecklist({ onDone }: { onDone: () => void }) {
  const stoc = useStoc();
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const owned = useMemo(() => {
    const keys = new Set(stoc.items.map((item) => item.produs_cheie).filter(Boolean));
    const names = new Set(stoc.items.map((item) => foldText(item.nume)));
    return (item: StarterItem) =>
      (item.produs_cheie != null && keys.has(item.produs_cheie)) || names.has(foldText(item.nume));
  }, [stoc.items]);
  const all = [...STARTER_LIST, ...GIFTED_STARTER.flatMap((week) => week.items)];

  function toggle(key: string) {
    setPicked((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      await stoc.addItems(starterDrafts(all.filter((item) => picked.has(item.key))));
      setPicked(new Set());
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nu am putut salva.");
    } finally {
      setSaving(false);
    }
  }

  const row = (item: StarterItem) => {
    const have = owned(item);
    return (
      <label key={item.key} className={cn("flex items-center gap-3 py-1.5 text-sm", have && "text-muted-foreground")}>
        <input
          type="checkbox"
          className="size-5 accent-[var(--primary)]"
          checked={have || picked.has(item.key)}
          disabled={have}
          onChange={() => toggle(item.key)}
        />
        <span className="min-w-0 flex-1">
          {item.nume}
          {item.tip === "facut_acasa" ? <span className="text-muted-foreground"> · făcut acasă</span> : null}
          {have ? <span> · în stoc</span> : null}
        </span>
      </label>
    );
  };

  return (
    <section className="space-y-4 rounded-2xl border border-border bg-card p-4 pr-5" data-testid="stoc-lista-inceput">
      <div>
        <h2 className="font-heading text-xl">Lista de început</h2>
        <p className="text-sm text-muted-foreground">Bifați ce aveți deja în casă. Le salvăm pe toate deodată.</p>
      </div>
      {STOC_CATEGORII.map((category) => (
        <div key={category.key}>
          <h3 className="text-sm font-medium">{category.label}</h3>
          {STARTER_LIST.filter((item) => item.categorie === category.key).map(row)}
        </div>
      ))}
      <div className="border-t border-border pt-3">
        <h3 className="font-medium">Din planul avansat: cele 18 materiale din banda 2–3, săptămânile 1–4</h3>
        {GIFTED_STARTER.map((week) => (
          <div key={week.saptamana} className="mt-2">
            <h4 className="text-sm font-medium">S{week.saptamana}</h4>
            {week.items.map(row)}
          </div>
        ))}
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <div className="sticky bottom-20 flex flex-wrap gap-2 bg-card/95 py-2 md:bottom-0">
        <button
          type="button"
          disabled={saving || picked.size === 0}
          onClick={() => void save()}
          className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
        >
          {saving ? "Se salvează…" : `Adaugă bifatele (${picked.size})`}
        </button>
        <button type="button" onClick={onDone} className="rounded-xl border border-border px-4 py-2 text-sm font-medium">
          Înapoi la stoc
        </button>
      </div>
    </section>
  );
}

function EditItem({
  item,
  busy,
  onSave,
  onCancel,
}: {
  item: StocItem;
  busy: boolean;
  onSave: (patch: StocPatch) => void;
  onCancel: () => void;
}) {
  const [stare, setStare] = useState<StocStare>(item.stare);
  const [loc, setLoc] = useState(item.loc ?? "");
  const [min, setMin] = useState(item.varsta_min_luni?.toString() ?? "");
  const [max, setMax] = useState(item.varsta_max_luni?.toString() ?? "");
  const [note, setNote] = useState(item.note ?? "");
  const id = (name: string) => `edit-${item.id}-${name}`;
  return (
    <form
      className="mt-3 space-y-3 rounded-xl bg-muted/40 p-3"
      data-testid="stoc-editeaza"
      onSubmit={(event) => {
        event.preventDefault();
        onSave({
          stare,
          loc,
          note,
          varsta_min_luni: numberOrNull(min),
          varsta_max_luni: numberOrNull(max),
        });
      }}
    >
      <div className="space-y-1">
        <label htmlFor={id("stare")} className="text-sm">Stare</label>
        <select id={id("stare")} className={field} value={stare} onChange={(event) => setStare(event.target.value as StocStare)}>
          {(Object.keys(STOC_STARE_LABEL) as StocStare[]).map((key) => (
            <option key={key} value={key}>
              {STOC_STARE_LABEL[key]}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1">
        <label htmlFor={id("loc")} className="text-sm">Unde e ținut</label>
        <input id={id("loc")} className={field} value={loc} onChange={(event) => setLoc(event.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label htmlFor={id("min")} className="text-sm">Vârsta de la (luni)</label>
          <input id={id("min")} inputMode="numeric" className={field} value={min} onChange={(event) => setMin(event.target.value)} />
        </div>
        <div className="space-y-1">
          <label htmlFor={id("max")} className="text-sm">până la (luni)</label>
          <input id={id("max")} inputMode="numeric" className={field} value={max} onChange={(event) => setMax(event.target.value)} />
        </div>
      </div>
      <div className="space-y-1">
        <label htmlFor={id("note")} className="text-sm">Note</label>
        <textarea id={id("note")} className={field} rows={2} value={note} onChange={(event) => setNote(event.target.value)} />
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="submit" disabled={busy} className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60">
          {busy ? "Se salvează…" : "Salvează"}
        </button>
        <button type="button" onClick={onCancel} className="rounded-xl border border-border px-4 py-2 text-sm font-medium">
          Renunță
        </button>
      </div>
    </form>
  );
}

function ItemCard({ item }: { item: StocItem }) {
  const stoc = useStoc();
  const [url, setUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  useEffect(() => {
    let cancelled = false;
    void stoc.photoUrl(item).then((value) => {
      if (!cancelled) setUrl(value);
    });
    return () => {
      cancelled = true;
    };
  }, [item, stoc]);
  const badge = ageBadge(item, stoc.childMonths);
  const age = ageRangeLabel(item.varsta_min_luni, item.varsta_max_luni);

  async function run(action: () => Promise<void>) {
    setBusy(true);
    setError(null);
    try {
      await action();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nu am putut salva.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <li className="flex gap-3 rounded-2xl border border-border bg-background p-3">
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element -- signed private URL
        <img src={url} alt={item.nume} className="size-16 shrink-0 rounded-xl object-cover" />
      ) : (
        <label className="flex size-16 shrink-0 cursor-pointer flex-col items-center justify-center rounded-xl bg-muted text-[11px] text-muted-foreground">
          <Camera className="size-5" aria-hidden />
          Poză
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={busy}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void run(() => stoc.setPhoto(item.id, file));
            }}
          />
        </label>
      )}
      <div className="min-w-0 flex-1 text-sm">
        <p className="text-base font-medium leading-6">{item.nume}</p>
        <p className="text-muted-foreground">
          {STOC_TIP_LABEL[item.tip]}
          {item.stare !== "bun" ? ` · ${STOC_STARE_LABEL[item.stare]}` : ""}
          {item.loc ? ` · ${item.loc}` : ""}
          {age ? ` · ${age}` : ""}
        </p>
        {badge ? (
          <p
            className={cn(
              "mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium",
              badge.kind === "peste"
                ? "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100"
                : "bg-muted text-muted-foreground",
            )}
          >
            {badge.label}
          </p>
        ) : null}
        {badge?.kind === "peste" ? <p className="mt-1 text-xs text-muted-foreground">{STOC_SAFETY_NOTE}</p> : null}
        {item.note ? <p className="mt-1">{item.note}</p> : null}
        {editing ? (
          <EditItem
            item={item}
            busy={busy}
            onCancel={() => setEditing(false)}
            onSave={(patch) =>
              void run(async () => {
                await stoc.updateItem(item.id, patch);
                setEditing(false);
              })
            }
          />
        ) : null}
        {error ? <p className="mt-1 text-destructive">{error}</p> : null}
      </div>
      <div className="flex shrink-0 flex-col items-center gap-1 self-start">
        <button
          type="button"
          aria-label={`Modifică ${item.nume}`}
          aria-expanded={editing}
          className="rounded-full p-2 text-muted-foreground hover:bg-muted"
          disabled={busy}
          onClick={() => setEditing((current) => !current)}
        >
          <Pencil className="size-4" aria-hidden />
        </button>
        <button
          type="button"
          aria-label={`Șterge ${item.nume}`}
          className="rounded-full p-2 text-muted-foreground hover:bg-muted"
          disabled={busy}
          onClick={() => {
            if (window.confirm(`Ștergem „${item.nume}” din stoc?`)) void run(() => stoc.removeItem(item.id));
          }}
        >
          <Trash2 className="size-4" aria-hidden />
        </button>
      </div>
    </li>
  );
}

export default function StocPage() {
  const { family } = useFamily();
  const stoc = useStoc();
  const [view, setView] = useState<View>(() => {
    if (typeof window === "undefined") return "lista";
    const wanted = new URLSearchParams(window.location.search).get("vedere");
    return wanted === "adauga" || wanted === "inceput" ? wanted : "lista";
  });

  if (!family) return <EmptyState title="Fără familie" body="Intrați în cont ca să vedeți stocul." />;

  if (stoc.status === "loading") {
    return <p className="text-sm text-muted-foreground">Se încarcă stocul…</p>;
  }

  if (stoc.status === "unavailable") {
    return (
      <EmptyState
        title="Stocul nu e încă pornit"
        body="Îl pornim după actualizarea bazei de date. Până atunci, restul aplicației merge ca înainte."
      />
    );
  }

  const unused = unusedForWeeks(stoc.items, stoc.uses, new Date());
  const groups = STOC_CATEGORII.map((category) => ({
    ...category,
    items: stoc.items.filter((item) => item.categorie === category.key),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="space-y-5 pb-24 md:pb-8">
      <header className="space-y-3">
        <div>
          <h1 className="font-heading text-3xl">Stoc</h1>
          <p className="text-sm text-muted-foreground">
            Materialele didactice pe care le aveți deja, cumpărate sau făcute acasă. Le folosim primele în
            activități.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setView("adauga")}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            <PackagePlus className="size-4" aria-hidden />
            Adaugă în stoc
          </button>
          <button
            type="button"
            onClick={() => setView("inceput")}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium"
          >
            <ListChecks className="size-4" aria-hidden />
            Lista de început
          </button>
        </div>
      </header>

      {view === "adauga" ? <ManualForm onDone={() => setView("lista")} /> : null}
      {view === "inceput" ? <StarterChecklist onDone={() => setView("lista")} /> : null}

      {view === "lista" ? (
        stoc.items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-5 text-sm">
            <Package className="mb-2 size-6 text-primary" aria-hidden />
            <p className="font-medium">Stocul e gol.</p>
            <p className="text-muted-foreground">
              Începeți cu „Lista de început” și bifați ce aveți deja, sau adăugați manual un articol.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              {stoc.items.length} {stoc.items.length === 1 ? "articol" : "articole"} în stoc
            </p>
            {groups.map((group) => (
              <section key={group.key} className="space-y-2">
                <h2 className="font-heading text-lg">{STOC_CATEGORIE_LABEL[group.key]}</h2>
                <ul className="space-y-2">
                  {group.items.map((item) => (
                    <ItemCard key={item.id} item={item} />
                  ))}
                </ul>
              </section>
            ))}
            {unused.length > 0 ? (
              <details className="rounded-2xl border border-border bg-card p-4 text-sm">
                <summary className="cursor-pointer font-medium">
                  Nefolosite de peste 4 săptămâni ({unused.length})
                </summary>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {unused.map((item) => (
                    <li key={item.id}>{item.nume}</li>
                  ))}
                </ul>
              </details>
            ) : null}
          </>
        )
      ) : null}
    </div>
  );
}
