# TICKET — Strip EN banda 2–3 (Lock A, 463)

**To:** Rusty (sau cloud agent **doar** pe acest ticket, nu pe enable) · **From:** Cristina  
**GO:** 20 Sep 2026 — Lock A (MannyQ / Răzvan)  
**Repo:** echilibru-educatie · **Bandă:** 2–3 only  
**No self-merge.** PR → preview → QA Cristina → merge Răzvan/MannyQ + migration Familie.

**Nu amesteca** cu enable cohort (`bc-ef5eb957`).

Brief: `docs/BRIEF-EN-STRIP-BANDA-2-3.md`  
IDs: `docs/APPENDIX-EN-STRIP-BANDA-2-3-IDS.txt` (463) · TSV: `APPENDIX-EN-STRIP-2-3-IDS.tsv`  
Smoke: `docs/SMOKE-BANDA-2-3-CONTENT.md`

---

## Simptom

Copy banda 2–3 are label-uri EN în `titlu` / `pasi` / etc. (~463 acts; S32 = 28/28 P0).  
Politică lock: engleză lived = părinți, **nu** app. PRINCIPII/OUTLINE: 0 EN.

## Așteptat

1. Pentru **fiecare** id din appendix: strip tot EN din câmpurile copy; înlocuire RO per glosar + reguli din brief (sens + structură păstrate).
2. Seed JSON `seed-*-banda-2-3-v2.json` actualizat.
3. SQL migration: `UPDATE` pe `activities` unde `banda='2-3'` și `id` = remap seed (`sN-2-3-…` → `sN-b23-…`). Vezi `docs/IMPORT-BANDA-2-3-ID-MAP.md`.
4. **Nu** atinge `banda='1-2'` / ids fără `b23`.
5. Script/scanner post: 0 hit pe token-urile smoke EN pe seed 2–3.
6. Migration Familie **doar după** PASS Cristina pe preview.

## Done

1. PR deschis (fără merge) + preview URL + SHA  
2. Ping Cristina pentru QA  
3. După PASS → merge + apply migration Familie  
4. Re-smoke EN = 0

## Spot QA (Cristina)

**Obligatoriu — S32 (toate 28)** pe preview: zero `Ball` / `My turn` / `Turn` / alte EN; sens minge/rând păstrat.

**Spot +8** (săptămâni cu densitate EN din smoke): câte 1–2 id-uri din S14, S15, S18, S30, S36, S39, S48, S52 — verificare vizuală pasi/titlu RO.

## Anti-regresie

Același PR: rulează scannerul EN (lista din smoke) pe tot seed 2–3 → **0 FAIL**. Dacă apar token-uri EN noi în afara listei, extinde scannerul și strip.

## Out of scope

Enable cohort / `bandFromBirthdate` · banda 1–2 · UI chrome · playful S8–S10 · seed 3–7.
