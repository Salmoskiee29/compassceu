export type FieldErrors = Partial<Record<string, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEnrollment(data: Record<string, unknown>): FieldErrors {
  const errors: FieldErrors = {};
  const name = String(data.name ?? "").trim();
  const email = String(data.email ?? "").trim();
  const license = String(data.license ?? "").trim();

  if (name.length < 2) errors.name = "Please enter your full name.";
  if (!EMAIL_RE.test(email)) errors.email = "Please enter a valid email.";
  if (license && !/^[A-Za-z0-9-]{4,20}$/.test(license))
    errors.license = "License number should be 4–20 letters, digits, or dashes.";
  if (!data.course) errors.course = "Missing course.";
  return errors;
}

export function validateContact(data: Record<string, unknown>): FieldErrors {
  const errors: FieldErrors = {};
  const name = String(data.name ?? "").trim();
  const email = String(data.email ?? "").trim();
  const message = String(data.message ?? "").trim();

  if (name.length < 2) errors.name = "Please enter your name.";
  if (!EMAIL_RE.test(email)) errors.email = "Please enter a valid email.";
  if (message.length < 10) errors.message = "Message should be at least 10 characters.";
  return errors;
}
