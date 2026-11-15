"use client";

import Image from "next/image";
import { InstagramEmbed, InstagramScript } from "@/components/InstagramEmbed";
import { gallery as fallbackGallery } from "@/content/gallery";
import { buzzBoxxInstagramPosts } from "@/src/data/instagram";

export function GalleryMasonry({
  photos = fallbackGallery.map((photo) => ({ ...photo, instagramUrl: "" })),
}: {
  photos?: { src: string; alt: string; width: number; height: number; instagramUrl?: string }[];
}) {
  const gallery = photos;
  const items: Array<{ key: string; kind: "post" | "photo"; index: number }> = [];
  const count = Math.max(gallery.length, buzzBoxxInstagramPosts.length);
  for (let index = 0; index < count; index += 1) {
    if (buzzBoxxInstagramPosts[index]) items.push({ key: buzzBoxxInstagramPosts[index], kind: "post", index });
    if (gallery[index]) items.push({ key: gallery[index].src, kind: "photo", index });
  }

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {items.map((item) => {
          if (item.kind === "post") {
            const url = buzzBoxxInstagramPosts[item.index];
            return (
              <div key={item.key} className="mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-white/10 bg-card">
                <InstagramEmbed url={url} />
              </div>
            );
          }
          const photo = gallery[item.index];
          return (
            <div key={item.key} className="mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-white/10 bg-card">
              <div className="relative aspect-[3/4]">
                {photo.src.startsWith("/") ? (
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photo.src} alt={photo.alt} className="h-full w-full object-cover" />
                )}
              </div>
            </div>
          );
        })}
      </div>
      <InstagramScript />
    </>
  );
}
