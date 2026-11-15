import { formatAddress, stateCode, type AddressInput } from "@/lib/address";
import { demographics, referrerRoles, site } from "@/content/site";
import { findRequestKind, requestKinds } from "@/content/requests";
import { feePlans, memberships } from "@/content/pricing";
import type { FieldErrors } from "@/lib/types";

export type BookingInput = AddressInput & {
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  requestedDate: string;
  requestedTime: string;
  serviceCounty: string;
  demographicCategory: string;
  feePlan: string;
  eligibilityConfirmed: boolean;
  bookingOnBehalf: boolean;
  referrerName: string;
  referrerOrganization: string;
  referrerRole: string;
  referrerContact: string;
  paymentMethod: "pending_card" | "invoice" | "voucher";
  isVeteran: boolean | null;
  hasDisability: "yes" | "no" | "prefer_not_to_say" | null;
  notes: string;
  companyWebsite: string;
};

export type MembershipInput = AddressInput & {
  fullName: string;
  email: string;
  phone: string;
  serviceCounty: string;
  tierId: string;
  serviceLocation: "home";
  householdNotes: string;
  eligibilityConfirmed: boolean;
  isVeteran: boolean | null;
  hasDisability: "yes" | "no" | "prefer_not_to_say" | null;
  companyWebsite: string;
};

export type EventInput = AddressInput & {
  contactName: string;
  organization: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  locationType: "institution" | "community_site" | "residence" | "other";
  detail: string;
  slotCount: number;
  slotArrangement: "back_to_back" | "concurrent";
  guestCount: number;
  notes: string;
  companyWebsite: string;
};

export type ReferralInput = AddressInput & {
  program: string;
  requestType: string;
  contactName: string;
  organization: string;
  email: string;
  phone: string;
  siteName: string;
  preferredDate: string;
  headcount: string;
  message: string;
  companyWebsite: string;
};

export type VendorInput = {
  organization: string;
  contactName: string;
  title: string;
  email: string;
  phone: string;
  organizationType: string;
  counties: string;
  populations: string;
  needsCoi: boolean;
  needsW9: boolean;
  message: string;
  companyWebsite: string;
};

type Ok<T> = { ok: true; value: T };
type Err = { ok: false; fieldErrors: FieldErrors };

const demographicIds = new Set<string>(demographics.map((item) => item.id));
const roleIds = new Set<string>(referrerRoles.map((item) => item.id));
const countyIds = new Set<string>(site.counties);
const feeIds = new Set(feePlans.map((item) => item.id));
const tierIds = new Set(memberships.map((item) => item.id));
const requestKindIds = new Set<string>(requestKinds.map((item) => item.id));

function record(raw: unknown): Record<string, unknown> {
  return raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
}

function text(value: unknown, max: number) {
  return String(value ?? "").trim().slice(0, max);
}

function checked(value: unknown) {
  return value === true || value === "true" || value === "on" || value === "1";
}

function optionalPerson(data: Record<string, unknown>, errors: FieldErrors) {
  const veteranRaw = text(data.isVeteran, 10);
  const disabilityRaw = text(data.hasDisability, 20);
  let isVeteran: boolean | null = null;
  let hasDisability: "yes" | "no" | "prefer_not_to_say" | null = null;
  if (veteranRaw === "yes") isVeteran = true;
  else if (veteranRaw === "no") isVeteran = false;
  else if (veteranRaw) errors.isVeteran = "Choose yes or no.";
  if (disabilityRaw === "yes" || disabilityRaw === "no" || disabilityRaw === "prefer_not_to_say") {
    hasDisability = disabilityRaw;
  } else if (disabilityRaw) {
    errors.hasDisability = "Choose an answer.";
  }
  return { isVeteran, hasDisability };
}

function digits(value: string) {
  return value.replace(/\D/g, "");
}

function emailOk(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function todayInPhiladelphia() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
  }).format(new Date());
}

