"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CompleteToggle } from "@/components/complete-toggle";
import { PillarMark } from "@/components/pillar-mark";
import { EmptyState } from "@/components/status-blocks";
import { Button } from "@/components/ui/button";
import { useFamily } from "@/lib/family-context";
import { PILLAR_META } from "@/lib/pillars";
import { getDayName } from "@/lib/week";

export default function ActivitatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { activities, completions, toggleComplete, approveCompletion, family } =
    useFamily();
  const [busy, setBusy] = useState(false);
  const activity = activities.find((item) => item.id === id);
  const completion = completions.find((row) => row.activity_id === id) ?? null;
  const pending = completion?.mode === "B" && completion.parent_approved === false;

  if (!activity) {
    return (
      <EmptyState
        title="Activitatea nu e în săptămâna 1"
        body="V1 are doar banda 2–3, săptămâna 1. Verifică linkul sau seed-ul."
        action={
          <Link href="/azi" className="text-sm font-medium text-primary underline">
            Înapoi la Azi
          </Link>
        }
      />
    );
  }

  const current = activity;

  async function onToggle() {
    setBusy(true);
    try {
      await toggleComplete(current.id);
    } finally {
      setBusy(false);
    }
  }

  async function onApprove() {
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

        {activity.materiale.length > 0 ? (
          <p className="mt-4 text-sm">
            <span className="font-medium">Materiale: </span>
            {activity.materiale.join(", ")}
          </p>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">Fără materiale extra.</p>
        )}

        <ol className="mt-4 list-decimal space-y-2 pl-5 text-base leading-7">
          {activity.pasi.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>

        <p className="mt-5 rounded-xl bg-muted px-3 py-2 text-sm leading-6">
          <span className="font-medium">Gata când: </span>
          {activity.gata_cand}
        </p>
        {activity.nota ? (
          <p className="mt-3 text-xs leading-5 text-muted-foreground">{activity.nota}</p>
        ) : null}
      </div>

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
    </article>
  );
}
