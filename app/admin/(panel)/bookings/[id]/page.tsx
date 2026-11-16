import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AdminForm } from "@/components/admin/Form";
import { EditDrawer } from "@/components/admin/drawer";
import { AdminField, AdminFields, PageHeading, ReadOnlyField, ReadOnlyGrid, yesNo } from "@/components/admin/fields";
import { StatusBadge } from "@/components/admin/ui";
import { formatDollars } from "@/content/pricing";
import { saveBooking } from "@/lib/admin/actions";
import { loadBooking } from "@/lib/admin/data";

const statuses = ["new", "confirmed", "scheduled", "completed", "cancelled"];

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
      <Link href="/admin/bookings" className="text-xs text-sun hover:underline">
        All bookings
      </Link>
      <PageHeading
        title={row.client_name}
        lede="Assign the visit, keep internal notes, and move the status."
        action={
          <EditDrawer title="Edit visit">
            <AdminForm action={saveBooking}>
              <input type="hidden" name="id" value={row.id} />
              <AdminFields>
                <AdminField
                  label="Status"
                  name="status"
                  width="narrow"
                  defaultValue={row.status}
                  options={[
                    ...statuses.map((status) => ({ value: status, label: status })),
                    ...(statuses.includes(row.status) ? [] : [{ value: row.status, label: row.status }]),
                  ]}
                />
                <AdminField label="Scheduled date" name="scheduled_date" type="date" width="narrow" defaultValue={row.scheduled_date || ""} />
                <AdminField label="Scheduled time" name="scheduled_time" type="time" width="narrow" defaultValue={(row.scheduled_time || "").slice(0, 5)} />
                <AdminField label="Internal notes" name="internal_notes" defaultValue={row.internal_notes || ""} rows={3} span={3} />
              </AdminFields>
            </AdminForm>
          </EditDrawer>
        }
      />
      <ReadOnlyGrid>
        <ReadOnlyField label="Status" value={<StatusBadge status={row.status} />} />
        <ReadOnlyField label="Phone" value={row.client_phone} />
        <ReadOnlyField label="Email" value={row.client_email} />
        <ReadOnlyField label="Requested" value={joinWhen(row.requested_date, row.requested_time)} />
        <ReadOnlyField label="Scheduled" value={joinWhen(row.scheduled_date, row.scheduled_time)} />
        <ReadOnlyField label="County" value={row.service_county} />
        <ReadOnlyField label="City" value={row.city} />
        <ReadOnlyField label="State" value={row.state} />
        <ReadOnlyField label="ZIP" value={row.zip} />
        <ReadOnlyField label="Street" value={row.address_line1} />
        <ReadOnlyField label="Apt, suite, or unit" value={row.address_line2} />
        <ReadOnlyField label="Plan" value={row.fee_plan} />
        <ReadOnlyField label="Fee" value={row.fee_cents == null ? "—" : formatDollars(row.fee_cents)} />
        <ReadOnlyField label="Who the cut is for" value={row.demographic_category} />
        <ReadOnlyField label="Veteran" value={yesNo(row.is_veteran)} />
        <ReadOnlyField label="Disability" value={row.has_disability} />
        <ReadOnlyField label="Eligibility confirmed" value={yesNo(row.eligibility_confirmed)} />
        <ReadOnlyField label="Booked on behalf" value={yesNo(row.booking_on_behalf)} />
        <ReadOnlyField label="Payment" value={row.payment_method} />
        <ReadOnlyField label="Referrer" value={row.referrer_name} />
        <ReadOnlyField label="Referrer organization" value={row.referrer_organization} />
        <ReadOnlyField label="Referrer role" value={row.referrer_role} />
        <ReadOnlyField label="Referrer contact" value={row.referrer_contact} />
        <ReadOnlyField label="Barber" value={row.barber_name} />
        <ReadOnlyField label="Logged" value={row.created_at.slice(0, 10)} />
        <ReadOnlyField label="Address" value={row.service_address} wide />
        <ReadOnlyField label="Dispatched from" value={row.dispatched_from} wide />
        <ReadOnlyField label="Eligibility" value={row.eligibility_basis} wide />
        <ReadOnlyField label="Notes" value={row.notes} wide />
        <ReadOnlyField label="Internal notes" value={row.internal_notes} wide />
      </ReadOnlyGrid>
    </>
  );
}

function joinWhen(date: string | null, time: string | null) {
  if (!date && !time) return "";
  return [date, time?.slice(0, 5)].filter(Boolean).join(" · ");
}
