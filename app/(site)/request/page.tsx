import { Suspense } from "react";
import { VisitRequestForm } from "@/components/PublicForms";
import { Container, Gold, PageHero } from "@/components/ui";
import { isIntakeConfigured } from "@/lib/supabase";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Request a visit",
  "One request form for Buzz Boxx PXV events and programs. Community days, senior buildings, sensory visits, veterans, outreach, youth, and corporate bookings. Mike follows up to plan the day.",
  "/request",
);

export default function RequestPage() {
  return (
    <>
      <PageHero eyebrow="Events and programs" title={<>Tell us what you <Gold>need</Gold>.</>}>
        Events and partner visits use this one form. House-call bookings and memberships stay on their own pages. Mike confirms the date, the crew, and the price after he reads this.
      </PageHero>
      <section className="py-16">
        <Container>
          <div className="rounded-2xl border border-white/10 bg-card p-6 md:p-10">
            <Suspense fallback={<p className="text-muted">Loading the form…</p>}>
              <VisitRequestForm configured={isIntakeConfigured()} />
            </Suspense>
          </div>
        </Container>
      </section>
    </>
  );
}
