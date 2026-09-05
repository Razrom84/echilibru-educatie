export const DEMO_COOKIE = "echilibru_demo";
export const CHILD_COOKIE = "echilibru_child";
export const DEMO_STORAGE_KEY = "echilibru-demo-v1";

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(
    url &&
      key &&
      url.startsWith("https://") &&
      !url.includes("YOUR_PROJECT") &&
      !key.includes("YOUR_ANON"),
  );
}

export function getSupabaseEnv(): { url: string; anonKey: string } | null {
  if (!isSupabaseConfigured()) return null;
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  };
}
