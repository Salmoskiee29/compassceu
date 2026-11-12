"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AddToCartButton } from "@/components/AddToCartButton";
import { type Course, type Topic, formatPrice, topics } from "@/lib/courses";

type Group = { key: string; label: string; courses: Course[] };

/** Searchable course list grouped like a catalog: Free, New, then by topic. */
export function CourseTable({ courses, cartIds }: { courses: Course[]; cartIds: string[] }) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<Topic | "All">("All");
  const inCart = new Set(cartIds);

  const available = useMemo(() => topics.filter((t) => courses.some((c) => c.topic === t)), [courses]);

  const groups = useMemo<Group[]>(() => {
    const q = query.trim().toLowerCase();
    const match = (c: Course) =>
      (topic === "All" || c.topic === topic) &&
      (!q ||
        c.title.toLowerCase().includes(q) ||
        c.topic.toLowerCase().includes(q) ||
        c.code.includes(q) ||
        c.summary.toLowerCase().includes(q));
    const list = courses.filter(match);
    const byTitle = (a: Course, b: Course) => a.title.localeCompare(b.title);

    const out: Group[] = [];
    if (topic === "All" && !q) {
      const free = list.filter((c) => c.isFree);
      const fresh = list.filter((c) => c.isNew && !c.isFree);
      if (free.length) out.push({ key: "free", label: "Free courses", courses: free.sort(byTitle) });
      if (fresh.length) out.push({ key: "new", label: "New courses", courses: fresh.sort(byTitle) });
    }
    for (const t of available) {
      const inTopic = list.filter((c) => c.topic === t);
      if (inTopic.length) out.push({ key: t, label: t, courses: inTopic.sort(byTitle) });
    }
    return out;
  }, [courses, query, topic, available]);

  const count = new Set(groups.flatMap((g) => g.courses.map((c) => c.slug))).size;

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search courses</span>
          <svg
            className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, topic or course #"
            className="input !rounded-xl !py-3 !pl-10"
          />
        </label>
        <p className="shrink-0 text-sm text-muted">
          {count} course{count === 1 ? "" : "s"}
        </p>
      </div>

      <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {(["All", ...available] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTopic(t)}
            aria-pressed={topic === t}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
              topic === t
                ? "border-navy-solid bg-navy-solid text-white"
                : "border-line bg-background text-foreground/80 hover:border-brand hover:text-brand"
            }`}
          >
            {t === "All" ? "All topics" : t}
          </button>
        ))}
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-background">
        {/* Column headings (desktop) */}
        <div className="hidden grid-cols-[72px_1fr_80px_80px_96px] items-center gap-4 border-b border-line bg-surface px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted md:grid">
          <span>#</span>
          <span>Course title</span>
          <span className="text-center">Credits</span>
          <span className="text-right">Price</span>
          <span className="text-right">Add</span>
        </div>

        {groups.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-muted">No courses match your search.</p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setTopic("All");
              }}
              className="mt-3 text-sm font-medium text-brand hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}

        {groups.map((g) => (
          <section key={g.key}>
            <h3 className="flex items-center gap-2 border-b border-line bg-[#0b1a4a] px-5 py-2.5 text-sm font-semibold text-white">
              {g.key === "free" && <Dot className="bg-emerald-400" />}
              {g.key === "new" && <Dot className="bg-[#e0b25a]" />}
              {g.label}
              <span className="font-normal text-white/60">· {g.courses.length}</span>
            </h3>
            <ul className="divide-y divide-line">
              {g.courses.map((c) => (
                <li key={c.slug} className="px-5 py-3.5 transition hover:bg-surface">
                  {/* Desktop row */}
                  <div className="hidden grid-cols-[72px_1fr_80px_80px_96px] items-center gap-4 md:grid">
                    <span className="font-mono text-xs text-muted">#{c.code}</span>
                    <Title course={c} />
                    <span className="text-center">{c.units}</span>
                    <Price course={c} />
                    <div className="flex justify-end">
                      <Action course={c} inCart={inCart.has(`c:${c.slug}`)} />
                    </div>
                  </div>
                  {/* Mobile row */}
                  <div className="md:hidden">
                    <Title course={c} />
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <p className="text-xs text-muted">
                        <span className="font-mono">#{c.code}</span> · {c.units} credit{c.units === 1 ? "" : "s"}
                      </p>
                      <div className="flex items-center gap-3">
                        <Price course={c} />
                        <Action course={c} inCart={inCart.has(`c:${c.slug}`)} />
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

function Title({ course: c }: { course: Course }) {
  return (
    <div className="min-w-0">
      <Link href={`/courses/${c.slug}`} className="font-medium leading-snug hover:text-brand hover:underline">
        {c.title}
      </Link>
      <p className="mt-0.5 text-xs text-muted">
        {c.level}
        {c.isNew && <span className="ml-2 rounded bg-[#f6ecd9] px-1.5 py-0.5 font-semibold text-[#8a5a12]">NEW</span>}
      </p>
    </div>
  );
}

function Price({ course: c }: { course: Course }) {
  return (
    <span className={`text-right font-semibold ${c.price === 0 ? "text-emerald-700" : ""}`}>
      {c.price === 0 ? "Free" : formatPrice(c.price)}
    </span>
  );
}

function Action({ course: c, inCart }: { course: Course; inCart: boolean }) {
  if (c.price === 0) {
    return (
      <Link
        href={`/courses/${c.slug}`}
        className="inline-flex items-center rounded-lg bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
      >
        Start
      </Link>
    );
  }
  return <AddToCartButton item={`c:${c.slug}`} inCart={inCart} variant="link" />;
}

function Dot({ className }: { className: string }) {
  return <span className={`h-2 w-2 rounded-full ${className}`} aria-hidden="true" />;
}
