/**
 * Sample scene: Cezar walks to one toy, bends, grabs it, and shows it.
 * Each action is 3.5s and plays twice. Joint angles are degrees, clockwise.
 * The articulated SVG rotates nested viewports around their own origin.
 */

import { civilDayOfWeek, programWeekNumber } from "@/lib/program-week";

export const MOSTRA_SCENE_ID = "s7-2-3-z4-fizic";
export const MOSTRA_ACTION_MS = 3_500;
export const MOSTRA_GRAB_CONTACT = 0.72;
export const MOSTRA_FADE_IN_MS = 900;
export const MOSTRA_FADE_HOLD_MS = 1_000;
export const MOSTRA_FADE_OUT_MS = 800;

export const MOSTRA_VIEW = { w: 960, h: 540 } as const;

/** Pivot offsets in the parent joint's local space. y grows downward. */
export const MOSTRA_BONE = {
  neck: { x: 12, y: -102 },
  shoulderNear: { x: 22, y: -84 },
  shoulderFar: { x: -10, y: -80 },
  upper: 64,
  fore: 56,
  grip: { x: 6, y: 22 },
  thigh: 78,
  shin: 68,
} as const;

export const MOSTRA_ACTIONS = ["mers", "aplecat", "apucat", "aratat"] as const;
export type MostraAction = (typeof MOSTRA_ACTIONS)[number];

export type MostraPose = {
  x: number;
  y: number;
  torso: number;
  head: number;
  armNear: number;
  foreNear: number;
  handNear: number;
  armFar: number;
  foreFar: number;
  handFar: number;
  legNear: number;
  kneeNear: number;
  legFar: number;
  kneeFar: number;
};

export const MOSTRA_ANGLE_JOINTS = [
  "torso",
  "head",
  "armNear",
  "foreNear",
  "handNear",
  "armFar",
  "foreFar",
  "handFar",
  "legNear",
  "kneeNear",
  "legFar",
  "kneeFar",
] as const;

export type MostraAngleJoint = (typeof MOSTRA_ANGLE_JOINTS)[number];

/** Where this joint sits in its parent, before it rotates. */
export function mostraJointPivot(joint: MostraAngleJoint): { x: number; y: number } {
  const bone = MOSTRA_BONE;
  switch (joint) {
    case "head":
      return bone.neck;
    case "armNear":
      return bone.shoulderNear;
    case "armFar":
      return bone.shoulderFar;
    case "foreNear":
    case "foreFar":
      return { x: 0, y: bone.upper };
    case "handNear":
    case "handFar":
      return { x: 0, y: bone.fore };
    case "kneeNear":
    case "kneeFar":
      return { x: 0, y: bone.thigh };
    default:
      return { x: 0, y: 0 };
  }
}

/**
 * Place the joint, then spin it around that point.
 * Nested SVG viewports otherwise rotate around the parent viewport.
 */
export function mostraJointTransform(joint: MostraAngleJoint, angle: number): string {
  const pivot = mostraJointPivot(joint);
  return `translate(${pivot.x}px, ${pivot.y}px) rotate(${angle}deg)`;
}

const POSE_KEYS: (keyof MostraPose)[] = ["x", "y", ...MOSTRA_ANGLE_JOINTS];

export type MostraClip = {
  action: MostraAction;
  poses: MostraPose[];
  offsets: number[];
  contact: number | null;
};

type Angles = Omit<MostraPose, "x" | "y">;

const START_X = 132;
const MID_X = 318;
const END_X = 504;

const STAND: Angles = {
  torso: -3,
  head: 4,
  armNear: -8,
  foreNear: -10,
  handNear: 6,
  armFar: 10,
  foreFar: 8,
  handFar: -2,
  legNear: -4,
  kneeNear: 8,
  legFar: 4,
  kneeFar: 8,
};

const DEEP: Angles = {
  torso: 64,
  head: -32,
  armNear: -46,
  foreNear: -8,
  handNear: 6,
  armFar: -28,
  foreFar: 4,
  handFar: 0,
  legNear: -8,
  kneeNear: 18,
  legFar: 6,
  kneeFar: 14,
};

const CONTACT: Angles = {
  torso: 82,
  head: -44,
  armNear: -86,
  foreNear: -18,
  handNear: -14,
  armFar: -62,
  foreFar: -12,
  handFar: 0,
  legNear: -16,
  kneeNear: 32,
  legFar: 10,
  kneeFar: 22,
};

const CLOSED: Angles = {
  torso: 78,
  head: -40,
  armNear: -80,
  foreNear: -12,
  handNear: 18,
  armFar: -58,
  foreFar: -8,
  handFar: 2,
  legNear: -14,
  kneeNear: 28,
  legFar: 8,
  kneeFar: 18,
};

