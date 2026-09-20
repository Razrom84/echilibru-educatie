#!/usr/bin/env python3
"""Strip English pedagogical cues from banda 2–3 copy.

Reads a live-catalog dump (sN-b23- ids), writes:
  content/seed-*-banda-2-3-v2.json  (seed ids sN-2-3-, banda=2-3)
  supabase/migrations/<ts>_strip_en_banda_2_3.sql  (UPDATE live b23 ids)

Does not touch banda 1–2. Safe to re-run.
"""

from __future__ import annotations

import json
import re
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DUMP = Path("/tmp/banda23/all.json")
APPENDIX = ROOT / "docs/APPENDIX-EN-STRIP-BANDA-2-3-IDS.txt"

ZI_NUME = {
    1: "Luni",
    2: "Marți",
    3: "Miercuri",
    4: "Joi",
    5: "Vineri",
    6: "Sâmbătă",
    7: "Duminică",
}

# Longest phrases first. Values are the typical RO replacement (case-adjusted later).
PHRASES: list[tuple[str, str]] = [
    (r"thank you", "mulțumesc"),
    (r"high five", "bătut palma"),
    (r"good night", "noapte bună"),
    (r"good morning", "bună dimineața"),
    (r"good bye", "la revedere"),
    (r"goodbye", "la revedere"),
    (r"my turn", "rândul meu"),
    (r"your turn", "rândul tău"),
]

# Single-token glossary (EN → RO). Word-boundary, case-insensitive.
# Order does not matter after phrases are applied.
WORDS: dict[str, str] = {
    "ball": "minge",
    "turn": "rând",
    "water": "apă",
    "hand": "mână",
    "open": "deschis",
    "go": "hai",
    "quiz": "întrebări",
    "stop": "oprim",
    "again": "din nou",
    "walk": "mergem",
    "eat": "mâncăm",
    "fruit": "fruct",
    "done": "gata",
    "look": "uite",
    "touch": "atinge",
    "push": "împinge",
    "pull": "trage",
    "soft": "moale",
    "hard": "tare",
    "book": "carte",
    "yes": "da",
    "ready": "gata",
    "together": "împreună",
    "please": "te rog",
    "hello": "bună",
    "hi": "bună",
    "bye": "la revedere",
    "leaf": "frunză",
    "leaves": "frunze",
    "dirt": "pământ",
    "fall": "toamnă",
    "light": "lumină",
    "dark": "întuneric",
    "shadow": "umbră",
    "cold": "rece",
    "warm": "cald",
    "hot": "fierbinte",
    "window": "geam",
    "plant": "plantă",
    "green": "verde",
    "grow": "crește",
    "carry": "cărăm",
    "tidy": "la loc",
    "mine": "al meu",
    "yours": "al tău",
    "favorite": "favorita",
    "favorites": "favoritele",
    "rain": "ploaie",
    "sand": "nisip",
    "wet": "ud",
    "dry": "uscat",
    "full": "plin",
    "empty": "gol",
    "run": "alergăm",
    "jump": "sărim",
    "sit": "stăm",
    "sort": "sortăm",
    "box": "cutie",
    "bird": "pasăre",
    "dog": "câine",
    "this": "asta",
    "that": "aia",
    "help": "ajutor",
    "night": "noapte",
    "up": "sus",
    "down": "jos",
    "air": "aer",
    "wind": "vânt",
    "inside": "înăuntru",
    "outside": "afară",
    "stretch": "întindem",
    "blow": "suflăm",
    "finger": "deget",
    "listen": "ascultăm",
    "loud": "tare",
    "door": "ușă",
    "home": "casă",
    "start": "pornim",
    "path": "drum",
    "quiet": "liniște",
    "smell": "miros",
    "page": "pagină",
    "pick": "alege",
    "pour": "toarnă",
    "soap": "săpun",
    "friend": "prieten",
    "mud": "noroi",
    "coat": "haină",
    "hat": "pălărie",
    "bread": "pâine",
    "tree": "copac",
    "blue": "albastru",
    "red": "roșu",
    "yard": "curte",
    "where": "unde",
    "goal": "țintă",
}

# Smoke tokens (brief) + extensions found in live 2–3 copy.
SCAN_TOKENS = sorted(
    json.loads((ROOT / "content/en-banda-23-scan-tokens.json").read_text(encoding="utf-8"))[
        "tokens"
    ],
    key=lambda s: (-len(s), s),
)

