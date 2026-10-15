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
import { JOC_LEVELS } from "./levels";
import {
  JOC_FADE_MS,
  JOC_IDLE_MS,
  JOC_MAX_SESSIONS_PER_DAY,
  JOC_MIN_SCENE_MS,
  JOC_SESSION_MAX_MS,
  canStartSession,
  decidePlay,
  formatScreenDuration,
  sessionStatusLabel,
  type PlayTick,
} from "./rules";

const ENGLISH_UI =
  /\b(score|scores|game|click|tap|bravo|notification|hello|demo|audio|video|loading)\b/i;

function userStrings(): string[] {
  const strings: string[] = Object.values(JOC_COPY);
  strings.push(openMissionLabel("Balonaș"));
  strings.push(sessionStatusLabel(0), sessionStatusLabel(1), sessionStatusLabel(2));
  for (const level of JOC_LEVELS) {
    strings.push(
      level.name,
      level.objectLabel,
      level.cardLine,
      level.missionParent,
      level.ritual,
    );
    for (const scene of level.scenes) {
      strings.push(scene.prompt, scene.reaction);
    }
  }
  return strings;
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

describe("joc levels", () => {
  test("five slow levels for band 1–2, each with 3–5 taps", () => {
    expect(JOC_LEVELS.map((level) => level.name)).toEqual([
      "Balonaș",
      "Lopățică",
      "Mănuță",
      "Sunețel",
      "Măturică",
    ]);
    for (const level of JOC_LEVELS) {
      expect(level.scenes.length).toBeGreaterThanOrEqual(3);
      expect(level.scenes.length).toBeLessThanOrEqual(5);
      expect(level.ritual.endsWith("gata.")).toBe(true);
      expect(level.missionParent.length).toBeGreaterThan(10);
      expect(level.characterSrc.startsWith("/characters/")).toBe(true);
    }
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
      levelId: "balonas",
      levelName: "Balonaș",
      startedAt: "2026-10-15T08:00:00.000Z",
    });
    expect(parseJournal(null)).toEqual([]);
    expect(parseJournal("{")).toEqual([]);
    expect(parseJournal(JSON.stringify([{ id: "x" }, entry]))).toEqual([entry]);
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
