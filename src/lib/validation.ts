import { categories } from "./courses";

export type FieldErrors = Partial<Record<string, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LICENSE_RE = /^[A-Za-z0-9-]{4,20}$/;

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

export type ProfileInput = { full_name: string; profession: string; license_number: string };

export function validateProfile(data: ProfileInput): FieldErrors {
  const errors: FieldErrors = {};
  if (data.full_name.length < 2) errors.full_name = "Enter your full name as it should appear on certificates.";
  if (data.profession && !categories.includes(data.profession as never))
    errors.profession = "Choose your profession.";
  if (data.license_number && !LICENSE_RE.test(data.license_number))
    errors.license_number = "License number should be 4–20 letters, digits, or dashes.";
  return errors;
}

export function validateSignUp(data: ProfileInput & { email: string; password: string }): FieldErrors {
  const errors = validateProfile(data);
  if (!data.profession) errors.profession = "Choose your profession.";
  if (!EMAIL_RE.test(data.email)) errors.email = "Please enter a valid email.";
  if (data.password.length < 8) errors.password = "Use at least 8 characters.";
  return errors;
}

/** Only allow same-site relative redirects (blocks `//evil.com` and absolute URLs). */
export function safeNext(value: unknown, fallback = "/dashboard") {
  const s = typeof value === "string" ? value : "";
  return s.startsWith("/") && !s.startsWith("//") && !s.startsWith("/\\") ? s : fallback;
}
