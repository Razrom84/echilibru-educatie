import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { JOC_COPY } from "./copy";
import { jocWeekLevels } from "./day-levels";
import {
  MOSTRA_ACTION_MS,
  MOSTRA_ACTIONS,
  MOSTRA_ANGLE_JOINTS,
  MOSTRA_FADE_HOLD_MS,
  MOSTRA_FADE_IN_MS,
  MOSTRA_FADE_OUT_MS,
  MOSTRA_GRAB_CONTACT,
  MOSTRA_SCENE_ID,
  gripWorld,
  mostraClips,
  mostraContactPose,
  mostraDay,
  mostraFadeBeats,
  mostraToyRest,
  type MostraPose,
} from "./mostra";

function samePose(a: MostraPose, b: MostraPose) {
  for (const key of Object.keys(a) as (keyof MostraPose)[]) {
    expect(a[key], key).toBeCloseTo(b[key], 2);
  }
}

describe("mostra sample", () => {
  test("today's first object scene is the toy Cezar picks up", () => {
    const day = mostraDay();
    expect(day.week).toBe(7);
    expect(day.day).toBe(4);
    const level = jocWeekLevels(day.week)?.levels.find((item) => item.day === day.day);
    expect(level?.scenes[0]?.id).toBe(MOSTRA_SCENE_ID);
    expect(level?.scenes[0]?.id).toBe("s7-2-3-z4-fizic");
    expect(level?.scenes[0]?.object).toBe("toy");
    expect(level?.scenes[0]?.prompt).toBe(JOC_COPY.samplePrompt);
  });

  test("each action lasts 3–4s and plays twice, in order", () => {
    expect(MOSTRA_ACTION_MS).toBeGreaterThanOrEqual(3_000);
    expect(MOSTRA_ACTION_MS).toBeLessThanOrEqual(4_000);
    const clips = mostraClips();
    expect(clips.map((clip) => clip.action)).toEqual([
      "mers",
      "mers",
      "aplecat",
      "aplecat",
      "apucat",
      "apucat",
      "aratat",
      "aratat",
    ]);
    expect(MOSTRA_ACTIONS).toEqual(["mers", "aplecat", "apucat", "aratat"]);
    for (const clip of clips) {
      expect(clip.poses.length).toBeGreaterThanOrEqual(8);
      expect(clip.poses.length).toBeLessThanOrEqual(12);
      expect(clip.offsets).toHaveLength(clip.poses.length);
      expect(clip.offsets[0]).toBe(0);
      expect(clip.offsets.at(-1)).toBe(1);
      for (let i = 1; i < clip.offsets.length; i += 1) {
        expect(clip.offsets[i]).toBeGreaterThan(clip.offsets[i - 1] ?? 0);
      }
    }
  });

  test("the walk keeps moving forward and the next pose does not pop", () => {
    const clips = mostraClips();
    const walked = clips.filter((clip) => clip.action === "mers");
    for (const clip of walked) {
      for (let i = 1; i < clip.poses.length; i += 1) {
        expect(clip.poses[i]?.x).toBeGreaterThan(clip.poses[i - 1]?.x ?? 0);
      }
    }
    expect(walked[1]?.poses[0]?.x).toBe(walked[0]?.poses.at(-1)?.x);
    expect(walked[1]?.poses.at(-1)?.x ?? 0).toBeGreaterThan(walked[0]?.poses[0]?.x ?? 0);
    expect((walked[1]?.poses.at(-1)?.x ?? 0) - (walked[0]?.poses[0]?.x ?? 0)).toBeGreaterThan(300);
    const steps = walked.flatMap((clip) => clip.poses);
    const legs = steps.map((pose) => pose.legNear);
    const arms = steps.map((pose) => pose.armNear);
    expect(Math.max(...legs) - Math.min(...legs)).toBeGreaterThan(30);
    expect(Math.max(...arms) - Math.min(...arms)).toBeGreaterThan(30);

    for (let i = 1; i < clips.length; i += 1) {
      const previous = clips[i - 1]?.poses.at(-1);
      const next = clips[i]?.poses[0];
      expect(previous).toBeTruthy();
      expect(next).toBeTruthy();
      if (previous && next) samePose(previous, next);
    }
  });

  test("the hand meets the toy on the ground in front, then the show lifts it", () => {
    const contact = mostraContactPose();
    const toy = mostraToyRest();
    expect(gripWorld(contact)).toEqual(toy);
    expect(toy.x).toBeGreaterThan(contact.x + 40);
    expect(toy.y).toBeGreaterThan(contact.y + 60);
    expect(toy.x).toBeLessThan(900);
    expect(toy.y).toBeLessThan(530);
    const clips = mostraClips();
    const grabs = clips.filter((clip) => clip.action === "apucat");
    expect(grabs[0]?.contact).toBe(MOSTRA_GRAB_CONTACT);
    expect(grabs[1]?.contact).toBeNull();
    const shown = clips.at(-1)?.poses.at(-1);
    expect(shown && shown.armNear).toBeLessThan(-120);
    expect(shown && shown.torso).toBeGreaterThan(-20);
    expect(shown && shown.torso).toBeLessThan(20);
  });

  test("reduced motion is a slow fade between still poses", () => {
    expect(MOSTRA_FADE_IN_MS).toBeGreaterThanOrEqual(700);
    expect(MOSTRA_FADE_HOLD_MS).toBeGreaterThanOrEqual(700);
    expect(MOSTRA_FADE_OUT_MS).toBeGreaterThanOrEqual(700);
    const beats = mostraFadeBeats();
    expect(beats).toHaveLength(4);
    const clips = mostraClips();
    samePose(beats[0] as MostraPose, clips[1]?.poses.at(-1) as MostraPose);
    samePose(beats[1] as MostraPose, clips[3]?.poses.at(-1) as MostraPose);
    samePose(beats[2] as MostraPose, clips[5]?.poses.at(-1) as MostraPose);
    samePose(beats[3] as MostraPose, clips[7]?.poses.at(-1) as MostraPose);
    expect((beats[1]?.torso ?? 0) - (beats[0]?.torso ?? 0)).toBeGreaterThan(40);
    expect(beats[3]?.armNear).toBeLessThan(-120);
  });

  test("the rig is an articulated pencil drawing without glasses", () => {
    const view = readFileSync(resolve(process.cwd(), "src/components/joc/cezar-mostra.tsx"), "utf8");
    const css = readFileSync(resolve(process.cwd(), "src/app/globals.css"), "utf8");
    expect(view).toContain("feTurbulence");
    expect(view).toContain("feDisplacementMap");
    expect(view).not.toMatch(/ochelari|glasses/i);
    for (const joint of MOSTRA_ANGLE_JOINTS) {
      expect(view).toContain(`name="${joint}"`);
    }
    expect(view).toContain('data-joint="root"');
    expect(view).toContain("ease-in-out");
    expect(view).not.toContain("Infinity");
    const joint = css.slice(css.indexOf(".mostra-joint"));
    expect(joint).toContain("transform-box: view-box");
    expect(joint).toContain("transform-origin: 0px 0px");
  });
});
