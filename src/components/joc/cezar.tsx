import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import {
  CEZAR_ANIMATION_CLASS,
  CEZAR_ANIMATION_MS,
  type CezarAnimation,
} from "@/lib/joc/cezar";

const SKIN = "#F6D2B0";
const HAIR = "#D4924A";
const HAIR_LIGHT = "#E4B56A";
const BLOUSE = "#FFF8EE";
const OVERALLS = "#E0B04A";
const BOOT = "#E8C49A";
const INK = "#7A5436";
const FRECKLE = "#E09868";

const PART: CSSProperties = { transformOrigin: "50% 0%" };
const LEAN: CSSProperties = { transformOrigin: "50% 100%" };

/**
 * Toddler Cezar, variant B. One shared pose at a time, drawn beside a single object.
 */
export function Cezar({ animation }: { animation: CezarAnimation }) {
  const style = { "--cezar-dur": `${CEZAR_ANIMATION_MS}ms` } as CSSProperties;
  return (
    <svg
      viewBox="0 0 200 230"
      aria-hidden
      data-cezar-motion={animation}
      style={style}
      className={cn(
        "joc-cezar pointer-events-none h-auto w-[min(42vw,200px)] shrink-0 overflow-visible",
        CEZAR_ANIMATION_CLASS[animation],
      )}
    >
      <g className="cezar-zoom">
        <ellipse cx="100" cy="214" rx="34" ry="7" fill="#E7D3B0" opacity="0.85" />
        <g className="cezar-body">
          <Leg side="l" />
          <Leg side="r" />
          <g className="cezar-lean cezar-part" style={LEAN}>
            <path
              d="M76 118c-8 4-12 20-8 48h64c4-28 0-44-8-48-10 8-20 10-24 10s-14-2-24-10z"
              fill={BLOUSE}
              stroke={INK}
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path
              d="M86 132h28v30c0 4-6 8-14 8s-14-4-14-8z"
              fill={OVERALLS}
              stroke={INK}
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path
              d="M90 134c-10-2-16-14-18-24"
              fill="none"
              stroke={OVERALLS}
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M110 134c10-2 16-14 18-24"
              fill="none"
              stroke={OVERALLS}
              strokeWidth="5"
              strokeLinecap="round"
            />
            <circle cx="94" cy="146" r="2.1" fill="#F6E2B0" />
            <circle cx="106" cy="146" r="2.1" fill="#F6E2B0" />
            <rect x="92" y="108" width="16" height="14" rx="5" fill={SKIN} />
            <Arm side="far" />
            <Arm side="near" />
            <Head />
          </g>
        </g>
      </g>
    </svg>
  );
}

function Leg({ side }: { side: "l" | "r" }) {
  const left = side === "l";
  const shift = left ? 0 : 36;
  return (
    <g className={left ? "cezar-leg-l cezar-part" : "cezar-leg-r cezar-part"} style={PART}>
      <path
        d={`M${74 + shift} 158c-2 0-8 18-6 40h24c2-22 0-40-6-40h-12z`}
        fill={OVERALLS}
        stroke={INK}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <ellipse cx={84 + shift} cy="204" rx="15" ry="9" fill={BOOT} stroke={INK} strokeWidth="1.6" />
      <path
        d={`M${70 + shift} 198h28`}
        stroke="#F7E7CC"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </g>
  );
}

function Arm({ side }: { side: "far" | "near" }) {
  const far = side === "far";
  return (
    <g className={far ? "cezar-arm-far cezar-part" : "cezar-arm-near cezar-part"} style={PART}>
      <path
        d={far ? "M78 118c-1 14-6 28-8 40" : "M122 118c1 14 6 28 8 40"}
        fill="none"
        stroke={SKIN}
        strokeWidth="11"
        strokeLinecap="round"
      />
      <path
        d={far ? "M78 116c-1 8-2 14-3 16" : "M122 116c1 8 2 14 3 16"}
        fill="none"
        stroke={BLOUSE}
        strokeWidth="12"
        strokeLinecap="round"
      />
      <circle cx={far ? 68 : 132} cy="160" r="8" fill={SKIN} stroke={INK} strokeWidth="1.5" />
    </g>
  );
}

function Head() {
  return (
    <g className="cezar-head">
      <ellipse cx="66" cy="86" rx="7" ry="8" fill={SKIN} stroke={INK} strokeWidth="1.4" />
      <ellipse cx="134" cy="86" rx="7" ry="8" fill={SKIN} stroke={INK} strokeWidth="1.4" />
      <circle cx="100" cy="82" r="34" fill={SKIN} stroke={INK} strokeWidth="1.6" />
      <path
        d="M70 80c-2-30 16-46 34-44 22-2 36 16 32 42-8-18-20-26-34-24-16 1-26 10-32 26z"
        fill={HAIR}
        stroke={INK}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M114 42c10-14 22-8 16 6-6-2-12-2-16-6z" fill={HAIR_LIGHT} />
      <path d="M86 58c6-4 14-4 22 0" fill="none" stroke={HAIR_LIGHT} strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="78" cy="92" rx="7" ry="3.5" fill="#E7A08A" opacity="0.4" />
      <ellipse cx="122" cy="92" rx="7" ry="3.5" fill="#E7A08A" opacity="0.4" />
      <circle cx="88" cy="84" r="2.5" fill="#3D2E1A" />
      <circle cx="112" cy="84" r="2.5" fill="#3D2E1A" />
      <circle cx="89" cy="83" r="0.8" fill="#FFF8EE" />
      <circle cx="113" cy="83" r="0.8" fill="#FFF8EE" />
      <circle cx="80" cy="94" r="1.15" fill={FRECKLE} />
      <circle cx="85" cy="98" r="1.05" fill={FRECKLE} />
      <circle cx="78" cy="99" r="0.9" fill={FRECKLE} />
      <circle cx="120" cy="94" r="1.15" fill={FRECKLE} />
      <circle cx="115" cy="98" r="1.05" fill={FRECKLE} />
      <circle cx="122" cy="99" r="0.9" fill={FRECKLE} />
      <path d="M96 96c2 2 6 2 8 0" fill="none" stroke={INK} strokeWidth="1.3" strokeLinecap="round" />
      <path d="M90 104q10 8 20 0" fill="none" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
    </g>
  );
}
