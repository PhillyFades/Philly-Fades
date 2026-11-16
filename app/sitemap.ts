import type { MetadataRoute } from "next";
import { siteUrl } from "@/content/site";

const paths = [
  "/",
  "/memberships",
  "/memberships/request",
  "/events",
  "/book",
  "/about",
  "/gallery",
  "/seniors-homebound",
  "/special-needs-sensory",
  "/veterans-outreach",
  "/unhoused-dignity",
  "/youth-mentorship",
  "/programs",
  "/request",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: "2026-11-15",
  }));
}
