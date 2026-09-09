"use client";

import { useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  PHOTO_ADD,
  PHOTO_BUSY,
  PHOTO_HELP,
  PHOTO_LABEL,
  PHOTO_REMOVE,
  PHOTO_REMOVED,
  PHOTO_REPLACE,
  PHOTO_SAVED,
} from "@/lib/archive";
import { PHOTO_ACCEPT } from "@/lib/archive-photo";
import { useFamily } from "@/lib/family-context";

export function DayPhotoPicker({
  civilDate,
  photoUrl,
  hasPhoto,
  onChanged,
}: {
  civilDate: string;
  photoUrl: string | null;
  hasPhoto: boolean;
  onChanged?: () => void;
}) {
  const { saveDayPhoto, removeDayPhoto, selectedChild } = useFamily();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<"save" | "remove" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  if (!selectedChild) return null;

  async function onPick(file: File | undefined) {
    if (!file) return;
    setBusy("save");
    setError(null);
    setStatus(null);
    try {
      await saveDayPhoto(civilDate, file);
      setStatus(PHOTO_SAVED);
      onChanged?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nu am putut salva fotografia.");
    } finally {
      setBusy(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function onRemove() {
    setBusy("remove");
    setError(null);
    setStatus(null);
    try {
      await removeDayPhoto(civilDate);
      setStatus(PHOTO_REMOVED);
      onChanged?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nu am putut șterge fotografia.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
      <div>
        <p className="text-sm font-medium">{PHOTO_LABEL}</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">{PHOTO_HELP}</p>
      </div>
      {photoUrl ? (
        // Compressed JPEG from the parent's private store. next/image remote
        // patterns cannot cover per-request signed URLs.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photoUrl}
          alt="Fotografia zilei"
          className="max-h-72 w-full rounded-xl object-cover"
        />
      ) : null}
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={PHOTO_ACCEPT}
        className="sr-only"
        onChange={(event) => void onPick(event.target.files?.[0])}
      />
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          type="button"
          className="h-11 flex-1"
          disabled={busy != null}
          onClick={() => inputRef.current?.click()}
        >
          {busy === "save" ? PHOTO_BUSY : hasPhoto ? PHOTO_REPLACE : PHOTO_ADD}
        </Button>
        {hasPhoto ? (
          <Button
            type="button"
            variant="outline"
            className="h-11 flex-1"
            disabled={busy != null}
            onClick={() => void onRemove()}
          >
            {busy === "remove" ? "Șterg…" : PHOTO_REMOVE}
          </Button>
        ) : null}
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {status ? (
        <p className="text-sm text-primary" role="status">
          {status}
        </p>
      ) : null}
    </div>
  );
}
