"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { QuizState } from "@/app/actions/learning";
import type { PublicQuizQuestion } from "@/lib/content";
import { SubmitButton } from "./ui";

export function QuizForm({
  slug,
  questions,
  passPercent,
  action,
}: {
  slug: string;
  questions: PublicQuizQuestion[];
  passPercent: number;
  action: (prev: QuizState, formData: FormData) => Promise<QuizState>;
}) {
  const [state, formAction] = useActionState(action, undefined);

  if (state?.passed && state.certificateId) {
    return (
      <div className="rounded-2xl border border-green-600/30 bg-green-500/10 p-8 text-center">
        <p className="text-4xl" aria-hidden="true">
          🎓
        </p>
        <h2 className="mt-3 text-2xl font-bold text-green-700 dark:text-green-400">You passed!</h2>
        <p className="mt-2 text-muted">
          Score: {state.score}/{state.total}. Your certificate has been issued.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href={`/certificates/${state.certificateId}`}
            className="rounded-lg bg-navy-solid px-6 py-3 font-semibold text-white hover:bg-navy-solid-hover"
          >
            View certificate
          </Link>
          <Link href="/dashboard" className="rounded-lg border border-navy px-6 py-3 font-semibold text-navy hover:bg-navy/5">
            Back to My Courses
          </Link>
        </div>
      </div>
    );
  }

  const failed = state && !state.error && !state.passed;
  const missed = new Set(failed ? state.missed : []);

  return (
    <>
      {failed && (
        <div role="alert" className="mb-6 rounded-xl border border-red-600/30 bg-red-500/10 p-5 text-sm">
          <p className="font-semibold text-red-700 dark:text-red-400">
            Score: {state.score}/{state.total} — not quite. You need {passPercent}% to pass.
          </p>
          <p className="mt-1 text-muted">
            The questions you missed are marked below. Review the lessons if you need to, then try again.
          </p>
          <div className="mt-3">
            <Link href={`/learn/${slug}`} className="font-medium text-brand hover:underline">
              Review lessons
            </Link>
          </div>
        </div>
      )}

      <form action={formAction} className="space-y-6">
        {questions.map((q, i) => (
          <fieldset
            key={q.id}
            className={`rounded-xl border p-5 ${missed.has(q.id) ? "border-red-600/40 bg-red-500/5" : "border-line"}`}
          >
            <legend className="sr-only">Question {i + 1}</legend>
            <p className="font-medium">
              <span className="text-muted">{i + 1}.</span> {q.prompt}
              {missed.has(q.id) && <span className="ml-2 text-xs font-semibold text-red-600">Incorrect</span>}
            </p>
            <div className="mt-4 space-y-2">
              {q.options.map((opt, j) => (
                <label
                  key={j}
                  className="flex cursor-pointer items-start gap-3 rounded-lg border border-line p-3 text-sm transition hover:border-brand has-checked:border-brand has-checked:bg-brand-soft"
                >
                  <input type="radio" name={q.id} value={j} required className="mt-0.5 accent-[var(--brand)]" />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}

        {state?.error && (
          <p role="alert" className="rounded-lg border border-red-600/30 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-400">
            {state.error}
          </p>
        )}

        <SubmitButton pendingLabel="Grading…">Submit answers</SubmitButton>
      </form>
    </>
  );
}
