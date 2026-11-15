import { GalleryMasonry } from "@/components/GalleryMasonry";
import { Button, Container, Gold, PageHero } from "@/components/ui";
import { getPublicCatalog } from "@/lib/cms";
import { buzzBoxxInstagram } from "@/src/data/instagram";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Mike Webb Jr. haircut gallery",
  "Haircuts by Philadelphia barber Mike Webb Jr. of Buzz Boxx PXV, plus posts from @buzzboxxpxv. Fades, beards, the van, and community cuts.",
  "/gallery",
);

export default async function GalleryPage() {
  const catalog = await getPublicCatalog();
  return (
    <>
      <PageHero eyebrow="Gallery" title={<>The chair and the <Gold>van</Gold>.</>}>
        Portfolio cuts from Mike Webb Jr., mixed with posts from @buzzboxxpxv. Tap a post to open it on Instagram.
      </PageHero>
      <section className="py-16">
        <Container>
          <div className="mb-8">
            <Button href={buzzBoxxInstagram} external>
              Follow @buzzboxxpxv on Instagram
            </Button>
          </div>
          <GalleryMasonry photos={catalog.gallery} />
        </Container>
      </section>
    </>
  );
}
