import Image from "next/image";
import { categories, categoryNames } from "@/lib/courses";

const audiences = categories.map((c) => `${categoryNames[c]} (${c})`);

export function ComingSoon() {
  return (
    <section className="theme-light relative isolate flex min-h-svh flex-col overflow-hidden bg-background font-display">
      {/* Photo (desktop) */}
      <div className="absolute inset-y-0 right-0 -z-10 hidden aspect-[946/1024] lg:block">
        <Image
          src="/images/hero-nurse.webp"
          alt="Nurse in blue scrubs smiling, with the California coastline behind her"
          fill
          fetchPriority="high"
          sizes="60vw"
          className="object-cover object-left-top"
        />
        <div className="absolute inset-y-0 left-0 w-1/2 bg-linear-to-r from-background to-transparent" />
      </div>

      {/* Gold accent arc */}
      <svg
        viewBox="0 0 100 200"
        className="pointer-events-none absolute top-[62%] right-[6%] hidden h-[16%] text-[#c9973f] lg:block"
        fill="none"
        aria-hidden="true"
      >
        <path d="M80 0 C 95 70, 70 150, 10 195" stroke="currentColor" strokeWidth="9" strokeLinecap="round" />
      </svg>

      {/* Logo */}
      <header className="px-4 pt-6 sm:px-6 lg:px-[5.3%] lg:pt-10">
        <Image
          src="/images/compassceu-logo.png"
          alt="CompassCEU Continuing Education"
          width={900}
          height={271}
          preload
          className="h-14 w-auto lg:h-[clamp(64px,5.4vw,96px)]"
        />
      </header>

      {/* Content */}
      <div className="flex flex-1 items-center px-4 py-12 sm:px-6 lg:px-[5.3%]">
        <div className="max-w-xl lg:max-w-[40vw]">
          <p className="text-[13px] font-semibold uppercase tracking-[0.32em] text-[#1d4ed8] sm:text-[15px]">
            California-based continuing education
          </p>

          <h1 className="mt-5 text-[clamp(3rem,6vw,6.5rem)] leading-[0.95] font-extrabold tracking-[-0.045em]">
            <span className="block text-navy">Coming Soon.</span>
            <span className="mt-2 block bg-linear-to-b from-[#c99a52] to-[#a8742a] bg-clip-text pb-2 text-[0.5em] leading-tight tracking-[-0.03em] text-transparent">
              Advance your practice. Make a greater impact.
            </span>
          </h1>

          <p className="mt-6 max-w-[560px] text-lg leading-[1.45] font-medium text-[#4a5263]">
            We&apos;re building an online home for continuing education for healthcare
            professionals in California: flexible, self-paced courses to help you stay
            current and grow your career.
          </p>

          <ul className="mt-8 flex flex-wrap gap-2.5">
            {audiences.map((a) => (
              <li
                key={a}
                className="rounded-full border border-[#d6e2f6] bg-[#eef3fb] px-4 py-2 text-sm font-medium text-navy"
              >
                {a}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Photo (mobile/tablet) */}
      <div className="px-4 sm:px-6 lg:hidden">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
          <Image src="/images/hero-nurse.webp" alt="" fill sizes="100vw" className="object-cover object-top" />
        </div>
      </div>

      <footer className="px-4 py-6 text-sm text-muted sm:px-6 lg:px-[5.3%]">
        © {new Date().getFullYear()} CompassCEU. All rights reserved.
      </footer>
    </section>
  );
}
