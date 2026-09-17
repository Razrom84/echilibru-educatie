# V1.4.1 — Previzualizare bandă: navigare S1–S52

Pe un cont real, previzualizarea de vârstă (V1.4) arăta detaliile doar pentru S# calendaristic curent. „Schimbă săptămâna” exista doar în Demo.

## Amendament V1.4.1 (Răzvan/Cristina)

Navigare S# în Previzualizare pe **TOATE** benzile `1–2` … `6–7`, nu doar `2–3`.

## Lock / UX

Preview session is allowed for the **live** band when chosen from Settings → Previzualizare. S# nav on **all** `1–2` … `6–7`, including live.

Key lock — in **Previzualizare bandă** (session `previewBand` set, **including** when `previewBand === live child band`), for **ANY** selected band in `PILOT_BANDS` (`1-2`, `2-3`, `3-4`, `4-5`, `5-6`, `6-7`):

- Parent can pick any S1–S52 and see activity details (4 pillars) when content exists — read-only.
- Changing S# updates session `previewWeek` only — never live week / DB / notes / live band.
- Band without seed → empty copy **"Conținutul pentru această vârstă vine curând."** but S# control **MUST** still be present and navigable (prefer navigable + empty per S#, not greyed-away).
- Anul: theme list OK; click S# → details.
- Selecting the live band (`1-2` today) **enters or stays in** preview. It does **not** exit.
- Banner: „Previzualizare · bandă 1–2 (doar citire)” + Înapoi.
- Înapoi / clearPreview restores live band + live S# unchanged.
- Optional chip mark „Azi copilul” may remain; it does not mean “clicking exits preview”.

## Ce trebuie să vadă părintele

În Settings → Previzualizare, alegerea **oricărei** benzi din selector (inclusiv banda live) arată pe **Azi**, **Săptămâna** și **Anul**:

- bannerul „Previzualizare · bandă X–Y (doar citire)” + Înapoi
- controlul **Săptămâna S#** (prev / next / picker S1–S52), inclusiv pe banda live și pe benzi cu zero activități

Schimbarea preview S# **nu** mută săptămâna live a copilului.

## Out of scope

- Seed 3–7
- Unealta Demo „Schimbă săptămâna”
- Scrieri în progres / bife / note / mail
