import Link from "next/link";
import type { Lesson } from "@/lib/content";

export function LessonList({
  slug,
  lessons,
  done,
  currentId,
  quizUnlocked,
  passed,
}: {
  slug: string;
  lessons: Lesson[];
  done: Set<string>;
  currentId?: string;
  quizUnlocked: boolean;
  passed: boolean;
}) {
  return (
    <ol className="divide-y divide-line rounded-xl border border-line">
      {lessons.map((l, i) => {
        const isDone = done.has(l.id);
        const isCurrent = l.id === currentId;
        return (
          <li key={l.id}>
            <Link
              href={`/learn/${slug}/${l.id}`}
              aria-current={isCurrent ? "page" : undefined}
              className={`flex items-center gap-3 p-4 text-sm transition hover:bg-surface ${isCurrent ? "bg-brand-soft font-semibold" : ""}`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  isDone ? "bg-green-600 text-white" : "bg-brand-soft text-brand"
                }`}
                aria-hidden="true"
              >
                {isDone ? "✓" : i + 1}
              </span>
              <span className="flex-1">{l.title}</span>
              <span className="sr-only">{isDone ? "(completed)" : ""}</span>
            </Link>
          </li>
        );
      })}
      <li>
        {quizUnlocked ? (
          <Link
            href={`/learn/${slug}/quiz`}
            aria-current={currentId === "quiz" ? "page" : undefined}
            className={`flex items-center gap-3 p-4 text-sm transition hover:bg-surface ${currentId === "quiz" ? "bg-brand-soft font-semibold" : ""}`}
          >
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                passed ? "bg-green-600 text-white" : "bg-gold/15 text-gold"
              }`}
              aria-hidden="true"
            >
              {passed ? "✓" : "★"}
            </span>
            <span className="flex-1">Final assessment</span>
          </Link>
        ) : (
          <div className="flex items-center gap-3 p-4 text-sm text-muted">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface text-xs" aria-hidden="true">
              🔒
            </span>
            <span className="flex-1">Final assessment</span>
            <span className="text-xs">Finish all lessons</span>
          </div>
        )}
      </li>
    </ol>
  );
}
