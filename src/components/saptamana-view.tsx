"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BandPreviewBanner } from "@/components/band-preview-banner";
import { CompleteToggle } from "@/components/complete-toggle";
import { DayNoteEditor } from "@/components/day-note-editor";
import { DayPhotoPicker } from "@/components/day-photo-picker";
import { PillarMark } from "@/components/pillar-mark";
import { PreviewWeekNav } from "@/components/preview-week-nav";
import {
  PlayfulCharacterMark,
  PlayfulSurprise,
  PlayfulWeekRitual,
} from "@/components/playful-chrome";
import { EmptyState, LoadingState } from "@/components/status-blocks";
import { PREVIEW_EMPTY } from "@/lib/band-preview";
import { dayNoteEditorKey } from "@/lib/day-note";
import { useFamily } from "@/lib/family-context";
import { PILLARS } from "@/lib/pillars";
import { familyProgramYearStart, formatCivilDate, mondayOf, programWeekRange } from "@/lib/program-week";
import {
  SAPTAMANA_TITLE,
  PROGRAM_WEEK_DAYS,
  focusedWeekDay,
  midweekJoinHelper,
  saptamanaSubtitle,
  visibleProgramWeekDays,
  weekDayHeading,
  weekDaySectionId,
} from "@/lib/saptamana";
import { aziDayOfWeek } from "@/lib/azi";
import { addCivilDays } from "@/lib/archive";
import { cn } from "@/lib/utils";
import { trimsJoinDays, weekRelation } from "@/lib/view-week";
import {
  isCompletingLastActivity,
  playDoneChime,
  readChimeEnabled,
  shouldPlayDoneChime,
} from "@/lib/playful-chime";
import { playfulPilotFor, playfulPilotWeek } from "@/lib/playful-pilot";

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
    viewWeek,
    selectedWeek,
    family,
    toggleComplete,
    isBandPreview,
    viewBand,
    liveBand,
    writesAllowed,
    previewLoading,
    previewWeekLoading,
    loadArchiveDays,
    signedPhotoUrl,
  } = useFamily();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [photos, setPhotos] = useState<
    Record<string, { url: string | null; hasPhoto: boolean }>
  >({});
  const todayDow = aziDayOfWeek(today);
  const yearStart = family ? familyProgramYearStart(family) : null;
  const weekMonday = yearStart
    ? programWeekRange(viewWeek, yearStart).start
    : formatCivilDate(mondayOf(today));
  const otherBand = viewBand !== liveBand;
  const relation = weekRelation(viewWeek, selectedWeek);
  const joinedAt = family?.joined_at ?? family?.created_at;
  const days = useMemo(
    () =>
      trimsJoinDays(relation, otherBand)
        ? visibleProgramWeekDays({
            weekMonday,
            joinedAt,
          })
        : [...PROGRAM_WEEK_DAYS],
    [joinedAt, otherBand, relation, weekMonday],
  );
  const selectedDay = focusedWeekDay({
    requestedDay: focusDay,
    todayDay: todayDow,
    visibleDays: days,
  });
  const joinHelper = trimsJoinDays(relation, otherBand)
    ? midweekJoinHelper(days)
    : null;
  const readOnly = !writesAllowed;
  const showProgress = !otherBand;
  const weekItems = viewActivities.filter(
    (activity) => activity.week_number === viewWeek,
  );
  const weekOverlay = playfulPilotWeek(viewWeek);
  const civilByDay = useMemo(() => {
    const map: Record<number, string> = {};
    for (const day of days) {
      map[day] = addCivilDays(weekMonday, day - 1);
    }
    return map;
  }, [days, weekMonday]);

  useEffect(() => {
    if (selectedDay == null) return;
    const section = document.getElementById(weekDaySectionId(selectedDay));
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [selectedDay]);

  useEffect(() => {
    if (readOnly || !yearStart) return;
    let cancelled = false;
    const range = programWeekRange(viewWeek, yearStart);
    void (async () => {
      try {
        const rows = await loadArchiveDays(range.start, range.end);
        const next: Record<string, { url: string | null; hasPhoto: boolean }> = {};
        for (const row of rows) {
          next[row.civil_date] = {
            hasPhoto: Boolean(row.photo_path),
            url: row.photo_path ? await signedPhotoUrl(row.photo_path) : null,
          };
        }
        if (!cancelled) setPhotos(next);
      } catch {
        if (!cancelled) setPhotos({});
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadArchiveDays, readOnly, signedPhotoUrl, viewWeek, yearStart]);

  async function onToggle(activityId: string, dayOfWeek: number, dayIds: string[]) {
    if (readOnly) return;
    const wasAlreadyDone = completions.some((row) => row.activity_id === activityId);
    const completingLast = isCompletingLastActivity({
      activityIds: dayIds,
      completedIds: completions.map((row) => row.activity_id),
      toggledId: activityId,
      wasAlreadyDone,
    });
    setBusyId(activityId);
    try {
      await toggleComplete(activityId);
      if (
        shouldPlayDoneChime({
          enabled: readChimeEnabled(),
          hasOverlay: Boolean(playfulPilotFor(viewWeek, dayOfWeek)),
          completingLast,
        })
      ) {
        playDoneChime();
      }
    } finally {
      setBusyId(null);
    }
  }

  async function reloadPhotos() {
    if (!yearStart) return;
    const range = programWeekRange(viewWeek, yearStart);
    const rows = await loadArchiveDays(range.start, range.end);
    const next: Record<string, { url: string | null; hasPhoto: boolean }> = {};
    for (const row of rows) {
      next[row.civil_date] = {
        hasPhoto: Boolean(row.photo_path),
        url: row.photo_path ? await signedPhotoUrl(row.photo_path) : null,
      };
    }
    setPhotos(next);
  }

  if (!selectedChild) {
    return (
      <EmptyState title="Alege un copil" body="Săptămâna se leagă de copilul activ." />
    );
  }

  return (
    <section className="space-y-5">
      <BandPreviewBanner />
      <PreviewWeekNav />
      <div>
        <h1 className="font-heading text-3xl">{SAPTAMANA_TITLE}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {saptamanaSubtitle(viewWeek, viewWeekTheme)}
        </p>
        {joinHelper ? (
          <p className="mt-2 text-sm text-muted-foreground">{joinHelper}</p>
        ) : null}
      </div>
      {weekOverlay ? (
        <PlayfulWeekRitual
          character={weekOverlay.character}
          theme={weekOverlay.theme}
          ritualOpen={weekOverlay.ritualOpen}
        />
      ) : null}

      {isBandPreview && (previewLoading || previewWeekLoading) ? (
        <LoadingState label="Se încarcă previzualizarea…" />
      ) : !isBandPreview && previewWeekLoading ? (
        <LoadingState label="Se încarcă săptămâna…" />
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
            const done = showProgress
              ? items.filter((activity) =>
                  completions.some((row) => row.activity_id === activity.id),
                ).length
              : 0;
            const civilDate = civilByDay[day];
            const photo = civilDate ? photos[civilDate] : undefined;
            const dayOverlay = playfulPilotFor(viewWeek, day);

            return (
              <section
                key={day}
                id={weekDaySectionId(day)}
                className={cn(
                  "scroll-mt-4 rounded-2xl border border-border bg-card p-4",
                  day === selectedDay && "ring-2 ring-primary/30",
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <h2 className="flex items-center gap-2 font-heading text-xl">
                    {dayOverlay ? (
                      <PlayfulCharacterMark
                        character={dayOverlay.character}
                        size={32}
                      />
                    ) : null}
                    {day === todayDow
                      ? `${weekDayHeading(day)}\u00A0`
                      : weekDayHeading(day)}
                    {day === todayDow ? (
                      <span className="text-sm font-sans font-medium text-primary">
                        azi
                      </span>
                    ) : null}
                  </h2>
                  {showProgress ? (
                    <p className="text-sm text-muted-foreground">
                      {done}/{items.length || 4}
                    </p>
                  ) : null}
                </div>
                <ul className="mt-3 space-y-2">
                  {items.map((activity) => {
                    const completion = showProgress
                      ? completions.find((row) => row.activity_id === activity.id)
                      : null;
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
                            onToggle={() =>
                              void onToggle(
                                activity.id,
                                day,
                                items.map((item) => item.id),
                              )
                            }
                          />
                        )}
                      </li>
                    );
                  })}
                </ul>
                {dayOverlay ? (
                  <div className="mt-3">
                    <PlayfulSurprise surprise={dayOverlay.surprise} compact />
                  </div>
                ) : null}
                {readOnly ? null : (
                  <>
                    <DayNoteEditor
                      key={dayNoteEditorKey(selectedChild.id, viewWeek, day)}
                      dayOfWeek={day}
                      embedded
                    />
                    {civilDate ? (
                      <div className="mt-3">
                        <DayPhotoPicker
                          key={`${selectedChild.id}-${civilDate}`}
                          civilDate={civilDate}
                          photoUrl={photo?.url ?? null}
                          hasPhoto={Boolean(photo?.hasPhoto)}
                          onChanged={() => void reloadPhotos()}
                        />
                      </div>
                    ) : null}
                  </>
                )}
              </section>
            );
          })}
        </div>
      )}
    </section>
  );
}
