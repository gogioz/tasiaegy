"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

const NAV_LINKS = [
  // { label: "Home", href: "/" },
  // { label: "Why TASIA", href: "/why-tasia" },
  // { label: "Programs", href: "/programs" },
  { label: "Gallery", href: "/gallery" },
  // { label: "Contact Us", href: "/contact" },
];

const LANGUAGES = ["English", "Español", "Português"];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [lang, setLang] = useState("En");

  return (
    <header className="sticky top-0 z-50 bg-warm-ivory/90 backdrop-blur-sm border-b border-charcoal/10">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <Link href="/" className="relative h-9 w-32 shrink-0">
          <Image
            src="/images/LOGO.png"
            alt="Tasia"
            fill
            className="object-contain object-left"
            sizes="260px"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-9 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-charcoal/80 transition-colors hover:text-navy"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <div className="relative">
            <button
              onClick={() => setLangOpen((v) => !v)}
              className="flex items-center gap-1 text-sm text-charcoal/80 hover:text-navy"
            >
              {lang}
              <ChevronDown size={14} />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-8 w-36 rounded-xl border border-charcoal/10 bg-warm-ivory py-2 shadow-lg">
                {LANGUAGES.map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setLang(l.slice(0, 2));
                      setLangOpen(false);
                    }}
                    className="block w-full px-4 py-1.5 text-left text-sm text-charcoal/80 hover:text-navy"
                  >
                    {l}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/contact"
            className="rounded-full bg-navy px-6 py-2.5 text-sm font-medium text-warm-ivory transition-colors hover:bg-navy-dark"
          >
            Start your journey
          </Link>
        </div>

        <button
          className="text-charcoal lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-charcoal/10 bg-warm-ivory px-6 pb-6 lg:hidden">
          <nav className="flex flex-col gap-4 pt-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm text-charcoal/80 hover:text-navy"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-navy px-6 py-2.5 text-center text-sm font-medium text-warm-ivory"
            >
              Start your journey
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
