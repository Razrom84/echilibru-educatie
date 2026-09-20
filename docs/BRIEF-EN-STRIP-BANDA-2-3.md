# BRIEF — Strip EN pe banda 2–3 (Lock A)

**Status:** LOCKED · Cristina · 20 Sep 2026  
**Decizie:** Răzvan via MannyQ — **A strip tot EN** pe 2–3  
**Politică:** engleză lived = vorbire părinți acasă, **nu** copy în app  
**Sursă smoke:** `docs/SMOKE-BANDA-2-3-CONTENT.md` (FIX FIRST)  
**Ticket:** `docs/TICKET-EN-STRIP-BANDA-2-3.md`  
**Enable cohort:** rămâne pe `bc-ef5eb957` — **PR separat**, nu amesteca

---

## Scope

| | |
|--|--|
| Bandă | **doar** `2-3` / ids seed `sN-2-3-…` → live `sN-b23-…` |
| Câmpuri | `titlu`, `materiale`, `pasi`, `gata_cand` (+ orice alt text copy pe rând) |
| Volum | **463** activități (scanner smoke) — listă `APPENDIX-EN-STRIP-2-3-IDS.txt` |
| P0 | **S32** = 28/28 (Ball / My turn / Turn) |
| P1 | restul ~435 pe ~27 săpt |

**În afară:** banda 1–2; chrome UI; enable cohort / `bandFromBirthdate`; playful S8–S10; seed 3–7.

---

## Reguli copy (LOCK)

1. **Zero cuvinte EN** în copy (inclusiv în ghilimele tip „Ball.” / „My turn.” / „Done.”).
2. Unde era bilingv (`„Ball. Minge.”`) → **doar RO** (`„Minge.”` / fraza RO echivalentă).
3. Păstrează **sensul + structura**: nucleu scurt + pas „dacă vrea” unde există.
4. Păstrează `tema_saptamana` dacă e deja RO fără EN; dacă are EN → strip.
5. Ton gifted-light (PRINCIPII / OUTLINE): RO bogat, zero fișe, zero EN fluff.
6. Diacritice RO corecte.

### Glosar minim EN → RO (extinde dacă apar altele)

| EN (strip) | RO (înlocuire tipică) |
|------------|------------------------|
| Ball | Minge |
| My turn / Turn | Rândul meu / Rândul tău / Rând |
| Water | Apă |
| Hand | Mână |
| Open | Deschide / Deschis |
| Go | Mergem / Hai |
| Stop | Stăm / Stop → **Oprim** / Gata (fără EN) |
| Thank you | Mulțumesc |
| Again | Iar / Din nou |
| Walk | Mergem / Pași |
| Eat | Mâncăm |
| Fruit | Fruct |
| Done | Gata / Ajunge |
| High five | Bătut palma |
| Look | Privim / Uite |
| Touch | Atinge |
| Push / Pull | Împinge / Trage |
| Soft / Hard | Moale / Tare |
| Book | Carte |
| Yes | Da |
| Ready | Gata / Pregătit |
| Together | Împreună |
| Please | Te rog |
| Hello / Hi | Bună |
| Bye | La revedere |

Scanner post-fix (aceleași token-uri ca smoke): **0 hit** pe banda 2–3.

---

## Done when (produs)

1. Seed + migration pe cele 463 (id live = remap `2-3` → `b23`).  
2. Preview → PASS Cristina (S32 full + spot alte săpt).  
3. Merge + migration Familie.  
4. Re-smoke: EN FAIL = 0 pe 2–3.
