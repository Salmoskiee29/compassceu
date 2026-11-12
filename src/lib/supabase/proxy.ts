import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured, supabaseKey, supabaseUrl } from "./env";

/** Pages that need a signed-in learner. */
const PROTECTED = ["/dashboard", "/learn", "/account", "/checkout", "/certificates"];
/** Pages a signed-in learner doesn't need to see. */
const AUTH_PAGES = ["/sign-in", "/create-account"];

const matches = (pathname: string, prefixes: string[]) =>
  prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));

/** Refreshes the Supabase session cookie on every request and guards learner pages. */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  if (!isSupabaseConfigured) return response;

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  // Don't put code between createServerClient and getUser — it's what refreshes the session.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname, search } = request.nextUrl;

  if (!user && matches(pathname, PROTECTED)) {
    const url = new URL("/sign-in", request.url);
    url.searchParams.set("next", pathname + search);
    return withCookies(NextResponse.redirect(url), response);
  }

  if (user && matches(pathname, AUTH_PAGES)) {
    return withCookies(NextResponse.redirect(new URL("/dashboard", request.url)), response);
  }

  return response;
}

function withCookies(target: NextResponse, source: NextResponse) {
  source.cookies.getAll().forEach((c) => target.cookies.set(c));
  return target;
}
