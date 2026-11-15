import { Suspense } from "react";
import { AdminForm } from "@/components/admin/Form";
import { AdminTitle, Warning } from "@/components/admin/ui";
import { deleteEvent, saveEvent } from "@/lib/admin/actions";
import { loadSiteEvents } from "@/lib/admin/data";

export default function EventsAdminPage() {
  return (
    <Suspense fallback={<p className="text-muted">Loading events…</p>}>
      <EventsAdmin />
    </Suspense>
  );
}

async function EventsAdmin() {
  const { rows, warning } = await loadSiteEvents();
  return (
    <>
      <AdminTitle title="Events" lede="Past and upcoming days. An empty upcoming list keeps the public “new dates soon” line." />
      <Warning message={warning} />
      <div className="space-y-6">
        {rows.map((item) => (
          <article key={item.id} className="rounded-2xl border border-white/10 bg-card p-5">
            <AdminForm action={saveEvent}>
              <input type="hidden" name="id" value={item.id} />
              <EventFields item={item} />
            </AdminForm>
            <div className="mt-3">
              <AdminForm action={deleteEvent} confirmText="Delete this event?" submitLabel="Delete">
                <input type="hidden" name="id" value={item.id} />
              </AdminForm>
            </div>
          </article>
        ))}
      </div>
      <h2 className="mb-4 mt-12 font-display text-2xl leading-none">New event</h2>
      <div className="max-w-xl rounded-2xl border border-white/10 p-5">
        <AdminForm action={saveEvent} submitLabel="Add event">
          <EventFields />
        </AdminForm>
      </div>
    </>
  );
}

function EventFields({
  item,
}: {
  item?: {
    title: string;
    event_date: string;
    location: string;
    description: string;
    instagram_url: string;
    image_url: string;
    kind: string;
    published: boolean;
    sort_order: number;
  };
}) {
  return (
    <>
      <label className="block text-sm">
        Title
        <input name="title" defaultValue={item?.title ?? ""} required className="mt-2" />
      </label>
      <label className="block text-sm">
        Date
        <input name="event_date" defaultValue={item?.event_date ?? ""} className="mt-2" />
      </label>
      <label className="block text-sm">
        Location
        <input name="location" defaultValue={item?.location ?? ""} className="mt-2" />
      </label>
      <label className="block text-sm">
        Description
        <textarea name="description" rows={4} defaultValue={item?.description ?? ""} className="mt-2" />
      </label>
      <label className="block text-sm">
        Instagram link
        <input name="instagram_url" defaultValue={item?.instagram_url ?? ""} className="mt-2" />
      </label>
      <label className="block text-sm">
        Image URL
        <input name="image_url" defaultValue={item?.image_url ?? ""} className="mt-2" />
      </label>
      <label className="block text-sm">
        Kind
        <select name="kind" defaultValue={item?.kind ?? "past"} className="mt-2">
          <option value="past">Past</option>
          <option value="upcoming">Upcoming</option>
        </select>
      </label>
      <label className="block text-sm">
        Sort order
        <input name="sort_order" defaultValue={String(item?.sort_order ?? 0)} className="mt-2" />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="published" defaultChecked={item?.published ?? true} /> Published
      </label>
    </>
  );
}
