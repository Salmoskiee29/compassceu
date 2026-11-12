import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { completeLesson } from "@/app/actions/learning";
import { LessonList } from "@/components/LessonList";
import { SubmitButton } from "@/components/ui";
import { getLesson } from "@/lib/content";
import { loadCourseForLearner } from "@/lib/course-access";

export async function generateMetadata(props: PageProps<"/learn/[slug]/[lesson]">): Promise<Metadata> {
  const { slug, lesson } = await props.params;
  const found = getLesson(slug, lesson);
  return { title: found ? `${found.lesson.title} · ${found.course.title}` : "Lesson" };
}

export default async function LessonPage(props: PageProps<"/learn/[slug]/[lesson]">) {
  const { slug, lesson: lessonId } = await props.params;
  const found = getLesson(slug, lessonId);
  if (!found) notFound();

  const { lessons, done, allDone, certificate, course } = await loadCourseForLearner(slug, `/learn/${slug}/${lessonId}`);
  const { lesson, index } = found;
  const prev = lessons[index - 1];
  const next = lessons[index + 1];
  const isDone = done.has(lesson.id);

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
        <article>
          <p className="text-sm font-medium text-brand">
            Lesson {index + 1} of {lessons.length}
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-navy">{lesson.title}</h1>

          <div className="mt-6 space-y-4 leading-relaxed">
            {lesson.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
            {prev ? (
              <Link href={`/learn/${slug}/${prev.id}`} className="text-sm font-medium text-brand hover:underline">
                ← {prev.title}
              </Link>
            ) : (
              <span />
            )}
            <form action={completeLesson.bind(null, slug, lesson.id)}>
              <SubmitButton pendingLabel="Saving…">
                {isDone ? (next ? "Next lesson →" : "Go to assessment →") : next ? "Mark complete & continue →" : "Mark complete & take assessment →"}
              </SubmitButton>
            </form>
          </div>
        </article>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">Course content</h2>
          <LessonList
            slug={slug}
            lessons={lessons}
            done={done}
            currentId={lesson.id}
            quizUnlocked={allDone}
            passed={!!certificate}
          />
        </aside>
      </div>
    </div>
  );
}
