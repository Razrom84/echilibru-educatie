"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { composeMondayDigest } from "@/lib/mail/compose-monday-digest";
import { readDemoState } from "@/lib/demo/store";
import { renderDigestEmail } from "@/lib/monday-digest-email";
import {
  DIGEST_CC_PREVIEW,
  DIGEST_TEST_DEMO,
  DIGEST_TEST_PREVIEW,
  DIGEST_TEST_SEND,
  DIGEST_TEST_SENT,
  DIGEST_TEST_SKIPPED,
  digestCcAddress,
} from "@/lib/monday-digest";
import { bucharestToday } from "@/lib/program-week";
import { useFamily } from "@/lib/family-context";

export function MondayDigestSettings() {
  const { isDemo } = useFamily();
  const [busy, setBusy] = useState<"preview" | "send" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<{
    subject: string;
    text: string;
    cc?: string | null;
    skipped?: boolean;
  } | null>(null);
  const [sent, setSent] = useState(false);

  async function run(send: boolean) {
    setBusy(send ? "send" : "preview");
    setError(null);
    setSent(false);
    try {
      if (isDemo) {
        const state = readDemoState();
        const composed = composeMondayDigest({
          now: bucharestToday(),
          family: state.family,
          children: state.children.filter((child) => child.active),
          completions: state.completions,
          notes: state.dayNotes,
          ignoreToggle: true,
        });
        if (composed.status === "skipped-toggle" || composed.status === "skipped-empty") {
          setPreview({
            subject: composed.status === "skipped-empty" ? composed.model.subject : "",
            text: DIGEST_TEST_SKIPPED,
            skipped: true,
          });
          return;
        }
        const email = renderDigestEmail(composed.model);
        setPreview({
          subject: email.subject,
          text: email.text,
          cc: digestCcAddress(state.family.second_parent_email, "demo"),
        });
        if (send) setError(DIGEST_TEST_DEMO);
        return;
      }

      const response = await fetch("/api/mail/raport-luni", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dryRun: !send }),
      });
      const payload = (await response.json()) as {
        error?: string;
        outcome?: { status?: string };
        preview?: { subject: string; text: string; cc?: string | null } | null;
      };
      if (!response.ok) {
        throw new Error(payload.error ?? "Nu am putut rula testul.");
      }
      if (payload.outcome?.status === "skipped-empty" || !payload.preview) {
        setPreview({
          subject: payload.preview?.subject ?? "",
          text: DIGEST_TEST_SKIPPED,
          skipped: true,
        });
        return;
      }
      setPreview({
        subject: payload.preview.subject,
        text: payload.preview.text,
        cc: payload.preview.cc,
      });
      if (send) setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nu am putut rula testul.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          className="h-11 flex-1"
          disabled={busy != null}
          onClick={() => void run(false)}
        >
          {busy === "preview" ? "Pregătesc…" : DIGEST_TEST_PREVIEW}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-11 flex-1"
          disabled={busy != null}
          onClick={() => void run(true)}
        >
          {busy === "send" ? "Trimit…" : DIGEST_TEST_SEND}
        </Button>
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {sent ? <p className="text-sm text-primary">{DIGEST_TEST_SENT}</p> : null}
      {preview ? (
        <div className="space-y-2 rounded-xl bg-muted/60 px-3 py-3">
          {preview.subject ? (
            <p className="text-sm font-medium text-foreground">{preview.subject}</p>
          ) : null}
          {preview.cc ? (
            <p className="text-xs text-muted-foreground">
              {DIGEST_CC_PREVIEW}: {preview.cc}
            </p>
          ) : null}
          <pre className="font-sans text-xs leading-5 whitespace-pre-wrap text-muted-foreground">
            {preview.text}
          </pre>
        </div>
      ) : null}
    </div>
  );
}
