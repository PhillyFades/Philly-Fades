-- Not applied by the app. Run this in the Supabase SQL editor when you are ready.
-- Both questions are optional, so existing rows stay valid with null.

alter table public.bookings
  add column if not exists is_veteran boolean;

alter table public.bookings
  add column if not exists has_disability text;

alter table public.bookings
  drop constraint if exists bookings_has_disability_check;

alter table public.bookings
  add constraint bookings_has_disability_check
  check (has_disability is null or has_disability in ('yes', 'no', 'prefer_not_to_say'));

alter table public.membership_signups
  add column if not exists is_veteran boolean;

alter table public.membership_signups
  add column if not exists has_disability text;

alter table public.membership_signups
  drop constraint if exists membership_has_disability_check;

alter table public.membership_signups
  add constraint membership_has_disability_check
  check (has_disability is null or has_disability in ('yes', 'no', 'prefer_not_to_say'));
