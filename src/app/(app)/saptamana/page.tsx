"use client";

import Link from "next/link";
import { PillarMark } from "@/components/pillar-mark";
import { EmptyState } from "@/components/status-blocks";
import { useFamily } from "@/lib/family-context";
import { PILLARS } from "@/lib/pillars";
import { getDayName, getDayOfWeek } from "@/lib/week";
import { cn } from "@/lib/utils";

export default function SaptamanaPage() {
  const { activities, completions, selectedChild, selectedWeek, weekTheme } = useFamily();
  const today = getDayOfWeek();

  if (!selectedChild) {
    return (
      <EmptyState title="Alege un copil" body="Săptămâna se leagă de copilul activ." />
    );
  }

  const days = [1, 2, 3, 4, 5, 6, 7];

  return (
    <section className="space-y-5">
      <div>
        <h1 className="font-heading text-3xl">Săptămâna {selectedWeek}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {weekTheme} · 4 stâlpi × 7 zile.
        </p>
      </div>

      <div className="space-y-4">
        {days.map((day) => {
          const items = activities
            .filter(
              (activity) =>
                activity.day_of_week === day && activity.week_number === selectedWeek,
            )
            .sort((a, b) => PILLARS.indexOf(a.pillar) - PILLARS.indexOf(b.pillar));
          const done = items.filter((activity) =>
            completions.some((row) => row.activity_id === activity.id),
          ).length;

          return (
            <section
              key={day}
              className={cn(
                "rounded-2xl border border-border bg-card p-4",
                day === today && "ring-2 ring-primary/30",
              )}
            >
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="flex items-baseline gap-2 font-heading text-xl">
                  {day === today ? `${getDayName(day)}\u00A0` : getDayName(day)}
                  {day === today ? (
                    <span className="text-sm font-sans font-medium text-primary">
                      azi
                    </span>
                  ) : null}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {done}/{items.length || 4}
                </p>
              </div>
              <ul className="mt-3 space-y-2">
                {items.map((activity) => {
                  const completion = completions.find(
                    (row) => row.activity_id === activity.id,
                  );
                  return (
                    <li key={activity.id}>
                      <Link
                        href={`/activitate/${activity.id}`}
                        className="flex items-center gap-2 rounded-xl px-1 py-1 hover:bg-muted"
                      >
                        <span
                          className={cn(
                            "size-2.5 rounded-full",
                            completion
                              ? completion.mode === "B" && completion.parent_approved === false
                                ? "bg-amber-500"
                                : "bg-primary"
                              : "bg-border",
                          )}
                        />
                        <PillarMark pillar={activity.pillar} />
                        <span className="truncate text-sm">{activity.title}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </section>
  );
}
