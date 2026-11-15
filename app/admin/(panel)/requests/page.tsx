import Link from "next/link";
import { Suspense } from "react";
import { AdminTitle, DataTable, StatusBadge, Td, Th, Warning } from "@/components/admin/ui";
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
      <AdminTitle title="Requests" lede="Event and program requests, with the slots and quote once Mike sets them." />
      <Warning message={warning} />
      <DataTable>
        <thead>
          <tr>
            <Th>Organization</Th>
            <Th>Kind</Th>
            <Th>Slots</Th>
            <Th>Quote</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <Td>
                <Link href={`/admin/requests/${row.id}`} className="text-sun underline decoration-sun decoration-2 underline-offset-4">
                  {row.organization || row.contact_name}
                </Link>
              </Td>
              <Td>{row.package_name}</Td>
              <Td>{row.slots?.length ? row.slots.map((slot) => `${slot.slot_date} ${slot.start_time}–${slot.end_time}`).join(", ") : "None yet"}</Td>
              <Td>{row.quote_cents == null ? "—" : `$${Math.round(row.quote_cents / 100)}`}</Td>
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
