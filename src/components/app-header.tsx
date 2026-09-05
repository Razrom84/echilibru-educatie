"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useFamily } from "@/lib/family-context";
import { PROGRAM_WEEKS, WEEK_THEMES } from "@/lib/week";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const SCROLL_EDGE_PX = 2;

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
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const { scrollLeft, scrollWidth, clientWidth } = scroller;
    setCanScrollLeft(scrollLeft > SCROLL_EDGE_PX);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - SCROLL_EDGE_PX);
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    updateScrollButtons();
    scroller.addEventListener("scroll", updateScrollButtons, { passive: true });
    const observer = new ResizeObserver(updateScrollButtons);
    observer.observe(scroller);
    return () => {
      scroller.removeEventListener("scroll", updateScrollButtons);
      observer.disconnect();
    };
  }, [updateScrollButtons]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const active = scroller.querySelector<HTMLElement>(
      '[role="tab"][aria-selected="true"]',
    );
    if (!active) return;
    const scrollerBox = scroller.getBoundingClientRect();
    const activeBox = active.getBoundingClientRect();
    const delta =
      activeBox.left -
      scrollerBox.left -
      (scroller.clientWidth - activeBox.width) / 2;
    scroller.scrollBy({ left: delta, behavior: "smooth" });
  }, [selectedWeek]);

  const scrollWeeks = (direction: -1 | 1) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const amount = Math.max(scroller.clientWidth * 0.8, 160);
    scroller.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

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

      <div className="mt-4 flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="hidden size-11 shrink-0 rounded-2xl md:inline-flex"
          aria-label="Săptămâni anterioare"
          disabled={!canScrollLeft}
          onClick={() => scrollWeeks(-1)}
        >
          <ChevronLeft className="size-5" aria-hidden />
        </Button>
        <div
          ref={scrollerRef}
          role="tablist"
          aria-label="Săptămâna de program"
          className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="hidden size-11 shrink-0 rounded-2xl md:inline-flex"
          aria-label="Săptămâni următoare"
          disabled={!canScrollRight}
          onClick={() => scrollWeeks(1)}
        >
          <ChevronRight className="size-5" aria-hidden />
        </Button>
      </div>
    </header>
  );
}