WORD_GROUPS = (
    ("s1", [1]),
    ("s2-s4", [2, 3, 4]),
    ("s5-s8", [5, 6, 7, 8]),
    ("s9-s12", [9, 10, 11, 12]),
    ("s13-s16", [13, 14, 15, 16]),
    ("s17-s20", [17, 18, 19, 20]),
    ("s21-s24", [21, 22, 23, 24]),
    ("s25-s28", [25, 26, 27, 28]),
    ("s29-s32", [29, 30, 31, 32]),
    ("s33-s36", [33, 34, 35, 36]),
    ("s37-s40", [37, 38, 39, 40]),
    ("s41-s44", [41, 42, 43, 44]),
    ("s45-s48", [45, 46, 47, 48]),
    ("s49-s52", [49, 50, 51, 52]),
)


def live_to_seed(live_id: str) -> str:
    return live_id.replace("-b23-", "-2-3-")


def seed_to_live(seed_id: str) -> str:
    return seed_id.replace("-2-3-", "-b23-")


def _case_like(src: str, dest: str) -> str:
    if src.isupper() and len(src) > 1:
        return dest.upper()
    if src[:1].isupper():
        return dest[:1].upper() + dest[1:]
    return dest


def _sub_ci(pattern: str, repl: str, text: str) -> str:
    def repl_fn(m: re.Match[str]) -> str:
        return _case_like(m.group(0), repl)

    return re.sub(pattern, repl_fn, text, flags=re.IGNORECASE)


def strip_en(text: str) -> str:
    if not text:
        return text
    out = text

    # Keep Walk / Stop / Go as three distinct RO cues.
    out = _sub_ci(r"\bwalk\s*,\s*stop\s*,\s*go\b", "pași, oprim, hai", out)
    out = _sub_ci(r"\bwalk\s*/\s*stop\s*/\s*go\b", "pași / oprim / hai", out)

    # Hello vs Hi as two formulas.
    out = _sub_ci(r"\bhello\s+sau\s+hi\b", "bună sau salut", out)
    out = _sub_ci(r"\bhi\s+sau\s+hello\b", "salut sau bună", out)

    # Context: shadow fall / fall umbra → cade (verb), not toamnă.
    out = _sub_ci(r"\bunde fall\b", "unde cade", out)
    out = _sub_ci(r"\bfall umbra\b", "cade umbra", out)
    out = _sub_ci(r"\bumbra fall\b", "umbra cade", out)
    out = _sub_ci(r"\bumbră fall\b", "umbră cade", out)

    # Turn as “rândul tău / rând” in common frames — before generic turn.
    out = _sub_ci(r"\bturn\s*[—–-]\s*al tău\b", "rândul tău", out)
    out = _sub_ci(r"\bturn\s*[—–-]\s*ție\b", "rândul tău", out)
    out = _sub_ci(r"\bîncă un turn\b", "încă un rând", out)
    out = _sub_ci(r"\bun ultim turn\b", "un ultim rând", out)
    out = _sub_ci(r"\bnumără turn\b", "numără rândul", out)
    out = _sub_ci(r"\bare turn\b", "are rândul", out)
    out = _sub_ci(r"\btrei turn\b", "trei rânduri", out)
    out = _sub_ci(r"\b3 turn\b", "3 rânduri", out)
    out = _sub_ci(r"\bturn unu\b", "rând unu", out)
    out = _sub_ci(r"\bturn doi\b", "rând doi", out)
    out = _sub_ci(r"\bturn trei\b", "rând trei", out)

    # Ball as subject / definite.
    out = _sub_ci(r"\bball afară\b", "mingea afară", out)
    out = _sub_ci(r"\bball joacă\b", "mingea joacă", out)
    out = _sub_ci(r"\bball doarme\b", "mingea doarme", out)
    out = _sub_ci(r"\bball în\b", "mingea în", out)
    out = _sub_ci(r"\bball la loc\b", "mingea la loc", out)
    out = _sub_ci(r"\bball pe\b", "mingea pe", out)
    out = _sub_ci(r"\bball doar\b", "mingea doar", out)
    out = _sub_ci(r"\ba lua ball\b", "a lua mingea", out)
    out = _sub_ci(r"\biei ball\b", "iei mingea", out)
    out = _sub_ci(r"\bluați ball\b", "luați mingea", out)
    out = _sub_ci(r"\blua ball\b", "lua mingea", out)

    # Run as 1st person in “eu run”.
    out = _sub_ci(r"\beu run\b", "eu alerg", out)
    out = _sub_ci(r"\btu run\b", "tu alergi", out)
    out = _sub_ci(r"\btu stop\b", "tu stai", out)

    for en, ro in PHRASES:
        out = _sub_ci(rf"\b{en}\b", ro, out)

    for en, ro in WORDS.items():
        out = _sub_ci(rf"\b{en}\b", ro, out)

    # Collapse bilingual leftovers: „Minge. Minge.” / “Apă. Apă.”
    out = re.sub(
        r"([A-ZĂÂÎȘȚa-zăâîșț][A-Za-zĂÂÎȘȚăâîșț]*)\.\s+\1\.",
        r"\1.",
        out,
        flags=re.IGNORECASE,
    )
    out = re.sub(
        r"([A-ZĂÂÎȘȚa-zăâîșț][A-Za-zĂÂÎȘȚăâîșț]*)\.\s+\1\b",
        r"\1",
        out,
        flags=re.IGNORECASE,
    )

    # Tidy spaces / empty quotes.
    out = re.sub(r"[ \t]{2,}", " ", out)
    out = re.sub(r"\s+([,.;:!?])", r"\1", out)
    out = re.sub(r"„\s+”", "„”", out)
    out = re.sub(r"„\s+", "„", out)
    out = re.sub(r"\s+”", "”", out)
    out = re.sub(r"\(\s+", "(", out)
    out = re.sub(r"\s+\)", ")", out)
    out = re.sub(r"\s+/", " /", out)
    out = re.sub(r"/\s+", "/ ", out)
    out = re.sub(r"\s+—\s+", " — ", out)
    out = re.sub(r"\s+–\s+", " — ", out)

    # Leftover bilingual stage directions (copy is RO-only now).
    out = re.sub(r",?\s*apoi română(?=[\s—.,)]|$)", "", out, flags=re.IGNORECASE)
    out = re.sub(r"\(apoi română\)", "", out, flags=re.IGNORECASE)
    out = re.sub(r"\bîn română\b", "", out, flags=re.IGNORECASE)
    out = re.sub(r"\betichetă EN\b", "etichetă", out, flags=re.IGNORECASE)
    out = re.sub(r"\bfără quiz\b", "fără întrebări în lanț", out, flags=re.IGNORECASE)
    out = re.sub(r"\bbună sau bună\b", "bună sau salut", out, flags=re.IGNORECASE)
    out = re.sub(r"\bcând e oprim\b", "când oprim", out, flags=re.IGNORECASE)
    out = re.sub(r"\bmergem / oprim / mergem\b", "mergem / oprim / hai", out, flags=re.IGNORECASE)
    out = re.sub(r"\bține minge\b", "ține mingea", out, flags=re.IGNORECASE)
    out = re.sub(r"\bface pasăre\b", "face pasărea", out, flags=re.IGNORECASE)
    out = re.sub(r"[ \t]{2,}", " ", out)
    out = re.sub(r"\s+([,.;:!?])", r"\1", out)
    out = re.sub(r"\(\s+\)", "", out)
    return out.strip()


