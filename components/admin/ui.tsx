import type { ReactNode } from "react";

export function AdminTitle({ title, lede }: { title: string; lede?: string }) {
  return (
    <div className="mb-8">
      <h1 className="font-display text-4xl leading-none">{title}</h1>
      {lede ? <p className="mt-3 max-w-2xl text-base leading-7 text-muted">{lede}</p> : null}
    </div>
  );
}

export function Warning({ message }: { message: string | null }) {
  if (!message) return null;
  return <p className="mb-6 rounded-2xl border border-sun/40 bg-sun/10 px-4 py-3 text-sm leading-6 text-white">{message}</p>;
}

export function StatusBadge({ status }: { status: string }) {
  const label =
    status === "pending_payment" || status === "requested" || status === "new"
      ? status === "requested"
        ? "Requested"
        : status === "pending_payment"
          ? "Pending payment"
          : "New"
      : status.replaceAll("_", " ");
  return <span className="rounded-full border border-sun/40 px-2 py-1 text-xs uppercase tracking-wide text-sun">{label}</span>;
}

export function DataTable({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full min-w-[720px] text-left text-sm">{children}</table>
    </div>
  );
}

export function Th({ children }: { children: ReactNode }) {
  return <th className="px-4 py-3 text-xs font-medium uppercase tracking-[0.14em] text-gold">{children}</th>;
}

export function Td({ children }: { children: ReactNode }) {
  return <td className="border-t border-white/10 px-4 py-3 align-top text-white">{children}</td>;
}
