import type { NextRequest } from "next/server";
import { findCertificate } from "@/lib/certificates";
import { getCourse } from "@/lib/courses";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id") ?? "";
  const cert = findCertificate(id);
  if (!cert) {
    return Response.json({ valid: false }, { status: 404 });
  }

  return Response.json({
    valid: true,
    id: cert.id,
    holder: cert.holder,
    course: getCourse(cert.courseSlug)?.title ?? cert.courseSlug,
    units: getCourse(cert.courseSlug)?.units,
    issuedOn: cert.issuedOn,
  });
}
