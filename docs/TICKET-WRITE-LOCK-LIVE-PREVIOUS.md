# Ticket — Write lock: live + immediately previous band
**20 Sep 2026 · Cristina · lock Răzvan**  
**Depinde de:** V1.5 (`weekWritesAllowed`)

## Intent
Când cohorta a avansat, rândurile de pe **banda imediat anterioară** rămân editabile (bifă / notă / poză) pentru S# trecută sau curentă. Benzile mai vechi și previzualizările viitoare rămân doar citire.

## Lock
Writable când **ambele** sunt adevărate:

1. `viewBand === liveBand` **sau** `viewBand === previousBand(liveBand)`
2. `weekRelation(viewWeek, officialWeek) !== "future"`

`previousBand` pe lanțul `1-2 → 2-3 → 3-4 → 4-5 → 5-6 → 6-7`.  
Live `1-2` nu are previous — doar banda live e scriibilă.

| Live | Writable bands (past/current S#) | Read-only |
| --- | --- | --- |
| 1–2 | 1–2 | 2–3+ |
| 2–3 | 2–3 + 1–2 | 3–4+ |
| 3–4 | 3–4 + 2–3 | 1–2, 4–5+ |

Future S# → read-only pe **live și previous**.  
Digests / mail / navigarea S# nu se mută.

## Guard
`src/lib/view-week.ts` → `weekWritesAllowed`  
UI / persist: `writesAllowed` în `family-context` (notă, bifă, poză).

## QA
- Copil pe **2–3**, Previzualizare **1–2**, S# trecută sau curentă → notă / activitate **editabile**.
- Același copil, S# **viitoare** pe 2–3 sau pe 1–2 → **doar citire**.
- Același copil, preview **3–4** (sau 1–2 dacă live e 3–4) → **doar citire**.

## Out
Seed / copy de conținut / SQL migrations · mutare săptămână oficială
