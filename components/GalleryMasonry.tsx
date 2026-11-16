"use client";

import Image from "next/image";
import { InstagramEmbed, instagramEmbedSrc } from "@/components/InstagramEmbed";
import { gallery as fallbackGallery } from "@/content/gallery";
import { buzzBoxxInstagramPosts } from "@/src/data/instagram";

type Photo = { src: string; alt: string; width: number; height: number; instagramUrl?: string };

type Cell =
  | { key: string; kind: "post"; url: string; caption: string }
  | { key: string; kind: "photo"; src: string; alt: string };

function postKey(url: string) {
  return url.replace(/\/+$/, "").split("?")[0].toLowerCase();
}

export function GalleryMasonry({
  photos = fallbackGallery.map((photo) => ({ ...photo, instagramUrl: "" })),
}: {
  photos?: Photo[];
}) {
  const seen = new Set<string>();
  const posts: Cell[] = [];

  const addPost = (url: string, caption: string) => {
    if (!instagramEmbedSrc(url)) return;
    const key = postKey(url);
    if (seen.has(key)) return;
    seen.add(key);
    posts.push({ key, kind: "post", url, caption });
  };

  for (const photo of photos) {
    const fromField = photo.instagramUrl?.trim() ?? "";
    const fromSrc = instagramEmbedSrc(photo.src) ? photo.src : "";
    addPost(fromField || fromSrc, photo.alt);
  }
  for (const url of buzzBoxxInstagramPosts) addPost(url, "From @buzzboxxpxv");

  const pictures: Cell[] = photos
    .filter((photo) => photo.src && !instagramEmbedSrc(photo.src) && !instagramEmbedSrc(photo.instagramUrl ?? ""))
    .map((photo) => ({ key: photo.src, kind: "photo", src: photo.src, alt: photo.alt }));

  const items: Cell[] = [];
  const count = Math.max(posts.length, pictures.length);
  for (let index = 0; index < count; index += 1) {
    if (posts[index]) items.push(posts[index]);
    if (pictures[index]) items.push(pictures[index]);
  }

  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
      {items.map((item) => {
        if (item.kind === "post") {
          return (
            <div key={item.key} className="mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-white/10 bg-ink">
              <InstagramEmbed url={item.url} caption={item.caption} />
            </div>
          );
        }
        return (
          <div key={item.key} className="mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-white/10 bg-card">
            <div className="relative aspect-[3/4]">
              {item.src.startsWith("/") ? (
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.src} alt={item.alt} className="h-full w-full object-cover" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
