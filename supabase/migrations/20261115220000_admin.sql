-- Buzz Boxx PXV private admin.
-- Not applied by the app. Run this file in the Supabase SQL editor when you are ready.
-- Public intake stays insert-only. Authenticated rows in admin_users can read and change records.
-- The service role is never granted here and must stay on the server.

create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  role text not null default 'manager',
  created_at timestamptz not null default now(),
  constraint admin_users_role_check check (role in ('owner', 'manager')),
  constraint admin_users_email_check check (char_length(email) between 5 and 160)
);

comment on table public.admin_users is
  'Accounts allowed into /admin. Add a row only after the person has signed up in Supabase Auth.';

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

comment on function public.is_admin() is
  'True when the current authenticated user is listed in admin_users. Executable only by authenticated.';

revoke all on function public.is_admin() from public;
revoke all on function public.is_admin() from anon;
grant execute on function public.is_admin() to authenticated;

alter table public.bookings
  add column if not exists internal_notes text,
  add column if not exists scheduled_date date,
  add column if not exists scheduled_time text;

alter table public.bookings drop constraint if exists bookings_status_check;
alter table public.bookings
  add constraint bookings_status_check check (
    status in (
      'pending_payment',
      'requested',
      'new',
      'confirmed',
      'scheduled',
      'dispatched',
      'completed',
      'cancelled'
    )
  );

alter table public.membership_signups
  add column if not exists admin_notes text;

alter table public.membership_signups drop constraint if exists membership_status_check;
alter table public.membership_signups
  add constraint membership_status_check check (
    status in ('pending_payment', 'requested', 'pending', 'active', 'paused', 'cancelled')
  );

alter table public.event_inquiries
  add column if not exists quote_cents integer,
  add column if not exists admin_notes text;

alter table public.event_inquiries drop constraint if exists event_status_check;
alter table public.event_inquiries
  add constraint event_status_check check (
    status in ('requested', 'reviewing', 'confirmed', 'scheduled', 'declined', 'completed', 'cancelled')
  );

create table public.request_slots (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null references public.event_inquiries (id) on delete cascade,
  slot_date date not null,
  start_time text not null,
  end_time text not null,
  created_at timestamptz not null default now(),
  constraint request_slots_time_check check (
    char_length(start_time) between 4 and 8
    and char_length(end_time) between 4 and 8
  )
);

comment on table public.request_slots is
  'Four-hour blocks held for an event or program request.';

create index request_slots_inquiry_idx on public.request_slots (inquiry_id, slot_date);
create index bookings_scheduled_date_idx on public.bookings (scheduled_date);

create table public.availability_blocks (
  id uuid primary key default gen_random_uuid(),
  starts_on date not null,
  ends_on date not null,
  kind text not null,
  note text,
  created_at timestamptz not null default now(),
  constraint availability_kind_check check (kind in ('blackout', 'available')),
  constraint availability_range_check check (ends_on >= starts_on)
);

comment on table public.availability_blocks is
  'Closed dates and optional open windows. Public booking forms refuse a date inside a blackout. If any available row exists, dates outside those windows are closed too.';

create table public.membership_plans (
  id text primary key,
  name text not null,
  price_cents integer not null,
  cadence text not null default 'monthly',
  cuts text not null default '',
  summary text not null default '',
  features text[] not null default '{}',
  active boolean not null default true,
  sort_order integer not null default 0,
  featured boolean not null default false,
  stripe_price_id text not null default '',
  updated_at timestamptz not null default now(),
  constraint membership_plans_price_check check (price_cents >= 0)
);

create table public.site_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  event_date text not null default '',
  location text not null default '',
  description text not null default '',
  instagram_url text not null default '',
  image_url text not null default '',
  kind text not null default 'past',
  published boolean not null default true,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now(),
  constraint site_events_kind_check check (kind in ('past', 'upcoming'))
);

