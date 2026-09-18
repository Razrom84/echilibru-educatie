"use client";

import { cn } from "@/lib/utils";
import {
  playfulHeaderLabel,
  playfulSurpriseLabel,
  type PlayfulCharacter,
} from "@/lib/playful-pilot";

export function PlayfulCharacterMark({
  character,
  size = 48,
  className,
}: {
  character: PlayfulCharacter;
  size?: number;
  className?: string;
}) {
  return (
    // Static SVG — no animation, no chat.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={character.src}
      alt=""
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      aria-hidden
    />
  );
}

export function PlayfulAziHeader({
  character,
  theme,
  ritualOpen,
}: {
  character: PlayfulCharacter;
  theme: string;
  ritualOpen: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <PlayfulCharacterMark character={character} size={56} />
        <h1 className="font-heading text-3xl leading-tight">
          {playfulHeaderLabel(character.name, theme)}
        </h1>
      </div>
      <p className="mt-2 text-base font-medium text-foreground">{ritualOpen}</p>
    </div>
  );
}

export function PlayfulRitualBanner({ line }: { line: string }) {
  return (
    <p className="rounded-2xl bg-muted px-4 py-3 text-sm font-medium">{line}</p>
  );
}

export function PlayfulSurprise({
  surprise,
  compact,
}: {
  surprise: string;
  compact?: boolean;
}) {
  return (
    <p
      className={cn(
        "rounded-2xl border border-dashed border-accent-foreground/20 bg-accent/40 text-sm leading-6",
        compact ? "px-3 py-2" : "px-4 py-3",
      )}
    >
      <span className="font-medium">{playfulSurpriseLabel(surprise)}</span>
      {compact ? null : (
        <span className="mt-0.5 block text-xs text-muted-foreground">
          Dacă vrea — după cele patru.
        </span>
      )}
    </p>
  );
}

export function PlayfulWeekRitual({
  character,
  theme,
  ritualOpen,
}: {
  character: PlayfulCharacter;
  theme: string;
  ritualOpen: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border bg-card px-4 py-3">
      <PlayfulCharacterMark character={character} size={44} />
      <div className="min-w-0">
        <p className="font-heading text-lg leading-tight">
          {playfulHeaderLabel(character.name, theme)}
        </p>
        <p className="mt-1 text-sm font-medium">{ritualOpen}</p>
      </div>
    </div>
  );
}
