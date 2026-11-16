"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type CalendarEntry = {
  id: string;
  href: string;
  title: string;
  date: string;
  start: string;
  end: string;
  kind: "booking" | "event";
};

function parseDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

function isoDate(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function startOfWeek(date: Date) {
  const copy = new Date(date);
  const weekday = copy.getDay();
  copy.setDate(copy.getDate() - (weekday === 0 ? 6 : weekday - 1));
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export function CalendarBoard({ items, initialDate }: { items: CalendarEntry[]; initialDate: string }) {
  const [cursor, setCursor] = useState(() => parseDate(initialDate));
  const [mode, setMode] = useState<"month" | "week">("month");
  const byDate = useMemo(() => {
    const map = new Map<string, CalendarEntry[]>();
    for (const item of items) {
      const list = map.get(item.date) ?? [];
      list.push(item);
      map.set(item.date, list);
    }
    return map;
  }, [items]);

  const days = mode === "week" ? weekDays(cursor) : monthDays(cursor);
  const label =
    mode === "week"
      ? `${days[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${days[6].toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
      : cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  function shift(direction: number) {
    const next = new Date(cursor);
    if (mode === "week") next.setDate(next.getDate() + direction * 7);
    else next.setMonth(next.getMonth() + direction);
    setCursor(next);
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button type="button" className="rounded-full border border-white/15 px-3 py-2 text-sm" onClick={() => shift(-1)}>
            Previous
          </button>
          <button type="button" className="rounded-full border border-white/15 px-3 py-2 text-sm" onClick={() => shift(1)}>
            Next
          </button>
        </div>
        <p className="font-display text-2xl leading-none">{label}</p>
        <div className="flex gap-2">
          {(["month", "week"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setMode(value)}
              className={`rounded-full px-3 py-2 text-sm capitalize ${mode === value ? "bg-sun text-ink" : "border border-white/15"}`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-xs uppercase tracking-wide text-gold">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <p key={day}>{day}</p>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-2">
        {days.map((day) => {
          const key = isoDate(day);
          const entries = byDate.get(key) ?? [];
          const outside = mode === "month" && day.getMonth() !== cursor.getMonth();
          return (
            <div key={key} className={`min-h-28 rounded-xl border border-white/10 p-2 ${outside ? "opacity-40" : "bg-card"}`}>
              <p className="text-xs text-muted">{day.getDate()}</p>
              <div className="mt-1 space-y-1">
                {entries.map((entry) => (
                  <Link key={entry.id} href={entry.href} className="block rounded-lg bg-sun/15 px-1.5 py-1 text-left text-xs leading-4 text-sun hover:bg-sun hover:text-ink">
                    <span className="block font-semibold">{entry.start || "Visit"}{entry.end ? `–${entry.end}` : ""}</span>
                    <span className="block truncate">{entry.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function weekDays(cursor: Date) {
  const start = startOfWeek(cursor);
  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
}

function monthDays(cursor: Date) {
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const start = startOfWeek(first);
  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
}