create table public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  alt text not null default '',
  instagram_url text not null default '',
  width integer not null default 1200,
  height integer not null default 1500,
  published boolean not null default true,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table public.site_copy (
  key text primary key,
  label text not null,
  value text not null,
  updated_at timestamptz not null default now()
);

create table public.site_settings (
  id integer primary key default 1,
  phone text not null default '',
  email text not null default '',
  instagram_url text not null default '',
  instagram_handle text not null default '',
  in_shop_url text not null default '',
  in_shop_label text not null default '',
  house_call_fee_cents integer,
  stripe_house_call_price_id text not null default '',
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1),
  constraint site_settings_fee_check check (house_call_fee_cents is null or house_call_fee_cents >= 0)
);

alter table public.admin_users enable row level security;
alter table public.request_slots enable row level security;
alter table public.availability_blocks enable row level security;
alter table public.membership_plans enable row level security;
alter table public.site_events enable row level security;
alter table public.gallery_items enable row level security;
alter table public.site_copy enable row level security;
alter table public.site_settings enable row level security;

alter table public.admin_users force row level security;
alter table public.request_slots force row level security;
alter table public.availability_blocks force row level security;
alter table public.membership_plans force row level security;
alter table public.site_events force row level security;
alter table public.gallery_items force row level security;
alter table public.site_copy force row level security;
alter table public.site_settings force row level security;

revoke all on table public.admin_users from public, anon, authenticated;
revoke all on table public.request_slots from public, anon, authenticated;
revoke all on table public.availability_blocks from public, anon, authenticated;
revoke all on table public.membership_plans from public, anon, authenticated;
revoke all on table public.site_events from public, anon, authenticated;
revoke all on table public.gallery_items from public, anon, authenticated;
revoke all on table public.site_copy from public, anon, authenticated;
revoke all on table public.site_settings from public, anon, authenticated;

grant select on table public.admin_users to authenticated;
create policy admin_users_select_self
  on public.admin_users
  for select
  to authenticated
  using (user_id = auth.uid());

grant select, update, delete on table public.bookings to authenticated;
grant select, update, delete on table public.membership_signups to authenticated;
grant select, update, delete on table public.event_inquiries to authenticated;
grant select, update, delete on table public.community_referrals to authenticated;
grant select, update, delete on table public.vendor_intakes to authenticated;

create policy bookings_admin_all
  on public.bookings
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy membership_signups_admin_all
  on public.membership_signups
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy event_inquiries_admin_all
  on public.event_inquiries
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy community_referrals_admin_all
  on public.community_referrals
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy vendor_intakes_admin_all
  on public.vendor_intakes
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

grant select, insert, update, delete on table public.request_slots to authenticated;
create policy request_slots_admin_all
  on public.request_slots
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

grant select on table public.availability_blocks to anon, authenticated;
grant insert, update, delete on table public.availability_blocks to authenticated;
create policy availability_public_read
  on public.availability_blocks
  for select
  to anon, authenticated
  using (true);
create policy availability_admin_write
  on public.availability_blocks
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

grant select on table public.membership_plans to anon, authenticated;
grant insert, update, delete on table public.membership_plans to authenticated;
create policy membership_plans_public_read
  on public.membership_plans
  for select
  to anon, authenticated
  using (active = true);
create policy membership_plans_admin_all
  on public.membership_plans
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

grant select on table public.site_events to anon, authenticated;
grant insert, update, delete on table public.site_events to authenticated;
create policy site_events_public_read
  on public.site_events
  for select
  to anon, authenticated
  using (published = true);
create policy site_events_admin_all
  on public.site_events
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

grant select on table public.gallery_items to anon, authenticated;
grant insert, update, delete on table public.gallery_items to authenticated;
create policy gallery_items_public_read
  on public.gallery_items
  for select
  to anon, authenticated
  using (published = true);
create policy gallery_items_admin_all
  on public.gallery_items
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

