import type { Metadata } from "next";
import Link from "next/link";
import { ComingSoon } from "@/components/ComingSoon";
import { comingSoon } from "@/lib/site";
import { CourseCard } from "@/components/CourseCard";
import { Faq } from "@/components/Faq";
import { Hero } from "@/components/Hero";
import { categories, courses } from "@/lib/courses";

const steps = [
  { title: "Choose a course", body: "Browse by profession and pick a course that matches your renewal needs." },
  { title: "Learn at your pace", body: "Short, focused modules you can finish on your phone or laptop." },
  { title: "Get certified", body: "Pass the assessment and download a verifiable certificate instantly." },
];

const stats = [
  { value: `${courses.length}+`, label: "Courses" },
  { value: `${categories.length}`, label: "Professions" },
  { value: "100%", label: "Online & self-paced" },
  { value: "24/7", label: "Access" },
];

export const metadata: Metadata = comingSoon
  ? {
      title: { absolute: "CompassCEU — Coming Soon" },
      description:
        "CompassCEU is launching soon: online continuing education for healthcare professionals in California.",
    }
  : {};

export default function Home() {
  if (comingSoon) return <ComingSoon />;

  const featured = courses.slice(0, 3);

  return (
    <>
      <Hero />

      {/* Stats */}
      <section className="border-y border-line">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-bold text-brand">{s.value}</div>
              <div className="mt-1 text-sm text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold">Featured courses</h2>
          <Link href="/courses" className="text-sm font-medium text-brand hover:underline">
            View all →
          </Link>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((c) => (
            <CourseCard key={c.slug} course={c} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-center text-2xl font-bold">How it works</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title} className="rounded-xl border border-line bg-background p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white font-semibold">
                  {i + 1}
                </div>
                <h3 className="mt-4 font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-4 py-16">
        <h2 className="text-center text-2xl font-bold">Frequently asked questions</h2>
        <div className="mt-8">
          <Faq />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="rounded-2xl bg-brand px-8 py-12 text-center text-white">
          <h2 className="text-2xl font-bold sm:text-3xl">Ready to renew with confidence?</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/80">
            Start a course today and earn your CEUs on your own schedule.
          </p>
          <Link
            href="/courses"
            className="mt-6 inline-block rounded-lg bg-white px-6 py-3 font-medium text-brand-dark hover:bg-white/90"
          >
            Get started
          </Link>
        </div>
      </section>
    </>
  );
}
