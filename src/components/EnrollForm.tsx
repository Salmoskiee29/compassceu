"use client";

import { useState } from "react";
import { type FieldErrors, validateEnrollment } from "@/lib/validation";

type Status = "idle" | "submitting" | "success" | "error";

export function EnrollForm({
  courseSlug,
  courseTitle,
}: {
  courseSlug: string;
  courseTitle: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = { ...Object.fromEntries(new FormData(e.currentTarget)), course: courseSlug };

    const clientErrors = validateEnrollment(data);
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setErrors(json.errors ?? {});
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg bg-brand-soft p-4 text-sm">
        <p className="font-semibold text-brand">You&apos;re enrolled! 🎉</p>
        <p className="mt-1 text-muted">
          We&apos;ve sent access details for <strong>{courseTitle}</strong> to your email.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-3">
      <Field label="Full name" name="name" error={errors.name} />
      <Field label="Email" name="email" type="email" error={errors.email} />
      <Field label="PRC license no. (optional)" name="license" error={errors.license} />
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-lg bg-brand py-3 font-medium text-white hover:bg-brand-dark disabled:opacity-60"
      >
        {status === "submitting" ? "Enrolling…" : "Enroll now"}
      </button>
      {status === "error" && !Object.keys(errors).length && (
        <p className="text-sm text-red-600">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}

export function Field({
  label,
  name,
  type = "text",
  error,
  textarea,
}: {
  label: string;
  name: string;
  type?: string;
  error?: string;
  textarea?: boolean;
}) {
  const id = `f-${name}`;
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium">
        {label}
      </label>
      {textarea ? (
        <textarea id={id} name={name} rows={5} className="input" aria-invalid={!!error} />
      ) : (
        <input id={id} name={name} type={type} className="input" aria-invalid={!!error} />
      )}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
