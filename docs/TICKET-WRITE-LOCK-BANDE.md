# TICKET — Write lock: live + banda anterioară editabile

**To:** Rusty · **From:** Cristina · **GO:** 20 Sep 2026 (Răzvan via MannyQ)  
**Repo:** echilibru-educatie · **PR separat** (nu amesteca cu S32)  
**No self-merge.** Preview → QA Cristina.

Brief: `docs/BRIEF-WRITE-LOCK-BANDE.md`

## Simptom
`weekWritesAllowed` (V1.5) blochează orice `viewBand !== liveBand`. Live 2–3 + preview 1–2 = RO total pe bifă/notă/poză.

## Așteptat
1. Extinde `weekWritesAllowed` (sau helper): writable dacă
   - `viewBand === liveBand` **sau** `viewBand === previousBand(liveBand)`, **și**
   - `weekRelation(viewWeek, officialWeek) !== 'future'`
2. `previousBand`: pe lanțul `1-2,2-3,3-4,4-5,5-6,6-7`; live `1-2` → fără anterioară (doar live).
3. Benzi mai vechi / mai noi decât (live|anterioară) → RO.
4. Banner preview: text care reflectă editabil vs doar citire (dacă există `previewBannerText`).
5. Teste unit: matrice live=`2-3` → write pe `2-3` + `1-2` (past/current); RO pe `3-4`+; RO future S# pe ambele.
6. Digests/mail neschimbate.

## Done
1. PR + preview URL + SHA
2. Ping Cristina QA (spot mai jos)
3. După PASS → merge (MannyQ)

## Spot QA (Cristina)
1. Copil live **2–3**: Azi S# curent → bifă OK.
2. Preview **1–2**, S# trecut → bifă/notă/poză OK; S# viitor → RO.
3. Preview **3–4** (dacă există chrome) sau bandă > live → RO total.
4. Live 1–2 (Demo): doar 1–2 write; fără „anterioară”.
5. Official week / digests neschimbate la nav S#.

## Out of scope
S32 copy · seed · mig Familie · self-merge
