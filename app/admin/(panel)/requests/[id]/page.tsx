import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AdminForm } from "@/components/admin/Form";
import { AdminTitle } from "@/components/admin/ui";
import { addSlot, deleteSlot, saveRequest } from "@/lib/admin/actions";
import { loadRequest } from "@/lib/admin/data";

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
      <Link href="/admin/requests" className="text-sm text-sun hover:underline">
        All requests
      </Link>
      <AdminTitle title={row.organization || row.contact_name} lede={`${row.package_name} · ${row.event_location}`} />
      <p className="max-w-2xl text-sm leading-6 text-muted">{row.notes}</p>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-card p-5">
          <AdminForm action={saveRequest}>
            <input type="hidden" name="id" value={row.id} />
            <label className="block text-sm">
              Status
              <select name="status" defaultValue={row.status} className="mt-2">
                {["requested", "reviewing", "scheduled", "confirmed", "declined", "completed", "cancelled"].map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              Quote amount (dollars)
              <input name="quote" inputMode="decimal" defaultValue={row.quote_cents == null ? "" : String(row.quote_cents / 100)} className="mt-2" />
            </label>
            <label className="block text-sm">
              Notes
              <textarea name="admin_notes" rows={4} defaultValue={row.admin_notes || ""} className="mt-2" />
            </label>
          </AdminForm>
        </div>
        <div className="rounded-2xl border border-white/10 bg-card p-5">
          <h2 className="font-display text-2xl leading-none">4-hour slots</h2>
          <ul className="mt-4 space-y-3">
            {(row.slots ?? []).map((slot) => (
              <li key={slot.id} className="flex items-center justify-between gap-3 text-sm">
                <span>
                  {slot.slot_date} · {slot.start_time}–{slot.end_time}
                </span>
                <AdminForm action={deleteSlot} confirmText="Remove this slot?" submitLabel="Remove">
                  <input type="hidden" name="id" value={slot.id} />
                  <input type="hidden" name="inquiry_id" value={row.id} />
                </AdminForm>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <AdminForm action={addSlot} submitLabel="Add slot">
              <input type="hidden" name="inquiry_id" value={row.id} />
              <label className="block text-sm">
                Date
                <input type="date" name="slot_date" required className="mt-2" />
              </label>
              <label className="block text-sm">
                Start
                <input type="time" name="start_time" required className="mt-2" />
              </label>
              <p className="text-sm text-muted">The end time is four hours later.</p>
            </AdminForm>
          </div>
        </div>
      </div>
    </>
  );
}
