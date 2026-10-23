import Image from "next/image";
import Link from "next/link";
import { hero } from "@/lib/site";

const features = [
  { icon: "book", label: ["California", "CE Compliant"] },
  { icon: "people", label: ["For Healthcare", "Professionals"] },
  { icon: "laptop", label: ["Flexible", "Online Learning"] },
  { icon: "ribbon", label: ["Expert-Led", "Courses"] },
] as const;

const professions = [
  { icon: "stethoscope", label: "Registered Nurses", sub: "(RN)", href: "/courses?category=RN" },
  { icon: "pill", label: "Vocational Nurses", sub: "(LVN)", href: "/courses?category=LVN" },
  { icon: "person", label: "Nursing Assistants", sub: "(CNA)", href: "/courses?category=CNA" },
  { icon: "home", label: "Home Health Aides", sub: "(HHA)", href: "/courses?category=HHA" },
] as const;

export function Hero() {
  return (
    <section className="theme-light relative isolate overflow-hidden bg-background font-display lg:min-h-[max(50vw,760px)]">
      {/* ---------- Background photo (desktop) ---------- */}
      <div className="absolute inset-y-0 right-0 -z-10 hidden aspect-[946/1024] lg:block">
        <Image
          src="/images/hero-nurse.webp"
          alt="Nurse in blue scrubs smiling, with the California coastline behind her"
          fill
          fetchPriority="high"
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover object-left-top"
        />
        <div className="absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-background to-transparent" />
        <div className="absolute inset-x-0 top-0 h-28 bg-linear-to-b from-background/70 to-transparent" />
      </div>

      {/* Soft haze between text and photo */}
      <div className="pointer-events-none absolute inset-y-0 left-[36%] -z-10 hidden w-[30%] bg-linear-to-r from-background via-[#eef3fb] to-transparent lg:block" />

      {/* California silhouette */}
      <CaliforniaMap className="pointer-events-none absolute top-[15%] left-[43.5%] -z-10 hidden w-[8.5%] text-[#d6e2f6] xl:block" />

      {/* Gold accent arc */}
      <svg
        viewBox="0 0 100 200"
        className="pointer-events-none absolute top-[60%] right-[6%] hidden h-[16%] text-[#c9973f] lg:block"
        fill="none"
        aria-hidden="true"
      >
        <path d="M80 0 C 95 70, 70 150, 10 195" stroke="currentColor" strokeWidth="9" strokeLinecap="round" />
      </svg>

      {/* ---------- Content ---------- */}
      <div className="px-4 pt-28 pb-10 sm:px-6 lg:px-[5.3%] lg:pt-[152px] lg:pb-12">
        <div className="lg:max-w-[34vw]">
          <p className="text-[13px] font-semibold uppercase tracking-[0.32em] text-[#1d4ed8] sm:text-[15px] lg:whitespace-nowrap lg:text-[clamp(12px,0.85vw,16px)]">
            {hero.eyebrow}
          </p>

          <h1 className="mt-5 text-[clamp(2.6rem,4.4vw,5.6rem)] leading-[0.97] font-extrabold tracking-[-0.045em]">
            <span className="block text-navy">{hero.headline[0]}</span>
            <span className="block bg-linear-to-b from-[#c99a52] to-[#a8742a] bg-clip-text pb-2 text-transparent">
              {hero.headline[1]}
            </span>
          </h1>

          <p className="mt-4 max-w-[560px] text-lg leading-[1.38] font-medium text-[#4a5263] lg:text-[clamp(1.05rem,1.2vw,1.35rem)]">
            {hero.body}
          </p>

          <div className="mt-7 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/courses"
              className="inline-flex h-[58px] items-center justify-center gap-8 rounded-lg bg-linear-to-r from-[#0b1a4a] to-[#1c3889] px-10 text-lg font-semibold text-white shadow-lg shadow-navy-solid/25 transition hover:brightness-110 sm:min-w-[300px]"
            >
              Explore Courses <Chevron />
            </Link>
            <Link
              href="/about"
              className="inline-flex h-[58px] items-center justify-center gap-8 rounded-lg border-[1.5px] border-navy bg-background px-10 text-lg font-semibold text-navy transition hover:bg-[#f2f5fb] sm:min-w-[280px]"
            >
              Learn More <Chevron />
            </Link>
          </div>

          <ul className="mt-7 grid grid-cols-2 gap-y-6 sm:grid-cols-4 sm:divide-x sm:divide-line lg:w-[max(34vw,640px)]">
            {features.map((f) => (
              <li key={f.icon} className="flex flex-col items-center gap-2 px-2 text-center text-[15px] leading-tight text-navy">
                <span
                  className={`flex h-[60px] w-[60px] items-center justify-center rounded-full ${
                    f.icon === "ribbon" ? "bg-[#ece8fb] text-[#4f3fd1]" : "bg-[#e3ecfb] text-[#1d4ed8]"
                  }`}
                >
                  <Icon name={f.icon} size={30} />
                </span>
                <span>
                  {f.label[0]}
                  <br />
                  {f.label[1]}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Photo on mobile/tablet */}
        <div className="relative mt-10 aspect-[946/1024] overflow-hidden rounded-2xl sm:aspect-[4/3] lg:hidden">
          <Image
            src="/images/hero-nurse.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-top"
          />
        </div>
      </div>

      {/* ---------- Floating course card (desktop) ---------- */}
      <Link
        href="/courses"
        className="absolute top-[27.5%] left-[40.6%] hidden w-[max(250px,16.8%)] -rotate-[5deg] rounded-[22px] bg-white p-4 shadow-[0_24px_60px_-12px_rgba(11,26,74,0.25)] transition hover:-rotate-3 xl:block"
      >
        <div className="relative aspect-[2.05/1] overflow-hidden rounded-xl">
          <Image src="/images/course-thumb.webp" alt="" fill sizes="300px" className="object-cover" />
        </div>
        <p className="mt-4 text-[clamp(1rem,1.15vw,1.3rem)] leading-tight font-bold text-[#0b1a4a]">
          Evidence-Based Practice
          <br />
          in Patient Care
        </p>
        <p className="mt-2 text-[15px] text-[#5b6474]">
          2.0 CE Credits <span className="mx-1 text-line">|</span> 1.5 Hours
        </p>
        <div className="mt-3 h-1.5 rounded-full bg-[#dbe5f7]">
          <div className="h-full w-[45%] rounded-full bg-linear-to-r from-[#0b2a8a] to-[#2563eb]" />
        </div>
        <span className="mt-5 block rounded-lg bg-linear-to-r from-[#0a47d6] to-[#1d5cf0] py-3 text-center font-semibold text-white shadow-md shadow-blue-700/30">
          Resume Course
        </span>
      </Link>

      {/* ---------- Trusted-by strip ---------- */}
      <div className="px-4 pb-12 sm:px-6 lg:absolute lg:right-[4.4%] lg:bottom-[5.5%] lg:left-[52.7%] lg:px-0 lg:pb-0">
        <div className="rounded-[22px] border border-white/70 bg-white/80 p-4 shadow-[0_20px_50px_-15px_rgba(11,26,74,0.25)] backdrop-blur-md sm:p-5">
          <p className="text-center text-[17px] font-medium text-[#1a2f6e] lg:text-[clamp(0.95rem,1.1vw,1.15rem)]">
            Trusted by Healthcare Professionals Across California
          </p>
          <ul className="mt-4 grid grid-cols-2 rounded-2xl bg-white py-3 shadow-sm sm:grid-cols-4 sm:divide-x sm:divide-line">
            {professions.map((p) => (
              <li key={p.label}>
                <Link
                  href={p.href}
                  className="flex h-full flex-col items-center gap-1.5 px-1 py-2 text-center text-[12.5px] leading-tight text-[#1a2f6e] transition hover:text-brand"
                >
                  <Icon name={p.icon} size={30} />
                  <span className="mt-1">
                    {p.label}
                    {p.sub && (
                      <>
                        <br />
                        {p.sub}
                      </>
                    )}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function CaliforniaMap({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 140" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M4 0 H55 V52 L97 104 L98 110 L94 116 L92 128 L89 136 L66 138 L64 130 L57 121 L47 114 L40 104 L33 98 L27 89 L22 80 L19 70 L14 60 L10 49 L6 38 L3 26 L1 14 Z"
      />
    </svg>
  );
}

type IconName =
  | "book"
  | "people"
  | "laptop"
  | "ribbon"
  | "stethoscope"
  | "pill"
  | "person"
  | "home";

const paths: Record<IconName, React.ReactNode> = {
  book: (
    <>
      <path d="M2 5.5C4.5 4 8 4 11 6v14c-3-2-6.5-2-9-.5z" fill="currentColor" stroke="none" />
      <path d="M22 5.5C19.5 4 16 4 13 6v14c3-2 6.5-2 9-.5z" fill="currentColor" stroke="none" />
    </>
  ),
  people: (
    <>
      <circle cx="12" cy="7" r="3" />
      <circle cx="5" cy="9" r="2.3" />
      <circle cx="19" cy="9" r="2.3" />
      <path d="M6.5 20v-2a5.5 5.5 0 0 1 11 0v2" />
      <path d="M1.5 19v-1a3.5 3.5 0 0 1 4.5-3.3M22.5 19v-1a3.5 3.5 0 0 0-4.5-3.3" />
    </>
  ),
  laptop: (
    <>
      <rect x="4" y="4.5" width="16" height="11" rx="1.5" />
      <path d="M1.5 19h21" />
    </>
  ),
  ribbon: (
    <>
      <circle cx="12" cy="9" r="6" />
      <circle cx="12" cy="9" r="2.5" />
      <path d="m8.5 14-2 8 5.5-3 5.5 3-2-8" />
    </>
  ),
  stethoscope: (
    <>
      <path d="M5 3v5.5a4.5 4.5 0 0 0 9 0V3" />
      <path d="M9.5 13v2.5a5 5 0 0 0 10 0V13" />
      <circle cx="19.5" cy="10.5" r="2.5" />
    </>
  ),
  pill: (
    <>
      <rect x="2" y="8.5" width="13" height="7" rx="3.5" transform="rotate(-45 8.5 12)" />
      <path d="m6 9.5 5 5" />
      <circle cx="16.5" cy="16.5" r="5" />
      <path d="m13 20 7-7" />
    </>
  ),
  person: (
    <>
      <circle cx="12" cy="7" r="4" />
      <path d="M4 21v-1.5A5.5 5.5 0 0 1 9.5 14h5a5.5 5.5 0 0 1 5.5 5.5V21z" />
      <path d="M8.5 21v-3M15.5 21v-3" />
    </>
  ),
  home: (
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9v12h14V9" />
      <path d="M12 12.5v5M9.5 15h5" />
    </>
  ),
};

function Icon({ name, size = 24 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function Chevron() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}
