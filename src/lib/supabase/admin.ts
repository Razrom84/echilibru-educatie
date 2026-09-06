import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "@/lib/config";

export function getServiceRoleKey(): string | null {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  return key && !key.startsWith("YOUR_") ? key : null;
}

/** Service-role client for cron (bypasses RLS). Never import from client components. */
export function createServiceSupabase(): SupabaseClient | null {
  const env = getSupabaseEnv();
  const serviceKey = getServiceRoleKey();
  if (!env || !serviceKey) return null;
  return createClient(env.url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
