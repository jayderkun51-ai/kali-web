-- Políticas Storage para fotos de perfil (bucket: kali-avatars)
-- Recomendado: usa `supabase/automate_all.sql` (crea bucket + policies + realtime en un solo paso)
-- o ejecuta este archivo solo después de crear el bucket manualmente.

drop policy if exists "kali_read_avatar_objects" on storage.objects;
drop policy if exists "kali_insert_avatar_objects_owner" on storage.objects;
drop policy if exists "kali_update_avatar_objects_owner" on storage.objects;
drop policy if exists "kali_delete_avatar_objects_owner" on storage.objects;

create policy "kali_read_avatar_objects"
on storage.objects
for select
to authenticated
using (bucket_id = 'kali-avatars');

create policy "kali_insert_avatar_objects_owner"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'kali-avatars'
  and split_part(name, '/', 1) = auth.uid()::text
);

create policy "kali_update_avatar_objects_owner"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'kali-avatars'
  and split_part(name, '/', 1) = auth.uid()::text
)
with check (
  bucket_id = 'kali-avatars'
  and split_part(name, '/', 1) = auth.uid()::text
);

create policy "kali_delete_avatar_objects_owner"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'kali-avatars'
  and split_part(name, '/', 1) = auth.uid()::text
);
