"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  playfulHeaderLabel,
  playfulSurpriseLabel,
  type PlayfulCharacter,
  type PlayfulCharacterId,
} from "@/lib/playful-pilot";

function PasorelSvg({ size }: { size: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden
    >
      <circle cx="32" cy="30" r="18" fill="#E8C98A" />
      <circle cx="32" cy="30" r="18" fill="none" stroke="#C4A15E" strokeWidth="1.5" />
      <ellipse cx="18" cy="34" rx="6" ry="4" fill="#D9B56F" />
      <circle cx="26" cy="27" r="2.2" fill="#3D2E1A" />
      <circle cx="38" cy="27" r="2.2" fill="#3D2E1A" />
      <circle cx="26.6" cy="26.4" r="0.7" fill="#FFF8EC" />
      <circle cx="38.6" cy="26.4" r="0.7" fill="#FFF8EC" />
      <path d="M32 31.5 L38 35 L32 36.5 Z" fill="#E07A3D" />
      <path
        d="M24 38 Q32 43 40 38"
        fill="none"
        stroke="#6B4E2E"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M24 50 L22 58 M24 50 L26 58"
        stroke="#C46A2B"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M40 50 L38 58 M40 50 L42 58"
        stroke="#C46A2B"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <ellipse cx="24" cy="50" rx="4" ry="3" fill="#E8C98A" stroke="#C4A15E" strokeWidth="1" />
      <ellipse cx="40" cy="50" rx="4" ry="3" fill="#E8C98A" stroke="#C4A15E" strokeWidth="1" />
    </svg>
  );
}

function FarfurioSvg({ size }: { size: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden
    >
      <circle cx="32" cy="34" r="22" fill="#F3E6C9" stroke="#C9B48A" strokeWidth="2" />
      <circle cx="32" cy="34" r="14" fill="#FFF9EE" stroke="#E0CFA8" strokeWidth="1.5" />
      <circle cx="26" cy="32" r="2.1" fill="#3D2E1A" />
      <circle cx="38" cy="32" r="2.1" fill="#3D2E1A" />
      <circle cx="26.6" cy="31.4" r="0.6" fill="#FFF8EC" />
      <circle cx="38.6" cy="31.4" r="0.6" fill="#FFF8EC" />
      <path
        d="M26 40 Q32 45 38 40"
        fill="none"
        stroke="#6B4E2E"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M48 18 Q58 22 54 34"
        fill="none"
        stroke="#D9A85C"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="48" cy="18" r="3.2" fill="#E8C98A" stroke="#C4A15E" strokeWidth="1" />
    </svg>
  );
}

const CHARACTER_SVG: Record<PlayfulCharacterId, (size: number) => ReactNode> = {
  pasorel: (size) => <PasorelSvg size={size} />,
  farfurio: (size) => <FarfurioSvg size={size} />,
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
    <span className={cn("inline-flex shrink-0", className)}>
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
