"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { communityLinks, nav, site } from "@/content/site";

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
        <Link href="/" className="flex items-center gap-3" aria-label="Buzz Boxx PXV home">
          <Logo priority />
          <span className="font-display text-lg leading-none tracking-tight text-white">
            Buzz Boxx <span className="text-sun">PXV</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-white/90 hover:text-sun"
              aria-current={pathname === item.href ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={site.inShopUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center rounded-full border border-white/20 px-4 text-sm font-semibold text-white hover:border-gold"
          >
            {site.inShopLabel}
          </a>
          <Link
            href="/book"
            className="inline-flex min-h-11 items-center rounded-full bg-sun px-5 text-sm font-semibold text-ink hover:bg-[#ffd45a]"
          >
            Book a house call
          </Link>
        </div>

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

      {open ? (
        <nav id="mobile-nav" className="border-t border-white/10 px-5 py-6 lg:hidden" aria-label="Mobile">
          <div className="flex flex-col gap-4">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="text-lg text-white">
                {item.label}
              </Link>
            ))}
            <p className="pt-2 text-[11px] uppercase tracking-[0.2em] text-gold">Community</p>
            {communityLinks.map((item) => (
              <Link key={item.href} href={item.href} className="text-base text-muted">
                {item.label}
              </Link>
            ))}
            <Link
              href="/book"
              className="mt-2 inline-flex min-h-12 items-center justify-center rounded-full bg-sun px-5 font-semibold text-ink"
            >
              Book a house call
            </Link>
            <a
              href={site.inShopUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-gold/80 px-5 font-semibold"
            >
              {site.inShopLabel}
            </a>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
