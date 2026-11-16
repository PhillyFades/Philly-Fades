import { Suspense } from "react";
import { PasswordFields } from "@/components/admin/PasswordFields";
import { EditDrawer } from "@/components/admin/drawer";
import { PageHeading, ReadOnlyField, ReadOnlyGrid, RecordCard } from "@/components/admin/fields";
import { changePassword } from "@/lib/admin/actions";
import { requireAdmin } from "@/lib/admin/guard";

export default function AccountPage() {
  return (
    <Suspense fallback={<p className="text-muted">Loading your account…</p>}>
      <Account />
    </Suspense>
  );
}

async function Account() {
  const session = await requireAdmin();
  return (
    <>
      <PageHeading
        title="Account"
        lede="This password is for the admin area only."
        action={
          <EditDrawer title="Change password">
            <PasswordFields action={changePassword} submitLabel="Update password" />
          </EditDrawer>
        }
      />
      <RecordCard>
        <ReadOnlyGrid>
          <ReadOnlyField label="Email" value={session.email} />
          <ReadOnlyField label="Password" value="Hidden" />
        </ReadOnlyGrid>
      </RecordCard>
    </>
  );
}
