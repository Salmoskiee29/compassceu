import Link from "next/link";
import { AddToCartButton } from "@/components/AddToCartButton";
import { formatPrice } from "@/lib/courses";
import {
  type Bundle,
  bundleCourses,
  bundleCredits,
  bundleRegularPrice,
  dealTiers,
  formatEndDate,
  membership,
} from "@/lib/offers";
import { courses } from "@/lib/courses";

const card =
  "group/card relative flex flex-col overflow-hidden rounded-2xl border border-line bg-background shadow-[0_1px_2px_rgba(11,26,74,0.04),0_8px_24px_-12px_rgba(11,26,74,0.18)] transition hover:-translate-y-0.5 hover:shadow-[0_2px_4px_rgba(11,26,74,0.06),0_18px_40px_-16px_rgba(11,26,74,0.3)]";

function EndsRibbon({ endsOn, tone = "navy" }: { endsOn: string; tone?: "navy" | "gold" }) {
  return (
    <div
      className={`flex items-center gap-2 px-5 py-2.5 text-xs font-semibold tracking-wide ${
        tone === "navy"
          ? "bg-linear-to-r from-[#0b1a4a] to-[#1c3889] text-white"
          : "bg-linear-to-r from-[#a8742a] to-[#c99a52] text-white"
      }`}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
      Offer ends {formatEndDate(endsOn)}
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-line bg-surface px-2.5 py-1 text-xs font-medium text-foreground/80">
      {children}
    </span>
  );
}

export function BundleCard({ bundle, inCart }: { bundle: Bundle; inCart: boolean }) {
  const list = bundleCourses(bundle);
  const regular = bundleRegularPrice(bundle);
  const shown = list.slice(0, 3);
  const rest = list.slice(3);

  return (
    <article className={card}>
      <EndsRibbon endsOn={bundle.endsOn} />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg leading-snug font-bold text-navy">{bundle.title}</h3>
          <div className="shrink-0 text-right">
            <p className="rounded-lg bg-[#f6ecd9] px-2.5 py-1 font-display text-lg font-extrabold text-[#8a5a12]">
              {formatPrice(bundle.price)}
            </p>
            {regular > bundle.price && (
              <p className="mt-1 text-xs text-muted line-through">{formatPrice(regular)}</p>
            )}
          </div>
        </div>
        {bundle.blurb && <p className="mt-1 text-sm text-muted">{bundle.blurb}</p>}
        <div className="mt-3 flex flex-wrap gap-2">
          <Pill>{bundleCredits(bundle)} credits</Pill>
          <Pill>{list.length} courses</Pill>
        </div>

        <ul className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
          {shown.map((c) => (
            <CourseLine key={c.slug} code={c.code} slug={c.slug} title={c.title} hours={c.hours} />
          ))}
        </ul>
        {rest.length > 0 && (
          <details className="group/more text-sm">
            <summary className="mt-2 cursor-pointer list-none font-medium text-brand hover:underline">
              <span className="group-open/more:hidden">+ {rest.length} more course{rest.length === 1 ? "" : "s"}</span>
              <span className="hidden group-open/more:inline">Show fewer</span>
            </summary>
            <ul className="mt-2 space-y-2">
              {rest.map((c) => (
                <CourseLine key={c.slug} code={c.code} slug={c.slug} title={c.title} hours={c.hours} />
              ))}
            </ul>
          </details>
        )}

        <div className="mt-auto pt-5">
          <AddToCartButton item={`b:${bundle.slug}`} inCart={inCart} />
        </div>
      </div>
    </article>
  );
}

function CourseLine({ code, slug, title, hours }: { code: string; slug: string; title: string; hours: number }) {
  return (
    <li className="flex gap-2">
      <span className="mt-0.5 shrink-0 font-mono text-[11px] text-muted">#{code}</span>
      <Link href={`/courses/${slug}`} className="leading-snug hover:text-brand hover:underline">
        {title} <span className="text-muted">· {hours}h</span>
      </Link>
    </li>
  );
}

export function MembershipCard({ inCart }: { inCart: boolean }) {
  const credits = courses.reduce((s, c) => s + c.units, 0);
  return (
    <article className={`${card} border-transparent bg-linear-to-b from-[#0b1a4a] to-[#1c3889] text-white`}>
      <div className="flex items-center gap-2 px-5 pt-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#e0b25a]">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="m12 2 2.9 6.6 7.1.6-5.4 4.7 1.6 7.1L12 17.3 5.8 21l1.6-7.1L2 9.2l7.1-.6z" />
        </svg>
        Best value
      </div>
      <div className="flex flex-1 flex-col p-5 pt-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg leading-snug font-bold">{membership.title}</h3>
          <p className="shrink-0 rounded-lg bg-white/10 px-2.5 py-1 font-display text-lg font-extrabold text-[#f3d08f]">
            {formatPrice(membership.price)}
          </p>
        </div>
        <p className="mt-1 text-sm text-white/70">Every profession, every topic.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium">{courses.length} courses</span>
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium">{credits} credits</span>
        </div>
        <ul className="mt-4 space-y-2.5 border-t border-white/15 pt-4 text-sm text-white/85">
          {[
            "Unlimited access to the entire course library",
            "Includes California renewal courses",
            "Certificates issued instantly on passing",
          ].map((t) => (
            <li key={t} className="flex gap-2">
              <span className="text-[#e0b25a]">✓</span>
              {t}
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-5">
          {inCart ? (
            <AddToCartButton item={`m:${membership.slug}`} inCart />
          ) : (
            <AddToCartButton
              item={`m:${membership.slug}`}
              inCart={false}
              className="!bg-white !text-[#0b1a4a] !shadow-none hover:!bg-white/90"
            />
          )}
        </div>
      </div>
    </article>
  );
}

export function DesignDealCard() {
  return (
    <article className={card}>
      <EndsRibbon endsOn={membership.endsOn} tone="gold" />
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a8742a]">Mix &amp; match</p>
        <h3 className="mt-1 font-display text-lg font-bold text-navy">Design a Deal</h3>
        <p className="mt-1 text-sm text-muted">
          Pick any courses you like. Your cart automatically drops to one low price.
        </p>
        <ul className="mt-4 divide-y divide-line rounded-xl border border-line text-sm">
          {dealTiers.map((t) => (
            <li key={t.min} className="flex items-center justify-between px-4 py-2.5">
              <span>
                {t.min}–{t.max} credits
              </span>
              <span className="font-display font-bold text-navy">{formatPrice(t.price)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-5">
          <a
            href="#courses"
            className="flex items-center justify-center gap-2 rounded-xl border-[1.5px] border-navy py-3 text-sm font-semibold text-navy transition hover:bg-navy hover:text-white"
          >
            Start picking courses
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
              <path d="M12 5v14m0 0-6-6m6 6 6-6" />
            </svg>
          </a>
        </div>
      </div>
    </article>
  );
}
