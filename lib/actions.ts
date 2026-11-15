"use server";

import { findRequestKind } from "@/content/requests";
import { findFeePlan, findMembership } from "@/content/pricing";
import { eligibilityAttestation, site } from "@/content/site";
import { startCheckout } from "@/lib/payments";
import { getSupabaseAdmin } from "@/lib/supabase";
import { NOT_CONFIGURED_MESSAGE, type ActionResult } from "@/lib/types";
import {
  validateBooking,
  validateEvent,
  validateMembership,
  validateReferral,
  validateVendor,
} from "@/lib/validators";

const DISPATCH_FROM = `${site.dispatchShop}, ${site.dispatchAddress}`;

function received(): ActionResult {
  return { ok: true, id: "received", checkoutUrl: null };
}

async function insertRow(
  table: "bookings" | "membership_signups" | "event_inquiries" | "community_referrals" | "vendor_intakes",
  row: Record<string, unknown>,
): Promise<ActionResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { ok: false, code: "not_configured", error: NOT_CONFIGURED_MESSAGE };
  }

  // The id is generated here so the confirmation can show it without a SELECT.
  // RLS allows insert only. There is no public read policy.
  const id = crypto.randomUUID();
  const { error } = await supabase.from(table).insert({ id, ...row });
  if (error) {
    console.error(`Supabase insert failed for ${table}`, error.message);
    return {
      ok: false,
      code: "insert_failed",
      error:
        "We could not save this request. If Supabase is new, apply the migration in supabase/migrations and try again.",
    };
  }

  return { ok: true, id, checkoutUrl: null };
}

export async function submitBooking(raw: unknown): Promise<ActionResult> {
  const parsed = validateBooking(raw);
  if (!parsed.ok) {
    return {
      ok: false,
      code: "validation",
      error: "Check the highlighted fields.",
      fieldErrors: parsed.fieldErrors,
    };
  }
  if (parsed.value.companyWebsite) return received();

  const plan = findFeePlan(parsed.value.feePlan);
  const paymentMethod = parsed.value.paymentMethod;
  const status = paymentMethod === "pending_card" ? "pending_payment" : "requested";

  const saved = await insertRow("bookings", {
    client_name: parsed.value.clientName,
    client_phone: parsed.value.clientPhone || null,
    client_email: parsed.value.clientEmail || null,
    requested_date: parsed.value.requestedDate,
    requested_time: parsed.value.requestedTime,
    service_address: parsed.value.serviceAddress,
    service_county: parsed.value.serviceCounty,
    demographic_category: parsed.value.demographicCategory,
    fee_plan: plan?.label ?? parsed.value.feePlan,
    fee_cents: plan?.cents ?? null,
    status,
    eligibility_confirmed: true,
    eligibility_basis: eligibilityAttestation,
    booking_on_behalf: parsed.value.bookingOnBehalf,
    referrer_name: parsed.value.bookingOnBehalf ? parsed.value.referrerName : null,
    referrer_organization: parsed.value.bookingOnBehalf ? parsed.value.referrerOrganization || null : null,
    referrer_role: parsed.value.bookingOnBehalf ? parsed.value.referrerRole : null,
    referrer_contact: parsed.value.bookingOnBehalf ? parsed.value.referrerContact : null,
    payment_method: paymentMethod,
    notes: parsed.value.notes || null,
    dispatched_from: DISPATCH_FROM,
    barber_name: site.barber,
  });

  if (!saved.ok || paymentMethod !== "pending_card") return saved;

  const checkout = await startCheckout({
    kind: "booking",
    referenceId: saved.id,
    amountCents: plan?.cents ?? null,
    description: plan?.label ?? "House call",
    customerEmail: parsed.value.clientEmail,
  });

  return { ...saved, checkoutUrl: checkout.url };
}

