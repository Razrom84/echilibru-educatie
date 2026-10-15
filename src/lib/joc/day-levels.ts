/**
 * v0.1: one level per day, built only from the viewed week's band 1–2 seed.
 * The character is the week's playful character. Seed files are read, never written.
 */

import type { Activity } from "@/lib/types";
import { playfulPilotWeek } from "@/lib/playful-pilot";
import { getSeedActivities } from "@/lib/seed/week1";
import { getDayName } from "@/lib/week";
import type { JocLevel, JocMotion, JocObjectKind, JocScene } from "@/lib/joc/levels";

export const JOC_SCENE_MIN = 3;
export const JOC_SCENE_MAX = 5;

export type JocActivitySource = {
  id: string;
  zi: number;
  titlu: string;
  pasi: readonly string[];
  gata_cand: string;
  materiale?: readonly string[];
  pilon?: string;
};

export type JocWeekPlay = {
  week: number;
  characterName: string;
  characterSrc: string;
  theme: string;
  levels: JocLevel[];
};

const PILLAR_RANK: Record<string, number> = {
  fizic: 0,
  mental: 1,
  resurse: 2,
  social: 3,
};

const OBJECT_RULES: readonly { kind: JocObjectKind; label: string; pattern: RegExp }[] = [
  { kind: "balloon", label: "Balon", pattern: /balon/ },
  { kind: "shoe", label: "Papuc", pattern: /papuc|pantof/ },
  { kind: "door", label: "Ușă", pattern: /\busa\b|clanta|\bprag\b/ },
  { kind: "bucket", label: "Găleată", pattern: /galeat|lopat|pamant|nisip/ },
  { kind: "palm", label: "Palmă", pattern: /\b(palma|palme|maini|mana|bate)\b/ },
  { kind: "cow", label: "Vacă", pattern: /\bvaca\b|\bmu\b/ },
  { kind: "leaf", label: "Frunză", pattern: /frunz/ },
  { kind: "toy", label: "Jucărie", pattern: /jucarie|\bminge\b/ },
];

const STONE_MOTIONS: readonly JocMotion[] = ["hold", "sway", "nod", "rise", "down"];

function fold(text: string): string {
  return text.toLocaleLowerCase("ro-RO").normalize("NFD").replace(/\p{M}/gu, "");
}

function matchObject(text: string): { kind: JocObjectKind; label: string } | null {
  const folded = fold(text);
  for (const rule of OBJECT_RULES) {
    if (rule.pattern.test(folded)) return { kind: rule.kind, label: rule.label };
  }
  return null;
}

/** The line on screen wins, then the materials, then the rest of the activity. */
function objectFor(prompt: string, activity?: JocActivitySource): { kind: JocObjectKind; label: string } {
  const layers = [
    prompt,
    (activity?.materiale ?? []).join(" "),
    `${activity?.titlu ?? ""} ${(activity?.pasi ?? []).join(" ")}`,
  ];
  for (const layer of layers) {
    const match = matchObject(layer);
    if (match) return match;
  }
  return { kind: "stone", label: "Piatră" };
}

function motionFor(kind: JocObjectKind, index: number): JocMotion {
  if (kind === "balloon") return (["rise", "sway", "down", "hold"] as const)[index % 4] ?? "rise";
  if (kind === "bucket") return index % 4 === 3 ? "hold" : "scoop";
  if (kind === "palm") return "clap";
  if (kind === "cow") return index % 4 === 3 ? "hold" : "nod";
  if (kind === "leaf") return "sweep";
  return STONE_MOTIONS[index % STONE_MOTIONS.length] ?? "hold";
}

