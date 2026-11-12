// Retired: enrollment now happens through /checkout/[slug] for signed-in learners.
export function POST() {
  return Response.json({ error: "Enrollment moved to /checkout/[slug]." }, { status: 410 });
}
