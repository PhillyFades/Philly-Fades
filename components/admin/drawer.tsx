"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const DrawerClose = createContext<(() => void) | null>(null);

export function useDrawerClose() {
  return useContext(DrawerClose);
}

export function EditDrawer({
  title,
  trigger = "Edit",
  tone = "quiet",
  children,
}: {
  title: string;
  trigger?: string;
  tone?: "quiet" | "primary";
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const triggerClass =
    tone === "primary"
      ? "inline-flex h-9 items-center rounded-full bg-sun px-3 text-sm font-semibold text-ink"
      : "inline-flex h-8 items-center rounded-full border border-white/20 px-3 text-xs font-semibold text-white hover:border-sun hover:text-sun";

  return (
    <DrawerClose.Provider value={() => setOpen(false)}>
      <button type="button" onClick={() => setOpen(true)} className={triggerClass}>
        {trigger}
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70" onMouseDown={() => setOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="h-full w-full max-w-md overflow-y-auto border-l border-white/10 bg-[#141414] p-4 shadow-2xl"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-display text-2xl leading-none">{title}</h2>
              <button type="button" onClick={() => setOpen(false)} className="text-sm text-muted hover:text-white">
                Close
              </button>
            </div>
            {children}
          </div>
        </div>
      ) : null}
    </DrawerClose.Provider>
  );
}
