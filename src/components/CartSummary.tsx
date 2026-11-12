import Link from "next/link";
import { removeFromCart } from "@/app/actions/cart";
import { formatPrice } from "@/lib/courses";
import { bundleCredits, bundleRegularPrice, dealTiers } from "@/lib/offers";
import type { CartQuote } from "@/lib/pricing";

/** Line items + totals for the cart and checkout pages. */
export function CartSummary({ quote, editable }: { quote: CartQuote; editable: boolean }) {
  return (
    <div>
      <ul className="divide-y divide-line">
        {quote.lines.map((line) => {
          const title =
            line.kind === "course" ? line.course.title : line.kind === "bundle" ? line.bundle.title : line.title;
          const meta =
            line.kind === "course"
              ? `#${line.course.code} · ${line.course.units} credit${line.course.units === 1 ? "" : "s"} · ${line.course.category}`
              : line.kind === "bundle"
                ? `${line.bundle.courseSlugs.length} courses · ${bundleCredits(line.bundle)} credits · regularly ${formatPrice(bundleRegularPrice(line.bundle))}`
                : "Every course in the catalog";
          const tag = line.kind === "bundle" ? "Bundle" : line.kind === "membership" ? "Membership" : null;
          const includedIn = "includedIn" in line ? line.includedIn : undefined;
          return (
            <li key={line.id} className="flex items-start gap-4 py-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {tag && (
                    <span className="rounded-full bg-[#f6ecd9] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-[#8a5a12]">
                      {tag}
                    </span>
                  )}
                  {line.kind === "course" ? (
                    <Link href={`/courses/${line.course.slug}`} className="font-semibold hover:text-brand">
                      {title}
                    </Link>
                  ) : (
                    <p className="font-semibold">{title}</p>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted">{meta}</p>
                {includedIn && <p className="mt-1 text-xs font-medium text-emerald-700">Included in {includedIn}</p>}
                {editable && (
                  <form action={removeFromCart} className="mt-1">
                    <input type="hidden" name="item" value={line.id} />
                    <button type="submit" className="text-xs font-medium text-muted underline-offset-2 hover:text-red-600 hover:underline">
                      Remove
                    </button>
                  </form>
                )}
              </div>
              <p className={`shrink-0 font-semibold ${includedIn ? "text-muted line-through" : ""}`}>
                {includedIn ? formatPrice(line.kind === "course" ? line.course.price : line.kind === "bundle" ? line.bundle.price : 0) : formatPrice(line.price)}
              </p>
            </li>
          );
        })}
      </ul>

      <dl className="space-y-2 border-t border-line pt-4 text-sm">
        {quote.deal && (
          <div className="flex justify-between rounded-lg bg-emerald-50 px-3 py-2 text-emerald-800">
            <dt>
              Design a Deal ({quote.deal.label})
            </dt>
            <dd className="font-semibold">−{formatPrice(quote.deal.savings)}</dd>
          </div>
        )}
        {!quote.deal && quote.coursesCredits > 0 && quote.coursesCredits < dealTiers[0].min && (
          <p className="rounded-lg bg-surface px-3 py-2 text-muted">
            Add {dealTiers[0].min - quote.coursesCredits} more credit{dealTiers[0].min - quote.coursesCredits === 1 ? "" : "s"} of
            single courses to unlock Design a Deal pricing.
          </p>
        )}
        <div className="flex justify-between pt-1 text-base font-bold">
          <dt>Total (USD)</dt>
          <dd>{formatPrice(quote.total)}</dd>
        </div>
        <p className="text-xs text-muted">
          You&apos;ll get {quote.courseSlugs.length} course{quote.courseSlugs.length === 1 ? "" : "s"}.
        </p>
      </dl>
    </div>
  );
}

