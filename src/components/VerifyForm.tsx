"use client";

import { useEffect, useState } from "react";

type Result =
  | { valid: true; id: string; holder: string; course: string; units?: number; issuedOn: string }
  | { valid: false };

export function VerifyForm({ initialId = "" }: { initialId?: string }) {
  const [id, setId] = useState(initialId);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  // Arriving from the home page form (/verify?id=…) checks the ID right away.
  useEffect(() => {
    if (!initialId.trim()) return;
    let cancelled = false;
    fetch(`/api/verify?id=${encodeURIComponent(initialId)}`)
      .then((res) => res.json())
      .catch(() => ({ valid: false }))
      .then((json: Result) => {
        if (!cancelled) setResult(json);
      });
    return () => {
      cancelled = true;
    };
  }, [initialId]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/verify?id=${encodeURIComponent(id)}`);
      setResult(await res.json());
    } catch {
      setResult({ valid: false });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="e.g. CCEU-2026-7K4QPZ"
          className="input flex-1 font-mono uppercase"
          aria-label="Certificate ID"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-brand px-6 py-2.5 font-medium text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {loading ? "Checking…" : "Verify"}
        </button>
      </form>

      {result &&
        (result.valid ? (
          <div className="mt-6 rounded-xl border border-green-600/30 bg-green-500/10 p-6">
            <p className="font-semibold text-green-700 dark:text-green-400">✓ Valid certificate</p>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div><dt className="text-muted">Certificate ID</dt><dd className="font-mono">{result.id}</dd></div>
              <div><dt className="text-muted">Holder</dt><dd className="font-medium">{result.holder}</dd></div>
              <div><dt className="text-muted">Course</dt><dd className="font-medium">{result.course}</dd></div>
              <div>
                <dt className="text-muted">Issued</dt>
                <dd className="font-medium">
                  {new Date(result.issuedOn).toLocaleDateString("en-US", { dateStyle: "long" })}
                  {result.units ? ` · ${result.units} CEUs` : ""}
                </dd>
              </div>
            </dl>
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-red-600/30 bg-red-500/10 p-6 text-sm">
            <p className="font-semibold text-red-700 dark:text-red-400">No certificate found</p>
            <p className="mt-1 text-muted">Double-check the ID printed on the certificate.</p>
          </div>
        ))}
    </div>
  );
}
