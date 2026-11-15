-- Buzz Boxx PXV intake tables.
-- bookings is the dispatch log for out-of-shop visits sponsored by
-- Barbers on Broad (49 Pa. Code § 3.61).
--
-- Access model: anonymous and authenticated users may INSERT and may not
-- read, update, or delete. The service role (server actions only) bypasses
-- RLS. Do not add a SELECT policy for anon or authenticated.

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  client_name text not null,
  client_phone text,
  client_email text,
  requested_date date not null,
  requested_time text not null,
  service_address text not null,
  service_county text not null,
  demographic_category text not null,
  fee_plan text not null,
  fee_cents integer,
  status text not null default 'pending_payment',
  eligibility_confirmed boolean not null,
  eligibility_basis text not null,
  booking_on_behalf boolean not null default false,
  referrer_name text,
  referrer_organization text,
  referrer_role text,
  referrer_contact text,
  payment_method text not null,
  notes text,
  dispatched_from text not null default 'Barbers on Broad, 1220 N Broad St Ste 3, Philadelphia, PA 19121',
  barber_name text not null default 'Mike Webb Jr',
  constraint bookings_name_length check (char_length(client_name) between 2 and 120),
  constraint bookings_address_length check (char_length(service_address) between 6 and 400),
  constraint bookings_time_length check (char_length(requested_time) between 1 and 20),
  constraint bookings_county_check check (service_county in ('Philadelphia', 'Montgomery', 'Chester')),
  constraint bookings_demographic_check check (
    demographic_category in (
      'general',
      'senior_homebound',
      'sensory_developmental',
      'veteran',
      'unhoused',
      'youth',
      'prefer_not_to_say'
    )
  ),
  constraint bookings_status_check check (
    status in ('pending_payment', 'requested', 'confirmed', 'dispatched', 'completed', 'cancelled')
  ),
  constraint bookings_payment_check check (
    payment_method in ('pending_card', 'invoice', 'voucher', 'membership', 'sponsor')
  ),
  constraint bookings_eligibility_check check (eligibility_confirmed = true),
  constraint bookings_contact_check check (
    coalesce(char_length(client_phone), 0) >= 7
    or coalesce(char_length(client_email), 0) >= 5
  ),
  constraint bookings_referrer_check check (
    booking_on_behalf = false
    or (
      referrer_name is not null
      and char_length(referrer_name) >= 2
      and referrer_contact is not null
      and char_length(referrer_contact) >= 5
    )
  )
);

comment on table public.bookings is
  'House-call requests and the dispatch log. Public insert only. No public reads.';

create index bookings_created_at_idx on public.bookings (created_at desc);
create index bookings_status_idx on public.bookings (status);
create index bookings_demographic_idx on public.bookings (demographic_category);
create index bookings_requested_date_idx on public.bookings (requested_date);

create table public.membership_signups (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  email text not null,
  phone text not null,
  service_address text not null,
  service_county text not null,
  tier_id text not null,
  tier_name text not null,
  price_cents integer not null,
  demographic_category text not null,
  household_notes text,
  status text not null default 'pending_payment',
  eligibility_confirmed boolean not null,
  eligibility_basis text not null,
  constraint membership_status_check check (
    status in ('pending_payment', 'requested', 'active', 'paused', 'cancelled')
  ),
  constraint membership_eligibility_check check (eligibility_confirmed = true),
  constraint membership_county_check check (service_county in ('Philadelphia', 'Montgomery', 'Chester')),
  constraint membership_demographic_check check (
    demographic_category in (
      'general',
      'senior_homebound',
      'sensory_developmental',
      'veteran',
      'unhoused',
      'youth',
      'prefer_not_to_say'
    )
  )
);

comment on table public.membership_signups is
  'Recurring house-call membership requests. Public insert only. No public reads.';

create index membership_signups_created_at_idx on public.membership_signups (created_at desc);

