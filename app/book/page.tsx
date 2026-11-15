import { Suspense } from "react";
import { BookingForm } from "@/components/forms";
import { Container, DispatchNote, Gold, PageHero } from "@/components/ui";
import { site } from "@/content/site";
import { isIntakeConfigured } from "@/lib/supabase";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Book a house call haircut",
  "Request a mobile barber house call with Mike Webb Jr. in Philadelphia, Montgomery, or Chester County. Tell us who the cut is for and where to come.",
  "/book",
);

export default function BookPage() {
  return (
    <>
      <PageHero eyebrow="House calls" title={<>Request the chair at <Gold>your</Gold> address.</>}>
        A traveling cut at home or at a building. Case managers, nurses, VA coordinators, and family caregivers can book on behalf of the person receiving the cut and pay by invoice or voucher.
      </PageHero>
      <section className="py-16">
        <Container className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
          <div className="rounded-2xl border border-white/10 bg-card p-6 md:p-10">
            <Suspense fallback={<p className="text-muted">Loading the form…</p>}>
              <BookingForm configured={isIntakeConfigured()} />
            </Suspense>
          </div>
          <aside className="space-y-5">
            <DispatchNote />
            <div className="rounded-2xl border border-white/10 bg-card p-6">
              <h2 className="font-display text-2xl leading-none">Cancellation</h2>
              <p className="mt-3 text-base leading-7 text-muted">{site.cancellation}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-card p-6">
              <h2 className="font-display text-2xl leading-none">What we store</h2>
              <p className="mt-3 text-base leading-7 text-muted">
                Name, date and time, service address, the plan, and who the cut is for. It is not a diagnosis, and this site never publishes the dispatch log.
              </p>
            </div>
            <p className="text-sm text-muted">
              {site.phonePlaceholder}
              <br />
              {site.emailPlaceholder}
            </p>
          </aside>
        </Container>
      </section>
    </>
  );
}
