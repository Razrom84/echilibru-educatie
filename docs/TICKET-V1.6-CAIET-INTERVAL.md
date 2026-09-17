# Ticket V1.6 — Caiet PDF pe interval manual
**17 Sep 2026 · Cristina · cerere Răzvan**  
**UI ref:** Arhivă → Caiet PDF (săptămână / lună / an existente)

## Intent
Pe lângă:
- Descarcă caietul săptămânii  
- Descarcă caietul lunii  
- Descarcă caietul anului  

→ **Descarcă caiet pe perioadă preferențială**: utilizatorul alege **dată început – dată sfârșit**, apoi generează același tip de caiet scurt (dată, ce ați făcut, notă, fotografie; fără punctaje).

## Lock
1. În secțiunea Caiet PDF: al 4-lea control — interval (2 date) + buton download.  
2. Același format/conținut ca celelalte caiete, filtrat pe interval.  
3. Interval invalid (sfârșit &lt; început) → eroare blândă RO.  
4. Gol pe interval → caiet gol sau mesaj „nimic de raportat”, consistent cu empty digests.

## Copy RO (propunere)
- Buton: `Descarcă caiet pe interval`  
- Labels: `De la` / `Până la`  
- Help (opțional): `Alege perioada; același caiet scurt, fără punctaje.`

## Done
- [ ] UI date + download pe custom
- [ ] PDF conține doar zilele din interval (notă/poză/activități bifate unde există)
- [ ] QA Cristina + spot Răzvan

## Out
Punctaje · Schimbare layout caiet existent · Export Excel
