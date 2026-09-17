"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BandPreviewBanner } from "@/components/band-preview-banner";
import { CompleteToggle } from "@/components/complete-toggle";
import { DayNoteEditor } from "@/components/day-note-editor";
import { PillarMark } from "@/components/pillar-mark";
import { EmptyState, LoadingState } from "@/components/status-blocks";
import { PREVIEW_EMPTY } from "@/lib/band-preview";
import { useFamily } from "@/lib/family-context";
import { PILLARS } from "@/lib/pillars";
import { mondayOf } from "@/lib/program-week";
import {
  SAPTAMANA_TITLE,
  focusedWeekDay,
  midweekJoinHelper,
  saptamanaSubtitle,
  visibleProgramWeekDays,
  weekDayHeading,
  weekDaySectionId,
} from "@/lib/saptamana";
import { aziDayOfWeek } from "@/lib/azi";
import { cn } from "@/lib/utils";

export function SaptamanaView({
  today,
  focusDay = null,
}: {
  today: string;
  focusDay?: number | null;
}) {
  const {
    viewActivities,
    viewWeekTheme,
    completions,
    selectedChild,
    selectedWeek,
    family,
    toggleComplete,
    isBandPreview,
    previewLoading,
  } = useFamily();
  const [busyId, setBusyId] = useState<string | null>(null);
  const todayDow = aziDayOfWeek(today);
  const days = visibleProgramWeekDays({
    weekMonday: mondayOf(today),
    joinedAt: family?.joined_at ?? family?.created_at,
  });
  const selectedDay = focusedWeekDay({
    requestedDay: focusDay,
    todayDay: todayDow,
    visibleDays: days,
  });
  const joinHelper = midweekJoinHelper(days);
  const readOnly = isBandPreview;
  const weekItems = viewActivities.filter(
    (activity) => activity.week_number === selectedWeek,
  );

  useEffect(() => {
    if (selectedDay == null) return;
    const section = document.getElementById(weekDaySectionId(selectedDay));
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [selectedDay]);

  async function onToggle(activityId: string) {
    if (readOnly) return;
    setBusyId(activityId);
    try {
      await toggleComplete(activityId);
    } finally {
      setBusyId(null);
    }
  }

  if (!selectedChild) {
    return (
      <EmptyState title="Alege un copil" body="Săptămâna se leagă de copilul activ." />
    );
  }

  return (
    <section className="space-y-5">
      <BandPreviewBanner />
      <div>
        <h1 className="font-heading text-3xl">{SAPTAMANA_TITLE}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {saptamanaSubtitle(selectedWeek, viewWeekTheme)}
        </p>
        {joinHelper ? (
          <p className="mt-2 text-sm text-muted-foreground">{joinHelper}</p>
        ) : null}
      </div>

      {isBandPreview && previewLoading ? (
        <LoadingState label="Se încarcă previzualizarea…" />
      ) : isBandPreview && weekItems.length === 0 ? (
        <EmptyState title={PREVIEW_EMPTY} />
      ) : days.length === 0 ? (
        <EmptyState
          title={SAPTAMANA_TITLE}
          body="Zilele dinainte de înscriere nu apar. Săptămâna următoare le vezi pe toate."
        />
      ) : (
        <div className="space-y-4">
          {days.map((day) => {
            const items = weekItems
              .filter((activity) => activity.day_of_week === day)
              .sort((a, b) => PILLARS.indexOf(a.pillar) - PILLARS.indexOf(b.pillar));
            const done = readOnly
              ? 0
              : items.filter((activity) =>
                  completions.some((row) => row.activity_id === activity.id),
                ).length;

            return (
              <section
                key={day}
                id={weekDaySectionId(day)}
                className={cn(
                  "scroll-mt-4 rounded-2xl border border-border bg-card p-4",
                  day === selectedDay && "ring-2 ring-primary/30",
                )}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="flex items-baseline gap-2 font-heading text-xl">
                    {day === todayDow
                      ? `${weekDayHeading(day)}\u00A0`
                      : weekDayHeading(day)}
                    {day === todayDow ? (
                      <span className="text-sm font-sans font-medium text-primary">
                        azi
                      </span>
                    ) : null}
                  </h2>
                  {readOnly ? null : (
                    <p className="text-sm text-muted-foreground">
                      {done}/{items.length || 4}
                    </p>
                  )}
                </div>
                <ul className="mt-3 space-y-2">
                  {items.map((activity) => {
                    const completion = readOnly
                      ? null
                      : completions.find((row) => row.activity_id === activity.id);
                    return (
                      <li key={activity.id} className="flex items-center gap-2">
                        <Link
                          href={`/activitate/${activity.id}`}
                          className="flex min-w-0 flex-1 items-center gap-2 rounded-xl px-1 py-1 hover:bg-muted"
                        >
                          <span
                            className={cn(
                              "size-2.5 rounded-full",
                              completion
                                ? completion.mode === "B" &&
                                  completion.parent_approved === false
                                  ? "bg-amber-500"
                                  : "bg-primary"
                                : "bg-border",
                            )}
                          />
                          <PillarMark pillar={activity.pillar} />
                          <span className="truncate text-sm">{activity.title}</span>
                        </Link>
                        {readOnly ? null : (
                          <CompleteToggle
                            completion={completion ?? null}
                            disabled={busyId === activity.id}
                            compact
                            onToggle={() => void onToggle(activity.id)}
                          />
                        )}
                      </li>
                    );
                  })}
                </ul>
                {readOnly ? null : (
                  <DayNoteEditor
                    key={`${selectedChild.id}-${selectedWeek}-${day}`}
                    dayOfWeek={day}
                    embedded
                  />
                )}
              </section>
            );
          })}
        </div>
      )}
    </section>
  );
}
