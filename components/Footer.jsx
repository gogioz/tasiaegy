import Link from "next/link";
import Image from "next/image";
import { AtSign, Phone, Globe, MessageCircle } from "lucide-react";

const EXPLORE_LINKS = [
  { label: "Our Philosophy", href: "/why-tasia" },
  { label: "Why TASIA", href: "/why-tasia" },
  { label: "Programs", href: "/programs" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact Us", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-charcoal text-warm-ivory">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <div className="relative h-24 w-40">
              <Image
                src="/brand/logo-full-light.png"
                alt="Tasia — Journey in Sight"
                fill
                className="object-contain object-left"
                sizes="160px"
              />
            </div>
            <p className="mt-3 max-w-xs text-sm text-warm-ivory/70">
              Immersive travel into the living past.
            </p>
            <div className="mt-6 flex gap-3">
              {[AtSign, Phone, Globe, MessageCircle].map((Icon, i) => (
                <span
                  key={i}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-warm-ivory/25 text-warm-ivory/80"
                >
                  <Icon size={15} />
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-warm-ivory/50">
              Explore
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-warm-ivory/80 hover:text-navy"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-warm-ivory/50">
              Contact
            </p>
            <ul className="mt-4 space-y-3 text-sm text-warm-ivory/80">
              <li>+1 555 018 4402</li>
              <li>wander@tasia.travel</li>
              <li>@tasia.travel</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-warm-ivory/10 pt-6 text-xs text-warm-ivory/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} TASIA. All rights reserved.</p>
          <p>A modern myth — direction, design &amp; storytelling.</p>
        </div>
      </div>
    </footer>
  );
}
