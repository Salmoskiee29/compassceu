import type { Metadata } from "next";
import { VerifyForm } from "@/components/VerifyForm";

export const metadata: Metadata = {
  title: "Verify a certificate",
  description: "Check the authenticity of a CompassCEU certificate.",
};

export default function VerifyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-bold">Verify a certificate</h1>
      <p className="mt-2 text-muted">
        Employers and licensing boards can confirm a certificate by entering its ID.
      </p>
      <div className="mt-8">
        <VerifyForm />
      </div>
      <p className="mt-6 text-xs text-muted">
        Demo IDs: CCEU-2026-0001, CCEU-2026-0002
      </p>
    </div>
  );
}
