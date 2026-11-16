import { Suspense } from "react";
import { AdminForm } from "@/components/admin/Form";
import { GalleryEditor } from "@/components/admin/GalleryEditor";
import { EditDrawer } from "@/components/admin/drawer";
import { Badge, PageHeading, RecordCard, RecordGrid } from "@/components/admin/fields";
import { Warning } from "@/components/admin/ui";
import { deleteGalleryItem } from "@/lib/admin/actions";
import { loadGallery, type GalleryRow } from "@/lib/admin/data";

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
      <PageHeading
        title="Gallery"
        lede="Uploads go to the public site-media bucket. A pasted URL works without a file."
        action={
          <EditDrawer title="New gallery item" trigger="+ New item" tone="primary">
            <GalleryEditor />
          </EditDrawer>
        }
      />
      <Warning message={warning} />
      <RecordGrid>
        {rows.map((item) => (
          <GalleryCard key={item.id} item={item} />
        ))}
      </RecordGrid>
    </>
  );
}

function GalleryCard({ item }: { item: GalleryRow }) {
  const showImage = item.image_url.startsWith("/") || item.image_url.startsWith("http");
  return (
    <RecordCard>
      <div className="flex items-start gap-3">
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image_url} alt="" className="h-16 w-12 shrink-0 rounded-md object-cover" />
        ) : null}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h2 className="truncate font-display text-lg leading-none">{item.alt || "Untitled"}</h2>
            <div className="flex shrink-0 items-center gap-2">
              <EditDrawer title="Edit gallery item">
                <GalleryEditor item={item} />
              </EditDrawer>
              <AdminForm action={deleteGalleryItem} confirmText="Remove this gallery item?" submitLabel="Delete" tone="danger" compact>
                <input type="hidden" name="id" value={item.id} />
              </AdminForm>
            </div>
          </div>
          {item.instagram_url ? <p className="mt-1 truncate text-xs text-muted">{item.instagram_url}</p> : null}
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Badge tone={item.published ? "sun" : "muted"}>{item.published ? "Published" : "Hidden"}</Badge>
            <Badge tone="muted">Sort {item.sort_order}</Badge>
          </div>
        </div>
      </div>
    </RecordCard>
  );
}
