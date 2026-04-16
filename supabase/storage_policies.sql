-- Kali-Web Storage policies (Phase 2)
-- Requires buckets to exist:
--   - kali-wall-compressed
--   - kali-wall-hd
--
-- Recommended bucket config for current frontend:
--   - Set BOTH buckets to PUBLIC (Dashboard -> Storage -> Buckets -> Settings)
--     because the app currently uses getPublicUrl().
--
-- If you prefer PRIVATE buckets, tell me and I’ll switch the frontend to signed URLs.

-- Enable RLS on storage objects (usually already enabled in Supabase projects)
alter table if exists storage.objects enable row level security;

-- Helper: check current user's role from profiles (safe: NOT user_metadata)
create or replace function public.current_role()
returns text
language sql
stable
as $$
  select p.role
  from public.profiles p
  where p.id = auth.uid()
$$;

-- Drop old policies if rerunning
drop policy if exists "kali_read_wall_objects" on storage.objects;
drop policy if exists "kali_insert_wall_objects_owner" on storage.objects;
drop policy if exists "kali_update_wall_objects_owner" on storage.objects;
drop policy if exists "kali_delete_wall_objects_owner" on storage.objects;
drop policy if exists "kali_insert_hd_only" on storage.objects;

-- READ: authenticated users can read wall objects (defense in depth).
-- Note: if buckets are PUBLIC, reads will work even without this policy.
create policy "kali_read_wall_objects"
on storage.objects
for select
to authenticated
using (
  bucket_id in ('kali-wall-compressed', 'kali-wall-hd')
);

-- WRITE (compressed): only the owner can upload/replace/delete their own files.
-- We enforce folder structure: object name must start with "<uid>/..."
create policy "kali_insert_wall_objects_owner"
on storage.objects
for insert
to authenticated
with check (
  bucket_id in ('kali-wall-compressed', 'kali-wall-hd')
  and split_part(name, '/', 1) = auth.uid()::text
);

create policy "kali_update_wall_objects_owner"
on storage.objects
for update
to authenticated
using (
  bucket_id in ('kali-wall-compressed', 'kali-wall-hd')
  and split_part(name, '/', 1) = auth.uid()::text
)
with check (
  bucket_id in ('kali-wall-compressed', 'kali-wall-hd')
  and split_part(name, '/', 1) = auth.uid()::text
);

create policy "kali_delete_wall_objects_owner"
on storage.objects
for delete
to authenticated
using (
  bucket_id in ('kali-wall-compressed', 'kali-wall-hd')
  and split_part(name, '/', 1) = auth.uid()::text
);

-- HD restriction: only Compi Pro / Dios Admin can upload to HD bucket
-- (compressed bucket remains available to all authenticated users).
create policy "kali_insert_hd_only"
on storage.objects
as restrictive
for insert
to authenticated
with check (
  bucket_id <> 'kali-wall-hd'
  or public.current_role() in ('compi_pro', 'dios_admin')
);

