// Read helpers for a learner's own data. These use the user's session, so Row Level
// Security guarantees a learner only ever sees their own rows.

import { createClient } from "./supabase/server";

export type Certificate = {
  id: string;
  course_slug: string;
  holder_name: string;
  license_number: string | null;
  ceus: number;
  issued_at: string;
};

export async function getEnrollment(userId: string, slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("enrollments")
    .select("id, created_at, status")
    .eq("user_id", userId)
    .eq("course_slug", slug)
    .eq("status", "paid")
    .maybeSingle();
  return data as { id: string; created_at: string; status: string } | null;
}

export async function getCompletedLessonIds(userId: string, slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("lesson_progress")
    .select("lesson_id")
    .eq("user_id", userId)
    .eq("course_slug", slug);
  return new Set((data ?? []).map((r: { lesson_id: string }) => r.lesson_id));
}

export async function getCertificateFor(userId: string, slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("certificates")
    .select("id, course_slug, holder_name, license_number, ceus, issued_at")
    .eq("user_id", userId)
    .eq("course_slug", slug)
    .maybeSingle();
  return data as Certificate | null;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { dateStyle: "long" });
}
