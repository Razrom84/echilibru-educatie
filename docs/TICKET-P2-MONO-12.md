# TICKET P2 — Titluri mono → 2–4 cuvinte (12 id-uri)

**To:** Rusty · **From:** Cristina · **GO:** 20 Sep 2026 (Răzvan lock Varianta A)
**Repo:** echilibru-educatie · **Bandă:** 1–2 live
**No self-merge.** PR only; ping Cristina for QA after preview.

## Simptom
13 activități pe banda 1–2 au titlu **mono-cuvânt** (ex. „Moale”, „Zboară”, „Rece”). Una e deja multi după LOCK S32 → **SKIP**. Rămân **12**.

## Așteptat
Pentru fiecare id din tabel: schimbă **doar `titlu`** la valoarea din coloana „titlu nou”.
**Păstrează** `tema_saptamana` + `materiale` + `pasi` + `gata_cand` (LOCK A).
- Zero EN
- Nu rescrie corp
- Seed JSON + SQL migration (ca la P1); migration pe Familie **doar după** PASS Cristina pe preview
- Nu atinge P1, S32/S33 LOCK, chrome, banda `*-b23-*`
- **SKIP** `s32-2-3-z2-mental` (deja „Balonul e moale”)

## Done
1. PR deschis (fără merge) cu seed + migration pentru cele **12** id-uri
2. Preview URL + SHA
3. Ping Cristina: QA pe preview (spot 5: `s1-2-3-z2-social`, `s31-2-3-z4-mental`, `s36-2-3-z4-mental`, `s38-2-3-z6-mental`, `s40-2-3-z1-mental`)
4. După PASS Cristina → Răzvan/MannyQ merge + apply migration pe Familie

## Tabel (12) — LOCK Varianta A

| id | titlu acum | titlu nou |
|----|------------|-----------|
| `s1-2-3-z2-social` | Mulțumesc | Spunem mulțumesc |
| `s30-2-3-z5-mental` | Zboară | Pasărea zboară |
| `s31-2-3-z4-mental` | Moale | Umed și uscat |
| `s35-2-3-z5-mental` | Rece | Apa e rece |
| `s36-2-3-z4-mental` | Zboară | Zumzet și liniște |
| `s38-2-3-z2-mental` | Moale | Iarba e moale |
| `s38-2-3-z3-mental` | Gâdilă | Iarba gâdilă |
| `s38-2-3-z6-mental` | Curate | Moale și tare |
| `s39-2-3-z4-mental` | Netedă | Coaja e netedă |
| `s39-2-3-z5-mental` | Dulce | Gust dulce |
| `s40-2-3-z1-mental` | Ajutăm | Ajutor pe scurt |
| `s52-2-3-z6-social` | Mulțumim | Spunem mulțumim |

## SKIP
| id | motiv |
|----|-------|
| `s32-2-3-z2-mental` | deja „Balonul e moale” |

## Sursă lock
`docs/BRIEF-P2-MONO-13.md` · Varianta A · Răzvan 20 Sep 2026
