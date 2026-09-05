"use client";

import { useState } from "react";
import { ActivityCard } from "@/components/activity-card";
import { EmptyState } from "@/components/status-blocks";
import { useFamily } from "@/lib/family-context";
import { PILLARS } from "@/lib/pillars";
import Link from "next/link";
import { formatRoDate, getDayName, getDayOfWeek } from "@/lib/week";

export default function AziPage() {
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
  const day = getDayOfWeek();
  const today = activities
    .filter((activity) => activity.day_of_week === day && activity.week_number === selectedWeek)
    .sort((a, b) => PILLARS.indexOf(a.pillar) - PILLARS.indexOf(b.pillar));

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
        <h1 className="font-heading text-3xl capitalize">{formatRoDate()}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {getDayName(day)} · {weekTheme} · săptămâna {selectedWeek}. Mod{" "}
          {family?.default_mode === "B" ? "B (autonomie + aprobare)" : "A (împreună)"}.
        </p>
      </div>

      {today.length === 0 ? (
        <EmptyState
          title="Încă nu e conținut pentru ziua asta"
          body="Nu am găsit activități pentru ziua asta în săptămâna selectată."
        />
      ) : (
        <div className="space-y-3">
          {today.map((activity) => (
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
