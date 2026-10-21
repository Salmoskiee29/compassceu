import { getCourse } from "@/lib/courses";
import { validateEnrollment } from "@/lib/validation";

export async function POST(request: Request) {
  const data = await request.json().catch(() => null);
  if (!data || typeof data !== "object") {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const errors = validateEnrollment(data);
  if (!getCourse(String(data.course))) errors.course = "Unknown course.";
  if (Object.keys(errors).length) {
    return Response.json({ errors }, { status: 422 });
  }

  // TODO: persist enrollment (database) and send confirmation email.
  console.log("[enroll]", { name: data.name, email: data.email, course: data.course });

  return Response.json({ ok: true }, { status: 201 });
}
