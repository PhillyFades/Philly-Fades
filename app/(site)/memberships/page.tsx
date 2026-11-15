import { MembershipGrid } from "@/components/Offers";
import { Container, Gold, PageHero } from "@/components/ui";
import { site } from "@/content/site";
import { getPublicCatalog } from "@/lib/cms";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "House-call haircut memberships",
  "Monthly traveling haircut memberships from Mike Webb Jr. Recurring house calls across Philadelphia, Montgomery, and Chester Counties, with priority scheduling and household add-ons.",
  "/memberships",
);

export default async function MembershipsPage() {
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
  return (
    <>
      <PageHero eyebrow="Memberships · example rates" title={<>A standing <Gold>house call</Gold>, billed monthly.</>}>
        Three plans for people who want Mike on a rhythm. Prices are placeholders until the client confirms them. Checkout is a request for now. Stripe is not connected, so every signup is stored as pending payment.
      </PageHero>
      <section className="py-16">
        <Container>
          <MembershipGrid plans={plans} />
          <p className="mt-8 max-w-3xl text-sm leading-6 text-muted">{site.cancellation}</p>
        </Container>
      </section>
    </>
  );
}
