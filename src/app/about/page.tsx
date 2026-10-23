import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "Our mission: make continuing education practical and accessible.",
};

const values = [
  { title: "Practical", body: "Every module is built around what professionals actually do on the job." },
  { title: "Accessible", body: "Fully online, mobile-friendly, and priced for individual learners." },
  { title: "Trustworthy", body: "Verifiable certificates that employers and boards can check instantly." },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-surface">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">About CompassCEU</h1>
          <p className="mt-4 text-lg text-muted">
            We help licensed professionals stay current, meet renewal
            requirements, and grow their careers — without putting their lives
            on hold.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold">Our mission</h2>
            <p className="mt-4 text-muted">
              Continuing education should be a compass, not a chore. We design
              focused, self-paced courses that fit around demanding schedules
              and point learners toward skills they can use the next day.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Who we serve</h2>
            <p className="mt-4 text-muted">
              Registered nurses (RN), licensed vocational nurses (LVN), certified
              nursing assistants (CNA), and home health aides (HHA) — plus the
              hospitals, care facilities, and agencies that support their growth.
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {values.map((v) => (
            <div key={v.title} className="rounded-xl border border-line p-6">
              <h3 className="font-semibold text-brand">{v.title}</h3>
              <p className="mt-2 text-sm text-muted">{v.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link href="/courses" className="rounded-lg bg-brand px-6 py-3 font-medium text-white hover:bg-brand-dark">
            Explore courses
          </Link>
        </div>
      </section>
    </>
  );
}
