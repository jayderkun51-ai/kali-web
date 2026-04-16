-- Kali-Web: habilitar cambios en tiempo real (Realtime) para estas tablas.
-- Ejecuta en Supabase → SQL Editor (una vez por proyecto).
-- Sin esto, postgres_changes puede no dispararse aunque el cliente esté suscrito.

-- Nota: si alguna tabla ya está en la publicación, ese comando fallará con "already member";
-- en ese caso comenta solo la línea correspondiente y vuelve a ejecutar.

ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.wall_photos;
ALTER PUBLICATION supabase_realtime ADD TABLE public.global_announcements;
