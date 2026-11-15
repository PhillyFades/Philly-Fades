import { Suspense } from "react";
import { GalleryEditor } from "@/components/admin/GalleryEditor";
import { AdminTitle, Warning } from "@/components/admin/ui";
import { loadGallery } from "@/lib/admin/data";

export default function GalleryAdminPage() {
  return (
    <Suspense fallback={<p className="text-muted">Loading the gallery…</p>}>
      <GalleryAdmin />
    </Suspense>
  );
}

async function GalleryAdmin() {
  const { rows, warning } = await loadGallery();
  return (
    <>
      <AdminTitle title="Gallery" lede="Uploads go to the public site-media bucket. A pasted URL works without a file." />
      <Warning message={warning} />
      <div className="space-y-6">
        {rows.map((item) => (
          <GalleryEditor key={item.id} item={item} />
        ))}
      </div>
      <h2 className="mb-4 mt-12 font-display text-2xl leading-none">Add an item</h2>
      <GalleryEditor />
    </>
  );
}
