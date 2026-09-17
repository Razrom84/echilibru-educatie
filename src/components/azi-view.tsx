"use client";

import { useState } from "react";
import { ActivityCard } from "@/components/activity-card";
import { BandPreviewBanner } from "@/components/band-preview-banner";
import { DayNoteEditor } from "@/components/day-note-editor";
import { DayPhotoPicker } from "@/components/day-photo-picker";
import { AddToCalendarButton } from "@/components/add-to-calendar-button";
import { PreviewWeekNav } from "@/components/preview-week-nav";
import { EmptyState, LoadingState } from "@/components/status-blocks";
import {
  AZI_BEFORE_JOIN,
  aziAllDone,
  aziAllDoneMessage,
  aziDayOfWeek,
  aziFutureLocked,
  aziGate,
  aziSubtitle,
  aziTitle,
} from "@/lib/azi";
import { PREVIEW_EMPTY } from "@/lib/band-preview";
import { useFamily } from "@/lib/family-context";
import { PILLARS } from "@/lib/pillars";
import { weekRelation } from "@/lib/view-week";
import Link from "next/link";

export function AziView({ today }: { today: string }) {
  const {
    viewActivities,
    viewWeekTheme,
    completions,
    selectedChild,
    viewWeek,
    selectedWeek,
    toggleComplete,
    family,
    todayArchive,
    todayPhotoUrl,
    viewCivilDate,
    isBandPreview,
    writesAllowed,
    previewLoading,
    previewWeekLoading,
  } = useFamily();
  const [busyId, setBusyId] = useState<string | null>(null);

  const week = viewWeek;
  const day = aziDayOfWeek(today);
  const relation = weekRelation(viewWeek, selectedWeek);
  const gate = aziGate({
    viewDate: viewCivilDate,
    today,
    joinedAt: family?.joined_at ?? family?.created_at,
  });

  const todayActivities = viewActivities
    .filter((activity) => activity.day_of_week === day && activity.week_number === week)
    .sort((a, b) => PILLARS.indexOf(a.pillar) - PILLARS.indexOf(b.pillar));
  const doneCount = todayActivities.filter((activity) =>
    completions.some((row) => row.activity_id === activity.id),
  ).length;
  const allDone = aziAllDone(todayActivities.length, doneCount);
  const readOnly = !writesAllowed;
  const hideForJoin = relation === "current" && gate === "before_join";
  const hideFutureDay = relation === "current" && gate === "locked";

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
      <EmptyState
        title="Adaugă un copil"
        body="Azi se umple după primul copil."
        action={
          <Link href="/onboarding" className="text-sm font-medium text-primary underline">
            Mergi la onboarding
          </Link>
        }
      />
    );
  }

  return (
    <section className="space-y-4">
      <BandPreviewBanner />
      <PreviewWeekNav />
      <div>
        <h1 className="font-heading text-3xl">{aziTitle(viewWeekTheme, day)}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{aziSubtitle(day)}</p>
      </div>

      {isBandPreview && (previewLoading || previewWeekLoading) ? (
        <LoadingState label="Se încarcă previzualizarea…" />
      ) : !isBandPreview && previewWeekLoading ? (
        <LoadingState label="Se încarcă săptămâna…" />
      ) : isBandPreview && todayActivities.length === 0 ? (
        <EmptyState title={PREVIEW_EMPTY} />
      ) : hideForJoin ? (
        <EmptyState title={AZI_BEFORE_JOIN} body={aziSubtitle(day)} />
      ) : hideFutureDay ? (
        <EmptyState title={aziFutureLocked(day)} body={aziSubtitle(day)} />
      ) : todayActivities.length === 0 ? (
        <EmptyState
          title="Încă nu e conținut pentru ziua asta"
          body="Nu am găsit activități pentru ziua de azi în săptămâna de program."
        />
      ) : (
        <div className="space-y-3">
          {!readOnly && allDone ? (
            <p className="rounded-2xl bg-muted px-4 py-3 text-sm font-medium">
              {aziAllDoneMessage(day)}
            </p>
          ) : null}
          {todayActivities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              completion={
                writesAllowed
                  ? completions.find((row) => row.activity_id === activity.id) ?? null
                  : null
              }
              busy={busyId === activity.id}
              readOnly={readOnly}
              onToggle={() => void onToggle(activity.id)}
            />
          ))}
          {readOnly ? null : (
            <>
              <DayNoteEditor
                key={`${selectedChild.id}-${week}-${day}`}
                dayOfWeek={day}
              />
              <DayPhotoPicker
                key={`${selectedChild.id}-${viewCivilDate}`}
                civilDate={viewCivilDate}
                photoUrl={todayPhotoUrl}
                hasPhoto={Boolean(todayArchive?.photo_path)}
              />
            </>
          )}
        </div>
      )}

      {!readOnly && !hideForJoin && !hideFutureDay && todayActivities.length === 0 ? (
        <>
          <DayNoteEditor
            key={`${selectedChild.id}-${week}-${day}`}
            dayOfWeek={day}
          />
          <DayPhotoPicker
            key={`${selectedChild.id}-${viewCivilDate}-empty`}
            civilDate={viewCivilDate}
            photoUrl={todayPhotoUrl}
            hasPhoto={Boolean(todayArchive?.photo_path)}
          />
        </>
      ) : null}

      {readOnly ? null : <AddToCalendarButton />}
    </section>
  );
}
