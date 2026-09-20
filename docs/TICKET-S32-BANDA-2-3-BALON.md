# TICKET — S32 banda 2–3 → balon (GO A)

**To:** Rusty · **From:** Cristina · **GO:** 20 Sep 2026 (Răzvan default A)
**Repo:** echilibru-educatie · **Bandă:** 2–3 · **Week:** S32 only
**No self-merge.** Preview → QA Cristina → merge + mig Familie (MannyQ).

Brief: `docs/BRIEF-S32-BANDA-2-3-BALON.md` · Audit: `docs/AUDIT-BANDA-2-3-PERSONAJ-TEMA.md`

## Simptom
Header playful: **Balonaș · Balonul afară**. Copy 2–3: **Mingea afară** / minge în titluri+pași.

## Așteptat
1. `tema_saptamana` = `Balonul afară` pe toate 28 id-uri S32 2–3
2. Tabel LOCK mai jos (copy = 1–2 S32 balon; ids remapped)
3. Seed JSON + SQL UPDATE pe live `s32-b23-*` WHERE banda='2-3'
4. Zero `minge`/`Mingea` pe S32 2–3 după fix; zero EN
5. Soft NIT S12/S26/S49 OUT

## Done
1. PR deschis (fără merge) + preview URL + SHA
2. Ping Cristina QA (spot 8 + scan minge=0 pe S32)
3. După PASS → merge + mig Familie (MannyQ)

## Tabel LOCK (28) — KEEP personaj Balonaș

