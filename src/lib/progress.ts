import type { CompletionMode, Pillar } from "@/lib/types";

/**
 * Columns Progres needs from the week already loaded for the child.
 * The page does not start a second catalog query.
 */
export const PROGRESS_ACTIVITY_COLUMNS =
  "id, banda, saptamana, zi, pilon, titlu, durata_min, mod_default, materiale, pasi, gata_cand, tema_saptamana, nota";

export const PROGRESS_COMPLETION_COLUMNS =
  "id, child_id, activity_id, completed_at, mode, parent_approved";

export function approvedActivitiesLabel(count: number): string {
  return count === 1 ? "1 aprobată" : `${count} aprobate`;
}

type ProgressActivity = {
  id: string;
  week_number: number;
  pillar: Pillar;
  day_of_week: number;
};

type ProgressCompletion = {
  activity_id: string;
  mode: CompletionMode;
  parent_approved: boolean | null;
};

export function weekProgress(args: {
  activities: readonly ProgressActivity[];
  completions: readonly ProgressCompletion[];
  week: number;
}) {
  const weekActs = args.activities.filter((activity) => activity.week_number === args.week);
  const weekIds = new Set(weekActs.map((activity) => activity.id));
  const weekCompletions = args.completions.filter((row) => weekIds.has(row.activity_id));
  const doneIds = new Set(weekCompletions.map((row) => row.activity_id));
  const approved = weekCompletions.filter(
    (row) => row.mode === "A" || row.parent_approved === true,
  ).length;
  const pending = weekCompletions.filter(
    (row) => row.mode === "B" && row.parent_approved === false,
  ).length;
  return {
    total: weekActs.length,
    done: doneIds.size,
    approved,
    pending,
    approvedLabel: approvedActivitiesLabel(approved),
  };
}
