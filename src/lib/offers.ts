// Special offers shown on the home page. Every price and end date here is a
// PLACEHOLDER until the client confirms them.
import { type Category, courses, coursesFor, getCourse } from "./courses";

export type Bundle = {
  slug: string;
  title: string;
  /** "state" = license-renewal packs; "specialty" = topic packs. */
  kind: "state" | "specialty";
  professions: Category[];
  /** ISO date (inclusive). The offer hides itself after this day. */
  endsOn: string;
  courseSlugs: string[];
  price: number;
  blurb?: string;
};

export const bundles: Bundle[] = [
  {
    slug: "california-rn-renewal-2027",
    title: "California RN Renewal 2027",
    kind: "state",
    professions: ["RN"],
    endsOn: "2027-02-28",
    price: 49,
    blurb: "A full 30-credit renewal set, including implicit bias.",
    courseSlugs: [
      "implicit-bias-in-healthcare",
      "california-nursing-practice-act",
      "workplace-violence-prevention",
      "sepsis-early-recognition",
      "opioid-safety-pain-management",
      "preventing-medication-errors",
      "diabetes-management-update",
      "heart-failure-nursing",
      "trauma-informed-care",
      "suicide-risk-recognition",
    ],
  },
  {
    slug: "california-lvn-renewal-2027",
    title: "California LVN Renewal 2027",
    kind: "state",
    professions: ["LVN"],
    endsOn: "2027-02-28",
    price: 49,
    blurb: "A full 30-credit renewal set, including implicit bias.",
    courseSlugs: [
      "clinical-pharmacology-update",
      "ethics-and-professional-practice",
      "lvn-scope-of-practice",
      "iv-therapy-fundamentals",
      "geriatric-assessment-essentials",
      "diabetic-foot-care",
      "implicit-bias-in-healthcare",
      "workplace-violence-prevention",
      "preventing-medication-errors",
      "sepsis-early-recognition",
      "opioid-safety-pain-management",
    ],
  },
  {
    slug: "cna-in-service-pack",
    title: "CNA In-Service Pack",
    kind: "state",
    professions: ["CNA"],
    endsOn: "2027-02-28",
    price: 49,
    blurb: "Core in-service topics for nursing assistants.",
    courseSlugs: [
      "infection-control-essentials",
      "resident-rights-and-dignity",
      "fall-prevention-for-cnas",
      "alzheimers-communication",
      "elder-abuse-recognition-reporting",
      "skin-care-pressure-injury-prevention",
      "nutrition-and-hydration",
    ],
  },
  {
    slug: "home-care-essentials",
    title: "Home Care Essentials",
    kind: "state",
    professions: ["HHA"],
    endsOn: "2027-02-28",
    price: 35,
    blurb: "Everyday skills for safe, respectful care at home.",
    courseSlugs: [
      "dementia-care-at-home",
      "home-safety-for-clients",
      "personal-care-skills-refresher",
      "elder-abuse-recognition-reporting",
    ],
  },
  {
    slug: "pain-management-pack",
    title: "Pain Management Pack",
    kind: "specialty",
    professions: ["RN", "LVN"],
    endsOn: "2027-04-30",
    price: 35,
    courseSlugs: ["opioid-safety-pain-management", "nonpharmacologic-pain-strategies"],
  },
  {
    slug: "mental-health-pack",
    title: "Mental Health in Practice",
    kind: "specialty",
    professions: ["RN"],
    endsOn: "2026-12-31",
    price: 49,
    courseSlugs: ["trauma-informed-care", "suicide-risk-recognition", "anxiety-depression-in-practice"],
  },
  {
    slug: "acute-care-pack",
    title: "Acute Care Essentials",
    kind: "specialty",
    professions: ["RN"],
    endsOn: "2027-01-31",
    price: 39,
    courseSlugs: ["sepsis-early-recognition", "heart-failure-nursing"],
  },
  {
    slug: "medication-safety-pack",
    title: "Medication Safety Pack",
    kind: "specialty",
    professions: ["LVN"],
    endsOn: "2027-01-31",
    price: 45,
    courseSlugs: ["clinical-pharmacology-update", "iv-therapy-fundamentals", "preventing-medication-errors"],
  },
  {
    slug: "dementia-care-pack",
    title: "Dementia Care Pack",
    kind: "specialty",
    professions: ["CNA", "HHA"],
    endsOn: "2027-01-31",
    price: 29,
    courseSlugs: ["dementia-care-at-home", "alzheimers-communication", "nutrition-and-hydration"],
  },
];

/** All-access membership: every course in the catalog. */
export const membership = {
  slug: "all-access",
  title: "All Access Membership",
  price: 79,
  endsOn: "2027-12-31",
};

/** "Design a Deal": pick any individual courses; the cart caps their price by total credits. */
export const dealTiers = [
  { min: 10, max: 15, price: 29 },
  { min: 16, max: 25, price: 39 },
  { min: 26, max: 35, price: 49 },
];

export const totalCatalogCredits = courses.reduce((s, c) => s + c.units, 0);

export function getBundle(slug: string) {
  return bundles.find((b) => b.slug === slug);
}

export function bundleCourses(b: Bundle) {
  return b.courseSlugs.flatMap((s) => {
    const c = getCourse(s);
    return c ? [c] : [];
  });
}

export function bundleCredits(b: Bundle) {
  return bundleCourses(b).reduce((s, c) => s + c.units, 0);
}

export function bundleRegularPrice(b: Bundle) {
  return bundleCourses(b).reduce((s, c) => s + c.price, 0);
}

export function isActive(endsOn: string, now = new Date()) {
  return new Date(`${endsOn}T23:59:59`) >= now;
}

export function offersFor(profession: Category, now = new Date()) {
  const active = bundles.filter((b) => b.professions.includes(profession) && isActive(b.endsOn, now));
  return {
    state: active.filter((b) => b.kind === "state"),
    specialty: active.filter((b) => b.kind === "specialty"),
    courses: coursesFor(profession),
  };
}

export function formatEndDate(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
