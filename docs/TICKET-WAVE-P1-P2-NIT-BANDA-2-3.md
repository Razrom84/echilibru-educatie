# TICKET — Wave P1+P2+NIT banda 2–3 (un PR)

**To:** Rusty · **From:** Cristina · **GO:** 20 Sep 2026 (Răzvan via MannyQ)  
**Repo:** echilibru-educatie · **Bandă:** 2–3 only  
**No self-merge.** PR → preview → QA Cristina → merge MannyQ/Răzvan + mig Familie.

Brief: `docs/BRIEF-WAVE-P1-P2-NIT-BANDA-2-3.md`  
Final check: `docs/FINAL-CHECK-BANDA-2-3.md`  
Orto ids: `docs/APPENDIX-ORTO-SA-CRESTE-BANDA-2-3-IDS.txt`

## Simptom
FINAL CHECK 2–3: EN Lock A = 0, dar **8 P1** + **3 P2** title↔corp; **28** `să crește` (subj. greșit).

## Așteptat
1. **P1 (8) + P2 (3):** LOCK B — KEEP titlu+temă; rewrite materiale/pasi/gata_cand ca în tabele.
2. **NIT (28):** replace `să crește` → `să crească` (și formele din listă) în pasi/gata pe ids din appendix.
3. Seed `content/seed-*-banda-2-3-v2.json` + SQL `UPDATE` pe live ids `sN-b23-…` WHERE `banda='2-3'`.
4. Nu atinge 1–2, cohort, chrome.
5. Fără apply pe Familie până PASS Cristina.

## Done
1. PR deschis (fără merge) + preview URL + SHA  
2. Ping Cristina QA  
3. După PASS → merge + mig Familie (MannyQ)

---

## Tabel P1 (8) — LOCK B

| seed id | live id | titlu (KEEP) | materiale | pasi | gata_cand |
|---------|---------|--------------|-----------|------|-----------|
| `s2-2-3-z4-resurse` | `s2-b23-z4-resurse` | Paharul la loc pe masă | pahar, masă | Luați paharul. / Puneți-l pe masă: „La loc. Masă.” | Paharul e pe masă. |
| `s28-2-3-z5-resurse` | `s28-b23-z5-resurse` | Cizmele curate lângă ușă | cizme | După șters: puneți cizmele lângă ușă. / „Cizme. Ușă.” | Cizmele curate sunt lângă ușă. |
| `s31-2-3-z2-resurse` | `s31-b23-z2-resurse` | Paharul după semințe — la loc | pahar | După udatul semințelor: „La loc.” / „Semințe. Gata.” | Paharul e la loc după semințe. |
| `s34-2-3-z2-resurse` | `s34-b23-z2-resurse` | Cutia cu frunză — la loc | cutie, frunză | După colectat: puneți frunza în cutie, apoi cutia la loc. / „Frunză. La loc.” | A ajutat cu frunza sau cutia. |
| `s39-2-3-z1-resurse` | `s39-b23-z1-resurse` | Ajunge — farfuria cu fruct la loc | farfurie, fruct | După gustare: „Ajunge.” / Farfuria cu fruct (sau goală) la loc. | A ajutat cu farfuria după fruct. |
| `s39-2-3-z3-resurse` | `s39-b23-z3-resurse` | Farfuria goală după fruct — la loc | farfurie | „După fruct: goală. Ajunge.” / Farfuria la loc. | Farfuria goală după fruct e la loc. |
| `s39-2-3-z5-resurse` | `s39-b23-z5-resurse` | Totul de masă cu fruct — la loc | farfurie, pahar, șervet | Strângeți după fruct: „La loc.” / „Masa cu fruct e gata.” | Obiectele de masă (după fruct) la loc. |
| `s39-2-3-z7-resurse` | `s39-b23-z7-resurse` | Masa cu fruct strânsă înainte de calm | farfurie / pahar | Strângeți masa cu fruct: „La loc.” / „Gata. Liniște.” | Masa cu fruct e strânsă înainte de calm. |

## Tabel P2 (3) — LOCK B

| seed id | live id | titlu (KEEP) | materiale | pasi | gata_cand |
|---------|---------|--------------|-----------|------|-----------|
| `s31-2-3-z6-resurse` | `s31-b23-z6-resurse` | Udatul de azi la semințe — gata | pahar, ghiveci | „Udatul la semințe — ajunge. Gata.” / Paharul la loc. | Udatul semințelor e închis. |
| `s31-2-3-z2-mental` | `s31-b23-z2-mental` | Uscat și ud — pământul seminței | pământ, semințe / sămânță | „Uscat.” / „Ud — sămânța vrea ud.” | A deosebit uscat/ud la pământul seminței. |
| `s42-2-3-z6-resurse` | `s42-b23-z6-resurse` | Cutia de frunze — plin destul | cutie, frunze | Puneți trei frunze: „Plin destul.” / „Frunze. Gata.” | Cutia de frunze are trei. |

## NIT orto (28) — `să crește` → `să crească`

Replace in pasi/gata_cand (and any copy field) on these **live** ids (`sN-b23-…`):

S29: z1-fizic, z1-resurse, z2-fizic, z3-fizic, z3-resurse, z4-fizic, z4-mental, z4-social, z6-social  
S31: z1-fizic, z1-mental, z1-resurse, z2-fizic, z2-mental, z3-fizic, z3-mental, z3-resurse, z3-social, z4-mental  
S38: z1-fizic, z1-resurse, z2-fizic, z3-fizic, z3-resurse, z4-fizic, z4-mental, z4-social, z6-social  

Full list: `docs/APPENDIX-ORTO-SA-CRESTE-BANDA-2-3-IDS.txt` (seed form `sN-2-3-…`; remap to `b23` in SQL).

## Spot QA (Cristina)
**P1 all 8** pe preview · **P2:** `s31-b23-z6-resurse`, `s42-b23-z6-resurse` · **Orto:** 1× S29, 1× S31, 1× S38 (`să crească` vizibil, zero `să crește`).

## Out of scope
Banda 1–2 · cohort · thin titles · outline S26/S49 · empty `( )` pe s8 (opțional, nu în GO) · self-merge
