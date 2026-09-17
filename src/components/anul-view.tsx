"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { BandPreviewBanner } from "@/components/band-preview-banner";
import { PreviewWeekNav } from "@/components/preview-week-nav";
import { EmptyState, LoadingState } from "@/components/status-blocks";
import { Badge } from "@/components/ui/badge";
import {
  ANUL_ERROR,
  ANUL_NOW,
  ANUL_SUBTITLE,
  ANUL_TITLE,
  anulHidesPreviewThemeList,
  anulPreviewReady,
  anulWeekOpen,
  resolveAnulYearStart,
  yearWeekPreviews,
  yearWeeksBySeason,
} from "@/lib/anul";
import { PREVIEW_EMPTY } from "@/lib/band-preview";
import { useFamily } from "@/lib/family-context";
import { VIEW_WEEK_READ_ONLY, weekRelation } from "@/lib/view-week";
import { cn } from "@/lib/utils";

export function AnulView() {
  const {
    family,
    viewWeek,
    selectedWeek,
    isBandPreview,
    previewLoading,
    bandHasContent,
    bandWeekThemes,
    selectPreviewWeek,
  } = useFamily();

  const yearStart = resolveAnulYearStart(family);
  const officialWeek = selectedWeek;
  const weeks = useMemo(
    () =>
      yearWeekPreviews({
        programYearStart: yearStart,
        currentWeek: isBandPreview ? viewWeek : officialWeek,
        themes: isBandPreview ? bandWeekThemes : undefined,
      }),
    [bandWeekThemes, isBandPreview, officialWeek, viewWeek, yearStart],
  );
  const groups = useMemo(() => yearWeeksBySeason(weeks), [weeks]);
  const ready = anulPreviewReady(weeks);

  useEffect(() => {
    const current = document.getElementById(`saptamana-${viewWeek}`);
    current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [viewWeek]);

  const heading = (
    <div>
      <h1 className="font-heading text-3xl">{ANUL_TITLE}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{ANUL_SUBTITLE}</p>
    </div>
  );

  if (isBandPreview && previewLoading) {
    return (
      <section className="space-y-4">
        <BandPreviewBanner />
        {isBandPreview ? <PreviewWeekNav /> : null}
        {heading}
        <LoadingState label="Se încarcă previzualizarea…" />
      </section>
    );
  }

  if (anulHidesPreviewThemeList(isBandPreview, bandHasContent)) {
    return (
      <section className="space-y-4">
        <BandPreviewBanner />
        {isBandPreview ? <PreviewWeekNav /> : null}
        {heading}
        <EmptyState title={PREVIEW_EMPTY} />
      </section>
    );
  }

  if (!ready) {
    return (
      <section className="space-y-4">
        <BandPreviewBanner />
        {isBandPreview ? <PreviewWeekNav /> : null}
        {heading}
        <EmptyState title={ANUL_ERROR} body={ANUL_SUBTITLE} />
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <BandPreviewBanner />
      {isBandPreview ? <PreviewWeekNav /> : null}
      {heading}

      {isBandPreview && !bandHasContent ? (
        <EmptyState title={PREVIEW_EMPTY} />
      ) : null}

      {groups.length === 0 ? (
        <EmptyState title={ANUL_TITLE} body={ANUL_ERROR} />
      ) : (
        <div className="space-y-6">
          {groups.map((group) => (
            <section key={group.season} className="space-y-2">
              <h2 className="font-heading text-xl">{group.season}</h2>
              <ul className="space-y-2">
                {group.weeks.map((row) => {
                  const openable = anulWeekOpen(isBandPreview, row.current);
                  const relation = weekRelation(row.week, officialWeek);
                  const future = relation === "future";
                  const label = `S${row.week} · ${row.theme} · ${row.season}`;
                  const body = (
                    <>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium">
                            S{row.week}
                            <span className="text-muted-foreground"> · {row.season}</span>
                          </p>
                          {row.theme ? (
                            <p className="mt-0.5 text-sm leading-5">{row.theme}</p>
                          ) : null}
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-1">
                          {row.current ? (
                            <Badge variant="default">{ANUL_NOW}</Badge>
                          ) : null}
                          {future ? (
                            <span className="text-[11px] text-muted-foreground">
                              {VIEW_WEEK_READ_ONLY}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </>
                  );

                  return (
                    <li key={row.week} id={`saptamana-${row.week}`}>
                      {openable ? (
                        <Link
                          href="/saptamana"
                          aria-label={
                            row.current
                              ? `${label} · ${ANUL_NOW}`
                              : future
                                ? `${label} · ${VIEW_WEEK_READ_ONLY}`
                                : label
                          }
                          onClick={() => selectPreviewWeek(row.week)}
                          className={cn(
                            "block rounded-2xl border bg-card p-4 hover:bg-muted/50",
                            row.current
                              ? "border-primary/40 ring-2 ring-primary/20"
                              : "border-border",
                          )}
                        >
                          {body}
                        </Link>
                      ) : (
                        <div className="rounded-2xl border border-border bg-card p-4">
                          {body}
                        </div>
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
