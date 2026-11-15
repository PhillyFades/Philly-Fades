import { Suspense } from "react";
import { PasswordFields } from "@/components/admin/PasswordFields";
import { AdminTitle } from "@/components/admin/ui";
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
      <AdminTitle title="Account" lede="This password is for the admin area only." />
      <p className="mb-6 text-sm text-white">
        Signed in as <span className="text-sun">{session.email}</span>
      </p>
      <div className="max-w-md rounded-2xl border border-white/10 bg-card p-5">
        <PasswordFields action={changePassword} submitLabel="Update password" />
      </div>
    </>
  );
}
