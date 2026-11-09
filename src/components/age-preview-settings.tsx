"use client";

import { useFamily } from "@/lib/family-context";
import {
  PILOT_BANDS,
  PREVIEW_HELP,
  PREVIEW_LIVE_MARK,
  PREVIEW_NOT_CHILD_BAND,
  PREVIEW_TITLE,
  bandLabel,
  previewSessionLabel,
} from "@/lib/band-preview";
import { cn } from "@/lib/utils";

export function AgePreviewSettings() {
  const { liveBand, viewBand, isBandPreview, selectPreviewBand } = useFamily();
  const otherBand = isBandPreview && viewBand !== liveBand;

  return (
    <section className="space-y-3 rounded-2xl border border-border bg-card p-4">
      <div>
        <h2 className="font-heading text-xl">{PREVIEW_TITLE}</h2>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">{PREVIEW_HELP}</p>
      </div>
      {otherBand ? (
        <div role="status" className="rounded-xl bg-muted px-3 py-2">
          <p className="text-sm font-medium">{previewSessionLabel(viewBand)}</p>
          <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
            {PREVIEW_NOT_CHILD_BAND}
          </p>
        </div>
      ) : null}
      <div
        role="radiogroup"
        aria-label={PREVIEW_TITLE}
        className="grid grid-cols-2 gap-2 sm:grid-cols-3"
      >
        {PILOT_BANDS.map((band) => {
          const selected = viewBand === band;
          const live = liveBand === band;
          return (
            <button
              key={band}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={
                live ? `${bandLabel(band)}, ${PREVIEW_LIVE_MARK}` : bandLabel(band)
              }
              onClick={() => selectPreviewBand(band)}
              className={cn(
                "rounded-xl border px-3 py-3 text-left transition",
                selected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-background hover:bg-muted",
              )}
            >
              <span className="block font-heading text-lg leading-none">
                {bandLabel(band)}
              </span>
              {live ? (
                <span className="mt-1 block text-[11px] font-medium text-primary">
                  {PREVIEW_LIVE_MARK}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}
