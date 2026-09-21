"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ChevronDown, Check, Globe } from "lucide-react";

const NAV_LINKS = [
  // { label: "Home", href: "/" },
  // { label: "Why TASIA", href: "/why-tasia" },
  // { label: "Programs", href: "/programs" },
  { label: "Gallery", href: "/gallery" },
  // { label: "Contact Us", href: "/contact" },
];

const LANGUAGES = [
  { code: "EN", label: "English" },
  { code: "ES", label: "Español" },
  { code: "PT", label: "Português" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [lang, setLang] = useState(LANGUAGES[0]);
  const [scrolled, setScrolled] = useState(false);
  const langRef = useRef(null);

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  // Add a shadow once the page is scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setOpen(false);
    setLangOpen(false);
  }, [pathname]);

  // Close language dropdown on outside click, and everything on Escape
  useEffect(() => {
    const onClick = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        setLangOpen(false);
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Reset mobile menu if the viewport grows to desktop size
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e) => e.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-charcoal/10 bg-warm-ivory/90 backdrop-blur-md transition-shadow duration-300 ${
        scrolled ? "shadow-[0_4px_20px_-8px_rgba(0,0,0,0.15)]" : ""
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:h-20 sm:px-6 lg:px-10">
        {/* Logo */}
        <Link
          href="/"
          aria-label="Tasia home"
          className="relative h-10 w-28 shrink-0 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy sm:h-12 sm:w-32 lg:h-14 lg:w-36"
        >
          <Image
            src="/images/LOGOs.png"
            alt="Tasia"
            fill
            className="object-contain object-left"
            sizes="(min-width: 1024px) 144px, (min-width: 640px) 128px, 112px"
            priority
          />
        </Link>

        {/* Desktop navigation */}
        <nav
          aria-label="Main"
          className="hidden items-center gap-6 lg:flex xl:gap-9"
        >
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`group relative py-2 text-base transition-colors xl:text-lg ${
                  active
                    ? "font-medium text-navy"
                    : "text-charcoal/80 hover:text-navy"
                } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy rounded-sm`}
              >
                {link.label}
                <span
                  className={`absolute inset-x-0 -bottom-0.5 h-0.5 origin-left rounded-full bg-navy transition-transform duration-300 ${
                    active
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-4 lg:flex">
          <div className="relative" ref={langRef}>
            <button
              type="button"
              onClick={() => setLangOpen((v) => !v)}
              aria-haspopup="listbox"
              aria-expanded={langOpen}
              aria-label="Change language"
              className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-charcoal/80 transition-colors hover:bg-charcoal/5 hover:text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy"
            >
              <Globe size={16} />
              {lang.code}
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${
                  langOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {langOpen && (
              <ul
                role="listbox"
                aria-label="Language"
                className="absolute right-0 top-full mt-2 w-44 overflow-hidden rounded-xl border border-charcoal/10 bg-warm-ivory py-1.5 shadow-xl"
              >
                {LANGUAGES.map((l) => {
                  const selected = l.code === lang.code;
                  return (
                    <li key={l.code} role="option" aria-selected={selected}>
                      <button
                        type="button"
                        onClick={() => {
                          setLang(l);
                          setLangOpen(false);
                        }}
                        className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors hover:bg-charcoal/5 hover:text-navy ${
                          selected ? "font-medium text-navy" : "text-charcoal/80"
                        }`}
                      >
                        {l.label}
                        {selected && <Check size={14} />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <Link
            href="/contact"
            className="whitespace-nowrap rounded-full bg-navy px-6 py-2.5 text-sm font-medium text-warm-ivory shadow-sm transition-all hover:bg-navy-dark hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
          >
            Start your journey
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full text-charcoal transition-colors hover:bg-charcoal/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`grid transition-[grid-template-rows] duration-300 ease-out lg:hidden ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div
            className={`max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-charcoal/10 bg-warm-ivory px-4 pb-6 pt-2 sm:px-6 ${
              open ? "" : "invisible"
            }`}
          >
            <nav aria-label="Mobile" className="flex flex-col">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`border-b border-charcoal/5 py-3.5 text-base transition-colors ${
                      active
                        ? "font-medium text-navy"
                        : "text-charcoal/80 hover:text-navy"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Language selector */}
            <div className="mt-5" role="group" aria-label="Language">
              <div className="flex gap-2">
                {LANGUAGES.map((l) => {
                  const selected = l.code === lang.code;
                  return (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => setLang(l)}
                      aria-pressed={selected}
                      className={`flex-1 rounded-full border px-3 py-2 text-sm transition-colors ${
                        selected
                          ? "border-navy bg-navy text-warm-ivory"
                          : "border-charcoal/15 text-charcoal/80 hover:border-navy hover:text-navy"
                      }`}
                    >
                      {l.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <Link
              href="/contact"
              className="mt-5 block rounded-full bg-navy px-6 py-3 text-center text-sm font-medium text-warm-ivory transition-colors hover:bg-navy-dark"
            >
              Start your journey
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}