import Link from "next/link";
import { Suspense } from "react";
import { AdminTitle, DataTable, StatusBadge, Td, Th, Warning } from "@/components/admin/ui";
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
      <AdminTitle title="House calls" lede="The dispatch log is the same list: every row is a visit leaving from Barbers on Broad." />
      <Warning message={warning} />
      <form className="mb-6 grid gap-3 sm:grid-cols-4" action="/admin/bookings">
        <label className="text-sm">
          Status
          <select name="status" defaultValue={filters.status || ""} className="mt-2">
            <option value="">Any</option>
            <option value="new">New</option>
            <option value="confirmed">Confirmed</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>
        <label className="text-sm">
          From
          <input type="date" name="from" defaultValue={filters.from || ""} className="mt-2" />
        </label>
        <label className="text-sm">
          To
          <input type="date" name="to" defaultValue={filters.to || ""} className="mt-2" />
        </label>
        <button type="submit" className="mt-7 inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 px-4 text-sm">
          Filter
        </button>
      </form>
      <DataTable>
        <thead>
          <tr>
            <Th>When</Th>
            <Th>Who</Th>
            <Th>County</Th>
            <Th>Plan</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <Td>
                <Link href={`/admin/bookings/${row.id}`} className="text-sun underline decoration-sun decoration-2 underline-offset-4">
                  {formatWhen(row.scheduled_date || row.requested_date, row.scheduled_time || row.requested_time)}
                </Link>
              </Td>
              <Td>{row.client_name}</Td>
              <Td>{row.service_county}</Td>
              <Td>{row.fee_plan}</Td>
              <Td>
                <StatusBadge status={row.status} />
              </Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
      <h2 className="mb-4 mt-12 font-display text-2xl leading-none">Dispatch log</h2>
      <DataTable>
        <thead>
          <tr>
            <Th>Logged</Th>
            <Th>Visit</Th>
            <Th>Dispatched from</Th>
            <Th>Barber</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`log-${row.id}`}>
              <Td>{row.created_at.slice(0, 10)}</Td>
              <Td>
                <Link href={`/admin/bookings/${row.id}`} className="text-sun hover:underline">
                  {row.client_name}
                </Link>
              </Td>
              <Td>{row.dispatched_from}</Td>
              <Td>{row.barber_name}</Td>
              <Td>
                <StatusBadge status={row.status} />
              </Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </>
  );
}
