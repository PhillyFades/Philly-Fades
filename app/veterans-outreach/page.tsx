import { ReferralForm } from "@/components/forms";
import { ProgramView } from "@/components/ProgramView";
import { programs } from "@/content/programs";
import { isIntakeConfigured } from "@/lib/supabase";
import { pageMeta } from "@/lib/seo";

const program = programs.veterans;

export const metadata = pageMeta(
  "Veteran community outreach grooming in Philly",
  "Trauma-informed grooming and job-readiness cuts for veteran community outreach in Philly. VA and SSVF coordinators can request a housing-transition visit from Buzz Boxx PXV.",
  program.path,
);

export default function VeteransPage() {
  return (
    <ProgramView {...program} bookHref={`/book?demographic=${program.bookDemographic}`}>
      <ReferralForm
        configured={isIntakeConfigured()}
        program="veterans"
        heading="Coordinator request"
        intro="VA, SSVF, and housing partners can ask for a dignity cut or a short block. Invoice and voucher payment is chosen on the house-call form."
        requestTypes={[
          { value: "va_coordinator", label: "VA or SSVF coordinator" },
          { value: "housing_transition", label: "Housing-transition readiness" },
          { value: "job_readiness", label: "Job-readiness cut" },
        ]}
      />
    </ProgramView>
  );
}
