"use client";

import { useFormStatus } from "react-dom";
import { categories, categoryNames } from "@/lib/courses";

export function TextField({
  label,
  name,
  type = "text",
  error,
  defaultValue,
  autoComplete,
  hint,
  placeholder,
  readOnly,
}: {
  label: string;
  name: string;
  type?: string;
  error?: string;
  defaultValue?: string;
  autoComplete?: string;
  hint?: string;
  placeholder?: string;
  readOnly?: boolean;
}) {
  const id = `f-${name}`;
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`input ${readOnly ? "bg-surface text-muted" : ""}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}
      />
      {error ? (
        <p id={`${id}-err`} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-1 text-xs text-muted">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

export function ProfessionSelect({ error, defaultValue }: { error?: string; defaultValue?: string }) {
  return (
    <div>
      <label htmlFor="f-profession" className="mb-1 block text-sm font-medium">
        Profession
      </label>
      <select
        id="f-profession"
        name="profession"
        defaultValue={defaultValue ?? ""}
        className="input"
        aria-invalid={!!error}
      >
        <option value="" disabled>
          Select your profession
        </option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {categoryNames[c]} ({c})
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function SubmitButton({
  children,
  pendingLabel,
  className = "",
}: {
  children: React.ReactNode;
  pendingLabel: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`rounded-lg bg-navy-solid px-6 py-3 font-semibold text-white shadow-lg shadow-navy-solid/20 transition hover:bg-navy-solid-hover disabled:opacity-60 ${className}`}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
