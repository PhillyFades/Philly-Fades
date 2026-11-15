import Link from "next/link";
import { Suspense } from "react";
import { AdminTitle, DataTable, StatusBadge, Td, Th, Warning } from "@/components/admin/ui";
import { loadMemberships } from "@/lib/admin/data";

export default function MembershipsPage() {
  return (
    <Suspense fallback={<p className="text-muted">Loading memberships…</p>}>
      <Memberships />
    </Suspense>
  );
}

async function Memberships() {
  const { rows, warning } = await loadMemberships();
  return (
    <>
      <AdminTitle title="Memberships" lede="In-home plans. Pending, active, paused, or cancelled." />
      <Warning message={warning} />
      <DataTable>
        <thead>
          <tr>
            <Th>Member</Th>
            <Th>Plan</Th>
            <Th>County</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <Td>
                <Link href={`/admin/memberships/${row.id}`} className="text-sun underline decoration-sun decoration-2 underline-offset-4">
                  {row.full_name}
                </Link>
              </Td>
              <Td>
                {row.tier_name}
                <span className="mt-1 block text-muted">${Math.round(row.price_cents / 100)}/mo</span>
              </Td>
              <Td>{row.service_county}</Td>
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
