"use client";

import Link from "next/link";
import { CompleteToggle } from "@/components/complete-toggle";
import { PillarMark } from "@/components/pillar-mark";
import { PILLAR_META } from "@/lib/pillars";
import type { Activity, Completion } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ActivityCard({
  activity,
  completion,
  onToggle,
  busy,
}: {
  activity: Activity;
  completion: Completion | null;
  onToggle: () => void;
  busy?: boolean;
}) {
  const pending = completion?.mode === "B" && completion.parent_approved === false;

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm",
      )}
    >
      <div
        className={cn(
          "absolute inset-y-0 left-0 w-1.5",
          PILLAR_META[activity.pillar].swatch,
        )}
      />
      <div className="flex items-start gap-3 pl-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <PillarMark pillar={activity.pillar} />
            {activity.is_placeholder ? (
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                text provizoriu
              </span>
            ) : null}
          </div>
          <h2 className="mt-2 font-heading text-xl leading-tight">
            <Link href={`/activitate/${activity.id}`} className="hover:underline">
              {activity.title}
            </Link>
          </h2>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
            {activity.body}
          </p>
          {pending ? (
            <p className="mt-2 text-xs font-medium text-amber-800">
              Așteaptă aprobarea părintelui
            </p>
          ) : null}
        </div>
        <CompleteToggle completion={completion} disabled={busy} onToggle={onToggle} />
      </div>
    </article>
  );
}
