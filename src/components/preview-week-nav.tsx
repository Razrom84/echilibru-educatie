"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PREVIEW_WEEK_NEXT,
  PREVIEW_WEEK_PREV,
  previewWeekControlLabel,
} from "@/lib/band-preview";
import { useFamily } from "@/lib/family-context";
import { PROGRAM_WEEKS } from "@/lib/week";

const FIRST_WEEK = PROGRAM_WEEKS[0] ?? 1;
const LAST_WEEK = PROGRAM_WEEKS[PROGRAM_WEEKS.length - 1] ?? 52;

export function PreviewWeekNav() {
  const { isBandPreview, viewWeek, selectPreviewWeek } = useFamily();
  if (!isBandPreview) return null;

  return (
    <div
      className="flex items-center gap-2"
      role="group"
      aria-label={previewWeekControlLabel(viewWeek)}
    >
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-10 shrink-0 rounded-xl"
        aria-label={PREVIEW_WEEK_PREV}
        disabled={viewWeek <= FIRST_WEEK}
        onClick={() => selectPreviewWeek(viewWeek - 1)}
      >
        <ChevronLeft className="size-5" aria-hidden />
      </Button>
      <select
        id="preview-week"
        className="h-10 min-w-0 flex-1 rounded-xl border border-border bg-background px-2 text-sm"
        value={viewWeek}
        aria-label={previewWeekControlLabel(viewWeek)}
        onChange={(event) => selectPreviewWeek(Number(event.target.value))}
      >
        {PROGRAM_WEEKS.map((week) => (
          <option key={week} value={week}>
            {previewWeekControlLabel(week)}
          </option>
        ))}
      </select>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-10 shrink-0 rounded-xl"
        aria-label={PREVIEW_WEEK_NEXT}
        disabled={viewWeek >= LAST_WEEK}
        onClick={() => selectPreviewWeek(viewWeek + 1)}
      >
        <ChevronRight className="size-5" aria-hidden />
      </Button>
    </div>
  );
}