function clean(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function linesOf(activity: JocActivitySource): string[] {
  const lines = [activity.titlu, ...activity.pasi, activity.gata_cand].map(clean).filter(Boolean);
  return lines.length > 0 ? lines : ["Încet."];
}

function sceneFrom(
  activity: JocActivitySource,
  index: number,
  prompt: string,
  reaction: string,
  id: string,
): JocScene {
  const object = objectFor(prompt, activity);
  return {
    id,
    caption: clean(activity.titlu),
    prompt,
    reaction,
    motion: motionFor(object.kind, index),
    object: object.kind,
  };
}

function actionLines(activity: JocActivitySource): string[] {
  const steps = activity.pasi.map(clean).filter(Boolean);
  if (steps.length > 0) return steps;
  const title = clean(activity.titlu);
  return title ? [title] : ["Încet."];
}

export function scenesForDay(activities: readonly JocActivitySource[]): JocScene[] {
  if (activities.length === 0) return [];

  if (activities.length >= JOC_SCENE_MIN) {
    return activities.slice(0, JOC_SCENE_MAX).map((activity, index) => {
      const steps = actionLines(activity);
      const action = steps[0] ?? "Încet.";
      const reaction = steps[1] ?? action;
      return sceneFrom(activity, index, action, reaction, activity.id);
    });
  }

  const scenes: JocScene[] = [];
  for (const activity of activities) {
    const steps = activity.pasi.map(clean).filter(Boolean);
    const prompts = steps.length > 0 ? steps : [clean(activity.titlu) || "Încet."];
    for (const [stepIndex, line] of prompts.entries()) {
      if (scenes.length >= JOC_SCENE_MAX) break;
      const title = clean(activity.titlu);
      scenes.push(
        sceneFrom(
          activity,
          scenes.length,
          stepIndex === 0 && title ? title : line,
          line,
          `${activity.id}-${stepIndex}`,
        ),
      );
    }
  }

  const pool = activities.flatMap(linesOf);
  let extra = 0;
  while (scenes.length < JOC_SCENE_MIN && pool.length > 0) {
    const activity = activities[extra % activities.length] ?? activities[0];
    const line = pool[scenes.length % pool.length] ?? pool[0];
    if (!activity || !line) break;
    scenes.push(sceneFrom(activity, scenes.length, line, line, `${activity.id}-lent-${extra}`));
    extra += 1;
  }

  return scenes.slice(0, JOC_SCENE_MAX);
}

/** One or two concrete steps, short enough for the parent card. */
export function missionAction(activities: readonly JocActivitySource[]): string {
  const steps = activities.flatMap((activity) => activity.pasi.map(clean).filter(Boolean));
  const first = steps[0] ?? activities.map((activity) => clean(activity.titlu)).find(Boolean) ?? "";
  const second = steps[1];
  if (!second) return first;
  const both = `${first} ${second}`;
  if (both.length > 160) return first;
  return both;
}

function ritualLine(ritualClose: string, characterName: string): string {
  const line = clean(ritualClose);
  if (line) return line;
  return `${characterName}, gata.`;
}

function activitiesOnDay(
  activities: readonly JocActivitySource[],
  day: number,
): JocActivitySource[] {
  return activities
    .map((activity, index) => ({ activity, index }))
    .filter((item) => item.activity.zi === day)
    .sort((a, b) => {
      const rankA = PILLAR_RANK[a.activity.pilon ?? ""] ?? 9;
      const rankB = PILLAR_RANK[b.activity.pilon ?? ""] ?? 9;
      return rankA - rankB || a.index - b.index;
    })
    .map((item) => item.activity);
}

export function jocDayLevelId(week: number, day: number): string {
  return `s${week}-z${day}`;
}

export function buildDayLevels(input: {
  week: number;
  character: { name: string; src: string };
  ritualClose: string;
  activities: readonly JocActivitySource[];
}): JocLevel[] {
  const levels: JocLevel[] = [];
  for (let day = 1; day <= 7; day += 1) {
    const dayActivities = activitiesOnDay(input.activities, day);
    const scenes = scenesForDay(dayActivities);
    if (scenes.length < JOC_SCENE_MIN) continue;
    const first = dayActivities[0];
    const object = objectFor(scenes[0]?.prompt ?? "");
    levels.push({
      id: jocDayLevelId(input.week, day),
      day,
      name: getDayName(day),
      characterName: input.character.name,
      characterSrc: input.character.src,
      objectLabel: object.label,
      cardLine: first ? clean(first.titlu) : getDayName(day),
      missionParent: missionAction(dayActivities),
      ritual: ritualLine(input.ritualClose, input.character.name),
      activityIds: dayActivities.map((activity) => activity.id),
      scenes,
    });
  }
  return levels;
}

/** Current view week, always the cohort band 1–2 catalog. */
export function jocWeekLevels(week: number): JocWeekPlay | null {
  const pilot = playfulPilotWeek(week);
  if (!pilot) return null;
  const activities = getSeedActivities(week, "1-2");
  return {
    week,
    characterName: pilot.character.name,
    characterSrc: pilot.character.src,
    theme: pilot.theme,
    levels: buildDayLevels({
      week,
      character: pilot.character,
      ritualClose: pilot.ritualClose,
      activities: activities.map(activitySource),
    }),
  };
}

function activitySource(activity: Activity): JocActivitySource {
  return {
    id: activity.id,
    zi: activity.zi,
    titlu: activity.titlu,
    pasi: activity.pasi,
    gata_cand: activity.gata_cand,
    pilon: activity.pilon,
    materiale: activity.materiale,
  };
}

/** Only the Bucharest weekday opens. The other six stay on the list. */
export function isPlayableJocDay(day: number, todayDay: number): boolean {
  return day >= 1 && day <= 7 && day === todayDay;
}
