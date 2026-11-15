"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import type { AdminResult } from "@/lib/admin/actions";

export function AdminForm({
  action,
  children,
  confirmText,
  submitLabel = "Save",
}: {
  action: (formData: FormData) => Promise<AdminResult>;
  children: ReactNode;
  confirmText?: string;
  submitLabel?: string;
}) {
  const [toast, setToast] = useState<{ ok: boolean; message: string } | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (confirmText && !window.confirm(confirmText)) return;
    setPending(true);
    const result = await action(new FormData(event.currentTarget));
    setPending(false);
    setToast(result);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {children}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 items-center rounded-full bg-sun px-5 text-sm font-semibold text-ink disabled:opacity-60"
      >
        {pending ? "Saving…" : submitLabel}
      </button>
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
