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
export type SceneClock = {
  sceneIndex: number;
  sceneStartedAtMs: number;
  lastInteractionAtMs: number;
  tappedAtMs: number | null;
  sessionStartedAtMs: number;
};

export function clockFrom(clock: SceneClock, nowMs: number, sceneCount: number): PlayTick {
  const tapped = clock.tappedAtMs != null;
  return {
    sceneElapsedMs: nowMs - clock.sceneStartedAtMs,
    msSinceInteraction: nowMs - clock.lastInteractionAtMs,
    msSinceTap: tapped ? nowMs - (clock.tappedAtMs as number) : 0,
    sessionElapsedMs: nowMs - clock.sessionStartedAtMs,
    tapped,
    sceneIndex: clock.sceneIndex,
    sceneCount,
  };
}

/** A new scene starts its own 10s quiet window. The previous tap does not skip it. */
export function showNextScene(clock: SceneClock, nowMs: number): SceneClock {
  return {
    ...clock,
    sceneIndex: clock.sceneIndex + 1,
    sceneStartedAtMs: nowMs,
    lastInteractionAtMs: nowMs,
    tappedAtMs: null,
  };
}

export function clockTap(clock: SceneClock, nowMs: number): SceneClock {
  if (clock.tappedAtMs != null) {
    return { ...clock, lastInteractionAtMs: nowMs };
  }
  return { ...clock, lastInteractionAtMs: nowMs, tappedAtMs: nowMs };
}

export function clockNudge(clock: SceneClock, nowMs: number): SceneClock {
  return { ...clock, lastInteractionAtMs: nowMs };
}

export function clockTick(
  clock: SceneClock,
  nowMs: number,
  sceneCount: number,
): { clock: SceneClock; decision: PlayDecision } {
  const decision = decidePlay(clockFrom(clock, nowMs, sceneCount));
  if (decision.type !== "next-scene") return { clock, decision };
  return { decision, clock: showNextScene(clock, nowMs) };
}

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
