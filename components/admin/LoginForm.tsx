"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { createSupabaseBrowser } from "@/lib/supabase/browser";

export function LoginForm({ error }: { error?: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const notice =
    error === "config"
      ? "Supabase auth is not configured on this server yet."
      : error === "setup"
        ? "Apply the admin migration, then sign in again."
        : error === "not-allowed"
          ? "This account is signed in, but it is not on the admin list yet."
          : null;

  async function signIn(event: FormEvent) {
    event.preventDefault();
    const supabase = createSupabaseBrowser();
    if (!supabase) {
      setMessage("Supabase auth is not configured.");
      return;
    }
    setPending(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setPending(false);
    if (signInError) {
      setMessage(signInError.message);
      return;
    }
    window.location.assign("/admin");
  }

  async function sendMagic() {
    const supabase = createSupabaseBrowser();
    if (!supabase) {
      setMessage("Supabase auth is not configured.");
      return;
    }
    setPending(true);
    const { error: magicError } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/admin/auth/callback?next=/admin` },
    });
    setPending(false);
    setMessage(magicError ? magicError.message : "Check your email for the sign-in link.");
  }

  async function forgot() {
    const supabase = createSupabaseBrowser();
    if (!supabase) {
      setMessage("Supabase auth is not configured.");
      return;
    }
    if (!email) {
      setMessage("Enter your email first.");
      return;
    }
    setPending(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/auth/callback?next=/admin/reset-password`,
    });
    setPending(false);
    setMessage(resetError ? resetError.message : "If that email can sign in, a reset link is on its way.");
  }

  return (
    <form onSubmit={signIn} className="space-y-4">
      {notice ? <p className="rounded-2xl border border-sun/40 bg-sun/10 px-4 py-3 text-sm leading-6">{notice}</p> : null}
      <label className="block text-sm">
        Email
        <input type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required className="mt-2" />
      </label>
      <label className="block text-sm">
        Password
        <input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required className="mt-2" />
      </label>
      <button type="submit" disabled={pending} className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-sun px-5 text-sm font-semibold text-ink">
        {pending ? "Working…" : "Sign in"}
      </button>
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <button type="button" className="text-sun hover:underline" onClick={sendMagic}>
          Email me a magic link
        </button>
        <button type="button" className="text-white hover:text-sun" onClick={forgot}>
          Forgot password
        </button>
      </div>
      {message ? <p className="text-sm leading-6 text-muted">{message}</p> : null}
      <p className="text-sm text-muted">
        <Link href="/" className="text-sun hover:underline">
          Back to the site
        </Link>
      </p>
    </form>
  );
}
