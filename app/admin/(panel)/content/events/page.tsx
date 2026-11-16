import { Suspense } from "react";
import { AdminForm } from "@/components/admin/Form";
import { EditDrawer } from "@/components/admin/drawer";
import { AdminCheck, AdminCheckRow, AdminField, AdminFields, Badge, PageHeading, RecordCard, RecordGrid } from "@/components/admin/fields";
import { Warning } from "@/components/admin/ui";
import { deleteEvent, saveEvent } from "@/lib/admin/actions";
import { loadSiteEvents, type EventRow } from "@/lib/admin/data";

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
      <PageHeading
        title="Events"
        lede="Past and upcoming days. An empty upcoming list keeps the public “new dates soon” line."
        action={
          <EditDrawer title="New event" trigger="+ New event" tone="primary">
            <EventForm />
          </EditDrawer>
        }
      />
      <Warning message={warning} />
      <RecordGrid>
        {rows.map((item) => (
          <RecordCard key={item.id}>
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-display text-xl leading-none">{item.title}</h2>
              <div className="flex shrink-0 items-center gap-2">
                <EditDrawer title={`Edit ${item.title}`}>
                  <EventForm item={item} />
                </EditDrawer>
                <AdminForm action={deleteEvent} confirmText="Delete this event?" submitLabel="Delete" tone="danger" compact>
                  <input type="hidden" name="id" value={item.id} />
                </AdminForm>
              </div>
            </div>
            <p className="mt-2 text-sm text-white">{item.event_date || "Date not set"}</p>
            {item.location ? <p className="mt-1 line-clamp-1 text-sm text-muted">{item.location}</p> : null}
            <p className="mt-1 line-clamp-2 text-sm leading-5 text-muted">{item.description}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Badge tone={item.kind === "upcoming" ? "sun" : "gold"}>{item.kind}</Badge>
              <Badge tone={item.published ? "sun" : "muted"}>{item.published ? "Published" : "Hidden"}</Badge>
              <Badge tone="muted">Sort {item.sort_order}</Badge>
            </div>
          </RecordCard>
        ))}
      </RecordGrid>
    </>
  );
}

function EventForm({ item }: { item?: EventRow }) {
  return (
    <AdminForm action={saveEvent}>
      {item ? <input type="hidden" name="id" value={item.id} /> : null}
      <AdminField label="Title" name="title" defaultValue={item?.title} required />
      <AdminFields>
        <AdminField label="Date" name="event_date" defaultValue={item?.event_date} />
        <AdminField
          label="Kind"
          name="kind"
          width="narrow"
          defaultValue={item?.kind ?? "past"}
          options={[
            { value: "past", label: "Past" },
            { value: "upcoming", label: "Upcoming" },
          ]}
        />
        <AdminField label="Sort order" name="sort_order" width="narrow" defaultValue={item?.sort_order ?? 0} />
        <AdminField label="Location" name="location" defaultValue={item?.location} span={3} />
      </AdminFields>
      <AdminField label="Description" name="description" defaultValue={item?.description} rows={3} />
      <AdminField label="Instagram link" name="instagram_url" defaultValue={item?.instagram_url} />
      <AdminField label="Image URL" name="image_url" defaultValue={item?.image_url} />
      <AdminCheckRow>
        <AdminCheck name="published" label="Published" defaultChecked={item?.published ?? true} />
      </AdminCheckRow>
    </AdminForm>
  );
}
