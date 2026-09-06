"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DayChips, DayChipsFallback } from "@/components/day-chips";
import { useFamily } from "@/lib/family-context";
import { cn } from "@/lib/utils";

const VIEW_LINKS = [
  { href: "/azi", label: "Azi" },
  { href: "/saptamana", label: "Săptămâna asta" },
] as const;

export function AppHeader({ today }: { today: string }) {
  const pathname = usePathname();
  const { selectedChild, children, isDemo, family, weekTheme } = useFamily();
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
            {weekTheme} · 2–3 ani
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

      <nav aria-label="Azi și săptămâna asta" className="mt-3 flex flex-wrap gap-2">
        {VIEW_LINKS.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm font-medium",
                active
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Suspense fallback={<DayChipsFallback />}>
        <DayChips today={today} />
      </Suspense>
    </header>
  );
}
