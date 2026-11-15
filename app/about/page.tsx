import Image from "next/image";
import { Button, Container, Eyebrow, Gold, PageHero } from "@/components/ui";
import { site, van } from "@/content/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Mike Webb Jr. and Barbers on Broad",
  "Meet Mike Webb Jr., the barber behind Buzz Boxx PXV. House calls and the mobile van, with Barbers on Broad on North Broad Street in ZIP 19121 as home base. The host shop is wheelchair accessible.",
  "/about",
);

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About" title={<><Gold>Mike</Gold> Webb Jr. The chair travels. The shop sponsors it.</>}>
        {site.dba}. One barber. A host shop on North Broad Street. A community practice that started as Philly Fades and now books as Buzz Boxx PXV.
      </PageHero>
      <section className="py-16">
        <Container className="grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10">
            <Image
              src="/images/mike-webb.webp"
              alt="Mike Webb Jr. cutting hair in black gloves, Philly Fades cape in the frame."
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 400px, 100vw"
            />
          </div>
          <div className="space-y-5 text-lg leading-[1.6] text-muted">
            <h2 className="font-display text-4xl leading-none text-white">The barber</h2>
            <p>
              Mike Webb Jr. is the owner and the only barber featured here. He cuts every texture, and he will take the chair to a residence, a senior building, or a partner site when getting to a shop is the barrier.
            </p>
            <p>
              The mission is a welcoming cut from ages 2 to 99+, seven days by request, including senior communities and local support programs. The vision, carried through BuzzitForward and{" "}
              <a className="text-sun hover:underline" href={site.communityCareCutsUrl}>
                Community Care Cuts
              </a>
              , is that looking cared for should not depend on cash on hand or a ride to the shop.
            </p>
            <p>{site.cancellation}</p>
          </div>
        </Container>
      </section>
      <section className="relative min-h-[50svh] overflow-hidden border-y border-white/10">
        <Image
          src={van.src}
          alt={van.alt}
          fill
          className="object-cover object-[38%_center]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 to-ink/20" />
        <Container className="relative flex min-h-[50svh] items-end py-12">
          <p className="max-w-lg font-display text-3xl leading-none">The chair travels in the van. The shop on North Broad still sponsors the work.</p>
        </Container>
      </section>
      <section className="border-y border-white/10 bg-card py-16">
        <Container>
          <Eyebrow>Host shop</Eyebrow>
          <h2 className="mt-3 max-w-3xl font-display text-4xl leading-none">
            A public-private partnership with <Gold>Barbers on Broad</Gold>
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-[1.6] text-muted">
            Services are dispatched from {site.dispatchShop}, owned by {site.dispatchOwner}, at {site.dispatchAddress}. The shop sits in ZIP 19121, on the North Broad Street corridor Mike’s work is rooted in. The host shop is wheelchair accessible, and in-shop guests can book an ADA-friendly chair there. House calls are the traveling half of the same practice.
          </p>
          <div className="mt-6">
            <Button href={site.inShopUrl} external variant="ghost">
              {site.inShopLabel}
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
