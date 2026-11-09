"use client";

import { Button } from "@/components/ui/button";
import { useFamily } from "@/lib/family-context";
import {
  PREVIEW_EXIT,
  PREVIEW_NOT_CHILD_BAND,
  previewBannerText,
  previewSessionLabel,
} from "@/lib/band-preview";

export function BandPreviewBanner() {
  const { isBandPreview, viewBand, liveBand, clearPreviewBand, writesAllowed } =
    useFamily();
  if (!isBandPreview) return null;
  const otherBand = viewBand !== liveBand;

  return (
    <div className="space-y-3 rounded-2xl border border-primary/30 bg-primary/5 px-4 py-3">
      <div
        className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
        role="status"
      >
        <div>
          <p className="text-sm font-medium">
            {otherBand ? previewSessionLabel(viewBand) : previewBannerText(viewBand, writesAllowed)}
          </p>
          {otherBand ? (
            <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
              {PREVIEW_NOT_CHILD_BAND}
              {writesAllowed ? "" : " Doar citire."}
            </p>
          ) : null}
        </div>
        <Button
          type="button"
          variant="outline"
          className="h-10 shrink-0"
          onClick={clearPreviewBand}
        >
          {PREVIEW_EXIT}
        </Button>
      </div>
    </div>
  );
}