grant select on table public.site_copy to anon, authenticated;
grant insert, update, delete on table public.site_copy to authenticated;
create policy site_copy_public_read
  on public.site_copy
  for select
  to anon, authenticated
  using (true);
create policy site_copy_admin_all
  on public.site_copy
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

grant select on table public.site_settings to anon, authenticated;
grant insert, update, delete on table public.site_settings to authenticated;
create policy site_settings_public_read
  on public.site_settings
  for select
  to anon, authenticated
  using (true);
create policy site_settings_admin_all
  on public.site_settings
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-media',
  'site-media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists site_media_public_read on storage.objects;
drop policy if exists site_media_admin_insert on storage.objects;
drop policy if exists site_media_admin_update on storage.objects;
drop policy if exists site_media_admin_delete on storage.objects;

create policy site_media_public_read
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'site-media');

create policy site_media_admin_insert
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'site-media' and public.is_admin());

create policy site_media_admin_update
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'site-media' and public.is_admin())
  with check (bucket_id = 'site-media' and public.is_admin());

create policy site_media_admin_delete
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'site-media' and public.is_admin());

insert into public.membership_plans
  (id, name, price_cents, cadence, cuts, summary, features, active, sort_order, featured, stripe_price_id)
values
  (
    'the-lineup',
    'The Lineup',
    15000,
    'monthly',
    '1 house-call cut each month',
    'A standing monthly visit for one person who needs the chair to come to them.',
    array[
      'One traveling cut, beard tidy, or lineup',
      'Weekday priority windows before open booking',
      'Same barber, Mike Webb Jr., every visit',
      '24-hour reschedule courtesy'
    ],
    true,
    0,
    false,
    ''
  ),
  (
    'the-rotation',
    'The Rotation',
    27500,
    'monthly',
    '2 house-call cuts each month',
    'The house plan. Two visits a month, beard and lineup included, plus room for one person in the household.',
    array[
      'Two traveling cuts each month',
      'Beard and lineup at each visit',
      'One household add-on at the member visit rate',
      'Priority scheduling across all seven days'
    ],
    true,
    1,
    true,
    ''
  ),
  (
    'the-residence',
    'The Residence',
    45000,
    'monthly',
    '4 house-call cuts each month',
    'For a household that wants the chair on a rhythm. Four visits, first look at the calendar, and a quarterly event touch-up credit.',
    array[
      'Four traveling cuts each month',
      'Beard, lineup, and hot-towel finish',
      'Two household add-ons',
      'First-look scheduling',
      'One event-day touch-up credit each quarter'
    ],
    true,
    2,
    false,
    ''
  )
on conflict (id) do nothing;

insert into public.site_events
  (title, event_date, location, description, instagram_url, image_url, kind, published, sort_order)
values
  (
    'Back 2 Better Youth Haircut Session',
    'Summer 2026',
    '',
    'Youth haircut session with the Buzz Boxx van, sponsored by C Mitch Pitch Sports Agency.',
    'https://www.instagram.com/buzzboxxpxv/reel/DZuboJGhTh-/',
    '',
    'past',
    true,
    0
  ),
  (
    'Divine Insurance Group Free Haircuts',
    'Oct 20, 2026',
    'Triangle Village, 3701 Brown St, Philadelphia',
    $detail$Free full-service men's cuts and trims/eyebrow services for women, sponsored by Divine Insurance Group with the Back to Better campaign.$detail$,
    'https://www.instagram.com/buzzboxxpxv/reel/DerXEJtvIIy/',
    '',
    'past',
    true,
    1
  ),
  (
    'Street outreach in the van',
    'Summer 2026',
    '',
    'Haircuts for neighbors experiencing homelessness.',
    'https://www.instagram.com/buzzboxxpxv/reel/DZr1vJ6xDr5/',
    '',
    'past',
    true,
    2
  );

