import { NextResponse, type NextRequest } from "next/server";
import { comingSoon } from "@/lib/site";

// While in Coming Soon mode, only "/" is reachable. Everything else redirects home,
// and API routes return 404 so unfinished forms can't be used.
export function proxy(request: NextRequest) {
  if (!comingSoon) return NextResponse.next();

  const { pathname } = request.nextUrl;
  if (pathname === "/") return NextResponse.next();
  if (pathname.startsWith("/api/")) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  // Skip Next internals and static files (anything with a file extension, e.g. images).
  matcher: ["/((?!_next/static|_next/image|.*\\.[a-zA-Z0-9]+$).*)"],
};
