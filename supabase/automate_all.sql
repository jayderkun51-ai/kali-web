-- =============================================================================
-- KALI-WEB · automatización (Storage + Realtime + avatares)
-- =============================================================================
-- Requisito: ya ejecutaste `supabase/schema.sql` (tablas public.* existentes).
--
-- Cómo aplicar:
--   A) Supabase Dashboard → SQL Editor → pegar todo este archivo → Run
--   B) CLI (proyecto enlazado):  npm run db:auto
--
-- Idempotente: puedes ejecutarlo varias veces sin romper nada.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1) Buckets públicos (crea los que falten; el error "Bucket not found" se va)
-- -----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('kali-wall-compressed', 'kali-wall-compressed', true),
  ('kali-wall-hd', 'kali-wall-hd', true),
  ('kali-avatars', 'kali-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 2) Policies Storage · fotos de perfil (bucket kali-avatars)
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "kali_read_avatar_objects" ON storage.objects;
DROP POLICY IF EXISTS "kali_insert_avatar_objects_owner" ON storage.objects;
DROP POLICY IF EXISTS "kali_update_avatar_objects_owner" ON storage.objects;
DROP POLICY IF EXISTS "kali_delete_avatar_objects_owner" ON storage.objects;

CREATE POLICY "kali_read_avatar_objects"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'kali-avatars');

CREATE POLICY "kali_insert_avatar_objects_owner"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'kali-avatars'
  AND split_part(name, '/', 1) = auth.uid()::text
);

CREATE POLICY "kali_update_avatar_objects_owner"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'kali-avatars'
  AND split_part(name, '/', 1) = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'kali-avatars'
  AND split_part(name, '/', 1) = auth.uid()::text
);

CREATE POLICY "kali_delete_avatar_objects_owner"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'kali-avatars'
  AND split_part(name, '/', 1) = auth.uid()::text
);

-- -----------------------------------------------------------------------------
-- 3) Realtime · añadir tablas a la publicación (solo si aún no están)
-- -----------------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'chat_messages') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'chat_messages'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
    END IF;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'wall_photos') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'wall_photos'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.wall_photos;
    END IF;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'global_announcements') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'global_announcements'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.global_announcements;
    END IF;
  END IF;
END $$;
