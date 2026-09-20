# TICKET P3 — Title↔body residual (32 ids)

**To:** Rusty · **From:** Cristina · **GO:** 20 Sep 2026 (Răzvan — GO P3 all 32)
**Repo:** echilibru-educatie · **Bandă:** 1–2 live
**No self-merge.** PR only; ping Cristina for QA after preview.

## Simptom
După FINAL CHECK pe `main` (post #42/#43/#44): **32** activități pe banda 1–2 încă au **titlu** cu obiect clar, dar `materiale` / `pasi` / `gata_cand` vorbesc despre altceva.
Include **3 leftovers S40** (cuier/făraș) neacoperite de P1.

Sursă: `docs/FINAL-CHECK-BANDA-1-2.md` · `docs/BRIEF-P3-TITLE-BODY-32.md`

## Așteptat
Pentru fiecare id din tabel: **păstrează `titlu` + `tema_saptamana`**; rescrie `materiale`, `pasi` (2 linii), `gata_cand` exact ca în tabel (**LOCK B**, același pattern ca P1).
- Zero EN
- Zero proxy (șervețel/lingură/evantai/pantofi) unde titlul zice cuier/făraș/haină/floare/mugure/ghiveci/prosop…
- Seed JSON + SQL migration; migration pe Familie **doar după** PASS Cristina pe preview
- Nu atinge: P1/P2 shipuite, S32/S33 LOCK, NIT mono (6), chrome, banda `*-b23-*`

## Done
1. PR deschis (fără merge) cu seed + migration pentru cele **32** id-uri
2. Preview URL + SHA
3. Ping Cristina: QA pe preview (spot 8 — vezi brief)
4. După PASS Cristina → Răzvan/MannyQ merge + apply migration pe Familie

## Tabel copy (32)

| id | prio | titlu (păstrat) | materiale | pasi | gata_cand | tema (păstrată) |
|----|------|-----------------|-----------|------|-----------|-----------------|
| `s14-2-3-z7-resurse` | P1 | Pantofii și haina la loc | pantofi, haină | Puneți pantofii și haina la loc. / „La loc. Gata.” | A ajutat cu pantofii sau haina. | Pași pe drumul scurt |
| `s21-2-3-z5-resurse` | P1 | Floarea de pe pervaz, la loc | floare pe pervaz | Luați floarea pe scurt. / Puneți-o la loc: „Floare. Pervaz.” | A ajutat cu floarea pe pervaz. | Iarna pe pervaz |
| `s23-2-3-z5-resurse` | P1 | Lingura la chiuvetă | lingură | Puneți lingura la chiuvetă. / „Lingură. La loc.” | A ajutat cu lingura. | Mirosuri din casă |
| `s23-2-3-z6-fizic` | P1 | Mirosim o floare | floare (sau plantă cu floare) | Mirosiți pe scurt o floare, cu adult. / „Floare. Miros.” | A mirosit sau a privit floarea. | Mirosuri din casă |
| `s23-2-3-z6-resurse` | P1 | Floarea rămâne afară | floare afară | Floarea rămâne afară — nu o aduceți în casă. / „Floare. Afară.” | A lăsat floarea afară sau a privit. | Mirosuri din casă |
| `s24-2-3-z5-resurse` | P1 | Haina oaspetelui pe cuier | haină, cuier | Puneți haina oaspetelui pe cuier. / „Haină. Cuier.” | A ajutat cu haina pe cuier. | Familia și oaspeții |
| `s24-2-3-z6-resurse` | P1 | Haina pe cuier după vizită | haină, cuier | După vizită: haina pe cuier. / „Haină. La loc.” | A ajutat cu haina după vizită. | Familia și oaspeții |
| `s27-2-3-z4-resurse` | P1 | Cârpa de geam, la loc | cârpă de geam | Puneți cârpa de geam la loc. / „Cârpă. La loc.” | A ajutat cu cârpa. | Zăpadă sau ploaie la geam |
| `s27-2-3-z5-fizic` | P1 | Haina de ploaie pe umeri | haină de ploaie | Puneți haina de ploaie pe umeri pe scurt, cu adult. / „Haină.” 10–20 de secunde. | A purtat haina pe scurt sau a privit. | Zăpadă sau ploaie la geam |
| `s27-2-3-z5-mental` | P1 | Haină — sau fără? | haină de ploaie | Arătați haina: „Haină.” / Arătați fără: „Fără.” pe scurt. | A auzit haină și fără. | Zăpadă sau ploaie la geam |
| `s27-2-3-z5-resurse` | P1 | Haina pe cârlig | haină | Puneți haina pe cârlig. / „Haină. La loc.” | A ajutat să pună haina. | Zăpadă sau ploaie la geam |
| `s27-2-3-z5-social` | P1 | Te ajut la haină | haină | Voi țineți haina. „Acum tu.” / Așteptați fără forțare. | A ajutat la haină sau a privit. | Zăpadă sau ploaie la geam |
| `s27-2-3-z7-resurse` | P1 | Haina și cartea la loc | haină, carte | Puneți haina pe cârlig, cartea pe raft. / „La loc.” | A ajutat cu haina sau cartea. | Zăpadă sau ploaie la geam |
| `s28-2-3-z3-resurse` | P1 | Cârpa de cizme, la loc | cârpă, cizme | Ștergeți pe scurt cizma cu cârpa. / „Cârpă. La loc.” | A ajutat cu cârpa sau a privit. | Dezgheț și noroi |
| `s28-2-3-z5-resurse` | P1 | Prosopul la loc | prosop | Puneți prosopul la loc după șters. / „Prosop. La loc.” | A ajutat cu prosopul. | Dezgheț și noroi |
| `s28-2-3-z7-resurse` | P1 | Cizmele și haina la loc | cizme, haină | Puneți cizmele lângă ușă, haina pe cârlig. / „La loc. Gata.” | A ajutat cu cizmele sau haina. | Dezgheț și noroi |
| `s29-2-3-z1-fizic` | P1 | Degetul pe mugure | mugure pe plantă | Atingeți pe scurt un mugure, cu adult. / „Mugure.” 10–20 de secunde. | A atins mugurele sau a privit. | Muguri și iarbă nouă |
| `s29-2-3-z1-social` | P1 | Arătăm mugurele | mugure pe plantă | Arătați mugurele împreună. / „Împreună. Mugure.” fără grabă. | A privit mugurele cu adultul. | Muguri și iarbă nouă |
| `s29-2-3-z5-fizic` | P1 | Ne aplecăm la mugure | mugure pe plantă | Aplecați-vă pe scurt spre mugure, cu adult. / „Mugure.” | A privit mugurele de aproape. | Muguri și iarbă nouă |
| `s31-2-3-z3-fizic` | P1 | Așteptăm lângă ghiveci | ghiveci | Stați lângă ghiveci pe scurt. / „Ghiveci.” 10–20 de secunde. | A stat lângă ghiveci sau a privit. | Semințe și udat |
| `s31-2-3-z3-resurse` | P1 | Ghiveciul pe pervaz | ghiveci | Puneți ghiveciul pe pervaz. / „Ghiveci. Pervaz.” | A ajutat cu ghiveciul. | Semințe și udat |
| `s31-2-3-z3-social` | P2 | Privim ghiveciul împreună | ghiveci | Priviti ghiveciul împreună pe scurt. / „Împreună. Ghiveci.” | A privit ghiveciul cu adultul. | Semințe și udat |
| `s31-2-3-z7-fizic` | P2 | Plimbare până la ghiveci | ghiveci | Mergeți pe scurt până la ghiveci, cu adult. / „Ghiveci.” la final. | A ajuns la ghiveci sau a privit. | Semințe și udat |
| `s33-2-3-z6-resurse` | P1 | Mâinile pe prosop | prosop | Ștergeți mâinile pe prosop pe scurt. / „Prosop. La loc.” | A atins prosopul sau a privit. | Nisip și găleată |
| `s35-2-3-z1-resurse` | P1 | Prosopul afară, apoi la loc | prosop | Prosopul afară pe scurt, apoi la loc. / „Prosop. La loc.” | A ajutat cu prosopul. | Apă afară (joc scurt) |
| `s35-2-3-z7-resurse` | P1 | Paharul și prosopul la loc | pahar, prosop | Puneți paharul și prosopul la loc. / „La loc. Gata.” | A ajutat cu paharul sau prosopul. | Apă afară (joc scurt) |
| `s37-2-3-z5-resurse` | P1 | Haina pe braț, la umbră | haină | Puneți haina pe braț la umbră pe scurt. / „Haină. Umbră.” | A ținut haina sau a privit. | Umbră și loc răcoros |
| `s39-2-3-z5-resurse` | P1 | Șervețelul la loc | șervețel | După gust: șervețelul la loc. / „Șervețel. La loc.” | A ajutat cu șervețelul. | Fructe pe care le vedem |
| `s40-2-3-z4-resurse` | P0 | Cuierul e gata | cuier | Arătați: cuierul e gata. / „Cuier. Gata.” | A privit cuierul sau a arătat. | Ajutor la treabă scurtă |
| `s40-2-3-z5-mental` | P0 | Jos, apoi în făraș | făraș, mătură de copil | Arătați: „Jos.” / „În făraș.” pe scurt. | A auzit jos și făraș. | Ajutor la treabă scurtă |
| `s40-2-3-z5-resurse` | P0 | Fărașul golit, la loc | făraș | Goliți fărașul pe scurt, apoi la loc. / „Făraș. La loc.” | A ajutat cu fărașul. | Ajutor la treabă scurtă |
| `s45-2-3-z6-resurse` | P1 | Haina după plimbare | haină | După plimbare: haina pe cârlig sau cuier. / „Haină. La loc.” | A ajutat cu haina. | Corp puternic, pași mulți |

## Spot QA (Cristina)
1. `s40-2-3-z4-resurse` — Cuierul e gata
2. `s40-2-3-z5-mental` — Jos, apoi în făraș
3. `s40-2-3-z5-resurse` — Fărașul golit, la loc
4. `s27-2-3-z5-fizic` — Haina de ploaie pe umeri
5. `s24-2-3-z5-resurse` — Haina oaspetelui pe cuier
6. `s29-2-3-z1-fizic` — Degetul pe mugure
7. `s23-2-3-z6-fizic` — Mirosim o floare
8. `s45-2-3-z6-resurse` — Haina după plimbare
