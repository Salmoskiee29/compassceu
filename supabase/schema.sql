-- CompassCEU learner schema
-- Run once in Supabase → SQL Editor → New query → paste → Run.
-- Safe to re-run: it drops and recreates the policies/functions/trigger it owns.

-- ---------------------------------------------------------------------------
-- Profiles (one per auth user, created automatically on sign-up)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id             uuid primary key references auth.users (id) on delete cascade,
  full_name      text not null default '',
  profession     text check (profession in ('RN', 'LVN', 'CNA', 'HHA')),
  license_number text,
  created_at     timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Enrollments (written by the server after checkout — never by the browser)
-- ---------------------------------------------------------------------------
create table if not exists public.enrollments (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  course_slug  text not null,
  amount_cents integer not null default 0,
  currency     text not null default 'USD',
  payment_ref  text,
  status       text not null default 'paid' check (status in ('paid', 'refunded')),
  created_at   timestamptz not null default now(),
  unique (user_id, course_slug)
);

-- ---------------------------------------------------------------------------
-- Lesson progress
-- ---------------------------------------------------------------------------
create table if not exists public.lesson_progress (
  user_id      uuid not null references auth.users (id) on delete cascade,
  course_slug  text not null,
  lesson_id    text not null,
  completed_at timestamptz not null default now(),
  primary key (user_id, course_slug, lesson_id)
);

-- ---------------------------------------------------------------------------
-- Quiz attempts
-- ---------------------------------------------------------------------------
create table if not exists public.quiz_attempts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  course_slug text not null,
  score       integer not null,
  total       integer not null,
  passed      boolean not null,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Certificates (issued by the server when the final quiz is passed)
-- ---------------------------------------------------------------------------
create table if not exists public.certificates (
  id             text primary key,            -- e.g. CCEU-2026-7K4QPZ
  user_id        uuid not null references auth.users (id) on delete cascade,
  course_slug    text not null,
  holder_name    text not null,
  license_number text,
  ceus           numeric(5, 2) not null,
  issued_at      timestamptz not null default now(),
  unique (user_id, course_slug)
);

-- ---------------------------------------------------------------------------
-- Row Level Security: learners can read their own rows. Writes to
-- enrollments / progress / attempts / certificates happen server-side with
-- the secret key, so there are deliberately no insert/update policies there.
-- ---------------------------------------------------------------------------
alter table public.profiles        enable row level security;
alter table public.enrollments     enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.quiz_attempts   enable row level security;
alter table public.certificates    enable row level security;

drop policy if exists "profiles: read own"   on public.profiles;
drop policy if exists "profiles: update own" on public.profiles;
create policy "profiles: read own"   on public.profiles for select using (auth.uid() = id);
create policy "profiles: update own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "enrollments: read own" on public.enrollments;
create policy "enrollments: read own" on public.enrollments for select using (auth.uid() = user_id);

drop policy if exists "progress: read own" on public.lesson_progress;
create policy "progress: read own" on public.lesson_progress for select using (auth.uid() = user_id);

drop policy if exists "attempts: read own" on public.quiz_attempts;
create policy "attempts: read own" on public.quiz_attempts for select using (auth.uid() = user_id);

drop policy if exists "certificates: read own" on public.certificates;
create policy "certificates: read own" on public.certificates for select using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Create a profile row whenever someone signs up
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, profession, license_number)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    case when new.raw_user_meta_data ->> 'profession' in ('RN', 'LVN', 'CNA', 'HHA')
         then new.raw_user_meta_data ->> 'profession' end,
    nullif(new.raw_user_meta_data ->> 'license_number', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Public certificate verification (anyone with the ID can check it,
-- but only these fields are exposed — no emails, no user ids)
-- ---------------------------------------------------------------------------
create or replace function public.verify_certificate(cert_id text)
returns table (id text, holder_name text, course_slug text, ceus numeric, issued_at timestamptz)
language sql
stable
security definer
set search_path = ''
as $$
  select c.id, c.holder_name, c.course_slug, c.ceus, c.issued_at
  from public.certificates c
  where c.id = upper(trim(cert_id));
$$;

revoke all on function public.verify_certificate(text) from public;
grant execute on function public.verify_certificate(text) to anon, authenticated;
