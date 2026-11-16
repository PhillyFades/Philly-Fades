import { createdInWeek, newYorkToday, weekBounds } from "@/lib/admin/dates";
import { requireAdmin } from "@/lib/admin/guard";
import {
  previewBlocks,
  previewBookings,
  previewCopy,
  previewEvents,
  previewGallery,
  previewMemberships,
  previewPlans,
  previewRequests,
  previewSettings,
} from "@/lib/admin/preview";

const setupMessage =
  "Admin tables are not available yet. Apply supabase/migrations/20261115220000_admin.sql in the Supabase SQL editor, then sign in again.";

export type BookingRow = (typeof previewBookings)[number];
export type MembershipRow = (typeof previewMemberships)[number];
export type RequestRow = (typeof previewRequests)[number];
export type BlockRow = (typeof previewBlocks)[number];
export type PlanRow = (typeof previewPlans)[number];
export type EventRow = (typeof previewEvents)[number];
export type GalleryRow = (typeof previewGallery)[number];
export type CopyRow = (typeof previewCopy)[number];
export type SettingsRow = typeof previewSettings;

type Loaded<T> = { rows: T; warning: string | null };

function warn(error: { message: string } | null) {
  if (!error) return null;
  return `${setupMessage} ${error.message}`;
}

async function db() {
  const session = await requireAdmin();
  return session;
}

export async function loadDashboard(): Promise<{
  email: string;
  mustChangePassword: boolean;
  weekLabel: string;
  counts: { bookings: number; memberships: number; requests: number };
  upcoming: { href: string; title: string; when: string; status: string }[];
  warning: string | null;
}> {
  const session = await db();
  const bounds = weekBounds();
  if (session.preview) {
    const bookings = previewBookings.filter((row) => createdInWeek(row.created_at, bounds));
    const memberships = previewMemberships.filter((row) => createdInWeek(row.created_at, bounds));
    const requests = previewRequests.filter((row) => createdInWeek(row.created_at, bounds));
    return {
      email: session.email,
      mustChangePassword: session.mustChangePassword,
      weekLabel: `${bounds.start} to ${bounds.end}`,
      counts: { bookings: bookings.length, memberships: memberships.length, requests: requests.length },
      upcoming: upcomingFrom(previewBookings, previewRequests),
      warning: null,
    };
  }

  const [bookings, memberships, requests, slots] = await Promise.all([
    session.supabase!.from("bookings").select("*").order("created_at", { ascending: false }).limit(300),
    session.supabase!.from("membership_signups").select("id, created_at").order("created_at", { ascending: false }).limit(300),
    session.supabase!.from("event_inquiries").select("*").order("created_at", { ascending: false }).limit(300),
    session.supabase!.from("request_slots").select("*"),
  ]);
  const warning = warn(bookings.error || memberships.error || requests.error || slots.error);
  const bookingRows = (bookings.data ?? []) as BookingRow[];
  const requestRows = attachSlots((requests.data ?? []) as RequestRow[], (slots.data ?? []) as SlotRecord[]);
  return {
    email: session.email,
    mustChangePassword: session.mustChangePassword,
    weekLabel: `${bounds.start} to ${bounds.end}`,
    counts: {
      bookings: bookingRows.filter((row) => createdInWeek(row.created_at, bounds)).length,
      memberships: ((memberships.data ?? []) as { created_at: string }[]).filter((row) => createdInWeek(row.created_at, bounds)).length,
      requests: requestRows.filter((row) => createdInWeek(row.created_at, bounds)).length,
    },
    upcoming: upcomingFrom(bookingRows, requestRows),
    warning,
  };
}

type SlotRecord = { id: string; inquiry_id: string; slot_date: string; start_time: string; end_time: string };

function attachSlots(rows: RequestRow[], slots: SlotRecord[]): RequestRow[] {
  return rows.map((row) => ({
    ...row,
    slots: slots
      .filter((slot) => slot.inquiry_id === row.id)
      .map((slot) => ({ id: slot.id, slot_date: slot.slot_date, start_time: slot.start_time, end_time: slot.end_time })),
  })) as RequestRow[];
}

function upcomingFrom(bookings: BookingRow[], requests: RequestRow[]) {
  const today = newYorkToday();
  const visits = bookings
    .filter((row) => !["cancelled", "completed"].includes(row.status))
    .map((row) => ({
      href: `/admin/bookings/${row.id}`,
      title: row.client_name,
      when: row.scheduled_date || row.requested_date,
      time: row.scheduled_time || row.requested_time,
      status: row.status,
    }))
    .filter((row) => row.when >= today);
  const slots = requests.flatMap((row) =>
    (row.slots ?? [])
      .filter((slot) => slot.slot_date >= today)
      .map((slot) => ({
        href: `/admin/requests/${row.id}`,
        title: row.organization || row.package_name,
        when: slot.slot_date,
        time: slot.start_time,
        status: row.status,
      })),
  );
  return [...visits, ...slots]
    .sort((a, b) => `${a.when}${a.time}`.localeCompare(`${b.when}${b.time}`))
    .slice(0, 8)
    .map((row) => ({ href: row.href, title: row.title, when: `${row.when} ${row.time}`, status: row.status }));
}

