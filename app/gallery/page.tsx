import Image from "next/image";
import { Container, Gold, PageHero } from "@/components/ui";
import { gallery } from "@/content/gallery";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Mike Webb Jr. haircut gallery",
  "Haircuts by Philadelphia barber Mike Webb Jr. of Buzz Boxx PXV. Fades, beards, and lineups from the traveling chair and the North Broad Street host shop.",
  "/gallery",
);

export default function GalleryPage() {
  return (
    <>
      <PageHero eyebrow="Gallery" title={<>Only <Gold>Mike’s</Gold> work.</>}>
        Cuts from his portfolio. Fades, beards, and texture. This is the finish a house call is booked to match.
      </PageHero>
      <section className="py-16">
        <Container>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((photo) => (
              <li key={photo.src} className="overflow-hidden rounded-2xl border border-white/10 bg-card">
                <div className="relative aspect-[3/4]">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
