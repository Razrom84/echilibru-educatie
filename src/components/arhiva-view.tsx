"use client";

import { useEffect, useMemo, useState } from "react";
import { DayPhotoPicker } from "@/components/day-photo-picker";
import { EmptyState } from "@/components/status-blocks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ARCHIVE_EMPTY_DAY,
  ARCHIVE_EMPTY_PERIOD,
  ARCHIVE_HEADING,
  ARCHIVE_PDF_BUSY,
  ARCHIVE_PDF_MONTH,
  ARCHIVE_PDF_WEEK,
  ARCHIVE_PDF_YEAR,
  ARCHIVE_SUBTITLE,
  addCivilDays,
  archiveDayHasContent,
  calendarMonthPeriod,
  calendarYearPeriod,
  civilWeekPeriod,
} from "@/lib/archive";
import { useFamily } from "@/lib/family-context";
import { formatRoLongDate } from "@/lib/monday-digest";
import { civilDayOfWeek, toCivilDate } from "@/lib/program-week";
import { getDayName } from "@/lib/week";
import type { ArchiveDay } from "@/lib/types";
import Link from "next/link";

function monthInputValue(dateOnly: string): string {
  return dateOnly.slice(0, 7);
}

function parseMonthInput(value: string): { year: number; month: number } | null {
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  if (month < 1 || month > 12) return null;
  return { year, month };
}

