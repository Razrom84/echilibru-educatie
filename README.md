# Echilibru educație

Platformă de educație în familie, **doar în română**. V1: banda de vârstă **1–2 ani** (12–24 luni), **săptămâna 1** (28 de activități: 4 stâlpi × 7 zile).

Gazda țintă, mai târziu: `educatie.echilibru-cartea.ro`.  
Nu atinge site-ul englez EQUILIBRIUM / `equilibriumthebook.com`.

## Ce e gata

- Autentificare părinte: email + parolă (Supabase Auth)
- Onboarding: primul copil
- 8 ecrane: Login, Onboarding, Azi, Săptămână, Detaliu activitate, Progres, Copii, Setări
- **Arhivă de creștere**: o fotografie comprimată pe zi civilă (Europe/Bucharest), pagină privată, caiet PDF (săptămână / lună / an / interval ales)
- Mod A (părintele face împreună / pentru copil) și mod B (bifa copilului + aprobare)
- Completările se salvează per copil
- Calendar ICS: **Adaugă în calendar** copiază un link de abonament (`/api/calendar/{token}.ics`); Apple / Google se abonează, fără OAuth
- Raport luni pe email: mesaj scurt că ai caietul PDF gata, cu PDF atașat; săptămânal (în afară de prima luni) sau lunar (prima luni); pe 2 ianuarie: caietul anului trecut
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
   - …apoi restul din `supabase/migrations/`, inclusiv `20260906060000_rename_banda_2_3_to_1_2.sql` (eticheta live `2-3` → `1-2`), `20260906080000_monday_digest.sql` (toggle + jurnal trimiteri), `20260906083000_second_parent_email.sql` și **`20260909080000_cezar_growth_archive.sql`** (tabel `archive_days` + bucket privat `archive-photos`)
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
- **archive_days**: snapshot pe zi civilă (Europe/Bucharest) per copil: etichetă de bandă copiată la scriere, notă, titluri bifate, cale foto. Nu se unește cu catalogul live.
- **mail_digest_sends**: jurnal idempotent `(family_id, period_key)` pentru raportul de luni / an (`weekly:…`, `monthly:YYYY-MM`, `yearly:YYYY`)
- **storage `archive-photos`**: bucket privat, JPEG comprimat, o poză / zi; cale `{child_id}/{yyyy-mm-dd}.jpg`. RLS: doar părintele copilului.

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

## PLAYFUL PILOT (S1–S52 L–D)

Pilot GO (MannyQ + Răzvan), **doar** banda 1–2: **S1–S52 L–D** (anul întreg). Zero sunete de activitate (fără `Ascultă`, fără clipuri wav) — scoase în #33.

