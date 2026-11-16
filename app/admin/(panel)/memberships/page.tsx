import Link from "next/link";
import { Suspense } from "react";
import { PageHeading, RecordCard, RecordGrid } from "@/components/admin/fields";
import { StatusBadge, Warning } from "@/components/admin/ui";
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
      <PageHeading title="Memberships" lede="In-home plans. Pending, active, paused, or cancelled." />
      <Warning message={warning} />
      <RecordGrid>
        {rows.map((row) => (
          <RecordCard key={row.id}>
            <div className="flex items-start justify-between gap-2">
              <Link href={`/admin/memberships/${row.id}`} className="font-display text-xl leading-none text-sun underline decoration-sun decoration-2 underline-offset-4">
                {row.full_name}
              </Link>
              <StatusBadge status={row.status} />
            </div>
            <p className="mt-2 text-sm text-white">
              {row.tier_name} · ${Math.round(row.price_cents / 100)}/mo
            </p>
            <p className="mt-1 text-sm text-muted">{row.service_county}</p>
          </RecordCard>
        ))}
      </RecordGrid>
    </>
  );
}
