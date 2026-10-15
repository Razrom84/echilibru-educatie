/** Ritmul și limitele de siguranță pentru jocul de pe tabletă (v0). */

export const JOC_MIN_SCENE_MS = 5_000;
export const JOC_IDLE_MS = 10_000;
export const JOC_SESSION_MAX_MS = 15 * 60 * 1000;
export const JOC_MAX_SESSIONS_PER_DAY = 2;
export const JOC_FADE_MS = 1_400;

export type MissionReason = "idle" | "cap" | "finished" | "parent";

export type PlayTick = {
  sceneElapsedMs: number;
  msSinceInteraction: number;
  msSinceTap: number;
  sessionElapsedMs: number;
  tapped: boolean;
  sceneIndex: number;
  sceneCount: number;
};

export type PlayDecision =
  | { type: "stay" }
  | { type: "next-scene" }
  | { type: "mission"; reason: Exclude<MissionReason, "parent"> };

export function canStartSession(sessionsStartedToday: number): boolean {
  return sessionsStartedToday < JOC_MAX_SESSIONS_PER_DAY;
}

export function clampScreenDuration(ms: number): number {
  if (!Number.isFinite(ms) || ms <= 0) return 0;
  return Math.min(Math.round(ms), JOC_SESSION_MAX_MS);
}

export function formatScreenDuration(ms: number): string {
  const totalSeconds = Math.round(clampScreenDuration(ms) / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes <= 0) return `${seconds} s`;
  if (seconds === 0) return `${minutes} min`;
  return `${minutes} min ${seconds} s`;
}

export function sessionStatusLabel(sessionsStartedToday: number): string {
  if (sessionsStartedToday <= 0) return "Azi încă nu am jucat. Putem de două ori.";
  if (sessionsStartedToday === 1) return "Azi am jucat o dată. Mai putem o dată.";
  return "Azi am jucat de două ori. Jocul revine mâine.";
}

/**
 * Scena rămâne cel puțin JOC_MIN_SCENE_MS și, după atingere, încă atât,
 * ca mișcarea să nu fie tăiată. Fără atingere 10 s, sau la 15 min, urmează misiunea.
 */
export function decidePlay(tick: PlayTick): PlayDecision {
  if (tick.sessionElapsedMs >= JOC_SESSION_MAX_MS) {
    return { type: "mission", reason: "cap" };
  }
  if (tick.msSinceInteraction >= JOC_IDLE_MS) {
    return { type: "mission", reason: "idle" };
  }
  const sceneReady =
    tick.tapped &&
    tick.sceneElapsedMs >= JOC_MIN_SCENE_MS &&
    tick.msSinceTap >= JOC_MIN_SCENE_MS;
  if (!sceneReady) return { type: "stay" };
  if (tick.sceneIndex + 1 >= tick.sceneCount) {
    return { type: "mission", reason: "finished" };
  }
  return { type: "next-scene" };
}
