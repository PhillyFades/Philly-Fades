"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";

const programRequestTypes = new Set(["senior", "sensory", "veterans", "unhoused", "youth"]);
const eventRequestTypes = new Set(["community-event", "corporate"]);

function requestSection(type: string | null) {
  if (!type) return null;
  if (programRequestTypes.has(type)) return "/programs";
  if (eventRequestTypes.has(type)) return "/events";
  return null;
}

export function isNavActive(href: string, pathname: string, requestType: string | null) {
  if (pathname === "/request" || pathname.startsWith("/request/")) {
    return href === requestSection(requestType);
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

const styles = {
  header: {
    idle: "relative text-sm text-white/90 hover:text-[#FFC72C]",
    active: "relative text-sm text-[#FFC72C]",
  },
  mobile: {
    idle: "inline-flex items-center gap-2 text-lg text-white",
    active: "inline-flex items-center gap-2 text-lg text-[#FFC72C]",
  },
  "mobile-sub": {
    idle: "inline-flex items-center gap-2 text-base text-muted",
    active: "inline-flex items-center gap-2 text-base text-[#FFC72C]",
  },
  footer: {
    idle: "text-sm text-white hover:text-[#FFC72C]",
    active: "text-sm text-[#FFC72C] underline decoration-[#FFC72C] underline-offset-4",
  },
} as const;

export function NavLink({
  href,
  children,
  variant = "header",
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof styles;
}) {
  const pathname = usePathname();
  const requestType = useSearchParams().get("type");
  const active = isNavActive(href, pathname, requestType);

  return (
    <Link href={href} className={active ? styles[variant].active : styles[variant].idle} aria-current={active ? "page" : undefined}>
      {variant === "mobile" || variant === "mobile-sub" ? (
        <span aria-hidden className={`h-1.5 w-1.5 shrink-0 rounded-full ${active ? "bg-[#FFC72C]" : "bg-transparent"}`} />
      ) : null}
      {children}
      {variant === "header" ? (
        <span aria-hidden className="pointer-events-none absolute -bottom-2 left-1/2 flex -translate-x-1/2 flex-col items-center gap-0.5">
          <span className={`h-px w-6 ${active ? "bg-[#FFC72C]" : "bg-transparent"}`} />
          <span className={`h-1 w-1 rounded-full ${active ? "bg-[#FFC72C]" : "bg-transparent"}`} />
        </span>
      ) : null}
    </Link>
  );
}
