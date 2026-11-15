import { Suspense } from "react";
import { AdminForm } from "@/components/admin/Form";
import { AdminTitle, Warning } from "@/components/admin/ui";
import { deletePlan, saveHouseCallFee, savePlan } from "@/lib/admin/actions";
import { loadPlans, loadSettings } from "@/lib/admin/data";

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
      <AdminTitle title="Membership plans and the house-call fee" lede="Stripe price IDs stay empty until checkout is connected." />
      <Warning message={warning || settings.warning} />
      <div className="mb-8 max-w-xl rounded-2xl border border-white/10 bg-card p-5">
        <h2 className="font-display text-2xl leading-none">Single house call</h2>
        <div className="mt-4">
          <AdminForm action={saveHouseCallFee}>
            <label className="block text-sm">
              Base fee in dollars
              <input name="house_call_fee" inputMode="decimal" defaultValue={fee == null ? "" : String(fee / 100)} className="mt-2" placeholder="Leave blank to confirm the fee before the visit" />
            </label>
            <label className="block text-sm">
              Stripe price ID
              <input name="stripe_house_call_price_id" defaultValue={settings.row.stripe_house_call_price_id} className="mt-2" placeholder="Later" />
            </label>
          </AdminForm>
        </div>
      </div>
      <div className="space-y-6">
        {rows.map((plan) => (
          <article key={plan.id} className="rounded-2xl border border-white/10 bg-card p-5">
            <AdminForm action={savePlan}>
              <input type="hidden" name="id" value={plan.id} />
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm">
                  Name
                  <input name="name" defaultValue={plan.name} className="mt-2" />
                </label>
                <label className="block text-sm">
                  Price (dollars)
                  <input name="price" inputMode="decimal" defaultValue={String(plan.price_cents / 100)} className="mt-2" />
                </label>
                <label className="block text-sm">
                  Cadence
                  <input name="cadence" defaultValue={plan.cadence} className="mt-2" />
                </label>
                <label className="block text-sm">
                  Sort order
                  <input name="sort_order" defaultValue={String(plan.sort_order)} className="mt-2" />
                </label>
              </div>
              <label className="block text-sm">
                What it includes
                <input name="cuts" defaultValue={plan.cuts} className="mt-2" />
              </label>
              <label className="block text-sm">
                Summary
                <textarea name="summary" rows={3} defaultValue={plan.summary} className="mt-2" />
              </label>
              <label className="block text-sm">
                Features, one per line
                <textarea name="features" rows={5} defaultValue={plan.features.join("\n")} className="mt-2" />
              </label>
              <label className="block text-sm">
                Stripe price ID
                <input name="stripe_price_id" defaultValue={plan.stripe_price_id} className="mt-2" placeholder="Later" />
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="active" defaultChecked={plan.active} /> Active
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="featured" defaultChecked={plan.featured} /> Featured
              </label>
            </AdminForm>
            <div className="mt-3">
              <AdminForm action={deletePlan} confirmText={`Remove ${plan.name}?`} submitLabel="Delete plan">
                <input type="hidden" name="id" value={plan.id} />
              </AdminForm>
            </div>
          </article>
        ))}
      </div>
      <h2 className="mb-4 mt-12 font-display text-2xl leading-none">New plan</h2>
      <div className="max-w-xl rounded-2xl border border-white/10 p-5">
        <AdminForm action={savePlan} submitLabel="Add plan">
          <label className="block text-sm">
            Id
            <input name="id" placeholder="the-new-plan" className="mt-2" required />
          </label>
          <label className="block text-sm">
            Name
            <input name="name" className="mt-2" required />
          </label>
          <label className="block text-sm">
            Price (dollars)
            <input name="price" inputMode="decimal" className="mt-2" required />
          </label>
          <input type="hidden" name="cadence" value="monthly" />
          <label className="block text-sm">
            What it includes
            <input name="cuts" className="mt-2" />
          </label>
          <label className="block text-sm">
            Summary
            <textarea name="summary" rows={3} className="mt-2" />
          </label>
          <label className="block text-sm">
            Features, one per line
            <textarea name="features" rows={4} className="mt-2" />
          </label>
          <label className="block text-sm">
            Stripe price ID
            <input name="stripe_price_id" className="mt-2" placeholder="Later" />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="active" defaultChecked /> Active
          </label>
        </AdminForm>
      </div>
    </>
  );
}
