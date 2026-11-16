import { Suspense } from "react";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  return (
    <main id="main" className="admin-ui mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-5 py-16">
      <p className="text-xs uppercase tracking-[0.18em] text-gold">Buzz Boxx PXV</p>
      <h1 className="mt-3 font-display text-4xl leading-none">Admin sign in</h1>
      <p className="mt-3 text-base leading-7 text-muted">For Mike and the site manager. Everyone else stays on the public site.</p>
      <div className="mt-8">
        <Suspense fallback={<p className="text-muted">Loading…</p>}>
          <LoginGate searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}

async function LoginGate({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <LoginForm error={error} />;
}
