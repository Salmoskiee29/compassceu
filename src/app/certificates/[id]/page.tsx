import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PrintButton } from "@/components/PrintButton";
import { requireUser } from "@/lib/auth";
import { getCourse } from "@/lib/courses";
import { type Certificate, formatDate } from "@/lib/learning";
import { confirmedApprovals } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Certificate" };

export default async function CertificatePage(props: PageProps<"/certificates/[id]">) {
  const { id } = await props.params;
  await requireUser(`/certificates/${id}`);

  // RLS: learners can only load their own certificates.
  const supabase = await createClient();
  const { data } = await supabase
    .from("certificates")
    .select("id, course_slug, holder_name, license_number, ceus, issued_at")
    .eq("id", id.toUpperCase())
    .maybeSingle();
  const cert = data as Certificate | null;
  if (!cert) notFound();

  const course = getCourse(cert.course_slug);
  const approval = confirmedApprovals[0];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 print:max-w-none print:p-0">
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-4">
        <Link href="/dashboard" className="text-sm font-medium text-brand hover:underline">
          ← My Courses
        </Link>
        <PrintButton />
      </div>

      <div className="theme-light rounded-2xl border-8 border-double border-[#c9973f]/60 bg-white p-8 text-center shadow-lg sm:p-14 print:rounded-none print:shadow-none">
        <Image
          src="/images/compassceu-logo.png"
          alt="CompassCEU Continuing Education"
          width={900}
          height={271}
          className="mx-auto h-16 w-auto sm:h-20"
        />
        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.3em] text-[#1d4ed8]">Certificate of Completion</p>
        <p className="mt-6 text-sm text-[#5b6474]">This certifies that</p>
        <p className="mt-2 font-display text-3xl font-extrabold text-[#0b1a4a] sm:text-4xl">{cert.holder_name}</p>
        {cert.license_number && <p className="mt-1 text-sm text-[#5b6474]">License no. {cert.license_number}</p>}
        <p className="mt-6 text-sm text-[#5b6474]">has successfully completed</p>
        <p className="mt-2 font-display text-2xl font-bold text-[#a8742a]">{course?.title ?? cert.course_slug}</p>
        <p className="mt-2 text-sm text-[#0f172a]">
          {Number(cert.ceus)} CEUs{course ? ` · ${course.hours} contact hours` : ""}
        </p>

        <dl className="mx-auto mt-10 grid max-w-xl gap-4 border-t border-[#e3e7ee] pt-6 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-[#5b6474]">Date issued</dt>
            <dd className="font-medium text-[#0f172a]">{formatDate(cert.issued_at)}</dd>
          </div>
          <div>
            <dt className="text-[#5b6474]">Certificate ID</dt>
            <dd className="font-mono font-medium text-[#0f172a]">{cert.id}</dd>
          </div>
          <div>
            <dt className="text-[#5b6474]">Provider</dt>
            <dd className="font-medium text-[#0f172a]">
              {approval ? `${approval.short} ${approval.number}` : "Approval pending"}
            </dd>
          </div>
        </dl>
        <p className="mt-8 text-xs text-[#5b6474]">Verify this certificate at compassceu.com/verify using the ID above.</p>
      </div>
    </div>
  );
}
