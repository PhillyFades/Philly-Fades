import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AdminForm } from "@/components/admin/Form";
import { AdminTitle } from "@/components/admin/ui";
import { saveBooking } from "@/lib/admin/actions";
import { loadBooking, type BookingRow } from "@/lib/admin/data";

const labels: Record<string, string> = {
  client_name: "Name",
  client_phone: "Phone",
  client_email: "Email",
  requested_date: "Requested date",
  requested_time: "Requested time",
  scheduled_date: "Scheduled date",
  scheduled_time: "Scheduled time",
  service_address: "Address",
  address_line1: "Street",
  address_line2: "Apt, suite, or unit",
  city: "City",
  state: "State",
  zip: "ZIP",
  service_county: "County",
  demographic_category: "Who the cut is for",
  fee_plan: "Plan",
  fee_cents: "Fee cents",
  status: "Status",
  eligibility_confirmed: "Eligibility confirmed",
  eligibility_basis: "Eligibility",
  booking_on_behalf: "Booked on behalf",
  referrer_name: "Referrer",
  referrer_organization: "Referrer organization",
  referrer_role: "Referrer role",
  referrer_contact: "Referrer contact",
  payment_method: "Payment",
  notes: "Notes",
  internal_notes: "Internal notes",
  is_veteran: "Veteran",
  has_disability: "Disability",
  dispatched_from: "Dispatched from",
  barber_name: "Barber",
  created_at: "Logged",
};

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<p className="text-muted">Loading the visit…</p>}>
      <Detail params={params} />
    </Suspense>
  );
}

async function Detail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await loadBooking(id);
  if (!row) notFound();
  return (
    <>
      <Link href="/admin/bookings" className="text-sm text-sun hover:underline">
        All bookings
      </Link>
      <AdminTitle title={row.client_name} lede="Assign the visit, keep internal notes, and move the status." />
      <dl className="grid gap-4 sm:grid-cols-2">
        {Object.entries(labels).map(([key, label]) => {
          const value = (row as BookingRow)[key as keyof BookingRow];
          if (value == null || value === "") return null;
          return (
            <div key={key}>
              <dt className="text-xs uppercase tracking-[0.14em] text-gold">{label}</dt>
              <dd className="mt-1 text-sm leading-6 text-white">{String(value)}</dd>
            </div>
          );
        })}
      </dl>
      <div className="mt-8 max-w-xl rounded-2xl border border-white/10 bg-card p-5">
        <AdminForm action={saveBooking}>
          <input type="hidden" name="id" value={row.id} />
          <label className="block text-sm">
            Status
            <select name="status" defaultValue={row.status} className="mt-2">
              {["new", "confirmed", "scheduled", "completed", "cancelled"].map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
              {["new", "confirmed", "scheduled", "completed", "cancelled"].includes(row.status) ? null : (
                <option value={row.status}>{row.status}</option>
              )}
            </select>
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              Scheduled date
              <input type="date" name="scheduled_date" defaultValue={row.scheduled_date || ""} className="mt-2" />
            </label>
            <label className="block text-sm">
              Scheduled time
              <input type="time" name="scheduled_time" defaultValue={(row.scheduled_time || "").slice(0, 5)} className="mt-2" />
            </label>
          </div>
          <label className="block text-sm">
            Internal notes
            <textarea name="internal_notes" rows={4} defaultValue={row.internal_notes || ""} className="mt-2" />
          </label>
        </AdminForm>
      </div>
    </>
  );
}
