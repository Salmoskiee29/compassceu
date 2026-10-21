"use client";

import { useState } from "react";
import { Field } from "./EnrollForm";
import { type FieldErrors, validateContact } from "@/lib/validation";

export function ContactForm() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const clientErrors = validateContact(data);
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        setErrors((await res.json()).errors ?? {});
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-xl bg-brand-soft p-6">
        <p className="font-semibold text-brand">Message sent!</p>
        <p className="mt-1 text-sm text-muted">We&apos;ll get back to you within one business day.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" error={errors.name} />
        <Field label="Email" name="email" type="email" error={errors.email} />
      </div>
      <Field label="Message" name="message" textarea error={errors.message} />
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-lg bg-brand px-6 py-3 font-medium text-white hover:bg-brand-dark disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
      {status === "error" && !Object.keys(errors).length && (
        <p className="text-sm text-red-600">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}
