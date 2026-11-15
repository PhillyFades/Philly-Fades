import { VendorForm } from "@/components/forms";
import { ComplianceStatement } from "@/components/Compliance";
import { Container, Gold, PageHero } from "@/components/ui";
import { isIntakeConfigured } from "@/lib/supabase";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Institutional partnerships and vendor intake",
  "Foundations, case managers, and agencies can request Buzz Boxx PXV as a grooming vendor. Program one-pager and insurance placeholders, plus a PA § 3.61 compliance statement.",
  "/impact-partnerships",
);

const docs = [
  {
    href: "/docs/program-one-pager.pdf",
    title: "Program one-pager",
    note: "Placeholder PDF. Confirm with the client before sharing with a funder.",
  },
  {
    href: "/docs/licensing-placeholder.pdf",
    title: "Licensing packet",
    note: "Placeholder. The live packet should carry the shop license and Mike’s barber license.",
  },
  {
    href: "/docs/certificate-of-insurance-placeholder.pdf",
    title: "Certificate of insurance",
    note: "Placeholder. Replace with the current COI from the broker.",
  },
];

export default function ImpactPage() {
  return (
    <>
      <PageHero eyebrow="Foundations · agencies · case managers" title={<>A vendor you can <Gold>brief</Gold>.</>}>
        Buzz Boxx PXV is built for partners who already carry a caseload: homebound seniors, sensory and disability supports, veterans in housing transition, shelter guests, and youth programs. This page is the intake, not a grant application.
      </PageHero>
      <section className="py-16">
        <Container className="grid gap-6 md:grid-cols-3">
          {docs.map((doc) => (
            <a
              key={doc.href}
              href={doc.href}
              className="lift rounded-2xl border border-white/10 bg-card p-6 hover:border-gold/70"
            >
              <p className="text-[11px] uppercase tracking-[0.2em] text-gold">Download · placeholder</p>
              <h2 className="mt-3 font-display text-2xl leading-none">{doc.title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted">{doc.note}</p>
            </a>
          ))}
        </Container>
      </section>
      <section className="pb-8">
        <Container>
          <h2 className="font-display text-4xl leading-none">PA § 3.61 compliance statement</h2>
          <div className="mt-6 max-w-3xl">
            <ComplianceStatement />
          </div>
        </Container>
      </section>
      <section className="py-16">
        <Container>
          <div className="rounded-2xl border border-white/10 bg-card p-6 md:p-10">
            <h2 className="font-display text-4xl leading-none">Institutional vendor intake</h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
              Tell us who you fund or case-manage, which counties you cover, and whether you need a COI or W-9. Those documents above are placeholders until the client files the real ones.
            </p>
            <div className="mt-8">
              <VendorForm configured={isIntakeConfigured()} />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
