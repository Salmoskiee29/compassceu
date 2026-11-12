import { notFound, redirect } from "next/navigation";
import { requireUser } from "./auth";
import { getLessons } from "./content";
import { getCourse } from "./courses";
import { getCertificateFor, getCompletedLessonIds, getEnrollment } from "./learning";

/** Loads everything a /learn page needs, and bounces learners who aren't enrolled. */
export async function loadCourseForLearner(slug: string, returnTo: string) {
  const course = getCourse(slug);
  if (!course) notFound();

  const user = await requireUser(returnTo);
  const enrollment = await getEnrollment(user.id, slug);
  if (!enrollment) redirect(`/courses/${slug}`);

  const [done, certificate] = await Promise.all([
    getCompletedLessonIds(user.id, slug),
    getCertificateFor(user.id, slug),
  ]);

  const lessons = getLessons(course);
  const allDone = lessons.every((l) => done.has(l.id));

  return { user, course, lessons, done, allDone, certificate };
}
