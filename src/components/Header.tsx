"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { categories } from "@/lib/courses";

type NavItem = { label: string; items: { href: string; label: string }[] };

const nav: NavItem[] = [
  {
    label: "Courses",
    items: [
      { href: "/courses", label: "All courses" },
      ...categories.map((c) => ({ href: `/courses?category=${c}`, label: `${c} courses` })),
    ],
  },
  {
    label: "For Professionals",
    items: categories.map((c) => ({ href: `/courses?category=${c}`, label: c })),
  },
  {
    label: "About",
    items: [
      { href: "/about", label: "About us" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    label: "Resources",
    items: [
      { href: "/verify", label: "Verify a certificate" },
      { href: "/#faq", label: "FAQ" },
    ],
  },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isHome = pathname === "/";

  return (
    <header
      className={`theme-light z-40 font-display ${
        isHome
          ? "absolute inset-x-0 top-0"
          : "sticky top-0 border-b border-line bg-background/90 backdrop-blur"
      }`}
    >
      <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:h-[120px] lg:px-[5.3%]">
        <Link href="/" aria-label="CompassCEU home" className="shrink-0">
          <Image
            src="/images/compassceu-logo.png"
            alt="CompassCEU Continuing Education"
            width={900}
            height={271}
            preload
            className="h-14 w-auto lg:h-[clamp(64px,5.4vw,100px)]"
          />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex xl:gap-5">
          {nav.map((group) => (
            <div key={group.label} className="group relative">
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-md px-3 py-2 text-[15px] font-medium text-navy transition hover:text-brand"
              >
                {group.label}
                <ChevronDown />
              </button>
              <div className="invisible absolute left-0 top-full z-50 min-w-52 pt-2 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                <ul className="rounded-xl border border-line bg-background p-2 shadow-xl">
                  {group.items.map((item) => (
                    <li key={item.href + item.label}>
                      <Link
                        href={item.href}
                        className="block rounded-lg px-3 py-2 text-sm text-foreground hover:bg-surface hover:text-brand"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <Link href="/courses" aria-label="Search courses" className="p-2 text-navy hover:text-brand">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>
          </Link>
          <span className="h-8 w-px bg-line" aria-hidden="true" />
          <Link
            href="/sign-in"
            className="rounded-full border-[1.5px] border-navy px-7 py-3 text-[15px] font-medium text-navy transition hover:bg-navy/5"
          >
            Sign In
          </Link>
          <Link
            href="/create-account"
            className="rounded-lg bg-navy-solid px-8 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-navy-solid/20 transition hover:bg-navy-solid-hover"
          >
            Create Account
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="rounded-md p-2 text-navy lg:hidden"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="mx-4 rounded-2xl border border-line bg-background p-4 shadow-xl lg:hidden">
          {nav.map((group) => (
            <div key={group.label} className="border-b border-line py-2 last:border-0">
              <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-muted">{group.label}</p>
              {group.items.map((item) => (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-2 py-2 text-navy"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Link href="/sign-in" onClick={() => setOpen(false)} className="rounded-full border-[1.5px] border-navy py-2.5 text-center font-medium text-navy">
              Sign In
            </Link>
            <Link href="/create-account" onClick={() => setOpen(false)} className="rounded-lg bg-navy-solid py-2.5 text-center font-semibold text-white">
              Create Account
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

function ChevronDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
