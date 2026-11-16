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

const underline = "underline decoration-[#FFC72C] decoration-2 underline-offset-4";

const styles = {
  header: {
    idle: "text-sm text-white/90 hover:text-[#FFC72C]",
    active: `text-sm text-[#FFC72C] ${underline}`,
  },
  mobile: {
    idle: "w-fit text-lg text-white",
    active: `w-fit text-lg text-[#FFC72C] ${underline}`,
  },
  "mobile-sub": {
    idle: "w-fit text-base text-muted",
    active: `w-fit text-base text-[#FFC72C] ${underline}`,
  },
  footer: {
    idle: "text-sm text-white hover:text-[#FFC72C]",
    active: `text-sm text-[#FFC72C] ${underline}`,
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
      {children}
    </Link>
  );
}
