# V1.4.1 — Previzualizare bandă: navigare S1–S52

Pe un cont real, previzualizarea de vârstă (V1.4) arăta detaliile doar pentru S# calendaristic curent. „Schimbă săptămâna” exista doar în Demo.

## Amendament V1.4.1 (Răzvan/Cristina)

Navigare S# în Previzualizare pe **TOATE** benzile `1–2` … `6–7`, nu doar `2–3`.

Key lock — in **Previzualizare bandă** (`preview band ≠ live child band`), for **ANY** selected band in `PILOT_BANDS` (`1-2`, `2-3`, `3-4`, `4-5`, `5-6`, `6-7`):

- Parent can pick any S1–S52 and see activity details (4 pillars) when content exists — read-only.
- Band without seed → empty copy **"Conținutul pentru această vârstă vine curând."** but S# control **MUST** still be present and navigable (prefer navigable + empty per S#, not greyed-away).
- No completion / notes / mail / live band move / live week move.
- Anul: theme list OK; click S# → details.

Selecting the live band still exits preview (lock `≠ live`). Do not invent a “preview live band” mode. “Same control for 1–2…6–7” means: whichever **non-live** band you preview, UX is identical — including `1–2` when the child’s live band is something else later, and including empty `3–7` today.

## Ce trebuie să vadă părintele

În Settings → Previzualizare, alegerea oricărei benzi non-live arată pe **Azi**, **Săptămâna** și **Anul**:

- bannerul „Previzualizare · bandă X–Y (doar citire)” + Înapoi
- controlul **Săptămâna S#** (prev / next / picker S1–S52), inclusiv pe benzi cu zero activități

Schimbarea preview S# **nu** mută săptămâna live a copilului.

## Out of scope

- Seed 3–7
- Unealta Demo „Schimbă săptămâna”
- Scrieri în progres / bife / note / mail
- Mod „preview pe banda live”
