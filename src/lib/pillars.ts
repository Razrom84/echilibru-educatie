import type { Pillar } from "@/lib/types";

export const PILLARS: Pillar[] = ["fizic", "mental", "resurse", "social"];

export const PILLAR_META: Record<
  Pillar,
  { label: string; hint: string; swatch: string; soft: string }
> = {
  fizic: {
    label: "Fizic",
    hint: "corp, curte, mișcare",
    swatch: "bg-[var(--pillar-fizic)]",
    soft: "bg-[var(--pillar-fizic-soft)] text-[var(--pillar-fizic-ink)]",
  },
  mental: {
    label: "Mental",
    hint: "nume, carte, atenție",
    swatch: "bg-[var(--pillar-mental)]",
    soft: "bg-[var(--pillar-mental-soft)] text-[var(--pillar-mental-ink)]",
  },
  resurse: {
    label: "Resurse",
    hint: "casă, treabă reală",
    swatch: "bg-[var(--pillar-resurse)]",
    soft: "bg-[var(--pillar-resurse-soft)] text-[var(--pillar-resurse-ink)]",
  },
  social: {
    label: "Social",
    hint: "salut, dăruire, noi",
    swatch: "bg-[var(--pillar-social)]",
    soft: "bg-[var(--pillar-social-soft)] text-[var(--pillar-social-ink)]",
  },
};
