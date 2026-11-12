export function ProgressBar({ value, label }: { value: number; label?: string }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div>
      <div
        className="h-2 overflow-hidden rounded-full bg-brand-soft"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Course progress"}
      >
        <div className="h-full rounded-full bg-linear-to-r from-[#0b2a8a] to-[#2563eb]" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