- **Azi:** personaj + temă (`Căsuță · Casa și curtea` / `Găletușă · Apa în casă și afară` / `Sunețel · Sunete și liniște` / `Mânuță · Mâini și degete` / `Cariocă · Culori pe care le vedem` / `Săgeată · Sus și jos` / `Preșuleț · Înăuntru și afară` / `Frunzuliță · Frunze și pământ` / `Suflare · Vânt și aer` / `Cutiuță · Colectăm și sortăm` / `Luminiță · Lumină și umbră` / `Cănuță · Cald și rece (repetare)` / `Hăinuță · Haine pe vreme` / `Potecuță · Pași pe drumul scurt` / `Linguriță · Mâncare împreună` / `Picătură · Apă și sete` / `Păsărică · Animale pe care le auzim` / `Mingiuță · Joacă de-a rândul` / `Cărticică · Cartea de seară` / `Coșuleț · Ordine mică în cameră` / `Pervazuț · Iarna pe pervaz` / `Ghemuț · Corp care se mișcă în casă` / `Năsuț · Mirosuri din casă` / `Ușiță · Familia și oaspeții` / `Lămpiță · Lumină de seară` / `Amintioară · Jumătate de an: repetăm favoritele` / `Fulguță · Zăpadă sau ploaie la geam` / `Noroiuț · Dezgheț și noroi` / `Mugurel · Muguri și iarbă nouă` / `Cioculeț · Păsări dimineața` / `Sămânțică · Semințe și udat` / `Rotunduță · Mingea afară` / `Nisipuț · Nisip și găleată` / `Umbriță · Umbre pe pământ` / `Stropuleț · Apă afară (joc scurt)` / `Gândăcel · Insecte de departe` / `Răcoriță · Umbră și loc răcoros` / `Tălpiță · Piciorul pe iarbă` / `Măruleț · Fructe pe care le vedem` / `Măturiță · Ajutor la treabă scurtă` / `Portiță · Drumul până la poartă` / `Vântuleț · Vânt și frunze din nou` / `Săculeț · Coșul și strânsul` / `Inimioară · Prieteni și familie` / `Pașuleț · Corp puternic, pași mulți` / `Degețel · Întrebări cu arătatul` / `Grijiță · Grijă de lucruri` / `Salutel · Salut și la revedere` / `Scumpuț · Repetăm 3 favorite` / `Liniștiță · Casă liniștită` / `Curtiță · Curtea cunoscută` / `Blânduleț · Anul se închide blând`), ritual de deschidere, 4 piloni cu titluri-invitație, `Surpriză: …` sub Social, ritual de închidere când e gata ziua.
- **Ritualuri (lock):** S1 `Casa și curtea.` / `Pe curte, gata.`; S2 `Apa în casă.` / `Afară, gata.`; S3 deschidere `Ascultăm. Gata?` / închidere `Sunete gata. Bravo.`; S4 deschidere `Mâinile. Gata?` / închidere `Mâini gata. Bravo.`; S5 `Vedem culorile.` / `Culori văzute.`; S6 `Sus și jos.` / `Sus-jos gata.`; S7 `Înăuntru și afară.` / `Pe prag, gata.`; S8 `Frunze și pământ.` / `Pe pământ, gata.`; S9 `Vânt și aer.` / `În aer, gata.`; S10 `Adunăm și sortăm.` / `La loc, gata.`; S11 `Lumină și umbră.` / `În umbră, gata.`; S12 `Cald și rece.` / `Cald-rece, gata.`; S13 `Haine pe vreme.` / `Pe cârlig, gata.`; S14 `Pași pe drum.` / `Pe drum, gata.`; S15 `Mâncare împreună.` / `La masă, gata.`; S16 `Apă și sete.` / `Apa, gata.`; S17 `Auzim animale.` / `Auzite, gata.`; S18 `Joacă de-a rândul.` / `Rândul, gata.`; S19 `Cartea de seară.` / `Cartea, gata.`; S20 `Ordine în cameră.` / `Camera, gata.`; S21 `Iarna pe pervaz.` / `Pe pervaz, gata.`; S22 `Corp în casă.` / `Mișcat, gata.`; S23 `Mirosuri din casă.` / `Mirosit, gata.`; S24 `Familia, oaspeții.` / `La ușă, gata.`; S25 `Lumină de seară.` / `Seara, gata.`; S26 `Favoritele, din nou.` / `Favorite, gata.`; S27 `Zăpadă sau ploaie.` / `La geam, gata.`; S28 `Dezgheț și noroi.` / `Noroiul, gata.`; S29 `Muguri și iarbă.` / `Mugurii, gata.`; S30 `Păsări dimineața.` / `Păsări, gata.`; S31 `Semințe și udat.` / `Udat, gata.`; S32 `Mingea afară.` / `Mingea, gata.`; S33 `Nisip și găleată.` / `Nisipul, gata.`; S34 `Umbre pe pământ.` / `Umbra, gata.`; S35 `Apă afară.` / `Pe apă, gata.`; S36 `Insecte de departe.` / `Departe, gata.`; S37 `Umbră răcoroasă.` / `Răcoare, gata.`; S38 `Picior pe iarbă.` / `Pe iarbă, gata.`; S39 `Uite fructele.` / `Fructe văzute.`; S40 `Ajutor la treabă.` / `Treaba, gata.`; S41 `Drumul la poartă.` / `La poartă, gata.`; S42 `Vânt din nou.` / `Vântul, gata.`; S43 `Coșul și strânsul.` / `Strâns, gata.`; S44 `Prieteni și familie.` / `Împreună, gata.`; S45 `Pași mulți.` / `Pașii, gata.`; S46 `Arătăm împreună.` / `Arătat, gata.`; S47 `Grijă de lucruri.` / `Lucruri, gata.`; S48 `Salut și pa.` / `Pa, gata.`; S49 `Trei favorite.` / `Cele trei, gata.`; S50 `Casă liniștită.` / `Liniște, gata.`; S51 `Curtea știută.` / `Curtea, gata.`; S52 `Anul, blând.` / `Anul, gata.`
- **Săptămâna:** ritualul o dată sus; pe zilele din pilot: iconița personajului, 4 piloni, chip Surpriză. S1–S52 au chrome L–D.
- **Setări:** `Sunet scurt la gata` — **implicit oprit**, salvat pe dispozitiv (`localStorage`), nu pe familie. Sunetul e scurt, pornit doar de adult când bifează ultimul pilon; nu se autoredă la încărcarea paginii. Fără player de sunete S3 (fără `Ascultă`, fără clipuri wav, fără toggle `Sunete S3`).
- Fără streak / badge / scor. Fără chat. Personajele sunt SVG statice. S1 **`Căsuță`** (ă, ț, ă — nu `Cănuță`), S2 **`Găletușă`** (ă, ș, ă — nu `Găletuță`). Personajul S4 se afișează **`Mânuță`** (â din *mână*, U+00E2 — nu `Mănuță`; id intern `manuta`). S5 **`Cariocă`** (ă), S6 **`Săgeată`** (ă), S7 **`Preșuleț`** (ș, ț), S8 **`Frunzuliță`** (ț, ă), S9 **`Suflare`**, S10 **`Cutiuță`** (ț, ă), S11 **`Luminiță`** (ț, ă), S12 **`Cănuță`** (ă, ț, ă — nu `Mânuță`), S13 **`Hăinuță`** (ă, ț, ă), S14 **`Potecuță`** (ț, ă), S15 **`Linguriță`** (ț, ă), S16 **`Picătură`** (ă, ă), S17 **`Păsărică`** (ă, ă, ă), S18 **`Mingiuță`** (ț, ă), S19 **`Cărticică`** (ă, ă), S20 **`Coșuleț`** (ș, ț). S21 **`Pervazuț`** (ț), S22 **`Ghemuț`** (ț), S23 **`Năsuț`** (ă, ț), S24 **`Ușiță`** (ș, ț, ă), S25 **`Lămpiță`** (ă, ț, ă), S26 **`Amintioară`** (ă), S27 **`Fulguță`** (ț, ă), S28 **`Noroiuț`** (ț), S29 **`Mugurel`**, S30 **`Cioculeț`** (ț), S31 **`Sămânțică`** (ă, â, ț, ă), S32 **`Rotunduță`** (ț, ă), S33 **`Nisipuț`** (ț), S34 **`Umbriță`** (ț, ă), S35 **`Stropuleț`** (ț), S36 **`Gândăcel`** (â, ă), S37 **`Răcoriță`** (ă, ț, ă), S38 **`Tălpiță`** (ă, ț, ă), S39 **`Măruleț`** (ă, ț), S40 **`Măturiță`** (ă, ț, ă), S41 **`Portiță`** (ț, ă), S42 **`Vântuleț`** (â, ț), S43 **`Săculeț`** (ă, ț), S44 **`Inimioară`** (ă), S45 **`Pașuleț`** (ș, ț), S46 **`Degețel`** (ț), S47 **`Grijiță`** (ț, ă), S48 **`Salutel`**, S49 **`Scumpuț`** (ț), S50 **`Liniștiță`** (ș, ț, ă), S51 **`Curtiță`** (ț, ă), S52 **`Blânduleț`** (â, ț).
- Titlurile se schimbă în `content/seed-s1-banda-1-2.json` (S1), `content/seed-s2-s4-banda-1-2.json` (S2 + S3 L–J; S3 V–D și S4 neschimbate), `content/seed-s5-s8-banda-1-2.json` (S5–S8), `content/seed-s9-s12-banda-1-2.json` (S9–S12), `content/seed-s13-s16-banda-1-2.json` (S13–S16) și `content/seed-s17-s20-banda-1-2.json` (S17–S20), `content/seed-s21-s24-banda-1-2.json` (S21–S24), `content/seed-s25-s28-banda-1-2.json` (S25–S28), `content/seed-s29-s32-banda-1-2.json` (S29–S32), `content/seed-s33-s36-banda-1-2.json` (S33–S36), `content/seed-s37-s40-banda-1-2.json` (S37–S40), `content/seed-s41-s44-banda-1-2.json` (S41–S44), `content/seed-s45-s48-banda-1-2.json` (S45–S48) și `content/seed-s49-s52-banda-1-2.json` (S49–S52). Ritualul și surprizele sunt în `src/lib/playful-pilot.ts`. Brief lock: `docs/BRIEF-PLAYFUL-S1-S3.md`, `docs/BRIEF-PLAYFUL-S5-S7.md`, `docs/BRIEF-PLAYFUL-S8-S10.md`, `docs/BRIEF-PLAYFUL-S11-S13.md`, `docs/BRIEF-PLAYFUL-S14-S20.md`, `docs/BRIEF-PLAYFUL-S21-S52.md`.
- Selectorul S# arată **`Săptămâna 3`**, nu `Săptămâna S3`.

