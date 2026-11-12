export type Category = "RN" | "LVN" | "CNA" | "HHA";

export type Topic =
  | "California Essentials"
  | "Infection Control"
  | "Pharmacology"
  | "Pain Management"
  | "Mental Health"
  | "Geriatrics & Dementia"
  | "Wound & Skin Care"
  | "Critical & Acute Care"
  | "Professional Practice"
  | "Patient Safety";

export const topics: Topic[] = [
  "California Essentials",
  "Infection Control",
  "Patient Safety",
  "Pharmacology",
  "Pain Management",
  "Mental Health",
  "Geriatrics & Dementia",
  "Wound & Skin Care",
  "Critical & Acute Care",
  "Professional Practice",
];

export type Course = {
  /** Short catalog number shown in the course list. */
  code: string;
  slug: string;
  topic: Topic;
  /** Shown in the "New courses" group. */
  isNew?: boolean;
  /** Listed under "Free courses" (price should be 0). */
  isFree?: boolean;
  /** Other professions this course also counts for (besides `category`). */
  alsoFor?: Category[];
  title: string;
  category: Category;
  units: number;
  hours: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  /** Price in US dollars. */
  price: number;
  instructor: string;
  summary: string;
  outcomes: string[];
  modules: string[];
};

export const categories: Category[] = ["RN", "LVN", "CNA", "HHA"];

export const categoryNames: Record<Category, string> = {
  RN: "Registered Nurses",
  LVN: "Licensed Vocational Nurses",
  CNA: "Certified Nursing Assistants",
  HHA: "Home Health Aides",
};