const SHOW: Angles = {
  torso: -4,
  head: 8,
  armNear: -152,
  foreNear: -20,
  handNear: 12,
  armFar: -18,
  foreFar: -8,
  handFar: 0,
  legNear: -4,
  kneeNear: 8,
  legFar: 4,
  kneeFar: 8,
};

const WALK_STEPS: readonly { angles: Angles; y: number }[] = [
  { angles: STAND, y: 332 },
  {
    angles: {
      torso: 5,
      head: -2,
      armNear: 26,
      foreNear: 20,
      handNear: 4,
      armFar: -28,
      foreFar: 18,
      handFar: 0,
      legNear: -32,
      kneeNear: 40,
      legFar: 18,
      kneeFar: 12,
    },
    y: 322,
  },
  {
    angles: {
      torso: 7,
      head: -4,
      armNear: 34,
      foreNear: 22,
      handNear: 2,
      armFar: -36,
      foreFar: 22,
      handFar: -2,
      legNear: -42,
      kneeNear: 14,
      legFar: 26,
      kneeFar: 16,
    },
    y: 318,
  },
  {
    angles: {
      torso: 8,
      head: 1,
      armNear: 14,
      foreNear: 16,
      handNear: 4,
      armFar: -12,
      foreFar: 14,
      handFar: 0,
      legNear: -16,
      kneeNear: 26,
      legFar: 8,
      kneeFar: 34,
    },
    y: 346,
  },
  {
    angles: {
      torso: 2,
      head: 3,
      armNear: -2,
      foreNear: 8,
      handNear: 4,
      armFar: 2,
      foreFar: 8,
      handFar: 0,
      legNear: 6,
      kneeNear: 16,
      legFar: -8,
      kneeFar: 18,
    },
    y: 334,
  },
  {
    angles: {
      torso: 5,
      head: -2,
      armNear: -28,
      foreNear: 18,
      handNear: 0,
      armFar: 26,
      foreFar: 20,
      handFar: 4,
      legNear: 18,
      kneeNear: 12,
      legFar: -32,
      kneeFar: 40,
    },
    y: 322,
  },
  {
    angles: {
      torso: 7,
      head: -4,
      armNear: -36,
      foreNear: 22,
      handNear: -2,
      armFar: 34,
      foreFar: 22,
      handFar: 2,
      legNear: 26,
      kneeNear: 16,
      legFar: -42,
      kneeFar: 14,
    },
    y: 318,
  },
  {
    angles: {
      torso: 8,
      head: 1,
      armNear: -12,
      foreNear: 14,
      handNear: 0,
      armFar: 14,
      foreFar: 16,
      handFar: 4,
      legNear: 8,
      kneeNear: 34,
      legFar: -16,
      kneeFar: 26,
    },
    y: 346,
  },
  {
    angles: {
      torso: 0,
      head: 4,
      armNear: -14,
      foreNear: -4,
      handNear: 4,
      armFar: 8,
      foreFar: 6,
      handFar: 0,
      legNear: -12,
      kneeNear: 12,
      legFar: 2,
      kneeFar: 10,
    },
    y: 330,
  },
  { angles: STAND, y: 332 },
];

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function pose(angles: Angles, x: number, y: number): MostraPose {
  return { ...angles, x: round(x), y: round(y) };
}

function mix(a: MostraPose, b: MostraPose, t: number): MostraPose {
  const out = {} as MostraPose;
  for (const key of POSE_KEYS) {
    out[key] = round(a[key] + (b[key] - a[key]) * t);
  }
  return out;
}

function smooth(t: number): number {
  const clamped = Math.min(1, Math.max(0, t));
  return clamped * clamped * (3 - 2 * clamped);
}

function evenOffsets(count: number): number[] {
  return Array.from({ length: count }, (_, index) => round(index / (count - 1)));
}

function sample(from: MostraPose, to: MostraPose, count: number): MostraPose[] {
  return Array.from({ length: count }, (_, index) => mix(from, to, smooth(index / (count - 1))));
}

function echo(from: MostraPose, toward: MostraPose, amount: number, count: number): MostraPose[] {
  return Array.from({ length: count }, (_, index) => {
    const t = index / (count - 1);
    const lift = Math.sin(t * Math.PI) * amount;
    return mix(from, toward, lift);
  });
}

function walkClip(fromX: number, toX: number): MostraPose[] {
  return WALK_STEPS.map((step, index) => {
    const t = index / (WALK_STEPS.length - 1);
    return pose(step.angles, fromX + (toX - fromX) * t, step.y);
  });
}

const GRAB_OFFSETS = [0, 0.08, 0.16, 0.28, 0.4, 0.52, 0.64, MOSTRA_GRAB_CONTACT, 0.86, 1];

