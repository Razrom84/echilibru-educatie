# FINAL CHECK — Banda 2–3 (S1–S52)

**Date:** 2026-09-20 (Europe/Bucharest)  
**Source (Lock A stripped, EN=0):** `/tmp/en-qa48/content/seed-*-banda-2-3-v2.json` (**1456** activities = 52×28)  
**Files:** `seed-s1-banda-2-3-v2.json`, `seed-s13-s16-banda-2-3-v2.json`, `seed-s17-s20-banda-2-3-v2.json`, `seed-s2-s4-banda-2-3-v2.json`, `seed-s21-s24-banda-2-3-v2.json`, `seed-s25-s28-banda-2-3-v2.json`, `seed-s29-s32-banda-2-3-v2.json`, `seed-s33-s36-banda-2-3-v2.json`, `seed-s37-s40-banda-2-3-v2.json`, `seed-s41-s44-banda-2-3-v2.json`, `seed-s45-s48-banda-2-3-v2.json`, `seed-s49-s52-banda-2-3-v2.json`, `seed-s5-s8-banda-2-3-v2.json`, `seed-s9-s12-banda-2-3-v2.json`  
**Not used:** `/workspace/echilibru-educatie/seed-*-banda-2-3-v2.json` (older; S32 still has bilingual `Ball` / `Turn` — pre-strip)  
**Auditor:** Cristina (education lead) via Grok Bot  
**Scope:** EN Lock A · title↔body · mono titles · RO orthography/grammar · empty fields · `tema_saptamana` · playful 2–3  
**Note:** Familie live may still be mid-migration for weeks ≠S32; this check is **seed-based** only.

---

## Verdict: **FAIL**

Lock A EN strip holds (**0** residual EN on copy fields). Completeness and `tema_saptamana` coherence hold.  
**Open:** **8× P1** title↔body object mismatches (same LOCK B as banda 1–2: keep `titlu` + `tema_saptamana`, rewrite `materiale` / `pasi` / `gata_cand`) plus **3× P2** softer residuals.

**Do not open a Rusty ticket until Răzvan / MannyQ GO.**  
**No self-fix** from this audit.

---

## Counts

| Check | Result |
|-------|-------:|
| Activities scanned | **1456** |
| Weeks covered | **52** (S1–S52; 28 acts/week) |
| EN leftovers (Lock A fields) | **0** |
| Empty `titlu` / `pasi` / `gata_cand` | **0** |
| `tema_saptamana` drift within week | **0** |
| Seed `teme` ↔ act `tema_saptamana` | **0** drift |
| Playful character/ritual map 2–3 | **N/A** (pilot is banda 1–2 only) |
| **FAIL — title↔body P1** | **8** |
| title↔body P2 (softer) | **3** |
| Mono-word titles | **0** |
| NIT — thin ≤2-word titles | **8** |
| NIT — `să crește` → `să crească` | **28** |
| NIT — empty `( )` glitch | **1** |
| NIT — outline theme wording drift | **2** (S26, S49) |
| NIT — `materiale: []` (no-props) | **158** (coherent; not FAIL) |

---

## Closed / OK

### EN Lock A — **PASS (0)**
Scanner tokens (Ball, My turn, Turn, Walk, Fruit, Look, Hello, Again, Water, Hand, Open, Go, Stop, Thank you, High five, Done, Soft, Hard, Book, + smoke glossary): **0** whole-word hits on `titlu` / `materiale` / `pasi` / `gata_cand` / `tema_saptamana` with RO-aware boundaries (rejects FPs like `găsit`⊃sit, `Turnăm`⊃turn).

Spot S32: pasi use `„Minge.”` only (no `Ball` / `Turn`).

### Empty required fields — **PASS (0)**

### `tema_saptamana` — **PASS**
All 52 weeks: every act shares one theme; matches file-level `teme` map.

### Playful pilot 2–3 — **N/A**
`src/lib/playful-pilot.ts` is GO-locked for **banda 1–2** only. No `playful-*-2-3` map / character / ritual overlay in repo. Character–theme–ritual coherence for 2–3: **not applicable** until a 2–3 playful wave exists.

### Mono-word titles — **PASS (0)**
No single-content-word titles. (Optional thin ≤2-word list under NITs.)

---

## FAIL table (8) — actionable P1

Pattern: **keep `titlu` + `tema_saptamana`**; rewrite `materiale` / `pasi` (≤3 lines) / `gata_cand` so the titled object appears. Copy grounded in existing title + week theme.

