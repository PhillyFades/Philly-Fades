import { Suspense } from "react";
import { AdminForm } from "@/components/admin/Form";
import { AdminTitle, Warning } from "@/components/admin/ui";
import { saveCopy } from "@/lib/admin/actions";
import { loadCopy } from "@/lib/admin/data";

export default function CopyPage() {
  return (
    <Suspense fallback={<p className="text-muted">Loading copy…</p>}>
      <CopyEditor />
    </Suspense>
  );
}

async function CopyEditor() {
  const { rows, warning } = await loadCopy();
  return (
    <>
      <AdminTitle title="Site copy" lede="Hero lines and section intros. The gold word on a headline is the accent field." />
      <Warning message={warning} />
      <div className="space-y-6">
        {rows.map((row) => (
          <article key={row.key} className="rounded-2xl border border-white/10 bg-card p-5">
            <AdminForm action={saveCopy}>
              <input type="hidden" name="key" value={row.key} />
              <input type="hidden" name="label" value={row.label} />
              <label className="block text-sm">
                {row.label}
                <textarea name="value" rows={4} defaultValue={row.value} className="mt-2" />
              </label>
            </AdminForm>
          </article>
        ))}
      </div>
    </>
  );
}
