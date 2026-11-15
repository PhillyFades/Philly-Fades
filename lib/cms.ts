import { cacheLife, cacheTag } from "next/cache";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { gallery as fallbackGallery } from "@/content/gallery";
import { pastEvents } from "@/content/events";
import { formatDollars, memberships } from "@/content/pricing";
import { site } from "@/content/site";
import type { ScheduleBlock } from "@/lib/availability";

export type PublicPlan = {
  id: string;
  name: string;
  priceCents: number;
  cadence: string;
  cuts: string;
  summary: string;
  features: string[];
  featured: boolean;
  sortOrder: number;
  stripePriceId: string;
};

export type PublicEvent = {
  id: string;
  title: string;
  eventDate: string;
  location: string;
  description: string;
  instagramUrl: string;
  imageUrl: string;
  kind: "past" | "upcoming";
  sortOrder: number;
};

export type PublicPhoto = {
  src: string;
  alt: string;
  width: number;
  height: number;
  instagramUrl: string;
};

export type PublicSettings = {
  phone: string;
  email: string;
  instagramUrl: string;
  instagramHandle: string;
  inShopUrl: string;
  inShopLabel: string;
  houseCallFeeCents: number | null;
  stripeHouseCallPriceId: string;
};

export type FeeChoice = { id: string; label: string; cents: number | null };

export type PublicCatalog = {
  plans: PublicPlan[];
  feeChoices: FeeChoice[];
  events: PublicEvent[];
  gallery: PublicPhoto[];
  copy: Record<string, string>;
  settings: PublicSettings;
  blocks: ScheduleBlock[];
};

export const copyFallbacks: Record<string, string> = {
  "home.hero.lead": "We come to",
  "home.hero.accent": "you",
  "home.hero.subheadline":
    "Buzz Boxx PXV is Mike Webb Jr.’s house-call chair. Memberships and house calls happen in the home. The van is for community days and events across Philadelphia, Montgomery, and Chester Counties. Officially dispatched from Barbers on Broad.",
  "home.memberships.intro":
    "Recurring house-call cuts for one person or a household. Priority windows, beard and lineup work, and family add-ons as the plan grows. Example rates, shown for planning.",
  "home.events.intro":
    "The van can sit for one slot or several, back-to-back or overlapping. Barber count, setup, and price are worked out with Mike after the inquiry.",
  "about.intro":
    "Philly Fades Haircuts LLC d/b/a Buzz Boxx PXV. One barber. A host shop on North Broad Street. A community practice that started as Philly Fades and now books as Buzz Boxx PXV.",
  "programs.intro":
    "Senior buildings, shelters, schools, veteran groups, case managers, nonprofits, and event organizers call Mike Webb Jr. when a haircut would help and getting to a shop is the hard part. He sets up where you already are.",
  "events.hero.lead": "Bring the chair to the",
  "events.hero.accent": "room",
  "events.intro":
    "Events are booked in 4-hour slots. Book one, or book several. Slots can run back-to-back for a full day, or overlap when a bigger crowd needs more than one chair at the same time.",
};

function fallbackPlans(): PublicPlan[] {
  return memberships.map((tier, index) => ({
    id: tier.id,
    name: tier.name,
    priceCents: tier.priceMonthlyCents,
    cadence: "monthly",
    cuts: tier.cuts,
    summary: tier.summary,
    features: [...tier.perks],
    featured: Boolean(tier.featured),
    sortOrder: index,
    stripePriceId: "",
  }));
}

function fallbackSettings(): PublicSettings {
  return {
    phone: "",
    email: "",
    instagramUrl: site.instagramUrl,
    instagramHandle: site.instagramHandle,
    inShopUrl: site.inShopUrl,
    inShopLabel: site.inShopLabel,
    houseCallFeeCents: null,
    stripeHouseCallPriceId: "",
  };
}

export function fallbackCatalog(): PublicCatalog {
  const plans = fallbackPlans();
  const settings = fallbackSettings();
  return {
    plans,
    feeChoices: feeChoices(plans, settings.houseCallFeeCents),
    events: pastEvents.map((item, index) => ({
      id: `fallback-${index}`,
      title: item.title,
      eventDate: item.when,
      location: "",
      description: item.detail,
      instagramUrl: item.url,
      imageUrl: "",
      kind: "past" as const,
      sortOrder: index,
    })),
    gallery: fallbackGallery.map((photo) => ({ ...photo, instagramUrl: "" })),
    copy: copyFallbacks,
    settings,
    blocks: [],
  };
}

