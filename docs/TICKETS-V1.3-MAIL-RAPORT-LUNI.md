# V1.3 — Raport luni pe email (săptămânal + lunar)

Transport: **Resend**. From: `noreply@echilibru-cartea.ro`.  
Corpul mailului e scurt: caietul PDF e gata, atașat. Fără scoruri. Fără video.

## Când se trimite

Cron Vercel: **luni 08:00 Europe/Bucharest**.

| Dată (luni) | Tip | Conținut |
| --- | --- | --- |
| Orice luni **în afară de** prima luni din lună | Săptămânal | Caietul săptămânii civile închise (L–D). Mesaj scurt + PDF atașat. |
| **Prima luni** din luna calendaristică | Lunar (înlocuiește săptămânalul) | Caietul lunii calendaristice anterioare. Mesaj scurt + PDF atașat. |

Cron separat: **2 ianuarie 08:00 Europe/Bucharest** (`0 6 2 1 *` UTC) → caietul anului calendaristic trecut. Nu se amestecă cu luni.

Nu se trimite dacă perioada n-are notă, lucruri bifate sau fotografie.  
Toggle Setări: **Raport luni pe email** (implicit pornit; acoperă și caietul de 2 ianuarie).  
Câmp opțional: **Email al doilea părinte** — dacă e completat, Resend pune `cc:`. Gol = fără copie.

### Subject

- Săptămânal: `Săptămâna trecută · [Temă] — Echilibru educație`
- Lunar: `Luna trecută · [august 2026] — Echilibru educație`
- Anual: `Anul trecut · [2026] — Echilibru educație`

### CTA

https://educatie.echilibru-cartea.ro/arhiva

## Cron UTC și ora de vară (DST)

Vercel cron e **doar UTC**. Expresii din `vercel.json`:

```
0 5 * * 1
```

= luni 05:00 UTC (08:00 EEST / 07:00 EET).

```
0 6 2 1 *
```

= 2 ianuarie 06:00 UTC = **08:00 EET** (ianuarie e iarnă).

| Perioadă | Decalaj București | Ora locală a cronului |
| --- | --- | --- |
| EEST (ultima duminică din martie → ultima duminică din octombrie) | UTC+3 | **08:00** |
| EET (iarnă) | UTC+2 | **07:00** |

În septembrie (EEST) e 08:00, cum cere ticketul. Iarna mailul pleacă cu o oră mai devreme. O a doua expresie UTC nu e suportată de Vercel; dacă trebuie 08:00 tot anul, mută cronul la `0 6 * * 1` (atunci vara devine 09:00).

## Variabile Vercel (Production + Preview)

Nu inventa secrete — pune-le în dashboard / `vercel env add`.

| Variabilă | Rol |
| --- | --- |
| `RESEND_API_KEY` | Trimitere Resend. Domeniul `echilibru-cartea.ro` trebuie verificat în Resend. |
| `CRON_SECRET` | Vercel o trimite ca `Authorization: Bearer …` la invocarea cronului. Fără ea, ruta răspunde 401. |
| `SUPABASE_SERVICE_ROLE_KEY` | Doar pe server: listă familii + email părinte (`auth.admin`). Nu o prefixa cu `NEXT_PUBLIC_`. |
| `NEXT_PUBLIC_SUPABASE_URL` | Deja cerută de V1. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Deja cerută de V1. |

SQL: `supabase/migrations/20260906080000_monday_digest.sql`  
(`families.monday_digest_email`, `mail_digest_sends` unic pe `(family_id, period_key)`).  
Plus `20260906083000_second_parent_email.sql` (`families.second_parent_email`).

## Test / dry-run

### Din Setări (cont real)

1. **Arată un test** — construiește mailul, nu trimite.
2. **Trimite un test** — Resend către emailul din sesiune. Cheia de perioadă e `test:…`, deci **nu blochează** luni-ul real.

În demonstrație locală poți doar privi testul.

### Cron (header obligatoriu)

```bash
# Dry-run pentru „luni 14 sep 2026” (săptămânal, S2)
curl -sS -H "Authorization: Bearer $CRON_SECRET" \
  "https://<deploy>/api/cron/raport-luni?dryRun=1&asOf=2026-09-14"

# Dry-run prima luni din septembrie (lunar, august)
curl -sS -H "Authorization: Bearer $CRON_SECRET" \
  "https://<deploy>/api/cron/raport-luni?dryRun=1&asOf=2026-09-07"

# Dry-run anual (2 ian 2027 → caiet 2026)
curl -sS -H "Authorization: Bearer $CRON_SECRET" \
  "https://<deploy>/api/cron/raport-an?dryRun=1&asOf=2027-01-02"
```

Local: aceleași URL-uri pe `http://localhost:3000`, cu `CRON_SECRET` în `.env.local`. Fără `RESEND_API_KEY`, doar `dryRun=1` are sens.