function readAddress(data: Record<string, unknown>, errors: FieldErrors): AddressInput {
  const addressLine1 = text(data.addressLine1, 120);
  const addressLine2 = text(data.addressLine2, 40);
  const city = text(data.city, 80);
  const state = stateCode(text(data.state, 40));
  const zip = text(data.zip, 10).replace(/\D/g, "").slice(0, 5);
  if (addressLine1.length < 3) errors.addressLine1 = "Enter the street address.";
  if (city.length < 2) errors.city = "Enter the city.";
  if (!state) errors.state = "Choose a state.";
  if (!/^\d{5}$/.test(zip)) errors.zip = "Enter a 5-digit ZIP.";
  return { addressLine1, addressLine2, city, state: state || "PA", zip };
}

function dateOk(value: string, errors: FieldErrors, key: string, label: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    errors[key] = `Choose a ${label}.`;
    return;
  }
  if (value < todayInPhiladelphia()) {
    errors[key] = "That date has already passed.";
  }
}

export function validateBooking(raw: unknown): Ok<BookingInput> | Err {
  const data = record(raw);
  const errors: FieldErrors = {};
  const clientName = text(data.clientName, 120);
  const clientPhone = text(data.clientPhone, 40);
  const clientEmail = text(data.clientEmail, 160);
  const requestedDate = text(data.requestedDate, 10);
  const requestedTime = text(data.requestedTime, 20);
  const address = readAddress(data, errors);
  const serviceCounty = text(data.serviceCounty, 40);
  const demographicCategory = text(data.demographicCategory, 40);
  const feePlan = text(data.feePlan, 40);
  const bookingOnBehalf = checked(data.bookingOnBehalf);
  const referrerName = text(data.referrerName, 120);
  const referrerOrganization = text(data.referrerOrganization, 160);
  const referrerRole = text(data.referrerRole, 40);
  const referrerContact = text(data.referrerContact, 160);
  const notes = text(data.notes, 2000);
  const paymentRaw = text(data.paymentMethod, 20);
  const paymentMethod =
    paymentRaw === "invoice" || paymentRaw === "voucher" ? paymentRaw : "pending_card";

  if (clientName.length < 2) errors.clientName = "Enter the name of the person receiving the cut.";
  if (digits(clientPhone).length < 10 && !emailOk(clientEmail)) {
    errors.clientPhone = "Add a phone number or a valid email so the visit can be confirmed.";
    errors.clientEmail = "Add a valid email or a phone number.";
  } else if (clientEmail && !emailOk(clientEmail)) {
    errors.clientEmail = "That email does not look complete.";
  } else if (clientPhone && digits(clientPhone).length < 10) {
    errors.clientPhone = "Enter a 10-digit phone number.";
  }
  dateOk(requestedDate, errors, "requestedDate", "visit date");
  if (!requestedTime) errors.requestedTime = "Choose a time.";
  if (!countyIds.has(serviceCounty)) errors.serviceCounty = "Choose Philadelphia, Montgomery, or Chester.";
  if (!demographicIds.has(demographicCategory)) {
    errors.demographicCategory = "Choose who the cut is for.";
  }
  if (!feeIds.has(feePlan)) errors.feePlan = "Choose a plan.";
  if (!checked(data.eligibilityConfirmed)) {
    errors.eligibilityConfirmed = "Confirm that the person cannot travel to a shop.";
  }
  if (bookingOnBehalf) {
    if (referrerName.length < 2) errors.referrerName = "Enter the referrer’s name.";
    if (!roleIds.has(referrerRole)) errors.referrerRole = "Choose the referrer’s role.";
    if (referrerContact.length < 5) errors.referrerContact = "Enter a phone or email for the referrer.";
    if (paymentMethod === "pending_card") {
      errors.paymentMethod = "Choose invoice or voucher when booking on behalf of someone.";
    }
  }
  const person = optionalPerson(data, errors);

  if (Object.keys(errors).length) return { ok: false, fieldErrors: errors };

  return {
    ok: true,
    value: {
      clientName,
      clientPhone,
      clientEmail,
      requestedDate,
      requestedTime,
      ...address,
      serviceCounty,
      demographicCategory,
      feePlan,
      eligibilityConfirmed: true,
      bookingOnBehalf,
      referrerName,
      referrerOrganization,
      referrerRole,
      referrerContact,
      paymentMethod: bookingOnBehalf ? paymentMethod : "pending_card",
      isVeteran: person.isVeteran,
      hasDisability: person.hasDisability,
      notes,
      companyWebsite: text(data.companyWebsite, 200),
    },
  };
}

