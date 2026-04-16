-- Kali-Web: habilitar Realtime (versión simple, puede fallar si la tabla ya está en la publicación).
-- Preferido: `supabase/automate_all.sql` (idempotente, seguro repetir).

ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.wall_photos;
ALTER PUBLICATION supabase_realtime ADD TABLE public.global_announcements;
