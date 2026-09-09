import type { SupabaseClient } from "@supabase/supabase-js";
import { renderArchiveReadyEmail } from "@/lib/archive-email";
import { pdfDownloadFilename } from "@/lib/archive-pdf";
import {
  digestCcAddress,
  testPeriodKey,
  type DigestKind,
} from "@/lib/monday-digest";
import { bucharestToday, type DateInput } from "@/lib/program-week";
import { composeArchiveMail } from "@/lib/mail/compose-archive-mail";
import {
  buildFamilyArchivePdf,
  hydrateMissingArchiveDays,
  loadArchiveDaysInPeriod,
  type ArchiveChildRow,
} from "@/lib/mail/archive-booklet-server";
import type { MailSender } from "@/lib/mail/resend";
import { getWeekTheme } from "@/lib/week";
import { closedWeekContext } from "@/lib/monday-digest";

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
  cc?: string | null;
  error?: string;
};

export type DigestRunResult = {
  asOf: string;
  dryRun: boolean;
  outcomes: DigestFamilyOutcome[];
  preview?: {
    to: string;
    cc?: string | null;
    subject: string;
    text: string;
    html: string;
  };
};

type FamilyRow = {
  id: string;
  parent_id: string;
  program_year_start?: string | null;
  joined_at?: string | null;
  created_at?: string | null;
  monday_digest_email?: boolean | null;
  second_parent_email?: string | null;
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
      "id, parent_id, program_year_start, joined_at, created_at, monday_digest_email, second_parent_email",
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
    .select("id, name, family_id, age_band")
    .eq("active", true)
    .in("family_id", familyIds);
  if (childError) throw new Error(childError.message);

  const childrenByFamily = new Map<string, ArchiveChildRow[]>();
  for (const row of (childRows ?? []) as ArchiveChildRow[]) {
    const list = childrenByFamily.get(row.family_id) ?? [];
    list.push(row);
    childrenByFamily.set(row.family_id, list);
  }

  for (const family of families) {
    const kids = childrenByFamily.get(family.id) ?? [];
    const composed = composeArchiveMail({
      now: opts.now,
      family,
      days: [],
      kindOverride: opts.kindOverride,
      ignoreToggle: Boolean(opts.testSend),
    });

    if (composed.status === "skipped-toggle") {
      outcomes.push({ familyId: family.id, status: "skipped-toggle" });
      continue;
    }

    const period = composed.period;
    try {
      await hydrateMissingArchiveDays({
        supabase: opts.supabase,
        children: kids,
        period,
        family,
      });
    } catch (err) {
      outcomes.push({
        familyId: family.id,
        status: "error",
        periodKey: period.periodKey,
        kind: period.kind,
        error: err instanceof Error ? err.message : "Nu am putut pregăti arhiva.",
      });
      continue;
    }

    const days = await loadArchiveDaysInPeriod(
      opts.supabase,
      kids.map((child) => child.id),
      period,
    );
    const ready = composeArchiveMail({
      now: opts.now,
      family,
      days,
      kindOverride: opts.kindOverride,
      ignoreToggle: Boolean(opts.testSend),
    });

    if (ready.status === "skipped-toggle") {
      outcomes.push({ familyId: family.id, status: "skipped-toggle" });
      continue;
    }
    if (ready.status === "skipped-empty") {
      outcomes.push({
        familyId: family.id,
        status: "skipped-empty",
        periodKey: ready.period.periodKey,
        kind: ready.period.kind,
      });
      continue;
    }

    const theme =
      ready.period.kind === "weekly"
        ? getWeekTheme(closedWeekContext(opts.now, family).week)
        : undefined;
    const email = renderArchiveReadyEmail({ period: ready.period, theme });

    const to = opts.toOverride ?? (await parentEmail(opts.supabase, family.parent_id));
    if (!to) {
      outcomes.push({
        familyId: family.id,
        status: "skipped-no-email",
        periodKey: ready.period.periodKey,
        kind: ready.period.kind,
      });
      continue;
    }

    const cc = digestCcAddress(family.second_parent_email, to);
    preview = {
      to,
      cc,
      subject: email.subject,
      text: email.text,
      html: email.html,
    };

    if (opts.dryRun) {
      outcomes.push({
        familyId: family.id,
        status: "dry-run",
        periodKey: ready.period.periodKey,
        kind: ready.period.kind,
        subject: email.subject,
        to,
        cc,
      });
      continue;
    }

    if (!opts.sender) {
      outcomes.push({
        familyId: family.id,
        status: "error",
        periodKey: ready.period.periodKey,
        kind: ready.period.kind,
        error: "RESEND_API_KEY lipsește.",
      });
      continue;
    }

    const periodKey = opts.testSend ? testPeriodKey() : ready.period.periodKey;
    try {
      const claim = await claimSend(
        opts.supabase,
        family.id,
        periodKey,
        ready.period.kind,
      );
      if (claim === "already") {
        outcomes.push({
          familyId: family.id,
          status: "skipped-already",
          periodKey,
          kind: ready.period.kind,
        });
        continue;
      }
      try {
        const pdf = await buildFamilyArchivePdf({
          supabase: opts.supabase,
          period: ready.period,
          children: kids,
          days,
        });
        await opts.sender.send({
          to,
          cc,
          subject: email.subject,
          html: email.html,
          text: email.text,
          attachments: [
            {
              filename: pdfDownloadFilename(ready.period),
              content: pdf,
              contentType: "application/pdf",
            },
          ],
        });
        outcomes.push({
          familyId: family.id,
          status: "sent",
          periodKey,
          kind: ready.period.kind,
          subject: email.subject,
          to,
          cc,
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
        kind: ready.period.kind,
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
