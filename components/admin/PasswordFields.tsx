"use client";

import { AdminForm } from "@/components/admin/Form";
import type { AdminResult } from "@/lib/admin/actions";

export function PasswordFields({
  action,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<AdminResult>;
  submitLabel: string;
}) {
  return (
    <AdminForm action={action} submitLabel={submitLabel}>
      <label className="block text-sm">
        New password
        <input type="password" name="password" autoComplete="new-password" minLength={8} required className="mt-2" />
      </label>
      <label className="block text-sm">
        Confirm password
        <input type="password" name="confirm" autoComplete="new-password" minLength={8} required className="mt-2" />
      </label>
      <p className="text-sm text-muted">Use at least 8 characters.</p>
    </AdminForm>
  );
}
