import type { Metadata } from "next";
import Link from "next/link";
import { submitQuiz } from "@/app/actions/learning";
import { LessonList } from "@/components/LessonList";
import { QuizForm } from "@/components/QuizForm";
import { PASS_PERCENT, publicQuiz, requiredCorrect } from "@/lib/content";
import { loadCourseForLearner } from "@/lib/course-access";
import { getCourse } from "@/lib/courses";

export async function generateMetadata(props: PageProps<"/learn/[slug]/quiz">): Promise<Metadata> {
  const { slug } = await props.params;
  return { title: `Final assessment · ${getCourse(slug)?.title ?? "Course"}` };
}

export default async function QuizPage(props: PageProps<"/learn/[slug]/quiz">) {
  const { slug } = await props.params;
  const { course, lessons, done, allDone, certificate } = await loadCourseForLearner(slug, `/learn/${slug}/quiz`);
  const questions = publicQuiz(slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <nav className="text-sm text-muted">
        <Link href="/dashboard" className="hover:text-brand">
          My Courses
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/learn/${slug}`} className="hover:text-brand">
          {course.title}
        </Link>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_320px]">
        <section>
          <h1 className="font-display text-3xl font-bold text-navy">Final assessment</h1>
          <p className="mt-2 text-muted">
            {questions.length} questions · {PASS_PERCENT}% to pass ({requiredCorrect(questions.length)} of {questions.length} correct) ·
            unlimited attempts
          </p>

          <div className="mt-8">
            {certificate ? (
              <div className="rounded-2xl border border-green-600/30 bg-green-500/10 p-6">
                <p className="font-semibold text-green-700 dark:text-green-400">✓ You&apos;ve already passed this assessment.</p>
                <Link href={`/certificates/${certificate.id}`} className="mt-3 inline-block font-medium text-brand hover:underline">
                  View your certificate →
                </Link>
              </div>
            ) : !allDone ? (
              <div className="rounded-2xl border border-dashed border-line p-8 text-center">
                <p className="font-semibold">🔒 Finish every lesson to unlock the assessment.</p>
                <Link href={`/learn/${slug}`} className="mt-3 inline-block font-medium text-brand hover:underline">
                  Back to lessons
                </Link>
              </div>
            ) : (
              <QuizForm slug={slug} questions={questions} passPercent={PASS_PERCENT} action={submitQuiz.bind(null, slug)} />
            )}
          </div>
        </section>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">Course content</h2>
          <LessonList slug={slug} lessons={lessons} done={done} currentId="quiz" quizUnlocked={allDone} passed={!!certificate} />
        </aside>
      </div>
    </div>
  );
}
