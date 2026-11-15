// PLACEHOLDER PRICING - confirm with client
// Example premium rates for planning only. Every public surface that prints
// these numbers should treat them as unconfirmed.

export type MembershipTier = {
  id: string;
  name: string;
  priceMonthlyCents: number;
  cuts: string;
  summary: string;
  perks: string[];
  featured?: boolean;
};

export type EventPackage = {
  id: string;
  name: string;
  startingAtCents: number;
  hours: string;
  barbersOnSite: string;
  summary: string;
  includes: string[];
  featured?: boolean;
};

export const memberships: MembershipTier[] = [
  {
    id: "lineup",
    name: "The Lineup",
    priceMonthlyCents: 15000,
    cuts: "1 house-call cut each month",
    summary:
      "A standing monthly visit for one person who needs the chair to come to them.",
    perks: [
      "One traveling cut, beard tidy, or lineup",
      "Weekday priority windows before open booking",
      "Same barber, Mike Webb Jr., every visit",
      "24-hour reschedule courtesy",
    ],
  },
  {
    id: "rotation",
    name: "The Rotation",
    priceMonthlyCents: 27500,
    cuts: "2 house-call cuts each month",
    summary:
      "The house plan. Two visits a month, beard and lineup included, plus room for one person in the household.",
    perks: [
      "Two traveling cuts each month",
      "Beard and lineup at each visit",
      "One household add-on at the member visit rate",
      "Priority scheduling across all seven days",
    ],
    featured: true,
  },
  {
    id: "residence",
    name: "The Residence",
    priceMonthlyCents: 45000,
    cuts: "4 house-call cuts each month",
    summary:
      "For a household that wants the chair on a rhythm. Four visits, first look at the calendar, and a quarterly event touch-up credit.",
    perks: [
      "Four traveling cuts each month",
      "Beard, lineup, and hot-towel finish",
      "Two household add-ons",
      "First-look scheduling",
      "One event-day touch-up credit each quarter",
    ],
  },
];

export const eventPackages: EventPackage[] = [
  {
    id: "community-popup",
    name: "Community Pop-Up",
    startingAtCents: 120000,
    hours: "3 hours",
    barbersOnSite: "1 barber on site",
    summary:
      "A capped pop-up for a shelter, pantry, senior building, rec center, or neighborhood partner. Mike leads the chair.",
    includes: [
      "3-hour on-site block",
      "Mike Webb Jr. on the chair",
      "Shop-supplied tools and hospital-grade sanitation",
      "A simple sign-in sheet your team can keep for reporting",
    ],
  },
  {
    id: "corporate-activation",
    name: "Corporate & Brand Activation",
    startingAtCents: 280000,
    hours: "4 hours",
    barbersOnSite: "2 barbers on site",
    summary:
      "A hosted chair for a workplace, brand set, or community activation. Mike leads. A second chair is added for larger rooms after the setting is cleared under Pennsylvania out-of-shop rules.",
    includes: [
      "4-hour activation",
      "Mike leading, with a second chair when the room needs it",
      "Branded cape option and a quiet setup",
      "Run-of-show timing with your producer or HR lead",
    ],
    featured: true,
  },
  {
    id: "private-vip",
    name: "Private / VIP",
    startingAtCents: 420000,
    hours: "4 hours",
    barbersOnSite: "2 barbers on site",
    summary:
      "A private residence, hospitality suite, or closed guest list. The visit is scheduled only when the setting fits the out-of-shop statute.",
    includes: [
      "4-hour private block",
      "Mike leading a two-chair setup",
      "Capped guest list and a quiet room plan",
      "Hot-towel finishes and lineup detail",
    ],
  },
];

export const feePlans = [
  ...memberships.map((tier) => ({
    id: tier.id,
    label: `${tier.name} · $${tier.priceMonthlyCents / 100}/mo`,
    cents: tier.priceMonthlyCents,
  })),
  {
    id: "single_house_call",
    label: "Single house call · fee confirmed before the visit",
    cents: null,
  },
  {
    id: "partner_invoice",
    label: "Partner invoice, voucher, or sponsored cut",
    cents: null,
  },
];

export function formatDollars(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function findMembership(id: string) {
  return memberships.find((tier) => tier.id === id) ?? null;
}

export function findEventPackage(id: string) {
  return eventPackages.find((pack) => pack.id === id) ?? null;
}

export function findFeePlan(id: string) {
  return feePlans.find((plan) => plan.id === id) ?? null;
}
