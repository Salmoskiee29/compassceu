import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { completeTestCheckout } from "@/app/actions/learning";
import { SubmitButton } from "@/components/ui";
import { getProfile, requireUser } from "@/lib/auth";
import { formatPrice, getCourse } from "@/lib/courses";
import { getEnrollment } from "@/lib/learning";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage(props: PageProps<"/checkout/[slug]">) {
  const { slug } = await props.params;
  const course = getCourse(slug);
  if (!course) notFound();

  const user = await requireUser(`/checkout/${slug}`);
  if (await getEnrollment(user.id, slug)) redirect(`/learn/${slug}`);
  const profile = await getProfile();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <nav className="text-sm text-muted">
        <Link href={`/courses/${slug}`} className="hover:text-brand">
          ← Back to course
        </Link>
      </nav>
      <h1 className="mt-4 font-display text-3xl font-bold text-navy">Checkout</h1>

      <div className="mt-8 grid gap-6 md:grid-cols-5">
        <section className="rounded-2xl border border-line p-6 md:col-span-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Order summary</h2>
          <div className="mt-4 flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold">{course.title}</p>
              <p className="mt-1 text-sm text-muted">
                {course.category} · {course.units} CEUs · {course.hours} hours · certificate included
              </p>
            </div>
            <p className="font-semibold">{formatPrice(course.price)}</p>
          </div>
          <div className="mt-6 flex justify-between border-t border-line pt-4 font-semibold">
            <span>Total (USD)</span>
            <span>{formatPrice(course.price)}</span>
          </div>
          <dl className="mt-6 space-y-1 text-sm">
            <div className="flex gap-2">
              <dt className="text-muted">Learner:</dt>
              <dd>{profile?.full_name || profile?.email}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-muted">Email:</dt>
              <dd>{profile?.email}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-2xl border border-line bg-surface p-6 md:col-span-2">
          <p className="inline-block rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">
            TEST MODE
          </p>
          <p className="mt-3 text-sm text-muted">
            Payments aren&apos;t connected yet. This button enrolls you instantly so the course flow can be tested — no card
            is charged.
          </p>
          <form action={completeTestCheckout.bind(null, slug)} className="mt-6">
            <SubmitButton pendingLabel="Processing…" className="w-full">
              Complete test payment · {formatPrice(course.price)}
            </SubmitButton>
          </form>
        </section>
      </div>
    </div>
  );
}
