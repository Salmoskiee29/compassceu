import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { completeTestCartCheckout } from "@/app/actions/cart";
import { CartSummary } from "@/components/CartSummary";
import { SubmitButton } from "@/components/ui";
import { getProfile, requireUser } from "@/lib/auth";
import { readCart } from "@/lib/cart";
import { formatPrice } from "@/lib/courses";
import { quoteCart } from "@/lib/pricing";

export const metadata: Metadata = { title: "Checkout" };

export default async function CartCheckoutPage() {
  await requireUser("/checkout");
  const quote = quoteCart(await readCart());
  if (quote.lines.length === 0) redirect("/cart");
  const profile = await getProfile();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Link href="/cart" className="text-sm text-muted hover:text-brand">
        ← Back to cart
      </Link>
      <h1 className="mt-4 font-display text-3xl font-bold text-navy">Checkout</h1>

      <div className="mt-8 grid gap-6 md:grid-cols-5">
        <section className="rounded-2xl border border-line p-6 md:col-span-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Order summary</h2>
          <div className="mt-2">
            <CartSummary quote={quote} editable={false} />
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
          <p className="inline-block rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">TEST MODE</p>
          <p className="mt-3 text-sm text-muted">
            Payments aren&apos;t connected yet. This button enrolls you in every course in your order so the flow can be
            tested. No card is charged.
          </p>
          <form action={completeTestCartCheckout} className="mt-6">
            <SubmitButton pendingLabel="Processing…" className="w-full">
              Complete test payment · {formatPrice(quote.total)}
            </SubmitButton>
          </form>
        </section>
      </div>
    </div>
  );
}
