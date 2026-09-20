# BRIEF — S32 banda 2–3 aliniază pe balon (GO A)

**Status:** LOCKED · Cristina · 20 Sep 2026 · **GO Răzvan** (default A, ca 1–2)  
**Personaj:** Balonaș (playful) — **neschimbat**  
**Temă:** `Balonul afară` (înlocuiește `Mingea afară`)  
**Sursă audit:** `docs/AUDIT-BANDA-2-3-PERSONAJ-TEMA.md`  
**Live ids:** `s32-b23-*` · `banda='2-3'` only

## Problem
Playful chrome S32 = Balonaș / Balonul afară; seed+DB 2–3 = minge. Mismatch obiect.

## Fix (LOCK)
- KEEP playful character/header
- Rewrite **all 28** S32 2–3 activities: tema_saptamana, titlu, materiale, pasi, gata_cand → **balon** (copy = banda 1–2 S32, already locked)
- Zero `minge` / `Mingea` pe S32 2–3 după fix
- Soft NIT S12/S26/S49 OUT

## Done
Seed + SQL UPDATE pe `s32-b23-*`; PR fără self-merge; preview → QA Cristina; mig Familie după PASS (MannyQ).
