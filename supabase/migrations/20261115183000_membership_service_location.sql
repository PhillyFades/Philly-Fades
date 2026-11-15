-- Not applied by the app. Run this in the Supabase SQL editor when you are ready.
-- Existing rows stay valid: service_location may be null, and demographic_category may be null.

alter table public.membership_signups
  add column if not exists service_location text;

alter table public.membership_signups
  drop constraint if exists membership_service_location_check;

alter table public.membership_signups
  add constraint membership_service_location_check
  check (service_location is null or service_location in ('van', 'home'));

alter table public.membership_signups
  alter column demographic_category drop not null;

alter table public.membership_signups
  drop constraint if exists membership_demographic_check;

alter table public.membership_signups
  add constraint membership_demographic_check
  check (
    demographic_category is null
    or demographic_category in (
      'general',
      'senior_homebound',
      'sensory_developmental',
      'veteran',
      'unhoused',
      'youth',
      'prefer_not_to_say'
    )
  );
