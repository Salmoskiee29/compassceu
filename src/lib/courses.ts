export type Category =
  | "Nursing"
  | "Pharmacy"
  | "Education"
  | "Psychology"
  | "Business";

export type Course = {
  slug: string;
  title: string;
  category: Category;
  units: number;
  hours: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  price: number;
  instructor: string;
  summary: string;
  outcomes: string[];
  modules: string[];
};

export const categories: Category[] = [
  "Nursing",
  "Pharmacy",
  "Education",
  "Psychology",
  "Business",
];

// Sample catalog — replace with real course data or a CMS/database later.
export const courses: Course[] = [
  {
    slug: "infection-control-essentials",
    title: "Infection Control Essentials",
    category: "Nursing",
    units: 3,
    hours: 6,
    level: "Beginner",
    price: 1500,
    instructor: "Course Instructor",
    summary:
      "Evidence-based practices for preventing healthcare-associated infections in clinical settings.",
    outcomes: [
      "Apply standard and transmission-based precautions",
      "Implement hand hygiene and PPE protocols",
      "Recognize and report outbreak indicators",
    ],
    modules: [
      "Chain of infection",
      "Standard precautions",
      "Environmental cleaning",
      "Outbreak management",
    ],
  },
  {
    slug: "clinical-pharmacology-update",
    title: "Clinical Pharmacology Update",
    category: "Pharmacy",
    units: 4,
    hours: 8,
    level: "Intermediate",
    price: 2200,
    instructor: "Course Instructor",
    summary:
      "Current guidance on drug interactions, dosing in special populations, and medication safety.",
    outcomes: [
      "Identify clinically significant drug interactions",
      "Adjust dosing for renal and hepatic impairment",
      "Reduce medication errors through safe practices",
    ],
    modules: [
      "Pharmacokinetics refresher",
      "Drug–drug interactions",
      "Special populations",
      "Medication safety systems",
    ],
  },
  {
    slug: "differentiated-instruction",
    title: "Differentiated Instruction in Practice",
    category: "Education",
    units: 3,
    hours: 6,
    level: "Beginner",
    price: 1200,
    instructor: "Course Instructor",
    summary:
      "Practical strategies to design lessons that meet diverse learner needs in one classroom.",
    outcomes: [
      "Assess learner readiness and interests",
      "Design tiered activities and assessments",
      "Manage a flexible-grouping classroom",
    ],
    modules: [
      "Principles of differentiation",
      "Formative assessment",
      "Tiered lesson design",
      "Classroom management",
    ],
  },
  {
    slug: "trauma-informed-care",
    title: "Trauma-Informed Care",
    category: "Psychology",
    units: 5,
    hours: 10,
    level: "Intermediate",
    price: 2800,
    instructor: "Course Instructor",
    summary:
      "Understand the impact of trauma and apply trauma-informed principles across service settings.",
    outcomes: [
      "Explain the neurobiology of trauma",
      "Apply the six principles of trauma-informed care",
      "Prevent re-traumatization in practice",
    ],
    modules: [
      "Understanding trauma",
      "Neurobiology and behavior",
      "Trauma-informed principles",
      "Self-care for practitioners",
    ],
  },
  {
    slug: "ethics-and-professional-practice",
    title: "Ethics and Professional Practice",
    category: "Business",
    units: 2,
    hours: 4,
    level: "Beginner",
    price: 900,
    instructor: "Course Instructor",
    summary:
      "Core ethical frameworks and their application to everyday professional decisions.",
    outcomes: [
      "Use ethical decision-making frameworks",
      "Identify conflicts of interest",
      "Uphold confidentiality and data privacy",
    ],
    modules: [
      "Ethical theories",
      "Professional codes of conduct",
      "Data privacy",
      "Case studies",
    ],
  },
  {
    slug: "advanced-wound-management",
    title: "Advanced Wound Management",
    category: "Nursing",
    units: 6,
    hours: 12,
    level: "Advanced",
    price: 3500,
    instructor: "Course Instructor",
    summary:
      "Assessment and treatment of complex wounds, including dressing selection and healing barriers.",
    outcomes: [
      "Perform comprehensive wound assessment",
      "Select appropriate advanced dressings",
      "Address systemic barriers to healing",
    ],
    modules: [
      "Wound physiology",
      "Assessment tools",
      "Dressing selection",
      "Chronic wound care",
    ],
  },
];

export function getCourse(slug: string) {
  return courses.find((c) => c.slug === slug);
}

export function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(amount);
}
