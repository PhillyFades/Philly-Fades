# Buzz Boxx PXV

Premium traveling-barber site for **Philly Fades Haircuts LLC d/b/a Buzz Boxx PXV**, led by Mike Webb Jr. House calls and memberships are the product. Community and corporate events are next. Every house call is dispatched from **Barbers on Broad, 1220 N Broad St Ste 3, Philadelphia, PA 19121**.

Next.js (App Router) and Tailwind CSS. Deploy on Vercel with no extra config. Supabase stores bookings (the dispatch log), membership signups, event inquiries, community referrals, and institutional vendor intake. Stripe is not connected.

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

The site builds and renders when the env vars are empty. Forms then show a “not configured” message instead of failing the build.

## Environment variables

| Name | Where |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key. Insert-only under RLS. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only. Preferred by the server actions. Never prefix it with `NEXT_PUBLIC_`. |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata, the sitemap, and JSON-LD. |

There are no Stripe keys. Do not add them until `lib/payments.ts` is implemented.

## Apply the database migration

The schema lives in `supabase/migrations/20261115120000_intake_and_dispatch.sql`.

With the Supabase CLI, linked to the project:

```bash
supabase db push
```

Or paste the file into the Supabase SQL editor and run it once.

RLS is on for every intake table. `anon` and `authenticated` can insert and cannot read, update, or delete. The service role, used only in server actions, bypasses RLS. Bookings require `eligibility_confirmed = true`.

### Tables

- `bookings` — house-call requests and the dispatch log (client, date and time, address, demographic category, fee/plan, status).
- `membership_signups` — recurring house-call plans, stored as `pending_payment`.
- `event_inquiries` — community, corporate, and private event requests.
- `community_referrals` — program intake, including Sponsor a Cut, shelter, school, caregiver, and veteran requests.
- `vendor_intakes` — foundations, agencies, and other institutional partners.

## Vercel

Import the repo. Framework preset is Next.js. Add the env vars above to Production and Preview, then deploy. No `vercel.json` is required. Set the env vars before the first production build so the “configured” banner matches the live project. Server actions re-check the env at request time.

## Where Stripe plugs in

`lib/payments.ts` exports `startCheckout()`. It currently returns `{ mode: "request", url: null }`. Booking and membership actions already call it after a successful insert.

When the client is ready:

1. Create Prices that match `content/pricing.ts`.
2. Implement `startCheckout()` with a Checkout Session (`subscription` for memberships, `payment` for a known single-visit amount).
3. Return `{ mode: "stripe", url }`. The form redirects when `checkoutUrl` is set.
4. Add a webhook to move `status` off `pending_payment`. Leave invoice and voucher bookings on the request path.

Do not auto-charge from the current forms. Self-pay rows stay `pending_payment`. Invoice and voucher rows stay `requested`.

## Placeholder content to confirm

See the final pull request notes. Membership prices in `content/pricing.ts` are marked `PLACEHOLDER PRICING - confirm with client`. Event dates are not priced on the site; Mike prices them after an inquiry. Phone, email, and the default site URL are placeholders. The PDFs in `public/docs/` are stand-ins for the program one-pager, licensing packet, and COI. Past and upcoming event cards on `/events` are marked “add later.”

## Scripts

```bash
npm run dev
npm run build
npm run lint
```
