"use client";

import { memo, useEffect, useRef } from "react";
import {
  MOSTRA_ACTION_MS,
  MOSTRA_ANGLE_JOINTS,
  MOSTRA_BONE,
  MOSTRA_FADE_HOLD_MS,
  MOSTRA_FADE_IN_MS,
  MOSTRA_FADE_OUT_MS,
  MOSTRA_VIEW,
  mostraClips,
  mostraJointTransform,
  mostraFadeBeats,
  mostraSequenceMs,
  mostraToyRest,
  type MostraPose,
} from "@/lib/joc/mostra";

const SKIN = "#F6D2B0";
const HAIR = "#C9843F";
const HAIR_LIGHT = "#E2B56A";
const BLOUSE = "#FFF8EE";
const OVERALLS = "#E0B04A";
const BOOT = "#E8C49A";
const INK = "#6A4B34";
const TOY = "#E07A3D";
const TOY_BAND = "#F6C7A4";
const PAPER = "#F3E6D0";

function openingPose(): MostraPose {
  return mostraClips()[0]?.poses[0] ?? mostraFadeBeats()[0];
}

/**
 * Pencil Cezar, side view, bare face. Nested SVG viewports are the joints:
 * each one rotates around its own origin, and the Web Animations API eases
 * between 8–12 poses. The toy is reparented into the near hand when they meet.
 */
