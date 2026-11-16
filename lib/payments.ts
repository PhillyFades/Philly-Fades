export type CheckoutRequest = {
  kind: "booking" | "membership";
  referenceId: string;
  amountCents: number | null;
  description: string;
  customerEmail: string;
};

export type CheckoutResult = { mode: "request"; url: null } | { mode: "stripe"; url: string };

/**
 * Stripe is not connected.
 *
 * TODO: When the client is ready, install `stripe` and create a Checkout Session here.
 * - Memberships: `mode: "subscription"` with a Price that matches `content/pricing.ts`.
 * - Single house calls with a known amount: `mode: "payment"`.
 * - Invoice, voucher, and quote visits should stay on the request path.
 * Success and cancel URLs can return to `/book`. Write the Checkout Session id
 * back onto the booking or membership row, then mark `status` paid from the webhook.
 * Do not add Stripe keys to this repo until that account exists.
 *
 * Until then this returns a request/pending-payment result and the form
 * keeps the Supabase row in `pending_payment`.
 */
export async function startCheckout(request: CheckoutRequest): Promise<CheckoutResult> {
  void request;
  return { mode: "request", url: null };
}
