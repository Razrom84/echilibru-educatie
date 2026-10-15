"use client";

import { cn } from "@/lib/utils";
import type { JocMotion, JocObjectKind } from "@/lib/joc/levels";

const MOTION_CLASS: Record<JocMotion, string> = {
  rise: "joc-rise",
  sway: "joc-sway",
  down: "joc-down",
  hold: "joc-hold",
  scoop: "joc-hold",
  clap: "joc-clap",
  nod: "joc-nod",
  sweep: "joc-sweep",
};

export function JocObject({
  object,
  motion,
  reacted,
  sceneIndex,
}: {
  object: JocObjectKind;
  motion: JocMotion;
  reacted: boolean;
  sceneIndex: number;
}) {
  const motionClass = reacted ? MOTION_CLASS[motion] : undefined;
  if (object === "balloon") return <Balloon className={motionClass} />;
  if (object === "bucket") {
    return <Bucket className={motionClass} scoop={scoopCount(sceneIndex, reacted)} />;
  }
  if (object === "palm") return <Palm className={motionClass} />;
  if (object === "cow") return <Cow className={motionClass} />;
  if (object === "leaf") return <Leaf className={motionClass} />;
  if (object === "door") return <Door className={motionClass} />;
  if (object === "shoe") return <Shoe className={motionClass} />;
  if (object === "toy") return <Toy className={motionClass} />;
  return <Stone className={motionClass} />;
}

function scoopCount(sceneIndex: number, reacted: boolean): number {
  const base = Math.min(Math.max(sceneIndex, 0), 3);
  if (sceneIndex < 3 && reacted) return base + 1;
  return base;
}

function Stone({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className="size-[70%] overflow-visible" aria-hidden>
      <g className={cn("joc-motion", className)} style={{ transformOrigin: "50% 70%" }}>
        <ellipse cx="100" cy="112" rx="58" ry="36" fill="#C4B59A" stroke="#8C7A62" strokeWidth="3" />
        <ellipse cx="78" cy="100" rx="16" ry="10" fill="#E4D7C4" opacity="0.9" />
      </g>
    </svg>
  );
}

function Door({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className="size-[74%] overflow-visible" aria-hidden>
      <g className={cn("joc-motion", className)} style={{ transformOrigin: "50% 80%" }}>
        <rect x="58" y="36" width="84" height="132" rx="6" fill="#E7D3A4" stroke="#B08968" strokeWidth="3" />
        <circle cx="124" cy="104" r="5" fill="#B08968" />
      </g>
    </svg>
  );
}

