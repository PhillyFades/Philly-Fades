import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AdminForm } from "@/components/admin/Form";
import { EditDrawer } from "@/components/admin/drawer";
import { AdminField, AdminFields, PageHeading, ReadOnlyField, ReadOnlyGrid, RecordCard } from "@/components/admin/fields";
import { StatusBadge } from "@/components/admin/ui";
import { addSlot, deleteSlot, saveRequest } from "@/lib/admin/actions";
import { loadRequest } from "@/lib/admin/data";

const statuses = ["requested", "reviewing", "scheduled", "confirmed", "declined", "completed", "cancelled"];

export default function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<p className="text-muted">Loading the request…</p>}>
      <Detail params={params} />
    </Suspense>
  );
}

async function Detail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await loadRequest(id);
  if (!row) notFound();
  return (
    <>
      <Link href="/admin/requests" className="text-xs text-sun hover:underline">
        All requests
      </Link>
      <PageHeading
        title={row.organization || row.contact_name}
        lede={row.package_name}
        action={
          <div className="flex items-center gap-2">
            <EditDrawer title="Edit request">
              <AdminForm action={saveRequest}>
                <input type="hidden" name="id" value={row.id} />
                <AdminFields>
                  <AdminField
                    label="Status"
                    name="status"
                    width="narrow"
                    defaultValue={row.status}
                    options={statuses.map((value) => ({ value, label: value }))}
                  />
                  <AdminField
                    label="Quote"
                    name="quote"
                    width="narrow"
                    inputMode="decimal"
                    defaultValue={row.quote_cents == null ? "" : row.quote_cents / 100}
                  />
                  <AdminField label="Notes" name="admin_notes" defaultValue={row.admin_notes || ""} rows={3} span={3} />
                </AdminFields>
              </AdminForm>
            </EditDrawer>
            <EditDrawer title="Add a 4-hour slot" trigger="+ Slot" tone="primary">
              <AdminForm action={addSlot} submitLabel="Add slot">
                <input type="hidden" name="inquiry_id" value={row.id} />
                <AdminFields>
                  <AdminField label="Date" name="slot_date" type="date" width="narrow" required />
                  <AdminField label="Start" name="start_time" type="time" width="narrow" required />
                </AdminFields>
                <p className="text-xs text-muted">The end time is four hours later.</p>
              </AdminForm>
            </EditDrawer>
          </div>
        }
      />
      <ReadOnlyGrid>
        <ReadOnlyField label="Status" value={<StatusBadge status={row.status} />} />
        <ReadOnlyField label="Contact" value={row.contact_name} />
        <ReadOnlyField label="Email" value={row.email} />
        <ReadOnlyField label="Phone" value={row.phone} />
        <ReadOnlyField label="Date" value={row.event_date} />
        <ReadOnlyField label="Guests" value={row.guest_count} />
        <ReadOnlyField label="Quote" value={row.quote_cents == null ? "—" : `$${Math.round(row.quote_cents / 100)}`} />
        <ReadOnlyField label="Location type" value={row.location_type} />
        <ReadOnlyField label="Location" value={row.event_location} wide />
        <ReadOnlyField label="Notes" value={row.notes} wide />
        <ReadOnlyField label="Admin notes" value={row.admin_notes} wide />
      </ReadOnlyGrid>
      <h2 className="mb-2 mt-6 font-display text-xl leading-none">4-hour slots</h2>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {(row.slots ?? []).length ? (
          row.slots.map((slot) => (
            <RecordCard key={slot.id}>
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm text-white">
                  {slot.slot_date} · {String(slot.start_time).slice(0, 5)}–{String(slot.end_time).slice(0, 5)}
                </p>
                <AdminForm action={deleteSlot} confirmText="Remove this slot?" submitLabel="Delete" tone="danger" compact>
                  <input type="hidden" name="id" value={slot.id} />
                  <input type="hidden" name="inquiry_id" value={row.id} />
                </AdminForm>
              </div>
            </RecordCard>
          ))
        ) : (
          <p className="text-sm text-muted">No slots yet.</p>
        )}
      </div>
    </>
  );
}
