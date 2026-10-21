"use client";

import { useMemo, useState } from "react";
import { CourseCard } from "./CourseCard";
import { type Category, type Course, categories } from "@/lib/courses";

type Sort = "title" | "price-asc" | "price-desc" | "units";

export function CourseBrowser({
  courses,
  initialCategory,
}: {
  courses: Course[];
  initialCategory?: Category;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "All">(initialCategory ?? "All");
  const [level, setLevel] = useState<Course["level"] | "All">("All");
  const [sort, setSort] = useState<Sort>("title");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = courses.filter(
      (c) =>
        (category === "All" || c.category === category) &&
        (level === "All" || c.level === level) &&
        (!q ||
          c.title.toLowerCase().includes(q) ||
          c.summary.toLowerCase().includes(q)),
    );
    return [...filtered].sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "units":
          return b.units - a.units;
        default:
          return a.title.localeCompare(b.title);
      }
    });
  }, [courses, query, category, level, sort]);

  const reset = () => {
    setQuery("");
    setCategory("All");
    setLevel("All");
    setSort("title");
  };

  return (
    <div>
      <div className="grid gap-3 rounded-xl border border-line bg-surface p-4 sm:grid-cols-2 lg:grid-cols-4">
        <input
          type="search"
          placeholder="Search courses…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input"
          aria-label="Search courses"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Category | "All")}
          className="input"
          aria-label="Category"
        >
          <option value="All">All professions</option>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value as Course["level"] | "All")}
          className="input"
          aria-label="Level"
        >
          <option value="All">All levels</option>
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          className="input"
          aria-label="Sort by"
        >
          <option value="title">Sort: A–Z</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="units">Most CEUs</option>
        </select>
      </div>

      <p className="mt-6 text-sm text-muted">
        {results.length} course{results.length === 1 ? "" : "s"} found
      </p>

      {results.length > 0 ? (
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((c) => (
            <CourseCard key={c.slug} course={c} />
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-line p-12 text-center">
          <p className="text-muted">No courses match your filters.</p>
          <button onClick={reset} className="mt-3 text-sm font-medium text-brand hover:underline">
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
