import { statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import {
  PLAYFUL_SOUND_BY_ACTIVITY,
  PLAYFUL_SOUND_CLIPS,
  SOUNDS_DEFAULT_ENABLED,
  SOUNDS_STORAGE_KEY,
  SOUNDS_TOGGLE_LABEL,
  isPlayfulSoundsPreviewEnabled,
  playfulSoundForActivity,
  playfulSoundPlayable,
  readPlayfulSoundsEnabled,
  shouldPlayPlayfulSound,
  writePlayfulSoundsEnabled,
} from "./playful-sounds";

class MemoryStorage {
  private data = new Map<string, string>();
  getItem(key: string) {
    return this.data.has(key) ? (this.data.get(key) as string) : null;
  }
  setItem(key: string, value: string) {
    this.data.set(key, value);
  }
}

describe("PLAYFUL sounds preview flag", () => {
  test("is off unless env is an explicit on value", () => {
    expect(isPlayfulSoundsPreviewEnabled(undefined)).toBe(false);
    expect(isPlayfulSoundsPreviewEnabled("")).toBe(false);
    expect(isPlayfulSoundsPreviewEnabled("0")).toBe(false);
    expect(isPlayfulSoundsPreviewEnabled("false")).toBe(false);
    expect(isPlayfulSoundsPreviewEnabled("1")).toBe(true);
    expect(isPlayfulSoundsPreviewEnabled("true")).toBe(true);
    expect(isPlayfulSoundsPreviewEnabled("ON")).toBe(true);
  });

  test("build-time env defaults off in tests", () => {
    expect(isPlayfulSoundsPreviewEnabled()).toBe(false);
  });
});

describe("PLAYFUL sounds mapping (S3 V–D)", () => {
  test("maps wind / steps / house / silent and ignores S4", () => {
    expect(playfulSoundForActivity("s3-2-3-z5-mental")?.kind).toBe("house");
    expect(playfulSoundForActivity("s3-2-3-z6-fizic")?.kind).toBe("steps");
    expect(playfulSoundForActivity("s3-2-3-z6-mental")?.kind).toBe("wind");
    expect(playfulSoundForActivity("s3-2-3-z6-resurse")?.kind).toBe("silent");
    expect(playfulSoundForActivity("s3-2-3-z6-resurse")?.src).toBeNull();
    expect(playfulSoundPlayable("s3-2-3-z6-resurse")).toBeNull();
    expect(playfulSoundPlayable("s3-2-3-z6-mental")?.src).toBe(
      "/sounds/playful-wind.wav",
    );
    expect(playfulSoundForActivity("s3-2-3-z5-fizic")).toBeNull();
    expect(playfulSoundForActivity("s4-2-3-z1-fizic")).toBeNull();
    expect(Object.keys(PLAYFUL_SOUND_BY_ACTIVITY)).toHaveLength(4);
  });

  test("play requires flag + settings + clip src", () => {
    expect(
      shouldPlayPlayfulSound({
        flagOn: true,
        settingsOn: true,
        src: PLAYFUL_SOUND_CLIPS.wind.src,
      }),
    ).toBe(true);
    expect(
      shouldPlayPlayfulSound({
        flagOn: false,
        settingsOn: true,
        src: PLAYFUL_SOUND_CLIPS.wind.src,
      }),
    ).toBe(false);
    expect(
      shouldPlayPlayfulSound({
        flagOn: true,
        settingsOn: false,
        src: PLAYFUL_SOUND_CLIPS.wind.src,
      }),
    ).toBe(false);
    expect(
      shouldPlayPlayfulSound({
        flagOn: true,
        settingsOn: true,
        src: null,
      }),
    ).toBe(false);
  });
});

describe("PLAYFUL sounds settings", () => {
  test("default is off and persists in storage", () => {
    expect(SOUNDS_DEFAULT_ENABLED).toBe(false);
    expect(SOUNDS_TOGGLE_LABEL).toBe("Sunete de previzualizare (S3)");
    expect(readPlayfulSoundsEnabled(null)).toBe(false);
    const storage = new MemoryStorage();
    expect(readPlayfulSoundsEnabled(storage)).toBe(false);
    writePlayfulSoundsEnabled(true, storage);
    expect(storage.getItem(SOUNDS_STORAGE_KEY)).toBe("1");
    expect(readPlayfulSoundsEnabled(storage)).toBe(true);
    writePlayfulSoundsEnabled(false, storage);
    expect(readPlayfulSoundsEnabled(storage)).toBe(false);
  });
});

describe("PLAYFUL sounds clips", () => {
  test("CC0 preview wavs stay in the 0.5–1.5MB envelope together", () => {
    const files = [
      "playful-wind.wav",
      "playful-steps.wav",
      "playful-house.wav",
    ];
    let total = 0;
    for (const name of files) {
      const size = statSync(resolve("public/sounds", name)).size;
      expect(size).toBeGreaterThan(20_000);
      total += size;
    }
    expect(total).toBeGreaterThanOrEqual(500_000);
    expect(total).toBeLessThan(1.5 * 1024 * 1024);
  });
});
