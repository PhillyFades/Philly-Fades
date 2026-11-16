import Image from "next/image";
import type { ReactNode } from "react";
import { Button, Container, Eyebrow, Gold } from "@/components/ui";
import { requestPath } from "@/content/requests";

export function ProgramView({
  eyebrow,
  titleBefore,
  highlight,
  titleAfter,
  lede,
  points,
  sections,
  image,
  imageAlt,
  bookHref,
  partnerType,
  partnerHeading,
  partnerIntro,
  children,
}: {
  eyebrow: string;
  titleBefore: string;
  highlight: string;
  titleAfter: string;
  lede: string;
  points: readonly string[];
  sections: readonly { heading: string; body: string }[];
  image: string;
  imageAlt: string;
  bookHref: string;
  partnerType: string;
  partnerHeading: string;
  partnerIntro: string;
  children?: ReactNode;
}) {
  const partnerHref = requestPath(partnerType);
  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10 pt-32 pb-16">
        <Image src={image} alt="" fill className="object-cover opacity-30" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/90 to-ink/70" />
        <Container className="relative grid items-end gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 className="mt-4 font-display text-[clamp(2.5rem,6vw,4.6rem)] leading-[0.95] tracking-tight">
              {titleBefore} <Gold>{highlight}</Gold> {titleAfter}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-[1.6] text-muted">{lede}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={bookHref}>Book a house call</Button>
              <Button href={partnerHref} variant="ghost">
                Partner with us
              </Button>
            </div>
          </div>
          <div className="relative hidden aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 lg:block">
            <Image src={image} alt={imageAlt} fill className="object-cover" sizes="30vw" />
          </div>
        </Container>
      </section>
      <section className="py-20">
        <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <ul className="space-y-4">
            {points.map((point) => (
              <li key={point} className="rounded-2xl border border-white/10 bg-card p-5 text-base leading-7">
                {point}
              </li>
            ))}
          </ul>
          <div className="space-y-8">
            {sections.map((section) => (
              <div key={section.heading}>
                <h2 className="font-display text-3xl leading-none">{section.heading}</h2>
                <p className="mt-4 text-lg leading-[1.6] text-muted">{section.body}</p>
              </div>
            ))}
            <p className="text-sm leading-6 text-muted">
              Looking for the chair at the shop instead?{" "}
              <a
                href="https://barbers-on-broad-llc.square.site"
                className="text-sun hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                Book an in-shop chair in North Philly
              </a>
              .
            </p>
          </div>
        </Container>
      </section>
      <section className="pb-24">
        <Container>
          <div className="rounded-2xl border border-white/10 bg-card p-6 md:p-10">
            <h2 className="font-display text-4xl leading-none">{partnerHeading}</h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted">{partnerIntro}</p>
            <div className="mt-6">
              <Button href={partnerHref}>Partner with us</Button>
            </div>
            {children}
          </div>
        </Container>
      </section>
    </>
  );
}
