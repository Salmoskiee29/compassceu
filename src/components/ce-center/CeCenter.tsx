import Link from "next/link";
import type { Profile } from "@/lib/auth";
import { type Category, categories, categoryNames } from "@/lib/courses";
import { offersFor } from "@/lib/offers";
import { requirements } from "@/lib/requirements";
import { CourseTable } from "./CourseTable";
import { BundleCard, DesignDealCard, MembershipCard } from "./OfferCards";

const plural: Record<Category, string> = { RN: "RNs", LVN: "LVNs", CNA: "CNAs", HHA: "Home Health Aides" };

/** Catalog-style CE hub: sidebar + offers + course list for one profession. */
export function CeCenter({
  profession,
  cartIds,
  profile,
}: {
  profession: Category;
  cartIds: string[];
  profile: Profile | null;
}) {
  const { state, specialty, courses } = offersFor(profession);
  const inCart = (id: string) => cartIds.includes(id);
  const req = requirements[profession];

  return (
    <section id="ce-center" className="bg-surface">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 lg:grid-cols-[260px_1fr] lg:py-20">
        {/* ---------- Sidebar ---------- */}
        <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
          <nav className="rounded-2xl border border-line bg-background p-4 shadow-sm">
            <p className="px-1 text-center font-display text-sm font-bold text-navy">Complete your CE</p>
            <ul className="mt-3 grid grid-cols-3 gap-2 lg:grid-cols-1">
              {[
                ["#offers", "Special Offers"],
                ["#courses", "Course List"],
                ["#requirements", "CE Requirements"],
              ].map(([href, label], i) => (
                <li key={href}>
                  <a
                    href={href}
                    className={`flex h-full items-center justify-center rounded-xl px-2 py-2.5 text-center text-sm font-semibold transition ${
                      i === 0
                        ? "border-[1.5px] border-navy text-navy hover:bg-navy hover:text-white"
                        : "bg-navy-solid text-white hover:bg-navy-solid-hover"
                    }`}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
            <Link href="/#faq" className="mt-3 block text-center text-xs text-brand hover:underline">
              Have questions? See our FAQs.
            </Link>

            <div className="mt-4 border-t border-line pt-4 text-center text-sm">
              {profile ? (
                <>
                  <p className="font-semibold">{profile.full_name || profile.email}</p>
                  {profile.license_number && (
                    <p className="mt-0.5 text-xs text-muted">License no. {profile.license_number}</p>
                  )}
                  <Link href="/dashboard" className="mt-2 inline-block text-xs font-medium text-brand hover:underline">
                    Go to My Courses →
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-muted">Already a learner?</p>
                  <Link href="/sign-in" className="mt-1 inline-block font-semibold text-brand hover:underline">
                    Sign in to your account
                  </Link>
                </>
              )}
            </div>
          </nav>

          <div className="relative hidden overflow-hidden rounded-2xl bg-linear-to-br from-[#0b1a4a] via-[#14286a] to-[#1c3889] p-6 text-center text-white lg:block">
            <svg
              viewBox="0 0 100 200"
              className="pointer-events-none absolute -right-3 -bottom-8 h-40 text-[#c9973f]/50"
              fill="none"
              aria-hidden="true"
            >
              <path d="M80 0 C 95 70, 70 150, 10 195" stroke="currentColor" strokeWidth="9" strokeLinecap="round" />
            </svg>
            <p className="font-display text-2xl leading-tight font-extrabold">
              Designed for
              <br />
              <span className="text-[#e0b25a]">California {plural[profession]}</span>
            </p>
            <dl className="mt-6 space-y-5 text-sm">
              {[
                ["Self-paced", "Learn on any device, between shifts"],
                [`${courses.length} courses`, "Built around your renewal needs"],
                ["Instant certificates", "Verifiable online by ID"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="font-display text-base font-bold">{k}</dt>
                  <dd className="text-white/70">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>

        {/* ---------- Main ---------- */}
        <div className="min-w-0">
          <div id="offers" className="scroll-mt-28">
            <div className="flex flex-col gap-4 border-b border-line pb-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">Special offers</p>
                <h2 className="mt-2 font-display text-2xl font-bold text-navy sm:text-3xl">
                  Continuing education for California {plural[profession]}
                </h2>
              </div>
              <ProfessionTabs active={profession} />
            </div>

            <SectionTitle>State compliance offers</SectionTitle>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {state.map((b) => (
                <BundleCard key={b.slug} bundle={b} inCart={inCart(`b:${b.slug}`)} />
              ))}
              <MembershipCard inCart={inCart("m:all-access")} />
              <DesignDealCard />
            </div>

            {specialty.length > 0 && (
              <>
                <SectionTitle>Specialty offers</SectionTitle>
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {specialty.map((b) => (
                    <BundleCard key={b.slug} bundle={b} inCart={inCart(`b:${b.slug}`)} />
                  ))}
                </div>
              </>
            )}
          </div>

          <div id="requirements" className="mt-12 scroll-mt-28 rounded-2xl border border-line bg-background p-6 sm:flex sm:gap-6">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M9 4h6a1 1 0 0 1 1 1v1H8V5a1 1 0 0 1 1-1z" />
                <path d="M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                <path d="m9 14 2 2 4-4" />
              </svg>
            </span>
            <div className="mt-4 sm:mt-0">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                {categoryNames[profession]} · {req.board}
              </p>
              <h3 className="mt-1 font-display text-xl font-bold text-navy">{req.summary}</h3>
              <ul className="mt-3 space-y-1.5 text-sm text-muted">
                {req.points.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="text-brand">•</span>
                    {p}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-muted">Always confirm current requirements with your licensing board.</p>
            </div>
          </div>

          <div id="courses" className="mt-12 scroll-mt-28">
            <div className="mb-5 flex flex-col gap-1 border-b border-line pb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">Course list</p>
              <h2 className="font-display text-2xl font-bold text-navy sm:text-3xl">
                Courses for California {plural[profession]}
              </h2>
            </div>
            <CourseTable key={profession} courses={courses} cartIds={cartIds} />
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-8 mb-4 font-display text-lg font-bold text-navy">{children}</h3>;
}

function ProfessionTabs({ active }: { active: Category }) {
  return (
    <div role="tablist" aria-label="Choose your profession" className="inline-flex rounded-xl border border-line bg-background p-1">
      {categories.map((c) => (
        <Link
          key={c}
          role="tab"
          aria-selected={c === active}
          href={`/?for=${c}#offers`}
          scroll={false}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
            c === active ? "bg-navy-solid text-white shadow" : "text-muted hover:text-navy"
          }`}
        >
          {c}
        </Link>
      ))}
    </div>
  );
}
