"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { readCart, writeCart } from "@/lib/cart";
import { getCourse } from "@/lib/courses";
import { isValidItem, quoteCart } from "@/lib/pricing";
import { createAdminClient } from "@/lib/supabase/admin";

export async function addToCart(formData: FormData) {
  const id = String(formData.get("item") ?? "");
  if (!isValidItem(id)) return;
  await writeCart([...(await readCart()), id]);
  revalidatePath("/", "layout");
}

export async function removeFromCart(formData: FormData) {
  const id = String(formData.get("item") ?? "");
  await writeCart((await readCart()).filter((i) => i !== id));
  revalidatePath("/", "layout");
}

export async function clearCart() {
  await writeCart([]);
  revalidatePath("/", "layout");
}

/**
 * MOCK CART CHECKOUT — no money moves. Recomputes the total on the server, enrolls the
 * learner in every course the cart covers, and empties the cart. Replace with a real
 * payment provider (e.g. Stripe Checkout + webhook) before launch.
 */
export async function completeTestCartCheckout() {
  const user = await requireUser("/checkout");
  const quote = quoteCart(await readCart());
  if (quote.courseSlugs.length === 0) redirect("/cart");

  // Spread the order total across courses by their list price (for reporting).
  const listTotal = quote.courseSlugs.reduce((s, slug) => s + (getCourse(slug)?.price ?? 0), 0);
  const ref = `TEST-${randomBytes(5).toString("hex").toUpperCase()}`;
  const rows = quote.courseSlugs.map((slug) => {
    const list = getCourse(slug)?.price ?? 0;
    const share = listTotal > 0 ? (quote.total * list) / listTotal : 0;
    return {
      user_id: user.id,
      course_slug: slug,
      amount_cents: Math.round(share * 100),
      currency: "USD",
      payment_ref: ref,
      status: "paid",
    };
  });

  const admin = createAdminClient();
  const { error } = await admin
    .from("enrollments")
    .upsert(rows, { onConflict: "user_id,course_slug", ignoreDuplicates: true });
  if (error) throw new Error(`Enrollment failed: ${error.message}`);

  await writeCart([]);
  revalidatePath("/", "layout");
  redirect("/dashboard?welcome=1");
}
