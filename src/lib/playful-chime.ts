/**
 * Short “gata” chime for the PLAYFUL PILOT.
 * Device-local preference (localStorage). Default OFF — no autoplay, adult-triggered.
 */

export const CHIME_STORAGE_KEY = "echilibru-chime-gata";
export const CHIME_SRC = "/sounds/gata-chime.wav";
/** Quiet rooms / shared devices: sound stays off until a parent turns it on. */
export const CHIME_DEFAULT_ENABLED = false;
export const CHIME_TOGGLE_LABEL = "Sunet scurt la gata";
export const CHIME_TOGGLE_HELP =
  "Un sunet scurt când bifezi ultimul pilon din zi, doar dacă tu îl pornești. Nu pornește singur la deschiderea paginii.";

type StorageLike = Pick<Storage, "getItem" | "setItem">;

function defaultStorage(): StorageLike | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function readChimeEnabled(storage: StorageLike | null = defaultStorage()): boolean {
  if (!storage) return CHIME_DEFAULT_ENABLED;
  try {
    const raw = storage.getItem(CHIME_STORAGE_KEY);
    if (raw === "1" || raw === "true") return true;
    if (raw === "0" || raw === "false") return false;
    return CHIME_DEFAULT_ENABLED;
  } catch {
    return CHIME_DEFAULT_ENABLED;
  }
}

const chimeListeners = new Set<() => void>();

export function subscribeChimeEnabled(onStoreChange: () => void): () => void {
  chimeListeners.add(onStoreChange);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStoreChange);
  }
  return () => {
    chimeListeners.delete(onStoreChange);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStoreChange);
    }
  };
}

export function getChimeEnabledSnapshot(): boolean {
  return readChimeEnabled();
}

export function getChimeEnabledServerSnapshot(): boolean {
  return CHIME_DEFAULT_ENABLED;
}

function notifyChimeListeners() {
  for (const listener of chimeListeners) listener();
}

export function writeChimeEnabled(
  enabled: boolean,
  storage: StorageLike | null = defaultStorage(),
): void {
  if (storage) {
    try {
      storage.setItem(CHIME_STORAGE_KEY, enabled ? "1" : "0");
    } catch {
      // Private mode / quota — keep the in-memory toggle only.
    }
  }
  notifyChimeListeners();
}

export function isCompletingLastActivity(args: {
  activityIds: readonly string[];
  completedIds: readonly string[];
  toggledId: string;
  wasAlreadyDone: boolean;
}): boolean {
  if (args.wasAlreadyDone) return false;
  if (!args.activityIds.includes(args.toggledId)) return false;
  if (args.activityIds.length === 0) return false;
  const done = new Set(args.completedIds);
  done.add(args.toggledId);
  return args.activityIds.every((id) => done.has(id));
}

export function shouldPlayDoneChime(args: {
  enabled: boolean;
  hasOverlay: boolean;
  completingLast: boolean;
}): boolean {
  return args.enabled && args.hasOverlay && args.completingLast;
}

let chimeEl: HTMLAudioElement | null = null;

/** Adult-triggered only. Never call from page load / useEffect. */
export function playDoneChime(): void {
  if (typeof window === "undefined") return;
  if (!readChimeEnabled()) return;
  try {
    if (!chimeEl) {
      chimeEl = new Audio(CHIME_SRC);
      chimeEl.preload = "auto";
    }
    chimeEl.currentTime = 0;
    void chimeEl.play().catch(() => {
      // Autoplay policies / missing file — stay silent.
    });
  } catch {
    // Ignore.
  }
}