| seed id | live id | titlu | materiale | pasi | gata_cand | tema |
|---------|---------|-------|-----------|------|-----------|------|
| `s32-2-3-z1-fizic` | `s32-2-3-z1-fizic` | Ținem balonul de sfoară | balon cu sfoară | În curte: țineți sfoara împreună pe scurt. / „Balon.” 10–20 de secunde. | A ținut sfoara sau a atins balonul. | Balonul afară |
| `s32-2-3-z1-mental` | `s32-2-3-z1-mental` | Balonul e ușor | balon cu sfoară | Arătați balonul: „Balon.” / „Ușor.” pe scurt. | A auzit balon și ușor. | Balonul afară |
| `s32-2-3-z1-resurse` | `s32-2-3-z1-resurse` | Balonul lângă ușă | balon cu sfoară | Așezați balonul (sfoara strânsă) lângă ușă înainte să ieșiți. / „Balon. Aici.” | A ajutat să așeze balonul. | Balonul afară |
| `s32-2-3-z1-social` | `s32-2-3-z1-social` | Ținem balonul împreună | balon cu sfoară | Stați afară lângă adult, amândoi pe sfoară. / „Împreună. Balon.” fără forțare. | A fost prezent cu balonul afară. | Balonul afară |
| `s32-2-3-z2-fizic` | `s32-2-3-z2-fizic` | Bătem ușor în balon | balon cu sfoară | Bateți ușor o dată în balon, cu adult. / „Balon. Bătut.” fără grabă. | A bătut în balon sau a atins-o. | Balonul afară |
| `s32-2-3-z2-mental` | `s32-2-3-z2-mental` | Balonul e moale | balon cu sfoară | Atingeți balonul: „Moale.” pe scurt. / „Balon.” | A auzit moale (și balon). | Balonul afară |
| `s32-2-3-z2-resurse` | `s32-2-3-z2-resurse` | Balonul pe scaun, la loc | balon cu sfoară | Așezați balonul pe scaun când nu jucați (sfoara strânsă). / „Balon. Aici.” | A așezat balonul sau a privit. | Balonul afară |
| `s32-2-3-z2-social` | `s32-2-3-z2-social` | Bătem pe rând | balon cu sfoară | Voi bateți ușor. „Acum tu.” / Așteptați fără forțare. | A bătut sau a privit rândul. | Balonul afară |
| `s32-2-3-z3-fizic` | `s32-2-3-z3-fizic` | Balonul sus, deasupra capului | balon cu sfoară | Ridicați balonul deasupra capului pe scurt, cu adult. / „Sus. Balon.” | A privit balonul sus sau a ținut sfoara. | Balonul afară |
| `s32-2-3-z3-mental` | `s32-2-3-z3-mental` | Sus — sau jos? | balon cu sfoară | Ridicați: „Sus.” / Coborâți aproape de sol: „Jos.” | A auzit sus și jos. | Balonul afară |
| `s32-2-3-z3-resurse` | `s32-2-3-z3-resurse` | Sfoara strânsă în mână | balon cu sfoară | Înfășurați sfoara pe scurt în mână. / „Sfoară. Strâns.” | A atins sfoara strânsă sau a privit. | Balonul afară |
| `s32-2-3-z3-social` | `s32-2-3-z3-social` | Ridicăm balonul împreună | balon cu sfoară | Ridicați împreună pe scurt. / „Împreună. Sus.” fără forțare. | A ținut sfoara la ridicare sau a privit. | Balonul afară |
| `s32-2-3-z4-fizic` | `s32-2-3-z4-fizic` | Umblăm cu balonul în curte | balon cu sfoară | Mergeți câțiva pași ținând sfoara. / „Balon. Pași.” | A mers cu sfoara sau a privit. | Balonul afară |
| `s32-2-3-z4-mental` | `s32-2-3-z4-mental` | Balonul pe iarbă | balon cu sfoară | Lăsați balonul să atingă iarba pe scurt. „Balon. Iarbă.” / Întrebați: „Unde e?” | A privit sau a arătat balonul. | Balonul afară |
| `s32-2-3-z4-resurse` | `s32-2-3-z4-resurse` | Balonul nu rămâne afară | balon cu sfoară | Aduceți balonul lângă ușă după joacă. / „Balon. La ușă.” | A adus balonul sau a ajutat. | Balonul afară |
| `s32-2-3-z4-social` | `s32-2-3-z4-social` | Ne jucăm cu balonul | balon cu sfoară | Căutați / arătați balonul pe scurt lângă adult. / „Împreună. Unde e?” fără grabă. | A căutat sau a arătat balonul. | Balonul afară |
| `s32-2-3-z5-fizic` | `s32-2-3-z5-fizic` | Mergem ținând sfoara | balon cu sfoară | Mergeți ținând sfoara (nu loviți cu piciorul). / „Sfoară. Pași.” | A ținut sfoara la mers sau a privit. | Balonul afară |
| `s32-2-3-z5-mental` | `s32-2-3-z5-mental` | Sfoară lungă — sau scurtă? | balon cu sfoară | Arătați sfoara desfășurată: „Lungă.” / Apoi strânsă: „Scurtă.” | A auzit lungă și scurtă. | Balonul afară |
| `s32-2-3-z5-resurse` | `s32-2-3-z5-resurse` | Sfoara înfășurată, la loc | balon cu sfoară, cui sau cutie | Înfășurați sfoara; puneți balonul pe cui / în cutie. / „La loc.” | A ajutat să pună balonul la loc. | Balonul afară |
| `s32-2-3-z5-social` | `s32-2-3-z5-social` | Mergem cu balonul împreună | balon cu sfoară | Mergeți amândoi pe sfoară pe scurt. / „Împreună. Pași.” fără forțare. | A mers lângă adult cu sfoara sau a privit. | Balonul afară |
| `s32-2-3-z6-fizic` | `s32-2-3-z6-fizic` | Balonul se leagănă | balon cu sfoară | Legănați ușor balonul de sfoară pe scurt. / „Balon. Legăn.” | A privit legănatul sau a ținut sfoara. | Balonul afară |
| `s32-2-3-z6-mental` | `s32-2-3-z6-mental` | Se mișcă în aer | balon cu sfoară | Arătați mișcarea: „Aer.” / „Balon.” pe scurt. | A auzit aer / balon. | Balonul afară |
| `s32-2-3-z6-resurse` | `s32-2-3-z6-resurse` | Balonul în casă, la loc | balon cu sfoară, cui sau cutie | Intrați; puneți balonul pe cui / în cutie. / „Balon. La loc.” | A pus balonul la loc sau a ajutat. | Balonul afară |
| `s32-2-3-z6-social` | `s32-2-3-z6-social` | Arătăm balonul | balon cu sfoară | Intrați lângă adult cu balonul. / „Împreună. Uite.” fără grabă. | A intrat cu balonul sau a privit. | Balonul afară |
| `s32-2-3-z7-fizic` | `s32-2-3-z7-fizic` | Plimbare cu balonul | balon cu sfoară dacă vrea | El dictează direcția în curte pe scurt, cu adult. / La final: sfoara în mână dacă vrea. | A mers liber pe scurt în curte. | Balonul afară |
| `s32-2-3-z7-mental` | `s32-2-3-z7-mental` | Cartea cu balonul | carte cu imagini | El întoarce pagina. / Arătați balon / sfoară / afară dacă e clar: „Balon.” | A întors pagina sau a privit. | Balonul afară |
| `s32-2-3-z7-resurse` | `s32-2-3-z7-resurse` | Balonul pe cui | balon cu sfoară, pantofi | Balonul pe cui; pantofii lângă ușă. / „La loc. Gata.” | A ajutat să pună la loc. | Balonul afară |
| `s32-2-3-z7-social` | `s32-2-3-z7-social` | Noapte bună | — | „Noapte bună.” / Lumină mică, fără grabă. | A auzit ritualul de noapte. | Balonul afară |

## Spot QA (Cristina)
1. Header S32: Balonaș · Balonul afară
2. `s32-b23-z1-fizic` — balon/sfoară (nu minge)
3. `s32-b23-z1-resurse`, `s32-b23-z4-fizic`, `s32-b23-z6-resurse`, `s32-b23-z7-resurse`
4. Scanner: 0× minge pe S32 2–3 seed

## Out of scope
Playful-pilot changes · banda 1–2 · NIT S12/S26/S49 · self-merge
