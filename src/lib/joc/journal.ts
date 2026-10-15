import { isJocLevelId } from "@/lib/joc/levels";
import { clampScreenDuration, formatScreenDuration } from "@/lib/joc/rules";

export const JOC_JOURNAL_KEY = "echilibru-joc-jurnal-v1";
export const JOC_NOTE_MAX = 400;

export type JocJournalEntry = {
  id: string;
  date: string;
  levelId: string;
  levelName: string;
  screenDurationMs: number;
  missionDone: boolean;
  parentNote: string;
  startedAt: string;
};

export type JournalPatch = Partial<
  Pick<JocJournalEntry, "screenDurationMs" | "missionDone" | "parentNote">
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
    parentNote: "",
    startedAt: input.startedAt,
  };
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
    return parsed.filter(isJournalEntry).map((entry) => ({
      ...entry,
      screenDurationMs: clampScreenDuration(entry.screenDurationMs),
      parentNote: normalizeParentNote(entry.parentNote),
    }));
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
    return {
      ...entry,
      ...patch,
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
    const mission = entry.missionDone ? "gata" : "încă nu";
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
