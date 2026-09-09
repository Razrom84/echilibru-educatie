import { NextResponse } from "next/server";
import {
  authorizeCronRequest,
  parseAsOf,
  parseDryRun,
} from "@/lib/mail/cron-auth";
import { createResendSender } from "@/lib/mail/resend";
import { runMondayDigest, summarizeRun } from "@/lib/mail/run-monday-digest";
import { createServiceSupabase } from "@/lib/supabase/admin";
import { isJanuarySecond } from "@/lib/monday-digest";
import { bucharestToday } from "@/lib/program-week";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function parseFamilyId(request: Request, body?: { familyId?: string }): string | undefined {
  const url = new URL(request.url);
  const raw = body?.familyId ?? url.searchParams.get("familyId");
  return raw?.trim() || undefined;
}

function parseForce(request: Request, body?: { force?: boolean }): boolean {
  if (body?.force === true) return true;
  const url = new URL(request.url);
  const raw = url.searchParams.get("force");
  return raw === "1" || raw === "true";
}

async function readBody(request: Request): Promise<{
  dryRun?: boolean;
  asOf?: string;
  familyId?: string;
  force?: boolean;
}> {
  if (request.method === "GET") return {};
  try {
    return (await request.json()) as {
      dryRun?: boolean;
      asOf?: string;
      familyId?: string;
      force?: boolean;
    };
  } catch {
    return {};
  }
}

async function handle(request: Request) {
  if (!authorizeCronRequest(request)) {
    console.error("raport-an: unauthorized cron call");
    return NextResponse.json({ error: "Neautorizat." }, { status: 401 });
  }

  const body = await readBody(request);
  const dryRun = parseDryRun(request, body);
  const asOf = parseAsOf(request, body) ?? bucharestToday();
  const familyId = parseFamilyId(request, body);
  const force = parseForce(request, body);

  if (!isJanuarySecond(asOf) && !force) {
    return NextResponse.json({
      ok: true,
      skipped: "not-january-2",
      asOf,
    });
  }

  const supabase = createServiceSupabase();
  if (!supabase) {
    console.error("raport-an: missing Supabase service role");
    return NextResponse.json(
      {
        error:
          "Cronul are nevoie de NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY și SUPABASE_SERVICE_ROLE_KEY.",
      },
      { status: 500 },
    );
  }

  try {
    const result = await runMondayDigest({
      now: asOf,
      dryRun,
      familyId,
      kindOverride: "yearly",
      sender: dryRun ? null : createResendSender(),
      supabase,
    });
    const summary = summarizeRun(result);
    console.info("raport-an", { asOf, dryRun, ...summary });
    return NextResponse.json({ ok: true, ...result, summary });
  } catch (err) {
    console.error("raport-an: run failed", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Cronul a eșuat." },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  return handle(request);
}

export async function POST(request: Request) {
  return handle(request);
}
