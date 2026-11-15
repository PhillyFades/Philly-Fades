import { ProgramView } from "@/components/ProgramView";
import { programs } from "@/content/programs";
import { pageMeta } from "@/lib/seo";

const program = programs.seniors;

export const metadata = pageMeta(
  "Homebound senior grooming in Pennsylvania",
  "Homebound senior grooming in PA from a mobile barber. Caregiver scheduling, hospital-grade sanitation, and fewer trips that raise fall risk. Dispatched from Barbers on Broad in Philadelphia.",
  program.path,
);

export default function SeniorsPage() {
  return <ProgramView {...program} bookHref={`/book?demographic=${program.bookDemographic}`} />;
}
