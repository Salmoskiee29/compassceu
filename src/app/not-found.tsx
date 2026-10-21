import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-sm font-semibold text-brand">404</p>
      <h1 className="mt-2 text-3xl font-bold">Looks like you&apos;re off course</h1>
      <p className="mt-3 text-muted">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/" className="mt-8 inline-block rounded-lg bg-brand px-5 py-3 font-medium text-white hover:bg-brand-dark">
        Back to home
      </Link>
    </div>
  );
}
