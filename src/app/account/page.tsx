import type { Metadata } from "next";
import { ProfileForm } from "@/components/AuthForms";
import { getProfile, requireUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Account" };

export default async function AccountPage() {
  await requireUser("/account");
  const profile = await getProfile();
  if (!profile) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-navy">Account</h1>
      <p className="mt-2 text-muted">Your name and license number appear on the certificates you earn.</p>
      <div className="mt-8 rounded-2xl border border-line p-6 sm:p-8">
        <ProfileForm profile={profile} />
      </div>
    </div>
  );
}
