import type { Metadata } from "next";
import { VerifyForm } from "@/components/VerifyForm";

export const metadata: Metadata = {
  title: "Verify a certificate",
  description: "Check the authenticity of a CompassCEU certificate.",
};

export default async function VerifyPage(props: PageProps<"/verify">) {
  const { id } = await props.searchParams;
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-bold">Verify a certificate</h1>
      <p className="mt-2 text-muted">
        Employers and licensing boards can confirm a certificate by entering its ID (for example, CCEU-2026-7K4QPZ).
      </p>
      <div className="mt-8">
        <VerifyForm initialId={typeof id === "string" ? id : ""} />
      </div>
    </div>
  );
}
