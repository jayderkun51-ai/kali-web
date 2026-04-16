# Kali-Web Supabase Setup

## 0) Automatizar Storage + avatares + Realtime (recomendado)
Después de haber corrido `supabase/schema.sql` y `supabase/storage_policies.sql` al menos una vez:

**Opción A — un solo SQL en el Dashboard**  
Supabase → **SQL Editor** → pega y ejecuta el archivo **`supabase/automate_all.sql`**.  
Crea los buckets (`kali-wall-compressed`, `kali-wall-hd`, `kali-avatars`), policies de avatares y registra tablas en Realtime (sin duplicar si ya existían).

**Opción B — desde tu PC con CLI**  
```bash
npx supabase@latest login
npx supabase@latest link --project-ref TU_PROJECT_REF
npm run db:auto
```
En Windows también: `npm run db:auto:win`

## 1) Env vars
Use these in local and Vercel:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

## 2) Run DB schema
Open Supabase SQL Editor and run:

- `supabase/schema.sql`
- `supabase/storage_policies.sql`

## 3) Auth settings for numeric OTP
In Supabase Dashboard:

1. `Authentication -> URL Configuration`
   - Site URL: your Vercel domain
   - Redirect URLs: include local + Vercel URLs
2. `Authentication -> Providers -> Email`
   - Enable email OTP
   - Disable magic-link-only flow if enabled
3. `Authentication -> Email Templates`
   - Use `{{ .Token }}` in templates (not only confirmation URL)

Minimal HTML template:

```html
<h2>Kali-Web OTP</h2>
<p>Tu codigo es:</p>
<h1>{{ .Token }}</h1>
<p>Expira en unos minutos.</p>
```

## 4) SMTP (recommended)
Configure custom SMTP for reliable delivery.

For Gmail:
- Host: `smtp.gmail.com`
- Port: `465`
- Username: your full Gmail address
- Password: Google app password

## 5) First admin
After creating your account, promote your user in SQL:

```sql
update public.profiles
set role = 'dios_admin'
where email = 'TU_CORREO@MAIL.COM';
```

## 6) Storage + Realtime + avatares (manual por partes)
Si **no** usas la sección **0)**, haz lo siguiente:

- Buckets públicos: `kali-wall-compressed`, `kali-wall-hd`, `kali-avatars` (Dashboard → Storage).
- Políticas del muro: `supabase/storage_policies.sql`
- Políticas de avatar: `supabase/storage_avatars.sql`
- Realtime: `supabase/realtime_publication.sql` (puede fallar si la tabla ya estaba en la publicación; mejor **`automate_all.sql`**).

Los buckets deben ser **PUBLIC** con el frontend actual (URLs públicas).

