"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { plusFourHours } from "@/lib/admin/dates";
import { requireAdmin } from "@/lib/admin/guard";
import { createSupabaseServer } from "@/lib/supabase/server";

export type AdminResult = { ok: boolean; message: string };

const bookingStatuses = new Set(["new", "confirmed", "scheduled", "completed", "cancelled", "pending_payment", "requested", "dispatched"]);
const membershipStatuses = new Set(["pending", "active", "paused", "cancelled", "pending_payment", "requested"]);
const requestStatuses = new Set(["requested", "reviewing", "confirmed", "scheduled", "declined", "completed", "cancelled"]);

function text(formData: FormData, key: string, max = 4000) {
  return String(formData.get(key) ?? "").trim().slice(0, max);
}

function checked(formData: FormData, key: string) {
  const value = formData.get(key);
  return value === "on" || value === "true";
}

function refreshSite() {
  updateTag("cms");
  revalidatePath("/", "layout");
}

async function session() {
  return requireAdmin();
}

export async function saveBooking(formData: FormData): Promise<AdminResult> {
  const current = await session();
  const id = text(formData, "id", 80);
  const status = text(formData, "status", 40);
  if (!bookingStatuses.has(status)) return { ok: false, message: "Choose a status." };
  if (current.preview) return { ok: true, message: "Saved" };
  const { error } = await current.supabase!.from("bookings").update({
    status,
    scheduled_date: text(formData, "scheduled_date", 10) || null,
    scheduled_time: text(formData, "scheduled_time", 8) || null,
    internal_notes: text(formData, "internal_notes"),
  }).eq("id", id);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin");
  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/bookings/${id}`);
  revalidatePath("/admin/calendar");
  return { ok: true, message: "Saved" };
}

export async function saveMembership(formData: FormData): Promise<AdminResult> {
  const current = await session();
  const id = text(formData, "id", 80);
  const status = text(formData, "status", 40);
  if (!membershipStatuses.has(status)) return { ok: false, message: "Choose a status." };
  if (current.preview) return { ok: true, message: "Saved" };
  const { error } = await current.supabase!.from("membership_signups").update({
    status,
    admin_notes: text(formData, "admin_notes"),
  }).eq("id", id);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/memberships");
  revalidatePath(`/admin/memberships/${id}`);
  return { ok: true, message: "Saved" };
}

export async function saveRequest(formData: FormData): Promise<AdminResult> {
  const current = await session();
  const id = text(formData, "id", 80);
  const status = text(formData, "status", 40);
  if (!requestStatuses.has(status)) return { ok: false, message: "Choose a status." };
  const quote = text(formData, "quote", 20);
  const quoteCents = quote ? Math.round(Number(quote) * 100) : null;
  if (quote && !Number.isFinite(quoteCents)) return { ok: false, message: "Enter the quote in dollars." };
  if (current.preview) return { ok: true, message: "Saved" };
  const { error } = await current.supabase!.from("event_inquiries").update({
    status,
    quote_cents: quoteCents,
    admin_notes: text(formData, "admin_notes"),
  }).eq("id", id);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/requests");
  revalidatePath(`/admin/requests/${id}`);
  revalidatePath("/admin/calendar");
  return { ok: true, message: "Saved" };
}

export async function addSlot(formData: FormData): Promise<AdminResult> {
  const current = await session();
  const inquiryId = text(formData, "inquiry_id", 80);
  const slotDate = text(formData, "slot_date", 10);
  const start = text(formData, "start_time", 8);
  const end = plusFourHours(start);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(slotDate) || !end) return { ok: false, message: "Choose a date and start time." };
  if (current.preview) return { ok: true, message: "Slot added" };
  const { error } = await current.supabase!.from("request_slots").insert({
    inquiry_id: inquiryId,
    slot_date: slotDate,
    start_time: start.slice(0, 5),
    end_time: end,
  });
  if (error) return { ok: false, message: error.message };
  revalidatePath(`/admin/requests/${inquiryId}`);
  revalidatePath("/admin/calendar");
  return { ok: true, message: "Slot added" };
}

export async function deleteSlot(formData: FormData): Promise<AdminResult> {
  const current = await session();
  const id = text(formData, "id", 80);
  const inquiryId = text(formData, "inquiry_id", 80);
  if (current.preview) return { ok: true, message: "Slot removed" };
  const { error } = await current.supabase!.from("request_slots").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };
  revalidatePath(`/admin/requests/${inquiryId}`);
  revalidatePath("/admin/calendar");
  return { ok: true, message: "Slot removed" };
}

export async function saveBlock(formData: FormData): Promise<AdminResult> {
  const current = await session();
  const starts = text(formData, "starts_on", 10);
  const ends = text(formData, "ends_on", 10) || starts;
  const kind = text(formData, "kind", 20);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(starts) || !/^\d{4}-\d{2}-\d{2}$/.test(ends) || ends < starts) {
    return { ok: false, message: "Choose a start and end date." };
  }
  if (kind !== "blackout" && kind !== "available") return { ok: false, message: "Choose blackout or available." };
  if (current.preview) return { ok: true, message: "Saved" };
  const { error } = await current.supabase!.from("availability_blocks").insert({
    starts_on: starts,
    ends_on: ends,
    kind,
    note: text(formData, "note", 200),
  });
  if (error) return { ok: false, message: error.message };
  refreshSite();
  revalidatePath("/admin/calendar");
  return { ok: true, message: "Saved" };
}

export async function deleteBlock(formData: FormData): Promise<AdminResult> {
  const current = await session();
  if (current.preview) return { ok: true, message: "Removed" };
  const { error } = await current.supabase!.from("availability_blocks").delete().eq("id", text(formData, "id", 80));
  if (error) return { ok: false, message: error.message };
  refreshSite();
  revalidatePath("/admin/calendar");
  return { ok: true, message: "Removed" };
}

export async function savePlan(formData: FormData): Promise<AdminResult> {
  const current = await session();
  const id = text(formData, "id", 40).toLowerCase().replace(/[^a-z0-9-]/g, "");
  const dollars = Number(text(formData, "price", 12));
  if (!id || id.length < 2) return { ok: false, message: "Use a short id such as the-lineup." };
  if (!Number.isFinite(dollars) || dollars < 0) return { ok: false, message: "Enter a price in dollars." };
  const row = {
    id,
    name: text(formData, "name", 80),
    price_cents: Math.round(dollars * 100),
    cadence: text(formData, "cadence", 40) || "monthly",
    cuts: text(formData, "cuts", 160),
    summary: text(formData, "summary", 500),
    features: text(formData, "features").split("\n").map((line) => line.trim()).filter(Boolean),
    active: checked(formData, "active"),
    sort_order: Number(text(formData, "sort_order", 6)) || 0,
    featured: checked(formData, "featured"),
    stripe_price_id: text(formData, "stripe_price_id", 80),
    updated_at: new Date().toISOString(),
  };
  if (!row.name) return { ok: false, message: "Name the plan." };
  if (current.preview) return { ok: true, message: "Saved" };
  const { error } = await current.supabase!.from("membership_plans").upsert(row);
  if (error) return { ok: false, message: error.message };
  refreshSite();
  revalidatePath("/admin/content/plans");
  revalidatePath("/admin/prices");
  return { ok: true, message: "Saved" };
}

export async function deletePlan(formData: FormData): Promise<AdminResult> {
  const current = await session();
  if (current.preview) return { ok: true, message: "Removed" };
  const { error } = await current.supabase!.from("membership_plans").delete().eq("id", text(formData, "id", 40));
  if (error) return { ok: false, message: error.message };
  refreshSite();
  return { ok: true, message: "Removed" };
}

export async function saveHouseCallFee(formData: FormData): Promise<AdminResult> {
  const current = await session();
  const raw = text(formData, "house_call_fee", 12);
  const cents = raw ? Math.round(Number(raw) * 100) : null;
  if (raw && !Number.isFinite(cents)) return { ok: false, message: "Enter the house-call fee in dollars." };
  if (current.preview) return { ok: true, message: "Saved" };
  const { error } = await current.supabase!.from("site_settings").upsert({
    id: 1,
    house_call_fee_cents: cents,
    stripe_house_call_price_id: text(formData, "stripe_house_call_price_id", 80),
    updated_at: new Date().toISOString(),
  });
  if (error) return { ok: false, message: error.message };
  refreshSite();
  return { ok: true, message: "Saved" };
}

export async function saveEvent(formData: FormData): Promise<AdminResult> {
  const current = await session();
  const id = text(formData, "id", 80);
  const row = {
    title: text(formData, "title", 160),
    event_date: text(formData, "event_date", 80),
    location: text(formData, "location", 200),
    description: text(formData, "description"),
    instagram_url: text(formData, "instagram_url", 300),
    image_url: text(formData, "image_url", 500),
    kind: text(formData, "kind", 20) === "upcoming" ? "upcoming" : "past",
    published: checked(formData, "published"),
    sort_order: Number(text(formData, "sort_order", 6)) || 0,
    updated_at: new Date().toISOString(),
  };
  if (row.title.length < 2) return { ok: false, message: "Add a title." };
  if (current.preview) return { ok: true, message: "Saved" };
  const query = id
    ? current.supabase!.from("site_events").update(row).eq("id", id)
    : current.supabase!.from("site_events").insert(row);
  const { error } = await query;
  if (error) return { ok: false, message: error.message };
  refreshSite();
  revalidatePath("/admin/content/events");
  return { ok: true, message: "Saved" };
}

export async function deleteEvent(formData: FormData): Promise<AdminResult> {
  const current = await session();
  if (current.preview) return { ok: true, message: "Removed" };
  const { error } = await current.supabase!.from("site_events").delete().eq("id", text(formData, "id", 80));
  if (error) return { ok: false, message: error.message };
  refreshSite();
  return { ok: true, message: "Removed" };
}

export async function saveGalleryItem(formData: FormData): Promise<AdminResult> {
  const current = await session();
  const id = text(formData, "id", 80);
  const image = text(formData, "image_url", 500);
  if (!image) return { ok: false, message: "Add an image URL or upload a file." };
  const row = {
    image_url: image,
    alt: text(formData, "alt", 240),
    instagram_url: text(formData, "instagram_url", 300),
    width: Number(text(formData, "width", 6)) || 1200,
    height: Number(text(formData, "height", 6)) || 1500,
    published: checked(formData, "published"),
    sort_order: Number(text(formData, "sort_order", 6)) || 0,
    updated_at: new Date().toISOString(),
  };
  if (current.preview) return { ok: true, message: "Saved" };
  const query = id
    ? current.supabase!.from("gallery_items").update(row).eq("id", id)
    : current.supabase!.from("gallery_items").insert(row);
  const { error } = await query;
  if (error) return { ok: false, message: error.message };
  refreshSite();
  revalidatePath("/admin/content/gallery");
  return { ok: true, message: "Saved" };
}

export async function deleteGalleryItem(formData: FormData): Promise<AdminResult> {
  const current = await session();
  if (current.preview) return { ok: true, message: "Removed" };
  const { error } = await current.supabase!.from("gallery_items").delete().eq("id", text(formData, "id", 80));
  if (error) return { ok: false, message: error.message };
  refreshSite();
  return { ok: true, message: "Removed" };
}

export async function saveCopy(formData: FormData): Promise<AdminResult> {
  const current = await session();
  const key = text(formData, "key", 80);
  if (!key) return { ok: false, message: "Missing copy key." };
  if (current.preview) return { ok: true, message: "Saved" };
  const { error } = await current.supabase!.from("site_copy").upsert({
    key,
    label: text(formData, "label", 120) || key,
    value: text(formData, "value"),
    updated_at: new Date().toISOString(),
  });
  if (error) return { ok: false, message: error.message };
  refreshSite();
  return { ok: true, message: "Saved" };
}

export async function saveSettings(formData: FormData): Promise<AdminResult> {
  const current = await session();
  const fee = text(formData, "house_call_fee", 12);
  const cents = fee ? Math.round(Number(fee) * 100) : null;
  if (fee && !Number.isFinite(cents)) return { ok: false, message: "Enter the house-call fee in dollars." };
  if (current.preview) return { ok: true, message: "Saved" };
  const { error } = await current.supabase!.from("site_settings").upsert({
    id: 1,
    phone: text(formData, "phone", 40),
    email: text(formData, "email", 160),
    instagram_url: text(formData, "instagram_url", 300),
    instagram_handle: text(formData, "instagram_handle", 80),
    in_shop_url: text(formData, "in_shop_url", 300),
    in_shop_label: text(formData, "in_shop_label", 120),
    house_call_fee_cents: cents,
    stripe_house_call_price_id: text(formData, "stripe_house_call_price_id", 80),
    updated_at: new Date().toISOString(),
  });
  if (error) return { ok: false, message: error.message };
  refreshSite();
  revalidatePath("/admin/content/settings");
  return { ok: true, message: "Saved" };
}

export async function setPasswordFromReset(formData: FormData): Promise<AdminResult> {
  const password = text(formData, "password", 80);
  const confirm = text(formData, "confirm", 80);
  if (password.length < 8) return { ok: false, message: "Use at least 8 characters." };
  if (password !== confirm) return { ok: false, message: "Those passwords do not match." };
  const supabase = await createSupabaseServer();
  if (!supabase) return { ok: false, message: "Supabase auth is not configured." };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Open the reset link from your email, then choose a password." };
  const { error } = await supabase.auth.updateUser({
    password,
    data: { must_change_password: false },
  });
  if (error) return { ok: false, message: error.message };
  return { ok: true, message: "Password updated. You can sign in." };
}

export async function changePassword(formData: FormData): Promise<AdminResult> {
  const password = text(formData, "password", 80);
  const confirm = text(formData, "confirm", 80);
  if (password.length < 8) return { ok: false, message: "Use at least 8 characters." };
  if (password !== confirm) return { ok: false, message: "Those passwords do not match." };
  const current = await session();
  if (current.preview) return { ok: true, message: "Password updated" };
  const { error } = await current.supabase!.auth.updateUser({
    password,
    data: { must_change_password: false },
  });
  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin");
  revalidatePath("/admin/account");
  return { ok: true, message: "Password updated" };
}

export async function signOut() {
  const current = await requireAdmin();
  if (!current.preview && current.supabase) await current.supabase.auth.signOut();
  redirect("/admin/login");
}