export function feeChoices(plans: PublicPlan[], houseCallFeeCents: number | null): FeeChoice[] {
  const membershipFees = plans.map((plan) => ({
    id: plan.id,
    label: `${plan.name} · ${formatDollars(plan.priceCents)}/${plan.cadence === "monthly" ? "mo" : plan.cadence}`,
    cents: plan.priceCents,
  }));
  const houseCall =
    houseCallFeeCents && houseCallFeeCents > 0
      ? `Single house call · ${formatDollars(houseCallFeeCents)}`
      : "Single house call · fee confirmed before the visit";
  return [...membershipFees, { id: "single_house_call", label: houseCall, cents: houseCallFeeCents }];
}

function reader(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

function text(value: unknown) {
  return typeof value === "string" ? value : "";
}

async function loadCachedCatalog(): Promise<PublicCatalog> {
  "use cache";
  cacheLife("hours");
  cacheTag("cms");
  const fallback = fallbackCatalog();
  const supabase = reader();
  if (!supabase) return fallback;

  const [plansResult, eventsResult, galleryResult, copyResult, settingsResult, blocksResult] = await Promise.all([
    supabase.from("membership_plans").select("*").eq("active", true).order("sort_order"),
    supabase.from("site_events").select("*").eq("published", true).order("sort_order"),
    supabase.from("gallery_items").select("*").eq("published", true).order("sort_order"),
    supabase.from("site_copy").select("key, value"),
    supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
    supabase.from("availability_blocks").select("starts_on, ends_on, kind"),
  ]);

  const plans = plansResult.error
    ? fallback.plans
    : (plansResult.data ?? []).map((row) => ({
        id: text(row.id),
        name: text(row.name),
        priceCents: Number(row.price_cents) || 0,
        cadence: text(row.cadence) || "monthly",
        cuts: text(row.cuts),
        summary: text(row.summary),
        features: Array.isArray(row.features) ? row.features.map((item: unknown) => String(item)) : [],
        featured: Boolean(row.featured),
        sortOrder: Number(row.sort_order) || 0,
        stripePriceId: text(row.stripe_price_id),
      }));

  const settings = settingsResult.error || !settingsResult.data
    ? fallback.settings
    : {
        phone: text(settingsResult.data.phone),
        email: text(settingsResult.data.email),
        instagramUrl: text(settingsResult.data.instagram_url) || fallback.settings.instagramUrl,
        instagramHandle: text(settingsResult.data.instagram_handle) || fallback.settings.instagramHandle,
        inShopUrl: text(settingsResult.data.in_shop_url) || fallback.settings.inShopUrl,
        inShopLabel: text(settingsResult.data.in_shop_label) || fallback.settings.inShopLabel,
        houseCallFeeCents:
          settingsResult.data.house_call_fee_cents == null ? null : Number(settingsResult.data.house_call_fee_cents),
        stripeHouseCallPriceId: text(settingsResult.data.stripe_house_call_price_id),
      };

  const events = eventsResult.error
    ? fallback.events
    : (eventsResult.data ?? []).map((row) => ({
        id: text(row.id),
        title: text(row.title),
        eventDate: text(row.event_date),
        location: text(row.location),
        description: text(row.description),
        instagramUrl: text(row.instagram_url),
        imageUrl: text(row.image_url),
        kind: row.kind === "upcoming" ? ("upcoming" as const) : ("past" as const),
        sortOrder: Number(row.sort_order) || 0,
      }));

  const photos = galleryResult.error
    ? fallback.gallery
    : (galleryResult.data ?? []).map((row) => ({
        src: text(row.image_url),
        alt: text(row.alt) || "Buzz Boxx PXV",
        width: Number(row.width) || 1200,
        height: Number(row.height) || 1500,
        instagramUrl: text(row.instagram_url),
      }));

  const copy = { ...fallback.copy };
  if (!copyResult.error) {
    for (const row of copyResult.data ?? []) {
      if (row.key) copy[String(row.key)] = text(row.value);
    }
  }

  const blocks = blocksResult.error
    ? []
    : (blocksResult.data ?? [])
        .filter((row) => row.kind === "blackout" || row.kind === "available")
        .map((row) => ({
          startsOn: text(row.starts_on),
          endsOn: text(row.ends_on),
          kind: row.kind as ScheduleBlock["kind"],
        }));

  return {
    plans,
    feeChoices: feeChoices(plans, settings.houseCallFeeCents),
    events,
    gallery: photos,
    copy,
    settings,
    blocks,
  };
}

export async function getPublicCatalog(): Promise<PublicCatalog> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return fallbackCatalog();
  try {
    return await loadCachedCatalog();
  } catch {
    return fallbackCatalog();
  }
}

export function copyOf(catalog: PublicCatalog, key: string) {
  return catalog.copy[key] || copyFallbacks[key] || "";
}
