import { ReferralForm } from "@/components/forms";
import { ProgramView } from "@/components/ProgramView";
import { programs } from "@/content/programs";
import { isIntakeConfigured } from "@/lib/supabase";
import { pageMeta } from "@/lib/seo";

const program = programs.seniors;

export const metadata = pageMeta(
  "Homebound senior grooming in Pennsylvania",
  "Homebound senior grooming in PA from a mobile barber. Caregiver scheduling, hospital-grade sanitation, and fewer trips that raise fall risk. Dispatched from Barbers on Broad in Philadelphia.",
  program.path,
);

export default function SeniorsPage() {
  return (
    <ProgramView
      {...program}
      bookHref={`/book?demographic=${program.bookDemographic}`}
    >
      <ReferralForm
        configured={isIntakeConfigured()}
        program="seniors_homebound"
        heading="Caregiver or facility request"
        intro="Use this if you schedule for someone else and want a call before a full booking. For a dated house call, use the booking form and turn on booking on behalf of someone."
        requestTypes={[
          { value: "caregiver_scheduling", label: "Caregiver scheduling" },
          { value: "facility_block", label: "Senior building or facility block" },
        ]}
      />
    </ProgramView>
  );
}
