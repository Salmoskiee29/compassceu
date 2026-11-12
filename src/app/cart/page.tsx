import type { Metadata } from "next";
import Link from "next/link";
import { clearCart } from "@/app/actions/cart";
import { CartSummary } from "@/components/CartSummary";
import { getCurrentUser } from "@/lib/auth";
import { readCart } from "@/lib/cart";
import { quoteCart } from "@/lib/pricing";

export const metadata: Metadata = { title: "Your cart" };

export default async function CartPage() {
  const [ids, user] = await Promise.all([readCart(), getCurrentUser()]);
  const quote = quoteCart(ids);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-navy">Your cart</h1>

      {quote.lines.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-line p-12 text-center">
          <p className="text-muted">Your cart is empty.</p>
          <Link href="/#offers" className="mt-4 inline-block rounded-lg bg-navy-solid px-6 py-3 font-semibold text-white hover:bg-navy-solid-hover">
            Browse offers and courses
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-5">
          <section className="rounded-2xl border border-line p-6 md:col-span-3">
            <CartSummary quote={quote} editable />
            <form action={clearCart} className="mt-4">
              <button type="submit" className="text-sm text-muted hover:text-red-600">
                Empty cart
              </button>
            </form>
          </section>
          <aside className="space-y-3 md:col-span-2">
            <Link
              href="/checkout"
              className="block rounded-xl bg-navy-solid py-3.5 text-center font-semibold text-white shadow-lg shadow-navy-solid/20 hover:bg-navy-solid-hover"
            >
              Continue to checkout
            </Link>
            {!user && (
              <p className="text-center text-xs text-muted">You&apos;ll sign in or create a free account first. Your cart is saved.</p>
            )}
            <Link href="/#courses" className="block rounded-xl border border-line py-3 text-center text-sm font-medium hover:bg-surface">
              Keep browsing
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
