export function getCronSecret(): string | null {
  const secret = process.env.CRON_SECRET?.trim();
  return secret ? secret : null;
}

export function authorizeCronRequest(request: Request): boolean {
  const secret = getCronSecret();
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export function parseDryRun(request: Request, body?: { dryRun?: boolean }): boolean {
  if (body?.dryRun === true) return true;
  const url = new URL(request.url);
  const raw = url.searchParams.get("dryRun") ?? url.searchParams.get("dry_run");
  return raw === "1" || raw === "true";
}

export function parseAsOf(request: Request, body?: { asOf?: string }): string | null {
  const url = new URL(request.url);
  const raw = body?.asOf ?? url.searchParams.get("asOf");
  if (!raw) return null;
  return /^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : null;
}