def strip_row(row: dict) -> dict:
    return {
        **row,
        "titlu": strip_en(row.get("titlu") or ""),
        "materiale": [strip_en(x) for x in (row.get("materiale") or [])],
        "pasi": [strip_en(x) for x in (row.get("pasi") or [])],
        "gata_cand": strip_en(row.get("gata_cand") or ""),
        "tema_saptamana": strip_en(row.get("tema_saptamana") or ""),
        "nota": row.get("nota"),
    }


def blob(row: dict) -> str:
    parts = [
        row.get("titlu") or "",
        *(row.get("materiale") or []),
        *(row.get("pasi") or []),
        row.get("gata_cand") or "",
        row.get("tema_saptamana") or "",
    ]
    return "\n".join(parts)


def scan_en(text: str) -> list[str]:
    hits = []
    low = text.lower()
    for tok in SCAN_TOKENS:
        if re.search(rf"\b{re.escape(tok)}\b", low):
            hits.append(tok)
    return hits


def sql_lit(value: str | None) -> str:
    if value is None:
        return "null"
    return "'" + str(value).replace("'", "''") + "'"


def sql_text_array(values: list[str]) -> str:
    if not values:
        return "'{}'::text[]"
    return "ARRAY[" + ", ".join(sql_lit(v) for v in values) + "]::text[]"


def to_seed_activity(row: dict) -> dict:
    seed_id = live_to_seed(row["id"])
    return {
        "id": seed_id,
        "banda": "2-3",
        "saptamana": row["saptamana"],
        "zi": row["zi"],
        "zi_nume": ZI_NUME[row["zi"]],
        "pilon": row["pilon"],
        "titlu": row["titlu"],
        "durata_min": row["durata_min"],
        "mod_default": row["mod_default"],
        "materiale": row["materiale"],
        "pasi": row["pasi"],
        "gata_cand": row["gata_cand"],
        "tema_saptamana": row["tema_saptamana"],
        "nota": row.get("nota") or "Vârsta 2–3: scurt, fără forțare; el poate refuza.",
    }


