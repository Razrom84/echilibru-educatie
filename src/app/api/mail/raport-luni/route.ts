import { NextResponse } from "next/server";
import { createResendSender } from "@/lib/mail/resend";
import { runMondayDigest } from "@/lib/mail/run-monday-digest";
import { createServiceSupabase } from "@/lib/supabase/admin";
import { createServerSupabase } from "@/lib/supabase/server";
import { bucharestToday } from "@/lib/program-week";
import type { DigestKind } from "@/lib/monday-digest";

export const dynamic = "force-dynamic";

function parseKind(url: URL): DigestKind | null {
  const raw = url.searchParams.get("kind");
  return raw === "weekly" || raw === "monthly" ? raw : null;
}

export async function POST(request: Request) {
  const session = await createServerSupabase();
  if (!session) {
    return NextResponse.json({ error: "Supabase nu este configurat." }, { status: 500 });
  }

  const {
    data: { user },
  } = await session.auth.getUser();
  if (!user?.email) {
    return NextResponse.json({ error: "Trebuie să fii autentificat." }, { status: 401 });
  }

  const { data: family, error: familyError } = await session
    .from("families")
    .select("id")
    .eq("parent_id", user.id)
    .maybeSingle();
  if (familyError || !family) {
    return NextResponse.json(
      { error: familyError?.message ?? "Familia lipsește." },
      { status: 400 },
    );
  }

  const url = new URL(request.url);
  let body: { dryRun?: boolean; asOf?: string; kind?: DigestKind } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    body = {};
  }

  const dryRun = body.dryRun !== false && url.searchParams.get("send") !== "1";
  const asOf =
    body.asOf && /^\d{4}-\d{2}-\d{2}$/.test(body.asOf)
      ? body.asOf
      : (url.searchParams.get("asOf") ?? bucharestToday());
  const kindOverride = body.kind ?? parseKind(url);

  const admin = createServiceSupabase() ?? session;

  try {
    const result = await runMondayDigest({
      now: asOf,
      dryRun,
      familyId: family.id,
      kindOverride,
      testSend: !dryRun,
      sender: dryRun ? null : createResendSender(),
      supabase: admin,
      toOverride: user.email,
    });
    const outcome = result.outcomes[0];
    return NextResponse.json({
      ok: true,
      dryRun,
      outcome,
      preview: result.preview ?? null,
    });
  } catch (err) {
    console.error("raport-luni test: failed", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Testul a eșuat." },
      { status: 500 },
    );
  }
}
