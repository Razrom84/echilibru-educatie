"use client";

import { useState } from "react";
import { Check, Package } from "lucide-react";
import type { CatalogMaterial } from "@/lib/gifted";
import { STOC_CATEGORIE_LABEL, stockForMaterial } from "@/lib/stoc";
import { useStoc } from "@/lib/stoc-context";

/**
 * „Din stocul vostru” on the activity page. „Folosesc asta aici” only writes
 * stoc_folosiri; it never ticks the activity.
 */
export function StocForActivity({
  activityId,
  linked,
}: {
  activityId: string;
  linked: readonly CatalogMaterial[];
}) {
  const stoc = useStoc();
  const [choice, setChoice] = useState("");
  const [error, setError] = useState<string | null>(null);
  if (stoc.status !== "ready" || stoc.items.length === 0) return null;

  const matched = new Map(
    linked.flatMap((material) => stockForMaterial(stoc.items, material)).map((item) => [item.id, item]),
  );
  const usedHere = new Set(
    stoc.uses.filter((use) => use.activity_id === activityId).map((use) => use.stoc_id),
  );
  for (const id of usedHere) {
    const item = stoc.items.find((row) => row.id === id);
    if (item) matched.set(item.id, item);
  }
  const others = stoc.items.filter((item) => !matched.has(item.id) && item.stare !== "pierdut");

  async function use(stocId: string) {
    setError(null);
    try {
      await stoc.markUsed(stocId, activityId);
      setChoice("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nu am putut salva.");
    }
  }

  return (
    <section className="mt-4 rounded-2xl border border-border bg-background px-3 py-3" data-testid="stoc-activitate">
      <p className="flex items-center gap-2 text-sm font-medium">
        <Package className="size-4 text-primary" aria-hidden />
        Din stocul vostru
      </p>
      {[...matched.values()].map((item) => (
        <div key={item.id} className="mt-2 flex flex-wrap items-center justify-between gap-2 text-sm">
          <span>
            {item.nume}
            <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-100">
              <Check className="size-3" aria-hidden />
              Ai deja în stoc{item.loc ? ` · ${item.loc}` : ""}
            </span>
          </span>
          {usedHere.has(item.id) ? (
            <span className="text-xs text-muted-foreground">Folosit aici</span>
          ) : (
            <button
              type="button"
              className="rounded-xl border border-border bg-card px-3 py-1.5 text-sm font-medium"
              onClick={() => void use(item.id)}
            >
              Folosesc asta aici
            </button>
          )}
        </div>
      ))}
      {others.length > 0 ? (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <label htmlFor={`stoc-${activityId}`} className="text-muted-foreground">
            Folosiți altceva din stoc?
          </label>
          <select
            id={`stoc-${activityId}`}
            className="min-w-0 rounded-xl border border-border bg-card px-2 py-1.5"
            value={choice}
            onChange={(event) => setChoice(event.target.value)}
          >
            <option value="">Alegeți…</option>
            {others.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nume} · {STOC_CATEGORIE_LABEL[item.categorie]}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="rounded-xl border border-border bg-card px-3 py-1.5 font-medium disabled:opacity-60"
            disabled={!choice}
            onClick={() => void use(choice)}
          >
            Folosesc asta aici
          </button>
        </div>
      ) : null}
      {error ? <p className="mt-2 text-sm text-destructive">{error}</p> : null}
    </section>
  );
}
