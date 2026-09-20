# BRIEF — Write lock benzi (live + anterioară)

**Status:** LOCKED · Cristina · 20 Sep 2026 · GO Răzvan (via MannyQ)  
**După:** #50 S32→balon PASS + mig Familie  
**Depinde de:** V1.5 (`weekWritesAllowed`) — azi doar `viewBand === liveBand`

## Problem
Părintele pe preview bandă anterioară (ex. live 2–3 → preview 1–2) nu poate bifa/nota/poza pe S# trecut/curent. Răzvan: editabil = **banda live + banda imediat anterioară**; benzi mai vechi RO; viitor RO.

## Lock
Ordine benzi pilot: `1-2` → `2-3` → `3-4` → `4-5` → `5-6` → `6-7`.

| viewBand | write (bifă/notă/poză) |
|----------|-------------------------|
| = live | DA dacă S# past/current; NU dacă future |
| = imediat anterioară live | DA dacă S# past/current; NU dacă future |
| mai veche decât anterioară | NU (RO) |
| mai nouă decât live (viitor) | NU (RO) |

- Navigare S# / digests / mail: **neschimbate** (session week ≠ official week).
- Preview V1.4 chrome rămâne; doar poarta de write se lărgește.
- Demo: aceleași reguli pe bandă preview.

## Out
- Edit pe benzi ≥2 pași în urmă
- Mutare bandă live / program_start
- Seed 3–7 content
- Self-merge

## Done
PR + preview → QA Cristina → merge (MannyQ) → fără mig DB (logică client).
