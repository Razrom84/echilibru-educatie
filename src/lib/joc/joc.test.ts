import { describe, expect, test, vi } from "vitest";
import { JOC_COPY, openMissionLabel } from "./copy";
import {
  JOC_NOTE_MAX,
  activityIdsMarkedDone,
  createJournalEntry,
  formatJournalText,
  parseJournal,
  sessionsOnDate,
  updateJournalEntry,
  watchScreenMs,
  watchSessionsOnDate,
} from "./journal";
import {
  buildDayLevels,
  isPlayableJocDay,
  jocWeekLevels,
  missionAction,
  scenesForDay,
  type JocActivitySource,
} from "./day-levels";
import { JOC_LEGACY_LEVELS, isJocLevelId } from "./levels";
import { getSeedActivities } from "@/lib/seed/week1";
import {
  JOC_FADE_MS,
  JOC_IDLE_MS,
  JOC_MAX_SESSIONS_PER_DAY,
  JOC_MIN_SCENE_MS,
  JOC_SESSION_MAX_MS,
  JOC_WATCH_DAY_MAX_MS,
  JOC_WATCH_MAX_PER_DAY,
  JOC_WATCH_PAUSE_MS,
  JOC_WATCH_SCENE_COUNT,
  canStartSession,
  canStartWatch,
  clockNudge,
  clockTap,
  clockTick,
  createPlayClock,
  createWatchClock,
  decidePlay,
  decideWatch,
  formatScreenDuration,
  resumePlayClock,
  screenDurationMs,
  sessionStatusLabel,
  startPlayLoop,
  startWatchLoop,
  watchPlanMs,
  watchSceneCount,
  watchStatusLabel,
  type PlayTick,
  type SceneClock,
  type WatchClock,
  type WatchPhase,
} from "./rules";

const ENGLISH_UI =
  /\b(score|scores|game|click|tap|bravo|notification|hello|demo|audio|video|loading)\b/i;

function userStrings(): string[] {
  const strings: string[] = Object.values(JOC_COPY);
  strings.push(openMissionLabel("Luni"));
  strings.push(sessionStatusLabel(0), sessionStatusLabel(1), sessionStatusLabel(2));
  strings.push(
    watchStatusLabel(0, 0),
    watchStatusLabel(1, 0),
    watchStatusLabel(2, 0),
    watchStatusLabel(1, JOC_WATCH_DAY_MAX_MS),
  );
  const week = jocWeekLevels(1);
  if (week) {
    strings.push(week.characterName, week.theme);
    for (const level of week.levels) {
      strings.push(level.name, level.characterName);
    }
  }
  return strings;
}

function activity(partial: Partial<JocActivitySource> & Pick<JocActivitySource, "id" | "zi" | "titlu">): JocActivitySource {
  return {
    pasi: ["Un pas, încet."],
    gata_cand: "A făcut pasul.",
    ...partial,
  };
}

function tick(overrides: Partial<PlayTick> = {}): PlayTick {
  return {
    sceneElapsedMs: 0,
    msSinceInteraction: 0,
    msSinceTap: 0,
    sessionElapsedMs: 0,
    tapped: false,
    sceneIndex: 0,
    sceneCount: 4,
    ...overrides,
  };
}

