import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the CompassCEU team.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <h1 className="text-3xl font-bold">Contact us</h1>
        <p className="mt-3 text-muted">
          Questions about courses, group enrollment, or accreditation? Send us a
          message and we&apos;ll reply within one business day.
        </p>
        <ul className="mt-8 space-y-4 text-sm">
          <li><span className="block text-muted">Email</span>hello@compassceu.example</li>
          <li><span className="block text-muted">Office hours</span>Mon–Fri, 9:00 AM – 5:00 PM (PHT)</li>
          <li><span className="block text-muted">Institutions</span>Ask about group rates for hospitals and schools.</li>
        </ul>
      </div>
      <div className="rounded-xl border border-line p-6 lg:col-span-3">
        <ContactForm />
      </div>
    </div>
  );
}
