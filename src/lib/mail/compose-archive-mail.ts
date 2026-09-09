import {
  closedMonthPeriod,
  closedWeekPeriod,
  closedYearPeriod,
  shouldSkipArchivePeriod,
  type ArchivePeriod,
} from "@/lib/archive";
import {
  familyWantsMondayDigest,
  selectDigestKind,
  type DigestKind,
} from "@/lib/monday-digest";
import type { DateInput } from "@/lib/program-week";

export type ArchiveMailDay = {
  child_id: string;
  civil_date: string;
  age_band_label: string;
  day_note: string;
  done_titles: string[];
  photo_path: string | null;
};

export type ComposeArchiveFamily = {
  id: string;
  program_year_start?: string | null;
  joined_at?: string | null;
  created_at?: string | null;
  monday_digest_email?: boolean | null;
  second_parent_email?: string | null;
};

export type ComposeArchiveResult =
  | { status: "skipped-toggle" }
  | { status: "skipped-empty"; period: ArchivePeriod }
  | { status: "ready"; period: ArchivePeriod };

export function selectArchiveMailPeriod(
  now: DateInput,
  family: ComposeArchiveFamily | null,
  kindOverride?: DigestKind | null,
): ArchivePeriod {
  const kind = kindOverride ?? selectDigestKind(now);
  if (kind === "yearly") return closedYearPeriod(now);
  if (kind === "monthly") return closedMonthPeriod(now);
  return closedWeekPeriod(now, family);
}

export function composeArchiveMail(args: {
  now: DateInput;
  family: ComposeArchiveFamily;
  days: readonly ArchiveMailDay[];
  kindOverride?: DigestKind | null;
  ignoreToggle?: boolean;
}): ComposeArchiveResult {
  if (!args.ignoreToggle && !familyWantsMondayDigest(args.family)) {
    return { status: "skipped-toggle" };
  }
  const period = selectArchiveMailPeriod(args.now, args.family, args.kindOverride);
  const inPeriod = args.days.filter(
    (day) => day.civil_date >= period.start && day.civil_date <= period.end,
  );
  if (shouldSkipArchivePeriod(inPeriod)) {
    return { status: "skipped-empty", period };
  }
  return { status: "ready", period };
}
