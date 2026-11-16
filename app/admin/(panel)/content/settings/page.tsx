import { Suspense } from "react";
import { AdminForm } from "@/components/admin/Form";
import { EditDrawer } from "@/components/admin/drawer";
import { AdminField, AdminFields, PageHeading, ReadOnlyField, ReadOnlyGrid, RecordCard } from "@/components/admin/fields";
import { Warning } from "@/components/admin/ui";
import { formatDollars } from "@/content/pricing";
import { saveSettings } from "@/lib/admin/actions";
import { loadSettings, type SettingsRow } from "@/lib/admin/data";

export default function SettingsPage() {
  return (
    <Suspense fallback={<p className="text-muted">Loading settings…</p>}>
      <Settings />
    </Suspense>
  );
}

async function Settings() {
  const { row, warning } = await loadSettings();
  const fee = row.house_call_fee_cents;
  return (
    <>
      <PageHeading
        title="Settings"
        lede="Phone and email stay off the public site until you fill them in."
        action={
          <EditDrawer title="Edit settings">
            <SettingsForm row={row} />
          </EditDrawer>
        }
      />
      <Warning message={warning} />
      <RecordCard>
        <ReadOnlyGrid>
          <ReadOnlyField label="Phone" value={row.phone || "Not set"} />
          <ReadOnlyField label="Email" value={row.email || "Not set"} />
          <ReadOnlyField label="Instagram" value={row.instagram_handle || row.instagram_url} />
          <ReadOnlyField label="Instagram URL" value={row.instagram_url} wide />
          <ReadOnlyField label="In-shop chair" value={row.in_shop_label} />
          <ReadOnlyField label="In-shop link" value={row.in_shop_url} wide />
          <ReadOnlyField label="House-call fee" value={fee == null ? "Confirmed before the visit" : formatDollars(fee)} />
          <ReadOnlyField label="Stripe price ID" value={row.stripe_house_call_price_id || "Later"} />
        </ReadOnlyGrid>
      </RecordCard>
    </>
  );
}

function SettingsForm({ row }: { row: SettingsRow }) {
  return (
    <AdminForm action={saveSettings}>
      <AdminFields>
        <AdminField label="Phone" name="phone" width="narrow" defaultValue={row.phone} />
        <AdminField label="Email" name="email" type="email" defaultValue={row.email} span={2} />
        <AdminField label="Instagram handle" name="instagram_handle" width="narrow" defaultValue={row.instagram_handle} />
        <AdminField label="Instagram URL" name="instagram_url" defaultValue={row.instagram_url} span={2} />
        <AdminField label="In-shop label" name="in_shop_label" defaultValue={row.in_shop_label} span={3} />
        <AdminField label="In-shop link" name="in_shop_url" defaultValue={row.in_shop_url} span={3} />
        <AdminField
          label="House-call fee"
          name="house_call_fee"
          width="narrow"
          inputMode="decimal"
          defaultValue={row.house_call_fee_cents == null ? "" : row.house_call_fee_cents / 100}
        />
        <AdminField label="Stripe price ID" name="stripe_house_call_price_id" defaultValue={row.stripe_house_call_price_id} placeholder="Later" span={2} />
      </AdminFields>
    </AdminForm>
  );
}
