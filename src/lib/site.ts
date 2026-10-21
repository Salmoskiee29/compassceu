// Site-wide marketing copy and accreditation details.
// Keep claims here so they're easy to review with the client before launch.

export const hero = {
  eyebrow: "California-based continuing education",
  headline: ["Advance Your Practice.", "Make a Greater Impact."] as const,
  body: "High-quality continuing education courses for healthcare professionals in California. Earn CE credits, stay current with state requirements, and grow your career — all in one place.",
};

/**
 * Board approvals shown in the hero trust line.
 * Leave `number` as null until the client confirms it — an approval without a
 * number is not rendered, so the page never shows a made-up provider ID.
 *
 * Example: { board: "California Board of Registered Nursing", short: "CA BRN", number: "CEP 12345" }
 */
export type Approval = { board: string; short: string; number: string | null };

export const approvals: Approval[] = [
  { board: "California Board of Registered Nursing", short: "CA BRN", number: null },
];

export const confirmedApprovals = approvals.filter(
  (a): a is Approval & { number: string } => Boolean(a.number),
);

/**
 * Coming Soon mode. While on, the site shows only the Coming Soon page and every
 * other route (pages and API) redirects to it / returns 404.
 * Turn the full site on by setting COMING_SOON=false in the environment (e.g. Vercel),
 * then redeploy.
 */
export const comingSoon = process.env.COMING_SOON !== "false";
