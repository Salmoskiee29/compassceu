import type { Metadata } from "next";
import Link from "next/link";
import { ComingSoon } from "@/components/ComingSoon";
import { CeCenter } from "@/components/ce-center/CeCenter";
import { Faq } from "@/components/Faq";
import { Hero } from "@/components/Hero";
import { getProfile } from "@/lib/auth";
import { readCart } from "@/lib/cart";
import { type Category, categories } from "@/lib/courses";
import { comingSoon } from "@/lib/site";

export const metadata: Metadata = comingSoon
  ? {
      title: { absolute: "CompassCEU — Coming Soon" },
      description:
        "CompassCEU is launching soon: online continuing education for healthcare professionals in California.",
    }
  : {
      title: { absolute: "CompassCEU — Continuing Education for California Healthcare Professionals" },
      description:
        "Self-paced online CE courses for California RNs, LVNs, CNAs, and home health aides. Earn CEUs and download a verifiable certificate instantly.",
    };

const steps = [
  { title: "Create a free account", body: "Sign up in a minute and add your profession and license number." },
  { title: "Choose a course", body: "Browse by profession and enroll in the course that fits your renewal needs." },
  { title: "Learn at your pace", body: "Work through short, focused lessons on any device." },
  { title: "Get certified", body: "Pass the assessment and download your verifiable certificate instantly." },
];

export default async function Home(props: PageProps<"/">) {
  if (comingSoon) return <ComingSoon />;

  const [{ for: forParam }, profile, cartIds] = await Promise.all([props.searchParams, getProfile(), readCart()]);
  const user = profile;
  const profession: Category =
    categories.find((c) => c === forParam) ?? profile?.profession ?? "RN";

  return (
    <>
      <Hero />

      <CeCenter profession={profession} cartIds={cartIds} profile={profile} />

      {/* How it works */}
      <section className="theme-light bg-[#0b1a4a] text-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-[#e0b25a]">How it works</p>
          <h2 className="mt-3 text-center font-display text-3xl font-bold text-white">From sign-up to certificate in four steps</h2>
          <ol className="mt-12 grid gap-6 md:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#c9973f] font-display font-bold text-[#0b1a4a]">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm text-white/70">{s.body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 text-center">
            <Link
              href={user ? "/courses" : "/create-account"}
              className="inline-block rounded-lg bg-white px-7 py-3.5 font-semibold text-[#0b1a4a] transition hover:bg-white/90"
            >
              {user ? "Browse courses" : "Create your free account"}
            </Link>
          </div>
        </div>
      </section>

      {/* Organizations + Verify */}
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-16 lg:grid-cols-2">
        <div className="flex flex-col rounded-2xl border border-line p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">For organizations</p>
          <h2 className="mt-3 font-display text-2xl font-bold text-navy">Training your whole team?</h2>
          <p className="mt-3 flex-1 text-muted">
            Hospitals, home health agencies, care facilities, and schools can enroll staff in bulk at group rates.
          </p>
          <div>
            <Link
              href="/contact"
              className="mt-6 inline-block rounded-lg bg-navy-solid px-6 py-3 font-semibold text-white hover:bg-navy-solid-hover"
            >
              Ask about group rates
            </Link>
          </div>
        </div>

        <div className="flex flex-col rounded-2xl border border-line bg-surface p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">For employers &amp; boards</p>
          <h2 className="mt-3 font-display text-2xl font-bold text-navy">Verify a certificate</h2>
          <p className="mt-3 text-muted">Enter the certificate ID printed on any CompassCEU certificate.</p>
          <form action="/verify" method="get" className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              name="id"
              required
              placeholder="e.g. CCEU-2026-7K4QPZ"
              aria-label="Certificate ID"
              className="input flex-1 font-mono uppercase"
            />
            <button type="submit" className="rounded-lg bg-brand px-6 py-2.5 font-medium text-white hover:bg-brand-dark">
              Verify
            </button>
          </form>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl scroll-mt-28 px-4 pb-16">
        <SectionHeading eyebrow="Questions" title="Frequently asked questions" />
        <div className="mt-8">
          <Faq />
        </div>
        <p className="mt-6 text-center text-sm text-muted">
          Still have questions?{" "}
          <Link href="/contact" className="font-medium text-brand hover:underline">
            Contact us
          </Link>
        </p>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#0b1a4a] to-[#1c3889] px-8 py-14 text-center text-white">
          <svg
            viewBox="0 0 100 200"
            className="pointer-events-none absolute -right-4 -bottom-6 h-48 text-[#c9973f]/60"
            fill="none"
            aria-hidden="true"
          >
            <path d="M80 0 C 95 70, 70 150, 10 195" stroke="currentColor" strokeWidth="9" strokeLinecap="round" />
          </svg>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Ready to renew with confidence?</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/80">
            Start a course today and earn your CEUs on your own schedule.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={user ? "/dashboard" : "/create-account"}
              className="rounded-lg bg-white px-7 py-3.5 font-semibold text-[#0b1a4a] hover:bg-white/90"
            >
              {user ? "Go to My Courses" : "Get started — it's free"}
            </Link>
            <Link href="/courses" className="rounded-lg border border-white/40 px-7 py-3.5 font-semibold text-white hover:bg-white/10">
              Browse courses
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function SectionHeading({
  eyebrow,
  title,
  body,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  body?: string;
  align?: "center" | "left";
}) {
  const center = align === "center";
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : ""}>
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl font-bold text-navy">{title}</h2>
      {body && <p className="mt-3 text-muted">{body}</p>}
    </div>
  );
}

