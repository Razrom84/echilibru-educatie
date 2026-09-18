import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import {
  CHIME_DEFAULT_ENABLED,
  CHIME_SRC,
  CHIME_STORAGE_KEY,
  CHIME_TOGGLE_LABEL,
  isCompletingLastActivity,
  readChimeEnabled,
  shouldPlayDoneChime,
  writeChimeEnabled,
} from "./playful-chime";

class MemoryStorage {
  private data = new Map<string, string>();
  getItem(key: string) {
    return this.data.has(key) ? (this.data.get(key) as string) : null;
  }
  setItem(key: string, value: string) {
    this.data.set(key, value);
  }
}

describe("Sunet scurt la gata", () => {
  test("default is off", () => {
    expect(CHIME_DEFAULT_ENABLED).toBe(false);
    expect(CHIME_TOGGLE_LABEL).toBe("Sunet scurt la gata");
    expect(readChimeEnabled(null)).toBe(false);
    expect(readChimeEnabled(new MemoryStorage())).toBe(false);
  });

  test("persists on/off in storage", () => {
    const storage = new MemoryStorage();
    writeChimeEnabled(true, storage);
    expect(storage.getItem(CHIME_STORAGE_KEY)).toBe("1");
    expect(readChimeEnabled(storage)).toBe(true);
    writeChimeEnabled(false, storage);
    expect(readChimeEnabled(storage)).toBe(false);
  });

  test("plays only when enabled, overlay, and last pillar just completed", () => {
    expect(
      shouldPlayDoneChime({
        enabled: true,
        hasOverlay: true,
        completingLast: true,
      }),
    ).toBe(true);
    expect(
      shouldPlayDoneChime({
        enabled: false,
        hasOverlay: true,
        completingLast: true,
      }),
    ).toBe(false);
    expect(
      shouldPlayDoneChime({
        enabled: true,
        hasOverlay: false,
        completingLast: true,
      }),
    ).toBe(false);
    expect(
      shouldPlayDoneChime({
        enabled: true,
        hasOverlay: true,
        completingLast: false,
      }),
    ).toBe(false);
  });

  test("last-pillar helper ignores un-complete and extra ids", () => {
    const ids = ["a", "b", "c", "d"];
    expect(
      isCompletingLastActivity({
        activityIds: ids,
        completedIds: ["a", "b", "c"],
        toggledId: "d",
        wasAlreadyDone: false,
      }),
    ).toBe(true);
    expect(
      isCompletingLastActivity({
        activityIds: ids,
        completedIds: ["a", "b", "c", "d"],
        toggledId: "d",
        wasAlreadyDone: true,
      }),
    ).toBe(false);
    expect(
      isCompletingLastActivity({
        activityIds: ids,
        completedIds: ["a"],
        toggledId: "b",
        wasAlreadyDone: false,
      }),
    ).toBe(false);
  });

  test("keeps gata chime and does not ship playful clip wavs", () => {
    expect(CHIME_SRC).toBe("/sounds/gata-chime.wav");
    expect(existsSync(resolve("public/sounds/gata-chime.wav"))).toBe(true);
    expect(existsSync(resolve("public/sounds/playful-wind.wav"))).toBe(false);
    expect(existsSync(resolve("public/sounds/playful-steps.wav"))).toBe(false);
    expect(existsSync(resolve("public/sounds/playful-house.wav"))).toBe(false);
  });
});