function grabPoses(): MostraPose[] {
  const deep = pose(DEEP, END_X, 346);
  const contact = pose(CONTACT, END_X, 356);
  const closed = pose(CLOSED, END_X, 350);
  return GRAB_OFFSETS.map((offset) => {
    if (offset <= MOSTRA_GRAB_CONTACT) {
      return mix(deep, contact, smooth(offset / MOSTRA_GRAB_CONTACT));
    }
    const t = (offset - MOSTRA_GRAB_CONTACT) / (1 - MOSTRA_GRAB_CONTACT);
    return mix(contact, closed, smooth(t));
  });
}

/** Eight clips: walk, walk, bend, bend, grab, grab, show, show. */
export function mostraClips(): MostraClip[] {
  const standEnd = pose(STAND, END_X, 332);
  const deep = pose(DEEP, END_X, 346);
  const closed = pose(CLOSED, END_X, 350);
  const show = pose(SHOW, END_X, 332);
  const open = pose(CONTACT, END_X, 356);
  const frames = 10;

  const bend = sample(standEnd, deep, frames);
  bend[0] = standEnd;
  bend[frames - 1] = deep;

  const grabs = grabPoses();
  grabs[0] = deep;
  grabs[GRAB_OFFSETS.length - 1] = closed;

  const shown = sample(closed, show, frames);
  shown[0] = closed;
  shown[frames - 1] = show;

  return [
    { action: "mers", poses: walkClip(START_X, MID_X), offsets: evenOffsets(frames), contact: null },
    { action: "mers", poses: walkClip(MID_X, END_X), offsets: evenOffsets(frames), contact: null },
    { action: "aplecat", poses: bend, offsets: evenOffsets(frames), contact: null },
    { action: "aplecat", poses: echo(deep, standEnd, 0.42, frames), offsets: evenOffsets(frames), contact: null },
    { action: "apucat", poses: grabs, offsets: [...GRAB_OFFSETS], contact: MOSTRA_GRAB_CONTACT },
    { action: "apucat", poses: echo(closed, open, 0.85, frames), offsets: evenOffsets(frames), contact: null },
    { action: "aratat", poses: shown, offsets: evenOffsets(frames), contact: null },
    { action: "aratat", poses: echo(show, closed, 0.38, frames), offsets: evenOffsets(frames), contact: null },
  ];
}

export function mostraSequenceMs(): number {
  return mostraClips().length * MOSTRA_ACTION_MS;
}

function rotate(x: number, y: number, degrees: number): [number, number] {
  const rad = (degrees * Math.PI) / 180;
  const c = Math.cos(rad);
  const s = Math.sin(rad);
  return [x * c - y * s, x * s + y * c];
}

/** Palm position in viewBox units. Matches the nested joint pivots. */
export function gripWorld(pose: MostraPose): { x: number; y: number } {
  const bone = MOSTRA_BONE;
  const [sx, sy] = rotate(bone.shoulderNear.x, bone.shoulderNear.y, pose.torso);
  let [ux, uy] = rotate(0, bone.upper, pose.armNear);
  [ux, uy] = rotate(ux, uy, pose.torso);
  let [fx, fy] = rotate(0, bone.fore, pose.foreNear);
  [fx, fy] = rotate(fx, fy, pose.armNear);
  [fx, fy] = rotate(fx, fy, pose.torso);
  let [gx, gy] = rotate(bone.grip.x, bone.grip.y, pose.handNear);
  [gx, gy] = rotate(gx, gy, pose.foreNear);
  [gx, gy] = rotate(gx, gy, pose.armNear);
  [gx, gy] = rotate(gx, gy, pose.torso);
  return { x: round(pose.x + sx + ux + fx + gx), y: round(pose.y + sy + uy + fy + gy) };
}

export function mostraContactPose(): MostraPose {
  const clip = mostraClips().find((item) => item.contact != null);
  if (!clip || clip.contact == null) {
    throw new Error("Mostra grab is missing its contact pose");
  }
  const index = clip.offsets.findIndex((offset) => offset === clip.contact);
  const poseAt = clip.poses[index];
  if (!poseAt) throw new Error("Mostra contact pose is missing");
  return poseAt;
}

/** Where the toy rests before the hand closes on it. */
export function mostraToyRest(): { x: number; y: number } {
  return gripWorld(mostraContactPose());
}

/** End pose of the second play of each action. The fade fallback shows only these. */
export function mostraFadeBeats(): MostraPose[] {
  const clips = mostraClips();
  return [1, 3, 5, 7].map((index) => {
    const beat = clips[index]?.poses.at(-1);
    if (!beat) throw new Error("Mostra fade beat is missing");
    return beat;
  });
}

/** Thursday of program week 7 is the day this sample belongs to. */
export function mostraDay(): { week: number; day: number } {
  const date = "2026-10-15";
  return { week: programWeekNumber(date), day: civilDayOfWeek(date) };
}
