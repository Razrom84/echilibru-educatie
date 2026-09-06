import type { SupabaseClient } from "@supabase/supabase-js";
import { renderDigestEmail } from "@/lib/monday-digest-email";
import {
  digestSelection,
  testPeriodKey,
  type DigestKind,
} from "@/lib/monday-digest";
import { bucharestToday, type DateInput } from "@/lib/program-week";
import {
  composeMondayDigest,
  type ComposeFamily,
  type DigestChild,
  type DigestCompletion,
  type DigestDayNote,
} from "@/lib/mail/compose-monday-digest";
import type { MailSender } from "@/lib/mail/resend";

export type DigestRunOptions = {
  now: DateInput;
  dryRun: boolean;
  familyId?: string;
  kindOverride?: DigestKind | null;
  /** QA / settings: send even if already logged; store under a test period key. */
  testSend?: boolean;
  sender?: MailSender | null;
  supabase: SupabaseClient;
  /** When set, only this recipient is used (settings test). */
  toOverride?: string;
};

export type DigestFamilyOutcome = {
  familyId: string;
  status:
    | "sent"
    | "dry-run"
    | "skipped-toggle"
    | "skipped-empty"
    | "skipped-no-email"
    | "skipped-already"
    | "error";
  periodKey?: string;
  kind?: DigestKind;
  subject?: string;
  to?: string;
  error?: string;
};

export type DigestRunResult = {
  asOf: string;
  dryRun: boolean;
  outcomes: DigestFamilyOutcome[];
  preview?: { to: string; subject: string; text: string; html: string };
};

type FamilyRow = ComposeFamily & {
  parent_id: string;
};

async function parentEmail(
  supabase: SupabaseClient,
  parentId: string,
): Promise<string | null> {
  const { data, error } = await supabase.auth.admin.getUserById(parentId);
  if (error || !data.user?.email) return null;
  return data.user.email;
}

async function claimSend(
  supabase: SupabaseClient,
  familyId: string,
  periodKey: string,
  kind: DigestKind,
): Promise<"ok" | "already"> {
  const { error } = await supabase.from("mail_digest_sends").insert({
    family_id: familyId,
    period_key: periodKey,
    kind,
  });
  if (!error) return "ok";
  if (error.code === "23505") return "already";
  throw new Error(error.message);
}

async function releaseClaim(
  supabase: SupabaseClient,
  familyId: string,
  periodKey: string,
): Promise<void> {
  await supabase
    .from("mail_digest_sends")
    .delete()
    .eq("family_id", familyId)
    .eq("period_key", periodKey);
}

