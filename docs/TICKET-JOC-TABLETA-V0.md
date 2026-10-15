# TICKET — Joc tabletă v0 (banda 1–2) · PROBĂ 15–29 oct 2026
GO Răzvan 15 oct 2026. Sursă: docs/CONCEPT-JOC-TABLETA-CEZAR.md (secțiunile 3, 4, 6 și 8).

## Problema
Cezar (banda 1–2) nu are o variantă pe tabletă care să lege personajul săptămânii de o acțiune reală, cu ritm lent.

## Ce trebuie construit
- Un **tab nou „Joc” în navigația aplicației** (ruta `/joc`) în aplicația existentă (pagină web, fără App Store), ușor de pus pe ecranul principal al tabletei.
- 5 niveluri (Balonaș, Lopățică, Mănuță, Sunețel, Măturică), fiecare cu 3–5 interacțiuni prin atingere, cu ținte mari.
- Ritm lent: fiecare scenă stă cel puțin 4–5 secunde, tranzițiile sunt fade-uri lente, fără tăieturi, fără efecte care clipesc, fără sunete puternice. Un singur personaj și un singur obiect pe ecran.
- Dacă nu există nicio interacțiune 10 secunde, jocul trece automat la ecranul de misiune reală. Butonul „la misiune” e mereu vizibil pentru părinte.
- Ecranul de misiune reală are textul pentru părinte, apoi butonul „gata” și ritualul de închidere („X, gata.”).
- Limită de siguranță: maximum 15 minute pe sesiune, apoi trecere automată la misiune. Maximum 2 sesiuni pe zi.
- Jurnal local pentru probă: data, nivelul, durata pe ecran, dacă misiunea a fost bifată „gata” și o notă opțională a părintelui. Fără cameră și fără înregistrări audio.
- 100% în română. Fără reclame, scoruri, notificări sau redare automată. Fără voce în v0.

## Gata înseamnă
- Merge un preview pe Vercel și am făcut QA în Demo.
- Merge-ul se face după GO de la MannyQ sau Răzvan.
- Live pe tableta familiei azi sau mâine, ca să înceapă proba.
- La sfârșitul probei (29 oct), Cristina face review pe baza jurnalului.

## ADDENDUM v0.1 (15 oct, decizie Răzvan) — înlocuiește lista de 5 niveluri
- /joc arată **doar personajul săptămânii curente** din plan, pentru banda copilului.
- **Un nivel pe zi**, 7 pe săptămână, fiecare generat din **activitățile zilei respective** din app (obiect/acțiune/titlu) — fără conținut hardcodat separat.
- Nivel = 3–5 scene lente (≥4–5s, fade), apoi misiunea reală = activitatea zilei din plan; Gata bifează și activitatea zilei (dacă e ușor; altfel doar jurnal — spune-mi).
- Zilele trecute din săptămână: rejucabile? NU în v0 — doar ziua curentă. Limita 2 sesiuni/zi rămâne (aceeași zi, același nivel).
- Rămân de reparat din QA: auto-misiune după 10s inactiv, cronometru jurnal, plafon 15 min.
- **Status nou (aprobat Răzvan):** pe ecranul misiunii, lângă „Gata” (făcut în realitate), apare buton secundar „Am făcut-o doar în joc”. Se salvează ca status separat în jurnalul local (`real` vs `doar_joc`), iar exportul îl arată. Doar „Gata” ar putea bifa activitatea din plan; „doar în joc” NU bifează planul. Ritual închidere identic. Fără schimbare DB (jurnalul e local).
