"use client";

import { useState } from "react";
import { AdminForm } from "@/components/admin/Form";
import { deleteGalleryItem, saveGalleryItem } from "@/lib/admin/actions";
import { createSupabaseBrowser } from "@/lib/supabase/browser";

export function GalleryEditor({
  item,
}: {
  item?: {
    id: string;
    image_url: string;
    alt: string;
    instagram_url: string;
    width: number;
    height: number;
    published: boolean;
    sort_order: number;
  };
}) {
  const [imageUrl, setImageUrl] = useState(item?.image_url ?? "");
  const [uploadNote, setUploadNote] = useState<string | null>(null);

  async function onFile(file: File | undefined) {
    if (!file) return;
    const supabase = createSupabaseBrowser();
    if (!supabase) {
      setUploadNote("Upload needs Supabase. Paste an image URL instead.");
      return;
    }
    const path = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.]+/g, "-")}`;
    const { error } = await supabase.storage.from("site-media").upload(path, file, { upsert: false });
    if (error) {
      setUploadNote(error.message);
      return;
    }
    const { data } = supabase.storage.from("site-media").getPublicUrl(path);
    setImageUrl(data.publicUrl);
    setUploadNote("Uploaded. Save the item to publish it.");
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-card p-5">
      <AdminForm action={saveGalleryItem}>
        {item ? <input type="hidden" name="id" value={item.id} /> : null}
        <input type="hidden" name="image_url" value={imageUrl} />
        <label className="block text-sm">
          Image file
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="mt-2" onChange={(event) => onFile(event.target.files?.[0])} />
        </label>
        <label className="block text-sm">
          Image or Instagram URL
          <input name="image_url_visible" value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} className="mt-2" />
        </label>
        <label className="block text-sm">
          Alt text
          <input name="alt" defaultValue={item?.alt ?? ""} className="mt-2" />
        </label>
        <label className="block text-sm">
          Instagram URL
          <input name="instagram_url" defaultValue={item?.instagram_url ?? ""} className="mt-2" />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-sm">
            Width
            <input name="width" defaultValue={String(item?.width ?? 1200)} className="mt-2" />
          </label>
          <label className="block text-sm">
            Height
            <input name="height" defaultValue={String(item?.height ?? 1500)} className="mt-2" />
          </label>
        </div>
        <label className="block text-sm">
          Sort order
          <input name="sort_order" defaultValue={String(item?.sort_order ?? 0)} className="mt-2" />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" defaultChecked={item?.published ?? true} /> Published
        </label>
        {uploadNote ? <p className="text-sm text-muted">{uploadNote}</p> : null}
      </AdminForm>
      {item ? (
        <div className="mt-3">
          <AdminForm action={deleteGalleryItem} confirmText="Remove this gallery item?" submitLabel="Delete">
            <input type="hidden" name="id" value={item.id} />
          </AdminForm>
        </div>
      ) : null}
    </div>
  );
}
