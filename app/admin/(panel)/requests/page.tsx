import Link from "next/link";
import { Suspense } from "react";
import { PageHeading, RecordCard, RecordGrid } from "@/components/admin/fields";
import { StatusBadge, Warning } from "@/components/admin/ui";
import { loadRequests } from "@/lib/admin/data";

export default function RequestsPage() {
  return (
    <Suspense fallback={<p className="text-muted">Loading requests…</p>}>
      <Requests />
    </Suspense>
  );
}

async function Requests() {
  const { rows, warning } = await loadRequests();
  return (
    <>
      <PageHeading title="Requests" lede="Event and program requests, with the slots and quote once Mike sets them." />
      <Warning message={warning} />
      <RecordGrid>
        {rows.map((row) => (
          <RecordCard key={row.id}>
            <div className="flex items-start justify-between gap-2">
              <Link href={`/admin/requests/${row.id}`} className="font-display text-xl leading-none text-sun underline decoration-sun decoration-2 underline-offset-4">
                {row.organization || row.contact_name}
              </Link>
              <StatusBadge status={row.status} />
            </div>
            <p className="mt-2 text-sm text-white">{row.package_name}</p>
            <p className="mt-1 line-clamp-2 text-sm text-muted">
              {row.slots?.length ? row.slots.map((slot) => `${slot.slot_date} ${slot.start_time}–${slot.end_time}`).join(", ") : "No slots yet"}
            </p>
            <p className="mt-1 text-sm text-white">{row.quote_cents == null ? "No quote" : `$${Math.round(row.quote_cents / 100)}`}</p>
          </RecordCard>
        ))}
      </RecordGrid>
    </>
  );
}
