import Link from "next/link";
import { categories, categoryNames } from "@/lib/courses";
import { Logo } from "./Logo";

const columns = [
  {
    title: "Courses",
    links: [
      { href: "/courses", label: "All courses" },
      ...categories.map((c) => ({ href: `/courses?category=${c}`, label: `${categoryNames[c]} (${c})` })),
    ],
  },
  {
    title: "Learners",
    links: [
      { href: "/create-account", label: "Create account" },
      { href: "/sign-in", label: "Sign in" },
      { href: "/dashboard", label: "My Courses" },
      { href: "/verify", label: "Verify a certificate" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About us" },
      { href: "/contact", label: "Contact" },
      { href: "/contact", label: "Group rates" },
      { href: "/#faq", label: "FAQ" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 font-display text-lg font-bold">
            <Logo size={28} />
            <span>
              Compass<span className="text-gold">CEU</span>
            </span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted">
            Online continuing education for California healthcare professionals.
          </p>
          <ul className="mt-5 space-y-1 text-sm text-muted">
            <li>hello@compassceu.example</li>
            <li>Mon–Fri, 9:00 AM – 5:00 PM</li>
          </ul>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-semibold">{col.title}</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-muted sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} CompassCEU. All rights reserved.</p>
          <p>California-based continuing education</p>
        </div>
      </div>
    </footer>
  );
}
