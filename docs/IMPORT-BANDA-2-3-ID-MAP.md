# IMPORT — banda 2–3 id remap

Seed catalog ids in `content/seed-*-banda-2-3-v2.json` use the Cristina slug:

`s{N}-2-3-z{zi}-{pilon}`

Live `activities.id` (Familie) already remapped the band segment so 1–2 and 2–3 do not collide:

`s{N}-b23-z{zi}-{pilon}`

| Seed (JSON / appendix) | Live (Postgres) |
| --- | --- |
| `s32-2-3-z1-fizic` | `s32-b23-z1-fizic` |
| `s14-2-3-z5-mental` | `s14-b23-z5-mental` |

Rule: replace the `-2-3-` segment with `-b23-`. `banda` on the live row is `'2-3'`.

The Lock A migration updates **only** `banda = '2-3'` and ids containing `-b23-`. It does not touch banda `1-2` (those rows still use seed-style `sN-2-3-…` ids).
