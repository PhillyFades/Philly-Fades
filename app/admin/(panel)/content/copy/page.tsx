import { Suspense } from "react";
import { AdminForm } from "@/components/admin/Form";
import { EditDrawer } from "@/components/admin/drawer";
import { AdminField, PageHeading, RecordCard, RecordGrid } from "@/components/admin/fields";
import { Warning } from "@/components/admin/ui";
import { saveCopy } from "@/lib/admin/actions";
import { loadCopy, type CopyRow } from "@/lib/admin/data";

export default function CopyPage() {
  return (
    <Suspense fallback={<p className="text-muted">Loading copy…</p>}>
      <CopyList />
    </Suspense>
  );
}

async function CopyList() {
  const { rows, warning } = await loadCopy();
  return (
    <>
      <PageHeading title="Site copy" lede="Hero lines and section intros. The gold word on a headline is the accent field." />
      <Warning message={warning} />
      <RecordGrid>
        {rows.map((row) => (
          <CopyCard key={row.key} row={row} />
        ))}
      </RecordGrid>
    </>
  );
}

function CopyCard({ row }: { row: CopyRow }) {
  return (
    <RecordCard>
      <div className="flex items-start justify-between gap-2">
        <p className="text-[10px] uppercase tracking-[0.14em] text-gold">{row.key}</p>
        <EditDrawer title={row.label || row.key}>
          <AdminForm action={saveCopy}>
            <input type="hidden" name="key" value={row.key} />
            <input type="hidden" name="label" value={row.label} />
            <AdminField label={row.label || row.key} name="value" defaultValue={row.value} rows={4} />
          </AdminForm>
        </EditDrawer>
      </div>
      <p className="mt-2 line-clamp-3 text-sm leading-5 text-white">{row.value}</p>
    </RecordCard>
  );
}
