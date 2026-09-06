"use client";

import { FormEvent, useState } from "react";
import { AddToCalendarButton } from "@/components/add-to-calendar-button";
import { MondayDigestSettings } from "@/components/monday-digest-settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useFamily } from "@/lib/family-context";
import { DIGEST_TOGGLE_HELP, DIGEST_TOGGLE_LABEL } from "@/lib/monday-digest";
import { PROGRAM_WEEKS, WEEK_THEMES } from "@/lib/week";
import type { CompletionMode } from "@/lib/types";

export default function SetariPage() {
  const { family, isDemo, updateFamily, signOut, children, selectedWeek, selectWeek } =
    useFamily();
  const [draft, setDraft] = useState<{
    displayName: string;
    modeB: boolean;
    mondayDigest: boolean;
  } | null>(null);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const displayName = draft?.displayName ?? family?.display_name ?? "";
  const modeB = draft?.modeB ?? family?.default_mode === "B";
  const mondayDigest =
    draft?.mondayDigest ?? family?.monday_digest_email !== false;

  async function onSave(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setSaved(false);
    try {
      const default_mode: CompletionMode = modeB ? "B" : "A";
      await updateFamily({
        display_name: displayName.trim(),
        default_mode,
        monday_digest_email: mondayDigest,
      });
      setDraft(null);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nu am putut salva.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl">Setări</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Familia, modul de lucru, ieșirea din cont.
        </p>
      </div>

      <form onSubmit={onSave} className="space-y-4 rounded-2xl border border-border bg-card p-4">
        <div className="space-y-2">
          <Label htmlFor="family-name">Numele familiei</Label>
          <Input
            id="family-name"
            value={displayName}
            onChange={(event) =>
              setDraft({ displayName: event.target.value, modeB, mondayDigest })
            }
            className="h-11"
          />
        </div>

        <div className="flex items-start justify-between gap-4 rounded-xl bg-muted/60 px-3 py-3">
          <div>
            <p className="text-sm font-medium">Mod B — autonomie + aprobare</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Oprit: mod A, părintele face împreună / pentru copil (implicit sub ~7
              ani). Pornit: copilul bifează, părintele aprobă.
            </p>
          </div>
          <Switch
            checked={modeB}
            onCheckedChange={(checked) =>
              setDraft({ displayName, modeB: Boolean(checked), mondayDigest })
            }
            aria-label="Activează modul B"
          />
        </div>

        <div className="flex items-start justify-between gap-4 rounded-xl bg-muted/60 px-3 py-3">
          <div>
            <p className="text-sm font-medium">{DIGEST_TOGGLE_LABEL}</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {DIGEST_TOGGLE_HELP}
            </p>
          </div>
          <Switch
            checked={mondayDigest}
            onCheckedChange={(checked) =>
              setDraft({ displayName, modeB, mondayDigest: Boolean(checked) })
            }
            aria-label={DIGEST_TOGGLE_LABEL}
          />
        </div>

        <p className="text-xs text-muted-foreground">
          {children.length}{" "}
          {children.length === 1 ? "copil activ" : "copii activi"} în familie.
        </p>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        {saved ? <p className="text-sm text-primary">Salvat.</p> : null}

        <Button type="submit" className="h-11 w-full" disabled={busy}>
          {busy ? "Salvez…" : "Salvează familia"}
        </Button>
      </form>

      <MondayDigestSettings />

      <AddToCalendarButton />

      <div className="rounded-2xl border border-border bg-card p-4 text-sm leading-6 text-muted-foreground">
        <p>
          V1 publică doar banda 1–2, săptămâna 1. Gazda țintă:{" "}
          <span className="text-foreground">educatie.echilibru-cartea.ro</span>.
        </p>
        {isDemo ? (
          <div className="mt-3 space-y-2">
            <p>Ești în demonstrație locală. Datele nu sunt în Supabase.</p>
            <details className="rounded-xl bg-muted/60 px-3 py-2">
              <summary className="cursor-pointer text-xs font-medium text-foreground">
                Schimbă săptămâna (doar demonstrație)
              </summary>
              <label className="mt-2 block text-xs" htmlFor="demo-week">
                Săptămâna de program
              </label>
              <select
                id="demo-week"
                className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-2 text-sm"
                value={selectedWeek}
                onChange={(event) => selectWeek(Number(event.target.value))}
              >
                {PROGRAM_WEEKS.map((week) => (
                  <option key={week} value={week}>
                    S{week} · {WEEK_THEMES[week]}
                  </option>
                ))}
              </select>
            </details>
          </div>
        ) : null}
      </div>

      <Button variant="outline" className="h-11 w-full" onClick={() => void signOut()}>
        Ieși din cont
      </Button>
    </section>
  );
}
