import { Suspense } from "react";
import { EventForm } from "@/components/forms";
import { EventGrid } from "@/components/Offers";
import { ComplianceStatement } from "@/components/Compliance";
import { Container, Gold, PageHero } from "@/components/ui";
import { isIntakeConfigured } from "@/lib/supabase";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Community and corporate barber events",
  "Book a community pop-up, corporate activation, or private event with traveling barber Mike Webb Jr. Packages are reviewed under Pennsylvania out-of-shop rules and dispatched from Barbers on Broad.",
  "/events",
);

export default function EventsPage() {
  return (
    <>
      <PageHero eyebrow="Events · example packages" title={<>Bring the chair to the <Gold>room</Gold>.</>}>
        Community pop-ups, brand activations, and private bookings. Mike leads every date. A second chair is added only when the room and the statute both allow it. Starting prices are placeholders.
      </PageHero>
      <section className="py-16">
        <Container>
          <EventGrid />
        </Container>
      </section>
      <section className="pb-8">
        <Container>
          <h2 className="font-display text-4xl leading-none">Before a date is held</h2>
          <div className="mt-6 max-w-3xl">
            <ComplianceStatement />
          </div>
        </Container>
      </section>
      <section id="request" className="py-16">
        <Container>
          <div className="rounded-2xl border border-white/10 bg-card p-6 md:p-10">
            <h2 className="font-display text-4xl leading-none">Event inquiry</h2>
            <p className="mt-3 text-base leading-7 text-muted">
              Tell us the room, the date, and the package. Institutional sites are the intended use. Residence events use the house-call eligibility confirmation.
            </p>
            <div className="mt-8">
              <Suspense fallback={<p className="text-muted">Loading the form…</p>}>
                <EventForm configured={isIntakeConfigured()} />
              </Suspense>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
