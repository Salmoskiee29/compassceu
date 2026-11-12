// Enrollment now goes through /checkout/[slug] (see CourseEnrollCta).
// This file only keeps the shared <Field> used by ContactForm.

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
