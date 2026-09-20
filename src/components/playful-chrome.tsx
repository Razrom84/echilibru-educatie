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
      <title>Mânuță</title>
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

function CariocaSvg({ size }: { size: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden
    >
      <title>Cariocă</title>
      <rect x="22" y="10" width="20" height="10" rx="3" fill="#7AA3C7" stroke="#5E86A8" strokeWidth="1.4" />
      <rect x="24" y="18" width="16" height="32" rx="4" fill="#F2A07A" stroke="#D47A58" strokeWidth="1.5" />
      <path d="M28 50 L32 56 L36 50 Z" fill="#E24B4B" stroke="#C43A3A" strokeWidth="1" />
      <circle cx="28" cy="32" r="1.9" fill="#3D2E1A" />
      <circle cx="36" cy="32" r="1.9" fill="#3D2E1A" />
      <circle cx="28.5" cy="31.5" r="0.55" fill="#FFF8EC" />
      <circle cx="36.5" cy="31.5" r="0.55" fill="#FFF8EC" />
      <path
        d="M29 39 Q32 42.5 35 39"
        fill="none"
        stroke="#6B4E2E"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <rect x="24" y="20" width="16" height="3" fill="#E8D48A" />
    </svg>
  );
}

function SageataSvg({ size }: { size: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden
    >
      <title>Săgeată</title>
      <path
        d="M32 8 L48 26 L38 26 L38 52 L26 52 L26 26 L16 26 Z"
        fill="#8FBF8A"
        stroke="#6A9A66"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="28" cy="36" r="1.8" fill="#3D2E1A" />
      <circle cx="36" cy="36" r="1.8" fill="#3D2E1A" />
      <circle cx="28.5" cy="35.5" r="0.55" fill="#FFF8EC" />
      <circle cx="36.5" cy="35.5" r="0.55" fill="#FFF8EC" />
      <path
        d="M29 43 Q32 46.5 35 43"
        fill="none"
        stroke="#6B4E2E"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PresuletSvg({ size }: { size: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden
    >
      <title>Preșuleț</title>
      <rect x="8" y="22" width="48" height="24" rx="6" fill="#D9B56F" stroke="#C4A15E" strokeWidth="1.5" />
      <path
        d="M12 22 L12 18 M18 22 L18 17 M24 22 L24 18 M30 22 L30 17 M34 22 L34 18 M40 22 L40 17 M46 22 L46 18 M52 22 L52 18"
        stroke="#C4A15E"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 46 L12 50 M18 46 L18 51 M24 46 L24 50 M30 46 L30 51 M34 46 L34 50 M40 46 L40 51 M46 46 L46 50 M52 46 L52 50"
        stroke="#C4A15E"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="26" cy="33" r="2" fill="#3D2E1A" />
      <circle cx="38" cy="33" r="2" fill="#3D2E1A" />
      <circle cx="26.6" cy="32.4" r="0.65" fill="#FFF8EC" />
      <circle cx="38.6" cy="32.4" r="0.65" fill="#FFF8EC" />
      <path
        d="M27 40 Q32 44 37 40"
        fill="none"
        stroke="#6B4E2E"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FrunzulitaSvg({ size }: { size: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden
    >
      <title>Frunzuliță</title>
      <path
        d="M32 8 C46 14 54 28 48 42 C42 54 22 54 16 42 C10 28 18 14 32 8 Z"
        fill="#D98A4A"
        stroke="#B86A32"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M32 14 L32 50" fill="none" stroke="#8FBF8A" strokeWidth="1.6" strokeLinecap="round" />
      <path
        d="M32 24 Q22 28 18 34 M32 32 Q42 36 46 42"
        fill="none"
        stroke="#C4A15E"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="26" cy="30" r="1.9" fill="#3D2E1A" />
      <circle cx="36" cy="30" r="1.9" fill="#3D2E1A" />
      <circle cx="26.5" cy="29.5" r="0.55" fill="#FFF8EC" />
      <circle cx="36.5" cy="29.5" r="0.55" fill="#FFF8EC" />
      <path
        d="M27 38 Q32 42 37 38"
        fill="none"
        stroke="#6B4E2E"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SuflareSvg({ size }: { size: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden
    >
      <title>Suflare</title>
      <ellipse cx="28" cy="34" rx="16" ry="14" fill="#B7D4EA" stroke="#7AA3C7" strokeWidth="1.5" />
      <ellipse cx="40" cy="30" rx="12" ry="11" fill="#CDE4F4" stroke="#7AA3C7" strokeWidth="1.2" />
      <path
        d="M50 22 Q58 20 60 14 M52 28 Q62 26 62 20 M50 34 Q60 34 62 28"
        fill="none"
        stroke="#7AA3C7"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="26" cy="32" r="1.9" fill="#3D2E1A" />
      <circle cx="36" cy="32" r="1.9" fill="#3D2E1A" />
      <circle cx="26.5" cy="31.5" r="0.55" fill="#FFF8EC" />
      <circle cx="36.5" cy="31.5" r="0.55" fill="#FFF8EC" />
      <path
        d="M27 40 Q32 43.5 37 40"
        fill="none"
        stroke="#6B4E2E"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CutiutaSvg({ size }: { size: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden
    >
      <title>Cutiuță</title>
      <rect x="12" y="24" width="40" height="28" rx="4" fill="#E8C48A" stroke="#C4A15E" strokeWidth="1.5" />
      <rect x="10" y="16" width="44" height="12" rx="3" fill="#D9B56F" stroke="#C4A15E" strokeWidth="1.5" />
      <rect x="28" y="18" width="8" height="6" rx="1.5" fill="#7AA3C7" stroke="#5E86A8" strokeWidth="1" />
      <circle cx="26" cy="38" r="1.9" fill="#3D2E1A" />
      <circle cx="38" cy="38" r="1.9" fill="#3D2E1A" />
      <circle cx="26.5" cy="37.5" r="0.55" fill="#FFF8EC" />
      <circle cx="38.5" cy="37.5" r="0.55" fill="#FFF8EC" />
      <path
        d="M27 46 Q32 49.5 37 46"
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
  carioca: (size) => <CariocaSvg size={size} />,
  sageata: (size) => <SageataSvg size={size} />,
  presulet: (size) => <PresuletSvg size={size} />,
  frunzulita: (size) => <FrunzulitaSvg size={size} />,
  suflare: (size) => <SuflareSvg size={size} />,
  cutiuta: (size) => <CutiutaSvg size={size} />,
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
