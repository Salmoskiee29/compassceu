import { isSupabaseConfigured, notConfiguredMessage } from "@/lib/supabase/env";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="bg-surface px-4 py-16">
      <div className="mx-auto max-w-md">
        {!isSupabaseConfigured && (
          <p className="mb-6 rounded-lg border border-accent/40 bg-accent/10 px-4 py-3 text-sm">
            {notConfiguredMessage}
          </p>
        )}
        <div className="rounded-2xl border border-line bg-background p-6 shadow-sm sm:p-8">
          <h1 className="font-display text-2xl font-bold text-navy">{title}</h1>
          <p className="mt-1 text-sm text-muted">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>
        {footer && <div className="mt-6 text-center text-sm text-muted">{footer}</div>}
      </div>
    </div>
  );
}
