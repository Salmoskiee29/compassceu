import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EnrollForm } from "@/components/EnrollForm";
import { CourseCard } from "@/components/CourseCard";
import { courses, formatPrice, getCourse } from "@/lib/courses";

export function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(
  props: PageProps<"/courses/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const course = getCourse(slug);
  return course
    ? { title: course.title, description: course.summary }
    : { title: "Course not found" };
}

export default async function CoursePage(props: PageProps<"/courses/[slug]">) {
  const { slug } = await props.params;
  const course = getCourse(slug);
  if (!course) notFound();

  const related = courses
    .filter((c) => c.category === course.category && c.slug !== course.slug)
    .slice(0, 3);

  return (
    <>
      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <nav className="text-sm text-muted">
            <Link href="/courses" className="hover:text-brand">Courses</Link>
            <span className="mx-2">/</span>
            <span>{course.category}</span>
          </nav>
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{course.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">{course.summary}</p>
          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            {[
              ["CEUs", course.units],
              ["Duration", `${course.hours} hours`],
              ["Level", course.level],
              ["Instructor", course.instructor],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-muted">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-3">
        <div className="space-y-10 lg:col-span-2">
          <section>
            <h2 className="text-xl font-semibold">What you&apos;ll learn</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {course.outcomes.map((o) => (
                <li key={o} className="flex gap-3 rounded-lg border border-line p-4 text-sm">
                  <span className="text-brand">✓</span>
                  {o}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Course modules</h2>
            <ol className="mt-4 divide-y divide-line rounded-lg border border-line">
              {course.modules.map((m, i) => (
                <li key={m} className="flex items-center gap-4 p-4 text-sm">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xs font-semibold text-brand">
                    {i + 1}
                  </span>
                  {m}
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-line p-6 shadow-sm">
            <div className="text-3xl font-bold">{formatPrice(course.price)}</div>
            <p className="mt-1 text-sm text-muted">
              {course.units} CEUs · certificate included
            </p>
            <div className="mt-6">
              <EnrollForm courseSlug={course.slug} courseTitle={course.title} />
            </div>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <h2 className="text-xl font-semibold">More {course.category} courses</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((c) => (
              <CourseCard key={c.slug} course={c} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
