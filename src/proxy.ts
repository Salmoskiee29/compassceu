import { NextResponse, type NextRequest } from "next/server";
import { comingSoon } from "@/lib/site";
import { updateSession } from "@/lib/supabase/proxy";

// While in Coming Soon mode, only "/" is reachable. Everything else redirects home,
// and API routes return 404 so unfinished forms can't be used.
// With the full site on, every request refreshes the Supabase session and
// learner-only pages redirect to /sign-in.
export async function proxy(request: NextRequest) {
  if (comingSoon) {
    const { pathname } = request.nextUrl;
    if (pathname === "/") return NextResponse.next();
    if (pathname.startsWith("/api/")) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  return updateSession(request);
}

export const config = {
  // Skip Next internals and static files (anything with a file extension, e.g. images).
  matcher: ["/((?!_next/static|_next/image|.*\\.[a-zA-Z0-9]+$).*)"],
};
