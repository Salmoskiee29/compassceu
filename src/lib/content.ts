// Lesson and quiz content. Only import this from server code — the quiz answers
// live here and must never be sent to the browser (use `publicQuiz` for that).
//
// All lesson text below is SAMPLE content so the learner flow can be tested.
// The client's course team will supply the real lessons, references and quizzes.

import { type Course, courses, getCourse } from "./courses";

export type Lesson = { id: string; title: string; body: string[] };
export type QuizQuestion = { id: string; prompt: string; options: string[]; answer: number };
export type PublicQuizQuestion = Omit<QuizQuestion, "answer">;

/** Minimum score (percent) to pass the final assessment and earn a certificate. */
export const PASS_PERCENT = 70;

export function getLessons(course: Course): Lesson[] {
  return course.modules.map((title, i) => ({
    id: `lesson-${i + 1}`,
    title,
    body: [
      `This lesson covers ${title.toLowerCase()} as part of ${course.title}. It builds toward these outcomes: ${course.outcomes
        .map((o) => o.toLowerCase())
        .join("; ")}.`,
      "Sample content — the CompassCEU course team will replace this with the final lesson text, images, case examples, and references.",
      "When you've finished reading, mark the lesson complete to unlock the next one. Your progress is saved automatically.",
    ],
  }));
}

export function getLesson(slug: string, lessonId: string) {
  const course = getCourse(slug);
  if (!course) return null;
  const lessons = getLessons(course);
  const index = lessons.findIndex((l) => l.id === lessonId);
  if (index < 0) return null;
  return { course, lessons, lesson: lessons[index], index };
}

const q = (id: string, prompt: string, options: string[], answer: number): QuizQuestion => ({
  id,
  prompt,
  options,
  answer,
});

const quizzes: Record<string, QuizQuestion[]> = {
  "infection-control-essentials": [
    q("q1", "What is the single most effective way to prevent the spread of infection?", [
      "Wearing gloves at all times",
      "Hand hygiene",
      "Giving antibiotics early",
      "Opening windows",
    ], 1),
    q("q2", "Standard precautions apply to:", [
      "Only patients with a known infection",
      "Only patients in isolation rooms",
      "All patients, regardless of diagnosis",
      "Only during invasive procedures",
    ], 2),
    q("q3", "The chain of infection can be broken by:", [
      "Interrupting any one of its links",
      "Only killing the infectious agent",
      "Only isolating the patient",
      "Nothing — it can only be slowed",
    ], 0),
    q("q4", "When removing (doffing) PPE, which item is usually removed first?", [
      "Mask or respirator",
      "Gown",
      "Goggles",
      "Gloves",
    ], 3),
  ],
  "clinical-pharmacology-update": [
    q("q1", "Patients with reduced kidney function often need:", [
      "Higher doses of every medication",
      "Dose adjustment for renally cleared drugs",
      "No changes to their medications",
      "Only intravenous medications",
    ], 1),
    q("q2", "Grapefruit juice can raise levels of some drugs by inhibiting:", [
      "CYP3A4 enzymes",
      "Insulin release",
      "Kidney filtration",
      "Stomach acid",
    ], 0),
    q("q3", "If Drug A inhibits the metabolism of Drug B, levels of Drug B usually:", [
      "Decrease",
      "Stay the same",
      "Increase",
      "Become undetectable",
    ], 2),
    q("q4", "The 'rights' of medication administration include right patient, drug, dose, route, and:", [
      "Right price",
      "Right pharmacy",
      "Right color",
      "Right time",
    ], 3),
  ],
  "dementia-care-at-home": [
    q("q1", "When a client with dementia becomes agitated, a helpful first step is to:", [
      "Correct them firmly",
      "Stay calm, speak softly, and gently redirect",
      "Leave the room for the rest of the day",
      "Argue until they agree",
    ], 1),
    q("q2", "Consistent daily routines help because they:", [
      "Reduce confusion and anxiety",
      "Cure dementia",
      "Replace the need for supervision",
      "Make medications unnecessary",
    ], 0),
    q("q3", "Which is a good home-safety measure?", [
      "Rearranging furniture often",
      "Adding more rugs",
      "Removing trip hazards and improving lighting",
      "Dimming lights at night only",
    ], 2),
    q("q4", "When communicating with a client who has dementia, it's best to:", [
      "Ask several questions at once",
      "Speak quickly to keep their attention",
      "Use short, simple sentences",
      "Talk about them as if they aren't there",
    ], 2),
  ],
  "trauma-informed-care": [
    q("q1", "Which of these is one of the six principles of trauma-informed care?", [
      "Efficiency",
      "Safety",
      "Compliance",
      "Speed",
    ], 1),
    q("q2", "A key aim of trauma-informed care is to:", [
      "Avoid re-traumatization",
      "Diagnose trauma in every patient",
      "Require patients to retell their story",
      "Limit patient choices",
    ], 0),
    q("q3", "Asking “What happened to you?” instead of “What’s wrong with you?” reflects:", [
      "A disciplinary approach",
      "A trauma-informed approach",
      "A billing requirement",
      "A legal formality",
    ], 1),
    q("q4", "Practitioner self-care matters because staff are at risk of:", [
      "Losing their license automatically",
      "Higher pay",
      "Secondary traumatic stress and burnout",
      "Nothing — it isn't relevant",
    ], 2),
  ],
  "ethics-and-professional-practice": [
    q("q1", "The principle of autonomy refers to:", [
      "The facility's right to set policy",
      "A patient's right to make decisions about their own care",
      "A nurse's right to refuse any assignment",
      "Doing the greatest good for the most people",
    ], 1),
    q("q2", "Patient confidentiality means health information is shared:", [
      "Only with those who need it for care or as authorized",
      "With anyone who asks politely",
      "Only with family members",
      "Never, under any circumstances",
    ], 0),
    q("q3", "A potential conflict of interest should be:", [
      "Ignored if it's small",
      "Kept private",
      "Disclosed and managed",
      "Resolved by the patient",
    ], 2),
    q("q4", "Valid informed consent requires that the patient:", [
      "Signs quickly",
      "Understands the risks, benefits, and alternatives",
      "Agrees with the provider",
      "Has a family member present",
    ], 1),
  ],
  "advanced-wound-management": [
    q("q1", "Full-thickness skin loss without exposed bone, tendon, or muscle describes a pressure injury at:", [
      "Stage 1",
      "Stage 2",
      "Stage 3",
      "Stage 4",
    ], 2),
    q("q2", "For most wounds, a moist (not wet) wound environment:", [
      "Promotes healing",
      "Causes infection",
      "Slows healing",
      "Makes no difference",
    ], 0),
    q("q3", "Which systemic factor commonly impairs wound healing?", [
      "Adequate protein intake",
      "Uncontrolled blood glucose",
      "Good circulation",
      "Regular repositioning",
    ], 1),
    q("q4", "Before selecting a dressing, you should first:", [
      "Choose the cheapest option",
      "Use whatever was used last time",
      "Apply an antibiotic ointment",
      "Assess the wound — size, depth, exudate, and tissue type",
    ], 3),
  ],
};

