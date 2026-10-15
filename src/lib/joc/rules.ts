/** Ritmul și limitele de siguranță pentru jocul de pe tabletă (v0). */

export const JOC_MIN_SCENE_MS = 5_000;
export const JOC_IDLE_MS = 10_000;
export const JOC_SESSION_MAX_MS = 15 * 60 * 1000;
export const JOC_MAX_SESSIONS_PER_DAY = 2;
export const JOC_FADE_MS = 1_400;

/** Mod privit: four scenes, then a still imitation pause. Two starts stay under 10 minutes. */
export const JOC_WATCH_PAUSE_MS = 8_000;
export const JOC_WATCH_SCENE_COUNT = 4;
export const JOC_WATCH_MAX_PER_DAY = 2;
export const JOC_WATCH_DAY_MAX_MS = 10 * 60 * 1000;

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

/**
 * Screen time is the elapsed time since the session was opened.
 * A missing or zero start is 0 — never the 15-minute cap.
 */
export function screenDurationMs(startedAtMs: number | null, nowMs: number): number {
  if (startedAtMs == null || !Number.isFinite(startedAtMs) || !Number.isFinite(nowMs)) return 0;
  if (startedAtMs <= 0 || nowMs <= startedAtMs) return 0;
  return clampScreenDuration(nowMs - startedAtMs);
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

export function watchSceneCount(available: number): number {
  if (!Number.isFinite(available) || available <= 0) return 0;
  return Math.min(JOC_WATCH_SCENE_COUNT, Math.floor(available));
}

/** Screen time of one full watch, including the slow fade after every scene and pause. */
export function watchPlanMs(availableScenes: number): number {
  const scenes = watchSceneCount(availableScenes);
  if (scenes === 0) return 0;
  return scenes * (JOC_MIN_SCENE_MS + JOC_WATCH_PAUSE_MS + JOC_FADE_MS * 2);
}

export function canStartWatch(startsToday: number, watchMsToday: number): boolean {
  if (!Number.isFinite(startsToday) || startsToday >= JOC_WATCH_MAX_PER_DAY) return false;
  if (!Number.isFinite(watchMsToday) || watchMsToday >= JOC_WATCH_DAY_MAX_MS) return false;
  return true;
}

export function watchStatusLabel(startsToday: number, watchMsToday: number): string {
  if (startsToday >= JOC_WATCH_MAX_PER_DAY) return "Azi am privit de două ori. Revenim mâine.";
  if (watchMsToday >= JOC_WATCH_DAY_MAX_MS) return "Azi privitul a ajuns la zece minute. Revenim mâine.";
  if (startsToday <= 0) return "Putem privi de două ori: dimineața și seara.";
  return "Azi am privit o dată. Mai putem o dată.";
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

/** The next scene starts its own hold. The session start does not move. */
export function showNextScene(clock: SceneClock, nowMs: number): SceneClock {
  return {
    ...clock,
    sceneIndex: clock.sceneIndex + 1,
    sceneStartedAtMs: nowMs,
    lastInteractionAtMs: nowMs,
    tappedAtMs: null,
  };
}

export function createPlayClock(startedAtMs: number): SceneClock {
  return {
    sceneIndex: 0,
    sceneStartedAtMs: startedAtMs,
    lastInteractionAtMs: startedAtMs,
    tappedAtMs: null,
    sessionStartedAtMs: startedAtMs,
  };
}

/** A restarted effect keeps the original session and the original idle baseline. */
export function resumePlayClock(clock: SceneClock | null, startedAtMs: number): SceneClock {
  if (clock) return clock;
  return createPlayClock(startedAtMs);
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

/**
 * The 15-minute cap wins over everything.
 * Each scene then moves on by itself after JOC_MIN_SCENE_MS, with or without a tap.
 * Ten seconds without a touch leaves only when that scene is not ready to move yet.
 */
export function decidePlay(tick: PlayTick): PlayDecision {
  if (tick.sessionElapsedMs >= JOC_SESSION_MAX_MS) {
    return { type: "mission", reason: "cap" };
  }
  if (tick.sceneElapsedMs >= JOC_MIN_SCENE_MS) {
    if (tick.sceneIndex + 1 >= tick.sceneCount) {
      return { type: "mission", reason: "finished" };
    }
    return { type: "next-scene" };
  }
  if (tick.msSinceInteraction >= JOC_IDLE_MS) {
    return { type: "mission", reason: "idle" };
  }
  return { type: "stay" };
}

export type PlayLoop = {
  stop: () => void;
};

/**
 * Shared play clock. The 15-minute cap uses `startedAtMs` and still fires
 * while a fade is holding the next scene.
 */
export function startPlayLoop(options: {
  startedAtMs: number;
  sceneCount: number;
  getClock: () => SceneClock;
  setClock: (clock: SceneClock) => void;
  now?: () => number;
  isSuspended?: () => boolean;
  onScene: (sceneIndex: number, commit: () => void) => void;
  onMission: (reason: Exclude<MissionReason, "parent">) => void;
  intervalMs?: number;
}): PlayLoop {
  let waiting = false;
  let stopped = false;
  const now = options.now ?? (() => Date.now());
  const finish = (reason: Exclude<MissionReason, "parent">) => {
    if (stopped) return;
    stopped = true;
    clearInterval(timer);
    options.onMission(reason);
  };
  const timer = setInterval(() => {
    if (stopped || options.startedAtMs <= 0) return;
    const tickNow = now();
    if (tickNow - options.startedAtMs >= JOC_SESSION_MAX_MS) {
      finish("cap");
      return;
    }
    if (waiting || options.isSuspended?.()) return;
    const decision = decidePlay(clockFrom(options.getClock(), tickNow, options.sceneCount));
    if (decision.type === "mission") {
      finish(decision.reason);
      return;
    }
    if (decision.type !== "next-scene") return;
    waiting = true;
    options.onScene(options.getClock().sceneIndex + 1, () => {
      options.setClock(showNextScene(options.getClock(), now()));
      waiting = false;
    });
  }, options.intervalMs ?? 250);
  return {
    stop() {
      stopped = true;
      clearInterval(timer);
    },
  };
}

export type WatchPhase = "scene" | "pause";

export type WatchClock = {
  sceneIndex: number;
  phase: WatchPhase;
  phaseStartedAtMs: number;
  sessionStartedAtMs: number;
};

export type WatchTick = {
  phase: WatchPhase;
  phaseElapsedMs: number;
  sessionElapsedMs: number;
  sceneIndex: number;
  sceneCount: number;
  dayWatchMs: number;
};

export type WatchDecision =
  | { type: "stay" }
  | { type: "pause" }
  | { type: "next-scene" }
  | { type: "mission"; reason: "cap" | "finished" };

export function createWatchClock(startedAtMs: number): WatchClock {
  return {
    sceneIndex: 0,
    phase: "scene",
    phaseStartedAtMs: startedAtMs,
    sessionStartedAtMs: startedAtMs,
  };
}

export function resumeWatchClock(clock: WatchClock | null, startedAtMs: number): WatchClock {
  if (clock) return clock;
  return createWatchClock(startedAtMs);
}

export function showWatchPause(clock: WatchClock, nowMs: number): WatchClock {
  return { ...clock, phase: "pause", phaseStartedAtMs: nowMs };
}

export function showWatchScene(clock: WatchClock, nowMs: number): WatchClock {
  return {
    ...clock,
    sceneIndex: clock.sceneIndex + 1,
    phase: "scene",
    phaseStartedAtMs: nowMs,
  };
}

export function watchTickFrom(
  clock: WatchClock,
  nowMs: number,
  sceneCount: number,
  dayWatchMs: number,
): WatchTick {
  return {
    phase: clock.phase,
    phaseElapsedMs: nowMs - clock.phaseStartedAtMs,
    sessionElapsedMs: nowMs - clock.sessionStartedAtMs,
    sceneIndex: clock.sceneIndex,
    sceneCount,
    dayWatchMs,
  };
}

/**
 * Scenes and imitation pauses advance on their own.
 * Ten seconds without a touch does not apply. The 15-minute cap still does,
 * and the day's watch time stops at ten minutes.
 */
export function decideWatch(tick: WatchTick): WatchDecision {
  if (tick.sessionElapsedMs >= JOC_SESSION_MAX_MS) {
    return { type: "mission", reason: "cap" };
  }
  const prior = Number.isFinite(tick.dayWatchMs) && tick.dayWatchMs > 0 ? tick.dayWatchMs : 0;
  if (prior + tick.sessionElapsedMs >= JOC_WATCH_DAY_MAX_MS) {
    return { type: "mission", reason: "cap" };
  }
  if (tick.phase === "scene") {
    if (tick.phaseElapsedMs >= JOC_MIN_SCENE_MS) return { type: "pause" };
    return { type: "stay" };
  }
  if (tick.phaseElapsedMs >= JOC_WATCH_PAUSE_MS) {
    if (tick.sceneIndex + 1 >= tick.sceneCount) return { type: "mission", reason: "finished" };
    return { type: "next-scene" };
  }
  return { type: "stay" };
}

export function startWatchLoop(options: {
  startedAtMs: number;
  sceneCount: number;
  dayWatchMs: number;
  getClock: () => WatchClock;
  setClock: (clock: WatchClock) => void;
  now?: () => number;
  isSuspended?: () => boolean;
  onPause: (commit: () => void) => void;
  onScene: (sceneIndex: number, commit: () => void) => void;
  onMission: (reason: "cap" | "finished") => void;
  intervalMs?: number;
}): PlayLoop {
  let waiting = false;
  let stopped = false;
  const now = options.now ?? (() => Date.now());
  const finish = (reason: "cap" | "finished") => {
    if (stopped) return;
    stopped = true;
    clearInterval(timer);
    options.onMission(reason);
  };
  const timer = setInterval(() => {
    if (stopped || options.startedAtMs <= 0) return;
    const tickNow = now();
    const sessionElapsedMs = tickNow - options.startedAtMs;
    if (sessionElapsedMs >= JOC_SESSION_MAX_MS) {
      finish("cap");
      return;
    }
    const prior = Number.isFinite(options.dayWatchMs) && options.dayWatchMs > 0 ? options.dayWatchMs : 0;
    if (prior + sessionElapsedMs >= JOC_WATCH_DAY_MAX_MS) {
      finish("cap");
      return;
    }
    if (waiting || options.isSuspended?.()) return;
    const clock = options.getClock();
    const decision = decideWatch(
      watchTickFrom(clock, tickNow, options.sceneCount, options.dayWatchMs),
    );
    if (decision.type === "mission") {
      finish(decision.reason);
      return;
    }
    if (decision.type === "stay") return;
    waiting = true;
    if (decision.type === "pause") {
      options.onPause(() => {
        options.setClock(showWatchPause(options.getClock(), now()));
        waiting = false;
      });
      return;
    }
    options.onScene(clock.sceneIndex + 1, () => {
      options.setClock(showWatchScene(options.getClock(), now()));
      waiting = false;
    });
  }, options.intervalMs ?? 250);
  return {
    stop() {
      stopped = true;
      clearInterval(timer);
    },
  };
}
