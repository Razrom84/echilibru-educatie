"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CompleteToggle } from "@/components/complete-toggle";
import { PillarMark } from "@/components/pillar-mark";
import { EmptyState } from "@/components/status-blocks";
import { Button } from "@/components/ui/button";
import { completionForActivity } from "@/lib/child-scope";
import { useFamily } from "@/lib/family-context";
import { PILLAR_META } from "@/lib/pillars";
import { bucharestToday, familyProgramYearStart, programDayCivilDate } from "@/lib/program-week";
import { activityReadOnlyHint } from "@/lib/view-week";
import { getDayName } from "@/lib/week";
import { materialsForActivity, showsActivityNote, visibleActivityExtras } from "@/lib/gifted";
import { ActivityMaterialsLine } from "@/components/week-materials";
import { StocForActivity } from "@/components/stoc-activity";

export default function ActivitatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const {
    viewActivities,
    completions,
    toggleComplete,
    approveCompletion,
    family,
    writesAllowed,
    selectedChild,
    selectedWeek,
    weekMaterials,
  } = useFamily();
  const [busy, setBusy] = useState(false);
  const activity = viewActivities.find((item) => item.id === id);
  const activityCivilDate =
    activity && family
      ? programDayCivilDate(
          activity.week_number,
          activity.day_of_week,
          familyProgramYearStart(family),
        )
      : null;
  const aheadHint = activity
    ? activityReadOnlyHint({
        civilDate: activityCivilDate,
        today: bucharestToday(),
        viewWeek: activity.week_number,
        officialWeek: selectedWeek,
        weekWritable: writesAllowed,
      })
    : null;
  const canWrite = writesAllowed && aheadHint == null;
  const completion =
    canWrite && selectedChild
      ? completionForActivity(completions, selectedChild.id, id)
      : null;
  const pending = completion?.mode === "B" && completion.parent_approved === false;

  if (!activity) {
    return (
      <EmptyState
        title="Activitatea nu e în săptămâna de azi"
        body="Verifică linkul sau revino la Azi."
        action={
          <Link href="/azi" className="text-sm font-medium text-primary underline">
            Înapoi la Azi
          </Link>
        }
      />
    );
  }

  const current = activity;
  const extras = visibleActivityExtras(activity);
  const showBaseLabel = extras.pasInPlus || extras.provocare;

  async function onToggle() {
    if (!canWrite) return;
    setBusy(true);
    try {
      await toggleComplete(current.id);
    } finally {
      setBusy(false);
    }
  }

  async function onApprove() {
    if (!canWrite) return;
    setBusy(true);
    try {
      await approveCompletion(current.id);
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="space-y-5">
      <Link
        href="/azi"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Azi
      </Link>

      <div className="overflow-hidden rounded-3xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-center gap-2">
          <PillarMark pillar={activity.pillar} />
          <span className="text-sm text-muted-foreground">
            {getDayName(activity.day_of_week)} · {activity.durata_min} min ·{" "}
            {PILLAR_META[activity.pillar].hint}
          </span>
        </div>
        <h1 className="mt-3 font-heading text-3xl leading-tight">{activity.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{activity.tema_saptamana}</p>

        <ActivityMaterialsLine
          materiale={activity.materiale}
          linked={materialsForActivity(weekMaterials, activity.id)}
          activityIds={new Set(viewActivities.map((item) => item.id))}
        />
        <StocForActivity
          activityId={activity.id}
          linked={materialsForActivity(weekMaterials, activity.id)}
        />

        {showBaseLabel ? (
          <p className="mt-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Bază
          </p>
        ) : null}
        <ol
          className={
            showBaseLabel
              ? "mt-2 list-decimal space-y-2 pl-5 text-base leading-7"
              : "mt-4 list-decimal space-y-2 pl-5 text-base leading-7"
          }
        >
          {activity.pasi.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        {activity.pas_in_plus?.trim() ? (
          <div
            className="mt-4 rounded-xl border border-border bg-accent/50 px-3 py-3"
            data-testid="pas-in-plus"
          >
            <p className="text-xs font-medium text-muted-foreground">
              Pas în plus · după bază, dacă vrea
            </p>
            <p className="mt-1 text-base leading-7">{activity.pas_in_plus}</p>
          </div>
        ) : null}
        {activity.provocare?.trim() ? (
          <div
            className="mt-3 rounded-xl border border-primary/20 bg-primary/5 px-3 py-3"
            data-testid="provocare"
          >
            <p className="text-xs font-medium text-muted-foreground">
              Provocare · după bază, dacă cere mai mult
            </p>
            <p className="mt-1 text-base leading-7">{activity.provocare}</p>
          </div>
        ) : null}

        {activity.gata_cand?.trim() ? (
          <p className="mt-5 rounded-xl bg-muted px-3 py-2 text-sm leading-6">
            <span className="font-medium">Gata când: </span>
            {activity.gata_cand}
          </p>
        ) : null}
        {activity.siguranta?.trim() ? (
          <p className="mt-3 text-sm leading-6" data-testid="siguranta">
            <span className="font-medium">Siguranță: </span>
            {activity.siguranta}
          </p>
        ) : null}
        {showsActivityNote(activity.nota) ? (
          <p className="mt-3 text-xs leading-5 text-muted-foreground">{activity.nota}</p>
        ) : null}
      </div>

      {aheadHint ? (
        <p className="text-xs leading-5 text-muted-foreground">{aheadHint}</p>
      ) : null}

      {canWrite ? (
        <>
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3">
            <div>
              <p className="text-sm font-medium">
                {completion
                  ? pending
                    ? "Făcut, așteaptă aprobare"
                    : "Făcut"
                  : "Încă nefăcut"}
              </p>
              <p className="text-xs text-muted-foreground">
                Mod {family?.default_mode ?? activity.mod_default}
                {(family?.default_mode ?? activity.mod_default) === "B"
                  ? " — copilul face, părintele aprobă"
                  : " — părintele face împreună / pentru copil"}
              </p>
            </div>
            <CompleteToggle completion={completion} disabled={busy} onToggle={() => void onToggle()} />
          </div>

          {pending ? (
            <Button className="h-11 w-full" disabled={busy} onClick={() => void onApprove()}>
              Aprobă (mod B)
            </Button>
          ) : null}
        </>
      ) : null}
    </article>
  );
}
