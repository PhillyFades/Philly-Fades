import { Suspense } from "react";
import { MembershipForm } from "@/components/forms";
import { Container, Gold, PageHero } from "@/components/ui";
import { isIntakeConfigured } from "@/lib/supabase";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Request a membership",
  "Request a Buzz Boxx PXV membership. Cuts happen in the van or in the home. Choose The Lineup, The Rotation, or The Residence. In-home plans ask you to confirm the person cannot travel to a shop.",
  "/memberships/request",
);

export default function MembershipRequestPage() {
  return (
    <>
      <PageHero eyebrow="Memberships" title={<>Request a <Gold>membership</Gold>.</>}>
        Cuts can happen in the van, with Mike parked outside, or inside the home. If the cut is in the home, confirm the person cannot travel to a shop. Choose a plan, or arrive here from a plan card and that plan is already selected. Payment stays pending until Stripe is connected.
      </PageHero>
      <section className="py-16">
        <Container>
          <div className="rounded-2xl border border-white/10 bg-card p-6 md:p-10">
            <h2 className="font-display text-4xl leading-none">Request a membership</h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
              A caregiver can book the first cut from the house-call form and name this plan.
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
