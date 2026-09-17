"use client";

import { Button } from "@/components/ui/button";
import { useFamily } from "@/lib/family-context";
import { PREVIEW_EXIT, previewBannerText } from "@/lib/band-preview";

export function BandPreviewBanner() {
  const { isBandPreview, viewBand, clearPreviewBand } = useFamily();
  if (!isBandPreview) return null;

  return (
    <div
      className="flex flex-col gap-2 rounded-2xl border border-primary/30 bg-primary/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
      role="status"
    >
      <p className="text-sm font-medium">{previewBannerText(viewBand)}</p>
      <Button
        type="button"
        variant="outline"
        className="h-10 shrink-0"
        onClick={clearPreviewBand}
      >
        {PREVIEW_EXIT}
      </Button>
    </div>
  );
}