| id | titlu (seed) | issue | proposed fix (materiale · pasi · gata_cand) | priority |
|----|--------------|-------|-----------------------------------------------|----------|
| `s34-2-3-z2-resurse` | Cutia cu frunză — la loc | titlu frunză+cutie; corp doar cutie | `cutie, frunză` · După colectat: puneți frunza în cutie, apoi cutia la loc. / „Frunză. La loc.” · A ajutat cu frunza sau cutia. | P1 |
| `s39-2-3-z1-resurse` | Ajunge — farfuria cu fruct la loc | titlu fruct; corp doar farfurie | `farfurie, fruct` · După gustare: „Ajunge.” / Farfuria cu fruct (sau goală) la loc. · A ajutat cu farfuria după fruct. | P1 |
| `s39-2-3-z3-resurse` | Farfuria goală după fruct — la loc | titlu fruct; corp doar farfurie | `farfurie` (+ mențiune fruct) · „După fruct: goală. Ajunge.” / Farfuria la loc. · Farfuria goală după fruct e la loc. | P1 |
| `s39-2-3-z5-resurse` | Totul de masă cu fruct — la loc | titlu fruct; corp masă fără fruct | `farfurie, pahar, șervet` · Strângeți după fruct: „La loc.” / „Masa cu fruct e gata.” · Obiectele de masă (după fruct) la loc. | P1 |
| `s39-2-3-z7-resurse` | Masa cu fruct strânsă înainte de calm | titlu fruct; corp masă fără fruct | `farfurie / pahar` · Strângeți masa cu fruct: „La loc.” / „Gata. Liniște.” · Masa cu fruct e strânsă înainte de calm. | P1 |
| `s28-2-3-z5-resurse` | Cizmele curate lângă ușă | titlu ușă; corp „la loc” fără ușă | `cizme` · După șters: puneți cizmele lângă ușă. / „Cizme. Ușă.” · Cizmele curate sunt lângă ușă. | P1 |
| `s2-2-3-z4-resurse` | Paharul la loc pe masă | titlu masă; corp „pe locul lui” | `pahar, masă` · Luați paharul. / Puneți-l pe masă: „La loc. Masă.” · Paharul e pe masă. | P1 |
| `s31-2-3-z2-resurse` | Paharul după semințe — la loc | titlu semințe; corp doar pahar | `pahar` · După udatul semințelor: „La loc.” / „Semințe. Gata.” · Paharul e la loc după semințe. | P1 |

**Priority summary:** **0× P0** · **8× P1** · **3× P2** (below).

---

## P2 table (3) — softer title↔body

| id | titlu (seed) | issue | proposed direction | priority |
|----|--------------|-------|--------------------|----------|
| `s31-2-3-z6-resurse` | Udatul de azi la semințe — gata | titlu semințe; corp pahar/ghiveci fără semințe | `pahar, ghiveci` · „Udatul la semințe — ajunge. Gata.” / Paharul la loc. · Udatul semințelor e închis. | P2 |
| `s31-2-3-z2-mental` | Uscat și ud — pământul seminței | titlu seminței; corp pământ/plantă (related soft) | `pământ, semințe / sămânță` · „Uscat.” / „Ud — sămânța vrea ud.” · A deosebit uscat/ud la pământul seminței. | P2 |
| `s42-2-3-z6-resurse` | Cutia de frunze — plin destul | titlu frunze; corp „obiecte din natură” proxy | `cutie, frunze` · Puneți trei frunze: „Plin destul.” / „Frunze. Gata.” · Cutia de frunze are trei. | P2 |

---

## NITs (not FAIL — optional polish)

### Soft title↔body (OR / surface „pe masă” / zone) — not escalated
| id | titlu | note |
|----|-------|------|
| `s3-2-3-z6-fizic` | Pași pe pietriș sau iarbă | OR surfaces; body „două suprafețe” |
| `s8-2-3-z5-social` | Privim împreună frunza pe geam sau pe jos | OR geam/jos; frunză present; also empty `( )` glitch |
| `s10-2-3-z6-fizic` | Colectăm afară sau lângă fereastră | OR location |
| `s11-2-3-z7-fizic` | Mișcare liberă — lumină sau umbră | body „zone” under theme |
| `s5-2-3-z6-mental` | Trei culori pe masă | masă = surface; culori present |
| `s8-2-3-z6-mental` | Trei texturi pe masă | surface; texturi present |
| `s10-2-3-z6-mental` | Trei grămezi pe masă | surface |
| `s42-2-3-z6-mental` | Trei texturi pe masă | surface |
| `s43-2-3-z6-mental` | Trei grămezi pe masă — sortăm | surface |
| `s46-2-3-z2-mental` | Asta sau aia — două pe masă | surface |
| `s52-2-3-z4-resurse` | Trei pe masă — alege, gata | surface |

### Thin titles (≤2 words) — optional Varianta A (not mono FAIL)
| id | titlu |
|----|-------|
| `s17-2-3-z3-mental` | Pasăre — ciripit |
| `s19-2-3-z1-mental` | Întoarcem pagina |
| `s2-2-3-z5-mental` | Ascultăm apa |
| `s3-2-3-z7-mental` | Carte liniștită |
| `s23-2-3-z1-social` | Împărtășește mirosul |
| `s50-2-3-z1-social` | Liniște împreună |
| `s9-2-3-z4-mental` | Suflăm — Suflăm |
| `s12-2-3-z1-social` | Împărtășim senzația |