create table public.event_inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  contact_name text not null,
  organization text not null,
  email text not null,
  phone text not null,
  package_id text not null,
  package_name text not null,
  starting_price_cents integer,
  event_date date not null,
  event_location text not null,
  location_type text not null,
  guest_count integer not null,
  notes text,
  compliance_acknowledged boolean not null,
  eligibility_confirmed boolean not null default false,
  status text not null default 'requested',
  constraint event_status_check check (
    status in ('requested', 'reviewing', 'confirmed', 'declined', 'completed', 'cancelled')
  ),
  constraint event_location_type_check check (
    location_type in ('institution', 'community_site', 'residence', 'other')
  ),
  constraint event_compliance_check check (compliance_acknowledged = true),
  constraint event_residence_eligibility_check check (
    location_type <> 'residence' or eligibility_confirmed = true
  ),
  constraint event_guest_count_check check (guest_count between 1 and 500)
);

comment on table public.event_inquiries is
  'Community, corporate, and private event requests. Public insert only. No public reads.';

create index event_inquiries_created_at_idx on public.event_inquiries (created_at desc);

create table public.community_referrals (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  program text not null,
  request_type text not null,
  contact_name text not null,
  organization text,
  email text,
  phone text,
  site_name text,
  site_address text not null,
  preferred_date date,
  headcount text,
  message text not null,
  status text not null default 'requested',
  constraint referral_program_check check (
    program in (
      'seniors_homebound',
      'sensory',
      'veterans',
      'unhoused',
      'youth',
      'sponsor_a_cut'
    )
  ),
  constraint referral_status_check check (
    status in ('requested', 'reviewing', 'scheduled', 'declined', 'completed')
  ),
  constraint referral_contact_check check (
    coalesce(char_length(email), 0) >= 5
    or coalesce(char_length(phone), 0) >= 7
  )
);

comment on table public.community_referrals is
  'Program referral and intake, including Sponsor a Cut and shelter or school requests. Public insert only. No public reads.';

create index community_referrals_created_at_idx on public.community_referrals (created_at desc);
create index community_referrals_program_idx on public.community_referrals (program);

create table public.vendor_intakes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  organization text not null,
  contact_name text not null,
  title text not null,
  email text not null,
  phone text not null,
  organization_type text not null,
  counties text not null,
  populations text,
  needs_coi boolean not null default false,
  needs_w9 boolean not null default false,
  message text not null,
  status text not null default 'received',
  constraint vendor_type_check check (
    organization_type in (
      'foundation',
      'case_management',
      'housing',
      'va',
      'school',
      'health',
      'other'
    )
  ),
  constraint vendor_status_check check (
    status in ('received', 'reviewing', 'approved', 'declined')
  )
);

comment on table public.vendor_intakes is
  'Institutional and vendor intake for foundations, agencies, and case-management partners. Public insert only. No public reads.';

create index vendor_intakes_created_at_idx on public.vendor_intakes (created_at desc);

alter table public.bookings enable row level security;
alter table public.membership_signups enable row level security;
alter table public.event_inquiries enable row level security;
alter table public.community_referrals enable row level security;
alter table public.vendor_intakes enable row level security;

alter table public.bookings force row level security;
alter table public.membership_signups force row level security;
alter table public.event_inquiries force row level security;
alter table public.community_referrals force row level security;
alter table public.vendor_intakes force row level security;

revoke all on table public.bookings from public, anon, authenticated;
revoke all on table public.membership_signups from public, anon, authenticated;
revoke all on table public.event_inquiries from public, anon, authenticated;
revoke all on table public.community_referrals from public, anon, authenticated;
revoke all on table public.vendor_intakes from public, anon, authenticated;

grant insert on table public.bookings to anon, authenticated;
grant insert on table public.membership_signups to anon, authenticated;
grant insert on table public.event_inquiries to anon, authenticated;
grant insert on table public.community_referrals to anon, authenticated;
grant insert on table public.vendor_intakes to anon, authenticated;

create policy bookings_public_insert
  on public.bookings
  for insert
  to anon, authenticated
  with check (eligibility_confirmed = true);

create policy membership_signups_public_insert
  on public.membership_signups
  for insert
  to anon, authenticated
  with check (eligibility_confirmed = true);

create policy event_inquiries_public_insert
  on public.event_inquiries
  for insert
  to anon, authenticated
  with check (compliance_acknowledged = true);

create policy community_referrals_public_insert
  on public.community_referrals
  for insert
  to anon, authenticated
  with check (char_length(message) >= 8);

create policy vendor_intakes_public_insert
  on public.vendor_intakes
  for insert
  to anon, authenticated
  with check (char_length(organization) >= 2 and char_length(message) >= 8);