describe("joc week levels", () => {
  test("shows only the viewed week's character, one level per day from band 1–2", () => {
    const week1 = jocWeekLevels(1);
    const week32 = jocWeekLevels(32);
    expect(week1).not.toBeNull();
    expect(week32).not.toBeNull();
    if (!week1 || !week32) return;

    expect(week1.characterName).toBe("Căsuță");
    expect(week1.characterSrc).toBe("/characters/casuta.svg");
    expect(week32.characterName).toBe("Balonaș");
    expect(week32.characterSrc).toBe("/characters/balonas.svg");
    expect(week1.characterName).not.toBe(week32.characterName);

    const seedDay1 = getSeedActivities(1, "1-2").filter((row) => row.zi === 1);
    const luni = week1.levels.find((level) => level.day === 1);
    expect(luni?.id).toBe("s1-z1");
    expect(luni?.scenes.map((scene) => scene.prompt)).toEqual(
      seedDay1.map((row) => row.pasi[0]),
    );
    expect(luni?.activityIds).toEqual(seedDay1.map((row) => row.id));
    expect(luni?.missionParent).toBe(missionAction(seedDay1));
    expect(luni?.missionParent).not.toContain(seedDay1[1]?.gata_cand);
    expect(luni?.ritual).toBe("Pe curte, gata.");

    for (const level of week1.levels) {
      expect(level.characterName).toBe(week1.characterName);
      expect(level.characterSrc).toBe(week1.characterSrc);
      expect(level.scenes.length).toBeGreaterThanOrEqual(3);
      expect(level.scenes.length).toBeLessThanOrEqual(5);
      for (const scene of level.scenes) {
        expect(scene.object).toBeTruthy();
      }
    }
    expect(week1.levels.map((level) => level.day)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(JOC_LEGACY_LEVELS).toHaveLength(5);
  });

  test("builds 3–5 scenes from a day and does not invent a second character", () => {
    const four = [1, 2, 3, 4].map((n) =>
      activity({ id: `a-${n}`, zi: 1, titlu: `Activitatea ${n}`, pilon: "fizic" }),
    );
    expect(scenesForDay(four)).toHaveLength(4);

    const six = [1, 2, 3, 4, 5, 6].map((n) =>
      activity({ id: `b-${n}`, zi: 2, titlu: `Pas ${n}` }),
    );
    expect(scenesForDay(six)).toHaveLength(5);

    const short = scenesForDay([
      activity({ id: "scurt", zi: 3, titlu: "Piatra", pasi: ["Ține piatra."] }),
    ]);
    expect(short.length).toBeGreaterThanOrEqual(3);
    expect(short.length).toBeLessThanOrEqual(5);
    expect(new Set(short.map((scene) => scene.object)).size).toBe(1);

    const levels = buildDayLevels({
      week: 8,
      character: { name: "Frunzuliță", src: "/characters/frunzulita.svg" },
      ritualClose: "Pe pământ, gata.",
      activities: [
        activity({ id: "frunza", zi: 4, titlu: "Frunza", pasi: ["Atinge frunza."], gata_cand: "A luat frunza." }),
        activity({ id: "alt", zi: 4, titlu: "Încă o frunză", pasi: ["Pune frunza în cutie."] }),
        activity({ id: "trei", zi: 4, titlu: "Frunza în cutie", pasi: ["Pune frunza la loc."] }),
      ],
    });
    expect(levels).toHaveLength(1);
    expect(levels[0]?.characterName).toBe("Frunzuliță");
    expect(levels[0]?.scenes.every((scene) => scene.object === "leaf")).toBe(true);
    expect(levels[0]?.ritual).toBe("Pe pământ, gata.");
    expect(isJocLevelId("s8-z4")).toBe(true);
    expect(isJocLevelId("s53-z1")).toBe(false);
    expect(isJocLevelId("balonas")).toBe(true);
  });

  test("week 7 Monday is several different actions, and only today opens", () => {
    const week = jocWeekLevels(7);
    const monday = getSeedActivities(7, "1-2").filter((row) => row.zi === 1);
    const level = week?.levels.find((row) => row.day === 1);
    expect(level?.scenes).toHaveLength(4);
    expect(level?.scenes.map((scene) => scene.prompt)).toEqual(monday.map((row) => row.pasi[0]));
    expect(new Set(level?.scenes.map((scene) => scene.object))).toEqual(new Set(["door", "shoe"]));
    expect(level?.missionParent).toBe(`${monday[0]?.pasi[0]} ${monday[0]?.pasi[1]}`);
    expect((level?.missionParent.length ?? 0) <= 160).toBe(true);
    expect(isPlayableJocDay(4, 4)).toBe(true);
    expect(isPlayableJocDay(5, 4)).toBe(false);
    expect(isPlayableJocDay(3, 4)).toBe(false);

    const thursday = getSeedActivities(7, "1-2").filter((row) => row.zi === 4);
    const joi = week?.levels.find((row) => row.day === 4);
    expect(joi?.scenes).toHaveLength(4);
    expect(joi?.scenes.map((scene) => scene.prompt)).toEqual(thursday.map((row) => row.pasi[0]));
    expect(joi?.scenes.map((scene) => scene.object)).toEqual(["toy", "door", "toy", "palm"]);
    expect(joi?.missionParent).toBe(`${thursday[0]?.pasi[0]} ${thursday[0]?.pasi[1]}`);
  });

  test("visible copy stays in Romanian", () => {
    for (const line of userStrings()) {
      expect(line, line).not.toMatch(ENGLISH_UI);
    }
  });
});

describe("joc pacing and safety", () => {
  test("locks the slow fade, the idle exit, and the daily ceiling", () => {
    expect(JOC_MIN_SCENE_MS).toBeGreaterThanOrEqual(5_000);
    expect(JOC_FADE_MS).toBeGreaterThanOrEqual(1_200);
    expect(JOC_IDLE_MS).toBe(10_000);
    expect(JOC_SESSION_MAX_MS).toBe(15 * 60 * 1000);
    expect(JOC_MAX_SESSIONS_PER_DAY).toBe(2);
    expect(canStartSession(0)).toBe(true);
    expect(canStartSession(1)).toBe(true);
    expect(canStartSession(2)).toBe(false);
  });

  test("a scene stays five seconds, then moves on without a tap", () => {
    expect(decidePlay(tick({ sceneElapsedMs: 4_999 }))).toEqual({ type: "stay" });
    expect(decidePlay(tick({ sceneElapsedMs: 5_000, tapped: false, sceneIndex: 0 }))).toEqual({
      type: "next-scene",
    });
    expect(decidePlay(tick({ sceneElapsedMs: 5_000, sceneIndex: 3 }))).toEqual({
      type: "mission",
      reason: "finished",
    });
  });

  test("ten seconds without a touch leaves a scene that is not ready to move", () => {
    expect(decidePlay(tick({ msSinceInteraction: 9_999, sceneElapsedMs: 1_000 }))).toEqual({
      type: "stay",
    });
    expect(decidePlay(tick({ msSinceInteraction: 10_000, sceneElapsedMs: 1_000 }))).toEqual({
      type: "mission",
      reason: "idle",
    });
  });

  test("fifteen minutes on screen goes to the mission even if the child is still tapping", () => {
    expect(
      decidePlay(
        tick({
          tapped: true,
          sceneElapsedMs: 5_000,
          msSinceTap: 5_000,
          msSinceInteraction: 0,
          sessionElapsedMs: JOC_SESSION_MAX_MS - 1,
        }),
      ),
    ).toEqual({ type: "next-scene" });
    expect(
      decidePlay(
        tick({
          tapped: true,
          msSinceInteraction: 0,
          sessionElapsedMs: JOC_SESSION_MAX_MS,
        }),
      ),
    ).toEqual({ type: "mission", reason: "cap" });
  });

  test("immediate taps still hold every scene, then finish", () => {
    let sceneIndex = 0;
    let sceneStarted = 0;
    let tappedAt: number | null = null;
    const events: string[] = [];

    for (let now = 0; now <= 30_000; now += 250) {
      const decision = decidePlay(
        tick({
          sceneElapsedMs: now - sceneStarted,
          msSinceInteraction: tappedAt == null ? now - sceneStarted : now - tappedAt,
          msSinceTap: tappedAt == null ? 0 : now - tappedAt,
          sessionElapsedMs: now,
          tapped: tappedAt != null,
          sceneIndex,
        }),
      );
      if (decision.type === "next-scene") {
        events.push(`next@${now}`);
        sceneIndex += 1;
        sceneStarted = now;
        tappedAt = now;
        continue;
      }
      if (decision.type === "mission") {
        events.push(`mission:${decision.reason}@${now}`);
        break;
      }
      if (tappedAt == null) tappedAt = now;
    }

    expect(events).toEqual([
      "next@5000",
      "next@10000",
      "next@15000",
      "mission:finished@20000",
    ]);
  });

  test("untouched scenes still play through, one every five seconds", () => {
    let clock: SceneClock = createPlayClock(0);
    const events: string[] = [];

    for (let now = 0; now <= 30_000; now += 250) {
      const before = clock.sceneIndex;
      const stepped = clockTick(clock, now, 4);
      clock = stepped.clock;
      if (stepped.decision.type === "next-scene") {
        expect(clock.sceneIndex).toBe(before + 1);
        events.push(`next@${now}`);
        expect(clock.sessionStartedAtMs).toBe(0);
        continue;
      }
      if (stepped.decision.type === "mission") {
        events.push(`mission:${stepped.decision.reason}@${now}`);
        break;
      }
    }

    expect(events).toEqual([
      "next@5000",
      "next@10000",
      "next@15000",
      "mission:finished@20000",
    ]);
    const resumed = resumePlayClock(clock, 99_000);
    expect(resumed.sessionStartedAtMs).toBe(0);
    expect(screenDurationMs(0, 20_000)).toBe(0);
    expect(screenDurationMs(null, 20_000)).toBe(0);
  });

  test("the 15-minute cap switches to the mission on a fake clock", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-15T08:00:00.000Z"));
    const reasons: string[] = [];
    const sceneMarks: number[] = [];
    const startedAtMs = Date.now();
    let clock = createPlayClock(startedAtMs);
    let loop: { stop: () => void } | null = null;
    try {
    loop = startPlayLoop({
      startedAtMs,
      sceneCount: 500,
      getClock: () => clock,
      setClock: (next) => {
        clock = next;
      },
      onScene: (index, commit) => {
        sceneMarks.push(Date.now() - startedAtMs);
        commit();
        expect(index).toBe(clock.sceneIndex);
      },
      onMission: (reason) => {
        reasons.push(reason);
      },
    });

    vi.advanceTimersByTime(JOC_MIN_SCENE_MS);
    expect(sceneMarks[0]).toBe(JOC_MIN_SCENE_MS);
    vi.advanceTimersByTime(JOC_SESSION_MAX_MS - JOC_MIN_SCENE_MS - 1_000);
    expect(reasons).toEqual([]);
    vi.advanceTimersByTime(1_000);
    expect(reasons).toEqual(["cap"]);
    expect(clock.sessionStartedAtMs).toBe(startedAtMs);
    } finally {
      loop?.stop();
      vi.useRealTimers();
    }
  });

  test("taps postpone idle but the 15-minute cap still opens the mission", () => {
    const start = 1_700_000_000_000;
    let clock = createPlayClock(start);
    let reason: string | null = null;
    let elapsedAt = -1;

    for (let elapsed = 0; elapsed <= JOC_SESSION_MAX_MS; elapsed += 1_000) {
      const now = start + elapsed;
      clock = resumePlayClock(clock, now + 86_400_000);
      clock = clockNudge(clock, now);
      clock = clockTap(clock, now);
      const stepped = clockTick(clock, now, 400);
      clock = stepped.clock;
      expect(clock.sessionStartedAtMs).toBe(start);
      expect(screenDurationMs(start, now)).toBe(elapsed === 0 ? 0 : elapsed);
      if (stepped.decision.type === "mission") {
        reason = stepped.decision.reason;
        elapsedAt = elapsed;
        break;
      }
      expect(elapsed).toBeLessThan(JOC_SESSION_MAX_MS);
    }

    expect(elapsedAt).toBe(JOC_SESSION_MAX_MS);
    expect(reason).toBe("cap");
    expect(screenDurationMs(start, start + JOC_SESSION_MAX_MS)).toBe(JOC_SESSION_MAX_MS);
    expect(formatScreenDuration(screenDurationMs(start, start + 12_400))).toBe("12 s");
  });

  test("duration labels stay short and capped", () => {
    expect(formatScreenDuration(0)).toBe("0 s");
    expect(formatScreenDuration(45_400)).toBe("45 s");
    expect(formatScreenDuration(60_000)).toBe("1 min");
    expect(formatScreenDuration(125_000)).toBe("2 min 5 s");
    expect(formatScreenDuration(JOC_SESSION_MAX_MS + 5_000)).toBe("15 min");
    expect(sessionStatusLabel(2)).toContain("mâine");
  });
});

