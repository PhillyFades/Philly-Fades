import { ReferralForm } from "@/components/forms";
import { ProgramView } from "@/components/ProgramView";
import { programs } from "@/content/programs";
import { isIntakeConfigured } from "@/lib/supabase";
import { pageMeta } from "@/lib/seo";

const program = programs.youth;

export const metadata = pageMeta(
  "Youth mentorship haircuts",
  "Back-to-school and rec center haircuts with Mike Webb Jr. in Philadelphia. Schools and youth programs can request a mentorship block from Buzz Boxx PXV.",
  program.path,
);

export default function YouthPage() {
  return (
    <ProgramView {...program} bookHref={`/book?demographic=${program.bookDemographic}`}>
      <ReferralForm
        configured={isIntakeConfigured()}
        program="youth"
        heading="School or rec center inquiry"
        intro="Tell us the building, the age range, and whether this is back-to-school, a season start, or a standing night."
        requestTypes={[
          { value: "school", label: "School" },
          { value: "rec_center", label: "Rec center" },
          { value: "back_to_school", label: "Back-to-school block" },
        ]}
      />
    </ProgramView>
  );
}
