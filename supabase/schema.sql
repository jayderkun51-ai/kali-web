-- Kali-Web base schema (Phase 2)
-- Run this in Supabase SQL Editor.

create extension if not exists "pgcrypto";

-- =========
-- Profiles
-- =========
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  username text not null check (char_length(username) between 3 and 32),
  role text not null default 'super_pobre' check (role in ('super_pobre', 'compi_pro', 'dios_admin')),
  avatar_url text,
  banned boolean not null default false,
  word_count integer not null default 0,
  photo_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles(role);
create unique index if not exists profiles_username_unique on public.profiles(lower(username));

-- Keep timestamps fresh
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- =============
-- Chat messages
-- =============
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null check (char_length(content) between 1 and 1200),
  created_at timestamptz not null default now()
);

create index if not exists chat_messages_created_at_idx on public.chat_messages(created_at desc);
create index if not exists chat_messages_user_id_idx on public.chat_messages(user_id);

-- =========
-- Wall photos
-- =========
create table if not exists public.wall_photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  image_url text not null,
  storage_path text,
  caption text check (char_length(caption) <= 240),
  created_at timestamptz not null default now()
);

create index if not exists wall_photos_created_at_idx on public.wall_photos(created_at desc);
create index if not exists wall_photos_user_id_idx on public.wall_photos(user_id);

-- ====================
-- Global announcements
-- ====================
create table if not exists public.global_announcements (
  id uuid primary key default gen_random_uuid(),
  content text not null check (char_length(content) between 1 and 400),
  active boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists global_announcements_active_idx on public.global_announcements(active);
create index if not exists global_announcements_created_at_idx on public.global_announcements(created_at desc);

-- ============
-- Enable RLS
-- ============
alter table public.profiles enable row level security;
alter table public.chat_messages enable row level security;
alter table public.wall_photos enable row level security;
alter table public.global_announcements enable row level security;

-- Drop policies if they already exist (safe reruns)
drop policy if exists profiles_select_authenticated on public.profiles;
drop policy if exists profiles_insert_own on public.profiles;
drop policy if exists profiles_update_own on public.profiles;
drop policy if exists profiles_admin_update_any on public.profiles;

drop policy if exists chat_select_authenticated on public.chat_messages;
drop policy if exists chat_insert_own on public.chat_messages;
drop policy if exists chat_delete_admin_or_owner on public.chat_messages;

drop policy if exists photos_select_authenticated on public.wall_photos;
drop policy if exists photos_insert_own on public.wall_photos;
drop policy if exists photos_delete_admin_or_owner on public.wall_photos;

drop policy if exists announcements_select_authenticated on public.global_announcements;
drop policy if exists announcements_insert_admin_only on public.global_announcements;
drop policy if exists announcements_update_admin_only on public.global_announcements;
drop policy if exists announcements_delete_admin_only on public.global_announcements;

-- ============
-- RLS policies
-- ============
create policy profiles_select_authenticated
on public.profiles
for select
to authenticated
using (true);

create policy profiles_insert_own
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

create policy profiles_update_own
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy profiles_admin_update_any
on public.profiles
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'dios_admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'dios_admin'
  )
);

create policy chat_select_authenticated
on public.chat_messages
for select
to authenticated
using (true);

create policy chat_insert_own
on public.chat_messages
for insert
to authenticated
with check (auth.uid() = user_id);

create policy chat_delete_admin_or_owner
on public.chat_messages
for delete
to authenticated
using (
  auth.uid() = user_id
  or exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'dios_admin'
  )
);

create policy photos_select_authenticated
on public.wall_photos
for select
to authenticated
using (true);

create policy photos_insert_own
on public.wall_photos
for insert
to authenticated
with check (auth.uid() = user_id);

create policy photos_delete_admin_or_owner
on public.wall_photos
for delete
to authenticated
using (
  auth.uid() = user_id
  or exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'dios_admin'
  )
);

create policy announcements_select_authenticated
on public.global_announcements
for select
to authenticated
using (true);

create policy announcements_insert_admin_only
on public.global_announcements
for insert
to authenticated
with check (
  exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'dios_admin'
  )
);

create policy announcements_update_admin_only
on public.global_announcements
for update
to authenticated
using (
  exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'dios_admin'
  )
)
with check (
  exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'dios_admin'
  )
);

create policy announcements_delete_admin_only
on public.global_announcements
for delete
to authenticated
using (
  exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'dios_admin'
  )
);

