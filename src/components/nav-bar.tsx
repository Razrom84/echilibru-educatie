"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, House, Settings2, Sprout } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/azi", label: "Azi", icon: House },
  { href: "/saptamana", label: "Săptămâna asta", icon: CalendarDays },
  { href: "/progres", label: "Progres", icon: Sprout },
  { href: "/setari", label: "Setări", icon: Settings2 },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigare principală"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur md:hidden"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-4 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1">
        {ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-center text-[11px] leading-tight font-medium",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className="size-5" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function SideNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Navigare" className="hidden w-52 shrink-0 md:block">
      <ul className="sticky top-6 space-y-1">
        {ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
