import Link from "next/link";
import { type Course, formatPrice } from "@/lib/courses";

export function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex flex-col rounded-xl border border-line bg-background p-5 transition hover:-translate-y-0.5 hover:border-brand hover:shadow-lg"
    >
      <div className="flex items-center justify-between text-xs">
        <span className="rounded-full bg-brand-soft px-2.5 py-1 font-medium text-brand">
          {course.category}
        </span>
        <span className="text-muted">{course.level}</span>
      </div>
      <h3 className="mt-4 text-lg font-semibold group-hover:text-brand">
        {course.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm text-muted">{course.summary}</p>
      <div className="mt-auto flex items-center justify-between pt-5 text-sm">
        <span className="text-muted">
          {course.units} CEUs · {course.hours} hrs
        </span>
        <span className="font-semibold">{formatPrice(course.price)}</span>
      </div>
    </Link>
  );
}
