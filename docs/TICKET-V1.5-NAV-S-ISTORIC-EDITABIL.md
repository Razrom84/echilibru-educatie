# Ticket V1.5 — Navigare S# pe live + trecut editabil / viitor read-only
**17 Sep 2026 · Cristina · cerere Răzvan**  
**Depinde de:** V1.4 / V1.4.1

## Intent
Pe banda copilului (și în Previzualizare/Anul pe alte benzi):
- **trecut** → editabil: **bifă, notă, poză**
- **viitor** → doar citire
- navigare S# pe **Azi** și **Săptămâna**

## Lock
1. **Live (ex. 1–2)**  
   - Azi + Săptămâna: control S#.  
   - S# &lt; curentă → editabil (bifă / notă / poză).  
   - S# &gt; curentă → read-only.  
   - S# curentă → editabil ca acum.  
   - Navigarea S# **nu** mută săptămâna oficială (digests/mail).

2. **Previzualizare / Anul pe altă bandă (ex. 2–3)**  
   - Același control S# + trecut/viitor.  
   - Editabil pe banda live + benzile anterioare pentru S# trecute.  
   - Viitor pe orice bandă = read-only.

3. **Anul** — listă teme; click S# → detalii; edit doar dacă S# e trecută.

## Done
- [ ] S# pe Azi/Săptămâna (live)
- [ ] Trecut: bifă + notă + poză; viitor RO
- [ ] Preview alte benzi: același model
- [ ] Digests neschimbate de nav S#
- [ ] QA Cristina pe custom

## Out
Seed 3–7 · Mutare săptămână oficială · Caiet PDF interval (→ V1.6)
