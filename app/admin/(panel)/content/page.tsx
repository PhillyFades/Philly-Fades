import Link from "next/link";
import { AdminTitle } from "@/components/admin/ui";

const sections = [
  ["Plans", "/admin/content/plans", "Names, prices, features, and which plans are on the site."],
  ["Events", "/admin/content/events", "Past and upcoming days, with an Instagram link and image."],
  ["Gallery", "/admin/content/gallery", "Upload to site-media, or paste an image or Instagram URL."],
  ["Copy", "/admin/content/copy", "Hero lines and the intros on home, about, programs, and events."],
  ["Settings", "/admin/content/settings", "Phone, email, social links, the in-shop chair, and the house-call fee."],
];

export default function ContentPage() {
  return (
    <>
      <AdminTitle title="Content" lede="Edits publish to the public pages. If the tables are not there yet, the site keeps the current copy." />
      <div className="grid gap-4 md:grid-cols-2">
        {sections.map(([title, href, body]) => (
          <Link key={href} href={href} className="rounded-xl border border-white/10 bg-card p-3 hover:border-sun/50">
            <h2 className="font-display text-xl leading-none">{title}</h2>
            <p className="mt-1.5 text-sm leading-5 text-muted">{body}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
