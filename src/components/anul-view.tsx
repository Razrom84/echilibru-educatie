"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { EmptyState } from "@/components/status-blocks";
import { Badge } from "@/components/ui/badge";
import {
  ANUL_ERROR,
  ANUL_LOCKED,
  ANUL_NOW,
  ANUL_SUBTITLE,
  ANUL_TITLE,
  anulPreviewReady,
  resolveAnulYearStart,
  yearWeekPreviews,
  yearWeeksBySeason,
} from "@/lib/anul";
import { useFamily } from "@/lib/family-context";
import { cn } from "@/lib/utils";

export function AnulView() {
  const { family, selectedWeek } = useFamily();
  const [noticeWeek, setNoticeWeek] = useState<number | null>(null);

  const yearStart = resolveAnulYearStart(family);
  const weeks = useMemo(
    () =>
      yearWeekPreviews({
        programYearStart: yearStart,
        currentWeek: selectedWeek,
      }),
    [selectedWeek, yearStart],
  );
  const groups = useMemo(() => yearWeeksBySeason(weeks), [weeks]);
  const ready = anulPreviewReady(weeks);

  useEffect(() => {
    const current = document.getElementById(`saptamana-${selectedWeek}`);
    current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [selectedWeek]);

  if (!ready) {
    return (
      <section className="space-y-4">
        <div>
          <h1 className="font-heading text-3xl">{ANUL_TITLE}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{ANUL_SUBTITLE}</p>
        </div>
        <EmptyState title={ANUL_ERROR} body={ANUL_SUBTITLE} />
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <div>
        <h1 className="font-heading text-3xl">{ANUL_TITLE}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{ANUL_SUBTITLE}</p>
      </div>

      {groups.length === 0 ? (
        <EmptyState title={ANUL_TITLE} body={ANUL_ERROR} />
      ) : (
        <div className="space-y-6">
          {groups.map((group) => (
            <section key={group.season} className="space-y-2">
              <h2 className="font-heading text-xl">{group.season}</h2>
              <ul className="space-y-2">
                {group.weeks.map((row) => {
                  const lockedOpen = noticeWeek === row.week;
                  const label = `S${row.week} · ${row.theme} · ${row.season}`;
                  const body = (
                    <>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium">
                            S{row.week}
                            <span className="text-muted-foreground"> · {row.season}</span>
                          </p>
                          <p className="mt-0.5 text-sm leading-5">{row.theme}</p>
                        </div>
                        {row.current ? (
                          <Badge variant="default">{ANUL_NOW}</Badge>
                        ) : null}
                      </div>
                      {!row.current && lockedOpen ? (
                        <p
                          className="mt-2 text-sm text-muted-foreground"
                          role="status"
                          aria-live="polite"
                        >
                          {ANUL_LOCKED}
                        </p>
                      ) : null}
                    </>
                  );

                  return (
                    <li key={row.week} id={`saptamana-${row.week}`}>
                      {row.current ? (
                        <Link
                          href="/saptamana"
                          aria-label={`${label} · ${ANUL_NOW}`}
                          className={cn(
                            "block rounded-2xl border border-primary/40 bg-card p-4",
                            "ring-2 ring-primary/20 hover:bg-muted/50",
                          )}
                        >
                          {body}
                        </Link>
                      ) : (
                        <button
                          type="button"
                          aria-label={label}
                          aria-expanded={lockedOpen}
                          onClick={() =>
                            setNoticeWeek((current) =>
                              current === row.week ? null : row.week,
                            )
                          }
                          className="w-full rounded-2xl border border-border bg-card p-4 text-left hover:bg-muted/40"
                        >
                          {body}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </section>
  );
}
