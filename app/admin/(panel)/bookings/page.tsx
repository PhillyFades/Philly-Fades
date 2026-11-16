import Link from "next/link";
import { Suspense } from "react";
import { Badge, PageHeading, RecordCard, RecordGrid } from "@/components/admin/fields";
import { StatusBadge, Warning } from "@/components/admin/ui";
import { formatWhen } from "@/lib/admin/dates";
import { loadBookings } from "@/lib/admin/data";

export default function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; from?: string; to?: string }>;
}) {
  return (
    <Suspense fallback={<p className="text-muted">Loading bookings…</p>}>
      <Bookings searchParams={searchParams} />
    </Suspense>
  );
}

async function Bookings({ searchParams }: { searchParams: Promise<{ status?: string; from?: string; to?: string }> }) {
  const filters = await searchParams;
  const { rows, warning } = await loadBookings(filters);
  return (
    <>
      <PageHeading title="House calls" lede="Every row is a visit leaving from Barbers on Broad." />
      <Warning message={warning} />
      <form className="mb-4 grid grid-cols-2 items-end gap-2 sm:grid-cols-4" action="/admin/bookings">
        <label className="text-xs text-muted">
          Status
          <select name="status" defaultValue={filters.status || ""} className="mt-1">
            <option value="">Any</option>
            <option value="new">New</option>
            <option value="confirmed">Confirmed</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>
        <label className="text-xs text-muted">
          From
          <input type="date" name="from" defaultValue={filters.from || ""} className="mt-1" />
        </label>
        <label className="text-xs text-muted">
          To
          <input type="date" name="to" defaultValue={filters.to || ""} className="mt-1" />
        </label>
        <button type="submit" className="inline-flex h-9 items-center justify-center rounded-full border border-white/20 px-3 text-sm">
          Filter
        </button>
      </form>
      <RecordGrid>
        {rows.map((row) => (
          <RecordCard key={row.id}>
            <div className="flex items-start justify-between gap-2">
              <Link href={`/admin/bookings/${row.id}`} className="font-display text-xl leading-none text-sun underline decoration-sun decoration-2 underline-offset-4">
                {row.client_name}
              </Link>
              <StatusBadge status={row.status} />
            </div>
            <p className="mt-2 text-sm text-white">{formatWhen(row.scheduled_date || row.requested_date, row.scheduled_time || row.requested_time)}</p>
            <p className="mt-1 text-sm text-muted">
              {row.service_county} · {row.fee_plan}
            </p>
            <p className="mt-1 text-xs text-muted">
              {row.barber_name} · {row.dispatched_from}
            </p>
            <div className="mt-2">
              <Badge tone="muted">Logged {row.created_at.slice(0, 10)}</Badge>
            </div>
          </RecordCard>
        ))}
      </RecordGrid>
    </>
  );
}
