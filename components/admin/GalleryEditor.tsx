"use client";

import { useState } from "react";
import { AdminForm } from "@/components/admin/Form";
import { AdminCheck, AdminCheckRow, AdminField, AdminFields } from "@/components/admin/fields";
import { saveGalleryItem } from "@/lib/admin/actions";
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
    <AdminForm action={saveGalleryItem}>
      {item ? <input type="hidden" name="id" value={item.id} /> : null}
      <input type="hidden" name="image_url" value={imageUrl} />
      <label className="block text-xs text-muted">
        Image file
        <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="mt-1" onChange={(event) => onFile(event.target.files?.[0])} />
      </label>
      <AdminField label="Image or Instagram URL" name="image_url_visible" value={imageUrl} onValue={setImageUrl} />
      <AdminField label="Alt text" name="alt" defaultValue={item?.alt ?? ""} />
      <AdminField label="Instagram URL" name="instagram_url" defaultValue={item?.instagram_url ?? ""} />
      <AdminFields>
        <AdminField label="Width" name="width" width="narrow" defaultValue={item?.width ?? 1200} />
        <AdminField label="Height" name="height" width="narrow" defaultValue={item?.height ?? 1500} />
        <AdminField label="Sort order" name="sort_order" width="narrow" defaultValue={item?.sort_order ?? 0} />
      </AdminFields>
      <AdminCheckRow>
        <AdminCheck name="published" label="Published" defaultChecked={item?.published ?? true} />
      </AdminCheckRow>
      {uploadNote ? <p className="text-xs text-muted">{uploadNote}</p> : null}
    </AdminForm>
  );
}
