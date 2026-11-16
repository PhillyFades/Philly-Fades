import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseServer } from "@/lib/supabase/server";

export function adminPreviewEnabled() {
  return process.env.NODE_ENV !== "production" && process.env.ADMIN_SCREENSHOT === "1";
}

export type AdminSession = {
  preview: boolean;
  email: string;
  mustChangePassword: boolean;
  supabase: SupabaseClient | null;
};

export async function requireAdmin(): Promise<AdminSession> {
  if (adminPreviewEnabled()) {
    return {
      preview: true,
      email: "michaelwwebb2292@gmail.com",
      mustChangePassword: true,
      supabase: null,
    };
  }

  const supabase = await createSupabaseServer();
  if (!supabase) redirect("/admin/login?error=config");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data, error } = await supabase.from("admin_users").select("email, role").eq("user_id", user.id).maybeSingle();
  if (error) redirect("/admin/login?error=setup");
  if (!data) redirect("/admin/login?error=not-allowed");

  return {
    preview: false,
    email: data.email || user.email || "",
    mustChangePassword: user.user_metadata?.must_change_password === true,
    supabase,
  };
}
