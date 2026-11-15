import Image from "next/image";
import Link from "next/link";
import { Button, Container, Eyebrow, Gold, IconTile, PageHero, Section } from "@/components/ui";
import { gallery } from "@/content/gallery";
import { programCards } from "@/content/programs";
import { site, van } from "@/content/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Community programs for partners",
  "Mike Webb Jr. brings the chair to senior buildings, shelters, schools, veteran groups, and the case managers who support them. Warm visits, an easy setup, and sponsored cuts when a partner covers the chair.",
  "/programs",
);

const brings = [
  {
    title: "A real shop setup",
    body: "Cape, clippers, and the supplies for the visit come from Barbers on Broad. Your room does not have to become a barbershop.",
  },
  {
    title: "An unhurried chair",
    body: "Mike explains the next step, works at the person’s pace, and stops if the room needs him to. Nobody is rushed for a photo.",
  },
  {
    title: "Wherever you already are",
    body: "A day room, an apartment, a shelter, a rec-center gym, or a quiet corner. He sets up, cuts, and packs out.",
  },
  {
    title: "Your staff stay in the lead",
    body: "The caregiver, coordinator, or site lead who already has the trust makes the introduction. Mike follows that lead.",
  },
];

const steps = [
  {
    step: "01",
    title: "Tell us who it is for",
    body: "A person, a building, or a block of chairs. Say who is asking and whether a sponsor is paying.",
  },
  {
    step: "02",
    title: "Pick a time and a room",
    body: "We match the visit to your schedule. A case manager can request it without the guest filling out a thing.",
  },
  {
    step: "03",
    title: "Mike comes to you",
    body: "He arrives with the setup, greets people by name when you have it, and keeps the visit calm.",
  },
  {
    step: "04",
    title: "They leave looking like themselves",
    body: "A clean cut, a little more confidence, and a note on the shop’s books so the visit is real.",
  },
];

const gains = [
  { title: "Dignity", body: "A proper groom, not a rushed favor. People sit because they want to." },
  { title: "Confidence", body: "Useful before an interview, a move-in, a hearing, or the first day of school." },
  { title: "Morale", body: "A good ordinary thing in a hard week. Staff feel it too." },
  { title: "Easy scheduling", body: "One request from the person who already manages the day." },
  { title: "Mobile setup", body: "No one has to cross the city to sit in a lobby." },
  { title: "Flexible pricing", body: "A household can book a visit, or a partner can sponsor the chairs." },
];

export default function ProgramsPage() {
  return (
    <>
      <PageHero eyebrow="For partners" title={<>A barber who comes to <Gold>your people</Gold>.</>}>
        Senior buildings, shelters, schools, veteran groups, case managers, nonprofits, and event organizers call {site.barber} when a haircut would help and getting to a shop is the hard part. He sets up where you already are.
      </PageHero>

      <section className="relative min-h-[62svh] overflow-hidden">
        <Image
          src={van.src}
          alt={van.alt}
          fill
          className="object-cover object-[38%_center]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/20" />
        <Container className="relative flex min-h-[62svh] items-end py-14">
          <div className="max-w-xl">
            <Eyebrow>What we bring on site</Eyebrow>
            <h2 className="mt-3 font-display text-[clamp(2.2rem,5vw,3.6rem)] leading-[0.95]">
              The van rolls up. The chair is <Gold>already inside</Gold>.
            </h2>
          </div>
        </Container>
      </section>

      <Section>
        <Eyebrow>What Mike brings</Eyebrow>
        <h2 className="mt-3 max-w-3xl font-display text-[clamp(2.2rem,5vw,3.8rem)] leading-[0.95]">
          The chair, the calm, and a <Gold>clean pack-out</Gold>.
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {brings.map((item) => (
            <article key={item.title} className="lift rounded-2xl border border-white/10 bg-card p-6">
              <h3 className="font-display text-2xl leading-none">{item.title}</h3>
              <p className="mt-3 text-base leading-7 text-muted">{item.body}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section className="bg-[#111] !py-16 md:!py-20">
        <Eyebrow>The programs</Eyebrow>
        <h2 className="mt-3 max-w-3xl font-display text-[clamp(2.2rem,5vw,3.8rem)] leading-[0.95]">
          Who the visit is <Gold>for</Gold>.
        </h2>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {programCards.map((program) => (
            <article key={program.name} className="lift overflow-hidden rounded-2xl border border-white/10 bg-card">
              <div className="relative aspect-[16/9]">
                <Image src={program.image} alt={program.imageAlt} fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
              </div>
              <div className="p-6">
                <h3 className="font-display text-3xl leading-none">{program.name}</h3>
                <p className="mt-3 text-base leading-7 text-muted">{program.summary}</p>
                <p className="mt-4 text-sm leading-6 text-white">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-gold">Who it serves · </span>
                  {program.serves}
                </p>
                <div className="mt-6">
                  <Button href={program.href} variant={program.href === "/request" ? "solid" : "ghost"}>
                    {program.linkLabel}
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section>
        <Eyebrow>How a visit works</Eyebrow>
        <h2 className="mt-3 max-w-3xl font-display text-[clamp(2.2rem,5vw,3.8rem)] leading-[0.95]">
          Four steps. <Gold>No scavenger hunt</Gold>.
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {steps.map((item) => (
            <article key={item.step} className="rounded-2xl border border-white/10 bg-card p-6">
              <IconTile>
                <span className="font-display text-sm">{item.step}</span>
              </IconTile>
              <h3 className="mt-5 font-display text-2xl leading-none">{item.title}</h3>
              <p className="mt-3 text-base leading-7 text-muted">{item.body}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section className="bg-[#111]">
        <Eyebrow>What partners get</Eyebrow>
        <h2 className="mt-3 max-w-3xl font-display text-[clamp(2.2rem,5vw,3.8rem)] leading-[0.95]">
          More than a <Gold>haircut</Gold>.
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {gains.map((item) => (
            <article key={item.title} className="rounded-2xl border border-white/10 bg-card p-6">
              <h3 className="font-display text-2xl leading-none text-sun">{item.title}</h3>
              <p className="mt-3 text-base leading-7 text-muted">{item.body}</p>
            </article>
          ))}
        </div>
      </Section>

      <section className="border-y border-white/10 py-16">
        <Container>
          <Eyebrow>Mike’s work</Eyebrow>
          <h2 className="mt-3 font-display text-4xl leading-none">The finish he brings with him.</h2>
        </Container>
        <div className="mt-8 flex gap-4 overflow-x-auto px-5 pb-2">
          {gallery.slice(0, 6).map((photo) => (
            <Link
              key={photo.src}
              href="/gallery"
              className="relative h-64 w-48 shrink-0 overflow-hidden rounded-2xl border border-white/10"
            >
              <Image src={photo.src} alt={photo.alt} fill className="object-cover" sizes="192px" />
            </Link>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden">
        <Image src="/images/mike-work-02.webp" alt="" fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-ink/80" />
        <Container className="relative py-24">
          <Eyebrow>Start a visit</Eyebrow>
          <h2 className="mt-3 max-w-3xl font-display text-[clamp(2.2rem,5vw,3.8rem)] leading-[0.95]">
            Tell us the building. <Gold>Mike will bring the chair.</Gold>
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-[1.6] text-white/85">
            Caregivers, case managers, and site leads can request a visit in a few minutes. Event organizers planning a larger day can look at community and corporate bookings too.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/request">Partner with us</Button>
            <Button href="/events" variant="ghost">
              See events
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
