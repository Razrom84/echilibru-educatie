# BRIEF P4 — Title↔body residual (8 ids: cizmă / șosete / rufe)

**Status:** LOCKED · Varianta LOCK B · Cristina · 20 Sep 2026 · **GO Răzvan**
**Bandă:** 1–2 live · **După:** FINAL CHECK RERUN FAIL pe `main` post-P3 · P0–P3 closed OK
**Regulă LOCK B:** păstrează `titlu` + `tema_saptamana`; rescrie `materiale` / `pasi` (2 linii) / `gata_cand`
**În afara scope:** P0–P3 ship · NIT mono (6) · soft proxies · chrome · banda 2–3
**Ticket Rusty:** `docs/TICKET-P4-TITLE-BODY-8.md` — GO acum
**Sursă:** `docs/FINAL-CHECK-BANDA-1-2-RERUN.md`

## Rezumat
- **8× P1** — cizmă/cizme (6), șosete (1), rufe+coș (1)
- Gap: lexiconul pre-P3 nu acoperea aceste obiecte

## Tabel (8)

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

## Spot QA (după preview)
Toate 8 (set mic):
1. `s27-2-3-z3-fizic` · 2. `s27-2-3-z3-resurse` · 3. `s27-2-3-z6-resurse`
4. `s28-2-3-z3-social` · 5. `s28-2-3-z4-resurse` · 6. `s28-2-3-z6-resurse`
7. `s35-2-3-z3-resurse` · 8. `s23-2-3-z4-resurse`

## Done when
1. Ticket Rusty seed + migration 8
2. PASS Cristina pe preview (spot 8 = all)
3. Merge Răzvan/MannyQ + migration Familie
4. Re-run final check → așteptat PASS (doar NIT rămân)

## Anti-P5
Extinde scannerul title↔body cu cizmă/șosete/rufe în același PR.
