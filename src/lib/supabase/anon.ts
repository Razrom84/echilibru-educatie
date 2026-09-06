import { createClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "@/lib/config";

/** Cookie-less anon client for public ICS lookup (no parent session). */
export function createAnonSupabase() {
  const env = getSupabaseEnv();
  if (!env) return null;
  return createClient(env.url, env.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