export async function runMondayDigest(
  opts: DigestRunOptions,
): Promise<DigestRunResult> {
  const asOf = typeof opts.now === "string" ? opts.now : bucharestToday(opts.now);

  let familyQuery = opts.supabase
    .from("families")
    .select(
      "id, parent_id, program_year_start, joined_at, created_at, monday_digest_email",
    );
  if (opts.familyId) familyQuery = familyQuery.eq("id", opts.familyId);
  const { data: familyRows, error: familyError } = await familyQuery;
  if (familyError) {
    throw new Error(familyError.message);
  }

  const families = (familyRows ?? []) as FamilyRow[];
  const outcomes: DigestFamilyOutcome[] = [];
  let preview: DigestRunResult["preview"];

  if (families.length === 0) {
    return { asOf, dryRun: opts.dryRun, outcomes };
  }

  const familyIds = families.map((row) => row.id);
  const { data: childRows, error: childError } = await opts.supabase
    .from("children")
    .select("id, name, family_id")
    .eq("active", true)
    .in("family_id", familyIds);
  if (childError) throw new Error(childError.message);

  const childrenByFamily = new Map<string, DigestChild[]>();
  for (const row of childRows ?? []) {
    const list = childrenByFamily.get(row.family_id) ?? [];
    list.push({ id: row.id, name: row.name });
    childrenByFamily.set(row.family_id, list);
  }

  const childIds = (childRows ?? []).map((row) => row.id);
  let completions: DigestCompletion[] = [];
  let notes: (DigestDayNote & {
    program_year_start?: string;
    family_id?: string;
    child_id: string;
  })[] = [];

  if (childIds.length > 0) {
    const [{ data: doneRows, error: doneError }, { data: noteRows, error: noteError }] =
      await Promise.all([
        opts.supabase
          .from("completions")
          .select("child_id, activity_id")
          .in("child_id", childIds),
        opts.supabase
          .from("day_notes")
          .select("child_id, week_number, day_of_week, body, program_year_start")
          .in("child_id", childIds),
      ]);
    if (doneError) throw new Error(doneError.message);
    if (noteError) throw new Error(noteError.message);
    completions = (doneRows ?? []) as DigestCompletion[];
    notes = (noteRows ?? []) as typeof notes;
  }

  const childFamily = new Map(
    (childRows ?? []).map((row) => [row.id, row.family_id as string]),
  );

  for (const family of families) {
    const kids = childrenByFamily.get(family.id) ?? [];
    const selected = digestSelection(opts.now, family, opts.kindOverride);
    const yearStart =
      selected.kind === "weekly"
        ? selected.closed.programYearStart
        : family.program_year_start;
    const familyCompletions = completions.filter(
      (row) => childFamily.get(row.child_id) === family.id,
    );
    const familyNotes = notes.filter((row) => {
      if (childFamily.get(row.child_id) !== family.id) return false;
      if (yearStart && row.program_year_start && row.program_year_start !== yearStart) {
        return false;
      }
      return true;
    });

    const composed = composeMondayDigest({
      now: opts.now,
      family,
      children: kids,
      completions: familyCompletions,
      notes: familyNotes,
      kindOverride: opts.kindOverride,
      ignoreToggle: Boolean(opts.testSend),
    });

    if (composed.status === "skipped-toggle") {
      outcomes.push({ familyId: family.id, status: "skipped-toggle" });
      continue;
    }

    const model = composed.model;
    if (composed.status === "skipped-empty") {
      outcomes.push({
        familyId: family.id,
        status: "skipped-empty",
        periodKey: model.periodKey,
        kind: model.kind,
        subject: model.subject,
      });
      continue;
    }

    const to = opts.toOverride ?? (await parentEmail(opts.supabase, family.parent_id));
    if (!to) {
      outcomes.push({
        familyId: family.id,
        status: "skipped-no-email",
        periodKey: model.periodKey,
        kind: model.kind,
      });
      continue;
    }

    const email = renderDigestEmail(model);
    preview = { to, subject: email.subject, text: email.text, html: email.html };

    if (opts.dryRun) {
      outcomes.push({
        familyId: family.id,
        status: "dry-run",
        periodKey: model.periodKey,
        kind: model.kind,
        subject: email.subject,
        to,
      });
      continue;
    }

    if (!opts.sender) {
      outcomes.push({
        familyId: family.id,
        status: "error",
        periodKey: model.periodKey,
        kind: model.kind,
        error: "RESEND_API_KEY lipsește.",
      });
      continue;
    }

    const periodKey = opts.testSend ? testPeriodKey() : model.periodKey;
    try {
      const claim = await claimSend(opts.supabase, family.id, periodKey, model.kind);
      if (claim === "already") {
        outcomes.push({
          familyId: family.id,
          status: "skipped-already",
          periodKey,
          kind: model.kind,
        });
        continue;
      }
      try {
        await opts.sender.send({
          to,
          subject: email.subject,
          html: email.html,
          text: email.text,
        });
        outcomes.push({
          familyId: family.id,
          status: "sent",
          periodKey,
          kind: model.kind,
          subject: email.subject,
          to,
        });
      } catch (err) {
        await releaseClaim(opts.supabase, family.id, periodKey);
        throw err;
      }
    } catch (err) {
      outcomes.push({
        familyId: family.id,
        status: "error",
        periodKey,
        kind: model.kind,
        error: err instanceof Error ? err.message : "Trimiterea a eșuat.",
      });
    }
  }

  return { asOf, dryRun: opts.dryRun, outcomes, preview };
}

export function summarizeRun(result: DigestRunResult) {
  const counts = {
    sent: 0,
    previewed: 0,
    skipped: 0,
    errors: 0,
  };
  for (const row of result.outcomes) {
    if (row.status === "sent") counts.sent += 1;
    else if (row.status === "dry-run") counts.previewed += 1;
    else if (row.status === "error") counts.errors += 1;
    else counts.skipped += 1;
  }
  return { ...counts, families: result.outcomes.length };
}

