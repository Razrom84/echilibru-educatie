"use client";

import { EmptyState } from "@/components/status-blocks";
import { Progress } from "@/components/ui/progress";
import { useFamily } from "@/lib/family-context";
import { PILLAR_META, PILLARS } from "@/lib/pillars";
import { getDayName } from "@/lib/week";
import type { Pillar } from "@/lib/types";

export default function ProgresPage() {
  const { activities, completions, selectedChild, selectedWeek } = useFamily();

  if (!selectedChild) {
    return (
      <EmptyState title="Fără copil, fără progres" body="Adaugă un copil ca să numărăm zilele." />
    );
  }

  const weekActs = activities.filter((activity) => activity.week_number === selectedWeek);
  const weekIds = new Set(weekActs.map((activity) => activity.id));
  const weekCompletions = completions.filter((row) => weekIds.has(row.activity_id));
  const doneIds = new Set(weekCompletions.map((row) => row.activity_id));
  const approved = weekCompletions.filter(
    (row) => row.mode === "A" || row.parent_approved === true,
  ).length;
  const pending = weekCompletions.filter(
    (row) => row.mode === "B" && row.parent_approved === false,
  ).length;

  const byPillar = PILLARS.map((pillar: Pillar) => {
    const total = weekActs.filter((activity) => activity.pillar === pillar).length;
    const done = weekActs.filter(
      (activity) => activity.pillar === pillar && doneIds.has(activity.id),
    ).length;
    return { pillar, total, done };
  });

  const days = [1, 2, 3, 4, 5, 6, 7].map((day) => {
    const total = weekActs.filter((activity) => activity.day_of_week === day).length;
    const done = weekActs.filter(
      (activity) => activity.day_of_week === day && doneIds.has(activity.id),
    ).length;
    return { day, total, done };
  });

  const weekPct = weekActs.length
    ? Math.round((doneIds.size / weekActs.length) * 100)
    : 0;

  return (
    <section className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl">Progres</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {selectedChild.name} · săptămâna {selectedWeek} · {doneIds.size}/
          {weekActs.length} activități
        </p>
      </div>

      {weekActs.length === 0 ? (
        <EmptyState
          title="Nu sunt activități de numărat"
          body="Rulează seed-ul pentru săptămâna 1, banda 1–2."
        />
      ) : (
        <>
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-baseline justify-between">
              <p className="font-medium">Săptămâna întreagă</p>
              <p className="text-sm text-muted-foreground">{weekPct}%</p>
            </div>
            <Progress value={weekPct} className="mt-3 h-3" />
            <p className="mt-2 text-xs text-muted-foreground">
              {approved} aprobate
              {pending ? ` · ${pending} în așteptare (mod B)` : ""}
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-heading text-xl">Pe stâlpi</h2>
            {byPillar.map(({ pillar, done, total }) => {
              const pct = total ? Math.round((done / total) * 100) : 0;
              return (
                <div key={pillar} className="rounded-2xl border border-border bg-card p-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-medium">{PILLAR_META[pillar].label}</p>
                    <p className="text-sm text-muted-foreground">
                      {done}/{total}
                    </p>
                  </div>
                  <Progress value={pct} className="mt-3 h-2.5" />
                </div>
              );
            })}
          </div>

          <div>
            <h2 className="font-heading text-xl">Pe zile</h2>
            <ul className="mt-3 divide-y divide-border rounded-2xl border border-border bg-card">
              {days.map(({ day, done, total }) => (
                <li key={day} className="flex items-center justify-between px-4 py-3 text-sm">
                  <span>{getDayName(day)}</span>
                  <span className="text-muted-foreground">
                    {done}/{total}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </section>
  );
}
