import { Suspense } from "react";
import { MembershipForm } from "@/components/forms";
import { MembershipGrid } from "@/components/Offers";
import { Container, Gold, PageHero } from "@/components/ui";
import { site } from "@/content/site";
import { isIntakeConfigured } from "@/lib/supabase";
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
      <section id="request" className="pb-24">
        <Container>
          <div className="rounded-2xl border border-white/10 bg-card p-6 md:p-10">
            <h2 className="font-display text-4xl leading-none">Request a membership</h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
              House-call memberships use the same Pennsylvania eligibility rule as a single visit. A caregiver can book the first cut from the house-call form and name this plan.
            </p>
            <div className="mt-8">
              <Suspense fallback={<p className="text-muted">Loading the form…</p>}>
                <MembershipForm configured={isIntakeConfigured()} />
              </Suspense>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
