const faqs = [
  {
    q: "What is a CEU?",
    a: "A Continuing Education Unit is a measure of participation in an accredited professional development program. Many licensing boards require a set number of CEUs to renew your license.",
  },
  {
    q: "How do I get my certificate?",
    a: "Once you complete all modules and pass the final assessment, your certificate is issued instantly and can be verified online using its certificate ID.",
  },
  {
    q: "Can I learn at my own pace?",
    a: "Yes. All courses are self-paced and accessible on any device. Your progress is saved automatically.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept major credit and debit cards, GCash, Maya, and bank transfer. Group rates are available for institutions.",
  },
];

export function Faq() {
  return (
    <div className="divide-y divide-line rounded-xl border border-line bg-background">
      {faqs.map((f) => (
        <details key={f.q} className="group p-5">
          <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
            {f.q}
            <span className="ml-4 text-brand transition group-open:rotate-45">+</span>
          </summary>
          <p className="mt-3 text-sm text-muted">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
