import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { comingSoon } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CompassCEU — Continuing Education for Professionals",
    template: "%s | CompassCEU",
  },
  description:
    "Continuing education for California RNs, LVNs, CNAs, and home health aides (HHA).",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        {comingSoon ? (
          <main className="flex-1">{children}</main>
        ) : (
          <>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </>
        )}
      </body>
    </html>
  );
}
