"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFamily } from "@/lib/family-context";
import { PROGRAM_WEEKS } from "@/lib/week";
import {
  VIEW_WEEK_BACK,
  VIEW_WEEK_NEXT,
  VIEW_WEEK_PREV,
  showsLiveWeekNav,
  viewWeekBrowsingStatus,
  viewWeekControlLabel,
  viewWeekModeHint,
  weekWritesAllowed,
} from "@/lib/view-week";

const FIRST_WEEK = PROGRAM_WEEKS[0] ?? 1;
const LAST_WEEK = PROGRAM_WEEKS[PROGRAM_WEEKS.length - 1] ?? 52;

export function PreviewWeekNav() {
  const {
    viewWeek,
    selectedWeek,
    selectPreviewWeek,
    resetViewWeek,
    viewBand,
    liveBand,
  } = useFamily();
  if (!showsLiveWeekNav()) return null;

  const browsing = viewWeekBrowsingStatus(viewWeek, selectedWeek);
  const writable = weekWritesAllowed({
    viewWeek,
    officialWeek: selectedWeek,
    viewBand,
    liveBand,
  });
  const hint = viewWeekModeHint(viewWeek, selectedWeek, writable);

  return (
    <div className="space-y-2">
      <div
        className="flex items-center gap-2"
        role="group"
        aria-label={viewWeekControlLabel(viewWeek)}
      >
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-10 shrink-0 rounded-xl"
          aria-label={VIEW_WEEK_PREV}
          disabled={viewWeek <= FIRST_WEEK}
          onClick={() => selectPreviewWeek(viewWeek - 1)}
        >
          <ChevronLeft className="size-5" aria-hidden />
        </Button>
        <select
          id="preview-week"
          className="h-10 min-w-0 flex-1 rounded-xl border border-border bg-background px-2 text-sm"
          value={viewWeek}
          aria-label={viewWeekControlLabel(viewWeek)}
          onChange={(event) => selectPreviewWeek(Number(event.target.value))}
        >
          {PROGRAM_WEEKS.map((week) => (
            <option key={week} value={week}>
              {viewWeekControlLabel(week)}
            </option>
          ))}
        </select>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-10 shrink-0 rounded-xl"
          aria-label={VIEW_WEEK_NEXT}
          disabled={viewWeek >= LAST_WEEK}
          onClick={() => selectPreviewWeek(viewWeek + 1)}
        >
          <ChevronRight className="size-5" aria-hidden />
        </Button>
      </div>
      {browsing ? (
        <div className="rounded-xl bg-muted px-3 py-2" role="status">
          <p className="text-sm font-medium">{browsing}</p>
          {hint ? (
            <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
          ) : null}
          {!writable && !hint ? (
            <p className="mt-0.5 text-xs text-muted-foreground">Doar citire.</p>
          ) : null}
          <Button
            type="button"
            variant="ghost"
            className="mt-1 h-8 px-2 text-xs"
            onClick={resetViewWeek}
          >
            {VIEW_WEEK_BACK}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
