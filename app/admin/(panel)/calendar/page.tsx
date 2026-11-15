import { Suspense } from "react";
import { CalendarBoard } from "@/components/admin/Calendar";
import { AdminForm } from "@/components/admin/Form";
import { AdminTitle, Warning } from "@/components/admin/ui";
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
      <AdminTitle title="Calendar" lede="Scheduled house calls and 4-hour event slots. Click a block to open the record." />
      <Warning message={warning} />
      <CalendarBoard items={items} initialDate={newYorkToday()} />
      <h2 className="mb-4 mt-12 font-display text-2xl leading-none">Availability and blackout dates</h2>
      <p className="mb-4 max-w-2xl text-sm leading-6 text-muted">
        A blackout closes those days on the public date pickers. If you add any available window, visits can only be requested inside those windows.
      </p>
      <ul className="mb-6 space-y-3">
        {blocks.map((block) => (
          <li key={block.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 px-4 py-3 text-sm">
            <span>
              {block.kind} · {block.starts_on} to {block.ends_on}
              {block.note ? ` · ${block.note}` : ""}
            </span>
            <AdminForm action={deleteBlock} confirmText="Remove this date range?" submitLabel="Remove">
              <input type="hidden" name="id" value={block.id} />
            </AdminForm>
          </li>
        ))}
      </ul>
      <div className="max-w-xl rounded-2xl border border-white/10 bg-card p-5">
        <AdminForm action={saveBlock} submitLabel="Add dates">
          <label className="block text-sm">
            Kind
            <select name="kind" defaultValue="blackout" className="mt-2">
              <option value="blackout">Blackout</option>
              <option value="available">Available</option>
            </select>
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              Starts
              <input type="date" name="starts_on" required className="mt-2" />
            </label>
            <label className="block text-sm">
              Ends
              <input type="date" name="ends_on" className="mt-2" />
            </label>
          </div>
          <label className="block text-sm">
            Note
            <input name="note" className="mt-2" />
          </label>
        </AdminForm>
      </div>
    </>
  );
}
