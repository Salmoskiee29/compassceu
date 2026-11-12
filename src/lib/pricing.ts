// Cart pricing. Pure functions, used by the cart page AND the checkout action, so the
// server always recomputes the total itself and never trusts a price from the browser.
import { type Course, courses, formatPrice, getCourse } from "./courses";
import { bundleCourses, dealTiers, getBundle, isActive, membership, type Bundle } from "./offers";

/** Cart item ids: "c:<course slug>", "b:<bundle slug>", or "m:all-access". */
export type CartItemId = `c:${string}` | `b:${string}` | `m:${string}`;

export type PricedLine =
  | { id: CartItemId; kind: "course"; course: Course; price: number; includedIn?: string }
  | { id: CartItemId; kind: "bundle"; bundle: Bundle; price: number; includedIn?: string }
  | { id: CartItemId; kind: "membership"; title: string; price: number };

export type CartQuote = {
  lines: PricedLine[];
  /** Individually added courses (not covered by a bundle or membership). */
  coursesSubtotal: number;
  coursesCredits: number;
  deal?: { label: string; price: number; savings: number };
  total: number;
  /** Every course the learner gets on checkout. */
  courseSlugs: string[];
};

export function isValidItem(id: string): id is CartItemId {
  const [kind, slug] = [id.slice(0, 2), id.slice(2)];
  if (kind === "c:") return Boolean(getCourse(slug));
  if (kind === "b:") {
    const b = getBundle(slug);
    return Boolean(b && isActive(b.endsOn));
  }
  if (kind === "m:") return slug === membership.slug && isActive(membership.endsOn);
  return false;
}

export function quoteCart(ids: string[]): CartQuote {
  const items = [...new Set(ids)].filter(isValidItem);
  const hasMembership = items.includes(`m:${membership.slug}`);
  const bundleList = items.filter((i) => i.startsWith("b:")).map((i) => getBundle(i.slice(2))!);
  const coveredBy = new Map<string, string>();
  bundleList.forEach((b) => b.courseSlugs.forEach((s) => coveredBy.has(s) || coveredBy.set(s, b.title)));

  const lines: PricedLine[] = [];
  let coursesSubtotal = 0;
  let coursesCredits = 0;

  if (hasMembership) {
    lines.push({ id: `m:${membership.slug}`, kind: "membership", title: membership.title, price: membership.price });
  }
  for (const b of bundleList) {
    lines.push(
      hasMembership
        ? { id: `b:${b.slug}`, kind: "bundle", bundle: b, price: 0, includedIn: membership.title }
        : { id: `b:${b.slug}`, kind: "bundle", bundle: b, price: b.price },
    );
  }
  for (const id of items.filter((i) => i.startsWith("c:"))) {
    const course = getCourse(id.slice(2))!;
    const includedIn = hasMembership ? membership.title : coveredBy.get(course.slug);
    if (includedIn) {
      lines.push({ id: id as CartItemId, kind: "course", course, price: 0, includedIn });
    } else {
      lines.push({ id: id as CartItemId, kind: "course", course, price: course.price });
      coursesSubtotal += course.price;
      coursesCredits += course.units;
    }
  }

  // Design a Deal: cap the individually-added courses at the matching tier price.
  // Above the top tier the price is capped at the All Access price (or the top tier price
  // if the membership offer has ended), so adding courses never makes the cart jump back
  // to full price.
  const topTier = dealTiers[dealTiers.length - 1];
  const tier = dealTiers.find((t) => coursesCredits >= t.min && coursesCredits <= t.max);
  const capped: { label: string; price: number } | undefined = tier
    ? { label: `${tier.min}\u2013${tier.max} credits for ${formatPrice(tier.price)}`, price: tier.price }
    : coursesCredits > topTier.max
      ? {
          label: `more than ${topTier.max} credits`,
          price: isActive(membership.endsOn) ? Math.max(membership.price, topTier.price) : topTier.price,
        }
      : undefined;
  const deal =
    capped && capped.price < coursesSubtotal ? { ...capped, savings: coursesSubtotal - capped.price } : undefined;
  const coursesTotal = deal ? deal.price : coursesSubtotal;

  const total = hasMembership
    ? membership.price
    : bundleList.reduce((s, b) => s + b.price, 0) + coursesTotal;

  const slugs = new Set<string>();
  if (hasMembership) courses.forEach((c) => slugs.add(c.slug));
  bundleList.forEach((b) => bundleCourses(b).forEach((c) => slugs.add(c.slug)));
  items.filter((i) => i.startsWith("c:")).forEach((i) => slugs.add(i.slice(2)));

  return { lines, coursesSubtotal, coursesCredits, deal, total, courseSlugs: [...slugs] };
}
