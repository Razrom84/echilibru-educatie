"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CALENDAR_BUTTON_LABEL,
  CALENDAR_COPIED,
  CALENDAR_SUBSCRIBE_HELP,
  calendarSubscribeHttpsUrl,
} from "@/lib/calendar";
import { useFamily } from "@/lib/family-context";

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.left = "-9999px";
  document.body.appendChild(field);
  field.select();
  document.execCommand("copy");
  field.remove();
}

export function AddToCalendarButton() {
  const { selectedChild, ensureCalendarToken } = useFamily();
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!selectedChild) return null;

  async function onCopy() {
    setBusy(true);
    setError(null);
    try {
      const token = await ensureCalendarToken();
      const url = calendarSubscribeHttpsUrl(window.location.origin, token);
      await copyText(url);
      setCopied(true);
    } catch (err) {
      setCopied(false);
      setError(err instanceof Error ? err.message : "Nu am putut copia linkul.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2 rounded-2xl border border-border bg-card p-4">
      <p className="text-sm leading-6 text-muted-foreground">{CALENDAR_SUBSCRIBE_HELP}</p>
      <Button
        type="button"
        variant="outline"
        className="h-11 w-full"
        disabled={busy}
        onClick={() => void onCopy()}
      >
        {busy ? "Pregătesc linkul…" : CALENDAR_BUTTON_LABEL}
      </Button>
      {copied ? <p className="text-sm text-primary">{CALENDAR_COPIED}</p> : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
