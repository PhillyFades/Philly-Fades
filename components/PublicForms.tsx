import { BookingForm, MembershipForm, RequestForm } from "@/components/forms";
import { getPublicCatalog } from "@/lib/cms";

export async function HouseCallForm({ configured }: { configured: boolean }) {
  const catalog = await getPublicCatalog();
  return <BookingForm configured={configured} plans={catalog.feeChoices} blocks={catalog.blocks} />;
}

export async function MembershipIntake({ configured }: { configured: boolean }) {
  const catalog = await getPublicCatalog();
  return (
    <MembershipForm
      configured={configured}
      plans={catalog.plans.map((plan) => ({
        id: plan.id,
        name: plan.name,
        priceCents: plan.priceCents,
        cadence: plan.cadence,
        cuts: plan.cuts,
      }))}
    />
  );
}

export async function VisitRequestForm({ configured }: { configured: boolean }) {
  const catalog = await getPublicCatalog();
  return <RequestForm configured={configured} blocks={catalog.blocks} />;
}
