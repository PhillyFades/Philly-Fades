"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { signOut } from "@/lib/admin/actions";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/memberships", label: "Memberships" },
  { href: "/admin/requests", label: "Requests" },
  { href: "/admin/calendar", label: "Calendar" },
  { href: "/admin/content", label: "Content" },
  { href: "/admin/prices", label: "Prices" },
  { href: "/admin/account", label: "Account" },
];

export function AdminShell({ email, children }: { email: string; children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="admin-ui min-h-screen bg-ink lg:grid lg:grid-cols-[240px_1fr]">
      <aside className={`${open ? "block" : "hidden"} border-b border-white/10 bg-card lg:block lg:border-b-0 lg:border-r`}>
        <div className="px-5 py-6">
          <p className="font-display text-xl leading-none">
            Buzz Boxx <span className="text-sun">PXV</span>
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.16em] text-gold">Admin</p>
        </div>
        <nav className="flex flex-col gap-1 px-3 pb-6">
          {links.map((link) => {
            const active = link.href === "/admin" ? pathname === "/admin" : pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={`rounded-xl px-3 py-2 text-sm ${active ? "bg-sun/15 text-sun underline decoration-sun decoration-2 underline-offset-4" : "text-white/85 hover:text-sun"}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div>
        <header className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
          <button type="button" className="text-sm text-sun lg:hidden" onClick={() => setOpen((value) => !value)}>
            {open ? "Close menu" : "Menu"}
          </button>
          <p className="truncate text-sm text-muted">{email}</p>
          <form action={signOut}>
            <button type="submit" className="text-sm text-white hover:text-sun">
              Sign out
            </button>
          </form>
        </header>
        <main id="main" className="px-4 py-5 sm:px-5">
          {children}
        </main>
      </div>
    </div>
  );
}
