// PLACEHOLDER contact details - confirm with client.
// Phone and email are intentionally not invented. Do not publish a guessed number.

export const site = {
  name: "Buzz Boxx PXV",
  legalName: "Philly Fades Haircuts LLC",
  dba: "Philly Fades Haircuts LLC d/b/a Buzz Boxx PXV",
  barber: "Mike Webb Jr",
  instagramUrl: "https://www.instagram.com/philly_fades_ig/",
  instagramHandle: "@philly_fades_ig",
  inShopUrl: "https://barbers-on-broad-llc.square.site",
  inShopLabel: "Book In-Shop Chair (North Philly)",
  communityCareCutsUrl: "https://communitycarecuts.org/",
  phonePlaceholder: "Phone: placeholder — confirm with client",
  emailPlaceholder: "Email: placeholder — confirm with client",
  dispatchShop: "Barbers on Broad",
  dispatchOwner: "Ruben",
  dispatchAddress: "1220 N Broad St Ste 3, Philadelphia, PA 19121",
  complianceBadge:
    "Officially Dispatched via Barbers on Broad • 1220 N Broad St Ste 3, Philadelphia, PA 19121 • PA State Board Compliant.",
  cancellation:
    "Cancel or reschedule at least 24 hours before the appointment. A missed visit, or a cancellation inside 24 hours, is charged in full for the service that was booked.",
  counties: ["Philadelphia", "Montgomery", "Chester"] as const,
  serviceArea: "Philadelphia, Montgomery, and Chester Counties",
};

// PLACEHOLDER site URL - confirm with client. Override with NEXT_PUBLIC_SITE_URL.
export function siteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL;
  if (raw) {
    try {
      return new URL(raw).origin;
    } catch {
      return "https://buzzboxxpxv.com";
    }
  }
  return "https://buzzboxxpxv.com";
}

export const demographics = [
  { id: "general", label: "General adult" },
  { id: "senior_homebound", label: "Homebound or older adult" },
  { id: "sensory_developmental", label: "Sensory, disability, or developmental need" },
  { id: "veteran", label: "Veteran" },
  { id: "unhoused", label: "Unhoused or shelter guest" },
  { id: "youth", label: "Youth" },
  { id: "prefer_not_to_say", label: "Prefer not to say" },
] as const;

export const referrerRoles = [
  { id: "case_manager", label: "Case manager" },
  { id: "social_worker", label: "Social worker" },
  { id: "nurse", label: "Nurse" },
  { id: "va_coordinator", label: "VA coordinator" },
  { id: "family_caregiver", label: "Family caregiver" },
  { id: "other", label: "Other partner" },
] as const;

export const van = {
  src: "/images/mobile-van.jpg",
  alt: "Philly Fades Buzz Boxx mobile barber van with the side door open showing the barber chair inside",
  width: 1024,
  height: 683,
} as const;

export const eligibilityAttestation =
  "The person receiving this in-home visit qualifies for out-of-shop barbering because of illness, physical disability, a sensory or developmental need, confinement, or advanced age that prevents travel to a licensed shop. Pennsylvania’s Barbers’ License Law allows a sponsored barber to serve someone at a residence or in an institution in cases of sickness, incapacitation, confinement, and other emergencies.";

export const nav = [
  { href: "/memberships", label: "Memberships" },
  { href: "/programs", label: "Programs" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
] as const;

export const communityLinks = [
  { href: "/seniors-homebound", label: "Seniors & homebound" },
  { href: "/special-needs-sensory", label: "Sensory & special needs" },
  { href: "/veterans-outreach", label: "Veterans" },
  { href: "/unhoused-dignity", label: "Unhoused dignity" },
  { href: "/youth-mentorship", label: "Youth mentorship" },
  { href: "/programs", label: "Foundations & agencies" },
] as const;

export const howItWorks = [
  {
    step: "01",
    title: "Request the visit",
    body: "Share who the cut is for, the address, and the membership or partner plan. Case managers can book on behalf of someone.",
  },
  {
    step: "02",
    title: "Confirm eligibility",
    body: "In-home cuts follow Pennsylvania’s out-of-shop rule. The person receiving the cut must qualify because travel to a shop is not realistic.",
  },
  {
    step: "03",
    title: "Mike comes to you",
    body: "Tools and supplies come from the sponsoring shop. Sanitation is held to the same standard as a visit inside Barbers on Broad.",
  },
  {
    step: "04",
    title: "The shop logs it",
    body: "Every house call is written into the dispatch log for Barbers on Broad, the record inspectors can ask to see, and for anonymized grant counts.",
  },
] as const;