function triggerDownload(bytes: Uint8Array, filename: string) {
  const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function ArhivaView({ today }: { today: string }) {
  const {
    selectedChild,
    loadArchiveDays,
    signedPhotoUrl,
    downloadPhotoBytes,
  } = useFamily();
  const [selectedDate, setSelectedDate] = useState(today);
  const [days, setDays] = useState<ArchiveDay[]>([]);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfBusy, setPdfBusy] = useState<"week" | "month" | "year" | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const monthValue = monthInputValue(selectedDate);
  const monthPeriod = useMemo(() => {
    const parsed = parseMonthInput(monthValue);
    return parsed ? calendarMonthPeriod(parsed.year, parsed.month) : calendarMonthPeriod(
      toCivilDate(selectedDate).year,
      toCivilDate(selectedDate).month,
    );
  }, [monthValue, selectedDate]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!selectedChild) {
        setDays([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const rows = await loadArchiveDays(monthPeriod.start, monthPeriod.end);
        if (!cancelled) setDays(rows);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Nu am putut deschide arhiva.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [loadArchiveDays, monthPeriod.end, monthPeriod.start, reloadToken, selectedChild]);

  const selectedRow = days.find((row) => row.civil_date === selectedDate) ?? null;

  useEffect(() => {
    let cancelled = false;
    let created: string | null = null;
    async function loadUrl() {
      if (!selectedRow?.photo_path) {
        setPhotoUrl(null);
        return;
      }
      const url = await signedPhotoUrl(selectedRow.photo_path);
      if (cancelled) {
        if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
        return;
      }
      created = url;
      setPhotoUrl(url);
    }
    void loadUrl();
    return () => {
      cancelled = true;
      if (created?.startsWith("blob:")) URL.revokeObjectURL(created);
    };
  }, [selectedRow?.photo_path, signedPhotoUrl]);

  async function downloadPeriod(kind: "week" | "month" | "year") {
    if (!selectedChild) return;
    setPdfBusy(kind);
    setError(null);
    try {
      const period =
        kind === "week"
          ? civilWeekPeriod(selectedDate)
          : kind === "month"
            ? monthPeriod
            : calendarYearPeriod(toCivilDate(selectedDate).year);
      const rows = await loadArchiveDays(period.start, period.end);
      const photos = new Map<string, { bytes: Uint8Array }>();
      for (const row of rows) {
        if (!row.photo_path) continue;
        const bytes = await downloadPhotoBytes(row.photo_path);
        if (bytes) photos.set(row.photo_path, { bytes });
      }
      const { buildArchiveBookletPdf, pdfDownloadFilename } = await import(
        "@/lib/archive-pdf"
      );
      const pdf = await buildArchiveBookletPdf({
        period,
        children: [{ id: selectedChild.id, name: selectedChild.name }],
        days: rows,
        photos,
      });
      triggerDownload(pdf, pdfDownloadFilename(period));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nu am putut pregăti caietul.");
    } finally {
      setPdfBusy(null);
    }
  }

  if (!selectedChild) {
    return (
      <EmptyState
        title="Adaugă un copil"
        body="Arhiva e privată, pe copil."
        action={
          <Link href="/onboarding" className="text-sm font-medium text-primary underline">
            Mergi la onboarding
          </Link>
        }
      />
    );
  }

  const weekday = getDayName(civilDayOfWeek(selectedDate));
  const hasContent = selectedRow ? archiveDayHasContent(selectedRow) : false;
  const canGoNext = selectedDate < today;

  return (
    <section className="space-y-5">
      <div>
        <h1 className="font-heading text-3xl">{ARCHIVE_HEADING}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{ARCHIVE_SUBTITLE}</p>
      </div>

      <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-border bg-card p-4">
        <div className="space-y-1">
          <Label htmlFor="arhiva-zi">Ziua</Label>
          <Input
            id="arhiva-zi"
            type="date"
            value={selectedDate}
            max={today}
            onChange={(event) => setSelectedDate(event.target.value || today)}
            className="h-11 w-[11.5rem]"
          />
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-11"
            onClick={() => setSelectedDate(addCivilDays(selectedDate, -1))}
          >
            Ziua trecută
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11"
            disabled={!canGoNext}
            onClick={() =>
              setSelectedDate((current) => {
                const next = addCivilDays(current, 1);
                return next > today ? today : next;
              })
            }
          >
            Ziua următoare
          </Button>
        </div>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      {loading ? (
        <p className="text-sm text-muted-foreground">Deschid arhiva…</p>
      ) : (
        <article className="space-y-4 rounded-2xl border border-border bg-card p-4">
          <div>
            <h2 className="font-heading text-2xl">
              {weekday}, {formatRoLongDate(selectedDate)}
            </h2>
            {selectedRow?.age_band_label ? (
              <p className="mt-1 text-sm text-muted-foreground">
                Banda {selectedRow.age_band_label} ani
              </p>
            ) : null}
          </div>
          {hasContent ? (
            <div className="space-y-3">
              {selectedRow?.done_titles?.length ? (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Ați făcut
                  </p>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
                    {selectedRow.done_titles.map((title) => (
                      <li key={title}>{title}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {selectedRow?.day_note?.trim() ? (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Notă
                  </p>
                  <p className="mt-1 text-sm leading-6">{selectedRow.day_note}</p>
                </div>
              ) : null}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{ARCHIVE_EMPTY_DAY}</p>
          )}
          <DayPhotoPicker
            civilDate={selectedDate}
            photoUrl={photoUrl}
            hasPhoto={Boolean(selectedRow?.photo_path)}
            onChanged={() => setReloadToken((value) => value + 1)}
          />
        </article>
      )}

      <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
        <p className="text-sm font-medium">Caiet PDF</p>
        <p className="text-xs leading-5 text-muted-foreground">
          Același caiet scurt pentru săptămână (luni–duminică), lună sau an: data, ce ați
          făcut, nota și fotografia. Fără punctaje.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            className="h-11 flex-1"
            disabled={pdfBusy != null}
            onClick={() => void downloadPeriod("week")}
          >
            {pdfBusy === "week" ? ARCHIVE_PDF_BUSY : ARCHIVE_PDF_WEEK}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11 flex-1"
            disabled={pdfBusy != null}
            onClick={() => void downloadPeriod("month")}
          >
            {pdfBusy === "month" ? ARCHIVE_PDF_BUSY : ARCHIVE_PDF_MONTH}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11 flex-1"
            disabled={pdfBusy != null}
            onClick={() => void downloadPeriod("year")}
          >
            {pdfBusy === "year" ? ARCHIVE_PDF_BUSY : ARCHIVE_PDF_YEAR}
          </Button>
        </div>
        {days.every((row) => !archiveDayHasContent(row)) && !loading ? (
          <p className="text-xs text-muted-foreground">{ARCHIVE_EMPTY_PERIOD}</p>
        ) : null}
      </div>
    </section>
  );
}
