import { isJocLevelId } from "@/lib/joc/levels";
import { clampScreenDuration, formatScreenDuration } from "@/lib/joc/rules";

export const JOC_JOURNAL_KEY = "echilibru-joc-jurnal-v1";
export const JOC_NOTE_MAX = 400;

/** `real` ticks the plan. `doar_joc` stays in the journal only. */
export type JocMissionStatus = "real" | "doar_joc";

export type JocJournalEntry = {
  id: string;
  date: string;
  levelId: string;
  levelName: string;
  screenDurationMs: number;
  missionDone: boolean;
  missionStatus: JocMissionStatus | null;
  parentNote: string;
  startedAt: string;
};

export type JournalPatch = Partial<
  Pick<JocJournalEntry, "screenDurationMs" | "missionDone" | "missionStatus" | "parentNote">
>;

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

export function normalizeParentNote(note: string): string {
  return note.slice(0, JOC_NOTE_MAX);
}

export function createJournalEntry(input: {
  id?: string;
  date: string;
  levelId: string;
  levelName: string;
  startedAt: string;
}): JocJournalEntry {
  return {
    id: input.id ?? `joc-${Math.random().toString(36).slice(2, 10)}`,
    date: input.date,
    levelId: input.levelId,
    levelName: input.levelName,
    screenDurationMs: 0,
    missionDone: false,
    missionStatus: null,
    parentNote: "",
    startedAt: input.startedAt,
  };
}

export function missionStatusOf(entry: {
  missionStatus?: JocMissionStatus | null;
  missionDone?: boolean;
}): JocMissionStatus | null {
  if (entry.missionStatus === "real" || entry.missionStatus === "doar_joc") return entry.missionStatus;
  if (entry.missionDone) return "real";
  return null;
}

export function isMissionOpen(entry: {
  missionStatus?: JocMissionStatus | null;
  missionDone?: boolean;
}): boolean {
  return missionStatusOf(entry) == null;
}

/** Only a real closing ticks activities that are not already done. */
export function activityIdsMarkedDone(
  status: JocMissionStatus,
  activityIds: readonly string[],
  alreadyDone: ReadonlySet<string>,
): string[] {
  if (status !== "real") return [];
  return activityIds.filter((id) => id.length > 0 && !alreadyDone.has(id));
}

export function missionExportLabel(entry: {
  missionStatus?: JocMissionStatus | null;
  missionDone?: boolean;
}): string {
  const status = missionStatusOf(entry);
  if (status === "real") return "real";
  if (status === "doar_joc") return "doar_joc";
  return "încă nu";
}

export function missionUiLabel(entry: {
  missionStatus?: JocMissionStatus | null;
  missionDone?: boolean;
}): string {
  const status = missionStatusOf(entry);
  if (status === "real") return "gata";
  if (status === "doar_joc") return "doar în joc";
  return "încă nu";
}

export function isJournalEntry(value: unknown): value is JocJournalEntry {
  if (!value || typeof value !== "object") return false;
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.id === "string" &&
    entry.id.length > 0 &&
    typeof entry.date === "string" &&
    DATE_ONLY.test(entry.date) &&
    typeof entry.levelId === "string" &&
    isJocLevelId(entry.levelId) &&
    typeof entry.levelName === "string" &&
    typeof entry.screenDurationMs === "number" &&
    Number.isFinite(entry.screenDurationMs) &&
    entry.screenDurationMs >= 0 &&
    typeof entry.missionDone === "boolean" &&
    typeof entry.parentNote === "string" &&
    typeof entry.startedAt === "string"
  );
}

export function parseJournal(raw: string | null): JocJournalEntry[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isJournalEntry).map((entry) => {
      const missionStatus = missionStatusOf(entry);
      return {
        ...entry,
        screenDurationMs: clampScreenDuration(entry.screenDurationMs),
        parentNote: normalizeParentNote(entry.parentNote),
        missionStatus,
        missionDone: missionStatus === "real",
      };
    });
  } catch {
    return [];
  }
}

export function sessionsOnDate(entries: readonly JocJournalEntry[], date: string): number {
  return entries.filter((entry) => entry.date === date).length;
}

export function updateJournalEntry(
  entries: readonly JocJournalEntry[],
  id: string,
  patch: JournalPatch,
): JocJournalEntry[] {
  return entries.map((entry) => {
    if (entry.id !== id) return entry;
    const missionStatus =
      patch.missionStatus !== undefined
        ? patch.missionStatus
        : patch.missionDone === true
          ? "real"
          : patch.missionDone === false
            ? null
            : entry.missionStatus;
    return {
      ...entry,
      ...patch,
      missionStatus,
      missionDone: missionStatus === "real",
      screenDurationMs:
        patch.screenDurationMs === undefined
          ? entry.screenDurationMs
          : clampScreenDuration(patch.screenDurationMs),
      parentNote:
        patch.parentNote === undefined ? entry.parentNote : normalizeParentNote(patch.parentNote),
    };
  });
}

export function formatJournalDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) return isoDate;
  return `${day}.${month}.${year}`;
}

export function compareEntriesNewestFirst(a: JocJournalEntry, b: JocJournalEntry): number {
  return b.startedAt.localeCompare(a.startedAt) || b.id.localeCompare(a.id);
}

export function formatJournalText(entries: readonly JocJournalEntry[]): string {
  const sorted = [...entries].sort(compareEntriesNewestFirst);
  const lines = ["Jurnalul jocului", "Proba de pe tabletă. Datele rămân pe aparat.", ""];
  if (sorted.length === 0) {
    lines.push("Încă nu este nicio sesiune.");
    return `${lines.join("\n")}\n`;
  }
  for (const entry of sorted) {
    const mission = missionExportLabel(entry);
    lines.push(
      `${formatJournalDate(entry.date)} · ${entry.levelName} · timp pe ecran: ${formatScreenDuration(entry.screenDurationMs)} · misiune: ${mission}`,
    );
    const note = entry.parentNote.trim();
    lines.push(`Notă: ${note || "—"}`);
    lines.push("");
  }
  return `${lines.join("\n")}\n`;
}

export function readJournal(storage: Pick<Storage, "getItem"> | null): JocJournalEntry[] {
  if (!storage) return [];
  try {
    return parseJournal(storage.getItem(JOC_JOURNAL_KEY));
  } catch {
    return [];
  }
}

export function writeJournal(storage: Pick<Storage, "setItem">, entries: readonly JocJournalEntry[]) {
  try {
    storage.setItem(JOC_JOURNAL_KEY, JSON.stringify(entries));
  } catch {
    // Jurnalul rămâne în memorie dacă aparatul refuză scrierea.
  }
}