function Toy({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className="size-[74%] overflow-visible" aria-hidden>
      <g className={cn("joc-motion", className)} style={{ transformOrigin: "50% 60%" }}>
        <circle cx="100" cy="96" r="52" fill="#E07A3D" stroke="#B56C32" strokeWidth="3" />
        <path d="M62 78 C86 64 114 64 138 78" fill="none" stroke="#F6C7A4" strokeWidth="4" strokeLinecap="round" />
        <path d="M70 118 C90 132 110 132 130 118" fill="none" stroke="#B56C32" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function Shoe({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className="size-[74%] overflow-visible" aria-hidden>
      <g className={cn("joc-motion", className)} style={{ transformOrigin: "50% 70%" }}>
        <path
          d="M46 118 C70 92 96 96 112 104 C132 78 156 86 164 108 C172 128 150 142 46 142 Z"
          fill="#F3C7A4"
          stroke="#D9A07A"
          strokeWidth="3"
        />
      </g>
    </svg>
  );
}

function Balloon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className="size-[78%] overflow-visible" aria-hidden>
      <g className={cn("joc-motion", className)} style={{ transformOrigin: "50% 70%" }}>
        <ellipse cx="100" cy="78" rx="48" ry="56" fill="#E07A3D" stroke="#B56C32" strokeWidth="3" />
        <ellipse cx="82" cy="60" rx="14" ry="18" fill="#F6C7A4" opacity="0.85" />
        <path d="M100 132 L90 146 L110 146 Z" fill="#B56C32" />
        <path
          d="M100 146 C88 162 112 176 96 192"
          fill="none"
          stroke="#C4A15E"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

function Bucket({ className, scoop }: { className?: string; scoop: number }) {
  return (
    <svg viewBox="0 0 200 200" className="size-[78%] overflow-visible" aria-hidden>
      <g className={cn("joc-motion", className)} style={{ transformOrigin: "50% 80%" }}>
        <path
          d="M52 86 H148 L136 168 Q100 182 64 168 Z"
          fill="#E7D3A4"
          stroke="#B08968"
          strokeWidth="3"
        />
        <path
          d="M46 74 H154 Q146 92 100 92 Q54 92 46 74 Z"
          fill="#D7B98A"
          stroke="#B08968"
          strokeWidth="3"
        />
        {scoop >= 1 ? (
          <ellipse cx="100" cy="118" rx="34" ry="12" fill="#8C6239" className="joc-enter" />
        ) : null}
        {scoop >= 2 ? (
          <ellipse cx="100" cy="108" rx="30" ry="11" fill="#A0713E" className="joc-enter" />
        ) : null}
        {scoop >= 3 ? (
          <ellipse cx="100" cy="98" rx="26" ry="10" fill="#8C6239" className="joc-enter" />
        ) : null}
      </g>
    </svg>
  );
}

function Palm({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className="size-[78%] overflow-visible" aria-hidden>
      <g className={cn("joc-motion", className)} style={{ transformOrigin: "50% 80%" }}>
        <path d="M78 118 C78 86 92 70 100 70 C108 70 122 86 122 118 L122 150 C122 168 112 176 100 176 C88 176 78 168 78 150 Z" fill="#F3C7A4" stroke="#D9A07A" strokeWidth="3" />
        <path d="M70 112 C62 86 70 70 78 74" fill="none" stroke="#F3C7A4" strokeWidth="14" strokeLinecap="round" />
        <path d="M86 78 C84 52 92 46 98 58" fill="none" stroke="#F3C7A4" strokeWidth="14" strokeLinecap="round" />
        <path d="M108 74 C112 48 122 48 122 66" fill="none" stroke="#F3C7A4" strokeWidth="14" strokeLinecap="round" />
        <path d="M126 100 C140 78 148 86 140 108" fill="none" stroke="#F3C7A4" strokeWidth="14" strokeLinecap="round" />
        <path d="M70 112 C62 86 70 70 78 74" fill="none" stroke="#D9A07A" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function Cow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className="size-[82%] overflow-visible" aria-hidden>
      <g className={cn("joc-motion", className)} style={{ transformOrigin: "50% 78%" }}>
        <ellipse cx="108" cy="118" rx="52" ry="32" fill="#F7F1E4" stroke="#C4B59A" strokeWidth="3" />
        <ellipse cx="86" cy="108" rx="12" ry="8" fill="#6B4E2E" />
        <ellipse cx="124" cy="124" rx="10" ry="7" fill="#6B4E2E" />
        <path d="M70 132 V156" stroke="#C4B59A" strokeWidth="6" strokeLinecap="round" />
        <path d="M96 140 V162" stroke="#C4B59A" strokeWidth="6" strokeLinecap="round" />
        <path d="M128 140 V162" stroke="#C4B59A" strokeWidth="6" strokeLinecap="round" />
        <path d="M148 132 V156" stroke="#C4B59A" strokeWidth="6" strokeLinecap="round" />
        <circle cx="62" cy="96" r="26" fill="#F7F1E4" stroke="#C4B59A" strokeWidth="3" />
        <path d="M44 82 L36 64" stroke="#6B4E2E" strokeWidth="5" strokeLinecap="round" />
        <path d="M78 80 L88 62" stroke="#6B4E2E" strokeWidth="5" strokeLinecap="round" />
        <circle cx="52" cy="94" r="3" fill="#3D2E1A" />
        <circle cx="70" cy="94" r="3" fill="#3D2E1A" />
        <ellipse cx="60" cy="106" rx="8" ry="5" fill="#E7B7B0" />
      </g>
    </svg>
  );
}

function Leaf({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className="size-[74%] overflow-visible" aria-hidden>
      <g className={cn("joc-motion", className)} style={{ transformOrigin: "40% 60%" }}>
        <path
          d="M48 132 C48 70 110 40 156 48 C150 110 108 156 48 132 Z"
          fill="#6E9A55"
          stroke="#4F7A3E"
          strokeWidth="3"
        />
        <path
          d="M64 124 C90 104 120 80 146 58"
          fill="none"
          stroke="#F4F7EF"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path d="M90 112 L78 96" fill="none" stroke="#F4F7EF" strokeWidth="2" strokeLinecap="round" />
        <path d="M112 96 L104 80" fill="none" stroke="#F4F7EF" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
}
