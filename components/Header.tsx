"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { NavLink } from "@/components/NavLink";
import { communityLinks, nav } from "@/content/site";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [openPath, setOpenPath] = useState<string | null>(null);
  const pathname = usePathname();
  const open = openPath === pathname;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition ${
        scrolled || open ? "glass border-b border-white/10" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between gap-4 px-5">
        <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3" aria-label="Buzz Boxx PXV home">
          <Logo priority className="h-9 w-[4.5rem] shrink-0 sm:h-11 sm:w-[5.5rem]" />
          <span className="whitespace-nowrap font-display text-sm leading-none tracking-tight text-white sm:text-lg">
            Buzz Boxx <span className="text-sun">PXV</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          <Suspense fallback={null}>
            {nav.map((item) => (
              <NavLink key={item.href} href={item.href} variant="header">
                {item.label}
              </NavLink>
            ))}
          </Suspense>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/book"
            className="inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-full bg-sun px-4 text-sm font-semibold text-ink hover:bg-[#ffd45a] sm:px-5"
          >
            Book Now
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpenPath(open ? null : pathname)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span aria-hidden className="flex flex-col gap-1.5">
              <span className="block h-0.5 w-5 bg-white" />
              <span className="block h-0.5 w-5 bg-white" />
              <span className="block h-0.5 w-5 bg-sun" />
            </span>
          </button>
        </div>
      </div>

      {open ? (
        <nav id="mobile-nav" className="border-t border-white/10 px-5 py-6 lg:hidden" aria-label="Mobile">
          <div className="flex flex-col gap-4">
            <Suspense fallback={null}>
              {nav.map((item) => (
                <NavLink key={item.href} href={item.href} variant="mobile">
                  {item.label}
                </NavLink>
              ))}
              <p className="pt-2 text-[11px] uppercase tracking-[0.2em] text-gold">Community</p>
              {communityLinks.map((item) => (
                <NavLink key={item.href} href={item.href} variant="mobile-sub">
                  {item.label}
                </NavLink>
              ))}
              <NavLink href="/request" variant="mobile">
                Partner with us
              </NavLink>
            </Suspense>
            <Link
              href="/book"
              className="mt-2 inline-flex min-h-12 items-center justify-center rounded-full bg-sun px-5 font-semibold text-ink"
            >
              Book Now
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