export async function submitMembership(raw: unknown): Promise<ActionResult> {
  const parsed = validateMembership(raw);
  if (!parsed.ok) {
    return {
      ok: false,
      code: "validation",
      error: "Check the highlighted fields.",
      fieldErrors: parsed.fieldErrors,
    };
  }
  if (parsed.value.companyWebsite) return received();

  const tier = findMembership(parsed.value.tierId);
  if (!tier) {
    return { ok: false, code: "validation", error: "Choose a membership.", fieldErrors: { tierId: "Choose a membership." } };
  }

  const inVan = parsed.value.serviceLocation === "van";
  const locationLine = inVan ? "Service location: In the van" : "Service location: In my home";
  const householdNotes = [locationLine, parsed.value.householdNotes].filter(Boolean).join("\n\n");
  const shared = {
    full_name: parsed.value.fullName,
    email: parsed.value.email,
    phone: parsed.value.phone,
    service_address: parsed.value.serviceAddress,
    service_county: parsed.value.serviceCounty,
    tier_id: tier.id,
    tier_name: tier.name,
    price_cents: tier.priceMonthlyCents,
    household_notes: householdNotes,
    status: "pending_payment",
    eligibility_confirmed: true,
    eligibility_basis: inVan
      ? "The cuts happen in the mobile van, not inside the home."
      : eligibilityAttestation,
  };
  const saved = await insertRow("membership_signups", {
    ...shared,
    demographic_category: null,
    service_location: parsed.value.serviceLocation,
  });
  const stored = saved.ok
    ? saved
    : await insertRow("membership_signups", {
        ...shared,
        demographic_category: "prefer_not_to_say",
      });

  if (!stored.ok) return stored;

  const checkout = await startCheckout({
    kind: "membership",
    referenceId: stored.id,
    amountCents: tier.priceMonthlyCents,
    description: `${tier.name} membership`,
    customerEmail: parsed.value.email,
  });

  return { ...stored, checkoutUrl: checkout.url };
}

export async function submitEvent(raw: unknown): Promise<ActionResult> {
  const parsed = validateEvent(raw);
  if (!parsed.ok) {
    return {
      ok: false,
      code: "validation",
      error: "Check the highlighted fields.",
      fieldErrors: parsed.fieldErrors,
    };
  }
  if (parsed.value.companyWebsite) return received();

  const kind = findRequestKind(parsed.value.eventType);
  if (!kind) {
    return { ok: false, code: "validation", error: "Choose what you are looking for.", fieldErrors: { requestType: "Choose what you are looking for." } };
  }
  const detail = kind.details.find((item) => item.id === parsed.value.detail);

  const arrangement = parsed.value.slotArrangement === "concurrent" ? "at the same time" : "back-to-back";
  const notes = [
    detail ? `Detail: ${detail.label}` : "",
    `Slots requested: ${parsed.value.slotCount}`,
    `Slot arrangement: ${arrangement}`,
    parsed.value.notes,
  ]
    .filter(Boolean)
    .join("\n\n");

  return insertRow("event_inquiries", {
    contact_name: parsed.value.contactName,
    organization: parsed.value.organization,
    email: parsed.value.email,
    phone: parsed.value.phone,
    package_id: kind.id,
    package_name: kind.label,
    starting_price_cents: null,
    event_date: parsed.value.eventDate,
    event_location: parsed.value.eventLocation,
    location_type: parsed.value.locationType,
    guest_count: parsed.value.guestCount,
    notes,
    compliance_acknowledged: true,
    eligibility_confirmed: false,
    status: "requested",
  });
}

export async function submitReferral(raw: unknown): Promise<ActionResult> {
  const parsed = validateReferral(raw);
  if (!parsed.ok) {
    return {
      ok: false,
      code: "validation",
      error: "Check the highlighted fields.",
      fieldErrors: parsed.fieldErrors,
    };
  }
  if (parsed.value.companyWebsite) return received();

  return insertRow("community_referrals", {
    program: parsed.value.program,
    request_type: parsed.value.requestType,
    contact_name: parsed.value.contactName,
    organization: parsed.value.organization || null,
    email: parsed.value.email || null,
    phone: parsed.value.phone || null,
    site_name: parsed.value.siteName || null,
    site_address: parsed.value.siteAddress,
    preferred_date: parsed.value.preferredDate || null,
    headcount: parsed.value.headcount || null,
    message: parsed.value.message,
    status: "requested",
  });
}

export async function submitVendor(raw: unknown): Promise<ActionResult> {
  const parsed = validateVendor(raw);
  if (!parsed.ok) {
    return {
      ok: false,
      code: "validation",
      error: "Check the highlighted fields.",
      fieldErrors: parsed.fieldErrors,
    };
  }
  if (parsed.value.companyWebsite) return received();

  return insertRow("vendor_intakes", {
    organization: parsed.value.organization,
    contact_name: parsed.value.contactName,
    title: parsed.value.title,
    email: parsed.value.email,
    phone: parsed.value.phone,
    organization_type: parsed.value.organizationType,
    counties: parsed.value.counties,
    populations: parsed.value.populations || null,
    needs_coi: parsed.value.needsCoi,
    needs_w9: parsed.value.needsW9,
    message: parsed.value.message,
    status: "received",
  });
}
