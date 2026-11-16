import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AdminForm } from "@/components/admin/Form";
import { EditDrawer } from "@/components/admin/drawer";
import { AdminField, AdminFields, PageHeading, ReadOnlyField, ReadOnlyGrid, yesNo } from "@/components/admin/fields";
import { StatusBadge } from "@/components/admin/ui";
import { formatDollars } from "@/content/pricing";
import { saveMembership } from "@/lib/admin/actions";
import { loadMembership } from "@/lib/admin/data";

export default function MembershipDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<p className="text-muted">Loading the membership…</p>}>
      <Detail params={params} />
    </Suspense>
  );
}

async function Detail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await loadMembership(id);
  if (!row) notFound();
  const status = row.status === "pending_payment" || row.status === "requested" ? "pending" : row.status;
  return (
    <>
      <Link href="/admin/memberships" className="text-xs text-sun hover:underline">
        All memberships
      </Link>
      <PageHeading
        title={row.full_name}
        lede={`${row.tier_name} · ${formatDollars(row.price_cents)}/mo`}
        action={
          <EditDrawer title="Edit membership">
            <AdminForm action={saveMembership}>
              <input type="hidden" name="id" value={row.id} />
              <AdminFields>
                <AdminField
                  label="Status"
                  name="status"
                  width="narrow"
                  defaultValue={status}
                  options={["pending", "active", "paused", "cancelled"].map((value) => ({ value, label: value }))}
                />
                <AdminField label="Notes" name="admin_notes" defaultValue={row.admin_notes || ""} rows={3} span={3} />
              </AdminFields>
            </AdminForm>
          </EditDrawer>
        }
      />
      <ReadOnlyGrid>
        <ReadOnlyField label="Status" value={<StatusBadge status={row.status} />} />
        <ReadOnlyField label="Plan" value={row.tier_name} />
        <ReadOnlyField label="Price" value={`${formatDollars(row.price_cents)}/mo`} />
        <ReadOnlyField label="Email" value={row.email} />
        <ReadOnlyField label="Phone" value={row.phone} />
        <ReadOnlyField label="County" value={row.service_county} />
        <ReadOnlyField label="Location" value={row.service_location} />
        <ReadOnlyField label="Eligibility confirmed" value={yesNo(row.eligibility_confirmed)} />
        <ReadOnlyField label="Veteran" value={yesNo(row.is_veteran)} />
        <ReadOnlyField label="Disability" value={row.has_disability} />
        <ReadOnlyField label="Address" value={row.service_address} wide />
        <ReadOnlyField label="Household notes" value={row.household_notes} wide />
        <ReadOnlyField label="Admin notes" value={row.admin_notes} wide />
      </ReadOnlyGrid>
    </>
  );
}
