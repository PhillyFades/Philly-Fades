import { ProgramView } from "@/components/ProgramView";
import { programs } from "@/content/programs";
import { pageMeta } from "@/lib/seo";

const program = programs.sensory;

export const metadata = pageMeta(
  "Sensory-safe haircuts in Philadelphia",
  "Special needs mobile barber and sensory-safe haircuts in Philadelphia. Quiet clippers, visual schedules, patience-first visits at home, and adaptive barber services from Mike Webb Jr.",
  program.path,
);

export default function SensoryPage() {
  return <ProgramView {...program} bookHref={`/book?demographic=${program.bookDemographic}`} />;
}
