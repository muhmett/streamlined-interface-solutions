-- =============================================================
-- M3allem — المعلّم — Supabase schema
-- Run this in the Supabase SQL editor (or `supabase db push`).
-- =============================================================

-- ---------- profiles (mirror of auth.users) ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'client' check (role in ('client', 'artisan')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles are readable by everyone"
  on public.profiles for select using (true);

create policy "users manage their own profile"
  on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Auto-create a profile row on signup (Google or phone OTP).
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.phone),
    new.phone
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- artisans ----------
create table if not exists public.artisans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users (id) on delete set null, -- one listing per artisan
  name text not null,
  category text not null check (category in (
    'plumbing','electricity','carpentry','painting','masonry',
    'ac','cleaning','gardening','welding','locksmith'
  )),
  city text not null default '',
  avatar_url text,
  bio text not null default '',
  phone text not null default '',
  is_verified boolean not null default false,
  rating numeric(2,1) not null default 0,
  review_count integer not null default 0,
  jobs_done integer not null default 0,
  years_experience integer not null default 0,
  lat double precision not null default 0,
  lng double precision not null default 0,
  created_at timestamptz not null default now()
);

alter table public.artisans enable row level security;

create policy "artisans are readable by everyone"
  on public.artisans for select using (true);

create policy "artisans manage their own listing"
  on public.artisans for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------- reviews ----------
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  artisan_id uuid not null references public.artisans (id) on delete cascade,
  author_id uuid not null references auth.users (id) on delete cascade,
  author_name text not null default '',
  rating integer not null check (rating between 1 and 5),
  comment text not null default '',
  created_at timestamptz not null default now(),
  unique (artisan_id, author_id) -- one review per client per artisan
);

alter table public.reviews enable row level security;

create policy "reviews are readable by everyone"
  on public.reviews for select using (true);

create policy "authenticated users write their own reviews"
  on public.reviews for insert
  with check (auth.uid() = author_id);

create policy "authors update their own reviews"
  on public.reviews for update
  using (auth.uid() = author_id);

-- Keep artisan aggregates in sync.
create or replace function public.refresh_artisan_rating()
returns trigger
language plpgsql security definer set search_path = public as $$
declare
  target uuid := coalesce(new.artisan_id, old.artisan_id);
begin
  update public.artisans a set
    rating = coalesce((select round(avg(r.rating)::numeric, 1) from public.reviews r where r.artisan_id = target), 0),
    review_count = (select count(*) from public.reviews r where r.artisan_id = target)
  where a.id = target;
  return null;
end;
$$;

drop trigger if exists on_review_change on public.reviews;
create trigger on_review_change
  after insert or update or delete on public.reviews
  for each row execute function public.refresh_artisan_rating();

-- ---------- verification requests (ID documents → Verified badge) ----------
create table if not exists public.verification_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  id_front_path text not null,
  id_back_path text not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.verification_requests enable row level security;

create policy "users see their own verification requests"
  on public.verification_requests for select
  using (auth.uid() = user_id);

create policy "users submit their own verification requests"
  on public.verification_requests for insert
  with check (auth.uid() = user_id);

-- When an admin flips status to approved, stamp the artisan as verified.
create or replace function public.handle_verification_approved()
returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.status = 'approved' and old.status is distinct from 'approved' then
    update public.artisans set is_verified = true where user_id = new.user_id;
    new.reviewed_at := now();
  end if;
  return new;
end;
$$;

drop trigger if exists on_verification_approved on public.verification_requests;
create trigger on_verification_approved
  before update on public.verification_requests
  for each row execute function public.handle_verification_approved();

-- ---------- storage bucket for ID documents (private!) ----------
insert into storage.buckets (id, name, public)
values ('id-documents', 'id-documents', false)
on conflict (id) do nothing;

create policy "users upload their own id documents"
  on storage.objects for insert
  with check (bucket_id = 'id-documents' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "users read their own id documents"
  on storage.objects for select
  using (bucket_id = 'id-documents' and (storage.foldername(name))[1] = auth.uid()::text);

-- ---------- nearby search RPC (server-side distance filter) ----------
-- The client can also filter with the haversine util; this RPC is for
-- large datasets where filtering must happen in the database.
create or replace function public.nearby_artisans(
  user_lat double precision,
  user_lng double precision,
  max_km double precision default 50,
  filter_category text default null
)
returns setof public.artisans
language sql stable as $$
  select *
  from public.artisans a
  where (filter_category is null or a.category = filter_category)
    and 6371 * 2 * asin(sqrt(
      power(sin(radians(a.lat - user_lat) / 2), 2) +
      cos(radians(user_lat)) * cos(radians(a.lat)) *
      power(sin(radians(a.lng - user_lng) / 2), 2)
    )) <= max_km
  order by 6371 * 2 * asin(sqrt(
      power(sin(radians(a.lat - user_lat) / 2), 2) +
      cos(radians(user_lat)) * cos(radians(a.lat)) *
      power(sin(radians(a.lng - user_lng) / 2), 2)
    ));
$$;
