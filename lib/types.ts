export type FieldErrors = Record<string, string>;

export type ActionResult =
  | {
      ok: true;
      id: string;
      checkoutUrl: string | null;
    }
  | {
      ok: false;
      error: string;
      code: "not_configured" | "validation" | "insert_failed";
      fieldErrors?: FieldErrors;
    };

export const NOT_CONFIGURED_MESSAGE =
  "Online requests are not configured yet. The form is ready, and it will save once Supabase is connected. Until then, reach Buzz Boxx PXV on Instagram. Phone and email on this site are still placeholders.";
