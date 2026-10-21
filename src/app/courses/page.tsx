import type { Metadata } from "next";
import { CourseBrowser } from "@/components/CourseBrowser";
import { type Category, categories, courses } from "@/lib/courses";

export const metadata: Metadata = {
  title: "Courses",
  description: "Browse accredited continuing education courses by profession.",
};

export default async function CoursesPage(props: PageProps<"/courses">) {
  const { category } = await props.searchParams;
  const initialCategory = categories.find((c) => c === category) as
    | Category
    | undefined;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold">All courses</h1>
      <p className="mt-2 text-muted">
        Self-paced courses that count toward your license renewal.
      </p>
      <div className="mt-8">
        {/* key resets filter state when navigating between category links */}
        <CourseBrowser
          key={initialCategory ?? "all"}
          courses={courses}
          initialCategory={initialCategory}
        />
      </div>
    </div>
  );
}
