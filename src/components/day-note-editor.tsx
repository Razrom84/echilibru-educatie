"use client";

import { FormEvent, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DAY_NOTE_HELP,
  DAY_NOTE_LABEL,
  DAY_NOTE_MAX_LENGTH,
  DAY_NOTE_PLACEHOLDER,
  DAY_NOTE_SAVE,
  DAY_NOTE_SAVED,
  findDayNote,
} from "@/lib/day-note";
import { useFamily } from "@/lib/family-context";
import { cn } from "@/lib/utils";

export function DayNoteEditor({
  dayOfWeek,
  embedded = false,
}: {
  dayOfWeek: number;
  embedded?: boolean;
}) {
  const { dayNotes, saveDayNote, selectedChild } = useFamily();
  const fieldId = useId();
  const stored = findDayNote(dayNotes, dayOfWeek)?.body ?? "";
  const [draft, setDraft] = useState(stored);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!selectedChild) return null;

  async function onSave(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setSaved(false);
    try {
      await saveDayNote(dayOfWeek, draft);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nu am putut salva.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={onSave}
      className={cn(
        "space-y-2",
        embedded
          ? "mt-4 border-t border-border pt-3"
          : "rounded-2xl border border-border bg-card p-4",
      )}
    >
      <Label htmlFor={fieldId}>{DAY_NOTE_LABEL}</Label>
      <p id={`${fieldId}-help`} className="text-xs leading-5 text-muted-foreground">
        {DAY_NOTE_HELP}
      </p>
      <Textarea
        id={fieldId}
        value={draft}
        maxLength={DAY_NOTE_MAX_LENGTH}
        placeholder={DAY_NOTE_PLACEHOLDER}
        aria-describedby={`${fieldId}-help`}
        onChange={(event) => {
          setDraft(event.target.value);
          setSaved(false);
        }}
        className="min-h-24"
      />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {saved ? (
        <p className="text-sm text-primary" role="status">
          {DAY_NOTE_SAVED}
        </p>
      ) : null}
      <Button type="submit" className="h-10" disabled={busy}>
        {busy ? "Salvez…" : DAY_NOTE_SAVE}
      </Button>
    </form>
  );
}
