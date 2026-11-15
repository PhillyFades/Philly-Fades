import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getPublicCatalog } from "@/lib/cms";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const catalog = await getPublicCatalog();
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-sun focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">{children}</main>
      <Footer settings={catalog.settings} />
    </>
  );
}
