"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { isSupabaseConfigured, notConfiguredMessage } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import {
  type FieldErrors,
  type ProfileInput,
  safeNext,
  validateProfile,
  validateSignUp,
} from "@/lib/validation";

export type FormState =
  | {
      error?: string;
      message?: string;
      fieldErrors?: FieldErrors;
      values?: Record<string, string>;
    }
  | undefined;

const str = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();

async function siteOrigin() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export async function signIn(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!isSupabaseConfigured) return { error: notConfiguredMessage };

  const email = str(formData, "email");
  const password = String(formData.get("password") ?? "");
  const values = { email };
  if (!email || !password) return { error: "Enter your email and password.", values };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    const unconfirmed = error.code === "email_not_confirmed";
    return {
      error: unconfirmed
        ? "Please confirm your email first — check your inbox for the link."
        : "Incorrect email or password.",
      values,
    };
  }

  revalidatePath("/", "layout");
  redirect(safeNext(formData.get("next")));
}

export async function signUp(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!isSupabaseConfigured) return { error: notConfiguredMessage };

  const input = {
    full_name: str(formData, "full_name"),
    email: str(formData, "email"),
    password: String(formData.get("password") ?? ""),
    profession: str(formData, "profession"),
    license_number: str(formData, "license_number").toUpperCase(),
  };
  const values = {
    full_name: input.full_name,
    email: input.email,
    profession: input.profession,
    license_number: input.license_number,
  };

  const fieldErrors = validateSignUp(input);
  if (Object.keys(fieldErrors).length) return { fieldErrors, values };

  const next = safeNext(formData.get("next"));
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        full_name: input.full_name,
        profession: input.profession,
        license_number: input.license_number,
      },
      emailRedirectTo: `${await siteOrigin()}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error) return { error: error.message, values };

  // Email confirmation turned off in Supabase → we already have a session.
  if (data.session) {
    revalidatePath("/", "layout");
    redirect(next);
  }

  return {
    message: `We sent a confirmation link to ${input.email}. Open it to activate your account, then you'll be signed in automatically.`,
  };
}

export async function signOut() {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  revalidatePath("/", "layout");
  redirect("/");
}

export async function updateProfile(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser("/account");

  const input: ProfileInput = {
    full_name: str(formData, "full_name"),
    profession: str(formData, "profession"),
    license_number: str(formData, "license_number").toUpperCase(),
  };
  const values = { ...input };

  const fieldErrors = validateProfile(input);
  if (Object.keys(fieldErrors).length) return { fieldErrors, values };

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: input.full_name,
      profession: input.profession || null,
      license_number: input.license_number || null,
    })
    .eq("id", user.id);

  if (error) return { error: "Couldn't save your profile. Please try again.", values };

  revalidatePath("/", "layout");
  return { message: "Profile saved.", values };
}
