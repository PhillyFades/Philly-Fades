import { ProgramView } from "@/components/ProgramView";
import { programs } from "@/content/programs";
import { pageMeta } from "@/lib/seo";

const program = programs.youth;

export const metadata = pageMeta(
  "Youth mentorship haircuts",
  "Back-to-school and rec center haircuts with Mike Webb Jr. in Philadelphia. Schools and youth programs can request a mentorship block from Buzz Boxx PXV.",
  program.path,
);

export default function YouthPage() {
  return <ProgramView {...program} bookHref={`/book?demographic=${program.bookDemographic}`} />;
}
