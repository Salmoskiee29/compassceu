import type { NextRequest } from "next/server";
import { getCourse } from "@/lib/courses";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

type Row = { id: string; holder_name: string; course_slug: string; ceus: number; issued_at: string };

export async function GET(request: NextRequest) {
  const id = (request.nextUrl.searchParams.get("id") ?? "").trim();
  if (!id || !isSupabaseConfigured) {
    return Response.json({ valid: false }, { status: 404 });
  }

  // verify_certificate is a security-definer function exposing only public fields.
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("verify_certificate", { cert_id: id });
  const cert = (Array.isArray(data) ? data[0] : null) as Row | null;

  if (error || !cert) {
    return Response.json({ valid: false }, { status: 404 });
  }

  const course = getCourse(cert.course_slug);
  return Response.json({
    valid: true,
    id: cert.id,
    holder: cert.holder_name,
    course: course?.title ?? cert.course_slug,
    units: Number(cert.ceus),
    issuedOn: cert.issued_at,
  });
}
