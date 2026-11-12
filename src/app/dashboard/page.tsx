import type { Metadata } from "next";
import Link from "next/link";
import { ProgressBar } from "@/components/ProgressBar";
import { getProfile, requireUser } from "@/lib/auth";
import { getLessons } from "@/lib/content";
import { getCourse } from "@/lib/courses";
import { formatDate } from "@/lib/learning";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "My Courses" };

type Row = { course_slug: string };

export default async function DashboardPage(props: PageProps<"/dashboard">) {
  await requireUser("/dashboard");
  const { welcome } = await props.searchParams;
  const profile = await getProfile();
  const supabase = await createClient();

  const [enrollRes, progressRes, certRes] = await Promise.all([
    supabase.from("enrollments").select("course_slug, created_at").eq("status", "paid").order("created_at", { ascending: false }),
    supabase.from("lesson_progress").select("course_slug, lesson_id"),
    supabase.from("certificates").select("id, course_slug, issued_at, ceus").order("issued_at", { ascending: false }),
  ]);

  const enrollments = (enrollRes.data ?? []) as (Row & { created_at: string })[];
  const progress = (progressRes.data ?? []) as (Row & { lesson_id: string })[];
  const certificates = (certRes.data ?? []) as (Row & { id: string; issued_at: string; ceus: number })[];

  const certBySlug = new Map(certificates.map((c) => [c.course_slug, c]));
  const totalCeus = certificates.reduce((sum, c) => sum + Number(c.ceus), 0);

  const items = enrollments.flatMap((e) => {
    const course = getCourse(e.course_slug);
    if (!course) return [];
    const lessons = getLessons(course);
    const done = new Set(progress.filter((p) => p.course_slug === course.slug).map((p) => p.lesson_id));
    const next = lessons.find((l) => !done.has(l.id));
    const cert = certBySlug.get(course.slug);
    return [{ course, lessons, doneCount: lessons.filter((l) => done.has(l.id)).length, next, cert }];
  });

  const firstName = profile?.full_name.split(" ")[0];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-navy">
            {firstName ? `Welcome back, ${firstName}` : "My Courses"}
          </h1>
          <p className="mt-2 text-muted">Pick up where you left off.</p>
        </div>
        <Link href="/courses" className="text-sm font-medium text-brand hover:underline">
          Browse more courses →
        </Link>
      </div>

      {welcome && (
        <div className="mt-6 rounded-xl border border-green-600/30 bg-green-500/10 p-4 text-sm">
          <p className="font-semibold text-green-700 dark:text-green-400">Order complete — you&apos;re enrolled! 🎉</p>
          <p className="mt-1 text-muted">Your new courses are below. Start any of them whenever you&apos;re ready.</p>
        </div>
      )}

      <dl className="mt-8 grid grid-cols-3 gap-4">
        {[
          ["Enrolled", items.length],
          ["Completed", certificates.length],
          ["CEUs earned", totalCeus],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-line p-4 sm:p-5">
            <dt className="text-xs text-muted sm:text-sm">{label}</dt>
            <dd className="mt-1 text-2xl font-bold text-brand">{value}</dd>
          </div>
        ))}
      </dl>

      {items.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-line p-12 text-center">
          <p className="font-semibold">You haven&apos;t enrolled in a course yet.</p>
          <p className="mt-1 text-sm text-muted">Find a course for your profession and start earning CEUs today.</p>
          <Link href="/courses" className="mt-6 inline-block rounded-lg bg-navy-solid px-6 py-3 font-semibold text-white hover:bg-navy-solid-hover">
            Browse courses
          </Link>
        </div>
      ) : (
        <ul className="mt-10 grid gap-6 md:grid-cols-2">
          {items.map(({ course, lessons, doneCount, next, cert }) => {
            const pct = cert ? 100 : (doneCount / lessons.length) * 100;
            const href = cert ? `/learn/${course.slug}` : next ? `/learn/${course.slug}/${next.id}` : `/learn/${course.slug}/quiz`;
            const cta = cert ? "Review course" : doneCount === 0 ? "Start course" : next ? "Continue" : "Take assessment";
            return (
              <li key={course.slug} className="flex flex-col rounded-2xl border border-line p-6">
                <div className="flex items-center justify-between text-xs">
                  <span className="rounded-full bg-brand-soft px-2.5 py-1 font-medium text-brand">{course.category}</span>
                  {cert ? (
                    <span className="font-semibold text-green-700 dark:text-green-400">✓ Completed</span>
                  ) : (
                    <span className="text-muted">
                      {doneCount}/{lessons.length} lessons
                    </span>
                  )}
                </div>
                <h2 className="mt-3 text-lg font-semibold">
                  <Link href={`/learn/${course.slug}`} className="hover:text-brand">
                    {course.title}
                  </Link>
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {course.units} CEUs · {course.hours} hours
                </p>
                <div className="mt-4">
                  <ProgressBar value={pct} label={`${course.title} progress`} />
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href={href} className="rounded-lg bg-navy-solid px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-solid-hover">
                    {cta}
                  </Link>
                  {cert && (
                    <Link
                      href={`/certificates/${cert.id}`}
                      className="rounded-lg border border-navy px-5 py-2.5 text-sm font-semibold text-navy hover:bg-navy/5"
                    >
                      View certificate
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {certificates.length > 0 && (
        <section className="mt-14">
          <h2 className="text-xl font-semibold">Certificates</h2>
          <div className="mt-4 overflow-x-auto rounded-xl border border-line">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Course</th>
                  <th className="px-4 py-3 font-medium">Certificate ID</th>
                  <th className="px-4 py-3 font-medium">CEUs</th>
                  <th className="px-4 py-3 font-medium">Issued</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {certificates.map((c) => (
                  <tr key={c.id}>
                    <td className="px-4 py-3">{getCourse(c.course_slug)?.title ?? c.course_slug}</td>
                    <td className="px-4 py-3 font-mono">{c.id}</td>
                    <td className="px-4 py-3">{Number(c.ceus)}</td>
                    <td className="px-4 py-3">{formatDate(c.issued_at)}</td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/certificates/${c.id}`} className="font-medium text-brand hover:underline">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