### Grammar — `să crește` → `să crească` (28 ids)
Subjunctive error in pasi/gata. Full id list: `APPENDIX-ORTO-SA-CRESTE-BANDA-2-3-IDS.txt`.

### Copy glitch
| id | issue |
|----|-------|
| `s8-2-3-z5-social` | empty `( )` in pasi — strip |

### Outline wording (seed vs `OUTLINE-S1-S52-BANDA-2-3-GIFTED.md`)
| Week | seed `tema_saptamana` | outline |
|------|----------------------|---------|
| S26 | Jumătate de an: favoritele | Jumătate de an: repetăm favoritele |
| S49 | Repetăm 3 favorita | Repetăm 3 favorite |

Minor; align on next copy wave if desired.

### Materials empty `[]` (158)
Social/mental/ritual no-props. Coherent; not FAIL.

---

## Method notes
1. Loaded 14 Lock A stripped seeds from `/tmp/en-qa48/content/` → **1456** rows.
2. Prefer `/tmp` over workspace: workspace S32 pasi still bilingual (`„Ball. Minge.”`).
3. Programmatic scans: EN glossary (RO-aware boundaries); object-family title↔body; mono/thin titles; empty fields; tema equality; `să crește` grammar; glitch `( )`.
4. Title↔body judgment mirrors banda 1–2 P1 waves: clear object mismatch only; OR/surface/zone kept as NIT soft.
5. Playful: confirmed `playful-pilot.ts` header = banda 1–2 only.

---

## Next (human gate)
1. **Răzvan / MannyQ** review FAIL table (8× P1) + optional P2 (3).
2. Only after GO: ticket Rusty for title↔body wave (seed + migration; live id remap `2-3`→`b23`).
3. Optional follow-ups (not blocking): `să crească` (28), empty `( )` on `s8-2-3-z5-social`, S49 theme plural.
4. **No PR / merge / SQL** from this check. **No self-fix.**

---

## Appendix — themes (seed)

| Week | tema_saptamana |
|------|----------------|
| S1 | Casa și curtea |
| S2 | Apa în casă și afară |
| S3 | Sunete și liniște |
| S4 | Mâini și degete |
| S5 | Culori pe care le vedem |
| S6 | Sus și jos |
| S7 | Înăuntru și afară |
| S8 | Frunze și pământ |
| S9 | Vânt și aer |
| S10 | Colectăm și sortăm |
| S11 | Lumină și umbră |
| S12 | Cald și rece |
| S13 | Haine pe vreme |
| S14 | Pași pe drumul scurt |
| S15 | Mâncare împreună |
| S16 | Apă și sete |
| S17 | Animale pe care le auzim |
| S18 | Joacă de-a rândul |
| S19 | Cartea de seară |
| S20 | Ordine mică în cameră |
| S21 | Iarna pe pervaz |
| S22 | Corp care se mișcă în casă |
| S23 | Mirosuri din casă |
| S24 | Familia și oaspeții |
| S25 | Lumină de seară |
| S26 | Jumătate de an: favoritele |
| S27 | Zăpadă sau ploaie la geam |
| S28 | Dezgheț și noroi |
| S29 | Muguri și iarbă nouă |
| S30 | Păsări dimineața |
| S31 | Semințe și udat |
| S32 | Mingea afară |
| S33 | Nisip și găleată |
| S34 | Umbre pe pământ |
| S35 | Apă afară (joc scurt) |
| S36 | Insecte de departe |
| S37 | Umbră și loc răcoros |
| S38 | Piciorul pe iarbă |
| S39 | Fructe pe care le vedem |
| S40 | Ajutor la treabă scurtă |
| S41 | Drumul până la poartă |
| S42 | Vânt și frunze din nou |
| S43 | Coșul și strânsul |
| S44 | Prieteni și familie |
| S45 | Corp puternic, pași mulți |
| S46 | Întrebări cu arătatul |
| S47 | Grijă de lucruri |
| S48 | Salut și la revedere |
| S49 | Repetăm 3 favorita |
| S50 | Casă liniștită |
| S51 | Curtea cunoscută |
| S52 | Anul se închide blând |

---

## Machine-readable lists
- `APPENDIX-TITLE-BODY-P1-BANDA-2-3-IDS.txt` — 8 P1 ids  
- `APPENDIX-TITLE-BODY-P1-BANDA-2-3-IDS.tsv` — id / titlu / issue  
- `APPENDIX-TITLE-BODY-P2-BANDA-2-3-IDS.txt` — 3 P2 ids  
- `APPENDIX-ORTO-SA-CRESTE-BANDA-2-3-IDS.txt` — 28 grammar ids  
