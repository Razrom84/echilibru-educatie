"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  PHOTO_ADD,
  PHOTO_BUSY,
  PHOTO_CLOSE,
  PHOTO_HELP,
  PHOTO_LABEL,
  PHOTO_OPEN,
  PHOTO_REMOVE,
  PHOTO_REMOVED,
  PHOTO_REPLACE,
  PHOTO_SAVED,
} from "@/lib/archive";
import { PHOTO_ACCEPT, rejectIfNotPhoto } from "@/lib/archive-photo";
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
  const previewRef = useRef<string | null>(null);
  const generationRef = useRef(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState(false);
  const [busy, setBusy] = useState<"save" | "remove" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    };
  }, []);

  useEffect(() => {
    if (!lightbox) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setLightbox(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  if (!selectedChild) return null;

  const displayUrl = previewUrl ?? photoUrl;
  const showingPhoto = Boolean(displayUrl);
  const canRemove = showingPhoto || hasPhoto;

  function replacePreview(file: Blob) {
    const url = URL.createObjectURL(file);
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = url;
    setPreviewUrl(url);
  }

  function clearPreview() {
    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current);
      previewRef.current = null;
    }
    setPreviewUrl(null);
    setLightbox(false);
  }

  async function onPick(file: File | undefined) {
    if (!file) return;
    const rejected = rejectIfNotPhoto(file);
    if (rejected) {
      setError(rejected);
      setStatus(null);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    const generation = ++generationRef.current;
    replacePreview(file);
    setBusy("save");
    setError(null);
    setStatus(null);
    try {
      await saveDayPhoto(civilDate, file);
      if (generation !== generationRef.current) return;
      setStatus(PHOTO_SAVED);
      onChanged?.();
    } catch (err) {
      if (generation !== generationRef.current) return;
      setError(err instanceof Error ? err.message : "Nu am putut salva fotografia.");
    } finally {
      if (generation === generationRef.current) setBusy(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function onRemove() {
    const generation = ++generationRef.current;
    clearPreview();
    setBusy("remove");
    setError(null);
    setStatus(null);
    try {
      await removeDayPhoto(civilDate);
      if (generation !== generationRef.current) return;
      setStatus(PHOTO_REMOVED);
      onChanged?.();
    } catch (err) {
      if (generation !== generationRef.current) return;
      setError(err instanceof Error ? err.message : "Nu am putut șterge fotografia.");
    } finally {
      if (generation === generationRef.current) setBusy(null);
    }
  }

  return (
    <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
      <div>
        <p className="text-sm font-medium">{PHOTO_LABEL}</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">{PHOTO_HELP}</p>
      </div>
      {displayUrl ? (
        <button
          type="button"
          className="block w-full overflow-hidden rounded-xl focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          onClick={() => setLightbox(true)}
          aria-label={PHOTO_OPEN}
        >
          {/* Compressed JPEG / local object URL. next/image cannot cover blob: or signed URLs. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displayUrl}
            alt="Fotografia zilei"
            className="max-h-72 w-full object-cover"
          />
        </button>
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
          {busy === "save" ? PHOTO_BUSY : canRemove ? PHOTO_REPLACE : PHOTO_ADD}
        </Button>
        {canRemove ? (
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

      {lightbox && displayUrl ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={PHOTO_OPEN}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLightbox(false)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 rounded-lg bg-white/90 px-3 py-2 text-sm font-medium text-foreground"
            onClick={() => setLightbox(false)}
          >
            {PHOTO_CLOSE}
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displayUrl}
            alt="Fotografia zilei"
            className="max-h-[90vh] max-w-[min(90vw,52rem)] rounded-lg object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      ) : null}
    </div>
  );
}
