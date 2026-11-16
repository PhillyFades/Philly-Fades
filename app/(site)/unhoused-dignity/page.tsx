import { ProgramView } from "@/components/ProgramView";
import { programs } from "@/content/programs";
import { pageMeta } from "@/lib/seo";

const program = programs.unhoused;

export const metadata = pageMeta(
  "Dignity cuts for unhoused neighbors",
  "Mobile barber pop-ups at Philadelphia shelters, food pantries, and behavioral health centers. Sponsor a Cut or request a site visit from Mike Webb Jr., dispatched from Barbers on Broad.",
  program.path,
);

export default function UnhousedPage() {
  return <ProgramView {...program} bookHref={`/book?demographic=${program.bookDemographic}`} />;
}
