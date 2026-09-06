import { NextResponse } from "next/server";
import {
  authorizeCronRequest,
  parseAsOf,
  parseDryRun,
} from "@/lib/mail/cron-auth";
import { createResendSender } from "@/lib/mail/resend";
import { runMondayDigest, summarizeRun } from "@/lib/mail/run-monday-digest";
import { createServiceSupabase } from "@/lib/supabase/admin";
import { bucharestToday } from "@/lib/program-week";
import type { DigestKind } from "@/lib/monday-digest";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function parseKind(
  request: Request,
  body?: { kind?: string },
): DigestKind | null {
  const url = new URL(request.url);
  const raw = body?.kind ?? url.searchParams.get("kind");
  return raw === "weekly" || raw === "monthly" ? raw : null;
}

function parseFamilyId(
  request: Request,
  body?: { familyId?: string },
): string | undefined {
  const url = new URL(request.url);
  const raw = body?.familyId ?? url.searchParams.get("familyId");
  return raw?.trim() || undefined;
}

async function readBody(request: Request): Promise<{
  dryRun?: boolean;
  asOf?: string;
  kind?: string;
  familyId?: string;
  testSend?: boolean;
}> {
  if (request.method === "GET") return {};
  try {
    return (await request.json()) as {
      dryRun?: boolean;
      asOf?: string;
      kind?: string;
      familyId?: string;
      testSend?: boolean;
    };
  } catch {
    return {};
  }
}

async function handle(request: Request) {
  if (!authorizeCronRequest(request)) {
    console.error("raport-luni: unauthorized cron call");
    return NextResponse.json({ error: "Neautorizat." }, { status: 401 });
  }

  const body = await readBody(request);
  const dryRun = parseDryRun(request, body);
  const asOf = parseAsOf(request, body) ?? bucharestToday();
  const kindOverride = parseKind(request, body);
  const familyId = parseFamilyId(request, body);
  const testSend = body.testSend === true;

  const supabase = createServiceSupabase();
  if (!supabase) {
    console.error("raport-luni: missing Supabase service role");
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
      kindOverride,
      testSend,
      sender: dryRun ? null : createResendSender(),
      supabase,
    });
    const summary = summarizeRun(result);
    console.info("raport-luni", { asOf, dryRun, ...summary });
    return NextResponse.json({ ok: true, ...result, summary });
  } catch (err) {
    console.error("raport-luni: run failed", err);
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
