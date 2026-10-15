"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Cezar } from "@/components/joc/cezar";
import { MostraStage } from "@/components/joc/cezar-mostra";
import { JocObject } from "@/components/joc/joc-art";
import { cezarAnimationForScene } from "@/lib/joc/cezar";
import { JOC_COPY, openMissionLabel } from "@/lib/joc/copy";
import { isPlayableJocDay, jocWeekLevels, type JocWeekPlay } from "@/lib/joc/day-levels";
import {
  activityIdsMarkedDone,
  compareEntriesNewestFirst,
  createJournalEntry,
  formatJournalDate,
  formatJournalText,
  isMissionOpen,
  missionUiLabel,
  readJournal,
  sessionsOnDate,
  updateJournalEntry,
  watchScreenMs,
  watchSessionsOnDate,
  writeJournal,
  type JocJournalEntry,
  type JocMissionStatus,
} from "@/lib/joc/journal";
import { jocLegacyLevelById, objectLabel, sceneObject, type JocLevel } from "@/lib/joc/levels";
import { MOSTRA_SCENE_ID } from "@/lib/joc/mostra";
import {
  JOC_FADE_MS,
  canStartSession,
  canStartWatch,
  clockNudge,
  clockTap,
  createWatchClock,
  formatScreenDuration,
  resumePlayClock,
  resumeWatchClock,
  screenDurationMs,
  sessionStatusLabel,
  startPlayLoop,
  startWatchLoop,
  watchSceneCount,
  watchStatusLabel,
  type SceneClock,
  type WatchClock,
  type WatchPhase,
} from "@/lib/joc/rules";
import { useFamily } from "@/lib/family-context";
import { bucharestToday, civilDayOfWeek } from "@/lib/program-week";

type Mode =
  | { kind: "picker" }
  | { kind: "play"; levelId: string; entryId: string; startedAtMs: number }
  | { kind: "watch"; levelId: string; entryId: string; startedAtMs: number; dayWatchMs: number }
  | { kind: "mission"; levelId: string; entryId: string }
  | { kind: "ritual"; levelId: string };

function useMostraHold(firstSceneId: string | undefined) {
  const holdRef = useRef(firstSceneId === MOSTRA_SCENE_ID);
  const release = useCallback(() => {
    holdRef.current = false;
  }, []);
  const arm = useCallback((sceneId: string | undefined) => {
    holdRef.current = sceneId === MOSTRA_SCENE_ID;
  }, []);
  return { holdRef, release, arm };
}

function browserStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

