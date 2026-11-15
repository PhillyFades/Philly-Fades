import { MembershipGrid } from "@/components/Offers";
import { Container, Gold, PageHero } from "@/components/ui";
import { site } from "@/content/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "House-call haircut memberships",
  "Monthly traveling haircut memberships from Mike Webb Jr. Recurring house calls across Philadelphia, Montgomery, and Chester Counties, with priority scheduling and household add-ons.",
  "/memberships",
);

export default function MembershipsPage() {
  return (
    <>
      <PageHero eyebrow="Memberships · example rates" title={<>A standing <Gold>house call</Gold>, billed monthly.</>}>
        Three plans for people who want Mike on a rhythm. Prices are placeholders until the client confirms them. Checkout is a request for now. Stripe is not connected, so every signup is stored as pending payment.
      </PageHero>
      <section className="py-16">
        <Container>
          <MembershipGrid />
          <p className="mt-8 max-w-3xl text-sm leading-6 text-muted">{site.cancellation}</p>
        </Container>
      </section>
    </>
  );
}
