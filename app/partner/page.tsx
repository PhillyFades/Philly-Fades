import { Suspense } from "react";
import { ReferralForm, VendorForm } from "@/components/forms";
import { Container, Gold, PageHero } from "@/components/ui";
import { pageMeta } from "@/lib/seo";
import { isIntakeConfigured } from "@/lib/supabase";

export const metadata = pageMeta(
  "Partner with us",
  "Caregivers, senior buildings, shelters, schools, and veteran groups can request a visit from Mike Webb Jr. Foundations that need insurance paperwork can send that here too.",
  "/partner",
);

export default function PartnerPage() {
  const configured = isIntakeConfigured();

  return (
    <>
      <PageHero eyebrow="Partners · caregivers · case managers" title={<>Partner with <Gold>us</Gold>.</>}>
        This is the caregiver and facility request. Choose the program, tell us the building, and Mike confirms a time before anyone is on the schedule. If you opened this from a program page, that request is already selected.
      </PageHero>
      <section className="py-16">
        <Container>
          <div className="rounded-2xl border border-white/10 bg-card p-6 md:p-10">
            <Suspense fallback={<p className="text-muted">Loading the form…</p>}>
              <ReferralForm configured={configured} />
            </Suspense>
          </div>
        </Container>
      </section>
      <section className="pb-24">
        <Container>
          <div className="rounded-2xl border border-white/10 bg-card p-6 md:p-10">
            <h2 className="font-display text-4xl leading-none">Foundations and agencies</h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
              If your organization needs a certificate of insurance or a W-9 before it can pay for visits, send that here. Mike will follow up with the current documents.
            </p>
            <div className="mt-8">
              <VendorForm configured={configured} />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
