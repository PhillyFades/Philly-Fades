import Image from "next/image";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { EventsHashRedirect } from "@/components/EventsHashRedirect";
import { InstagramEmbed, InstagramScript } from "@/components/InstagramEmbed";
import { Button, Container, Eyebrow, Gold, Section } from "@/components/ui";
import { eventPartners, eventTypes } from "@/content/events";
import { requestPath } from "@/content/requests";
import { buzzBoxxInstagram } from "@/src/data/instagram";
import { site, van } from "@/content/site";
import { copyOf, getPublicCatalog } from "@/lib/cms";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Bring the chair to the room",
  "Book Mike Webb Jr.’s mobile barber van in 4-hour slots. Community pop-ups, workplaces, schools, shelters, teams, and private parties. Mike plans the crew and the price after you inquire.",
  "/events",
);

async function EventsQueryRedirect({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  if (type) redirect(requestPath(type));
  return null;
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const catalog = await getPublicCatalog();
  const past = catalog.events.filter((item) => item.kind === "past");
  const upcoming = catalog.events.filter((item) => item.kind === "upcoming");
  return (
    <>
      <Suspense fallback={null}>
        <EventsQueryRedirect searchParams={searchParams} />
      </Suspense>
      <EventsHashRedirect />
      <section className="relative flex min-h-[78svh] items-end overflow-hidden">
        <Image
          src={van.src}
          alt={van.alt}
          fill
          priority
          className="object-cover object-[38%_center]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/30" />
        <Container className="relative pb-16 pt-36">
          <Eyebrow>Events</Eyebrow>
          <h1 className="mt-4 max-w-4xl font-display text-[clamp(2.8rem,7vw,5.4rem)] leading-[0.92] tracking-tight">
            {copyOf(catalog, "events.hero.lead")} <Gold>{copyOf(catalog, "events.hero.accent")}</Gold>.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-[1.6] text-white/85">{copyOf(catalog, "events.intro")}</p>
          <div className="mt-8">
            <Button href="/request?type=community-event">Request a 4-hour slot</Button>
          </div>
        </Container>
      </section>

      <Section>
        <Eyebrow>After you inquire</Eyebrow>
        <h2 className="mt-3 max-w-3xl font-display text-[clamp(2.2rem,5vw,3.8rem)] leading-[0.95]">
          Mike plans the day <Gold>with you</Gold>.
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-[1.6] text-muted">
          Barber count, setup, and the kind of event are worked out with {site.barber} directly. Send the request. He contacts you to plan the visit and to price it. Nothing on this page is a rate.
        </p>
      </Section>

      <Section id="past-events" className="bg-[#111]">
        <Eyebrow>Past events</Eyebrow>
        <h2 className="mt-3 max-w-3xl font-display text-[clamp(2.2rem,5vw,3.8rem)] leading-[0.95]">
          Days the van <Gold>already</Gold> worked.
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-[1.6] text-white">
          Partners we{"'"}ve worked with: {eventPartners.join(", ")}.
        </p>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {past.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-2xl border border-white/10 bg-card">
              {item.instagramUrl ? <InstagramEmbed url={item.instagramUrl} /> : null}
              <div className="p-5">
                <h3 className="font-display text-2xl leading-none">{item.title}</h3>
                <p className="mt-3 text-sm text-white">{item.eventDate}</p>
                {item.location ? <p className="mt-2 text-sm text-white">{item.location}</p> : null}
                <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>
                {item.instagramUrl ? (
                  <a href={item.instagramUrl} target="_blank" rel="noreferrer" className="mt-4 inline-block text-sm text-sun hover:underline">
                    View on Instagram
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
        <InstagramScript />
      </Section>

      <Section>
        <Eyebrow>Upcoming events</Eyebrow>
        <h2 className="mt-3 max-w-3xl font-display text-[clamp(2.2rem,5vw,3.8rem)] leading-[0.95]">
          {upcoming.length ? "Dates on the calendar." : <>New dates posted <Gold>soon</Gold>.</>}
        </h2>
        {upcoming.length ? (
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {upcoming.map((item) => (
              <article key={item.id} className="rounded-2xl border border-white/10 bg-card p-5">
                <h3 className="font-display text-2xl leading-none">{item.title}</h3>
                <p className="mt-3 text-sm text-white">{item.eventDate}</p>
                <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-5 max-w-2xl text-lg leading-[1.6] text-muted">
            New dates posted soon.{" "}
            <a href={buzzBoxxInstagram} target="_blank" rel="noreferrer" className="text-sun hover:underline">
              Follow @buzzboxxpxv
            </a>
          </p>
        )}
      </Section>

      <section className="border-y border-white/10">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative min-h-[320px] lg:min-h-[560px]">
            <Image
              src={van.src}
              alt={van.alt}
              fill
              className="object-cover object-[38%_center]"
              sizes="(min-width: 1024px) 55vw, 100vw"
            />
          </div>
          <div className="bg-card px-5 py-16 lg:px-10">
            <Eyebrow>Where the van can go</Eyebrow>
            <h2 className="mt-3 font-display text-[clamp(2.2rem,4vw,3.4rem)] leading-[0.95]">
              One van. <Gold>A lot of rooms.</Gold>
            </h2>
            <ul className="mt-8 space-y-3">
              {eventTypes.map((item) => (
                <li key={item.id}>
                  <a href={requestPath(item.id)} className="group block rounded-2xl border border-white/10 px-4 py-3 hover:border-gold/70">
                    <span className="block font-display text-xl leading-none group-hover:text-sun">{item.name}</span>
                    <span className="mt-1 block text-sm leading-6 text-muted">{item.summary}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
