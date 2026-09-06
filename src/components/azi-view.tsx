"use client";

import { useState } from "react";
import { ActivityCard } from "@/components/activity-card";
import { EmptyState } from "@/components/status-blocks";
import {
  AZI_ALL_DONE,
  AZI_BEFORE_JOIN,
  AZI_SUBTITLE,
  aziAllDone,
  aziDayOfWeek,
  aziFutureLocked,
  aziGate,
  aziTitle,
} from "@/lib/azi";
import { useFamily } from "@/lib/family-context";
import { PILLARS } from "@/lib/pillars";
import Link from "next/link";

export function AziView({ today }: { today: string }) {
  const {
    activities,
    completions,
    selectedChild,
    selectedWeek,
    weekTheme,
    toggleComplete,
    family,
  } = useFamily();
  const [busyId, setBusyId] = useState<string | null>(null);

  const week = selectedWeek;
  const day = aziDayOfWeek(today);
  const gate = aziGate({
    viewDate: today,
    today,
    joinedAt: family?.joined_at ?? family?.created_at,
  });

  const todayActivities = activities
    .filter((activity) => activity.day_of_week === day && activity.week_number === week)
    .sort((a, b) => PILLARS.indexOf(a.pillar) - PILLARS.indexOf(b.pillar));
  const doneCount = todayActivities.filter((activity) =>
    completions.some((row) => row.activity_id === activity.id),
  ).length;
  const allDone = aziAllDone(todayActivities.length, doneCount);

  async function onToggle(activityId: string) {
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
      <div>
        <h1 className="font-heading text-3xl">{aziTitle(weekTheme)}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{AZI_SUBTITLE}</p>
      </div>

      {gate === "before_join" ? (
        <EmptyState title={AZI_BEFORE_JOIN} body={AZI_SUBTITLE} />
      ) : gate === "locked" ? (
        <EmptyState title={aziFutureLocked(day)} body={AZI_SUBTITLE} />
      ) : todayActivities.length === 0 ? (
        <EmptyState
          title="Încă nu e conținut pentru ziua asta"
          body="Nu am găsit activități pentru ziua de azi în săptămâna de program."
        />
      ) : (
        <div className="space-y-3">
          {allDone ? (
            <p className="rounded-2xl bg-muted px-4 py-3 text-sm font-medium">{AZI_ALL_DONE}</p>
          ) : null}
          {todayActivities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              completion={
                completions.find((row) => row.activity_id === activity.id) ?? null
              }
              busy={busyId === activity.id}
              onToggle={() => void onToggle(activity.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
