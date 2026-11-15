import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AdminForm } from "@/components/admin/Form";
import { AdminTitle } from "@/components/admin/ui";
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
  return (
    <>
      <Link href="/admin/memberships" className="text-sm text-sun hover:underline">
        All memberships
      </Link>
      <AdminTitle title={row.full_name} lede={`${row.tier_name} · ${row.service_address}`} />
      <p className="text-sm leading-6 text-muted">{row.household_notes}</p>
      <div className="mt-8 max-w-xl rounded-2xl border border-white/10 bg-card p-5">
        <AdminForm action={saveMembership}>
          <input type="hidden" name="id" value={row.id} />
          <label className="block text-sm">
            Status
            <select name="status" defaultValue={row.status === "pending_payment" || row.status === "requested" ? "pending" : row.status} className="mt-2">
              {["pending", "active", "paused", "cancelled"].map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            Notes
            <textarea name="admin_notes" rows={4} defaultValue={row.admin_notes || ""} className="mt-2" />
          </label>
        </AdminForm>
      </div>
    </>
  );
}
