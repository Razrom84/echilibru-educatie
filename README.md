# Echilibru educație

Platformă de educație în familie, **doar în română**. V1: banda de vârstă **1–2 ani** (12–24 luni), **săptămâna 1** (28 de activități: 4 stâlpi × 7 zile).

Gazda țintă, mai târziu: `educatie.echilibru-cartea.ro`.  
Nu atinge site-ul englez EQUILIBRIUM / `equilibriumthebook.com`.

## Ce e gata

- Autentificare părinte: email + parolă (Supabase Auth)
- Onboarding: primul copil
- 8 ecrane: Login, Onboarding, Azi, Săptămână, Detaliu activitate, Progres, Copii, Setări
- Mod A (părintele face împreună / pentru copil) și mod B (bifa copilului + aprobare)
- Completările se salvează per copil
- Calendar ICS: **Adaugă în calendar** copiază un link de abonament (`/api/calendar/{token}.ics`); Apple / Google se abonează, fără OAuth
- Raport luni pe email (V1.3): cron Resend, săptămânal (în afară de prima luni) sau lunar (prima luni); toggle în Setări
- RLS: părintele vede doar familia, copiii și completările lui
- Demonstrație locală, fără cont, dacă lipsesc cheile Supabase

## Rulare locală

```bash
npm install
cp .env.example .env.local
# completează NEXT_PUBLIC_SUPABASE_URL și NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```

Deschide [http://localhost:3000](http://localhost:3000).  
Fără chei Supabase, din Login apasă **Intră în demonstrație**.

## Variabile de mediu

| Variabilă | Unde | Obligatorie |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `.env.local` și Vercel | da, pentru auth real |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `.env.local` și Vercel | da (anon sau publishable) |
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel (cron) / CLI | da pe Vercel pentru raportul de luni; nu în browser |
| `RESEND_API_KEY` | Vercel (Production + Preview) | da, ca să plece mailul de luni |
| `CRON_SECRET` | Vercel | da; cronul trimite `Authorization: Bearer $CRON_SECRET` |

Cheile Supabase: Project Settings → Data API / API Keys.  
Resend: API key + domeniu `echilibru-cartea.ro` (From `noreply@echilibru-cartea.ro`).  
Detalii cron, DST și cum trimiți un test: `docs/TICKETS-V1.3-MAIL-RAPORT-LUNI.md`.

## Proiect Supabase (free)

1. Creează un proiect la [supabase.com](https://supabase.com) (regiune `eu-west-1` e potrivită pentru RO).
2. Authentication → Providers → Email: lasă email + parolă pornit.
3. Pentru test local, în Authentication → Providers → Email, oprește **Confirm email**. Altfel signup-ul cere inbox.
4. SQL Editor: rulează, în ordine:
   - `supabase/migrations/20260905000001_init.sql`
   - `supabase/migrations/20260905000002_seed_week1_2_3.sql` (înlocuit de 0003)
   - `supabase/migrations/20260905000003_official_activitate_schema.sql`
   - …apoi restul din `supabase/migrations/`, inclusiv `20260906060000_rename_banda_2_3_to_1_2.sql` (eticheta live `2-3` → `1-2`), `20260906080000_monday_digest.sql` (toggle + jurnal trimiteri) și `20260906083000_second_parent_email.sql`
5. Copiază URL + anon key în `.env.local`.

Sau, cu [Supabase CLI](https://supabase.com/docs/guides/cli):

```bash
npx supabase login
npx supabase link --project-ref <PROJECT_REF>
npx supabase db push
```

Service role nu e pentru browser. Cronul de luni îl folosește pe server ca să citească familiile și emailul părintelui.

În organizația Echilibru-cartea există deja proiectul **Familie** (`ahtwqeigsytlzmicsxtn`), gol în `public` în afara unor tabele interne de snapshot. Poți folosi acel proiect în loc să creezi altul.

## Model de date

- **families**: un părinte (`auth.users`) → o familie; `default_mode` A sau B; `monday_digest_email` (raport luni, implicit pornit); `second_parent_email` (CC opțional pe raportul de luni)
- **children**: nume, data nașterii → banda V1 `1-2`, `active`, `calendar_token` (secret ICS; lookup public prin `calendar_feed_for_token`)
- **activities**: catalog Cristina (`id` slug, `banda`, `saptamana`, `zi`, `pilon`, `titlu`, `durata_min`, `mod_default`, `materiale[]`, `pasi[]`, `gata_cand`, `nota`, `tema_saptamana`)
- **completions**: `child_id` + `activity_id` (slug), `mode` A/B, `parent_approved` (mod B: `false` = așteaptă, `true` = aprobat)
- **day_notes**: notă liberă per `child_id` + `program_year_start` + `week_number` (S#) + `day_of_week` (1–7); text scurt; gol = fără rând
- **mail_digest_sends**: jurnal idempotent `(family_id, period_key)` pentru raportul de luni

Stâlpi: `fizic`, `mental`, `resurse`, `social`.

Feed ICS (R5): `GET /api/calendar/{token}.ics` — 1 eveniment/zi, 14 zile din azi (Europe/Bucharest), zilele dinainte de `joined_at` tăiate ca în R3. Demonstrație: `/api/calendar/demo.ics`.

Săptămâna din V1 este **săptămâna 1 de program**, nu săptămâna ISO din calendar. Azi folosește ziua reală a săptămânii (luni–duminică) din săptămâna 1.

## Seed oficial (Cristina)

Sursa de adevăr: `content/seed-s1-banda-1-2.json` (28 de activități, săptămâna 1, banda 1–2, tema **Casa și curtea**).  
Schema câmpurilor: `content/schema-activitate.json`.

Import în Postgres:

```bash
node scripts/import-seed.mjs
# sau rulează supabase/migrations/20260905000003_official_activitate_schema.sql
```

Aplicația citește același JSON în demonstrație. Nu mai există text lorem / placeholder.  
Dacă Cristina înlocuiește fișierul JSON, re-rulează importul (`on conflict (id) do update`).

## Deploy Vercel

Origin nu e legat de Vercel din acest agent. Pași:

1. Creează repo-ul Origin (butonul Create repo din sesiune), apoi conectează-l la Vercel — echipa **EQUILIBRIUM** / Hobby.
2. Import proiect Next.js, root = rădăcina repo-ului.
3. Environment variables (Production + Preview):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (doar server; cronul de luni)
   - `RESEND_API_KEY`
   - `CRON_SECRET`
4. Authentication → URL Configuration în Supabase: adaugă domeniul Vercel (și, mai târziu, `educatie.echilibru-cartea.ro`) la Site URL / Redirect URLs.
5. Deploy. `vercel.json` definește cronul `0 5 * * 1` → `/api/cron/raport-luni` (luni 08:00 EEST / 07:00 EET). Vezi `docs/TICKETS-V1.3-MAIL-RAPORT-LUNI.md`.

## Ce nu e în V1

- Plăți, chat AI, multi-tenant public SaaS
- Săptămânile 2–52 și alte benzi de vârstă
- Site-ul de carte în engleză
- Magic link (parola e calea mai simplă, fără SMTP)

## RLS de știut

Tabelele aplicației (`families`, `children`, `activities`, `completions`) au RLS.  
Pe proiectul **Familie** existau deja `public._migrations` și `public.cloud_snapshots` **fără RLS**. Nu le-am atins. Dacă nu vă trebuie, puteți activa RLS pe ele din dashboard sau le puteți șterge.