export function JocView() {
  const { viewWeek, completions, toggleComplete } = useFamily();
  const weekPlay = useMemo(() => jocWeekLevels(viewWeek), [viewWeek]);
  const [ready, setReady] = useState(false);
  const [entries, setEntries] = useState<JocJournalEntry[]>([]);
  const [mode, setMode] = useState<Mode>({ kind: "picker" });
  const startingRef = useRef(false);
  const closingRef = useRef(false);
  const today = bucharestToday();
  const todayDay = civilDayOfWeek(today);

  const findLevel = useCallback(
    (id: string) => weekPlay?.levels.find((level) => level.id === id) ?? jocLegacyLevelById(id),
    [weekPlay],
  );

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      setEntries(readJournal(browserStorage()));
      setReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  const persist = useCallback((next: JocJournalEntry[]) => {
    setEntries(next);
    const storage = browserStorage();
    if (storage) writeJournal(storage, next);
  }, []);

  const patchEntry = useCallback(
    (id: string, patch: Parameters<typeof updateJournalEntry>[2]) => {
      setEntries((current) => {
        const next = updateJournalEntry(current, id, patch);
        const storage = browserStorage();
        if (storage) writeJournal(storage, next);
        return next;
      });
    },
    [],
  );

  function startLevel(level: JocLevel) {
    if (startingRef.current) return;
    if (!isPlayableJocDay(level.day, todayDay)) return;
    if (!canStartSession(sessionsOnDate(entries, today))) return;
    startingRef.current = true;
    const startedAtMs = Date.now();
    const entry = createJournalEntry({
      date: today,
      levelId: level.id,
      levelName: `${level.name} · ${level.characterName}`,
      startedAt: new Date(startedAtMs).toISOString(),
    });
    persist([...entries, entry]);
    setMode({ kind: "play", levelId: level.id, entryId: entry.id, startedAtMs });
  }

  function startWatch(level: JocLevel) {
    if (startingRef.current) return;
    if (!isPlayableJocDay(level.day, todayDay)) return;
    if (watchSceneCount(level.scenes.length) === 0) return;
    const dayWatchMs = watchScreenMs(entries, today);
    if (!canStartWatch(watchSessionsOnDate(entries, today), dayWatchMs)) return;
    startingRef.current = true;
    const startedAtMs = Date.now();
    const entry = createJournalEntry({
      date: today,
      levelId: level.id,
      levelName: `${level.name} · ${level.characterName}`,
      startedAt: new Date(startedAtMs).toISOString(),
      mode: "privit",
    });
    persist([...entries, entry]);
    setMode({ kind: "watch", levelId: level.id, entryId: entry.id, startedAtMs, dayWatchMs });
  }

  function closeMission(level: JocLevel, entryId: string, status: JocMissionStatus) {
    if (closingRef.current) return;
    closingRef.current = true;
    startingRef.current = false;
    patchEntry(entryId, { missionStatus: status });
    const done = new Set(completions.map((row) => row.activity_id));
    const ids = activityIdsMarkedDone(status, level.activityIds ?? [], done);
    setMode({ kind: "ritual", levelId: level.id });
    for (const id of ids) void toggleComplete(id);
  }

  if (!ready) {
    return (
      <p className="text-sm text-muted-foreground" role="status">
        {JOC_COPY.loading}
      </p>
    );
  }

  const level = mode.kind === "picker" ? null : findLevel(mode.levelId);
  if (mode.kind !== "picker" && !level) {
    return null;
  }

  const screenKey =
    mode.kind === "picker" ? "picker" : `${mode.kind}-${mode.levelId}-${"entryId" in mode ? mode.entryId : ""}`;

  return (
    <div key={screenKey} className="joc-enter">
      {mode.kind === "picker" ? (
        <JocPicker
          weekPlay={weekPlay}
          today={today}
          todayDay={todayDay}
          entries={entries}
          findLevel={findLevel}
          onStart={startLevel}
          onWatch={startWatch}
          onClose={(entry, status) => {
            const levelForEntry = findLevel(entry.levelId);
            if (!levelForEntry) return;
            closeMission(levelForEntry, entry.id, status);
          }}
          onNote={(id, parentNote) => patchEntry(id, { parentNote })}
        />
      ) : null}

      {mode.kind === "play" && level ? (
        <JocPlay
          level={level}
          startedAtMs={mode.startedAtMs}
          onDuration={(screenDurationMs) => patchEntry(mode.entryId, { screenDurationMs })}
          onMission={(screenDurationMs) => {
            patchEntry(mode.entryId, { screenDurationMs });
            setMode({ kind: "mission", levelId: level.id, entryId: mode.entryId });
          }}
        />
      ) : null}

      {mode.kind === "watch" && level ? (
        <JocWatch
          level={level}
          startedAtMs={mode.startedAtMs}
          dayWatchMs={mode.dayWatchMs}
          onDuration={(screenDurationMs) => patchEntry(mode.entryId, { screenDurationMs })}
          onMission={(screenDurationMs) => {
            patchEntry(mode.entryId, { screenDurationMs });
            setMode({ kind: "mission", levelId: level.id, entryId: mode.entryId });
          }}
        />
      ) : null}

      {mode.kind === "mission" && level ? (
        <JocMission
          level={level}
          note={entries.find((entry) => entry.id === mode.entryId)?.parentNote ?? ""}
          onNote={(parentNote) => patchEntry(mode.entryId, { parentNote })}
          onClose={(status) => closeMission(level, mode.entryId, status)}
        />
      ) : null}

      {mode.kind === "ritual" && level ? (
        <JocRitual
          level={level}
          onBack={() => {
            closingRef.current = false;
            setMode({ kind: "picker" });
          }}
        />
      ) : null}
    </div>
  );
}

