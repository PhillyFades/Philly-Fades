"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

type InstagramWindow = Window & {
  instgrm?: { Embeds: { process: () => void } };
};

function permalink(url: string) {
  return url.endsWith("/") ? url : `${url}/`;
}

export function InstagramFallback({ url }: { url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="flex min-h-64 flex-col justify-end rounded-2xl border border-white/10 bg-card p-5 hover:border-gold/70"
    >
      <p className="text-[11px] uppercase tracking-[0.2em] text-gold">Instagram</p>
      <p className="mt-3 font-display text-2xl leading-none text-white">View this post</p>
      <p className="mt-2 text-sm text-muted">@buzzboxxpxv</p>
    </a>
  );
}

export function InstagramEmbed({ url }: { url: string }) {
  const [fallback, setFallback] = useState(false);
  const href = permalink(url);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const frame = document.querySelector(`blockquote[data-instgrm-permalink="${href}"]`);
      const rendered = frame?.parentElement?.querySelector("iframe");
      if (!rendered) setFallback(true);
    }, 6000);
    return () => window.clearTimeout(timer);
  }, [href]);

  if (fallback) return <InstagramFallback url={href} />;

  return (
    <blockquote
      className="instagram-media"
      data-instgrm-permalink={href}
      data-instgrm-version="14"
    >
      <a href={href} target="_blank" rel="noreferrer">
        View this post on Instagram
      </a>
    </blockquote>
  );
}

export function InstagramScript() {
  return (
    <Script
      src="https://www.instagram.com/embed.js"
      strategy="lazyOnload"
      onLoad={() => {
        (window as InstagramWindow).instgrm?.Embeds.process();
      }}
    />
  );
}
