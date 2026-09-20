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

function LuminitaSvg({ size }: { size: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden
    >
      <title>Luminiță</title>
      <circle cx="30" cy="30" r="16" fill="#E8D48A" stroke="#C4A15E" strokeWidth="1.5" />
      <path
        d="M42 22 C50 28 50 40 42 46 C46 38 46 30 42 22 Z"
        fill="#6B5A3A"
        stroke="#4A3C28"
        strokeWidth="1.2"
      />
      <path
        d="M30 10 L30 4 M18 18 L13 13 M42 18 L47 13 M14 30 L8 30 M46 30 L58 30 M18 42 L13 47 M42 42 L47 47 M30 46 L30 56"
        fill="none"
        stroke="#E8D48A"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="24" cy="28" r="1.9" fill="#3D2E1A" />
      <circle cx="34" cy="28" r="1.9" fill="#3D2E1A" />
      <circle cx="24.5" cy="27.5" r="0.55" fill="#FFF8EC" />
      <circle cx="34.5" cy="27.5" r="0.55" fill="#FFF8EC" />
      <path
        d="M25 36 Q30 40 35 36"
        fill="none"
        stroke="#6B4E2E"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CanutaSvg({ size }: { size: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden
    >
      <title>Cănuță</title>
      <path
        d="M18 22 L20 50 C20 54 24 56 32 56 C40 56 44 54 44 50 L46 22 Z"
        fill="#F2A07A"
        stroke="#D47A58"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <ellipse cx="32" cy="22" rx="14" ry="5" fill="#E8D48A" stroke="#C4A15E" strokeWidth="1.4" />
      <path
        d="M46 28 C54 28 56 36 48 40"
        fill="none"
        stroke="#D47A58"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M26 12 Q26 6 30 8 M32 12 Q32 5 36 8"
        fill="none"
        stroke="#7AA3C7"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="26" cy="36" r="1.9" fill="#3D2E1A" />
      <circle cx="36" cy="36" r="1.9" fill="#3D2E1A" />
      <circle cx="26.5" cy="35.5" r="0.55" fill="#FFF8EC" />
      <circle cx="36.5" cy="35.5" r="0.55" fill="#FFF8EC" />
      <path
        d="M27 44 Q32 47.5 37 44"
        fill="none"
        stroke="#6B4E2E"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HainutaSvg({ size }: { size: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden
    >
      <title>Hăinuță</title>
      <path
        d="M20 18 L12 28 L16 32 L20 26 L20 52 C20 54 22 56 32 56 C42 56 44 54 44 52 L44 26 L48 32 L52 28 L44 18 C40 14 24 14 20 18 Z"
        fill="#7AA3C7"
        stroke="#5E86A8"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M32 18 L32 54" fill="none" stroke="#5E86A8" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="32" cy="14" r="3" fill="#D9B56F" stroke="#C4A15E" strokeWidth="1.2" />
      <circle cx="26" cy="34" r="1.9" fill="#3D2E1A" />
      <circle cx="38" cy="34" r="1.9" fill="#3D2E1A" />
      <circle cx="26.5" cy="33.5" r="0.55" fill="#FFF8EC" />
      <circle cx="38.5" cy="33.5" r="0.55" fill="#FFF8EC" />
      <path
        d="M27 42 Q32 45.5 37 42"
        fill="none"
        stroke="#6B4E2E"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PotecutaSvg({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <title>Potecuță</title>
      <path d="M8 50 C18 42 22 38 32 40 C42 42 46 34 56 28" fill="none" stroke="#C4A15E" strokeWidth="8" strokeLinecap="round" />
      <circle cx="20" cy="46" r="3" fill="#8FBF8A" />
      <circle cx="34" cy="40" r="3.5" fill="#D98A4A" />
      <circle cx="48" cy="32" r="3" fill="#8FBF8A" />
      <circle cx="34" cy="22" r="12" fill="#E8D48A" stroke="#C4A15E" strokeWidth="1.5" />
      <circle cx="30" cy="20" r="1.9" fill="#3D2E1A" />
      <circle cx="38" cy="20" r="1.9" fill="#3D2E1A" />
      <circle cx="30.5" cy="19.5" r="0.55" fill="#FFF8EC" />
      <circle cx="38.5" cy="19.5" r="0.55" fill="#FFF8EC" />
      <path d="M31 26 Q34 29 37 26" fill="none" stroke="#6B4E2E" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function LinguritaSvg({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <title>Linguriță</title>
      <ellipse cx="32" cy="22" rx="14" ry="12" fill="#D9B56F" stroke="#C4A15E" strokeWidth="1.5" />
      <rect x="29" y="32" width="6" height="24" rx="3" fill="#C4A15E" />
      <circle cx="27" cy="20" r="1.9" fill="#3D2E1A" />
      <circle cx="37" cy="20" r="1.9" fill="#3D2E1A" />
      <circle cx="27.5" cy="19.5" r="0.55" fill="#FFF8EC" />
      <circle cx="37.5" cy="19.5" r="0.55" fill="#FFF8EC" />
      <path d="M28 26 Q32 29.5 36 26" fill="none" stroke="#6B4E2E" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function PicaturaSvg({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <title>Picătură</title>
      <path d="M32 8 C32 8 14 30 14 40 C14 50 22 56 32 56 C42 56 50 50 50 40 C50 30 32 8 32 8 Z" fill="#7AA3C7" stroke="#5E86A8" strokeWidth="1.5" />
      <path d="M24 22 Q28 18 32 22" fill="none" stroke="#C5E4F5" strokeWidth="2" strokeLinecap="round" />
      <circle cx="26" cy="38" r="1.9" fill="#3D2E1A" />
      <circle cx="38" cy="38" r="1.9" fill="#3D2E1A" />
      <circle cx="26.5" cy="37.5" r="0.55" fill="#FFF8EC" />
      <circle cx="38.5" cy="37.5" r="0.55" fill="#FFF8EC" />
      <path d="M27 46 Q32 49.5 37 46" fill="none" stroke="#3D2E1A" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function PasaricaSvg({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <title>Păsărică</title>
      <ellipse cx="34" cy="34" rx="16" ry="13" fill="#F2A07A" stroke="#D47A58" strokeWidth="1.5" />
      <path d="M20 34 Q10 24 22 22 Q16 32 20 34 Z" fill="#E8D48A" stroke="#C4A15E" strokeWidth="1.2" />
      <circle cx="48" cy="30" r="7" fill="#F2A07A" stroke="#D47A58" strokeWidth="1.3" />
      <path d="M54 30 L62 28 L54 34 Z" fill="#E8D48A" stroke="#C4A15E" strokeWidth="1" />
      <path d="M30 46 L28 56 M38 46 L40 56" fill="none" stroke="#C4A15E" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="46" cy="28" r="1.7" fill="#3D2E1A" />
      <circle cx="46.5" cy="27.5" r="0.5" fill="#FFF8EC" />
      <circle cx="30" cy="32" r="1.7" fill="#3D2E1A" />
      <circle cx="30.5" cy="31.5" r="0.5" fill="#FFF8EC" />
      <path d="M31 38 Q36 41 42 36" fill="none" stroke="#6B4E2E" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function MingiutaSvg({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <title>Mingiuță</title>
      <circle cx="32" cy="32" r="20" fill="#8FBF8A" stroke="#6A9A66" strokeWidth="1.5" />
      <path d="M16 24 Q32 18 48 24 M16 40 Q32 46 48 40 M32 12 L32 52" fill="none" stroke="#6A9A66" strokeWidth="1.4" />
      <circle cx="26" cy="28" r="1.9" fill="#3D2E1A" />
      <circle cx="38" cy="28" r="1.9" fill="#3D2E1A" />
      <circle cx="26.5" cy="27.5" r="0.55" fill="#FFF8EC" />
      <circle cx="38.5" cy="27.5" r="0.55" fill="#FFF8EC" />
      <path d="M27 38 Q32 42 37 38" fill="none" stroke="#6B4E2E" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function CarticicaSvg({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <title>Cărticică</title>
      <rect x="14" y="14" width="36" height="38" rx="3" fill="#7AA3C7" stroke="#5E86A8" strokeWidth="1.5" />
      <rect x="18" y="18" width="28" height="30" rx="1.5" fill="#FFF8EC" />
      <path d="M32 18 L32 48" fill="none" stroke="#C4A15E" strokeWidth="1.2" />
      <circle cx="26" cy="32" r="1.7" fill="#3D2E1A" />
      <circle cx="38" cy="32" r="1.7" fill="#3D2E1A" />
      <circle cx="26.5" cy="31.5" r="0.5" fill="#FFF8EC" />
      <circle cx="38.5" cy="31.5" r="0.5" fill="#FFF8EC" />
      <path d="M27 40 Q32 43 37 40" fill="none" stroke="#6B4E2E" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function CosuletSvg({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <title>Coșuleț</title>
      <path d="M16 24 L20 50 C20 54 24 56 32 56 C40 56 44 54 44 50 L48 24 Z" fill="#E8C48A" stroke="#C4A15E" strokeWidth="1.5" />
      <path d="M16 24 C16 16 48 16 48 24" fill="none" stroke="#C4A15E" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M22 32 L42 32 M22 40 L42 40" fill="none" stroke="#D9B56F" strokeWidth="1.2" />
      <circle cx="26" cy="36" r="1.9" fill="#3D2E1A" />
      <circle cx="38" cy="36" r="1.9" fill="#3D2E1A" />
      <circle cx="26.5" cy="35.5" r="0.55" fill="#FFF8EC" />
      <circle cx="38.5" cy="35.5" r="0.55" fill="#FFF8EC" />
      <path d="M27 44 Q32 47.5 37 44" fill="none" stroke="#6B4E2E" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function CasutaSvg({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <title>Căsuță</title>
      <path d="M10 30 L32 12 L54 30 Z" fill="#F2A07A" stroke="#D47A58" strokeWidth="1.5" strokeLinejoin="round" />
      <rect x="16" y="30" width="32" height="24" rx="2" fill="#E8D48A" stroke="#C4A15E" strokeWidth="1.5" />
      <rect x="28" y="40" width="8" height="14" rx="1" fill="#7AA3C7" stroke="#5E86A8" strokeWidth="1" />
      <circle cx="26" cy="38" r="1.9" fill="#3D2E1A" />
      <circle cx="38" cy="38" r="1.9" fill="#3D2E1A" />
      <circle cx="26.5" cy="37.5" r="0.55" fill="#FFF8EC" />
      <circle cx="38.5" cy="37.5" r="0.55" fill="#FFF8EC" />
      <path d="M27 46 Q32 49 37 46" fill="none" stroke="#6B4E2E" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function GaletusaSvg({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <title>Găletușă</title>
      <path d="M18 22 L22 52 C22 56 26 58 32 58 C38 58 42 56 42 52 L46 22 Z" fill="#7AA3C7" stroke="#5E86A8" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M18 22 C18 14 46 14 46 22" fill="none" stroke="#5E86A8" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M22 34 L42 34" fill="none" stroke="#C5E4F5" strokeWidth="2" strokeLinecap="round" />
      <circle cx="26" cy="40" r="1.9" fill="#3D2E1A" />
      <circle cx="38" cy="40" r="1.9" fill="#3D2E1A" />
      <circle cx="26.5" cy="39.5" r="0.55" fill="#FFF8EC" />
      <circle cx="38.5" cy="39.5" r="0.55" fill="#FFF8EC" />
      <path d="M27 48 Q32 51.5 37 48" fill="none" stroke="#3D2E1A" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function PervazutSvg({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <title>Pervazuț</title>
      <rect x="14" y="12" width="36" height="32" rx="2" fill="#C5E4F5" stroke="#5E86A8" strokeWidth="1.5"/>
      <rect x="12" y="42" width="40" height="8" rx="1" fill="#E8D48A" stroke="#C4A15E" strokeWidth="1.5"/>
      <path d="M32 12 L32 44" stroke="#5E86A8" strokeWidth="1.2"/>
      <circle cx="26" cy="36" r="1.9" fill="#3D2E1A"/>
      <circle cx="38" cy="36" r="1.9" fill="#3D2E1A"/>
      <circle cx="26.5" cy="35.5" r="0.55" fill="#FFF8EC"/>
      <circle cx="38.5" cy="35.5" r="0.55" fill="#FFF8EC"/>
      <path d="M27 44 Q32 47.5 37 44" fill="none" stroke="#6B4E2E" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

function GhemutSvg({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <title>Ghemuț</title>
      <ellipse cx="32" cy="34" rx="18" ry="16" fill="#E8D48A" stroke="#C4A15E" strokeWidth="1.5"/>
      <path d="M18 34 Q14 22 24 18" fill="none" stroke="#C4A15E" strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M46 34 Q50 22 40 18" fill="none" stroke="#C4A15E" strokeWidth="2.2" strokeLinecap="round"/>
      <circle cx="26" cy="32" r="1.9" fill="#3D2E1A"/>
      <circle cx="38" cy="32" r="1.9" fill="#3D2E1A"/>
      <circle cx="26.5" cy="31.5" r="0.55" fill="#FFF8EC"/>
      <circle cx="38.5" cy="31.5" r="0.55" fill="#FFF8EC"/>
      <path d="M27 40 Q32 43.5 37 40" fill="none" stroke="#6B4E2E" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

function NasutSvg({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <title>Năsuț</title>
      <circle cx="32" cy="30" r="18" fill="#E8D48A" stroke="#C4A15E" strokeWidth="1.5"/>
      <path d="M32 28 L28 40 L36 40 Z" fill="#F2A07A" stroke="#D47A58" strokeWidth="1.2"/>
      <circle cx="26" cy="30" r="1.9" fill="#3D2E1A"/>
      <circle cx="38" cy="30" r="1.9" fill="#3D2E1A"/>
      <circle cx="26.5" cy="29.5" r="0.55" fill="#FFF8EC"/>
      <circle cx="38.5" cy="29.5" r="0.55" fill="#FFF8EC"/>
      <path d="M27 38 Q32 41.5 37 38" fill="none" stroke="#6B4E2E" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

function UsitaSvg({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <title>Ușiță</title>
      <rect x="16" y="10" width="32" height="44" rx="2" fill="#E8D48A" stroke="#C4A15E" strokeWidth="1.5"/>
      <circle cx="40" cy="34" r="2.4" fill="#C4A15E"/>
      <circle cx="26" cy="30" r="1.9" fill="#3D2E1A"/>
      <circle cx="38" cy="30" r="1.9" fill="#3D2E1A"/>
      <circle cx="26.5" cy="29.5" r="0.55" fill="#FFF8EC"/>
      <circle cx="38.5" cy="29.5" r="0.55" fill="#FFF8EC"/>
      <path d="M27 38 Q32 41.5 37 38" fill="none" stroke="#6B4E2E" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

function LampitaSvg({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <title>Lămpiță</title>
      <path d="M20 18 L44 18 L40 34 L24 34 Z" fill="#F2E2A0" stroke="#C4A15E" strokeWidth="1.5"/>
      <rect x="29" y="34" width="6" height="16" rx="1" fill="#C4A15E"/>
      <circle cx="32" cy="22" r="4" fill="#F7D56A"/>
      <circle cx="26" cy="28" r="1.9" fill="#3D2E1A"/>
      <circle cx="38" cy="28" r="1.9" fill="#3D2E1A"/>
      <circle cx="26.5" cy="27.5" r="0.55" fill="#FFF8EC"/>
      <circle cx="38.5" cy="27.5" r="0.55" fill="#FFF8EC"/>
      <path d="M27 36 Q32 39.5 37 36" fill="none" stroke="#6B4E2E" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

function AmintioaraSvg({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <title>Amintioară</title>
      <path d="M32 14 L36 26 L48 26 L38 34 L42 46 L32 38 L22 46 L26 34 L16 26 L28 26 Z" fill="#F2A07A" stroke="#D47A58" strokeWidth="1.4"/>
      <circle cx="26" cy="30" r="1.9" fill="#3D2E1A"/>
      <circle cx="38" cy="30" r="1.9" fill="#3D2E1A"/>
      <circle cx="26.5" cy="29.5" r="0.55" fill="#FFF8EC"/>
      <circle cx="38.5" cy="29.5" r="0.55" fill="#FFF8EC"/>
      <path d="M27 38 Q32 41.5 37 38" fill="none" stroke="#6B4E2E" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

function FulgutaSvg({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <title>Fulguță</title>
      <circle cx="32" cy="32" r="16" fill="#E8F2FA" stroke="#7AA3C7" strokeWidth="1.5"/>
      <path d="M32 16 L32 48 M18 32 L46 32 M22 22 L42 42 M42 22 L22 42" stroke="#7AA3C7" strokeWidth="1.6" strokeLinecap="round"/>
      <circle cx="26" cy="32" r="1.9" fill="#3D2E1A"/>
      <circle cx="38" cy="32" r="1.9" fill="#3D2E1A"/>
      <circle cx="26.5" cy="31.5" r="0.55" fill="#FFF8EC"/>
      <circle cx="38.5" cy="31.5" r="0.55" fill="#FFF8EC"/>
      <path d="M27 40 Q32 43.5 37 40" fill="none" stroke="#6B4E2E" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

function NoroiutSvg({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <title>Noroiuț</title>
      <ellipse cx="32" cy="38" rx="20" ry="12" fill="#8B5E3C" stroke="#6B4423" strokeWidth="1.5"/>
      <circle cx="24" cy="34" r="6" fill="#A06C45"/>
      <circle cx="40" cy="36" r="7" fill="#7A4E2E"/>
      <circle cx="26" cy="30" r="1.9" fill="#3D2E1A"/>
      <circle cx="38" cy="30" r="1.9" fill="#3D2E1A"/>
      <circle cx="26.5" cy="29.5" r="0.55" fill="#FFF8EC"/>
      <circle cx="38.5" cy="29.5" r="0.55" fill="#FFF8EC"/>
      <path d="M27 38 Q32 41.5 37 38" fill="none" stroke="#6B4E2E" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

function MugurelSvg({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <title>Mugurel</title>
      <rect x="30" y="32" width="4" height="22" rx="2" fill="#6B8F4E"/>
      <ellipse cx="32" cy="24" rx="10" ry="14" fill="#8FBF8A" stroke="#6B8F4E" strokeWidth="1.4"/>
      <ellipse cx="32" cy="20" rx="5" ry="7" fill="#B7D9A8"/>
      <circle cx="26" cy="26" r="1.9" fill="#3D2E1A"/>
      <circle cx="38" cy="26" r="1.9" fill="#3D2E1A"/>
      <circle cx="26.5" cy="25.5" r="0.55" fill="#FFF8EC"/>
      <circle cx="38.5" cy="25.5" r="0.55" fill="#FFF8EC"/>
      <path d="M27 34 Q32 37.5 37 34" fill="none" stroke="#6B4E2E" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

function CioculetSvg({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <title>Cioculeț</title>
      <ellipse cx="30" cy="30" rx="14" ry="12" fill="#E8D48A" stroke="#C4A15E" strokeWidth="1.5"/>
      <path d="M44 30 L56 28 L44 36 Z" fill="#D98A4A"/>
      <path d="M22 22 Q18 12 28 16" fill="none" stroke="#C4A15E" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="26" cy="28" r="1.9" fill="#3D2E1A"/>
      <circle cx="38" cy="28" r="1.9" fill="#3D2E1A"/>
      <circle cx="26.5" cy="27.5" r="0.55" fill="#FFF8EC"/>
      <circle cx="38.5" cy="27.5" r="0.55" fill="#FFF8EC"/>
      <path d="M27 36 Q32 39.5 37 36" fill="none" stroke="#6B4E2E" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

function SamanticaSvg({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <title>Sămânțică</title>
      <ellipse cx="32" cy="34" rx="12" ry="16" fill="#D9B56F" stroke="#C4A15E" strokeWidth="1.5"/>
      <path d="M32 18 Q36 34 32 50 Q28 34 32 18" fill="#C4A15E"/>
      <circle cx="26" cy="32" r="1.9" fill="#3D2E1A"/>
      <circle cx="38" cy="32" r="1.9" fill="#3D2E1A"/>
      <circle cx="26.5" cy="31.5" r="0.55" fill="#FFF8EC"/>
      <circle cx="38.5" cy="31.5" r="0.55" fill="#FFF8EC"/>
      <path d="M27 40 Q32 43.5 37 40" fill="none" stroke="#6B4E2E" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

function RotundutaSvg({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <title>Rotunduță</title>
      <circle cx="32" cy="32" r="18" fill="#D98A4A" stroke="#B56C32" strokeWidth="1.5"/>
      <path d="M16 32 Q32 18 48 32 Q32 46 16 32" fill="none" stroke="#F2C9A0" strokeWidth="1.4"/>
      <circle cx="26" cy="32" r="1.9" fill="#3D2E1A"/>
      <circle cx="38" cy="32" r="1.9" fill="#3D2E1A"/>
      <circle cx="26.5" cy="31.5" r="0.55" fill="#FFF8EC"/>
      <circle cx="38.5" cy="31.5" r="0.55" fill="#FFF8EC"/>
      <path d="M27 40 Q32 43.5 37 40" fill="none" stroke="#6B4E2E" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

function NisiputSvg({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <title>Nisipuț</title>
      <path d="M12 44 L20 24 L44 24 L52 44 Z" fill="#E8C48A" stroke="#C4A15E" strokeWidth="1.5"/>
      <ellipse cx="32" cy="44" rx="20" ry="6" fill="#D9B56F"/>
      <circle cx="26" cy="30" r="1.9" fill="#3D2E1A"/>
      <circle cx="38" cy="30" r="1.9" fill="#3D2E1A"/>
      <circle cx="26.5" cy="29.5" r="0.55" fill="#FFF8EC"/>
      <circle cx="38.5" cy="29.5" r="0.55" fill="#FFF8EC"/>
      <path d="M27 38 Q32 41.5 37 38" fill="none" stroke="#6B4E2E" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

function UmbritaSvg({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <title>Umbriță</title>
      <ellipse cx="32" cy="40" rx="22" ry="10" fill="#A89878" stroke="#7A6A52" strokeWidth="1.3"/>
      <circle cx="32" cy="28" r="12" fill="#C4B494" stroke="#7A6A52" strokeWidth="1.3"/>
      <circle cx="26" cy="34" r="1.9" fill="#3D2E1A"/>
      <circle cx="38" cy="34" r="1.9" fill="#3D2E1A"/>
      <circle cx="26.5" cy="33.5" r="0.55" fill="#FFF8EC"/>
      <circle cx="38.5" cy="33.5" r="0.55" fill="#FFF8EC"/>
      <path d="M27 42 Q32 45.5 37 42" fill="none" stroke="#6B4E2E" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

function StropuletSvg({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <title>Stropuleț</title>
      <path d="M32 12 C32 12 16 32 16 40 C16 50 23 56 32 56 C41 56 48 50 48 40 C48 32 32 12 32 12 Z" fill="#7AA3C7" stroke="#5E86A8" strokeWidth="1.5"/>
      <circle cx="26" cy="30" r="1.9" fill="#3D2E1A"/>
      <circle cx="38" cy="30" r="1.9" fill="#3D2E1A"/>
      <circle cx="26.5" cy="29.5" r="0.55" fill="#FFF8EC"/>
      <circle cx="38.5" cy="29.5" r="0.55" fill="#FFF8EC"/>
      <path d="M27 38 Q32 41.5 37 38" fill="none" stroke="#6B4E2E" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

function GandacelSvg({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <title>Gândăcel</title>
      <ellipse cx="32" cy="34" rx="14" ry="10" fill="#6B8F4E" stroke="#4E6F38" strokeWidth="1.4"/>
      <circle cx="18" cy="34" r="6" fill="#8FBF8A" stroke="#4E6F38" strokeWidth="1.2"/>
      <path d="M44 28 Q54 20 50 32 M44 40 Q54 48 50 36" fill="none" stroke="#4E6F38" strokeWidth="1.4" strokeLinecap="round"/>
      <circle cx="26" cy="30" r="1.9" fill="#3D2E1A"/>
      <circle cx="38" cy="30" r="1.9" fill="#3D2E1A"/>
      <circle cx="26.5" cy="29.5" r="0.55" fill="#FFF8EC"/>
      <circle cx="38.5" cy="29.5" r="0.55" fill="#FFF8EC"/>
      <path d="M27 38 Q32 41.5 37 38" fill="none" stroke="#6B4E2E" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

function RacoritaSvg({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <title>Răcoriță</title>
      <path d="M32 10 L48 28 L16 28 Z" fill="#6B8F4E" stroke="#4E6F38" strokeWidth="1.4"/>
      <rect x="29" y="28" width="6" height="22" fill="#8B5E3C"/>
      <ellipse cx="32" cy="52" rx="16" ry="5" fill="#A89878" opacity="0.7"/>
      <circle cx="26" cy="28" r="1.9" fill="#3D2E1A"/>
      <circle cx="38" cy="28" r="1.9" fill="#3D2E1A"/>
      <circle cx="26.5" cy="27.5" r="0.55" fill="#FFF8EC"/>
      <circle cx="38.5" cy="27.5" r="0.55" fill="#FFF8EC"/>
      <path d="M27 36 Q32 39.5 37 36" fill="none" stroke="#6B4E2E" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

function TalpitaSvg({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <title>Tălpiță</title>
      <ellipse cx="32" cy="22" rx="10" ry="12" fill="#E8D48A" stroke="#C4A15E" strokeWidth="1.4"/>
      <ellipse cx="32" cy="42" rx="12" ry="14" fill="#E8D48A" stroke="#C4A15E" strokeWidth="1.4"/>
      <circle cx="26" cy="30" r="1.9" fill="#3D2E1A"/>
      <circle cx="38" cy="30" r="1.9" fill="#3D2E1A"/>
      <circle cx="26.5" cy="29.5" r="0.55" fill="#FFF8EC"/>
      <circle cx="38.5" cy="29.5" r="0.55" fill="#FFF8EC"/>
      <path d="M27 38 Q32 41.5 37 38" fill="none" stroke="#6B4E2E" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

function MaruletSvg({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <title>Măruleț</title>
      <circle cx="32" cy="34" r="16" fill="#D45A4A" stroke="#B04438" strokeWidth="1.5"/>
      <path d="M32 18 Q36 12 40 14" fill="none" stroke="#6B8F4E" strokeWidth="2" strokeLinecap="round"/>
      <ellipse cx="36" cy="16" rx="5" ry="3" fill="#8FBF8A"/>
      <circle cx="26" cy="34" r="1.9" fill="#3D2E1A"/>
      <circle cx="38" cy="34" r="1.9" fill="#3D2E1A"/>
      <circle cx="26.5" cy="33.5" r="0.55" fill="#FFF8EC"/>
      <circle cx="38.5" cy="33.5" r="0.55" fill="#FFF8EC"/>
      <path d="M27 42 Q32 45.5 37 42" fill="none" stroke="#6B4E2E" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

function MaturitaSvg({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <title>Măturiță</title>
      <rect x="30" y="8" width="4" height="28" rx="2" fill="#C4A15E"/>
      <path d="M18 36 L32 32 L46 36 L44 54 L20 54 Z" fill="#D9B56F" stroke="#C4A15E" strokeWidth="1.4"/>
      <circle cx="26" cy="24" r="1.9" fill="#3D2E1A"/>
      <circle cx="38" cy="24" r="1.9" fill="#3D2E1A"/>
      <circle cx="26.5" cy="23.5" r="0.55" fill="#FFF8EC"/>
      <circle cx="38.5" cy="23.5" r="0.55" fill="#FFF8EC"/>
      <path d="M27 32 Q32 35.5 37 32" fill="none" stroke="#6B4E2E" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

function PortitaSvg({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <title>Portiță</title>
      <rect x="12" y="14" width="16" height="36" fill="#E8D48A" stroke="#C4A15E" strokeWidth="1.5"/>
      <rect x="36" y="14" width="16" height="36" fill="#E8D48A" stroke="#C4A15E" strokeWidth="1.5"/>
      <rect x="26" y="12" width="12" height="6" fill="#C4A15E"/>
      <circle cx="42" cy="34" r="2" fill="#8B5E3C"/>
      <circle cx="26" cy="28" r="1.9" fill="#3D2E1A"/>
      <circle cx="38" cy="28" r="1.9" fill="#3D2E1A"/>
      <circle cx="26.5" cy="27.5" r="0.55" fill="#FFF8EC"/>
      <circle cx="38.5" cy="27.5" r="0.55" fill="#FFF8EC"/>
      <path d="M27 36 Q32 39.5 37 36" fill="none" stroke="#6B4E2E" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

function VantuletSvg({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <title>Vântuleț</title>
      <path d="M12 24 C22 18 28 22 40 18 C50 14 54 20 52 26" fill="none" stroke="#7AA3C7" strokeWidth="3" strokeLinecap="round"/>
      <path d="M14 36 C24 30 34 38 46 32 C54 28 56 36 50 40" fill="none" stroke="#8FBF8A" strokeWidth="2.6" strokeLinecap="round"/>
      <circle cx="32" cy="32" r="10" fill="#E8D48A" stroke="#C4A15E" strokeWidth="1.3"/>
      <circle cx="26" cy="30" r="1.9" fill="#3D2E1A"/>
      <circle cx="38" cy="30" r="1.9" fill="#3D2E1A"/>
      <circle cx="26.5" cy="29.5" r="0.55" fill="#FFF8EC"/>
      <circle cx="38.5" cy="29.5" r="0.55" fill="#FFF8EC"/>
      <path d="M27 38 Q32 41.5 37 38" fill="none" stroke="#6B4E2E" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

function SaculetSvg({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <title>Săculeț</title>
      <path d="M20 22 L24 50 C24 54 28 56 32 56 C36 56 40 54 40 50 L44 22 Z" fill="#D9B56F" stroke="#C4A15E" strokeWidth="1.5"/>
      <path d="M20 22 C20 14 44 14 44 22" fill="none" stroke="#C4A15E" strokeWidth="2.2" strokeLinecap="round"/>
      <circle cx="26" cy="32" r="1.9" fill="#3D2E1A"/>
      <circle cx="38" cy="32" r="1.9" fill="#3D2E1A"/>
      <circle cx="26.5" cy="31.5" r="0.55" fill="#FFF8EC"/>
      <circle cx="38.5" cy="31.5" r="0.55" fill="#FFF8EC"/>
      <path d="M27 40 Q32 43.5 37 40" fill="none" stroke="#6B4E2E" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

function InimioaraSvg({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <title>Inimioară</title>
      <path d="M32 48 C12 32 14 16 32 24 C50 16 52 32 32 48 Z" fill="#F2A07A" stroke="#D47A58" strokeWidth="1.5"/>
      <circle cx="26" cy="32" r="1.9" fill="#3D2E1A"/>
      <circle cx="38" cy="32" r="1.9" fill="#3D2E1A"/>
      <circle cx="26.5" cy="31.5" r="0.55" fill="#FFF8EC"/>
      <circle cx="38.5" cy="31.5" r="0.55" fill="#FFF8EC"/>
      <path d="M27 40 Q32 43.5 37 40" fill="none" stroke="#6B4E2E" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

function PasuletSvg({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <title>Pașuleț</title>
      <ellipse cx="24" cy="22" rx="8" ry="10" fill="#E8D48A" stroke="#C4A15E" strokeWidth="1.3"/>
      <ellipse cx="24" cy="40" rx="9" ry="12" fill="#E8D48A" stroke="#C4A15E" strokeWidth="1.3"/>
      <ellipse cx="42" cy="26" rx="8" ry="10" fill="#D9B56F" stroke="#C4A15E" strokeWidth="1.3"/>
      <ellipse cx="42" cy="44" rx="9" ry="12" fill="#D9B56F" stroke="#C4A15E" strokeWidth="1.3"/>
      <circle cx="26" cy="28" r="1.9" fill="#3D2E1A"/>
      <circle cx="38" cy="28" r="1.9" fill="#3D2E1A"/>
      <circle cx="26.5" cy="27.5" r="0.55" fill="#FFF8EC"/>
      <circle cx="38.5" cy="27.5" r="0.55" fill="#FFF8EC"/>
      <path d="M27 36 Q32 39.5 37 36" fill="none" stroke="#6B4E2E" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

function DegetelSvg({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <title>Degețel</title>
      <rect x="26" y="28" width="12" height="26" rx="6" fill="#E8D48A" stroke="#C4A15E" strokeWidth="1.5"/>
      <rect x="28" y="8" width="8" height="24" rx="4" fill="#E8D48A" stroke="#C4A15E" strokeWidth="1.5"/>
      <circle cx="26" cy="36" r="1.9" fill="#3D2E1A"/>
      <circle cx="38" cy="36" r="1.9" fill="#3D2E1A"/>
      <circle cx="26.5" cy="35.5" r="0.55" fill="#FFF8EC"/>
      <circle cx="38.5" cy="35.5" r="0.55" fill="#FFF8EC"/>
      <path d="M27 44 Q32 47.5 37 44" fill="none" stroke="#6B4E2E" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

function GrijitaSvg({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <title>Grijiță</title>
      <rect x="16" y="20" width="32" height="28" rx="3" fill="#E8D48A" stroke="#C4A15E" strokeWidth="1.5"/>
      <path d="M16 28 C16 20 48 20 48 28" fill="none" stroke="#C4A15E" strokeWidth="2" strokeLinecap="round"/>
      <rect x="28" y="34" width="8" height="6" rx="1" fill="#C4A15E"/>
      <circle cx="26" cy="30" r="1.9" fill="#3D2E1A"/>
      <circle cx="38" cy="30" r="1.9" fill="#3D2E1A"/>
      <circle cx="26.5" cy="29.5" r="0.55" fill="#FFF8EC"/>
      <circle cx="38.5" cy="29.5" r="0.55" fill="#FFF8EC"/>
      <path d="M27 38 Q32 41.5 37 38" fill="none" stroke="#6B4E2E" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

function SalutelSvg({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <title>Salutel</title>
      <circle cx="32" cy="32" r="16" fill="#E8D48A" stroke="#C4A15E" strokeWidth="1.5"/>
      <path d="M46 24 Q56 18 54 30 Q56 40 46 38" fill="none" stroke="#C4A15E" strokeWidth="2.4" strokeLinecap="round"/>
      <circle cx="26" cy="30" r="1.9" fill="#3D2E1A"/>
      <circle cx="38" cy="30" r="1.9" fill="#3D2E1A"/>
      <circle cx="26.5" cy="29.5" r="0.55" fill="#FFF8EC"/>
      <circle cx="38.5" cy="29.5" r="0.55" fill="#FFF8EC"/>
      <path d="M27 38 Q32 41.5 37 38" fill="none" stroke="#6B4E2E" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

function ScumputSvg({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <title>Scumpuț</title>
      <path d="M32 12 L36 24 L48 24 L38 32 L42 44 L32 36 L22 44 L26 32 L16 24 L28 24 Z" fill="#F7D56A" stroke="#C4A15E" strokeWidth="1.4"/>
      <circle cx="26" cy="30" r="1.9" fill="#3D2E1A"/>
      <circle cx="38" cy="30" r="1.9" fill="#3D2E1A"/>
      <circle cx="26.5" cy="29.5" r="0.55" fill="#FFF8EC"/>
      <circle cx="38.5" cy="29.5" r="0.55" fill="#FFF8EC"/>
      <path d="M27 38 Q32 41.5 37 38" fill="none" stroke="#6B4E2E" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

function LinistitaSvg({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <title>Liniștiță</title>
      <ellipse cx="32" cy="36" rx="20" ry="14" fill="#E8D48A" stroke="#C4A15E" strokeWidth="1.5"/>
      <path d="M14 30 Q32 18 50 30" fill="none" stroke="#C4A15E" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="26" cy="32" r="1.9" fill="#3D2E1A"/>
      <circle cx="38" cy="32" r="1.9" fill="#3D2E1A"/>
      <circle cx="26.5" cy="31.5" r="0.55" fill="#FFF8EC"/>
      <circle cx="38.5" cy="31.5" r="0.55" fill="#FFF8EC"/>
      <path d="M27 40 Q32 43.5 37 40" fill="none" stroke="#6B4E2E" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

function CurtitaSvg({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <title>Curtiță</title>
      <rect x="10" y="20" width="6" height="28" fill="#C4A15E"/>
      <rect x="48" y="20" width="6" height="28" fill="#C4A15E"/>
      <path d="M10 24 L54 24 M10 32 L54 32 M10 40 L54 40" stroke="#8FBF8A" strokeWidth="2.2"/>
      <circle cx="32" cy="28" r="10" fill="#E8D48A" stroke="#C4A15E" strokeWidth="1.3"/>
      <circle cx="26" cy="28" r="1.9" fill="#3D2E1A"/>
      <circle cx="38" cy="28" r="1.9" fill="#3D2E1A"/>
      <circle cx="26.5" cy="27.5" r="0.55" fill="#FFF8EC"/>
      <circle cx="38.5" cy="27.5" r="0.55" fill="#FFF8EC"/>
      <path d="M27 36 Q32 39.5 37 36" fill="none" stroke="#6B4E2E" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

function BlanduletSvg({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <title>Blânduleț</title>
      <path d="M40 16 C24 16 16 28 16 36 C16 48 26 54 32 54 C26 46 26 34 40 28 C44 26 46 22 44 18 C42 16 40 16 40 16 Z" fill="#F2E2A0" stroke="#C4A15E" strokeWidth="1.5"/>
      <circle cx="26" cy="32" r="1.9" fill="#3D2E1A"/>
      <circle cx="38" cy="32" r="1.9" fill="#3D2E1A"/>
      <circle cx="26.5" cy="31.5" r="0.55" fill="#FFF8EC"/>
      <circle cx="38.5" cy="31.5" r="0.55" fill="#FFF8EC"/>
      <path d="M27 40 Q32 43.5 37 40" fill="none" stroke="#6B4E2E" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

const CHARACTER_SVG: Record<PlayfulCharacterId, (size: number) => ReactNode> = {
  casuta: (size) => <CasutaSvg size={size} />,
  galetusa: (size) => <GaletusaSvg size={size} />,
  suntel: (size) => <SuntelSvg size={size} />,
  manuta: (size) => <ManutaSvg size={size} />,
  carioca: (size) => <CariocaSvg size={size} />,
  sageata: (size) => <SageataSvg size={size} />,
  presulet: (size) => <PresuletSvg size={size} />,
  frunzulita: (size) => <FrunzulitaSvg size={size} />,
  suflare: (size) => <SuflareSvg size={size} />,
  cutiuta: (size) => <CutiutaSvg size={size} />,
  luminita: (size) => <LuminitaSvg size={size} />,
  canuta: (size) => <CanutaSvg size={size} />,
  hainuta: (size) => <HainutaSvg size={size} />,
  potecuta: (size) => <PotecutaSvg size={size} />,
  lingurita: (size) => <LinguritaSvg size={size} />,
  picatura: (size) => <PicaturaSvg size={size} />,
  pasarica: (size) => <PasaricaSvg size={size} />,
  mingiuta: (size) => <MingiutaSvg size={size} />,
  carticica: (size) => <CarticicaSvg size={size} />,
  cosulet: (size) => <CosuletSvg size={size} />,
  pervazut: (size) => <PervazutSvg size={size} />,
  ghemut: (size) => <GhemutSvg size={size} />,
  nasut: (size) => <NasutSvg size={size} />,
  usita: (size) => <UsitaSvg size={size} />,
  lampita: (size) => <LampitaSvg size={size} />,
  amintioara: (size) => <AmintioaraSvg size={size} />,
  fulguta: (size) => <FulgutaSvg size={size} />,
  noroiut: (size) => <NoroiutSvg size={size} />,
  mugurel: (size) => <MugurelSvg size={size} />,
  cioculet: (size) => <CioculetSvg size={size} />,
  samantica: (size) => <SamanticaSvg size={size} />,
  rotunduta: (size) => <RotundutaSvg size={size} />,
  nisiput: (size) => <NisiputSvg size={size} />,
  umbrita: (size) => <UmbritaSvg size={size} />,
  stropulet: (size) => <StropuletSvg size={size} />,
  gandacel: (size) => <GandacelSvg size={size} />,
  racorita: (size) => <RacoritaSvg size={size} />,
  talpita: (size) => <TalpitaSvg size={size} />,
  marulet: (size) => <MaruletSvg size={size} />,
  maturita: (size) => <MaturitaSvg size={size} />,
  portita: (size) => <PortitaSvg size={size} />,
  vantulet: (size) => <VantuletSvg size={size} />,
  saculet: (size) => <SaculetSvg size={size} />,
  inimioara: (size) => <InimioaraSvg size={size} />,
  pasulet: (size) => <PasuletSvg size={size} />,
  degetel: (size) => <DegetelSvg size={size} />,
  grijita: (size) => <GrijitaSvg size={size} />,
  salutel: (size) => <SalutelSvg size={size} />,
  scumput: (size) => <ScumputSvg size={size} />,
  linistita: (size) => <LinistitaSvg size={size} />,
  curtita: (size) => <CurtitaSvg size={size} />,
  blandulet: (size) => <BlanduletSvg size={size} />,
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
