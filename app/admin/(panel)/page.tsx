import Link from "next/link";
import { Suspense } from "react";
import { AdminTitle, StatusBadge, Warning } from "@/components/admin/ui";
import { loadDashboard } from "@/lib/admin/data";

export default function DashboardPage() {
  return (
    <Suspense fallback={<p className="text-muted">Loading the week…</p>}>
      <Dashboard />
    </Suspense>
  );
}

async function Dashboard() {
  const data = await loadDashboard();
  return (
    <>
      {data.mustChangePassword ? (
        <p className="mb-6 rounded-2xl border border-sun/50 bg-sun/10 px-4 py-3 text-sm leading-6 text-white">
          When you have a minute, choose a password only you know.{" "}
          <Link href="/admin/account" className="text-sun underline decoration-sun decoration-2 underline-offset-4">
            Update it on your account page.
          </Link>
        </p>
      ) : null}
      <AdminTitle title="This week" lede={`New requests from ${data.weekLabel}, America/New_York.`} />
      <Warning message={data.warning} />
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Bookings", data.counts.bookings, "/admin/bookings"],
          ["Memberships", data.counts.memberships, "/admin/memberships"],
          ["Event and program requests", data.counts.requests, "/admin/requests"],
        ].map(([label, count, href]) => (
          <Link key={String(href)} href={String(href)} className="rounded-2xl border border-white/10 bg-card p-5 hover:border-sun/50">
            <p className="font-display text-5xl text-sun">{count}</p>
            <p className="mt-2 text-sm text-white">{label}</p>
          </Link>
        ))}
      </div>
      <h2 className="mb-4 mt-10 font-display text-2xl leading-none">Upcoming visits</h2>
      {data.upcoming.length ? (
        <ul className="divide-y divide-white/10 rounded-2xl border border-white/10">
          {data.upcoming.map((item) => (
            <li key={`${item.href}-${item.when}`}>
              <Link href={item.href} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 hover:bg-white/5">
                <span>
                  <span className="block text-white">{item.title}</span>
                  <span className="text-sm text-muted">{item.when}</span>
                </span>
                <StatusBadge status={item.status} />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted">Nothing scheduled ahead of today.</p>
      )}
    </>
  );
}