function JocPicker({
  weekPlay,
  today,
  todayDay,
  entries,
  findLevel,
  onStart,
  onWatch,
  onClose,
  onNote,
}: {
  weekPlay: JocWeekPlay | null;
  today: string;
  todayDay: number;
  entries: JocJournalEntry[];
  findLevel: (id: string) => JocLevel | null;
  onStart: (level: JocLevel) => void;
  onWatch: (level: JocLevel) => void;
  onClose: (entry: JocJournalEntry, status: JocMissionStatus) => void;
  onNote: (id: string, note: string) => void;
}) {
  const started = sessionsOnDate(entries, today);
  const canStart = canStartSession(started);
  const watchStarts = watchSessionsOnDate(entries, today);
  const watchedMs = watchScreenMs(entries, today);
  const watchAllowed = canStartWatch(watchStarts, watchedMs);
  const open = entries
    .filter((entry) => entry.date === today && isMissionOpen(entry))
    .sort(compareEntriesNewestFirst);
  const history = [...entries].sort(compareEntriesNewestFirst);

  function onExport() {
    const blob = new Blob([formatJournalText(entries)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "jurnal-joc.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        {weekPlay ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={weekPlay.characterSrc} alt="" className="size-24" />
        ) : null}
        <h1 className="font-heading text-4xl">{JOC_COPY.title}</h1>
        {weekPlay ? <p className="font-heading text-3xl">{weekPlay.characterName}</p> : null}
        {weekPlay?.theme ? <p className="text-base text-muted-foreground">{weekPlay.theme}</p> : null}
        <p className="max-w-xl text-base leading-relaxed text-muted-foreground">{JOC_COPY.intro}</p>
        <p className="text-sm font-medium">{sessionStatusLabel(started)}</p>
        <p className="text-sm font-medium">{watchStatusLabel(watchStarts, watchedMs)}</p>
        <p className="text-sm text-muted-foreground">{JOC_COPY.onlyToday}</p>
      </header>

      {open.length > 0 ? (
        <section className="space-y-3" aria-label={JOC_COPY.missionPending}>
          {open.map((entry) => {
            const level = findLevel(entry.levelId);
            if (!level) {
              return (
                <article key={entry.id} className="space-y-3 rounded-2xl border border-border bg-card p-4">
                  <h2 className="font-heading text-2xl">{openMissionLabel(entry.levelName)}</h2>
                  <MissionActions onClose={(status) => onClose(entry, status)} />
                </article>
              );
            }
            return (
              <article key={entry.id} className="space-y-3 rounded-2xl border border-border bg-card p-4">
                <h2 className="font-heading text-2xl">{openMissionLabel(level.name)}</h2>
                <p className="text-lg leading-relaxed">{level.missionParent}</p>
                <MissionActions onClose={(status) => onClose(entry, status)} />
              </article>
            );
          })}
        </section>
      ) : null}

      {weekPlay && weekPlay.levels.length > 0 ? (
        <ul className="grid gap-3 sm:grid-cols-2">
          {weekPlay.levels.map((level) => {
            const playable = canStart && isPlayableJocDay(level.day, todayDay);
            const todayLevel = isPlayableJocDay(level.day, todayDay);
            return (
              <li key={level.id} className="flex flex-col gap-2">
                <button
                  type="button"
                  disabled={!playable}
                  onClick={() => onStart(level)}
                  className="flex min-h-20 w-full flex-col justify-center rounded-2xl border border-border bg-card p-4 text-left touch-manipulation disabled:opacity-40"
                >
                  <span className="block font-heading text-2xl">{level.name}</span>
                  <span className="text-sm text-muted-foreground">{level.cardLine}</span>
                </button>
                {todayLevel ? (
                  <button
                    type="button"
                    disabled={!watchAllowed}
                    onClick={() => onWatch(level)}
                    className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-base font-medium touch-manipulation disabled:opacity-40"
                  >
                    {JOC_COPY.watch}
                  </button>
                ) : null}
                {level.scenes.some((scene) => scene.id === MOSTRA_SCENE_ID) ? (
                  <Link
                    href="/joc/mostra"
                    className="flex h-12 w-full items-center justify-center rounded-2xl border border-border bg-background px-4 text-base font-medium"
                  >
                    {JOC_COPY.sample}
                  </Link>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-base text-muted-foreground">{JOC_COPY.emptyWeek}</p>
      )}

      <JournalList entries={history} onExport={onExport} onNote={onNote} />
    </div>
  );
}

function JournalList({
  entries,
  onExport,
  onNote,
}: {
  entries: JocJournalEntry[];
  onExport: () => void;
  onNote: (id: string, note: string) => void;
}) {
  return (
    <section className="space-y-3" aria-labelledby="jurnal-titlu">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 id="jurnal-titlu" className="font-heading text-2xl">
            {JOC_COPY.journalTitle}
          </h2>
          <p className="text-sm text-muted-foreground">{JOC_COPY.journalHint}</p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="h-11 px-4"
          onClick={onExport}
          disabled={entries.length === 0}
        >
          {JOC_COPY.export}
        </Button>
      </div>
      {entries.length === 0 ? (
        <p className="text-sm text-muted-foreground">{JOC_COPY.journalEmpty}</p>
      ) : (
        <ul className="space-y-3">
          {entries.map((entry) => (
            <li key={entry.id} className="space-y-2 rounded-2xl border border-border bg-card p-4">
              <p className="text-base leading-relaxed">
                {formatJournalDate(entry.date)} · {entry.levelName} · timp pe ecran:{" "}
                {formatScreenDuration(entry.screenDurationMs)} · misiune: {missionUiLabel(entry)}
              </p>
              <label className="block space-y-1 text-sm" htmlFor={`nota-${entry.id}`}>
                <span className="text-muted-foreground">{JOC_COPY.noteLabel}</span>
                <Textarea
                  id={`nota-${entry.id}`}
                  value={entry.parentNote}
                  maxLength={400}
                  placeholder={JOC_COPY.notePlaceholder}
                  onChange={(event) => onNote(entry.id, event.target.value)}
                />
              </label>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function JocPlay({
  level,
  startedAtMs,
  onDuration,
  onMission,
}: {
  level: JocLevel;
  startedAtMs: number;
  onDuration: (screenDurationMs: number) => void;
  onMission: (screenDurationMs: number) => void;
}) {
  const clockRef = useRef<SceneClock | null>(null);
  const leavingRef = useRef(false);
  const { holdRef, release, arm } = useMostraHold(level.scenes[0]?.id);
  const timer = useRef<number | null>(null);
  const pending = useRef<(() => void) | null>(null);
  const onMissionRef = useRef(onMission);
  const onDurationRef = useRef(onDuration);

  useEffect(() => {
    onMissionRef.current = onMission;
    onDurationRef.current = onDuration;
  });

  const [sceneIndex, setSceneIndex] = useState(0);
  const [tapped, setTapped] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const scene = level.scenes[sceneIndex] ?? level.scenes[0];

  const durationNow = useCallback(() => screenDurationMs(startedAtMs, Date.now()), [startedAtMs]);

  function beginTransition(apply: () => void) {
    pending.current = apply;
    leavingRef.current = true;
    setLeaving(true);
    if (timer.current != null) return;
    timer.current = window.setTimeout(() => {
      timer.current = null;
      const applyPending = pending.current;
      pending.current = null;
      leavingRef.current = false;
      setLeaving(false);
      applyPending?.();
    }, JOC_FADE_MS);
  }

  function goMission() {
    onMissionRef.current(durationNow());
  }

  useEffect(() => {
    clockRef.current = resumePlayClock(clockRef.current, startedAtMs);
    let lastSave = 0;
    const save = () => {
      const elapsed = screenDurationMs(startedAtMs, Date.now());
      if (startedAtMs > 0) onDurationRef.current(elapsed);
    };
    window.addEventListener("pagehide", save);
    const saveId = window.setInterval(() => {
      const tickNow = Date.now();
      if (lastSave === 0 || tickNow - lastSave >= 1_000) {
        lastSave = tickNow;
        save();
      }
    }, 1_000);
    const loop = startPlayLoop({
      startedAtMs,
      sceneCount: level.scenes.length,
      getClock: () => clockRef.current ?? resumePlayClock(null, startedAtMs),
      setClock: (clock) => {
        clockRef.current = clock;
      },
      isSuspended: () => leavingRef.current || holdRef.current,
      onScene: (index, commit) => {
        beginTransition(() => {
          arm(level.scenes[index]?.id);
          commit();
          setSceneIndex(index);
          setTapped(false);
        });
      },
      onMission: () => {
        beginTransition(() => {
          goMission();
        });
      },
    });

    return () => {
      loop.stop();
      window.clearInterval(saveId);
      window.removeEventListener("pagehide", save);
      save();
    };
    // The fade timer lives outside this effect so a restart cannot drop the mission.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level.id, level.scenes.length, startedAtMs]);

  useEffect(() => {
    return () => {
      if (timer.current != null) window.clearTimeout(timer.current);
    };
  }, []);

  function onStagePointer() {
    const clock = clockRef.current;
    if (!clock) return;
    clockRef.current = clockNudge(clock, Date.now());
  }

  function onObjectTap() {
    const clock = clockRef.current;
    if (!clock || leavingRef.current) return;
    const wasTapped = clock.tappedAtMs != null;
    clockRef.current = clockTap(clock, Date.now());
    if (!wasTapped) setTapped(true);
  }

  if (!scene) return null;
  const line = tapped ? scene.reaction : scene.prompt;

  return (
    <div className="flex flex-col gap-4">
      <div className="sticky top-0 z-30 flex items-center justify-between gap-3 bg-background/95 py-2 backdrop-blur">
        <div>
          <h1 className="font-heading text-3xl">{level.characterName}</h1>
          <p className="text-sm text-muted-foreground">{level.name}</p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="h-12 px-4 text-base"
          onClick={() => beginTransition(goMission)}
        >
          {JOC_COPY.toMission}
        </Button>
      </div>
      <div
        className="transition-opacity ease-in-out"
        style={{ transitionDuration: `${JOC_FADE_MS}ms`, opacity: leaving ? 0 : 1 }}
        onPointerDown={onStagePointer}
        aria-hidden={leaving}
      >
        <div className="flex flex-col items-center gap-6 pb-6">
          {scene.id === MOSTRA_SCENE_ID ? (
            <MostraStage onDone={release} />
          ) : (
            <div className="flex w-full items-end justify-center gap-3">
              <Cezar key={scene.id} animation={cezarAnimationForScene(level.day, sceneIndex)} />
              <button
                type="button"
                aria-label={objectLabel(sceneObject(level.id, scene))}
                onClick={onObjectTap}
                className="flex size-[min(42vw,220px)] shrink-0 items-center justify-center rounded-full bg-card ring-1 ring-border touch-manipulation focus-visible:ring-4 focus-visible:ring-ring/50"
              >
                <JocObject
                  key={scene.id}
                  object={sceneObject(level.id, scene)}
                  motion={scene.motion}
                  reacted
                  sceneIndex={sceneIndex}
                />
              </button>
            </div>
          )}
          {scene.caption ? (
            <p className="text-sm text-muted-foreground">{scene.caption}</p>
          ) : null}
          <p className="min-h-8 max-w-sm text-center text-xl leading-snug" aria-live="polite">
            {line}
          </p>
        </div>
      </div>
    </div>
  );
}

function JocWatch({
  level,
  startedAtMs,
  dayWatchMs,
  onDuration,
  onMission,
}: {
  level: JocLevel;
  startedAtMs: number;
  dayWatchMs: number;
  onDuration: (screenDurationMs: number) => void;
  onMission: (screenDurationMs: number) => void;
}) {
  const scenes = level.scenes.slice(0, watchSceneCount(level.scenes.length));
  const clockRef = useRef<WatchClock | null>(null);
  const leavingRef = useRef(false);
  const { holdRef, release, arm } = useMostraHold(scenes[0]?.id);
  const timer = useRef<number | null>(null);
  const pending = useRef<(() => void) | null>(null);
  const onMissionRef = useRef(onMission);
  const onDurationRef = useRef(onDuration);

  useEffect(() => {
    onMissionRef.current = onMission;
    onDurationRef.current = onDuration;
  });

  const [sceneIndex, setSceneIndex] = useState(0);
  const [phase, setPhase] = useState<WatchPhase>("scene");
  const [leaving, setLeaving] = useState(false);
  const scene = scenes[sceneIndex] ?? scenes[0];

  const durationNow = useCallback(() => screenDurationMs(startedAtMs, Date.now()), [startedAtMs]);

  function beginTransition(apply: () => void) {
    pending.current = apply;
    leavingRef.current = true;
    setLeaving(true);
    if (timer.current != null) return;
    timer.current = window.setTimeout(() => {
      timer.current = null;
      const applyPending = pending.current;
      pending.current = null;
      leavingRef.current = false;
      setLeaving(false);
      applyPending?.();
    }, JOC_FADE_MS);
  }

  function goMission() {
    onMissionRef.current(durationNow());
  }

  useEffect(() => {
    clockRef.current = resumeWatchClock(clockRef.current, startedAtMs);
    let lastSave = 0;
    const save = () => {
      const elapsed = screenDurationMs(startedAtMs, Date.now());
      if (startedAtMs > 0) onDurationRef.current(elapsed);
    };
    window.addEventListener("pagehide", save);
    const saveId = window.setInterval(() => {
      const tickNow = Date.now();
      if (lastSave === 0 || tickNow - lastSave >= 1_000) {
        lastSave = tickNow;
        save();
      }
    }, 1_000);
    const loop = startWatchLoop({
      startedAtMs,
      sceneCount: scenes.length,
      dayWatchMs,
      getClock: () => clockRef.current ?? createWatchClock(startedAtMs),
      setClock: (clock) => {
        clockRef.current = clock;
      },
      isSuspended: () => leavingRef.current || holdRef.current,
      onPause: (commit) => {
        beginTransition(() => {
          commit();
          setPhase("pause");
        });
      },
      onScene: (index, commit) => {
        beginTransition(() => {
          arm(scenes[index]?.id);
          commit();
          setSceneIndex(index);
          setPhase("scene");
        });
      },
      onMission: () => {
        beginTransition(() => {
          goMission();
        });
      },
    });

    return () => {
      loop.stop();
      window.clearInterval(saveId);
      window.removeEventListener("pagehide", save);
      save();
    };
    // The fade timer lives outside this effect so a restart cannot drop the mission.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level.id, scenes.length, startedAtMs, dayWatchMs]);

  useEffect(() => {
    return () => {
      if (timer.current != null) window.clearTimeout(timer.current);
    };
  }, []);

  if (!scene) return null;
  const imitating = phase === "pause";

  return (
    <div className="flex flex-col gap-4">
      <div className="sticky top-0 z-30 flex items-center justify-between gap-3 bg-background/95 py-2 backdrop-blur">
        <div>
          <h1 className="font-heading text-3xl">{level.characterName}</h1>
          <p className="text-sm text-muted-foreground">
            {JOC_COPY.watch} · {level.name}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="h-12 px-4 text-base"
          onClick={() => beginTransition(goMission)}
        >
          {JOC_COPY.toMission}
        </Button>
      </div>
      <div
        className="transition-opacity ease-in-out"
        style={{ transitionDuration: `${JOC_FADE_MS}ms`, opacity: leaving ? 0 : 1 }}
        aria-hidden={leaving}
      >
        <div className="flex flex-col items-center gap-6 pb-6">
          {scene.id === MOSTRA_SCENE_ID ? (
            <MostraStage onDone={release} />
          ) : (
            <div className="flex w-full items-end justify-center gap-3">
              {/* Same key through the pause so the finished pose stays still. */}
              <Cezar key={scene.id} animation={cezarAnimationForScene(level.day, sceneIndex)} />
              <div
                className="flex size-[min(42vw,220px)] shrink-0 items-center justify-center rounded-full bg-card ring-1 ring-border"
                aria-hidden
              >
                <JocObject
                  key={scene.id}
                  object={sceneObject(level.id, scene)}
                  motion={scene.motion}
                  reacted
                  sceneIndex={sceneIndex}
                />
              </div>
            </div>
          )}
          {scene.caption ? (
            <p className="text-sm text-muted-foreground">{scene.caption}</p>
          ) : null}
          {imitating ? (
            <div className="space-y-1 text-center">
              <p className="text-sm font-medium text-muted-foreground">{JOC_COPY.forParent}</p>
              <p className="min-h-8 font-heading text-4xl" aria-live="polite">
                {JOC_COPY.watchImitate}
              </p>
            </div>
          ) : (
            <p className="min-h-8 max-w-sm text-center text-xl leading-snug" aria-live="polite">
              {scene.prompt}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function MissionActions({ onClose }: { onClose: (status: JocMissionStatus) => void }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button type="button" className="h-14 flex-1 text-lg" onClick={() => onClose("real")}>
        {JOC_COPY.done}
      </Button>
      <Button
        type="button"
        variant="outline"
        className="h-14 flex-1 text-base"
        onClick={() => onClose("doar_joc")}
      >
        {JOC_COPY.onlyInGame}
      </Button>
    </div>
  );
}

function JocMission({
  level,
  note,
  onNote,
  onClose,
}: {
  level: JocLevel;
  note: string;
  onNote: (note: string) => void;
  onClose: (status: JocMissionStatus) => void;
}) {
  return (
    <article className="mx-auto max-w-lg space-y-6">
      <p className="text-sm font-medium text-muted-foreground">{JOC_COPY.forParent}</p>
      <div className="flex items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={level.characterSrc} alt="" className="size-20" />
        <div>
          <h1 className="font-heading text-4xl">{level.characterName}</h1>
          <p className="text-sm text-muted-foreground">{level.name}</p>
        </div>
      </div>
      <p className="line-clamp-2 text-xl leading-relaxed">{level.missionParent}</p>
      <label className="block space-y-2" htmlFor="nota-misiune">
        <span className="text-sm font-medium">{JOC_COPY.noteLabel}</span>
        <Textarea
          id="nota-misiune"
          value={note}
          maxLength={400}
          placeholder={JOC_COPY.notePlaceholder}
          onChange={(event) => onNote(event.target.value)}
        />
      </label>
      <MissionActions onClose={onClose} />
    </article>
  );
}

function JocRitual({ level, onBack }: { level: JocLevel; onBack: () => void }) {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center gap-8 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={level.characterSrc} alt="" className="size-28" />
      <p className="font-heading text-4xl">{level.ritual}</p>
      <Button type="button" variant="outline" className="h-12 px-6 text-base" onClick={onBack}>
        {JOC_COPY.ritualBack}
      </Button>
    </div>
  );
}
