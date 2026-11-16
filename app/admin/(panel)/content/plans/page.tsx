import { Suspense } from "react";
import { AdminForm } from "@/components/admin/Form";
import { EditDrawer } from "@/components/admin/drawer";
import { AdminCheck, AdminCheckRow, AdminField, AdminFields, Badge, PageHeading, ReadOnlyField, ReadOnlyGrid, RecordCard, RecordGrid } from "@/components/admin/fields";
import { Warning } from "@/components/admin/ui";
import { formatDollars } from "@/content/pricing";
import { deletePlan, saveHouseCallFee, savePlan } from "@/lib/admin/actions";
import { loadPlans, loadSettings, type PlanRow } from "@/lib/admin/data";

export default function PlansPage() {
  return (
    <Suspense fallback={<p className="text-muted">Loading plans…</p>}>
      <Plans />
    </Suspense>
  );
}

async function Plans() {
  const [{ rows, warning }, settings] = await Promise.all([loadPlans(), loadSettings()]);
  const fee = settings.row.house_call_fee_cents;
  return (
    <>
      <PageHeading
        title="Prices"
        lede="Membership plans and the single house-call fee. Stripe price IDs stay empty until checkout is connected."
        action={
          <EditDrawer title="New plan" trigger="+ New plan" tone="primary">
            <PlanForm />
          </EditDrawer>
        }
      />
      <Warning message={warning || settings.warning} />
      <RecordGrid>
        <RecordCard>
          <div className="flex items-start justify-between gap-2">
            <h2 className="font-display text-xl leading-none">Single house call</h2>
            <EditDrawer title="House-call fee">
              <AdminForm action={saveHouseCallFee}>
                <AdminFields>
                  <AdminField label="Fee in dollars" name="house_call_fee" width="narrow" inputMode="decimal" defaultValue={fee == null ? "" : fee / 100} placeholder="Blank to confirm later" />
                  <AdminField label="Stripe price ID" name="stripe_house_call_price_id" defaultValue={settings.row.stripe_house_call_price_id} placeholder="Later" span={2} />
                </AdminFields>
              </AdminForm>
            </EditDrawer>
          </div>
          <ReadOnlyGrid>
            <ReadOnlyField label="Price" value={fee == null ? "Confirmed before the visit" : formatDollars(fee)} />
            <ReadOnlyField label="Stripe" value={settings.row.stripe_house_call_price_id || "Later"} />
          </ReadOnlyGrid>
        </RecordCard>
        {rows.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </RecordGrid>
    </>
  );
}

function PlanCard({ plan }: { plan: PlanRow }) {
  return (
    <RecordCard>
      <div className="flex items-start justify-between gap-2">
        <h2 className="font-display text-xl leading-none">{plan.name}</h2>
        <div className="flex shrink-0 items-center gap-2">
          <EditDrawer title={`Edit ${plan.name}`}>
            <PlanForm plan={plan} />
          </EditDrawer>
          <AdminForm action={deletePlan} confirmText={`Delete ${plan.name}?`} submitLabel="Delete" tone="danger" compact>
            <input type="hidden" name="id" value={plan.id} />
          </AdminForm>
        </div>
      </div>
      <p className="mt-2 text-sm text-white">
        {formatDollars(plan.price_cents)} <span className="text-muted">/ {plan.cadence}</span>
      </p>
      <p className="mt-1 line-clamp-2 text-sm leading-5 text-muted">{plan.cuts || plan.summary}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <Badge tone={plan.active ? "sun" : "muted"}>{plan.active ? "Active" : "Inactive"}</Badge>
        {plan.featured ? <Badge>Featured</Badge> : null}
        <Badge tone="muted">Sort {plan.sort_order}</Badge>
      </div>
    </RecordCard>
  );
}

function PlanForm({ plan }: { plan?: PlanRow }) {
  return (
    <AdminForm action={savePlan}>
      {plan ? <input type="hidden" name="id" value={plan.id} /> : null}
      <AdminFields>
        {plan ? null : <AdminField label="Id" name="id" width="narrow" placeholder="the-new-plan" required />}
        <AdminField label="Name" name="name" defaultValue={plan?.name} required span={plan ? 2 : 1} />
        <AdminField label="Price" name="price" width="narrow" inputMode="decimal" defaultValue={plan ? plan.price_cents / 100 : ""} required />
        <AdminField label="Cadence" name="cadence" width="narrow" defaultValue={plan?.cadence || "monthly"} />
        <AdminField label="Sort order" name="sort_order" width="narrow" defaultValue={plan?.sort_order ?? 0} />
        <AdminField label="What it includes" name="cuts" defaultValue={plan?.cuts} span={3} />
        <AdminField label="Summary" name="summary" defaultValue={plan?.summary} rows={2} span={3} />
        <AdminField label="Features, one per line" name="features" defaultValue={plan?.features.join("\n")} rows={4} span={3} />
        <AdminField label="Stripe price ID" name="stripe_price_id" defaultValue={plan?.stripe_price_id} placeholder="Later" span={2} />
      </AdminFields>
      <AdminCheckRow>
        <AdminCheck name="active" label="Active" defaultChecked={plan?.active ?? true} />
        <AdminCheck name="featured" label="Featured" defaultChecked={plan?.featured ?? false} />
      </AdminCheckRow>
    </AdminForm>
  );
}
