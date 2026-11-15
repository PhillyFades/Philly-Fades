import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Space_Grotesk } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { site, siteUrl, van } from "@/content/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "Buzz Boxx PXV | Traveling barber for house call haircuts in Philadelphia",
    template: "%s | Buzz Boxx PXV",
  },
  description:
    "Buzz Boxx PXV is Mike Webb Jr.’s premium mobile barber service. House call haircuts across Philadelphia, Montgomery, and Chester Counties, dispatched from Barbers on Broad.",
  openGraph: {
    siteName: site.name,
    images: [
      {
        url: van.src,
        width: van.width,
        height: van.height,
        alt: van.alt,
      },
    ],
  },
  icons: { icon: "/images/logo-gold.png" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${display.variable} h-full antialiased`}>
      <body className="min-h-full bg-ink font-sans text-lg leading-[1.6] text-white">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-sun focus:px-4 focus:py-2 focus:text-ink"
        >
          Skip to content
        </a>
        <Header />
        <JsonLd />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
