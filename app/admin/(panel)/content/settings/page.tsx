import { Suspense } from "react";
import { AdminForm } from "@/components/admin/Form";
import { AdminTitle, Warning } from "@/components/admin/ui";
import { saveSettings } from "@/lib/admin/actions";
import { loadSettings } from "@/lib/admin/data";

export default function SettingsPage() {
  return (
    <Suspense fallback={<p className="text-muted">Loading settings…</p>}>
      <Settings />
    </Suspense>
  );
}

async function Settings() {
  const { row, warning } = await loadSettings();
  return (
    <>
      <AdminTitle title="Settings" lede="Phone and email stay off the public site until you fill them in." />
      <Warning message={warning} />
      <div className="max-w-xl rounded-2xl border border-white/10 bg-card p-5">
        <AdminForm action={saveSettings}>
          <label className="block text-sm">
            Phone
            <input name="phone" defaultValue={row.phone} className="mt-2" />
          </label>
          <label className="block text-sm">
            Email
            <input name="email" type="email" defaultValue={row.email} className="mt-2" />
          </label>
          <label className="block text-sm">
            Instagram URL
            <input name="instagram_url" defaultValue={row.instagram_url} className="mt-2" />
          </label>
          <label className="block text-sm">
            Instagram handle
            <input name="instagram_handle" defaultValue={row.instagram_handle} className="mt-2" />
          </label>
          <label className="block text-sm">
            In-shop chair link
            <input name="in_shop_url" defaultValue={row.in_shop_url} className="mt-2" />
          </label>
          <label className="block text-sm">
            In-shop link label
            <input name="in_shop_label" defaultValue={row.in_shop_label} className="mt-2" />
          </label>
          <label className="block text-sm">
            Single house-call fee (dollars)
            <input name="house_call_fee" inputMode="decimal" defaultValue={row.house_call_fee_cents == null ? "" : String(row.house_call_fee_cents / 100)} className="mt-2" />
          </label>
          <label className="block text-sm">
            Stripe price ID for the house call
            <input name="stripe_house_call_price_id" defaultValue={row.stripe_house_call_price_id} placeholder="Later" className="mt-2" />
          </label>
        </AdminForm>
      </div>
    </>
  );
}
