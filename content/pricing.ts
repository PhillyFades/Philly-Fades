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

export const memberships: MembershipTier[] = [
  {
    id: "the-lineup",
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
    id: "the-rotation",
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
    id: "the-residence",
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

export function findFeePlan(id: string) {
  return feePlans.find((plan) => plan.id === id) ?? null;
}
