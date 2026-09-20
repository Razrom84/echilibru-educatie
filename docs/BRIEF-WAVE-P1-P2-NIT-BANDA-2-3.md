# BRIEF — Wave unificat P1+P2+NIT banda 2–3

**Status:** LOCKED · Cristina · 20 Sep 2026 · **GO Răzvan** (via MannyQ)  
**PR:** un singur PR · fără self-merge  
**Sursă:** `docs/FINAL-CHECK-BANDA-2-3.md`  
**Live ids:** seed `sN-2-3-…` → live `sN-b23-…` (map ca #48) · `banda='2-3'` only

## Scope (un PR)

| Wave | n | Acțiune |
|------|---:|---------|
| **P1** title↔corp | 8 | LOCK B: KEEP `titlu`+`tema_saptamana`; rewrite `materiale`/`pasi`/`gata_cand` |
| **P2** title↔corp soft | 3 | same LOCK B |
| **NIT** orto | 28 | `să crește` → `să crească` în pasi/gata (S29/S31/S38) |

**Out:** banda 1–2 · enable/cohort · chrome · playful · alte NIT (thin titles, outline wording) · self-merge · mig Familie înainte de PASS

## LOCK B (P1+P2)
- Păstrează `titlu` + `tema_saptamana` exact
- Rescrie doar `materiale`, `pasi` (≤3 linii), `gata_cand`
- Zero EN
- Obiectul din titlu trebuie să apară în corp

## Done when
1. PR deschis (seed JSON + SQL UPDATE pe `sN-b23-…` where banda='2-3')
2. Preview + SHA → QA Cristina (spot P1 all 8 + 2×P2 + 3×orto)
3. PASS → MannyQ merge-call + mig Familie
