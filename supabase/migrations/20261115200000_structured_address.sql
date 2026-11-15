-- Not applied by the app. Run this in the Supabase SQL editor when you are ready.
-- Existing single address columns stay. These parts may be null on older rows.

alter table public.bookings
  add column if not exists address_line1 text,
  add column if not exists address_line2 text,
  add column if not exists city text,
  add column if not exists state text,
  add column if not exists zip text;

alter table public.bookings
  drop constraint if exists bookings_zip_check;

alter table public.bookings
  add constraint bookings_zip_check
  check (zip is null or zip ~ '^[0-9]{5}$');

alter table public.membership_signups
  add column if not exists address_line1 text,
  add column if not exists address_line2 text,
  add column if not exists city text,
  add column if not exists state text,
  add column if not exists zip text;

alter table public.membership_signups
  drop constraint if exists membership_zip_check;

alter table public.membership_signups
  add constraint membership_zip_check
  check (zip is null or zip ~ '^[0-9]{5}$');

alter table public.event_inquiries
  add column if not exists address_line1 text,
  add column if not exists address_line2 text,
  add column if not exists city text,
  add column if not exists state text,
  add column if not exists zip text;

alter table public.event_inquiries
  drop constraint if exists event_zip_check;

alter table public.event_inquiries
  add constraint event_zip_check
  check (zip is null or zip ~ '^[0-9]{5}$');

alter table public.community_referrals
  add column if not exists address_line1 text,
  add column if not exists address_line2 text,
  add column if not exists city text,
  add column if not exists state text,
  add column if not exists zip text;

alter table public.community_referrals
  drop constraint if exists referral_zip_check;

alter table public.community_referrals
  add constraint referral_zip_check
  check (zip is null or zip ~ '^[0-9]{5}$');
