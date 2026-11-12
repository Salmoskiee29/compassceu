import type { Category } from "./courses";

// Renewal requirements shown on the home page. Checked Oct 2026 against published
// summaries of the CA BRN, BVNPT and CDPH rules. Re-check with the boards before launch;
// the client should confirm how CompassCEU's approvals apply to each profession.
export const requirements: Record<
  Category,
  { board: string; summary: string; points: string[] }
> = {
  RN: {
    board: "Board of Registered Nursing (BRN)",
    summary: "30 contact hours every 2-year renewal period.",
    points: [
      "Implicit bias: 1 hour for nurses in their first 2 years after initial licensure.",
      "Keep your certificates for at least 4 years in case of an audit.",
    ],
  },
  LVN: {
    board: "Board of Vocational Nursing and Psychiatric Technicians (BVNPT)",
    summary: "30 contact hours every 2-year renewal period.",
    points: [
      "Implicit bias: 1 hour for nurses in their first 2 years after initial licensure.",
      "Keep your certificates in case of an audit.",
    ],
  },
  CNA: {
    board: "California Department of Public Health (CDPH)",
    summary: "48 hours of in-service training or CE every 2 years.",
    points: [
      "At least 12 hours in each year of the certification period.",
      "No more than 24 of the 48 hours may be completed online.",
    ],
  },
  HHA: {
    board: "California Department of Public Health (CDPH)",
    summary: "24 hours of in-service training every 2 years.",
    points: [
      "At least 12 hours in each year of the certification period.",
      "Check with CDPH and your employer before using online hours toward renewal.",
    ],
  },
};
