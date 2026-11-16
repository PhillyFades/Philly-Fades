import { Suspense } from "react";
import { CalendarBoard } from "@/components/admin/Calendar";
import { AdminForm } from "@/components/admin/Form";
import { EditDrawer } from "@/components/admin/drawer";
import { AdminField, AdminFields, Badge, PageHeading, RecordCard } from "@/components/admin/fields";
import { Warning } from "@/components/admin/ui";
import { deleteBlock, saveBlock } from "@/lib/admin/actions";
import { loadCalendar } from "@/lib/admin/data";
import { newYorkToday } from "@/lib/admin/dates";

export default function CalendarPage() {
  return (
    <Suspense fallback={<p className="text-muted">Loading the calendar…</p>}>
      <Calendar />
    </Suspense>
  );
}

async function Calendar() {
  const { items, blocks, warning } = await loadCalendar();
  return (
    <>
      <PageHeading
        title="Calendar"
        lede="Scheduled house calls and 4-hour event slots. Click a block to open the record."
        action={
          <EditDrawer title="Add dates" trigger="+ Dates" tone="primary">
            <AdminForm action={saveBlock} submitLabel="Add dates">
              <AdminFields>
                <AdminField
                  label="Kind"
                  name="kind"
                  width="narrow"
                  defaultValue="blackout"
                  options={[
                    { value: "blackout", label: "Blackout" },
                    { value: "available", label: "Available" },
                  ]}
                />
                <AdminField label="Starts" name="starts_on" type="date" width="narrow" required />
                <AdminField label="Ends" name="ends_on" type="date" width="narrow" />
                <AdminField label="Note" name="note" span={3} />
              </AdminFields>
            </AdminForm>
          </EditDrawer>
        }
      />
      <Warning message={warning} />
      <CalendarBoard items={items} initialDate={newYorkToday()} />
      <h2 className="mb-2 mt-8 font-display text-xl leading-none">Availability and blackout dates</h2>
      <p className="mb-3 max-w-2xl text-sm leading-5 text-muted">
        A blackout closes those days on the public date pickers. If you add any available window, visits can only be requested inside those windows.
      </p>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {blocks.map((block) => (
          <RecordCard key={block.id}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <Badge tone={block.kind === "blackout" ? "gold" : "sun"}>{block.kind}</Badge>
                <p className="mt-2 text-sm text-white">
                  {block.starts_on} to {block.ends_on}
                </p>
                {block.note ? <p className="mt-1 text-sm text-muted">{block.note}</p> : null}
              </div>
              <AdminForm action={deleteBlock} confirmText="Remove this date range?" submitLabel="Delete" tone="danger" compact>
                <input type="hidden" name="id" value={block.id} />
              </AdminForm>
            </div>
          </RecordCard>
        ))}
      </div>
    </>
  );
}
