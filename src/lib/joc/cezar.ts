/**
 * Joc v0.2 step 1 — Cezar's reusable slow poses.
 * The pose follows the day and the scene index. It does not follow an activity.
 * Variant B: mustard overalls, white blouse, booties, light chestnut hair.
 */

export const CEZAR_ANIMATIONS = [
  "mers",
  "sarit",
  "palme",
  "aratat",
  "aplecat",
  "apucat",
  "zoom-maini",
  "zoom-picioare",
  "zoom-cap",
] as const;

export type CezarAnimation = (typeof CEZAR_ANIMATIONS)[number];

/** One pass, long enough to imitate, short enough to finish inside a scene. */
export const CEZAR_ANIMATION_MS = 2_800;

export const CEZAR_ANIMATION_CLASS: Record<CezarAnimation, string> = {
  mers: "joc-cezar-mers",
  sarit: "joc-cezar-sarit",
  palme: "joc-cezar-palme",
  aratat: "joc-cezar-aratat",
  aplecat: "joc-cezar-aplecat",
  apucat: "joc-cezar-apucat",
  "zoom-maini": "joc-cezar-zoom-maini",
  "zoom-picioare": "joc-cezar-zoom-picioare",
  "zoom-cap": "joc-cezar-zoom-cap",
};

function whole(value: number, fallback: number): number {
  if (!Number.isInteger(value) || value < 0) return fallback;
  return value;
}

/** Shared pose for this scene. The activity text is not an input. */
export function cezarAnimationForScene(day: number, sceneIndex: number): CezarAnimation {
  const safeDay = whole(day, 1);
  const safeIndex = whole(sceneIndex, 0);
  const slot = (Math.max(safeDay, 1) - 1 + safeIndex) % CEZAR_ANIMATIONS.length;
  return CEZAR_ANIMATIONS[slot] ?? "mers";
}
