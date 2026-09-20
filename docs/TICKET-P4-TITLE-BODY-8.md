# TICKET P4 — Title↔body residual (8 ids)

**To:** Rusty · **From:** Cristina · **GO:** 20 Sep 2026 (Răzvan — GO P4 all 8)
**Repo:** echilibru-educatie · **Bandă:** 1–2 live
**No self-merge.** PR only; ping Cristina for QA after preview.

## Simptom
După FINAL CHECK RERUN post-P3: **8** activități pe banda 1–2 au titlu cu **cizmă/cizme / șosete / rufe**, dar corpul vorbește despre altceva (geam, cârpă, pahar, prosop, stropitoare…).
Missed by pre-P3 scanner lexicon.

Sursă: `docs/FINAL-CHECK-BANDA-1-2-RERUN.md` · `docs/BRIEF-P4-TITLE-BODY-8.md`

## Așteptat
Pentru fiecare id: **păstrează `titlu` + `tema_saptamana`**; rescrie `materiale`, `pasi` (2 linii), `gata_cand` exact ca în tabel (**LOCK B**).
- Zero EN
- Zero proxy unde titlul zice cizme/șosete/rufe
- Seed JSON + SQL migration; migration Familie **doar după** PASS Cristina pe preview
- Nu atinge: P0–P3 shipuite, NIT mono, chrome, banda `*-b23-*`

## Done
1. PR deschis (fără merge) cu seed + migration pentru cele **8** id-uri
2. Preview URL + SHA
3. Ping Cristina: QA pe preview (toate 8)
4. După PASS Cristina → Răzvan/MannyQ merge + apply migration pe Familie

## Tabel copy (8)

| id | prio | titlu (păstrat) | materiale | pasi | gata_cand | tema (păstrată) |
|----|------|-----------------|-----------|------|-----------|-----------------|
| `s27-2-3-z3-fizic` | P1 | Cizmele la ușă | cizme | Puneți cizmele la ușă pe scurt. / „Cizme. Ușă.” | A ajutat cu cizmele sau a privit. | Zăpadă sau ploaie la geam |
| `s27-2-3-z3-resurse` | P1 | Cizmele după geam | cizme | După geam: cizmele la loc. / „Cizme. La loc.” | A ajutat cu cizmele. | Zăpadă sau ploaie la geam |
| `s27-2-3-z6-resurse` | P1 | Șosetele după geam | șosete | După geam: șosetele la loc. / „Șosete. La loc.” | A ajutat cu șosetele. | Zăpadă sau ploaie la geam |
| `s28-2-3-z3-social` | P1 | Arătăm cizma | cizmă | Arătați cizma împreună. / „Împreună. Cizmă.” | A privit cizma cu adultul. | Dezgheț și noroi |
| `s28-2-3-z4-resurse` | P1 | Cizmele după băltoacă | cizme | După băltoacă: cizmele la loc. / „Cizme. La loc.” | A ajutat cu cizmele. | Dezgheț și noroi |
| `s28-2-3-z6-resurse` | P1 | Cizmele la loc, după curte | cizme | După curte: cizmele la loc. / „Cizme. La loc.” | A ajutat cu cizmele. | Dezgheț și noroi |
| `s35-2-3-z3-resurse` | P1 | Cizmele după băltoacă | cizme | După băltoacă: cizmele la loc. / „Cizme. La loc.” | A ajutat cu cizmele. | Apă afară (joc scurt) |
| `s23-2-3-z4-resurse` | P1 | Rufele în coș | rufe, coș | Puneți rufele în coș. / „Rufele. Coș.” | A ajutat cu rufele în coș. | Mirosuri din casă |

## Spot QA (Cristina) — all 8
1. `s27-2-3-z3-fizic` — Cizmele la ușă
2. `s27-2-3-z3-resurse` — Cizmele după geam
3. `s27-2-3-z6-resurse` — Șosetele după geam
4. `s28-2-3-z3-social` — Arătăm cizma
5. `s28-2-3-z4-resurse` — Cizmele după băltoacă
6. `s28-2-3-z6-resurse` — Cizmele la loc, după curte
7. `s35-2-3-z3-resurse` — Cizmele după băltoacă
8. `s23-2-3-z4-resurse` — Rufele în coș

## Anti-P5 — scanner lexicon (same PR)
Extinde scannerul title↔body (scriptul din audit/final-check) cu stem-uri:
- `cizmă` / `cizme` / `cizma`
- `șosetă` / `șosete`
- `rufă` / `rufe` (+ `coș` când titlul e „Rufele în coș”)

Done criterion: re-run scanner pe seed post-P4 → **0 FAIL** pe aceste obiecte; fără P5 din același gap.
