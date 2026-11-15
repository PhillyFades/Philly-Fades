import Image from "next/image";
import Link from "next/link";
import { MembershipGrid } from "@/components/Offers";
import { Button, Container, Eyebrow, Gold, IconTile, Section } from "@/components/ui";
import { communityLinks, howItWorks, site, van } from "@/content/site";
import { formatDollars } from "@/content/pricing";
import { copyOf, getPublicCatalog } from "@/lib/cms";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Traveling barber for house call haircuts in Philadelphia",
  "Premium mobile barber and house call haircuts from Mike Webb Jr. Memberships, community events, sensory-safe visits, and homebound senior grooming across Philadelphia, Montgomery, and Chester Counties. Dispatched from Barbers on Broad.",
  "/",
);

export default async function HomePage() {
  const catalog = await getPublicCatalog();
  const plans = catalog.plans.map((plan) => ({
    id: plan.id,
    name: plan.name,
    priceMonthlyCents: plan.priceCents,
    cuts: plan.cuts,
    summary: plan.summary,
    perks: plan.features,
    featured: plan.featured,
  }));
  const fromPrice = plans.length ? Math.min(...plans.map((plan) => plan.priceMonthlyCents)) : 15000;
  return (
    <>
      <section className="relative flex min-h-[100svh] items-end overflow-hidden">
        <Image
          src={van.src}
          alt={van.alt}
          fill
          priority
          className="object-cover object-[38%_center]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink from-10% via-ink/80 via-42% to-ink/15" />
        <Container className="relative pb-16 pt-32">
          <Eyebrow>Traveling barber · Philadelphia</Eyebrow>
          <h1 className="mt-4 max-w-4xl font-display text-[clamp(3.2rem,8vw,6.4rem)] leading-[0.92] tracking-tight">
            {copyOf(catalog, "home.hero.lead")} <Gold>{copyOf(catalog, "home.hero.accent")}</Gold>.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-[1.6] text-white/85">{copyOf(catalog, "home.hero.subheadline")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/book">Book a house call</Button>
            <Button href="/memberships" variant="ghost">
              See memberships
            </Button>
          </div>
        </Container>
      </section>

      <section className="border-y border-white/10 bg-card">
        <Container className="grid gap-6 py-8 sm:grid-cols-3">
          {[
            ["3", "Counties on the route"],
            ["7", "Days, by request"],
            [formatDollars(fromPrice), "Example memberships from"],
          ].map(([stat, label]) => (
            <p key={label}>
              <span className="block font-display text-4xl text-sun">{stat}</span>
              <span className="mt-1 block text-sm text-muted">{label}</span>
            </p>
          ))}
        </Container>
      </section>

      <Section id="memberships">
        <Eyebrow>Memberships</Eyebrow>
        <h2 className="mt-3 max-w-3xl font-display text-[clamp(2.2rem,5vw,3.8rem)] leading-[0.95]">
          The chair, on a <Gold>monthly</Gold> rhythm.
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-[1.6] text-muted">{copyOf(catalog, "home.memberships.intro")}</p>
        <div className="mt-10">
          <MembershipGrid plans={plans} />
        </div>
      </Section>

      <Section className="bg-[#111]">
        <Eyebrow>Events</Eyebrow>
        <h2 className="mt-3 max-w-3xl font-display text-[clamp(2.2rem,5vw,3.8rem)] leading-[0.95]">
          Four-hour slots. <Gold>Mike prices the day.</Gold>
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-[1.6] text-muted">{copyOf(catalog, "home.events.intro")}</p>
        <div className="mt-8">
          <Button href="/request?type=community-event">Plan an event</Button>
        </div>
      </Section>

      <Section>
        <Eyebrow>How it works</Eyebrow>
        <h2 className="mt-3 max-w-3xl font-display text-[clamp(2.2rem,5vw,3.8rem)] leading-[0.95]">
          A house call, <Gold>logged</Gold> like a shop visit.
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {howItWorks.map((item) => (
            <article key={item.step} className="lift rounded-2xl border border-white/10 bg-card p-6">
              <IconTile>
                <span className="font-display text-sm">{item.step}</span>
              </IconTile>
              <h3 className="mt-5 font-display text-2xl leading-none">{item.title}</h3>
              <p className="mt-3 text-base leading-7 text-muted">{item.body}</p>
            </article>
          ))}
        </div>
      </Section>

      <section className="relative overflow-hidden border-y border-white/10">
        <Container className="grid items-center gap-10 py-20 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <div className="relative mx-auto aspect-[3/4] max-w-sm overflow-hidden rounded-2xl border border-white/10">
              <Image
                src="/images/mike-webb.webp"
                alt="Mike Webb Jr. lining up a haircut in black gloves."
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 320px, 80vw"
              />
            </div>
          </div>
          <div>
            <Eyebrow>The barber</Eyebrow>
            <h2 className="mt-3 font-display text-[clamp(2.2rem,5vw,3.8rem)] leading-[0.95]">
              Mike Webb Jr., <Gold>North Philly</Gold> standard.
            </h2>
            <p className="mt-5 text-lg leading-[1.6] text-muted">
              Owner and barber of {site.legalName}. The work on this site is his. Every texture, from
              a first lineup to a careful beard, with the same finish in a residence as in the host
              shop on North Broad Street.
            </p>
            <p className="mt-4 text-lg leading-[1.6] text-muted">
              BuzzitForward and{" "}
              <a href={site.communityCareCutsUrl} className="text-sun hover:underline">
                Community Care Cuts
              </a>{" "}
              are the community side of that chair: subsidized cuts with senior buildings and local
              programs, so money or mobility is not the reason someone goes without a groom.
            </p>
            <div className="mt-8">
              <Button href="/about" variant="ghost">
                Read Mike’s story
              </Button>
            </div>
          </div>
        </Container>
        <div className="flex gap-4 overflow-x-auto px-5 pb-10">
          {catalog.gallery.slice(1, 6).map((photo) => (
            <Link
              key={photo.src}
              href="/gallery"
              className="relative h-56 w-44 shrink-0 overflow-hidden rounded-2xl border border-white/10"
            >
              <Image src={photo.src} alt={photo.alt} fill className="object-cover" sizes="176px" />
            </Link>
          ))}
        </div>
      </section>

      <Section>
        <Eyebrow>Community</Eyebrow>
        <h2 className="mt-3 max-w-3xl font-display text-[clamp(2.2rem,5vw,3.8rem)] leading-[0.95]">
          Grooming as <Gold>care</Gold>.
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-[1.6] text-muted">
          Sensory-safe haircuts, homebound senior grooming, veteran outreach, shelter pop-ups, and
          youth mentorship. Facilities and case managers can request a visit for the people they support.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/programs">See all programs</Button>
          <Button href="/request" variant="ghost">
            Partner with us
          </Button>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {communityLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="lift rounded-2xl border border-white/10 bg-card px-5 py-6 hover:border-gold/60"
            >
              <span className="text-[11px] uppercase tracking-[0.2em] text-gold">Program</span>
              <span className="mt-3 block font-display text-2xl leading-none">{item.label}</span>
            </Link>
          ))}
        </div>
      </Section>

      <section className="relative overflow-hidden">
        <Image
          src="/images/mike-work-02.webp"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-ink/80" />
        <Container className="relative py-24">
          <Eyebrow>Dispatch</Eyebrow>
          <h2 className="mt-3 max-w-3xl font-display text-[clamp(2.2rem,5vw,3.8rem)] leading-[0.95]">
            Officially dispatched via <Gold>Barbers on Broad</Gold>.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-[1.6] text-white/85">
            {site.dispatchAddress}. Wheelchair-accessible host shop. In-shop chairs book separately.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/book">Request a traveling cut</Button>
            <Button href={catalog.settings.inShopUrl} variant="ghost" external>
              {catalog.settings.inShopLabel}
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
