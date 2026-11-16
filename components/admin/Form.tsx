"use client";

import Link from "next/link";
import { useState, type FormEvent, type ReactNode } from "react";
import { useDrawerClose } from "@/components/admin/drawer";
import type { AdminResult } from "@/lib/admin/actions";

export function AdminForm({
  action,
  children,
  confirmText,
  submitLabel = "Save",
  tone = "primary",
  compact = false,
  cancelHref,
}: {
  action: (formData: FormData) => Promise<AdminResult>;
  children: ReactNode;
  confirmText?: string;
  submitLabel?: string;
  tone?: "primary" | "danger";
  compact?: boolean;
  cancelHref?: string;
}) {
  const [toast, setToast] = useState<{ ok: boolean; message: string } | null>(null);
  const [pending, setPending] = useState(false);
  const closeDrawer = useDrawerClose();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (confirmText && !window.confirm(confirmText)) return;
    setPending(true);
    const result = await action(new FormData(event.currentTarget));
    setPending(false);
    setToast(result);
    if (result.ok && closeDrawer) window.setTimeout(closeDrawer, 600);
  }

  const buttonClass =
    tone === "danger"
      ? "inline-flex h-8 items-center rounded-full border border-[#c45c5c] bg-transparent px-3 text-xs font-semibold text-[#ffb4b4] hover:bg-[#3a1414] disabled:opacity-60"
      : "inline-flex h-9 items-center rounded-full bg-sun px-4 text-sm font-semibold text-ink disabled:opacity-60";

  return (
    <form onSubmit={onSubmit} className={compact ? "inline-flex" : "space-y-4"}>
      {children}
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending} className={buttonClass}>
          {pending ? "Saving…" : submitLabel}
        </button>
        {cancelHref ? (
          <Link href={cancelHref} className="inline-flex h-9 items-center text-sm text-muted hover:text-white">
            Cancel
          </Link>
        ) : closeDrawer && tone !== "danger" ? (
          <button type="button" onClick={closeDrawer} className="inline-flex h-9 items-center text-sm text-muted hover:text-white">
            Cancel
          </button>
        ) : null}
      </div>
      {toast ? (
        <p
          role="status"
          className={`fixed bottom-4 right-4 z-50 max-w-xs rounded-2xl px-4 py-3 text-sm font-semibold shadow-lg ${toast.ok ? "bg-sun text-ink" : "bg-[#3a1414] text-[#ffb4b4]"}`}
        >
          {toast.message}
        </p>
      ) : null}
    </form>
  );
}

export function QuietLabel({ children }: { children: ReactNode }) {
  return <span className="mb-2 block text-sm text-white">{children}</span>;
}