describe("joc journal", () => {
  test("stores the trial fields and ignores a broken save", () => {
    const entry = createJournalEntry({
      id: "joc-1",
      date: "2026-10-15",
      levelId: "s1-z1",
      levelName: "Luni · Căsuță",
      startedAt: "2026-10-15T08:00:00.000Z",
    });
    const legacy = createJournalEntry({
      id: "joc-vechi",
      date: "2026-10-14",
      levelId: "balonas",
      levelName: "Balonaș",
      startedAt: "2026-10-14T08:00:00.000Z",
    });
    expect(parseJournal(null)).toEqual([]);
    expect(parseJournal("{")).toEqual([]);
    expect(parseJournal(JSON.stringify([{ id: "x" }, { ...entry, levelId: "s99-z1" }, entry, legacy]))).toEqual([
      entry,
      legacy,
    ]);
    expect(sessionsOnDate([entry], "2026-10-15")).toBe(1);
    expect(sessionsOnDate([entry], "2026-10-16")).toBe(0);
  });

  test("updates duration, gata, and the parent note", () => {
    const entry = createJournalEntry({
      id: "joc-1",
      date: "2026-10-15",
      levelId: "lopatica",
      levelName: "Lopățică",
      startedAt: "2026-10-15T08:00:00.000Z",
    });
    const updated = updateJournalEntry([entry], "joc-1", {
      screenDurationMs: 12_000,
      missionDone: true,
      parentNote: `  ${"a".repeat(JOC_NOTE_MAX + 80)}`,
    });
    expect(updated[0]?.screenDurationMs).toBe(12_000);
    expect(updated[0]?.missionDone).toBe(true);
    expect(updated[0]?.parentNote.length).toBe(JOC_NOTE_MAX);
  });

  test("exports a readable Romanian journal", () => {
    const entry = createJournalEntry({
      id: "joc-1",
      date: "2026-10-15",
      levelId: "maturica",
      levelName: "Măturică",
      startedAt: "2026-10-15T09:00:00.000Z",
    });
    const done = updateJournalEntry([entry], "joc-1", {
      screenDurationMs: 20_000,
      missionDone: true,
      parentNote: "Trei frunze în cutie",
    })[0]!;
    const text = formatJournalText([done]);
    expect(text).toContain("Jurnalul jocului");
    expect(text).toContain("15.10.2026 · Măturică · timp pe ecran: 20 s · misiune: real");
    expect(text).toContain("Notă: Trei frunze în cutie");
    expect(formatJournalText([])).toContain("Încă nu este nicio sesiune.");
  });

  test("doar_joc is exported and does not tick the plan", () => {
    const entry = createJournalEntry({
      id: "joc-1",
      date: "2026-10-15",
      levelId: "s7-z4",
      levelName: "Joi · Preșuleț",
      startedAt: "2026-10-15T09:00:00.000Z",
    });
    const played = updateJournalEntry([entry], "joc-1", { missionStatus: "doar_joc" })[0]!;
    expect(played.missionDone).toBe(false);
    expect(played.missionStatus).toBe("doar_joc");
    expect(formatJournalText([played])).toContain("misiune: doar_joc");
    expect(activityIdsMarkedDone("doar_joc", ["a", "b"], new Set())).toEqual([]);
    expect(activityIdsMarkedDone("real", ["a", "b"], new Set(["b"]))).toEqual(["a"]);
    const legacy = parseJournal(JSON.stringify([{ ...entry, missionDone: true }]));
    expect(legacy[0]?.missionStatus).toBe("real");
  });

  test("a watch start does not use a play session, and an old save stays a play session", () => {
    const play = createJournalEntry({
      id: "joc-1",
      date: "2026-10-15",
      levelId: "s1-z1",
      levelName: "Luni · Căsuță",
      startedAt: "2026-10-15T08:00:00.000Z",
    });
    const watched = createJournalEntry({
      id: "joc-privit",
      date: "2026-10-15",
      levelId: "s1-z1",
      levelName: "Luni · Căsuță",
      startedAt: "2026-10-15T18:00:00.000Z",
      mode: "privit",
    });
    expect(play.mode).toBe("joc");
    expect(sessionsOnDate([play, watched], "2026-10-15")).toBe(1);
    expect(watchSessionsOnDate([play, watched], "2026-10-15")).toBe(1);
    expect(watchScreenMs([play, watched], "2026-10-15")).toBe(0);

    const saved = JSON.parse(JSON.stringify(play)) as { mode?: string };
    delete saved.mode;
    const parsed = parseJournal(JSON.stringify([saved]));
    expect(parsed[0]?.mode).toBe("joc");
    expect(sessionsOnDate(parsed, "2026-10-15")).toBe(1);
    expect(canStartSession(sessionsOnDate(parsed, "2026-10-15"))).toBe(true);
  });
});