insert into public.gallery_items (image_url, alt, width, height, published, sort_order)
values
  ('/images/mike-webb.webp', 'Mike Webb Jr. wearing black gloves and lining up a haircut. The client wears a Philly Fades cape.', 310, 440, true, 0),
  ('/images/mike-work-02.webp', 'A tight skin fade with a short beard, cut by Mike Webb Jr.', 723, 904, true, 1),
  ('/images/mike-work-06.webp', 'Profile of a low fade and short beard in the barber chair, finished by Mike Webb Jr.', 1707, 2560, true, 2),
  ('/images/mike-work-07.webp', 'A high skin fade photographed from the side in the shop, from Mike Webb Jr.’s portfolio.', 1707, 2560, true, 3),
  ('/images/mike-work-01.webp', 'Textured crop with a mid fade and a full beard, cut by Mike Webb Jr.', 1079, 1154, true, 4),
  ('/images/mike-work-03.webp', 'Curly texture on top with a high fade and a crisp neckline, from Mike Webb Jr.’s work.', 957, 637, true, 5),
  ('/images/mike-work-08.webp', 'Curly top with a low fade and a clean part, cut by Mike Webb Jr.', 1707, 2560, true, 6),
  ('/images/mike-work-04.webp', 'Curly top with blonde highlights and a tight taper, from Mike Webb Jr.’s portfolio.', 796, 624, true, 7),
  ('/images/mike-work-05.webp', 'A shaped salt-and-pepper beard on a bald head, groomed by Mike Webb Jr.', 1079, 1098, true, 8);

insert into public.site_copy (key, label, value) values
  ('home.hero.lead', 'Home hero lead', 'We come to'),
  ('home.hero.accent', 'Home hero accent', 'you'),
  ('home.hero.subheadline', 'Home hero subheadline', $copy$Buzz Boxx PXV is Mike Webb Jr.’s house-call chair. Memberships and house calls happen in the home. The van is for community days and events across Philadelphia, Montgomery, and Chester Counties. Officially dispatched from Barbers on Broad.$copy$),
  ('home.memberships.intro', 'Home memberships intro', 'Recurring house-call cuts for one person or a household. Priority windows, beard and lineup work, and family add-ons as the plan grows. Example rates, shown for planning.'),
  ('home.events.intro', 'Home events intro', 'The van can sit for one slot or several, back-to-back or overlapping. Barber count, setup, and price are worked out with Mike after the inquiry.'),
  ('about.intro', 'About intro', $copy$Philly Fades Haircuts LLC d/b/a Buzz Boxx PXV. One barber. A host shop on North Broad Street. A community practice that started as Philly Fades and now books as Buzz Boxx PXV.$copy$),
  ('programs.intro', 'Programs intro', $copy$Senior buildings, shelters, schools, veteran groups, case managers, nonprofits, and event organizers call Mike Webb Jr. when a haircut would help and getting to a shop is the hard part. He sets up where you already are.$copy$),
  ('events.hero.lead', 'Events hero lead', 'Bring the chair to the'),
  ('events.hero.accent', 'Events hero accent', 'room'),
  ('events.intro', 'Events intro', 'Events are booked in 4-hour slots. Book one, or book several. Slots can run back-to-back for a full day, or overlap when a bigger crowd needs more than one chair at the same time.')
on conflict (key) do nothing;

insert into public.site_settings
  (id, phone, email, instagram_url, instagram_handle, in_shop_url, in_shop_label, house_call_fee_cents, stripe_house_call_price_id)
values
  (
    1,
    '',
    '',
    'https://www.instagram.com/philly_fades_ig/',
    '@philly_fades_ig',
    'https://barbers-on-broad-llc.square.site',
    'Book In-Shop Chair (North Philly)',
    null,
    ''
  )
on conflict (id) do nothing;

-- After michaelwwebb2292@gmail.com exists in Authentication, run:
--
-- insert into public.admin_users (user_id, email, role)
-- select id, email, 'owner'
-- from auth.users
-- where email = 'michaelwwebb2292@gmail.com';
