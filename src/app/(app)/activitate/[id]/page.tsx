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
            {getDayName(activity.day_of_week)} · {PILLAR_META[activity.pillar].hint}
          </span>
        </div>
        <h1 className="mt-3 font-heading text-3xl leading-tight">{activity.title}</h1>
        {activity.is_placeholder ? (
          <p className="mt-2 rounded-xl bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-950">
            PLACEHOLDER — Cristina înlocuiește titlul și corpul cu textul final RO.
            Nu schimba stâlpul, ziua, săptămâna sau banda de vârstă.
          </p>
        ) : null}
        <p className="mt-4 text-base leading-7 text-foreground/90">{activity.body}</p>
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
            Mod {family?.default_mode ?? "A"}
            {family?.default_mode === "B"
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
