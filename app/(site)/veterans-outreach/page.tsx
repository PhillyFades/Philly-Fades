import { ProgramView } from "@/components/ProgramView";
import { programs } from "@/content/programs";
import { pageMeta } from "@/lib/seo";

const program = programs.veterans;

export const metadata = pageMeta(
  "Veteran community outreach grooming in Philly",
  "Trauma-informed grooming and job-readiness cuts for veteran community outreach in Philly. VA and SSVF coordinators can request a housing-transition visit from Buzz Boxx PXV.",
  program.path,
);

export default function VeteransPage() {
  return <ProgramView {...program} bookHref={`/book?demographic=${program.bookDemographic}`} />;
}
