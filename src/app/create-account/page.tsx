import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/AuthShell";
import { SignUpForm } from "@/components/AuthForms";
import { safeNext } from "@/lib/validation";

export const metadata: Metadata = { title: "Create account" };

export default async function CreateAccountPage(props: PageProps<"/create-account">) {
  const sp = await props.searchParams;
  const next = safeNext(sp.next);

  return (
    <AuthShell
      title="Create your account"
      subtitle="Track your CE progress and keep every certificate in one place."
      footer={
        <>
          Already have an account?{" "}
          <Link href={`/sign-in?next=${encodeURIComponent(next)}`} className="font-medium text-brand hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <SignUpForm next={next} />
    </AuthShell>
  );
}
