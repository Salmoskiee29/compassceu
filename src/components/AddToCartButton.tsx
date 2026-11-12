"use client";

import Link from "next/link";
import { useFormStatus } from "react-dom";
import { addToCart } from "@/app/actions/cart";

/** Adds an item to the cart (works without JavaScript too). Shows "In cart" once added. */
export function AddToCartButton({
  item,
  inCart,
  label = "Add to cart",
  variant = "solid",
  className = "",
}: {
  item: string;
  inCart: boolean;
  label?: string;
  variant?: "solid" | "link";
  className?: string;
}) {
  if (inCart) {
    return (
      <Link
        href="/cart"
        className={
          variant === "solid"
            ? `flex items-center justify-center gap-2 rounded-xl bg-emerald-50 py-3 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200 transition hover:bg-emerald-100 ${className}`
            : `inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:underline ${className}`
        }
      >
        <Check /> In cart
      </Link>
    );
  }
  return (
    <form action={addToCart} className={variant === "solid" ? "contents" : "inline"}>
      <input type="hidden" name="item" value={item} />
      <Submit label={label} variant={variant} className={className} />
    </form>
  );
}

function Submit({ label, variant, className }: { label: string; variant: "solid" | "link"; className: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={
        variant === "solid"
          ? `flex w-full items-center justify-center gap-2 rounded-xl bg-navy-solid py-3 text-sm font-semibold text-white shadow-md shadow-navy-solid/20 transition hover:bg-navy-solid-hover disabled:opacity-60 ${className}`
          : `inline-flex items-center gap-1 rounded-lg bg-brand-soft px-3 py-1.5 text-sm font-semibold text-brand transition hover:bg-brand hover:text-white disabled:opacity-60 ${className}`
      }
    >
      {pending ? "Adding…" : variant === "solid" ? label : <><Plus /> Add</>}
    </button>
  );
}

function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="m5 12 5 5L20 7" />
    </svg>
  );
}
function Plus() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
