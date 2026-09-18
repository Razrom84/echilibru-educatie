"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  playfulHeaderLabel,
  playfulSurpriseLabel,
  type PlayfulCharacter,
  type PlayfulCharacterId,
} from "@/lib/playful-pilot";

function SuntelSvg({ size }: { size: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden
    >
      <circle cx="32" cy="32" r="18" fill="#E8D48A" />
      <circle cx="32" cy="32" r="18" fill="none" stroke="#C4A15E" strokeWidth="1.5" />
      <ellipse cx="16" cy="32" rx="5" ry="8" fill="#D9B56F" stroke="#C4A15E" strokeWidth="1" />
      <ellipse cx="48" cy="32" rx="5" ry="8" fill="#D9B56F" stroke="#C4A15E" strokeWidth="1" />
      <circle cx="26" cy="29" r="2.2" fill="#3D2E1A" />
      <circle cx="38" cy="29" r="2.2" fill="#3D2E1A" />
      <circle cx="26.6" cy="28.4" r="0.7" fill="#FFF8EC" />
      <circle cx="38.6" cy="28.4" r="0.7" fill="#FFF8EC" />
      <path
        d="M26 38 Q32 43 38 38"
        fill="none"
        stroke="#6B4E2E"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M52 22 Q58 32 52 42"
        fill="none"
        stroke="#7AA3C7"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M56 18 Q64 32 56 46"
        fill="none"
        stroke="#7AA3C7"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ManutaSvg({ size }: { size: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden
    >
      <title>Mănuță</title>
      <path
        d="M22 30 C22 18 26 12 32 12 C38 12 42 18 42 30 L42 38 C42 48 38 54 32 54 C26 54 22 48 22 38 Z"
        fill="#F3C7A4"
        stroke="#D9A07A"
        strokeWidth="1.5"
      />
      <path d="M20 28 L16 16" stroke="#F3C7A4" strokeWidth="5.5" strokeLinecap="round" />
      <path d="M26 20 L24 10" stroke="#F3C7A4" strokeWidth="5.2" strokeLinecap="round" />
      <path d="M32 18 L32 8" stroke="#F3C7A4" strokeWidth="5.2" strokeLinecap="round" />
      <path d="M38 20 L40 10" stroke="#F3C7A4" strokeWidth="5.2" strokeLinecap="round" />
      <path d="M44 28 L48 16" stroke="#F3C7A4" strokeWidth="5.5" strokeLinecap="round" />
      <circle cx="27" cy="36" r="1.8" fill="#3D2E1A" />
      <circle cx="37" cy="36" r="1.8" fill="#3D2E1A" />
      <circle cx="27.5" cy="35.5" r="0.55" fill="#FFF8EC" />
      <circle cx="37.5" cy="35.5" r="0.55" fill="#FFF8EC" />
      <path
        d="M28 43 Q32 46.5 36 43"
        fill="none"
        stroke="#6B4E2E"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

const CHARACTER_SVG: Record<PlayfulCharacterId, (size: number) => ReactNode> = {
  suntel: (size) => <SuntelSvg size={size} />,
  manuta: (size) => <ManutaSvg size={size} />,
};

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
    <span
      className={cn("inline-flex shrink-0", className)}
      role="img"
      aria-label={character.name}
    >
      {CHARACTER_SVG[character.id](size)}
    </span>
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
