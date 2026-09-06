"use client";

import Link from "next/link";
import { useFamily } from "@/lib/family-context";

export function AppHeader() {
  const { selectedChild, children, isDemo, family, selectedWeek, weekTheme } =
    useFamily();
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
    </header>
  );
}
