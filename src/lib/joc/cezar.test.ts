import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { JOC_MIN_SCENE_MS } from "./rules";
import {
  CEZAR_ANIMATIONS,
  CEZAR_ANIMATION_CLASS,
  CEZAR_ANIMATION_MS,
  cezarAnimationForScene,
} from "./cezar";

describe("cezar slow motions", () => {
  test("the shared set is walk, jump, clap, point, bend, grab, and the three zooms", () => {
    expect(CEZAR_ANIMATIONS).toEqual([
      "mers",
      "sarit",
      "palme",
      "aratat",
      "aplecat",
      "apucat",
      "zoom-maini",
      "zoom-picioare",
      "zoom-cap",
    ]);
    expect(new Set(CEZAR_ANIMATIONS).size).toBe(CEZAR_ANIMATIONS.length);
    for (const pose of CEZAR_ANIMATIONS) {
      expect(CEZAR_ANIMATION_CLASS[pose]).toBe(`joc-cezar-${pose}`);
    }
  });

  test("a pose follows the day and the scene, and a week shows every pose", () => {
    expect(cezarAnimationForScene(1, 0)).toBe("mers");
    expect(cezarAnimationForScene(1, 4)).toBe("aplecat");
    expect(cezarAnimationForScene(4, 0)).toBe("aratat");
    expect(cezarAnimationForScene(1, 0)).toBe(cezarAnimationForScene(1, 0));
    expect(cezarAnimationForScene(0, -1)).toBe("mers");
    expect(cezarAnimationForScene(1.5, 2.2)).toBe("mers");

    const seen = new Set<string>();
    for (let day = 1; day <= 7; day += 1) {
      for (let scene = 0; scene < 5; scene += 1) {
        seen.add(cezarAnimationForScene(day, scene));
      }
    }
    expect([...seen].sort()).toEqual([...CEZAR_ANIMATIONS].sort());
  });

  test("each pose is one slow pass and finishes inside the scene hold", () => {
    expect(CEZAR_ANIMATION_MS).toBeGreaterThanOrEqual(2_000);
    expect(CEZAR_ANIMATION_MS).toBeLessThanOrEqual(JOC_MIN_SCENE_MS);

    const css = readFileSync(resolve("src/app/globals.css"), "utf8");
    const start = css.indexOf("/* cezar-motions");
    const end = css.indexOf("/* /cezar-motions */");
    expect(start).toBeGreaterThan(-1);
    expect(end).toBeGreaterThan(start);
    const block = css.slice(start, end);

    expect(block).toContain("animation-iteration-count: 1");
    expect(block).not.toMatch(/infinite/);
    expect(block).not.toMatch(/steps\(/);
    expect(block).not.toMatch(/opacity/);

    for (const pose of CEZAR_ANIMATIONS) {
      expect(block).toContain(`.joc-cezar-${pose}`);
    }

    for (const match of block.matchAll(/(\d+(?:\.\d+)?)(ms|s)\b/g)) {
      const value = Number(match[1]);
      const ms = match[2] === "s" ? value * 1000 : value;
      expect(ms).toBeGreaterThanOrEqual(2_000);
    }

    const reduced = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)"));
    expect(reduced).toContain(".joc-cezar .cezar-part");
    expect(reduced).toMatch(/animation:\s*none/);
  });
});
