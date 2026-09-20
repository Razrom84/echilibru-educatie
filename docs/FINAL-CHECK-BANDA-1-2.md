# FINAL CHECK — Banda 1–2 (S1–S52)

**Date:** 2026-09-20 (Europe/Bucharest)  
**Git SHA:** `434bd02fd04a9d069b5e82882a17e74cc67e79de` (`434bd02` — `main` after #42 + #43 + #44)  
**Source:** `content/seed-*-banda-1-2.json` (**1456** activities = 52×28) + `src/lib/week.ts` + `src/lib/playful-pilot.ts`  
**Auditor:** Cristina (education lead) via Grok Bot  
**Scope:** characters / week themes / rituals · titles · materials/steps/done_when · title↔body · EN leftovers · RO orthography · P0/P1/P2 regression  

---

## Verdict: **FAIL**

Zero-change PASS is **not** met. P0 (#42), P1 (#43), and P2 (#44) closed items remain fixed on `main`, but a **residual title↔body set of 32 ids** is still open — including **3 S40 leftovers** that P1 did not cover.

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
| **FAIL — title↔body (new residual)** | **32** |
| NIT — mono-word titles (outside P2 scope) | **6** |
| NIT — `materiale: []` (no-props) | **541** (coherent; not FAIL) |

---

## Closed items — confirmed still fixed

### P0 — #42 S32 Balon / S33 Lopățică
- S32 theme/ritual/chrome: theme `Balonul afară` · character **Balonaș** · `Balonul afară.` / `Balonul, gata.`
- S32 bodies (23 locked ids): **0** `minge`; balon present where title requires it
- S33 character name: **Lopățică** (not Lopețică); theme `Nisip și găleată`
- S33 bodies: `s33-2-3-z1-fizic`, `s33-2-3-z2-resurse`, `s33-2-3-z6-fizic` use lopățică in materials/steps

### P1 — #43 title↔body 35
- All 35 ids from `docs/TICKET-P1-TITLE-BODY-35.md` keep title + aligned `materiale` / `pasi` / `gata_cand`
- S40 Măturică cluster (**10** in P1): mătură / haină / cârpă present; prosop / șervețel / lingură proxies **cleared on those 10**
- Cosmetic: `s1-2-3-z6-fizic` title uses commas (`Nisip, iarbă, pietre`) vs ticket slashes — body still aligned

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

### Characters · themes · rituals (52)
All 52 weeks: character name ↔ theme ↔ ritualOpen/Close coherent; S32/S33 locks hold. Seed `tema_saptamana` = `WEEK_THEMES` = playful `theme` for every week.

---

## FAIL table (32) — actionable

Pattern: **keep `titlu` + `tema_saptamana`** (same LOCK B as P1); rewrite `materiale` / `pasi` (2 lines) / `gata_cand` so the titled object appears. Copy grounded in existing title + week theme.

| id | titlu (seed) | issue | proposed fix (materiale · pasi · gata_cand) | priority |
|----|--------------|-------|-----------------------------------------------|----------|
| `s14-2-3-z7-resurse` | Pantofii și haina la loc | titlu pantofi+haina; corp doar pantofi | `pantofi, haină` · Puneți pantofii și haina la loc. / „La loc. Gata.” · A ajutat cu pantofii sau haina. | P1 |
| `s21-2-3-z5-resurse` | Floarea de pe pervaz, la loc | titlu floare; corp obiect generic pe pervaz | `floare pe pervaz` · Luați floarea pe scurt. / Puneți-o la loc: „Floare. Pervaz.” · A ajutat cu floarea pe pervaz. | P1 |
| `s23-2-3-z5-resurse` | Lingura la chiuvetă | titlu lingură; corp fruct/farfurie | `lingură` · Puneți lingura la chiuvetă. / „Lingură. La loc.” · A ajutat cu lingura. | P1 |
| `s23-2-3-z6-fizic` | Mirosim o floare | titlu floare; corp bucătărie generic | `floare (sau plantă cu floare)` · Mirosiți pe scurt o floare, cu adult. / „Floare. Miros.” · A mirosit sau a privit floarea. | P1 |
| `s23-2-3-z6-resurse` | Floarea rămâne afară | titlu floare afară; corp farfurie+cană | `floare afară` · Floarea rămâne afară — nu o aduceți în casă. / „Floare. Afară.” · A lăsat floarea afară sau a privit. | P1 |
| `s24-2-3-z5-resurse` | Haina oaspetelui pe cuier | titlu haină+cuier; corp pantofi | `haină, cuier` · Puneți haina oaspetelui pe cuier. / „Haină. Cuier.” · A ajutat cu haina pe cuier. | P1 |
| `s24-2-3-z6-resurse` | Haina pe cuier după vizită | titlu haină+cuier; corp foto/album | `haină, cuier` · După vizită: haina pe cuier. / „Haină. La loc.” · A ajutat cu haina după vizită. | P1 |
| `s27-2-3-z4-resurse` | Cârpa de geam, la loc | titlu cârpă geam; corp pătură | `cârpă de geam` · Puneți cârpa de geam la loc. / „Cârpă. La loc.” · A ajutat cu cârpa. | P1 |
| `s27-2-3-z5-fizic` | Haina de ploaie pe umeri | titlu haină ploaie; corp abur pe geam | `haină de ploaie` · Puneți haina de ploaie pe umeri pe scurt, cu adult. / „Haină.” 10–20 de secunde. · A purtat haina pe scurt sau a privit. | P1 |
| `s27-2-3-z5-mental` | Haină — sau fără? | titlu haină da/nu; corp abur/zăpadă | `haină de ploaie` · Arătați haina: „Haină.” / Arătați fără: „Fără.” pe scurt. · A auzit haină și fără. | P1 |
| `s27-2-3-z5-resurse` | Haina pe cârlig | titlu haină pe cârlig; corp cârpă abur | `haină` · Puneți haina pe cârlig. / „Haină. La loc.” · A ajutat să pună haina. | P1 |
| `s27-2-3-z5-social` | Te ajut la haină | titlu ajutor la haină; corp suflat pe geam | `haină` · Voi țineți haina. „Acum tu.” / Așteptați fără forțare. · A ajutat la haină sau a privit. | P1 |
| `s27-2-3-z7-resurse` | Haina și cartea la loc | titlu haină+carte; corp carte+cârpă | `haină, carte` · Puneți haina pe cârlig, cartea pe raft. / „La loc.” · A ajutat cu haina sau cartea. | P1 |
| `s28-2-3-z3-resurse` | Cârpa de cizme, la loc | titlu cârpă cizme; corp doar cizme | `cârpă, cizme` · Ștergeți pe scurt cizma cu cârpa. / „Cârpă. La loc.” · A ajutat cu cârpa sau a privit. | P1 |
| `s28-2-3-z5-resurse` | Prosopul la loc | titlu prosop; corp cizme | `prosop` · Puneți prosopul la loc după șters. / „Prosop. La loc.” · A ajutat cu prosopul. | P1 |
| `s28-2-3-z7-resurse` | Cizmele și haina la loc | titlu cizme+haină; corp cizme+cârpă | `cizme, haină` · Puneți cizmele lângă ușă, haina pe cârlig. / „La loc. Gata.” · A ajutat cu cizmele sau haina. | P1 |
| `s29-2-3-z1-fizic` | Degetul pe mugure | titlu mugure; corp iarbă/frunză | `mugure pe plantă` · Atingeți pe scurt un mugure, cu adult. / „Mugure.” 10–20 de secunde. · A atins mugurele sau a privit. | P1 |
| `s29-2-3-z1-social` | Arătăm mugurele | titlu mugure; corp iarbă | `mugure pe plantă` · Arătați mugurele împreună. / „Împreună. Mugure.” fără grabă. · A privit mugurele cu adultul. | P1 |
| `s29-2-3-z5-fizic` | Ne aplecăm la mugure | titlu mugure; corp udat plantă | `mugure pe plantă` · Aplecați-vă pe scurt spre mugure, cu adult. / „Mugure.” · A privit mugurele de aproape. | P1 |
| `s31-2-3-z3-fizic` | Așteptăm lângă ghiveci | titlu ghiveci; corp udat fără ghiveci | `ghiveci` · Stați lângă ghiveci pe scurt. / „Ghiveci.” 10–20 de secunde. · A stat lângă ghiveci sau a privit. | P1 |
| `s31-2-3-z3-resurse` | Ghiveciul pe pervaz | titlu ghiveci; corp pahar la loc | `ghiveci` · Puneți ghiveciul pe pervaz. / „Ghiveci. Pervaz.” · A ajutat cu ghiveciul. | P1 |
| `s31-2-3-z3-social` | Privim ghiveciul împreună | titlu ghiveci; corp stropitoare | `ghiveci` · Priviti ghiveciul împreună pe scurt. / „Împreună. Ghiveci.” · A privit ghiveciul cu adultul. | P2 |
| `s31-2-3-z7-fizic` | Plimbare până la ghiveci | titlu plimbare la ghiveci; corp mers generic | `ghiveci` · Mergeți pe scurt până la ghiveci, cu adult. / „Ghiveci.” la final. · A ajuns la ghiveci sau a privit. | P2 |
| `s33-2-3-z6-resurse` | Mâinile pe prosop | titlu prosop; corp formă+nisip | `prosop` · Ștergeți mâinile pe prosop pe scurt. / „Prosop. La loc.” · A atins prosopul sau a privit. | P1 |
| `s35-2-3-z1-resurse` | Prosopul afară, apoi la loc | titlu prosop; corp vas | `prosop` · Prosopul afară pe scurt, apoi la loc. / „Prosop. La loc.” · A ajutat cu prosopul. | P1 |
| `s35-2-3-z7-resurse` | Paharul și prosopul la loc | titlu pahar+prosop; corp vas+stropitoare | `pahar, prosop` · Puneți paharul și prosopul la loc. / „La loc. Gata.” · A ajutat cu paharul sau prosopul. | P1 |
| `s37-2-3-z5-resurse` | Haina pe braț, la umbră | titlu haină la umbră; corp evantai | `haină` · Puneți haina pe braț la umbră pe scurt. / „Haină. Umbră.” · A ținut haina sau a privit. | P1 |
| `s39-2-3-z5-resurse` | Șervețelul la loc | titlu șervețel; corp farfurie | `șervețel` · După gust: șervețelul la loc. / „Șervețel. La loc.” · A ajutat cu șervețelul. | P1 |
| `s40-2-3-z4-resurse` | Cuierul e gata | titlu cuier; corp șervețel (S40 leftover) | `cuier` · Arătați: cuierul e gata. / „Cuier. Gata.” · A privit cuierul sau a arătat. | P0 |
| `s40-2-3-z5-mental` | Jos, apoi în făraș | titlu făraș; corp lingură+farfurie (S40 leftover) | `făraș, mătură de copil` · Arătați: „Jos.” / „În făraș.” pe scurt. · A auzit jos și făraș. | P0 |
| `s40-2-3-z5-resurse` | Fărașul golit, la loc | titlu făraș; corp lingură (S40 leftover) | `făraș` · Goliți fărașul pe scurt, apoi la loc. / „Făraș. La loc.” · A ajutat cu fărașul. | P0 |
| `s45-2-3-z6-resurse` | Haina după plimbare | titlu haină după plimbare; corp pantofi | `haină` · După plimbare: haina pe cârlig sau cuier. / „Haină. La loc.” · A ajutat cu haina. | P1 |

**Priority summary:** **3× P0** (S40 leftovers) · **27× P1** · **2× P2** (softer ghiveci walk/look).

---

## NITs (not FAIL — optional polish)

### Mono-word titles still present (6) — outside P2 lock
P2 intentionally scoped 12 (+1 skip). These remain one-word ritual/social titles:

| id | titlu | optional Varianta A |
|----|-------|---------------------|
| `s1-2-3-z1-social` | Salut | Spunem salut |
| `s3-2-3-z2-social` | Ascultăm | Ascultăm împreună |
| `s15-2-3-z4-social` | Mulțumesc | Spunem mulțumesc |
| `s15-2-3-z6-social` | Împărțim | Împărțim pe scurt |
| `s17-2-3-z1-social` | Ascultăm | Ascultăm animalele |
| `s48-2-3-z6-mental` | Mulțumesc | Spunem mulțumesc |

### Soft title↔body (prior PASS2 soft — not escalated)
- `s7-2-3-z7-mental` — Carte pe canapea, înăuntru (body OK with carte)
- `s8-2-3-z7-mental` — Cartea cu frunze (body: pagini cu natură) — acceptable soft

### Materials empty `[]` (541)
Social/ritual activities with no props use `[]`. Coherent; normalize to `["—"]` only if product wants a sentinel.

### Orthography
No `Lopețică`; no ASCII-stripped tool names in titles. Diacritics on chrome + S32/S33 locks OK. EN lexicon scan on all copy fields: **0**.

---

## Method notes
1. Checked out `origin/main` @ `434bd02` (merges #42, #43, #44).
2. Loaded all 14 `content/seed-*-banda-1-2.json` → 1456 rows.
3. Programmatic scans: EN lexicon; mono-word titles; object-family title↔body; empty required fields; P0/P1/P2 regression keyword checks; theme equality seed / `week.ts` / playful; character SVG presence.
4. Cross-checked `docs/AUDIT-PASS2-IDS.md` open lists → closed on main seed.
5. New FAILs are **residuals not in P1/P2 tickets**, plus **3 S40 ids P1 missed** (`z4-resurse`, `z5-mental`, `z5-resurse`).

---

## Next (human gate)
1. **Răzvan** reviews FAIL table (esp. 3× S40 P0 leftovers).
2. Only after GO: ticket Rusty for a P3 wave (32 UPDATEs, same seed+migration pattern as #43).
3. No band 2–3 work; no PR / merge / migration from this check.
