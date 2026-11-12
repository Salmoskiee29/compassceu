import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/AuthShell";
import { SignInForm } from "@/components/AuthForms";
import { safeNext } from "@/lib/validation";

export const metadata: Metadata = { title: "Sign in" };

export default async function SignInPage(props: PageProps<"/sign-in">) {
  const sp = await props.searchParams;
  const next = safeNext(sp.next);

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue your courses and download certificates."
      footer={
        <>
          New to CompassCEU?{" "}
          <Link href={`/create-account?next=${encodeURIComponent(next)}`} className="font-medium text-brand hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      {sp.error === "confirm" && (
        <p className="mb-4 rounded-lg border border-red-600/30 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-400">
          That confirmation link is invalid or has expired. Try signing in, or create your account again.
        </p>
      )}
      <SignInForm next={next} />
    </AuthShell>
  );
}