def write_seeds(stripped: list[dict]) -> None:
    by_week: dict[int, list[dict]] = defaultdict(list)
    teme: dict[int, str] = {}
    for row in stripped:
        seed = to_seed_activity(row)
        by_week[seed["saptamana"]].append(seed)
        teme[seed["saptamana"]] = seed["tema_saptamana"]

    out_dir = ROOT / "content"
    for name, weeks in WORD_GROUPS:
        activitati = []
        for w in weeks:
            activitati.extend(sorted(by_week[w], key=lambda r: (r["zi"], r["pilon"])))
        payload = {
            "version": 2,
            "locale": "ro",
            "banda": "2-3",
            "saptamani": weeks,
            "teme": {str(w): teme[w] for w in weeks},
            "activitati": activitati,
        }
        path = out_dir / f"seed-{name}-banda-2-3-v2.json"
        path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"wrote {path.relative_to(ROOT)} ({len(activitati)} rows)")


def write_migration(original: list[dict], stripped: list[dict]) -> Path:
    changed = []
    for before, after in zip(original, stripped, strict=True):
        if (
            before["titlu"] != after["titlu"]
            or before.get("materiale") != after.get("materiale")
            or before.get("pasi") != after.get("pasi")
            or before.get("gata_cand") != after.get("gata_cand")
            or before.get("tema_saptamana") != after.get("tema_saptamana")
        ):
            changed.append(after)

    migrations = ROOT / "supabase" / "migrations"
    existing = sorted(migrations.glob("*_strip_en_banda_2_3.sql"))
    if existing:
        path = existing[-1]
    else:
        path = migrations / "20260920270000_strip_en_banda_2_3.sql"

    lines = [
        "-- Lock A: strip English from banda 2–3 copy (titlu / materiale / pasi / gata_cand / tema).",
        "-- Live ids are sN-b23-… ; seed ids sN-2-3-… remap via docs/IMPORT-BANDA-2-3-ID-MAP.md.",
        "-- ONLY banda='2-3'. Does not touch banda 1–2 or ids without b23.",
        "-- Do not apply to Familie/production from this PR; Cristina QA pe preview.",
        "update public.activities as a",
        "set",
        "  titlu = v.titlu,",
        "  materiale = v.materiale,",
        "  pasi = v.pasi,",
        "  gata_cand = v.gata_cand,",
        "  tema_saptamana = v.tema_saptamana",
        "from (values",
    ]
    value_rows = []
    for row in changed:
        live_id = row["id"] if "-b23-" in row["id"] else seed_to_live(row["id"])
        value_rows.append(
            "  ("
            + ", ".join(
                [
                    sql_lit(live_id),
                    sql_lit(row["titlu"]),
                    sql_text_array(row["materiale"]),
                    sql_text_array(row["pasi"]),
                    sql_lit(row["gata_cand"]),
                    sql_lit(row["tema_saptamana"]),
                ]
            )
            + ")"
        )
    lines.append(",\n".join(value_rows))
    lines.append(") as v(id, titlu, materiale, pasi, gata_cand, tema_saptamana)")
    lines.append("where a.id = v.id")
    lines.append("  and a.banda = '2-3';")
    lines.append("")
    path.write_text("\n".join(lines), encoding="utf-8")
    print(f"wrote {path.relative_to(ROOT)} ({len(changed)} updates)")
    return path


def main() -> int:
    if not DUMP.exists():
        print(f"missing dump {DUMP}", file=sys.stderr)
        return 1
    original = json.loads(DUMP.read_text(encoding="utf-8"))
    original.sort(key=lambda r: (r["saptamana"], r["zi"], r["pilon"], r["id"]))
    stripped = [strip_row(r) for r in original]

    appendix = {line.strip() for line in APPENDIX.read_text(encoding="utf-8").splitlines() if line.strip()}
    hits = []
    appendix_hits = []
    for row in stripped:
        found = scan_en(blob(row))
        if found:
            hits.append((row["id"], found, row["titlu"]))
        seed_id = live_to_seed(row["id"])
        if seed_id in appendix and found:
            appendix_hits.append((seed_id, found, row["titlu"]))

    write_seeds(stripped)
    write_migration(original, stripped)

    print(f"stripped {len(stripped)} rows; remaining EN hits: {len(hits)}")
    print(f"appendix remaining: {len(appendix_hits)} / {len(appendix)}")
    for item in hits[:40]:
        print("  HIT", item[0], item[1], "|", item[2])
    if len(hits) > 40:
        print(f"  … {len(hits) - 40} more")
    return 0 if not hits else 2


if __name__ == "__main__":
    raise SystemExit(main())
