"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { aziDayOfWeek } from "@/lib/azi";
import { useFamily } from "@/lib/family-context";
import { mondayOf } from "@/lib/program-week";
import {
  focusedWeekDay,
  parseWeekDayParam,
  visibleProgramWeekDays,
  weekDayAriaLabel,
  weekDayChipLabel,
  weekDayChipSecondary,
  weekDayHref,
} from "@/lib/saptamana";
import { cn } from "@/lib/utils";

const SCROLL_EDGE_PX = 2;

export function DayChips({ today }: { today: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { family, status } = useFamily();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const todayDay = aziDayOfWeek(today);
  const days = visibleProgramWeekDays({
    weekMonday: mondayOf(today),
    joinedAt: family?.joined_at ?? family?.created_at,
  });
  const requestedDay = pathname.startsWith("/saptamana")
    ? parseWeekDayParam(searchParams.get("zi"))
    : null;
  const selectedDay = focusedWeekDay({
    requestedDay,
    todayDay,
    visibleDays: days,
  });

  const updateScrollButtons = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const { scrollLeft, scrollWidth, clientWidth } = scroller;
    setCanScrollLeft(scrollLeft > SCROLL_EDGE_PX);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - SCROLL_EDGE_PX);
  }, []);

  useEffect(() => {
    if (status !== "ready") return;
    const scroller = scrollerRef.current;
    if (!scroller) return;
    updateScrollButtons();
    scroller.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons);
    const observer = new ResizeObserver(updateScrollButtons);
    observer.observe(scroller);
    return () => {
      scroller.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
      observer.disconnect();
    };
  }, [days.length, status, updateScrollButtons]);

  useEffect(() => {
    if (status !== "ready") return;
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
    requestAnimationFrame(updateScrollButtons);
  }, [selectedDay, status, updateScrollButtons]);

  const scrollDays = (direction: -1 | 1) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const amount = Math.max(scroller.clientWidth * 0.8, 160);
    scroller.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  if (status !== "ready" || days.length === 0) {
    return status !== "ready" ? <DayChipsFallback /> : null;
  }

  return (
    <div className="mt-4 flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="hidden size-11 shrink-0 rounded-2xl md:inline-flex"
        aria-label="Zile anterioare"
        disabled={!canScrollLeft}
        onClick={() => scrollDays(-1)}
      >
        <ChevronLeft className="size-5" aria-hidden />
      </Button>
      <div
        ref={scrollerRef}
        role="tablist"
        aria-label="Zilele săptămânii"
        className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {days.map((day) => {
          const active = day === selectedDay;
          const isToday = day === todayDay;
          return (
            <Link
              key={day}
              href={weekDayHref(day)}
              role="tab"
              aria-selected={active}
              aria-label={weekDayAriaLabel(day, isToday)}
              className={cn(
                "w-[8.25rem] min-w-[8.25rem] shrink-0 rounded-2xl border px-3 py-2 text-left",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground",
              )}
            >
              <span className="block text-xs font-medium">{weekDayChipLabel(day)}</span>
              <span
                className={cn(
                  "mt-0.5 block text-[11px] leading-4",
                  active ? "text-primary-foreground/80" : "text-muted-foreground",
                )}
              >
                {weekDayChipSecondary(day, isToday)}
              </span>
            </Link>
          );
        })}
      </div>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="hidden size-11 shrink-0 rounded-2xl md:inline-flex"
        aria-label="Zile următoare"
        disabled={!canScrollRight}
        onClick={() => scrollDays(1)}
      >
        <ChevronRight className="size-5" aria-hidden />
      </Button>
    </div>
  );
}

export function DayChipsFallback() {
  return (
    <div className="mt-4 flex items-center gap-2" aria-hidden>
      <div className="hidden size-11 shrink-0 md:block" />
      <div className="h-14 min-w-0 flex-1 rounded-2xl bg-muted/60" />
      <div className="hidden size-11 shrink-0 md:block" />
    </div>
  );
}
