"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-lg bg-navy-solid px-6 py-3 font-semibold text-white hover:bg-navy-solid-hover"
    >
      Print / Save as PDF
    </button>
  );
}
