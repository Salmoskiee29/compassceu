import { redirect } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";
import type { Category } from "./courses";
import { isSupabaseConfigured } from "./supabase/env";
import { createClient } from "./supabase/server";

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  profession: Category | null;
  license_number: string | null;
};

/** The signed-in user (verified with Supabase), or null. Cached per request. */
export const getCurrentUser = cache(async () => {
  await connection(); // always per-request, never prerendered
  if (!isSupabaseConfigured) return null;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
});

/** The signed-in learner's profile, or null when signed out. Cached per request. */
export const getProfile = cache(async (): Promise<Profile | null> => {
  const user = await getCurrentUser();
  if (!user) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("full_name, profession, license_number")
    .eq("id", user.id)
    .maybeSingle();

  return {
    id: user.id,
    email: user.email ?? "",
    full_name: data?.full_name || String(user.user_metadata?.full_name ?? ""),
    profession: data?.profession ?? null,
    license_number: data?.license_number ?? null,
  };
});

/** Use at the top of learner-only pages and actions. */
export async function requireUser(returnTo: string) {
  const user = await getCurrentUser();
  if (!user) redirect(`/sign-in?next=${encodeURIComponent(returnTo)}`);
  return user;
}