describe("mod privit", () => {
  test("two watches stay under ten minutes and inside the fifteen-minute cap", () => {
    expect(JOC_WATCH_SCENE_COUNT).toBe(4);
    expect(JOC_WATCH_PAUSE_MS).toBeGreaterThanOrEqual(5_000);
    expect(JOC_WATCH_PAUSE_MS).toBeLessThanOrEqual(10_000);
    expect(JOC_WATCH_DAY_MAX_MS).toBeLessThan(JOC_SESSION_MAX_MS);
    expect(watchSceneCount(5)).toBe(4);
    expect(watchSceneCount(3)).toBe(3);
    expect(watchSceneCount(0)).toBe(0);
    const oneRun = watchPlanMs(4);
    expect(oneRun).toBe(4 * (JOC_MIN_SCENE_MS + JOC_WATCH_PAUSE_MS + JOC_FADE_MS * 2));
    expect(oneRun * JOC_WATCH_MAX_PER_DAY).toBeLessThan(JOC_WATCH_DAY_MAX_MS);
    expect(oneRun).toBeLessThan(JOC_SESSION_MAX_MS);
    expect(canStartWatch(0, 0)).toBe(true);
    expect(canStartWatch(1, 0)).toBe(true);
    expect(canStartWatch(2, 0)).toBe(false);
    expect(canStartWatch(1, JOC_WATCH_DAY_MAX_MS)).toBe(false);
    expect(watchStatusLabel(2, 0)).toContain("două ori");
  });

  test("ten seconds without a touch does not leave a watch scene", () => {
    expect(
      decidePlay(tick({ msSinceInteraction: JOC_IDLE_MS, sceneElapsedMs: 1_000 })),
    ).toEqual({ type: "mission", reason: "idle" });
    expect(
      decideWatch({
        phase: "scene",
        phaseElapsedMs: 1_000,
        sessionElapsedMs: JOC_IDLE_MS,
        sceneIndex: 0,
        sceneCount: 4,
        dayWatchMs: 0,
      }),
    ).toEqual({ type: "stay" });
  });

  test("four scenes each hold, then pause, and the last pause opens the mission", () => {
    let phase: WatchPhase = "scene";
    let phaseStarted = 0;
    let sceneIndex = 0;
    const events: string[] = [];

    for (let now = 0; now <= 80_000; now += 250) {
      const decision = decideWatch({
        phase,
        phaseElapsedMs: now - phaseStarted,
        sessionElapsedMs: now,
        sceneIndex,
        sceneCount: 4,
        dayWatchMs: 0,
      });
      if (decision.type === "pause") {
        events.push(`pause@${now}`);
        phase = "pause";
        phaseStarted = now;
        continue;
      }
      if (decision.type === "next-scene") {
        events.push(`next@${now}`);
        sceneIndex += 1;
        phase = "scene";
        phaseStarted = now;
        continue;
      }
      if (decision.type === "mission") {
        events.push(`mission:${decision.reason}@${now}`);
        break;
      }
    }

    expect(events).toEqual([
      "pause@5000",
      "next@13000",
      "pause@18000",
      "next@26000",
      "pause@31000",
      "next@39000",
      "pause@44000",
      "mission:finished@52000",
    ]);
  });

  test("the daily ten minutes and the fifteen-minute cap both end the watch", () => {
    expect(
      decideWatch({
        phase: "scene",
        phaseElapsedMs: 0,
        sessionElapsedMs: JOC_WATCH_DAY_MAX_MS - 1,
        sceneIndex: 0,
        sceneCount: 4,
        dayWatchMs: 0,
      }),
    ).toEqual({ type: "stay" });
    expect(
      decideWatch({
        phase: "scene",
        phaseElapsedMs: 0,
        sessionElapsedMs: 1_000,
        sceneIndex: 0,
        sceneCount: 4,
        dayWatchMs: JOC_WATCH_DAY_MAX_MS - 1_000,
      }),
    ).toEqual({ type: "mission", reason: "cap" });
    expect(
      decideWatch({
        phase: "pause",
        phaseElapsedMs: 0,
        sessionElapsedMs: JOC_SESSION_MAX_MS,
        sceneIndex: 1,
        sceneCount: 4,
        dayWatchMs: Number.NaN,
      }),
    ).toEqual({ type: "mission", reason: "cap" });
  });

  test("the watch loop finishes four scenes with no touch and stops a third-long day", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-15T08:00:00.000Z"));
    const startedAtMs = Date.now();
    let clock: WatchClock = createWatchClock(startedAtMs);
    const events: string[] = [];
    const loop = startWatchLoop({
      startedAtMs,
      sceneCount: watchSceneCount(5),
      dayWatchMs: 0,
      getClock: () => clock,
      setClock: (next) => {
        clock = next;
      },
      onPause: (commit) => {
        events.push(`pause@${Date.now() - startedAtMs}`);
        commit();
      },
      onScene: (index, commit) => {
        events.push(`scene@${Date.now() - startedAtMs}:${index}`);
        commit();
      },
      onMission: (reason) => {
        events.push(`mission:${reason}@${Date.now() - startedAtMs}`);
      },
    });

    try {
      vi.advanceTimersByTime(JOC_IDLE_MS);
      expect(events.some((event) => event.startsWith("mission"))).toBe(false);
      vi.advanceTimersByTime(60_000);
      expect(events).toEqual([
        "pause@5000",
        "scene@13000:1",
        "pause@18000",
        "scene@26000:2",
        "pause@31000",
        "scene@39000:3",
        "pause@44000",
        "mission:finished@52000",
      ]);
      expect(clock.sessionStartedAtMs).toBe(startedAtMs);
    } finally {
      loop.stop();
      vi.useRealTimers();
    }

    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-15T20:00:00.000Z"));
    const later = Date.now();
    let capped: WatchClock = createWatchClock(later);
    const reasons: string[] = [];
    const cappedLoop = startWatchLoop({
      startedAtMs: later,
      sceneCount: 4,
      dayWatchMs: JOC_WATCH_DAY_MAX_MS - 1_000,
      getClock: () => capped,
      setClock: (next) => {
        capped = next;
      },
      onPause: (commit) => commit(),
      onScene: (_index, commit) => commit(),
      onMission: (reason) => {
        reasons.push(reason);
      },
    });
    try {
      vi.advanceTimersByTime(1_000);
      expect(reasons).toEqual(["cap"]);
    } finally {
      cappedLoop.stop();
      vi.useRealTimers();
    }
  });
});