### QA pe demonstrație (fără Supabase)

1. Login → **Intră în demonstrație** → onboarding copil.
2. Pe **Azi**, folosește controlul S# → **Săptămâna 3** (săptămâna oficială rămâne cea de azi). Hard refresh după deploy.
3. S# **Săptămâna 1**: Căsuță, `Casa și curtea.`, Luni fizic `Pași în curte`. S# **Săptămâna 2**: Găletușă, `Apa în casă.`.
4. Vineri Azi S3: Sunețel, `Ascultăm. Gata?`, `Surpriză: șoaptă 2s`. Luni–joi S3: tot Sunețel + surpriză (S3 e complet L–D).
5. Schimbă S# la **Săptămâna 4**. Azi + Săptămâna: Mânuță, `Mâinile. Gata?`, surpriză pe L–D.
6. S# **Săptămâna 5**: Cariocă, `Vedem culorile.`, Luni fizic `Pași până la roșu`, `Surpriză: Ascundem un obiect roșu 2 sec: „Unde e?”`.
7. S# **Săptămâna 6**: Săgeată, `Sus și jos.`. S# **Săptămâna 7**: Preșuleț, `Înăuntru și afară.`.
8. S# **Săptămâna 8**: Frunzuliță, `Frunze și pământ.`, Luni fizic `Pași pe frunze`. S# **Săptămâna 9**: Suflare, `Vânt și aer.`. S# **Săptămâna 10**: Cutiuță, `Adunăm și sortăm.`.
9. S# **Săptămâna 11**: Luminiță, `Lumină și umbră.`, Luni fizic `Pași până la lumină`. S# **Săptămâna 12**: Cănuță, `Cald și rece.`. S# **Săptămâna 13**: Hăinuță, `Haine pe vreme.`.
10. S# **Săptămâna 14**: Potecuță, `Pași pe drum.`, Luni fizic `Pași pe hol`. S# **Săptămâna 15**: Linguriță, `Mâncare împreună.`. S# **Săptămâna 16**: Picătură, `Apă și sete.`. S# **Săptămâna 17**: Păsărică, `Auzim animale.`. S# **Săptămâna 18**: Mingiuță, `Joacă de-a rândul.`. S# **Săptămâna 19**: Cărticică, `Cartea de seară.`. S# **Săptămâna 20**: Coșuleț, `Ordine în cameră.`.
10b. S# **Săptămâna 21**: Pervazuț, `Iarna pe pervaz.`, Luni fizic `Mâna pe geam`. S# **Săptămâna 32**: Rotunduță. S# **Săptămâna 52**: Blânduleț, `Anul, blând.`
11. Setări → pornește **Sunet scurt la gata** → pe o zi de pilot (dacă e ziua curentă, nu viitoare), bifează al 4-lea pilon → se aude chime-ul. Reîncarcă pagina: nu se aude nimic până la o bifă nouă.
12. Navighează la S21–S52: personaj + surpriză L–D.
13. Azi / Săptămâna / Detaliu / Setări: **fără** buton `Ascultă` și **fără** toggle `Sunete S3 (vineri–duminică)`.
14. S# **Săptămâna 4** → Vineri fizic: titlul e `Alunecăm cu mâna ușor pe pernă.` (mâna pe pernă, nu târâit).

