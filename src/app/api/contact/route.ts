import { validateContact } from "@/lib/validation";

export async function POST(request: Request) {
  const data = await request.json().catch(() => null);
  if (!data || typeof data !== "object") {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const errors = validateContact(data);
  if (Object.keys(errors).length) {
    return Response.json({ errors }, { status: 422 });
  }

  // TODO: forward to an inbox (e.g. Resend, SMTP) or store in a database.
  console.log("[contact]", { name: data.name, email: data.email });

  return Response.json({ ok: true });
}