export const MostraStage = memo(function MostraStage({
  replayToken = 0,
  onDone,
}: {
  replayToken?: number;
  onDone?: () => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  });

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    let cancelled = false;
    let finished = false;
    const anims: Animation[] = [];
    let raf = 0;
    let backup = 0;

    const finish = () => {
      if (cancelled || finished) return;
      finished = true;
      onDoneRef.current?.();
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const budget = reduced
      ? mostraFadeBeats().length * (MOSTRA_FADE_IN_MS + MOSTRA_FADE_HOLD_MS + MOSTRA_FADE_OUT_MS) + 1_500
      : mostraSequenceMs() + 1_500;
    backup = window.setTimeout(finish, budget);

    const joint = (name: string) => svg.querySelector(`[data-joint="${name}"]`);
    const toy = () => svg.querySelector("[data-mostra-toy]") as SVGGElement | null;
    const grip = () => svg.querySelector("[data-joint='grip']") as SVGGElement | null;

    const hold = (el: Element, transform: string) => {
      const anim = el.animate([{ transform }], { duration: 0, fill: "forwards", easing: "linear" });
      anim.id = "mostra";
      anims.push(anim);
    };

    const applyPose = (pose: MostraPose) => {
      const root = joint("root");
      if (root) hold(root, `translate(${pose.x}px, ${pose.y}px)`);
      for (const name of MOSTRA_ANGLE_JOINTS) {
        const el = joint(name);
        if (el) hold(el, mostraJointTransform(name, pose[name]));
      }
    };

    const parkToy = () => {
      const toyEl = toy();
      const home = joint("toy-world");
      const rest = mostraToyRest();
      if (!toyEl || !home) return;
      home.appendChild(toyEl);
      toyEl.setAttribute("transform", `translate(${rest.x} ${rest.y})`);
      toyEl.setAttribute("data-mostra-toy", "world");
    };

    const attachToy = () => {
      const toyEl = toy();
      const gripEl = grip();
      if (!toyEl || !gripEl || toyEl.parentNode === gripEl) return;
      const gripCtm = gripEl.getScreenCTM();
      const toyCtm = toyEl.getScreenCTM();
      if (gripCtm && toyCtm) {
        const local = gripCtm.inverse().multiply(toyCtm);
        toyEl.setAttribute(
          "transform",
          `matrix(${local.a} ${local.b} ${local.c} ${local.d} ${local.e} ${local.f})`,
        );
      }
      gripEl.appendChild(toyEl);
      toyEl.setAttribute("data-mostra-toy", "hand");
    };

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        window.setTimeout(() => resolve(), ms);
      });

    const settle = () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      });

    const fadeOpacity = (from: number, to: number, duration: number) => {
      const anim = svg.animate([{ opacity: from }, { opacity: to }], {
        duration,
        fill: "forwards",
        easing: "ease-in-out",
      });
      anim.id = "mostra";
      anims.push(anim);
      return anim.finished.then(() => undefined);
    };

    const origin = (el: SVGGraphicsElement) => {
      const ctm = el.getScreenCTM();
      if (!ctm) return null;
      return { x: ctm.e, y: ctm.f };
    };

    const playFade = async () => {
      parkToy();
      const beats = mostraFadeBeats();
      for (let index = 0; index < beats.length; index += 1) {
        if (cancelled) return;
        const beat = beats[index];
        if (!beat) return;
        applyPose(beat);
        if (index >= 2) {
          await settle();
          if (cancelled) return;
          attachToy();
        }
        await fadeOpacity(0, 1, MOSTRA_FADE_IN_MS);
        await wait(MOSTRA_FADE_HOLD_MS);
        if (cancelled) return;
        if (index < beats.length - 1) await fadeOpacity(1, 0, MOSTRA_FADE_OUT_MS);
      }
    };

    const playClips = async () => {
      parkToy();
      const clips = mostraClips();
      for (const clip of clips) {
        if (cancelled) return;
        svg.setAttribute("data-mostra-action", clip.action);
        const running: Animation[] = [];
        const root = joint("root");
        if (root) {
          const anim = root.animate(
            clip.poses.map((item, index) => ({
              transform: `translate(${item.x}px, ${item.y}px)`,
              offset: clip.offsets[index],
              easing: "linear",
            })),
            { duration: MOSTRA_ACTION_MS, fill: "forwards", easing: "ease-in-out" },
          );
          anim.id = "mostra";
          running.push(anim);
          anims.push(anim);
        }
        for (const name of MOSTRA_ANGLE_JOINTS) {
          const el = joint(name);
          if (!el) continue;
          const anim = el.animate(
            clip.poses.map((item, index) => ({
              transform: mostraJointTransform(name, item[name]),
              offset: clip.offsets[index],
              easing: "linear",
            })),
            { duration: MOSTRA_ACTION_MS, fill: "forwards", easing: "ease-in-out" },
          );
          anim.id = "mostra";
          running.push(anim);
          anims.push(anim);
        }

        let watching = clip.contact != null;
        const watchContact = () => {
          if (!watching || cancelled) return;
          const clock = running[0];
          const progress =
            clock && clock.currentTime != null ? Number(clock.currentTime) / MOSTRA_ACTION_MS : 0;
          const gripEl = grip();
          const toyEl = toy();
          if (gripEl && toyEl && progress >= 0.5 && toyEl.getAttribute("data-mostra-toy") !== "hand") {
            const handPoint = origin(gripEl);
            const toyPoint = origin(toyEl);
            if (handPoint && toyPoint && Math.hypot(handPoint.x - toyPoint.x, toyPoint.y - handPoint.y) <= 18) {
              watching = false;
              attachToy();
              return;
            }
          }
          raf = requestAnimationFrame(watchContact);
        };
        if (watching) watchContact();

        try {
          await Promise.all(running.map((anim) => anim.finished));
        } catch {
          return;
        }
        watching = false;
        cancelAnimationFrame(raf);
        if (clip.contact != null && toy()?.getAttribute("data-mostra-toy") !== "hand") attachToy();
      }
    };

    void (async () => {
      try {
        if (reduced) await playFade();
        else await playClips();
      } catch {
        return;
      }
      if (!cancelled) finish();
    })();

    return () => {
      cancelled = true;
      window.clearTimeout(backup);
      cancelAnimationFrame(raf);
      for (const anim of anims) anim.cancel();
    };
  }, [replayToken]);

  const first = openingPose();
  const rest = mostraToyRest();
  const bone = MOSTRA_BONE;

  return (
    <div className="overflow-hidden rounded-3xl bg-[#f3e6d0]">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${MOSTRA_VIEW.w} ${MOSTRA_VIEW.h}`}
        className="mostra-stage pointer-events-none"
        data-mostra="1"
        data-mostra-action="mers"
        role="img"
        aria-label="Cezar duce jucăria"
      >
        <defs>
          <filter id="mostra-pencil" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
            <feTurbulence type="turbulence" baseFrequency="0.04" numOctaves="2" seed="5" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="2.8" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="mostra-paper" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="2" result="n" />
            <feColorMatrix in="n" type="saturate" values="0" result="g" />
            <feComponentTransfer in="g" result="grain">
              <feFuncA type="linear" slope="0.2" />
            </feComponentTransfer>
            <feBlend in="SourceGraphic" in2="grain" mode="multiply" />
          </filter>
        </defs>
        <rect width={MOSTRA_VIEW.w} height={MOSTRA_VIEW.h} fill={PAPER} filter="url(#mostra-paper)" />
        <g data-joint="toy-world" filter="url(#mostra-pencil)">
          <g data-mostra-toy="world" transform={`translate(${rest.x} ${rest.y})`}>
            <circle r="26" fill={TOY} stroke={INK} strokeWidth="2.4" />
            <path d="M-14 -1 H14" stroke={TOY_BAND} strokeWidth="4" strokeLinecap="round" />
            <circle cy="8" r="4" fill="#C45E2C" />
          </g>
        </g>
        <g
          data-joint="root"
          filter="url(#mostra-pencil)"
          className="mostra-root"
          style={{ transform: `translate(${first.x}px, ${first.y}px)` }}
        >
          <ellipse cx="8" cy={bone.thigh + bone.shin - 2} rx="48" ry="10" fill="#E5D0AE" opacity="0.8" />
          <Joint name="legFar" angle={first.legFar}>
            <Limb length={bone.thigh} width={20} color={OVERALLS} bend={-8} />
            <Joint name="kneeFar" angle={first.kneeFar}>
              <Limb length={bone.shin} width={16} color={OVERALLS} bend={-5} />
              <Boot far />
            </Joint>
          </Joint>
          <Joint name="legNear" angle={first.legNear}>
            <Limb length={bone.thigh} width={24} color={OVERALLS} bend={8} />
            <Joint name="kneeNear" angle={first.kneeNear}>
              <Limb length={bone.shin} width={18} color={OVERALLS} bend={6} />
              <Boot />
            </Joint>
          </Joint>
          <Joint name="torso" angle={first.torso}>
            <Joint name="armFar" angle={first.armFar}>
              <Limb length={bone.upper} width={16} color={SKIN} bend={-6} />
              <Joint name="foreFar" angle={first.foreFar}>
                <Limb length={bone.fore} width={14} color={SKIN} bend={-4} />
                <Joint name="handFar" angle={first.handFar}>
                  <Hand far />
                </Joint>
              </Joint>
            </Joint>
            <Torso />
            <Joint name="head" angle={first.head}>
              <Head />
            </Joint>
            <Joint name="armNear" angle={first.armNear}>
              <Limb length={bone.upper} width={18} color={SKIN} bend={7} />
              <Joint name="foreNear" angle={first.foreNear}>
                <Limb length={bone.fore} width={16} color={SKIN} bend={5} />
                <Joint name="handNear" angle={first.handNear}>
                  <Hand />
                  <g data-joint="grip" transform={`translate(${bone.grip.x} ${bone.grip.y})`} />
                </Joint>
              </Joint>
            </Joint>
          </Joint>
        </g>
      </svg>
    </div>
  );
});

type MostraAngleName = Parameters<typeof mostraJointTransform>[0];

function Joint({
  name,
  angle,
  children,
}: {
  name: MostraAngleName;
  angle: number;
  children: React.ReactNode;
}) {
  return (
    <svg
      data-joint={name}
      x={0}
      y={0}
      width="300"
      height="300"
      overflow="visible"
      className="mostra-joint"
      style={{ transform: mostraJointTransform(name, angle) }}
    >
      {children}
    </svg>
  );
}

function Limb({
  length,
  width,
  color,
  bend,
}: {
  length: number;
  width: number;
  color: string;
  bend: number;
}) {
  const mid = Math.round(length * 0.42);
  return (
    <path
      d={`M0 2 C ${bend} ${mid} ${Math.round(bend * 0.45)} ${Math.round(length * 0.72)} 0 ${length - 1}`}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
    />
  );
}

function Boot({ far = false }: { far?: boolean }) {
  const y = MOSTRA_BONE.shin - 6;
  return (
    <path
      d={`M-6 ${y - 6} C 8 ${y - 16} 30 ${y - 8} 34 ${y + 1} C 28 ${y + 12} -8 ${y + 10} -12 ${y + 2} Z`}
      fill={BOOT}
      stroke={INK}
      strokeWidth="2"
      strokeLinejoin="round"
      opacity={far ? 0.88 : 1}
    />
  );
}

function Hand({ far = false }: { far?: boolean }) {
  return (
    <g opacity={far ? 0.88 : 1}>
      <ellipse cx="5" cy="16" rx="14" ry="16" fill={SKIN} stroke={INK} strokeWidth="2" />
      <circle cx="17" cy="8" r="5.5" fill={SKIN} stroke={INK} strokeWidth="2" />
    </g>
  );
}

function Head() {
  return (
    <g>
      <ellipse cx="-18" cy="-30" rx="8" ry="11" fill={SKIN} stroke={INK} strokeWidth="2" />
      <ellipse cx="6" cy="-38" rx="34" ry="38" fill={SKIN} stroke={INK} strokeWidth="2.3" />
      <path
        d="M-24 -34 C-30 -68 4 -84 32 -60 C 18 -78 -6 -74 -24 -34"
        fill={HAIR}
        stroke={INK}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M10 -72 C 20 -92 38 -80 28 -58"
        fill={HAIR_LIGHT}
        stroke={INK}
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="22" cy="-42" r="3" fill={INK} />
      <path d="M28 -34 C 36 -32 38 -24 30 -22" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M16 -18 C 22 -11 30 -12 36 -18" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="18" cy="-26" r="5" fill="#F0A888" opacity="0.7" />
    </g>
  );
}

function Torso() {
  return (
    <g>
      <path
        d="M-32 8 C-40 -20 -36 -62 -8 -98 L 24 -92 C 42 -54 38 -14 26 10 C 12 22 -16 20 -32 8 Z"
        fill={BLOUSE}
        stroke={INK}
        strokeWidth="2.3"
        strokeLinejoin="round"
      />
      <path
        d="M-26 6 C-18 -12 18 -12 24 6 L 20 18 C 8 30 -14 30 -22 18 Z"
        fill={OVERALLS}
        stroke={INK}
        strokeWidth="2.1"
        strokeLinejoin="round"
      />
      <path
        d="M-2 0 C-10 -40 4 -74 12 -96"
        fill="none"
        stroke={OVERALLS}
        strokeWidth="9"
        strokeLinecap="round"
      />
      <circle cx="2" cy="8" r="3.2" fill="#F4E2B4" stroke={INK} strokeWidth="1.5" />
    </g>
  );
}