export function validateMembership(raw: unknown): Ok<MembershipInput> | Err {
  const data = record(raw);
  const errors: FieldErrors = {};
  const fullName = text(data.fullName, 120);
  const email = text(data.email, 160);
  const phone = text(data.phone, 40);
  const address = readAddress(data, errors);
  const serviceCounty = text(data.serviceCounty, 40);
  const tierId = text(data.tierId, 40);
  const householdNotes = text(data.householdNotes, 2000);

  if (fullName.length < 2) errors.fullName = "Enter the member’s name.";
  if (!emailOk(email)) errors.email = "Enter a valid email.";
  if (digits(phone).length < 10) errors.phone = "Enter a 10-digit phone number.";
  if (!countyIds.has(serviceCounty)) errors.serviceCounty = "Choose Philadelphia, Montgomery, or Chester.";
  if (!tierIds.has(tierId)) errors.tierId = "Choose a membership.";
  if (!checked(data.eligibilityConfirmed)) {
    errors.eligibilityConfirmed = "Confirm that the person cannot travel to a shop.";
  }
  const person = optionalPerson(data, errors);

  if (Object.keys(errors).length) return { ok: false, fieldErrors: errors };
  return {
    ok: true,
    value: {
      fullName,
      email,
      phone,
      ...address,
      serviceCounty,
      tierId,
      serviceLocation: "home",
      householdNotes,
      eligibilityConfirmed: true,
      isVeteran: person.isVeteran,
      hasDisability: person.hasDisability,
      companyWebsite: text(data.companyWebsite, 200),
    },
  };
}

export function validateEvent(raw: unknown): Ok<EventInput> | Err {
  const data = record(raw);
  const errors: FieldErrors = {};
  const contactName = text(data.contactName, 120);
  const organization = text(data.organization, 160);
  const email = text(data.email, 160);
  const phone = text(data.phone, 40);
  const eventType = text(data.requestType, 40);
  const detail = text(data.detail, 40);
  const eventDate = text(data.eventDate, 10);
  const address = readAddress(data, errors);
  const slotCount = Number(text(data.slotCount, 4));
  const slotArrangement = text(data.slotArrangement, 20);
  const guestCount = Number(text(data.guestCount, 6));
  const notes = text(data.notes, 2000);
  const kind = findRequestKind(eventType);
  const detailOk = Boolean(kind?.details.some((item) => item.id === detail));

  if (contactName.length < 2) errors.contactName = "Enter your name.";
  if (organization.length < 2) errors.organization = "Enter the organization, team, or household.";
  if (!emailOk(email)) errors.email = "Enter a valid email.";
  if (digits(phone).length < 10) errors.phone = "Enter a 10-digit phone number.";
  if (!requestKindIds.has(eventType) || !kind) errors.requestType = "Choose what you are looking for.";
  if (kind && kind.details.length > 0 && !detailOk) errors.detail = "Choose a detail.";
  dateOk(eventDate, errors, "eventDate", "preferred date");
  if (!Number.isInteger(slotCount) || slotCount < 1 || slotCount > 24) {
    errors.slotCount = "Enter at least 1 slot, up to 24.";
  }
  if (slotArrangement !== "back_to_back" && slotArrangement !== "concurrent") {
    errors.slotArrangement = "Say whether the slots run back-to-back or at the same time.";
  }
  if (!Number.isFinite(guestCount) || guestCount < 1 || guestCount > 500) {
    errors.guestCount = "Enter an estimated headcount between 1 and 500.";
  }

  if (Object.keys(errors).length || !kind) return { ok: false, fieldErrors: errors };
  const arrangement: EventInput["slotArrangement"] = slotArrangement === "concurrent" ? "concurrent" : "back_to_back";
  return {
    ok: true,
    value: {
      contactName,
      organization,
      email,
      phone,
      eventType,
      detail,
      eventDate,
      ...address,
      locationType: kind.locationType,
      slotCount,
      slotArrangement: arrangement,
      guestCount,
      notes,
      companyWebsite: text(data.companyWebsite, 200),
    },
  };
}

