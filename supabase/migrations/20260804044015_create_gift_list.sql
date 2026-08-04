create table public.gifts (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 120),
  image_url text,
  color text,
  description text,
  preferences text[] not null default '{}',
  reference_value numeric(10, 2) check (reference_value is null or reference_value >= 0),
  reference_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.reservations (
  gift_id uuid primary key references public.gifts(id) on delete cascade,
  guest_name text not null check (char_length(trim(guest_name)) between 1 and 80),
  created_at timestamptz not null default now()
);

alter table public.gifts enable row level security;
alter table public.reservations enable row level security;

create function public.is_admin()
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false)
$$;

revoke all on public.gifts, public.reservations from anon, authenticated;
grant select on public.gifts to anon, authenticated;
grant select (gift_id) on public.reservations to anon;
grant insert (gift_id, guest_name) on public.reservations to anon;
grant select on public.reservations to authenticated;
grant insert, update, delete on public.gifts to authenticated;

create policy "public reads gifts"
on public.gifts for select to anon, authenticated
using (true);

create policy "admin manages gifts"
on public.gifts for all to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "public reads availability"
on public.reservations for select to anon
using (true);

create policy "public creates reservation"
on public.reservations for insert to anon
with check (char_length(trim(guest_name)) between 1 and 80);

create policy "admin reads reservations"
on public.reservations for select to authenticated
using ((select public.is_admin()));
