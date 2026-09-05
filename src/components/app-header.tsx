"use client";

import Link from "next/link";
import { useFamily } from "@/lib/family-context";
import { PROGRAM_WEEKS, WEEK_THEMES } from "@/lib/week";
import { cn } from "@/lib/utils";

export function AppHeader() {
  const {
    selectedChild,
    children,
    isDemo,
    family,
    selectedWeek,
    weekTheme,
    selectWeek,
  } = useFamily();
  const initial = selectedChild?.name.trim().charAt(0).toUpperCase() ?? "?";

  return (
    <header className="pb-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Echilibru educație
          </p>
          <p className="font-heading text-2xl leading-none">
            {selectedChild ? selectedChild.name : family?.display_name || "Familia ta"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Săptămâna {selectedWeek} · {weekTheme} · 2–3 ani
            {isDemo ? " · demonstrație" : ""}
          </p>
        </div>
        <Link
          href="/copii"
          className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-heading text-primary-foreground"
          aria-label={
            children.length > 1 ? "Schimbă copilul" : "Copii din familie"
          }
        >
          {initial}
        </Link>
      </div>

      <div
        role="tablist"
        aria-label="Săptămâna de program"
        className="mt-4 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {PROGRAM_WEEKS.map((week) => {
          const active = week === selectedWeek;
          return (
            <button
              key={week}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => selectWeek(week)}
              className={cn(
                "min-w-[7.25rem] shrink-0 rounded-2xl border px-3 py-2 text-left",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground",
              )}
            >
              <span className="block text-xs font-medium">Săptămâna {week}</span>
              <span
                className={cn(
                  "mt-0.5 block text-[11px] leading-4",
                  active ? "text-primary-foreground/80" : "text-muted-foreground",
                )}
              >
                {WEEK_THEMES[week]}
              </span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
