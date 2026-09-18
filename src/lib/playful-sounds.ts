/**
 * PLAYFUL PILOT sounds MVP — S3 V–D mapped clips.
 * Feature flag OFF by default (no production UI). Settings toggle also default OFF.
 * Adult Play tap only. No autoplay. Shared player (no overlap).
 */

import { playSharedAudio } from "@/lib/playful-audio";

export const PLAYFUL_SOUNDS_FLAG_ENV = "NEXT_PUBLIC_PLAYFUL_SOUNDS";
export const SOUNDS_STORAGE_KEY = "echilibru-playful-sounds";
export const SOUNDS_DEFAULT_ENABLED = false;
export const SOUNDS_TOGGLE_LABEL = "Sunete de previzualizare (S3)";
export const SOUNDS_TOGGLE_HELP =
  "Clipuri scurte (vânt, pași, casă) pe S3 vineri–duminică. Doar dacă le pornești tu. Nu pornesc singure. Oprite implicit — nu e vocea finală.";
export const SOUNDS_PLAY_LABEL = "Ascultă";
export const SOUNDS_PLAY_DISABLED_HINT = "Pornește sunetele din Setări";

export type PlayfulSoundKind = "wind" | "steps" | "house" | "silent";

export type PlayfulSoundClip = {
  kind: PlayfulSoundKind;
  src: string | null;
  label: string;
};

export const PLAYFUL_SOUND_CLIPS: Record<PlayfulSoundKind, PlayfulSoundClip> = {
  wind: {
    kind: "wind",
    src: "/sounds/playful-wind.wav",
    label: "Vânt",
  },
  steps: {
    kind: "steps",
    src: "/sounds/playful-steps.wav",
    label: "Pași",
  },
  house: {
    kind: "house",
    src: "/sounds/playful-house.wav",
    label: "Sunete din casă",
  },
  silent: {
    kind: "silent",
    src: null,
    label: "Liniște",
  },
};

/** S3 V–D only. piatră → silent (no clip / no Play). */
export const PLAYFUL_SOUND_BY_ACTIVITY: Record<string, PlayfulSoundKind> = {
  "s3-2-3-z5-mental": "house",
  "s3-2-3-z6-fizic": "steps",
  "s3-2-3-z6-mental": "wind",
  "s3-2-3-z6-resurse": "silent",
};

export function isPlayfulSoundsPreviewEnabled(
  raw: string | undefined = process.env.NEXT_PUBLIC_PLAYFUL_SOUNDS,
): boolean {
  const value = raw?.trim().toLowerCase();
  return value === "1" || value === "true" || value === "on" || value === "yes";
}

export function playfulSoundForActivity(
  activityId: string,
): PlayfulSoundClip | null {
  const kind = PLAYFUL_SOUND_BY_ACTIVITY[activityId];
  if (!kind) return null;
  return PLAYFUL_SOUND_CLIPS[kind];
}

export function playfulSoundPlayable(
  activityId: string,
): PlayfulSoundClip | null {
  const clip = playfulSoundForActivity(activityId);
  if (!clip?.src) return null;
  return clip;
}

type StorageLike = Pick<Storage, "getItem" | "setItem">;

function defaultStorage(): StorageLike | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function readPlayfulSoundsEnabled(
  storage: StorageLike | null = defaultStorage(),
): boolean {
  if (!storage) return SOUNDS_DEFAULT_ENABLED;
  try {
    const raw = storage.getItem(SOUNDS_STORAGE_KEY);
    if (raw === "1" || raw === "true") return true;
    if (raw === "0" || raw === "false") return false;
    return SOUNDS_DEFAULT_ENABLED;
  } catch {
    return SOUNDS_DEFAULT_ENABLED;
  }
}

const soundsListeners = new Set<() => void>();

export function subscribePlayfulSoundsEnabled(
  onStoreChange: () => void,
): () => void {
  soundsListeners.add(onStoreChange);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStoreChange);
  }
  return () => {
    soundsListeners.delete(onStoreChange);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStoreChange);
    }
  };
}

export function getPlayfulSoundsEnabledSnapshot(): boolean {
  return readPlayfulSoundsEnabled();
}

export function getPlayfulSoundsEnabledServerSnapshot(): boolean {
  return SOUNDS_DEFAULT_ENABLED;
}

function notifySoundsListeners() {
  for (const listener of soundsListeners) listener();
}

export function writePlayfulSoundsEnabled(
  enabled: boolean,
  storage: StorageLike | null = defaultStorage(),
): void {
  if (storage) {
    try {
      storage.setItem(SOUNDS_STORAGE_KEY, enabled ? "1" : "0");
    } catch {
      // Private mode / quota — keep the in-memory toggle only.
    }
  }
  notifySoundsListeners();
}

export function shouldPlayPlayfulSound(args: {
  flagOn: boolean;
  settingsOn: boolean;
  src: string | null | undefined;
}): boolean {
  return Boolean(args.flagOn && args.settingsOn && args.src);
}

/** Adult-triggered only. Never call from page load / useEffect. */
export function playPlayfulClip(src: string): void {
  if (
    !shouldPlayPlayfulSound({
      flagOn: isPlayfulSoundsPreviewEnabled(),
      settingsOn: readPlayfulSoundsEnabled(),
      src,
    })
  ) {
    return;
  }
  playSharedAudio(src);
}
