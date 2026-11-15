import { Suspense, type ReactNode } from "react";
import { AdminShell } from "@/components/admin/Shell";
import { requireAdmin } from "@/lib/admin/guard";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Admin",
};

export default function AdminPanelLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<p className="p-8 text-muted">Loading admin…</p>}>
      <Authed>{children}</Authed>
    </Suspense>
  );
}

async function Authed({ children }: { children: ReactNode }) {
  const session = await requireAdmin();
  return <AdminShell email={session.email}>{children}</AdminShell>;
}