const referralPrograms = new Set([
  "seniors_homebound",
  "sensory",
  "veterans",
  "unhoused",
  "youth",
  "sponsor_a_cut",
]);

export function validateReferral(raw: unknown): Ok<ReferralInput> | Err {
  const data = record(raw);
  const errors: FieldErrors = {};
  const program = text(data.program, 40);
  const requestType = text(data.requestType, 60);
  const contactName = text(data.contactName, 120);
  const organization = text(data.organization, 160);
  const email = text(data.email, 160);
  const phone = text(data.phone, 40);
  const siteName = text(data.siteName, 160);
  const address = readAddress(data, errors);
  const preferredDate = text(data.preferredDate, 10);
  const headcount = text(data.headcount, 20);
  const message = text(data.message, 2000);

  if (!referralPrograms.has(program)) errors.program = "Choose a program.";
  if (requestType.length < 2) errors.requestType = "Choose a request type.";
  if (contactName.length < 2) errors.contactName = "Enter your name.";
  if (!emailOk(email) && digits(phone).length < 10) {
    errors.email = "Add a valid email or a phone number.";
    errors.phone = "Add a phone number or a valid email.";
  } else if (email && !emailOk(email)) {
    errors.email = "That email does not look complete.";
  }
  if (preferredDate) dateOk(preferredDate, errors, "preferredDate", "preferred date");
  if (message.length < 8) errors.message = "Add a short note about the request.";

  if (Object.keys(errors).length) return { ok: false, fieldErrors: errors };
  return {
    ok: true,
    value: {
      program,
      requestType,
      contactName,
      organization,
      email,
      phone,
      siteName,
      ...address,
      preferredDate,
      headcount,
      message,
      companyWebsite: text(data.companyWebsite, 200),
    },
  };
}

const orgTypes = new Set([
  "foundation",
  "case_management",
  "housing",
  "va",
  "school",
  "health",
  "other",
]);

export function validateVendor(raw: unknown): Ok<VendorInput> | Err {
  const data = record(raw);
  const errors: FieldErrors = {};
  const organization = text(data.organization, 160);
  const contactName = text(data.contactName, 120);
  const title = text(data.title, 120);
  const email = text(data.email, 160);
  const phone = text(data.phone, 40);
  const organizationType = text(data.organizationType, 40);
  const counties = text(data.counties, 200);
  const populations = text(data.populations, 400);
  const message = text(data.message, 2000);

  if (organization.length < 2) errors.organization = "Enter the organization name.";
  if (contactName.length < 2) errors.contactName = "Enter a contact name.";
  if (title.length < 2) errors.title = "Enter a title.";
  if (!emailOk(email)) errors.email = "Enter a valid work email.";
  if (digits(phone).length < 10) errors.phone = "Enter a 10-digit phone number.";
  if (!orgTypes.has(organizationType)) errors.organizationType = "Choose an organization type.";
  if (counties.length < 2) errors.counties = "List the counties you cover.";
  if (message.length < 8) errors.message = "Say what you need from the partnership.";

  if (Object.keys(errors).length) return { ok: false, fieldErrors: errors };
  return {
    ok: true,
    value: {
      organization,
      contactName,
      title,
      email,
      phone,
      organizationType,
      counties,
      populations,
      needsCoi: checked(data.needsCoi),
      needsW9: checked(data.needsW9),
      message,
      companyWebsite: text(data.companyWebsite, 200),
    },
  };
}
