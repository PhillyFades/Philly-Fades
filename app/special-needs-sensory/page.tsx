import { ReferralForm } from "@/components/forms";
import { ProgramView } from "@/components/ProgramView";
import { programs } from "@/content/programs";
import { isIntakeConfigured } from "@/lib/supabase";
import { pageMeta } from "@/lib/seo";

const program = programs.sensory;

export const metadata = pageMeta(
  "Sensory-safe haircuts in Philadelphia",
  "Special needs mobile barber and sensory-safe haircuts in Philadelphia. Quiet clippers, visual schedules, patience-first visits at home, and adaptive barber services from Mike Webb Jr.",
  program.path,
);

export default function SensoryPage() {
  return (
    <ProgramView {...program} bookHref={`/book?demographic=${program.bookDemographic}`}>
      <ReferralForm
        configured={isIntakeConfigured()}
        program="sensory"
        heading="Family or support-coordinator request"
        intro="Share what the room needs before the first visit. Mike reads this before he sets a time."
        requestTypes={[
          { value: "sensory_home_visit", label: "Sensory-safe home visit" },
          { value: "support_coordinator", label: "Support coordinator introduction" },
        ]}
      />
    </ProgramView>
  );
}
