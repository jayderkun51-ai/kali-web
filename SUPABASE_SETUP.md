# Kali-Web Supabase Setup

## 1) Env vars
Use these in local and Vercel:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

## 2) Run DB schema
Open Supabase SQL Editor and run:

- `supabase/schema.sql`

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

