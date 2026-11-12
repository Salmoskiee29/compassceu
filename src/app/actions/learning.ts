"use server";

import { randomBytes } from "node:crypto";
import { notFound, redirect } from "next/navigation";
import { getProfile, requireUser } from "@/lib/auth";
import { getLessons, getQuiz, PASS_PERCENT } from "@/lib/content";
import { getCourse } from "@/lib/courses";
import { getCompletedLessonIds, getEnrollment } from "@/lib/learning";
import { createAdminClient } from "@/lib/supabase/admin";

// Unambiguous characters only (no 0/O, 1/I/L) so IDs are easy to read off a certificate.
const ID_CHARS = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
function randomCode(length: number) {
  const bytes = randomBytes(length);
  return Array.from(bytes, (b) => ID_CHARS[b % ID_CHARS.length]).join("");
}

/**
 * MOCK CHECKOUT — no money moves. Replace the body with a real payment provider
 * (e.g. create a Stripe Checkout Session and enroll from its webhook) before launch.
 */
export async function completeTestCheckout(slug: string) {
  const user = await requireUser(`/checkout/${slug}`);
  const course = getCourse(slug);
  if (!course) notFound();

  const admin = createAdminClient();
  const { error } = await admin.from("enrollments").upsert(
    {
      user_id: user.id,
      course_slug: slug,
      amount_cents: Math.round(course.price * 100),
      currency: "USD",
      payment_ref: `TEST-${randomCode(10)}`,
      status: "paid",
    },
    { onConflict: "user_id,course_slug", ignoreDuplicates: true },
  );
  if (error) throw new Error(`Enrollment failed: ${error.message}`);

  redirect(`/learn/${slug}?welcome=1`);
}

export async function completeLesson(slug: string, lessonId: string) {
  const user = await requireUser(`/learn/${slug}/${lessonId}`);
  const course = getCourse(slug);
  if (!course) notFound();

  const lessons = getLessons(course);
  const index = lessons.findIndex((l) => l.id === lessonId);
  if (index < 0) notFound();
  if (!(await getEnrollment(user.id, slug))) redirect(`/courses/${slug}`);

  const admin = createAdminClient();
  const { error } = await admin
    .from("lesson_progress")
    .upsert(
      { user_id: user.id, course_slug: slug, lesson_id: lessonId },
      { onConflict: "user_id,course_slug,lesson_id", ignoreDuplicates: true },
    );
  if (error) throw new Error(`Couldn't save progress: ${error.message}`);

  const next = lessons[index + 1];
  redirect(next ? `/learn/${slug}/${next.id}` : `/learn/${slug}/quiz`);
}

export type QuizState =
  | {
      score: number;
      total: number;
      passed: boolean;
      certificateId?: string;
      error?: string;
      /** Question ids answered incorrectly (no correct answers are revealed). */
      missed?: string[];
    }
  | undefined;

export async function submitQuiz(slug: string, _prev: QuizState, formData: FormData): Promise<QuizState> {
  const user = await requireUser(`/learn/${slug}/quiz`);
  const course = getCourse(slug);
  if (!course) notFound();

  const quiz = getQuiz(slug);
  const total = quiz.length;

  if (!(await getEnrollment(user.id, slug))) {
    return { score: 0, total, passed: false, error: "You're not enrolled in this course." };
  }
  const done = await getCompletedLessonIds(user.id, slug);
  if (getLessons(course).some((l) => !done.has(l.id))) {
    return { score: 0, total, passed: false, error: "Finish every lesson before taking the assessment." };
  }
  if (quiz.some((q) => formData.get(q.id) === null)) {
    return { score: 0, total, passed: false, error: "Please answer every question." };
  }

  const missed = quiz.filter((q) => Number(formData.get(q.id)) !== q.answer).map((q) => q.id);
  const score = total - missed.length;
  const passed = total > 0 && (score / total) * 100 >= PASS_PERCENT;

  const admin = createAdminClient();
  await admin.from("quiz_attempts").insert({ user_id: user.id, course_slug: slug, score, total, passed });

  if (!passed) return { score, total, passed, missed };

  const certificateId = await issueCertificate(user.id, slug, course.units, user.email ?? "");
  return { score, total, passed, certificateId };
}

async function issueCertificate(userId: string, slug: string, ceus: number, email: string) {
  const admin = createAdminClient();

  const existing = await admin
    .from("certificates")
    .select("id")
    .eq("user_id", userId)
    .eq("course_slug", slug)
    .maybeSingle();
  if (existing.data) return existing.data.id as string;

  const profile = await getProfile();
  const year = new Date().getFullYear();

  for (let attempt = 0; attempt < 5; attempt++) {
    const id = `CCEU-${year}-${randomCode(6)}`;
    const { error } = await admin.from("certificates").insert({
      id,
      user_id: userId,
      course_slug: slug,
      holder_name: profile?.full_name || email,
      license_number: profile?.license_number ?? null,
      ceus,
    });
    if (!error) return id;
    if (error.code !== "23505") throw new Error(`Couldn't issue certificate: ${error.message}`);

    // Unique violation: either an ID collision (retry) or a certificate was just issued
    // for this learner+course by a parallel request (return that one).
    const raced = await admin
      .from("certificates")
      .select("id")
      .eq("user_id", userId)
      .eq("course_slug", slug)
      .maybeSingle();
    if (raced.data) return raced.data.id as string;
  }
  throw new Error("Couldn't generate a unique certificate ID.");
}
