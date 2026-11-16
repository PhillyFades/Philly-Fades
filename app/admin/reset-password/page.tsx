import { setPasswordFromReset } from "@/lib/admin/actions";
import { PasswordFields } from "@/components/admin/PasswordFields";

export const metadata = {
  title: "Choose a new password",
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <main id="main" className="admin-ui mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-5 py-16">
      <p className="text-xs uppercase tracking-[0.18em] text-gold">Buzz Boxx PXV</p>
      <h1 className="mt-3 font-display text-4xl leading-none">Choose a new password</h1>
      <p className="mt-3 text-base leading-7 text-muted">
        Open the link from your email, then set a password of at least 8 characters.
      </p>
      <div className="mt-8">
        <PasswordFields action={setPasswordFromReset} submitLabel="Update password" />
      </div>
    </main>
  );
}
