# TICKET Rusty — Fix S32 balon + S33 Lopățică

**De la:** Cristina (lock Răzvan via MannyQ, 20 Sep 2026)  
**Către:** Rusty  
**Prioritate:** copy/orto banda live 1–2  
**Regulă:** **PR only — fără self-merge.** Ping Cristina când e pe custom.

## Symptom

- S32 UI: `Balonaș · Mingea afară` + titluri balon + pași/materiale încă pe **minge**
- S33 chrome: **Lopețică**; forma corectă **Lopățică**; Z1 fizic / Z2 resurse / Z6 fizic titlu≠pași

## Expected

Vezi copy final în `docs/BRIEF-FIX-S32-BALON-S33-LOPATICA.md` (LOCKED).

Pe scurt:
1. S32 tot pe balon: temă `Balonul afară`, ritual `Balonul afară.` / `Balonul, gata.`, surprize + pași + materiale + gata_cand, `week.ts` + DB `tema_saptamana`
2. Titluri S32: **nu** le rescrie (deja balon), exceptând opțional Z2 mental `Moale` → `Balonul e moale`
3. S33: rename display **Lopățică**; aliniază cele 3 activități din brief

## Done

- [ ] Cod + teste + brief S21–S52 actualizate
- [ ] Migrație/UPDATE DB pe custom
- [ ] Zero „minge” în corpul S32
- [ ] PR deschis (fără merge)
- [ ] Ping Cristina pentru QA

## Out of scope

- Restul titlurilor mono-cuvânt S30–S40 (audit, wave separată)
- Ticket S8–S10 Grok