export function getQuiz(slug: string): QuizQuestion[] {
  return quizzes[slug] ?? sampleQuiz(slug);
}

/**
 * SAMPLE assessment for courses that don't have a written quiz yet: one question per
 * learning outcome and one per module ("which of these is covered?"), with distractors
 * taken from other courses. Using both gives enough questions that a learner can miss
 * one and still reach PASS_PERCENT. Lets the full flow be tested until the real quiz
 * is supplied.
 */
function sampleQuiz(slug: string): QuizQuestion[] {
  const course = getCourse(slug);
  if (!course) return [];
  const others = courses.filter((c) => c.slug !== slug && c.topic !== course.topic);

  const build = (
    correct: string[],
    pool: string[],
    prompt: string,
    offset: number,
  ): QuizQuestion[] =>
    correct.map((item, i) => {
      // Walk the pool from a fixed starting point, skipping repeats and anything this
      // course also lists, so every option is distinct and only one is correct.
      const distractors: string[] = [];
      for (let k = 0; distractors.length < 3 && k < pool.length; k++) {
        const candidate = pool[(i * 7 + k * 5 + slug.length) % pool.length];
        if (!correct.includes(candidate) && !distractors.includes(candidate)) distractors.push(candidate);
      }
      const answer = (i + slug.length) % (distractors.length + 1);
      const options = [...distractors];
      options.splice(answer, 0, item);
      return q(`q${offset + i + 1}`, prompt, options, answer);
    });

  return [
    ...build(
      course.outcomes,
      others.flatMap((c) => c.outcomes),
      `Which of these is a learning outcome of "${course.title}"?`,
      0,
    ),
    ...build(
      course.modules,
      others.flatMap((c) => c.modules),
      `Which of these is a module in "${course.title}"?`,
      course.outcomes.length,
    ),
  ];
}

/** Correct answers needed to pass a quiz with `total` questions. */
export function requiredCorrect(total: number) {
  return Math.ceil((total * PASS_PERCENT) / 100);
}

/** Quiz questions without the answers — safe to pass to a Client Component. */
export function publicQuiz(slug: string): PublicQuizQuestion[] {
  return getQuiz(slug).map(({ id, prompt, options }) => ({ id, prompt, options }));
}