Poți folosi și săgețile S# de pe Azi / Săptămâna (nu mută săptămâna oficială). Dacă schimbi săptămâna oficială din Setări la o S# al cărei calendar e în viitor, Azi blochează ziua („Se deschide Vineri”) — comportament V1.5, nu al pilotului.

### QA pe custom / cont real

1. SQL Editor (sau `db push`): `supabase/migrations/20260918080000_playful_s3_vd_natural_titles.sql`, `supabase/migrations/20260918090000_s4_v_fizic_alunecam.sql`, `supabase/migrations/20260919120000_playful_pilot_s5_s7_titles.sql`, `supabase/migrations/20260920120000_playful_pilot_s8_s10_titles.sql`, `supabase/migrations/20260920140000_playful_pilot_s11_s13_titles.sql`, `supabase/migrations/20260920160000_playful_pilot_s14_s20_titles.sql`, apoi `supabase/migrations/20260920180000_playful_pilot_s1_s3_titles.sql`, apoi `supabase/migrations/20260920200000_playful_pilot_s21_s52_titles.sql` — actualizează titlurile S1–S52. Nu inserează rânduri noi.
2. Dacă S1–S52 nu sunt încă în `activities`, importă întâi catalogul 1–2, apoi rulează migrarea.
3. Navighează la S1–S52 (nav S#). Verifică Azi, Săptămâna, toggle-ul de sunet ca mai sus. Hard refresh.
4. Gazda: `educatie.echilibru-cartea.ro` (preview-ul Vercel e suficient pentru acest PR).

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
5. Deploy. `vercel.json` definește:
   - cronul `0 5 * * 1` → `/api/cron/raport-luni` (luni 08:00 EEST / 07:00 EET)
   - cronul `0 6 2 1 *` → `/api/cron/raport-an` (2 ianuarie 08:00 EET)

## Arhivă de creștere (foto + caiet PDF)

Pe **Azi**: o fotografie pe ziua civilă (Europe/Bucharest), din galerie sau de pe calculator. Se comprimă în browser (JPEG, latură max. 1600px). Originalul rămâne pe dispozitiv. O poză / zi; se poate înlocui sau șterge. Fără video.

**Arhivă** (`/arhiva`): aceeași autentificare, privată pe copil. Deschizi o zi trecută: nota, ce a fost bifat, fotografia dacă există. Descarci manual caietul PDF pentru săptămâna civilă (luni–duminică), luna calendaristică, anul calendaristic sau un interval ales (De la / Până la). Același stil: dată, ce ați făcut, notă, thumbnail.

Mailul de luni nu mai pune scoruri în corp: e un mesaj scurt că ai caietul gata, cu PDF-ul atașat. Prima luni din lună = caietul lunii trecute. 2 ianuarie 08:00 Europe/Bucharest = caietul anului calendaristic trecut (cron separat, ca să nu se amestece cu luni).

### SQL de rulat în Supabase (dacă nu faci `db push`)

Dashboard → **SQL Editor** → New query. Lipește tot fișierul:

`supabase/migrations/20260909080000_cezar_growth_archive.sql`

Run. Asta creează `public.archive_days` (RLS) și bucket-ul privat **archive-photos** (Storage → Buckets). Nu bifa Public pe bucket.

Verificare: Storage → Buckets → `archive-photos` → Public = off; Policies pe `storage.objects` pentru `archive_photos_*_own`.

## Ce nu e în V1

- Plăți, chat AI, multi-tenant public SaaS
- Săptămânile 2–52 și alte benzi de vârstă
- Site-ul de carte în engleză
- Magic link (parola e calea mai simplă, fără SMTP)

## RLS de știut

Tabelele aplicației (`families`, `children`, `activities`, `completions`) au RLS.  
Pe proiectul **Familie** existau deja `public._migrations` și `public.cloud_snapshots` **fără RLS**. Nu le-am atins. Dacă nu vă trebuie, puteți activa RLS pe ele din dashboard sau le puteți șterge.
