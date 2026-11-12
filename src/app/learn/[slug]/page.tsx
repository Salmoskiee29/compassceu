import type { Metadata } from "next";
import Link from "next/link";
import { LessonList } from "@/components/LessonList";
import { ProgressBar } from "@/components/ProgressBar";
import { loadCourseForLearner } from "@/lib/course-access";
import { getCourse } from "@/lib/courses";
import { formatDate } from "@/lib/learning";

export async function generateMetadata(props: PageProps<"/learn/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  return { title: getCourse(slug)?.title ?? "Course" };
}

export default async function LearnCoursePage(props: PageProps<"/learn/[slug]">) {
  const { slug } = await props.params;
  const { welcome } = await props.searchParams;
  const { course, lessons, done, allDone, certificate } = await loadCourseForLearner(slug, `/learn/${slug}`);

  const doneCount = lessons.filter((l) => done.has(l.id)).length;
  const next = lessons.find((l) => !done.has(l.id));
  const pct = certificate ? 100 : (doneCount / lessons.length) * 100;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <nav className="text-sm text-muted">
        <Link href="/dashboard" className="hover:text-brand">
          My Courses
        </Link>
        <span className="mx-2">/</span>
        <span>{course.title}</span>
      </nav>

      {welcome && !certificate && (
        <div className="mt-6 rounded-xl border border-green-600/30 bg-green-500/10 p-4 text-sm">
          <p className="font-semibold text-green-700 dark:text-green-400">You&apos;re enrolled! 🎉</p>
          <p className="mt-1 text-muted">Work through the lessons in order, then pass the final assessment to earn your certificate.</p>
        </div>
      )}

      <div className="mt-6 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <span className="rounded-full bg-brand-soft px-2.5 py-1 text-xs font-medium text-brand">{course.category}</span>
          <h1 className="mt-3 font-display text-3xl font-bold text-navy">{course.title}</h1>
          <p className="mt-3 text-muted">{course.summary}</p>

          <div className="mt-6">
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-medium">Your progress</span>
              <span className="text-muted">
                {doneCount}/{lessons.length} lessons
              </span>
            </div>
            <ProgressBar value={pct} />
          </div>

          <div className="mt-8">
            <LessonList slug={slug} lessons={lessons} done={done} quizUnlocked={allDone} passed={!!certificate} />
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-line p-6">
            {certificate ? (
              <>
                <p className="font-semibold text-green-700 dark:text-green-400">✓ Course completed</p>
                <p className="mt-1 text-sm text-muted">Certificate issued {formatDate(certificate.issued_at)}.</p>
                <Link
                  href={`/certificates/${certificate.id}`}
                  className="mt-5 block rounded-lg bg-navy-solid py-3 text-center font-semibold text-white hover:bg-navy-solid-hover"
                >
                  View certificate
                </Link>
              </>
            ) : (
              <>
                <p className="font-semibold">{next ? (doneCount ? "Keep going" : "Ready to start?") : "All lessons done"}</p>
                <p className="mt-1 text-sm text-muted">
                  {next ? `Next up: ${next.title}` : "Take the final assessment to earn your certificate."}
                </p>
                <Link
                  href={next ? `/learn/${slug}/${next.id}` : `/learn/${slug}/quiz`}
                  className="mt-5 block rounded-lg bg-navy-solid py-3 text-center font-semibold text-white hover:bg-navy-solid-hover"
                >
                  {next ? (doneCount ? "Continue" : "Start first lesson") : "Take assessment"}
                </Link>
              </>
            )}
            <dl className="mt-6 space-y-2 border-t border-line pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">CEUs</dt>
                <dd className="font-medium">{course.units}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Duration</dt>
                <dd className="font-medium">{course.hours} hours</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Instructor</dt>
                <dd className="font-medium">{course.instructor}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}
