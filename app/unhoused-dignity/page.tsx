import { ReferralForm } from "@/components/forms";
import { ProgramView } from "@/components/ProgramView";
import { programs } from "@/content/programs";
import { isIntakeConfigured } from "@/lib/supabase";
import { pageMeta } from "@/lib/seo";

const program = programs.unhoused;

export const metadata = pageMeta(
  "Dignity cuts for unhoused neighbors",
  "Mobile barber pop-ups at Philadelphia shelters, food pantries, and behavioral health centers. Sponsor a Cut or request a site visit from Mike Webb Jr., dispatched from Barbers on Broad.",
  program.path,
);

export default function UnhousedPage() {
  return (
    <ProgramView {...program} bookHref={`/book?demographic=${program.bookDemographic}`}>
      <ReferralForm
        configured={isIntakeConfigured()}
        program="unhoused"
        heading="Sponsor a Cut or request a pop-up"
        intro="Sites can ask for a date. Sponsors can fund a block of chairs. Say which one this is, and where the chair should set up."
        requestTypes={[
          { value: "shelter_popup", label: "Shelter pop-up" },
          { value: "food_pantry", label: "Food pantry" },
          { value: "behavioral_health", label: "Behavioral health center" },
          { value: "sponsor_a_cut", label: "Sponsor a Cut" },
        ]}
      />
    </ProgramView>
  );
}
