"use client";

import { AdminForm } from "@/components/admin/Form";
import { AdminField } from "@/components/admin/fields";
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
      <AdminField label="New password" name="password" type="password" autoComplete="new-password" minLength={8} required />
      <AdminField label="Confirm password" name="confirm" type="password" autoComplete="new-password" minLength={8} required />
      <p className="text-xs text-muted">Use at least 8 characters.</p>
    </AdminForm>
  );
}
