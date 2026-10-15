import { describe, expect, test } from "vitest";
import { JOC_COPY, openMissionLabel } from "./copy";
import {
  JOC_NOTE_MAX,
  createJournalEntry,
  formatJournalText,
  parseJournal,
  sessionsOnDate,
  updateJournalEntry,
} from "./journal";
import { buildDayLevels, jocWeekLevels, scenesForDay, type JocActivitySource } from "./day-levels";
import { JOC_LEGACY_LEVELS, isJocLevelId } from "./levels";
import { getSeedActivities } from "@/lib/seed/week1";
import {
  JOC_FADE_MS,
  JOC_IDLE_MS,
  JOC_MAX_SESSIONS_PER_DAY,
  JOC_MIN_SCENE_MS,
  JOC_SESSION_MAX_MS,
  canStartSession,
  clockNudge,
  clockTap,
  clockTick,
  createPlayClock,
  decidePlay,
  formatScreenDuration,
  resumePlayClock,
  screenDurationMs,
  sessionStatusLabel,
  showNextScene,
  type PlayTick,
  type SceneClock,
} from "./rules";

const ENGLISH_UI =
  /\b(score|scores|game|click|tap|bravo|notification|hello|demo|audio|video|loading)\b/i;

function userStrings(): string[] {
  const strings: string[] = Object.values(JOC_COPY);
  strings.push(openMissionLabel("Luni"));
  strings.push(sessionStatusLabel(0), sessionStatusLabel(1), sessionStatusLabel(2));
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
    expect(luni?.scenes.map((scene) => scene.prompt)).toEqual(seedDay1.map((row) => row.titlu));
    expect(luni?.missionParent).toContain(seedDay1[0]?.gata_cand);
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

  test("a tap does not cut the scene before five seconds", () => {
    expect(
      decidePlay(tick({ tapped: true, sceneElapsedMs: 4_999, msSinceTap: 4_999 })),
    ).toEqual({ type: "stay" });
    expect(
      decidePlay(tick({ tapped: true, sceneElapsedMs: 5_000, msSinceTap: 4_999 })),
    ).toEqual({ type: "stay" });
  });

  test("the scene advances only after the minimum and a tap", () => {
    expect(decidePlay(tick({ sceneElapsedMs: 8_000, msSinceInteraction: 1_000 }))).toEqual({
      type: "stay",
    });
    expect(
      decidePlay(tick({ tapped: true, sceneElapsedMs: 5_000, msSinceTap: 5_000, sceneIndex: 0 })),
    ).toEqual({ type: "next-scene" });
    expect(
      decidePlay(tick({ tapped: true, sceneElapsedMs: 5_000, msSinceTap: 5_000, sceneIndex: 3 })),
    ).toEqual({ type: "mission", reason: "finished" });
  });

  test("ten seconds without a touch goes to the real mission", () => {
    expect(decidePlay(tick({ msSinceInteraction: 9_999, sceneElapsedMs: 9_999 }))).toEqual({
      type: "stay",
    });
    expect(decidePlay(tick({ msSinceInteraction: 10_000, sceneElapsedMs: 10_000 }))).toEqual({
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

  test("one tap opens the next scene and idle still ends ten seconds after that tap", () => {
    let clock: SceneClock = {
      sceneIndex: 0,
      sceneStartedAtMs: 0,
      lastInteractionAtMs: 0,
      tappedAtMs: null,
      sessionStartedAtMs: 0,
    };
    clock = clockTap(clock, 0);
    const advanced = showNextScene(clock, 5_000);
    expect(advanced.lastInteractionAtMs).toBe(0);
    expect(advanced.sessionStartedAtMs).toBe(0);
    let missionAt: number | null = null;
    let missionScene = -1;

    for (let now = 0; now <= 30_000; now += 250) {
      const stepped = clockTick(clock, now, 4);
      clock = stepped.clock;
      if (stepped.decision.type === "mission") {
        missionAt = now;
        missionScene = clock.sceneIndex;
        expect(stepped.decision.reason).toBe("idle");
        break;
      }
    }

    expect(missionAt).toBe(10_000);
    expect(missionScene).toBe(1);
  });

  test("idle still fires at 10s when the clock is resumed", () => {
    const start = 1_700_000_000_000;
    let clock = createPlayClock(start);
    let missionAt: number | null = null;

    for (let elapsed = 0; elapsed <= JOC_IDLE_MS; elapsed += 250) {
      const now = start + elapsed;
      clock = resumePlayClock(clock, now + 60_000);
      const stepped = clockTick(clock, now, 4);
      clock = stepped.clock;
      expect(clock.sessionStartedAtMs).toBe(start);
      expect(clock.lastInteractionAtMs).toBe(start);
      if (elapsed < JOC_IDLE_MS) {
        expect(stepped.decision).toEqual({ type: "stay" });
      } else {
        expect(stepped.decision).toEqual({ type: "mission", reason: "idle" });
        missionAt = elapsed;
      }
    }

    expect(missionAt).toBe(JOC_IDLE_MS);
    expect(screenDurationMs(start, start + JOC_IDLE_MS)).toBe(JOC_IDLE_MS);
    expect(screenDurationMs(0, start + JOC_IDLE_MS)).toBe(0);
    expect(screenDurationMs(null, start + JOC_IDLE_MS)).toBe(0);
    expect(formatScreenDuration(screenDurationMs(0, start))).toBe("0 s");
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
    expect(text).toContain("15.10.2026 · Măturică · timp pe ecran: 20 s · misiune: gata");
    expect(text).toContain("Notă: Trei frunze în cutie");
    expect(formatJournalText([])).toContain("Încă nu este nicio sesiune.");
  });
});
