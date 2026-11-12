import { createClient } from "@supabase/supabase-js";
import { supabaseUrl } from "./env";

/**
 * Server-only client using the secret key. Bypasses Row Level Security, so only
 * use it inside Server Actions / Route Handlers after checking who the user is.
 * Never import this from a Client Component.
 */
export function createAdminClient() {
  const secret = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !secret) {
    throw new Error("SUPABASE_SECRET_KEY is missing from .env.local.");
  }
  return createClient(supabaseUrl, secret, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
