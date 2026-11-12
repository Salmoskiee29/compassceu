import "server-only";
import { cookies } from "next/headers";
import { type CartItemId, isValidItem } from "./pricing";

export const CART_COOKIE = "cceu_cart";
const MAX_ITEMS = 60;

/** Cart item ids from the cart cookie (invalid or expired items are dropped). */
export async function readCart(): Promise<CartItemId[]> {
  const raw = (await cookies()).get(CART_COOKIE)?.value;
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return [...new Set(parsed.filter((x): x is string => typeof x === "string"))].filter(isValidItem).slice(0, MAX_ITEMS);
  } catch {
    return [];
  }
}

export async function writeCart(ids: string[]) {
  const store = await cookies();
  const clean = [...new Set(ids)].filter(isValidItem).slice(0, MAX_ITEMS);
  if (clean.length === 0) {
    store.delete(CART_COOKIE);
    return;
  }
  store.set(CART_COOKIE, JSON.stringify(clean), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}
