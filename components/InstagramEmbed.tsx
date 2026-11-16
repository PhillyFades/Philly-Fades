"use client";

import { useEffect, useRef, useState } from "react";

/** Direct embed URL for a post or reel. Reels use /reel/<code>/embed/; posts use /p/<code>/embed/. */
export function instagramEmbedSrc(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  const host = parsed.hostname.replace(/^www\./, "");
  if (host !== "instagram.com") return null;
  const parts = parsed.pathname.split("/").filter(Boolean);
  const reelAt = parts.lastIndexOf("reel");
  const postAt = parts.lastIndexOf("p");
  const at = reelAt > postAt ? reelAt : postAt;
  const code = at >= 0 ? parts[at + 1] : "";
  if (!code) return null;
  const shortcode = code.replace(/[^A-Za-z0-9_-]/g, "");
  if (!shortcode) return null;
  const kind = parts[at] === "reel" ? "reel" : "p";
  return `https://www.instagram.com/${kind}/${shortcode}/embed/`;
}

function InstagramMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8 text-gold">
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4.1" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" />
    </svg>
  );
}

export function InstagramFallback({ url, caption }: { url: string; caption?: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="flex aspect-[3/4] w-full flex-col justify-between bg-ink p-6 hover:bg-[#141414]"
    >
      <InstagramMark />
      <div>
        <p className="text-[11px] uppercase tracking-[0.22em] text-gold">Instagram</p>
        <p className="mt-3 line-clamp-3 font-display text-2xl leading-[0.95] text-white">
          {caption?.trim() || "View this post"}
        </p>
        <p className="mt-4 text-sm font-medium text-sun">View on Instagram</p>
      </div>
    </a>
  );
}

export function InstagramEmbed({ url, caption }: { url: string; caption?: string }) {
  const src = instagramEmbedSrc(url);
  const frame = useRef<HTMLIFrameElement>(null);
  const loaded = useRef(false);
  const [failed, setFailed] = useState(src == null);

  useEffect(() => {
    const node = frame.current;
    if (!node || !src) return;
    let timer = 0;
    const markLoaded = () => {
      loaded.current = true;
      window.clearTimeout(timer);
    };
    node.addEventListener("load", markLoaded);
    const observer = new IntersectionObserver(
      (entries) => {
        if (timer || loaded.current || !entries.some((entry) => entry.isIntersecting)) return;
        timer = window.setTimeout(() => {
          if (!loaded.current) setFailed(true);
        }, 12000);
      },
      { rootMargin: "240px" },
    );
    observer.observe(node);
    return () => {
      node.removeEventListener("load", markLoaded);
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, [src]);

  if (failed || !src) return <InstagramFallback url={url} caption={caption} />;

  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden bg-ink">
      <iframe
        ref={frame}
        src={src}
        title={caption?.trim() || "Instagram post"}
        loading="lazy"
        className="absolute inset-0 h-full w-full border-0 bg-ink"
        referrerPolicy="strict-origin-when-cross-origin"
        allow="encrypted-media; picture-in-picture; web-share"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
