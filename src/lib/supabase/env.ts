// Supabase settings come from .env.local (see .env.example).
// Both the new key names (publishable/secret) and the legacy ones (anon/service_role) work.

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

export const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

export const notConfiguredMessage =
  "Supabase isn't connected yet. Add your keys to .env.local and restart `npm run dev`.";
