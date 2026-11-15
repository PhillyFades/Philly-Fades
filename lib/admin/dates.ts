export function newYorkToday(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(now);
}

export function weekBounds(today = newYorkToday()) {
  const [year, month, day] = today.split("-").map(Number);
  const utc = new Date(Date.UTC(year, month - 1, day));
  const weekday = utc.getUTCDay();
  const monday = new Date(utc);
  monday.setUTCDate(utc.getUTCDate() - (weekday === 0 ? 6 : weekday - 1));
  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);
  const iso = (date: Date) => date.toISOString().slice(0, 10);
  return { start: iso(monday), end: iso(sunday), today };
}

export function createdInWeek(createdAt: string, bounds = weekBounds()) {
  const day = new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(new Date(createdAt));
  return day >= bounds.start && day <= bounds.end;
}

export function plusFourHours(time: string) {
  const match = /^(\d{2}):(\d{2})/.exec(time);
  if (!match) return "";
  const total = Number(match[1]) * 60 + Number(match[2]) + 240;
  const mins = ((total % 1440) + 1440) % 1440;
  return `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
}

export function formatWhen(date: string, time?: string | null) {
  if (!date) return "Date not set";
  const [year, month, day] = date.split("-").map(Number);
  if (!year || !month || !day) return date;
  const label = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
  return time ? `${label} · ${time.slice(0, 5)}` : label;
}
