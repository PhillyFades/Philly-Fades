import { site, siteUrl } from "@/content/site";

export function JsonLd() {
  const url = siteUrl();
  const data = {
    "@context": "https://schema.org",
    "@type": "BarberShop",
    name: site.name,
    legalName: site.legalName,
    alternateName: ["Philly Fades", "Buzz Boxx PXV"],
    description:
      "Premium traveling barber and mobile house-call haircuts for Philadelphia, Montgomery, and Chester Counties. Officially dispatched from Barbers on Broad at 1220 N Broad St Ste 3, Philadelphia, PA 19121. Sensory-safe haircuts, homebound senior grooming, adaptive barber services, and veteran community outreach by Mike Webb Jr.",
    url,
    image: `${url}/images/mike-work-06.webp`,
    sameAs: [site.instagramUrl],
    areaServed: [
      { "@type": "AdministrativeArea", name: "Philadelphia County, Pennsylvania" },
      { "@type": "AdministrativeArea", name: "Montgomery County, Pennsylvania" },
      { "@type": "AdministrativeArea", name: "Chester County, Pennsylvania" },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "1220 N Broad St Ste 3",
      addressLocality: "Philadelphia",
      addressRegion: "PA",
      postalCode: "19121",
      addressCountry: "US",
    },
    location: {
      "@type": "Place",
      name: "Dispatched via Barbers on Broad",
      address: {
        "@type": "PostalAddress",
        streetAddress: "1220 N Broad St Ste 3",
        addressLocality: "Philadelphia",
        addressRegion: "PA",
        postalCode: "19121",
        addressCountry: "US",
      },
    },
    employee: {
      "@type": "Person",
      name: site.barber,
      jobTitle: "Owner and barber",
    },
    knowsAbout: [
      "Philadelphia barber",
      "mobile barber",
      "house call haircuts",
      "sensory-safe haircuts Philadelphia",
      "homebound senior grooming PA",
      "adaptive barber services",
      "veteran community outreach Philly",
      "special needs mobile barber",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