function matchesBooking(row: BookingRow, filters: { status?: string; from?: string; to?: string }) {
  const status = filters.status || "";
  if (status === "new" && !["new", "requested", "pending_payment"].includes(row.status)) return false;
  if (status && status !== "new" && row.status !== status) return false;
  const day = row.scheduled_date || row.requested_date;
  if (filters.from && day < filters.from) return false;
  if (filters.to && day > filters.to) return false;
  return true;
}

export async function loadBookings(filters: { status?: string; from?: string; to?: string }): Promise<Loaded<BookingRow[]>> {
  const session = await db();
  if (session.preview) return { rows: previewBookings.filter((row) => matchesBooking(row, filters)), warning: null };
  const result = await session.supabase!.from("bookings").select("*").order("created_at", { ascending: false });
  const rows = ((result.data ?? []) as BookingRow[]).filter((row) => matchesBooking(row, filters));
  return { rows, warning: warn(result.error) };
}

export async function loadBooking(id: string) {
  const session = await db();
  if (session.preview) return previewBookings.find((row) => row.id === id) ?? null;
  const { data } = await session.supabase!.from("bookings").select("*").eq("id", id).maybeSingle();
  return (data as BookingRow | null) ?? null;
}

export async function loadMemberships(): Promise<Loaded<MembershipRow[]>> {
  const session = await db();
  if (session.preview) return { rows: previewMemberships, warning: null };
  const result = await session.supabase!.from("membership_signups").select("*").order("created_at", { ascending: false });
  return { rows: (result.data ?? []) as MembershipRow[], warning: warn(result.error) };
}

export async function loadMembership(id: string) {
  const { rows } = await loadMemberships();
  return rows.find((row) => row.id === id) ?? null;
}

export async function loadRequests(): Promise<Loaded<RequestRow[]>> {
  const session = await db();
  if (session.preview) return { rows: previewRequests, warning: null };
  const [requests, slots] = await Promise.all([
    session.supabase!.from("event_inquiries").select("*").order("created_at", { ascending: false }),
    session.supabase!.from("request_slots").select("*").order("slot_date"),
  ]);
  return {
    rows: attachSlots((requests.data ?? []) as RequestRow[], (slots.data ?? []) as SlotRecord[]),
    warning: warn(requests.error || slots.error),
  };
}

export async function loadRequest(id: string) {
  const { rows } = await loadRequests();
  return rows.find((row) => row.id === id) ?? null;
}

export async function loadCalendar() {
  const [bookings, requests, blocks] = await Promise.all([loadBookings({}), loadRequests(), loadBlocks()]);
  const items = [
    ...bookings.rows
      .filter((row) => ["confirmed", "scheduled", "dispatched"].includes(row.status) || row.scheduled_date)
      .filter((row) => !["cancelled", "completed"].includes(row.status))
      .map((row) => ({
        id: row.id,
        href: `/admin/bookings/${row.id}`,
        title: row.client_name,
        date: row.scheduled_date || row.requested_date,
        start: (row.scheduled_time || row.requested_time || "").slice(0, 5),
        end: "",
        kind: "booking" as const,
      })),
    ...requests.rows.flatMap((row) =>
      (row.slots ?? []).map((slot) => ({
        id: slot.id,
        href: `/admin/requests/${row.id}`,
        title: row.organization || row.package_name,
        date: slot.slot_date,
        start: slot.start_time.slice(0, 5),
        end: slot.end_time.slice(0, 5),
        kind: "event" as const,
      })),
    ),
  ];
  return { items, blocks: blocks.rows, warning: bookings.warning || requests.warning || blocks.warning };
}

export async function loadBlocks(): Promise<Loaded<BlockRow[]>> {
  const session = await db();
  if (session.preview) return { rows: previewBlocks, warning: null };
  const result = await session.supabase!.from("availability_blocks").select("*").order("starts_on");
  return { rows: (result.data ?? []) as BlockRow[], warning: warn(result.error) };
}

export async function loadPlans(): Promise<Loaded<PlanRow[]>> {
  const session = await db();
  if (session.preview) return { rows: previewPlans, warning: null };
  const result = await session.supabase!.from("membership_plans").select("*").order("sort_order");
  return { rows: (result.data ?? []) as PlanRow[], warning: warn(result.error) };
}

export async function loadSiteEvents(): Promise<Loaded<EventRow[]>> {
  const session = await db();
  if (session.preview) return { rows: previewEvents, warning: null };
  const result = await session.supabase!.from("site_events").select("*").order("sort_order");
  return { rows: (result.data ?? []) as EventRow[], warning: warn(result.error) };
}

export async function loadGallery(): Promise<Loaded<GalleryRow[]>> {
  const session = await db();
  if (session.preview) return { rows: previewGallery, warning: null };
  const result = await session.supabase!.from("gallery_items").select("*").order("sort_order");
  return { rows: (result.data ?? []) as GalleryRow[], warning: warn(result.error) };
}

export async function loadCopy(): Promise<Loaded<CopyRow[]>> {
  const session = await db();
  if (session.preview) return { rows: previewCopy, warning: null };
  const result = await session.supabase!.from("site_copy").select("*").order("key");
  return { rows: (result.data ?? []) as CopyRow[], warning: warn(result.error) };
}

export async function loadSettings(): Promise<{ row: SettingsRow; warning: string | null }> {
  const session = await db();
  if (session.preview) return { row: previewSettings, warning: null };
  const result = await session.supabase!.from("site_settings").select("*").eq("id", 1).maybeSingle();
  return { row: (result.data as SettingsRow | null) ?? previewSettings, warning: warn(result.error) };
}
