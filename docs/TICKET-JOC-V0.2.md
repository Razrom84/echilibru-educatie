# TICKET — Joc v0.2 „Cezar și prietenul săptămânii”
Sursă: PROPUNERE-JOC-V0.2.md (aprobat Răzvan 15 oct). Pornește DOAR după merge #52.

## Problema
v0.1 arată scene simple; Cezar nu are un model de vârsta lui pe care să-l imite.

## Așteptat
1. **Personaj principal „Cezar”**: băiețel stilizat (păr + haine preferate, fără poze), vârsta benzii live; trece la banda următoare odată cu copilul la S1. Mai întâi 2–3 schițe → aprobare Răzvan (prin MannyQ) înainte de animații.
2. **Set de animații reutilizabile, lente**: mers, sărit, bătut din palme, arătat, aplecat, apucat + zoom pe mâini/picioare/cap. Fără animații per activitate.
3. **Tip pe fiecare activitate**: mișcare / corp / obiect / senzorial / ritual. Cristina completează tipurile pe banda 1–2; dacă cere coloană nouă în DB → migrare pe PR, aplicată de MannyQ după merge.
4. **Șabloane pe tip** (vezi tabelul din propunere §2): mișcare = Cezar face mișcarea în 2–3 pași lenți, apoi „Acum tu!” cu pauză lungă pentru imitație; corp = zoom lent + cuvânt; obiect = găsește, arată, numește de 2 ori; senzorial = atinge + reacție blândă; ritual = pași + închidere de la personajul săptămânii.
5. **Scalare pe benzi** (§3): 1–2: 3–5 scene, ≥5s; 2–3: 5–7 scene. Restul benzilor doar config, nu conținut acum. Plafon 15 min peste tot.
6. **Real vs doar_joc**: rămân ambele; rezumat săptămânal în jurnal („X reale, Y doar în joc”); după 3 zile la rând de mișcare/senzorial doar_joc → sugestie blândă pentru părinte (variantă reală mai simplă), fără nimic pentru copil.
7. Păstrează tot din v0.1 (o zi, 2 sesiuni/zi, 10s inactiv, 15 min, export). 100% română.

## Gata înseamnă
Schițe aprobate → PR + preview Demo → QA Cristina pe banda 1–2 (cel puțin o activitate de fiecare tip) → PASS la MannyQ → merge de MannyQ.

## Addendum aspect personaj (15 oct, Răzvan)
- Stil: Little Mark (docs/assets/referinta-little-mark.png) — desen moale de mână, contur subțire, textură fină, culori calde, pistrui.
- Adaptat: toddler (față rotundă, proporții de copil mic), **FĂRĂ ochelari**, părul și hainele preferate ale lui Cezar.
- Schițe propuse: docs/assets/cezar-schita-A.jpg (tricou portocaliu, ca Mark), -B.jpg (salopetă muștar), -C.jpg (în mers, tricou albastru). Răzvan alege/ajustează înainte de animații.
- **ALES de Răzvan (15 oct): varianta B** (salopetă muștar, bluză albă, ghetuțe, păr castaniu-deschis). Baza pentru animații.

## Nit-uri din QA v0.1 (incluse în v0.2)
- Export: etichete RO ca în UI — „gata” / „doar în joc” (nu `real` / `doar_joc`).
- Inactivitate: pe 1–2 trecerea la misiune la finalul scenelor e OK; dacă copilul atinge și apoi nu mai atinge 10s → misiune.

## Addendum — Mod privit (aprobat Răzvan, 15 oct 2026)
- Părintele pornește jocul din butonul „Mod privit”. Cele 4 scene ale zilei rulează lent, singure, fără atingeri (min. 4–5 s pe scenă, cu fade).
- După fiecare scenă: pauză de imitație de 5–10 s, cu Cezar (personajul) în poză statică și textul pentru părinte „Acum tu!” (Cezar imită lângă tabletă).
- La final: ecranul cu misiunea reală (activitatea zilei) și butoanele „Gata” / „Am făcut-o doar în joc”, ca acum.
- Se folosește de 2 ori pe zi: dimineața ca introducere, seara ca recapitulare scurtă. Total sub 10 minute pe zi, incluse în limita de siguranță de 15 minute.
- În modul privit nu se aplică regula de 10 s fără atingere.
- Done: în Demo pornesc modul privit, merge cap-coadă fără nicio atingere, pauzele de imitație durează 5–10 s, se termină cu ecranul de misiune, iar a treia pornire din aceeași zi e blocată sau avertizată.