// Sample catalog — replace with real course data or a CMS/database later.
// Prices are placeholders in USD until the client confirms them.
export const courses: Course[] = [
  {
    code: "20110",
    slug: "infection-control-essentials",
    topic: "Infection Control",
    alsoFor: ["HHA"],
    title: "Infection Control Essentials",
    category: "CNA",
    units: 3,
    hours: 6,
    level: "Beginner",
    price: 24,
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
    code: "30120",
    slug: "clinical-pharmacology-update",
    topic: "Pharmacology",
    title: "Clinical Pharmacology Update",
    category: "LVN",
    units: 4,
    hours: 8,
    level: "Intermediate",
    price: 32,
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
    code: "40130",
    slug: "dementia-care-at-home",
    topic: "Geriatrics & Dementia",
    alsoFor: ["CNA"],
    title: "Dementia Care at Home",
    category: "HHA",
    units: 3,
    hours: 6,
    level: "Beginner",
    price: 19,
    instructor: "Course Instructor",
    summary:
      "Practical approaches to supporting clients living with dementia safely and respectfully at home.",
    outcomes: [
      "Recognize the stages and common behaviors of dementia",
      "Use calm, person-centered communication techniques",
      "Keep the home environment safe and predictable",
    ],
    modules: [
      "Understanding dementia",
      "Communication strategies",
      "Responding to challenging behaviors",
      "Home safety and daily routines",
    ],
  },
  {
    code: "10140",
    slug: "trauma-informed-care",
    topic: "Mental Health",
    title: "Trauma-Informed Care",
    category: "RN",
    units: 5,
    hours: 10,
    level: "Intermediate",
    price: 39,
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
    code: "30150",
    slug: "ethics-and-professional-practice",
    topic: "Professional Practice",
    alsoFor: ["RN"],
    title: "Ethics and Professional Practice",
    category: "LVN",
    units: 2,
    hours: 4,
    level: "Beginner",
    price: 15,
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
    code: "10160",
    slug: "advanced-wound-management",
    topic: "Wound & Skin Care",
    title: "Advanced Wound Management",
    category: "RN",
    units: 6,
    hours: 12,
    level: "Advanced",
    price: 45,
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

// Additional sample courses. Same rules: placeholder titles, prices and content
// until the client's course team supplies the real catalog.
type Draft = Omit<Course, "instructor" | "level"> & Partial<Pick<Course, "instructor" | "level">>;
const draft = (c: Draft): Course => ({ instructor: "Course Instructor", level: "Beginner", ...c });

courses.push(
  // ---- RN ----
  draft({ code: "10201", slug: "implicit-bias-in-healthcare", title: "Implicit Bias in Healthcare", category: "RN", alsoFor: ["LVN"], topic: "California Essentials", isNew: true, units: 1, hours: 1, price: 12,
    summary: "How unconscious bias shapes care decisions, and practical steps to deliver more equitable care.",
    outcomes: ["Define implicit bias and how it forms", "Recognize bias in clinical interactions", "Apply strategies that reduce disparities in care"],
    modules: ["What implicit bias is", "Bias and health outcomes", "Strategies for equitable care"] }),
  draft({ code: "10202", slug: "california-nursing-practice-act", title: "The California Nursing Practice Act", category: "RN", topic: "California Essentials", units: 2, hours: 2, price: 16,
    summary: "Your scope of practice, standards of competent performance, and common reasons for discipline in California.",
    outcomes: ["Describe the RN scope of practice", "Explain standards of competent performance", "Identify common grounds for discipline"],
    modules: ["Scope of practice", "Standards of competent performance", "Discipline and reporting"] }),
  draft({ code: "10203", slug: "workplace-violence-prevention", title: "Workplace Violence Prevention in Healthcare", category: "RN", alsoFor: ["LVN", "CNA", "HHA"], topic: "Patient Safety", isNew: true, units: 2, hours: 2, price: 16,
    summary: "Recognize warning signs, de-escalate safely, and report incidents to protect yourself and your team.",
    outcomes: ["Identify risk factors for workplace violence", "Use verbal de-escalation techniques", "Follow incident reporting procedures"],
    modules: ["Types of workplace violence", "Warning signs and risk factors", "De-escalation", "After an incident"] }),
  draft({ code: "10204", slug: "sepsis-early-recognition", title: "Sepsis: Early Recognition and Response", category: "RN", alsoFor: ["LVN"], topic: "Critical & Acute Care", level: "Intermediate", units: 3, hours: 3, price: 24,
    summary: "Spot sepsis early with screening tools and act fast with evidence-based bundles.",
    outcomes: ["Recognize early signs of sepsis", "Use screening tools at the bedside", "Describe time-critical sepsis interventions"],
    modules: ["Pathophysiology of sepsis", "Screening and early warning", "The first hour", "Ongoing monitoring"] }),
  draft({ code: "10205", slug: "opioid-safety-pain-management", title: "Opioid Safety and Pain Management", category: "RN", alsoFor: ["LVN"], topic: "Pain Management", isNew: true, level: "Intermediate", units: 4, hours: 4, price: 30,
    summary: "Safe use of opioids for pain: assessment, monitoring for respiratory depression, and patient education.",
    outcomes: ["Assess pain with validated tools", "Monitor for opioid-induced respiratory depression", "Teach patients safe use, storage and disposal"],
    modules: ["Pain assessment", "Opioid pharmacology", "Monitoring and safety", "Patient education"] }),
  draft({ code: "10206", slug: "nonpharmacologic-pain-strategies", title: "Non-Drug Strategies for Pain Relief", category: "RN", topic: "Pain Management", units: 2, hours: 2, price: 16,
    summary: "Positioning, heat and cold, distraction, and other non-drug approaches that complement pain medication.",
    outcomes: ["Select non-drug pain interventions", "Combine approaches with medication plans", "Evaluate the patient's response"],
    modules: ["Why non-drug approaches matter", "Physical techniques", "Cognitive and behavioral techniques"] }),
  draft({ code: "10207", slug: "suicide-risk-recognition", title: "Suicide Risk: Recognition and Response", category: "RN", topic: "Mental Health", units: 2, hours: 2, price: 16,
    summary: "Screen for suicide risk, respond with compassion, and connect patients to the right level of care.",
    outcomes: ["Identify risk and protective factors", "Use a screening tool appropriately", "Plan a safe, supportive response"],
    modules: ["Understanding risk", "Screening conversations", "Safety planning and referral"] }),
  draft({ code: "10208", slug: "anxiety-depression-in-practice", title: "Anxiety and Depression in Everyday Practice", category: "RN", topic: "Mental Health", units: 3, hours: 3, price: 24,
    summary: "Recognize common mental health conditions in any care setting and support patients effectively.",
    outcomes: ["Recognize signs of anxiety and depression", "Use supportive communication", "Know when and how to refer"],
    modules: ["Common presentations", "Screening tools", "Supportive care", "Referral pathways"] }),
  draft({ code: "10209", slug: "preventing-medication-errors", title: "Preventing Medication Errors", category: "RN", alsoFor: ["LVN"], topic: "Patient Safety", units: 2, hours: 2, price: 15,
    summary: "Where medication errors happen and the system and bedside habits that prevent them.",
    outcomes: ["Describe common types of medication errors", "Apply the rights of medication administration", "Report and learn from errors"],
    modules: ["Where errors happen", "Safe administration habits", "Reporting and just culture"] }),
  draft({ code: "10210", slug: "health-literacy-patient-teaching", title: "Health Literacy and Patient Teaching", category: "RN", alsoFor: ["LVN", "CNA", "HHA"], topic: "Professional Practice", isFree: true, units: 1, hours: 1, price: 0,
    summary: "Explain care in plain language and confirm understanding with teach-back.",
    outcomes: ["Recognize low health literacy", "Use plain language", "Confirm understanding with teach-back"],
    modules: ["What health literacy is", "Plain-language teaching", "Teach-back"] }),
  draft({ code: "10211", slug: "diabetes-management-update", title: "Diabetes Management Update", category: "RN", topic: "Pharmacology", level: "Intermediate", units: 5, hours: 5, price: 35,
    summary: "Current approaches to glucose monitoring, diabetes medications, and patient self-management.",
    outcomes: ["Interpret glucose monitoring data", "Compare classes of diabetes medications", "Support patient self-management"],
    modules: ["Diabetes basics", "Monitoring", "Medications", "Self-management education"] }),
  draft({ code: "10212", slug: "heart-failure-nursing", title: "Heart Failure: Nursing Assessment and Care", category: "RN", topic: "Critical & Acute Care", level: "Intermediate", units: 4, hours: 4, price: 30,
    summary: "Assess, monitor and educate patients living with heart failure to prevent readmissions.",
    outcomes: ["Assess fluid status and symptoms", "Explain core heart failure medications", "Teach daily self-monitoring"],
    modules: ["Heart failure overview", "Assessment", "Treatment", "Discharge teaching"] }),

  // ---- LVN ----
  draft({ code: "30201", slug: "lvn-scope-of-practice", title: "LVN Scope of Practice in California", category: "LVN", topic: "California Essentials", units: 2, hours: 2, price: 16,
    summary: "What vocational nurses can and can't do in California, and how to work safely within your scope.",
    outcomes: ["Describe the LVN scope of practice", "Recognize tasks outside your scope", "Communicate effectively with supervising RNs"],
    modules: ["Scope of practice", "Delegation and supervision", "Common scope questions"] }),
  draft({ code: "30202", slug: "iv-therapy-fundamentals", title: "IV Therapy Fundamentals", category: "LVN", topic: "Pharmacology", isNew: true, level: "Intermediate", units: 4, hours: 4, price: 30,
    summary: "Core principles of IV therapy: access devices, fluids, complications, and safe practice.",
    outcomes: ["Describe common IV access devices", "Recognize IV complications early", "Apply infection prevention for IV lines"],
    modules: ["Vascular access basics", "IV fluids", "Complications", "Line care"] }),
  draft({ code: "30203", slug: "geriatric-assessment-essentials", title: "Geriatric Assessment Essentials", category: "LVN", alsoFor: ["RN"], topic: "Geriatrics & Dementia", units: 3, hours: 3, price: 24,
    summary: "A practical approach to assessing older adults: function, cognition, falls and medications.",
    outcomes: ["Perform a focused geriatric assessment", "Screen for falls and cognitive change", "Identify medication risks in older adults"],
    modules: ["Aging and assessment", "Function and mobility", "Cognition", "Medications in older adults"] }),
  draft({ code: "30204", slug: "diabetic-foot-care", title: "Diabetic Foot Care and Ulcer Prevention", category: "LVN", alsoFor: ["RN"], topic: "Wound & Skin Care", isNew: true, units: 3, hours: 3, price: 24,
    summary: "Daily foot assessment, early warning signs, and teaching that prevents diabetic foot ulcers.",
    outcomes: ["Perform a diabetic foot check", "Recognize early ulcer warning signs", "Teach daily foot care"],
    modules: ["Why feet are at risk", "Foot assessment", "Prevention and teaching"] }),

  // ---- CNA ----
  draft({ code: "20201", slug: "resident-rights-and-dignity", title: "Resident Rights and Dignity", category: "CNA", alsoFor: ["HHA"], topic: "California Essentials", units: 2, hours: 2, price: 12,
    summary: "Protect residents' rights, privacy and dignity in everyday care.",
    outcomes: ["List core resident rights", "Protect privacy during care", "Respond when rights are at risk"],
    modules: ["Resident rights", "Privacy and dignity", "Speaking up"] }),
  draft({ code: "20202", slug: "fall-prevention-for-cnas", title: "Fall Prevention for Nursing Assistants", category: "CNA", alsoFor: ["HHA"], topic: "Patient Safety", isNew: true, units: 2, hours: 2, price: 12,
    summary: "Spot fall risks and use safe transfer and mobility habits that keep residents on their feet.",
    outcomes: ["Identify fall risk factors", "Use safe transfer techniques", "Respond correctly after a fall"],
    modules: ["Why falls happen", "Safe mobility and transfers", "After a fall"] }),
  draft({ code: "20203", slug: "alzheimers-communication", title: "Communicating with Residents Who Have Alzheimer's", category: "CNA", topic: "Geriatrics & Dementia", units: 3, hours: 3, price: 15,
    summary: "Calm, person-centered communication that reduces distress and builds trust.",
    outcomes: ["Adapt communication to each stage", "Reduce triggers for distress", "Redirect with compassion"],
    modules: ["How Alzheimer's affects communication", "Verbal and non-verbal techniques", "Responding to distress"] }),
  draft({ code: "20204", slug: "elder-abuse-recognition-reporting", title: "Recognizing and Reporting Elder Abuse", category: "CNA", alsoFor: ["HHA", "LVN"], topic: "California Essentials", units: 2, hours: 2, price: 12,
    summary: "Signs of abuse and neglect, and your duty as a mandated reporter.",
    outcomes: ["Recognize types and signs of abuse", "Explain mandated reporter duties", "Follow the reporting process"],
    modules: ["Types of abuse", "Warning signs", "Reporting"] }),
  draft({ code: "20205", slug: "skin-care-pressure-injury-prevention", title: "Skin Care and Pressure Injury Prevention", category: "CNA", alsoFor: ["HHA"], topic: "Wound & Skin Care", units: 2, hours: 2, price: 12,
    summary: "Keep skin healthy with repositioning, moisture control and daily skin checks.",
    outcomes: ["Identify pressure injury risk", "Reposition residents safely", "Report skin changes early"],
    modules: ["How pressure injuries form", "Prevention routines", "What to report"] }),
  draft({ code: "20206", slug: "nutrition-and-hydration", title: "Nutrition and Hydration for Older Adults", category: "CNA", alsoFor: ["HHA"], topic: "Geriatrics & Dementia", units: 2, hours: 2, price: 12,
    summary: "Support safe eating and drinking, and spot early signs of dehydration or malnutrition.",
    outcomes: ["Assist with meals safely", "Recognize dehydration and malnutrition", "Record intake accurately"],
    modules: ["Nutrition needs with aging", "Mealtime assistance", "Hydration and intake records"] }),

  // ---- HHA ----
  draft({ code: "40201", slug: "home-safety-for-clients", title: "Home Safety for Home Health Clients", category: "HHA", topic: "Patient Safety", units: 2, hours: 2, price: 12,
    summary: "Spot hazards in the home and make simple changes that prevent injuries.",
    outcomes: ["Identify common home hazards", "Recommend simple safety changes", "Know when to report a concern"],
    modules: ["Room-by-room hazards", "Fire and emergency safety", "Reporting concerns"] }),
  draft({ code: "40202", slug: "personal-care-skills-refresher", title: "Personal Care Skills Refresher", category: "HHA", alsoFor: ["CNA"], topic: "Professional Practice", isNew: true, units: 2, hours: 2, price: 12,
    summary: "Bathing, grooming, toileting and dressing with safety, comfort and respect.",
    outcomes: ["Provide personal care safely", "Protect client dignity", "Observe and report changes"],
    modules: ["Bathing and grooming", "Toileting and continence", "Dressing and comfort"] }),
  draft({ code: "40203", slug: "caregiver-stress-and-self-care", title: "Caregiver Stress and Self-Care", category: "HHA", alsoFor: ["CNA", "LVN", "RN"], topic: "Mental Health", isFree: true, units: 1, hours: 1, price: 0,
    summary: "Recognize burnout and build simple habits that protect your own wellbeing.",
    outcomes: ["Recognize signs of burnout", "Use simple stress-relief habits", "Know where to find support"],
    modules: ["Understanding caregiver stress", "Everyday self-care", "Getting support"] }),
);

/** Courses that count for a profession (its own courses plus shared ones). */
export function coursesFor(profession: Category) {
  return courses.filter((c) => c.category === profession || c.alsoFor?.includes(profession));
}

export function getCourse(slug: string) {
  return courses.find((c) => c.slug === slug);
}

export function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
