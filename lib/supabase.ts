import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client.
 * Prefers the service role so validated inserts succeed even though RLS
 * grants no public reads. Falls back to the anon key, which is allowed to
 * insert and nothing else. Returns null when the project is not configured
 * so the site can still build and render.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function isIntakeConfigured() {
  return getSupabaseAdmin() !== null;
}
