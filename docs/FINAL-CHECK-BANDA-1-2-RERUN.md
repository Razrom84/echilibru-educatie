# FINAL CHECK RERUN — Banda 1–2 (S1–S52) post-P3

**Date:** 2026-09-20 (Europe/Bucharest, EEST)  
**Git SHA:** `f8f715e053ef9b5ec37acfe2e7049bbcb87dd4ea` (`f8f715e` — `main` after #42 + #43 + #44 + **#45 P3**)  
**Source:** `content/seed-*-banda-1-2.json` (**1456** activities = 52×28) + `src/lib/week.ts` + `src/lib/playful-pilot.ts`  
**Auditor:** Cristina (education lead) via Grok Bot  
**Scope:** re-audit after P3 live — EN · empty fields · title↔body · P0/P1/P2/P3 regression · theme/character/ritual  
**Prior doc:** [`FINAL-CHECK-BANDA-1-2.md`](./FINAL-CHECK-BANDA-1-2.md) (FAIL @ `434bd02`, 32 residuals → P3)

---

## Verdict: **FAIL**

**P3 closed:** all **32** prior FAIL ids are now title↔body aligned on seed.  
**P0 / P1 / P2** remain fixed. EN / empty required / theme drift / SVG: clean.

**New blocking set:** **8** title↔body residuals (mostly **cizmă / șosete / rufe**), missed by the pre-P3 scanner’s object lexicon. Same LOCK B class as P3 — not mono, not chrome.

**Do not open a Rusty ticket until Răzvan reviews this doc.**

---

## Counts

| Check | Result |
|-------|-------:|
| Activities scanned | **1456** |
| Weeks covered | **52** (S1–S52) |
| EN leftovers | **0** |
| Empty `titlu` / `pasi` / `gata_cand` | **0** |
| Theme drift (seed ↔ `week.ts` ↔ playful) | **0** |
| Character SVG missing | **0** |
| P0 S32 regression (`minge` in S32) | **0** |
| P0 S33 chrome orto `Lopățică` | **PASS** |
| P1 (35) regression | **0** |
| P2 (12) titles Varianta A | **PASS** (skip `s32-2-3-z2-mental` = `Balonul e moale`) |
| P3 (32) bodies aligned | **PASS** (32/32) |
| **FAIL — title↔body (new residual)** | **8** |
| NIT — mono-word titles (outside P2 scope) | **6** |
| NIT — soft title↔body (proxy / implied) | **see NITs** |
| NIT — `materiale: []` (no-props) | **535** (coherent; not FAIL) |

---

## Closed items — confirmed still fixed

### P0 — #42 S32 Balon / S33 Lopățică
- S32: theme `Balonul afară` · character **Balonaș** · rituals `Balonul afară.` / `Balonul, gata.` · **0** `minge` in any S32 field
- S33: character name **Lopățică** (not Lopețică); theme `Nisip și găleată`; rituals `Nisip și găleată.` / `Nisipul, gata.`
- S33 bodies with lopățică: `s33-2-3-z1-fizic`, `s33-2-3-z2-resurse`, `s33-2-3-z6-fizic` OK; P3 `s33-2-3-z6-resurse` now **prosop**

### P1 — #43 title↔body 35
- All 35 ids from migration `20260920240000_align_title_body_35.sql` keep non-empty aligned bodies
- S40 Măturică cluster intact (mătură / haină / cuier on P1 ids)

### P2 — #44 mono 12 Varianta A
| id | titlu now |
|----|-----------|
| `s1-2-3-z2-social` | Spunem mulțumesc |
| `s30-2-3-z5-mental` | Pasărea zboară |
| `s31-2-3-z4-mental` | Umed și uscat |
| `s35-2-3-z5-mental` | Apa e rece |
| `s36-2-3-z4-mental` | Zumzet și liniște |
| `s38-2-3-z2-mental` | Iarba e moale |
| `s38-2-3-z3-mental` | Iarba gâdilă |
| `s38-2-3-z6-mental` | Moale și tare |
| `s39-2-3-z4-mental` | Coaja e netedă |
| `s39-2-3-z5-mental` | Gust dulce |
| `s40-2-3-z1-mental` | Ajutor pe scurt |
| `s52-2-3-z6-social` | Spunem mulțumim |
| SKIP `s32-2-3-z2-mental` | Balonul e moale |

### P3 — #45 title↔body 32 — **CLEARED**
All 32 ids from `docs/TICKET-P3-TITLE-BODY-32.md` / migration `20260920260000_align_title_body_32.sql`: titled object present in `materiale` + `pasi` + `gata_cand`. Spot-checked S40 leftovers (`cuier` / `făraș`) and S27 haină de ploaie.

### Characters · themes · rituals (52)
All 52 weeks: seed `tema_saptamana` = `WEEK_THEMES` = playful `theme`; character name ↔ SVG present; S32/S33 locks hold.

---

## Prior 32 FAIL — status after P3

| status | count |
|--------|------:|
| Aligned (PASS) | **32** |
| Still FAIL | **0** |

---

## FAIL table (8) — actionable (new residuals)

Pattern: **keep `titlu` + `tema_saptamana`** (LOCK B); rewrite `materiale` / `pasi` (2 lines) / `gata_cand` so the titled object appears. Copy grounded in existing title + week theme — not free invention.

| id | titlu (seed) | issue | proposed fix (materiale · pasi · gata_cand) | priority |
|----|--------------|-------|-----------------------------------------------|----------|
| `s27-2-3-z3-fizic` | Cizmele la ușă | titlu cizme; corp geam/ploaie | `cizme` · Puneți cizmele la ușă pe scurt. / „Cizme. Ușă.” · A ajutat cu cizmele sau a privit. | P1 |
| `s27-2-3-z3-resurse` | Cizmele după geam | titlu cizme; corp cârpă | `cizme` · După geam: cizmele la loc. / „Cizme. La loc.” · A ajutat cu cizmele. | P1 |
| `s27-2-3-z6-resurse` | Șosetele după geam | titlu șosete; corp obiect pe pervaz | `șosete` · După geam: șosetele la loc. / „Șosete. La loc.” · A ajutat cu șosetele. | P1 |
| `s28-2-3-z3-social` | Arătăm cizma | titlu cizmă; corp mers în curte | `cizmă` · Arătați cizma împreună. / „Împreună. Cizmă.” · A privit cizma cu adultul. | P1 |
| `s28-2-3-z4-resurse` | Cizmele după băltoacă | titlu cizme; corp pahar | `cizme` · După băltoacă: cizmele la loc. / „Cizme. La loc.” · A ajutat cu cizmele. | P1 |
| `s28-2-3-z6-resurse` | Cizmele la loc, după curte | titlu cizme; corp prosop | `cizme` · După curte: cizmele la loc. / „Cizme. La loc.” · A ajutat cu cizmele. | P1 |
| `s35-2-3-z3-resurse` | Cizmele după băltoacă | titlu cizme; corp stropitoare | `cizme` · După băltoacă: cizmele la loc. / „Cizme. La loc.” · A ajutat cu cizmele. | P1 |
| `s23-2-3-z4-resurse` | Rufele în coș | titlu rufe+coș; corp prosop pe cârlig | `rufe, coș` · Puneți rufele în coș. / „Rufele. Coș.” · A ajutat cu rufele în coș. | P1 |

**Priority summary:** **0× P0** · **8× P1** · **0× P2**.

**Why missed pre-P3:** prior `title_body` stem list covered `haina` but not `cizmă` / `șosete` / `rufe` as titled props, so these never entered the residual 32.

---

## NITs (not FAIL — optional polish)

### Mono-word titles still present (6) — outside P2 lock
| id | titlu | optional Varianta A |
|----|-------|---------------------|
| `s1-2-3-z1-social` | Salut | Spunem salut |
| `s3-2-3-z2-social` | Ascultăm | Ascultăm împreună |
| `s15-2-3-z4-social` | Mulțumesc | Spunem mulțumesc |
| `s15-2-3-z6-social` | Împărțim | Împărțim pe scurt |
| `s17-2-3-z1-social` | Ascultăm | Ascultăm animalele |
| `s48-2-3-z6-mental` | Mulțumesc | Spunem mulțumesc |

### Soft title↔body (not escalated)
- `s2-2-3-z6-fizic` — Cizmele în băltoacă (corp: pași lângă baltă; cizme implied outdoor) — prior soft
- `s23-2-3-z4-fizic` / `s23-2-3-z4-mental` — Mirosim rufe / Miroase a rufe curate? (corp: prosop curat as laundry-smell proxy) — acceptable soft
- `s26-2-3-z6-resurse` — Favorita pe raft (corp: pâine/săpun la loc; raft location soft-missing)
- S20 coș↔cutie synonym cluster (`s20-2-3-z2-resurse`, `z4-mental`, `z4-resurse`, `z4-social`, `z5-resurse`) — toddler basket≈box; not FAIL
- `s*-resurse` „Hainele pe cârlig” with `haină` present (cârlig = hang action) — OK
- `s7-2-3-z7-mental`, `s8-2-3-z7-mental` — prior PASS2 soft; still OK with carte

### Materials empty `[]` (535)
Social/ritual / no-props. Coherent; down from 541 pre-P3 (P3 filled some). Normalize to `["—"]` only if product wants a sentinel.

### Orthography
No `Lopețică`; Balonaș / Lopățică chrome OK. EN lexicon on all copy fields: **0**.

---

## Method notes
1. Checked out `origin/main` @ `f8f715e` (merges #42, #43, #44, **#45**).
2. Loaded all 14 `content/seed-*-banda-1-2.json` → 1456 rows.
3. Programmatic scans: EN lexicon; empty required fields; object-family title↔body (expanded stems: cizmă, șosete, rufe, făraș, …); P0/P1/P2/P3 regression keyword checks; theme equality seed / `week.ts` / playful; character SVG presence.
4. Explicit re-check of prior 32 FAIL ids → **32/32 aligned**.
5. New FAILs are **scanner-gap residuals**, not regressions of P0–P3.

---

## Next (human gate)
1. **Răzvan** reviews FAIL table (8× cizmă/șosete/rufe).
2. Only after GO: ticket Rusty for a P4 wave (8 UPDATEs, same seed+migration pattern as #45).
3. No band 2–3 work; no PR / merge / migration from this check.
