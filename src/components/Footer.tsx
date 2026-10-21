import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 font-semibold">
            <Logo size={24} />
            <span>Compass<span className="text-gold">CEU</span></span>
          </div>
          <p className="mt-3 text-sm text-muted">
            Continuing education for professionals who keep moving forward.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Explore</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link href="/courses" className="hover:text-foreground">All courses</Link></li>
            <li><Link href="/about" className="hover:text-foreground">About us</Link></li>
            <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Contact</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>hello@compassceu.example</li>
            <li>Mon–Fri, 9:00 AM – 5:00 PM</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} CompassCEU. All rights reserved.
      </div>
    </footer>
  );
}
