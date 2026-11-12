"use client";

import { useActionState } from "react";
import { signIn, signUp, updateProfile } from "@/app/actions/auth";
import type { Profile } from "@/lib/auth";
import { ProfessionSelect, SubmitButton, TextField } from "./ui";

function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-lg border border-red-600/30 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-400">
      {message}
    </p>
  );
}

export function SignInForm({ next }: { next: string }) {
  const [state, action] = useActionState(signIn, undefined);
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <TextField label="Email" name="email" type="email" autoComplete="email" defaultValue={state?.values?.email} />
      <TextField label="Password" name="password" type="password" autoComplete="current-password" />
      <FormError message={state?.error} />
      <SubmitButton pendingLabel="Signing in…" className="w-full">
        Sign in
      </SubmitButton>
    </form>
  );
}

export function SignUpForm({ next }: { next: string }) {
  const [state, action] = useActionState(signUp, undefined);
  const v = state?.values ?? {};
  const e = state?.fieldErrors ?? {};

  if (state?.message) {
    return (
      <div className="rounded-xl bg-brand-soft p-5">
        <p className="font-semibold text-brand">Check your email</p>
        <p className="mt-1 text-sm text-muted">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4" noValidate>
      <input type="hidden" name="next" value={next} />
      <TextField
        label="Full name"
        name="full_name"
        autoComplete="name"
        defaultValue={v.full_name}
        error={e.full_name}
        hint="As it should appear on your certificates."
      />
      <TextField label="Email" name="email" type="email" autoComplete="email" defaultValue={v.email} error={e.email} />
      <TextField
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        error={e.password}
        hint="At least 8 characters."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <ProfessionSelect key={v.profession} defaultValue={v.profession} error={e.profession} />
        <TextField
          label="CA license no. (optional)"
          name="license_number"
          defaultValue={v.license_number}
          error={e.license_number}
          placeholder="e.g. 95012345"
        />
      </div>
      <FormError message={state?.error} />
      <SubmitButton pendingLabel="Creating account…" className="w-full">
        Create account
      </SubmitButton>
    </form>
  );
}

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, action] = useActionState(updateProfile, undefined);
  const v = state?.values ?? {
    full_name: profile.full_name,
    profession: profile.profession ?? "",
    license_number: profile.license_number ?? "",
  };
  const e = state?.fieldErrors ?? {};

  return (
    <form action={action} className="space-y-4" noValidate>
      <TextField label="Email" name="email_display" defaultValue={profile.email} readOnly hint="Contact support to change your email." />
      <TextField
        label="Full name"
        name="full_name"
        autoComplete="name"
        defaultValue={v.full_name}
        error={e.full_name}
        hint="Used on new certificates."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <ProfessionSelect key={v.profession} defaultValue={v.profession} error={e.profession} />
        <TextField label="CA license no." name="license_number" defaultValue={v.license_number} error={e.license_number} />
      </div>
      <FormError message={state?.error} />
      {state?.message && <p className="text-sm font-medium text-green-700 dark:text-green-400">✓ {state.message}</p>}
      <SubmitButton pendingLabel="Saving…">Save changes</SubmitButton>
    </form>
  );
}
