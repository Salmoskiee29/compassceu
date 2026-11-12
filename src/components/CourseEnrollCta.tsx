import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { type Course, formatPrice } from "@/lib/courses";
import { getEnrollment } from "@/lib/learning";

export async function CourseEnrollCta({ course }: { course: Course }) {
  const user = await getCurrentUser();
  const enrolled = user ? await getEnrollment(user.id, course.slug) : null;

  if (enrolled) {
    return (
      <>
        <p className="rounded-lg bg-green-500/10 px-3 py-2 text-sm font-medium text-green-700 dark:text-green-400">
          ✓ You&apos;re enrolled in this course
        </p>
        <Link
          href={`/learn/${course.slug}`}
          className="mt-4 block rounded-lg bg-navy-solid py-3 text-center font-semibold text-white hover:bg-navy-solid-hover"
        >
          Go to course
        </Link>
      </>
    );
  }

  return (
    <>
      <Link
        href={`/checkout/${course.slug}`}
        className="block rounded-lg bg-navy-solid py-3 text-center font-semibold text-white hover:bg-navy-solid-hover"
      >
        Enroll now · {formatPrice(course.price)}
      </Link>
      {!user && (
        <p className="mt-3 text-center text-xs text-muted">
          You&apos;ll sign in or create a free account first.
        </p>
      )}
    </>
  );
}
