export type Certificate = {
  id: string;
  holder: string;
  courseSlug: string;
  issuedOn: string; // ISO date
};

// Demo records — replace with a database lookup.
const certificates: Certificate[] = [
  { id: "CCEU-2026-0001", holder: "Sample Learner", courseSlug: "infection-control-essentials", issuedOn: "2026-03-14" },
  { id: "CCEU-2026-0002", holder: "Demo Student", courseSlug: "trauma-informed-care", issuedOn: "2026-06-02" },
];

export function findCertificate(id: string) {
  const normalized = id.trim().toUpperCase();
  return certificates.find((c) => c.id === normalized);
}
