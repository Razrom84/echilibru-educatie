#!/usr/bin/env python3
"""Build the gifted S1–S4 catalog, seed update, and SQL from the source files.

Reads content/gifted-s1-s4-data.json and docs/backup/live-2-3-S1-S4-backup-20261116.json.
Copies strings through; it does not edit activity or material wording.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "content" / "gifted-s1-s4-data.json"
BACKUP_PATH = ROOT / "docs" / "backup" / "live-2-3-S1-S4-backup-20261116.json"
SEED_S1 = ROOT / "content" / "seed-s1-banda-2-3-v2.json"
SEED_S2 = ROOT / "content" / "seed-s2-s4-banda-2-3-v2.json"
MATERIALS_PATH = ROOT / "content" / "materiale-s1-s4-banda-2-3.json"
SCHEMA_SQL = ROOT / "supabase" / "migrations" / "20261116105922_gifted_s1s4_schema.sql"
CONTENT_SQL = ROOT / "supabase" / "migrations" / "20261116110022_gifted_s1s4_continut.sql"
ROLLBACK_SQL = ROOT / "supabase" / "rollback" / "20261116110022_gifted_s1s4_rollback.sql"
SEEN_ON = "2026-11-16"

CEDILLA = re.compile("[şţŞŢ]")


def dollar(value: str) -> str:
    tag = "q"
    n = 0
    while f"${tag}$" in value:
        n += 1
        tag = f"q{n}"
    return f"${tag}${value}${tag}$"


def sql_text(value: str | None) -> str:
    if value is None:
        return "null"
    return dollar(value)


def sql_array(items: list[str]) -> str:
    if not items:
        return "'{}'::text[]"
    inner = ", ".join(dollar(item) for item in items)
    return f"array[{inner}]::text[]"


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def dump_json(path: Path, payload) -> None:
    path.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def strip_markdown(value):
    """Drop bold markers. The words stay; the app does not render Markdown."""
    if isinstance(value, str):
        return value.replace("**", "")
    if isinstance(value, list):
        return [strip_markdown(item) for item in value]
    if isinstance(value, dict):
        return {key: strip_markdown(item) for key, item in value.items()}
    return value


def blank_to_none(value: str | None) -> str | None:
    if value is None:
        return None
    stripped = value.strip()
    return stripped if stripped else None


def price_fields(price: str | None) -> tuple[str | None, str | None]:
    if not price:
        return None, None
    return price, "lei" if "lei" in price else None


def parse_price_bullet(text: str) -> tuple[str | None, str | None]:
    stock = None
    age = None
    stock_match = re.search(r"Stoc:\s*(.+?)\.", text)
    if stock_match:
        stock = stock_match.group(1).strip()
    age_match = re.search(r"Vârsta:\s*(.+?)(?:\.\s|$)", text)
    if age_match:
        age = age_match.group(1).strip().rstrip(".")
    return stock, age


def looks_like_brand(value: str) -> bool:
    words = value.replace("„", "").replace("”", "").split()
    if not words or len(words) > 3:
        return False
    if any(word[:1].islower() for word in words):
        return False
    return True


def producer_and_shop(title: str, extra: str, home_only: bool) -> tuple[str | None, str | None]:
    if home_only or extra.startswith("(doar"):
        return None, None
    publisher = re.search(r"Editura [^,)]+", extra)
    if publisher:
        name = publisher.group(0).strip()
        return name, name
    shop = extra.strip()
    if "," in extra:
        tail = extra.rsplit(",", 1)[1].strip()
        if tail and "„" not in tail and not tail.startswith("("):
            shop = tail
    producer = None
    if "," in title:
        tail = title.rsplit(",", 1)[1].strip().strip("„”")
        if looks_like_brand(tail):
            producer = tail
    return producer, shop


def home_kind(label: str) -> str:
    lowered = label.lower()
    if "3d" in lowered or "imprim" in lowered:
        return "3d"
    if "print" in lowered:
        return "print"
    return "diy"


def split_labeled(line: str) -> dict[str, str]:
    """Pull exact substrings after known labels. The line itself stays intact elsewhere."""
    found: dict[str, str] = {}
    patterns = [
        ("pasi", r"Cum:\s*"),
        ("materiale_unelte", r"(?:Materiale și unelte|Materiale|Unelte|Rețeta e în activitatea[^:]{0,80}):\s*"),
        ("cost_estimat", r"(?:Cost material|Cost):\s*|Costul e\s*"),
        ("durata", r"Durată:\s*"),
        ("siguranta", r"Siguranță:\s*"),
        ("link_model", r"Link(?:\s*\(verificat\))?:\s*"),
    ]
    hits: list[tuple[int, int, str]] = []
    for key, pattern in patterns:
        match = re.search(pattern, line)
        if match and key not in {item[2] for item in hits}:
            hits.append((match.start(), match.end(), key))
    hits.sort()
    for index, (_start, end, key) in enumerate(hits):
        stop = hits[index + 1][0] if index + 1 < len(hits) else len(line)
        found[key] = line[end:stop].strip()
        if key == "link_model":
            url = re.search(r"https?://\S+", found[key])
            found[key] = url.group(0).rstrip(").,;") if url else found[key]
    return found


def variant_from_lines(kind: str, title: str | None, lines: list[str], ordinal: int, material_id: str) -> dict:
    fields = {
        "pasi": None,
        "materiale_unelte": None,
        "cost_estimat": None,
        "durata": None,
        "siguranta": None,
        "link_model": None,
    }
    for line in lines:
        for key, value in split_labeled(line).items():
            if fields[key] is None and value:
                fields[key] = value
    if fields["pasi"] is None:
        prose = [line for line in lines if not line.startswith("Folosit")]
        if prose:
            fields["pasi"] = prose[0]
    return {
        "id": f"{material_id}-acasa-{ordinal}",
        "tip": kind,
        "titlu": title,
        "pasi": fields["pasi"],
        "materiale_unelte": fields["materiale_unelte"],
        "cost_estimat": fields["cost_estimat"],
        "durata": fields["durata"],
        "siguranta": fields["siguranta"],
        "link_model": fields["link_model"],
        "linii": lines,
    }


def parse_home_heading(text: str) -> tuple[str, str | None, str]:
    match = re.match(r"^\*\*Acasă([^:]*):\*\*\s*(.*)$", text)
    if not match:
        return "diy", None, text
    raw_label = match.group(1).strip()
    rest = match.group(2).strip()
    label = raw_label
    title = None
    extra = re.match(r"^\((.*?)\),?\s*(.*)$", raw_label)
    if extra:
        label = extra.group(1)
        title = extra.group(2).strip() or None
    lowered = rest.lower()
    if lowered.startswith("nu recomand") or lowered.startswith("nu se face"):
        kind = "nu"
    else:
        kind = home_kind(label)
    return kind, title, rest


def parse_material(week: int, raw: dict) -> dict:
    material_id = f"s{week}-m{raw['n']}"
    extra = raw.get("extra") or ""
    home_only = bool(raw.get("home_only"))
    producer, shop = producer_and_shop(raw["title"], extra, home_only)
    pret, moneda = price_fields(raw.get("price"))
    stock = None
    age = None
    safety_bits: list[str] = []
    notes: list[str] = []
    used = None
    price_detail = None
    homes: list[dict] = []

    def push_home(kind: str, title: str | None, lines: list[str]) -> None:
        cleaned = [line for line in lines if line.strip()]
        if not cleaned and not title:
            return
        homes.append(variant_from_lines(kind, title, cleaned, len(homes) + 1, material_id))

    if home_only:
        lines = []
        for bullet in raw["bullets"]:
            text = bullet["text"]
            if text.startswith("Folosit"):
                used = text
                continue
            lines.append(text)
            lines.extend(bullet.get("sub") or [])
        kind = "print" if "print" in extra.lower() else "diy"
        push_home(kind, None, lines)
    else:
        for bullet in raw["bullets"]:
            text = bullet["text"]
            subs = bullet.get("sub") or []
            if text.startswith("Folosit"):
                used = text
                continue
            if text.startswith("Link:") or text.startswith("Link ("):
                continue
            if text.startswith("Preț văzut:"):
                price_detail = text
                stock, age = parse_price_bullet(text)
                continue
            if text.startswith("Siguranță:"):
                safety_bits.append(text[len("Siguranță:") :].strip())
                continue
            if text.startswith("**Acasă"):
                kind, title, rest = parse_home_heading(text)
                lines = []
                if rest:
                    lines.append(rest)
                lines.extend(subs)
                # A top-level safety sentence can sit on the heading line.
                if "Siguranță:" in rest and not any(line.startswith("Siguranță:") for line in subs):
                    pass
                push_home(kind, title, lines)
                continue
            notes.append(text)
            notes.extend(subs)

    activities = [f"s{week}-b23-z{day}-{pillar}" for day, pillar in raw["uses"]]
    return {
        "id": material_id,
        "banda": "2-3",
        "saptamana": week,
        "ordine": raw["n"],
        "nume": raw["title"],
        "producator": producer,
        "magazin": shop,
        "sursa": extra,
        "link": raw.get("link"),
        "pret": pret,
        "moneda": moneda,
        "data_verificare": SEEN_ON if pret else None,
        "stoc": stock,
        "varsta": age,
        "nota_siguranta": "\n".join(safety_bits) if safety_bits else None,
        "doar_acasa": home_only,
        "folosita": used,
        "detaliu_pret": price_detail,
        "note": notes,
        "activitati": activities,
        "acasa": homes,
    }


def audit(label: str, text: str, issues: list[str]) -> None:
    if CEDILLA.search(text):
        issues.append(f"{label}: literă cu sedilă (ş/ţ), nu cu virgulă")
    if "  " in text:
        issues.append(f"{label}: spațiu dublu")
    if re.search(r"\b(Daca|saptamana|pentru ca)\b", text):
        issues.append(f"{label}: cuvânt fără diacritice")


def collect_activities(data: dict) -> list[tuple[int, str, dict]]:
    rows = []
    for week in data["weeks"]:
        for activity in week["activities"]:
            rows.append((week["n"], week["theme"], activity))
    return rows


def main() -> None:
    data = load_json(DATA_PATH)
    backup_rows = load_json(BACKUP_PATH)
    backup = {row["id"]: row for row in backup_rows}
    activities = collect_activities(data)
    if len(activities) != 112:
        raise SystemExit(f"expected 112 activities, got {len(activities)}")
    live_ids = [activity["live_id"] for _week, _theme, activity in activities]
    if len(set(live_ids)) != 112:
        raise SystemExit("live_id values are not unique")
    if set(live_ids) != set(backup):
        missing = sorted(set(live_ids) - set(backup))
        extra = sorted(set(backup) - set(live_ids))
        raise SystemExit(f"id mismatch missing={missing} extra={extra}")

    issues: list[str] = []
    live_diffs: list[str] = []
    theme_diffs: list[str] = []

    seed_s1 = load_json(SEED_S1)
    seed_s2 = load_json(SEED_S2)
    seed_by_id = {row["id"]: row for row in seed_s1["activitati"]}
    seed_by_id.update({row["id"]: row for row in seed_s2["activitati"]})

    for week_n, theme, activity in activities:
        live_id = activity["live_id"]
        seed_id = live_id.replace("-b23-", "-2-3-")
        seed = seed_by_id.get(seed_id)
        if seed is None:
            raise SystemExit(f"seed row missing for {seed_id}")
        if seed["zi"] != activity["day"] or seed["pilon"] != activity["pillar"] or seed["saptamana"] != week_n:
            raise SystemExit(f"slot mismatch {live_id} vs {seed_id}")
        if seed["tema_saptamana"] != theme:
            theme_diffs.append(f"{live_id}: seed „{seed['tema_saptamana']}” / sursă „{theme}”")
        old = backup[live_id]
        live = activity["live"]
        if old["titlu"] != live["title"] or old["pasi"] != live["pasi"]:
            live_diffs.append(live_id)
        if old["banda"] != "2-3" or old["saptamana"] != week_n:
            raise SystemExit(f"backup slot mismatch {live_id}")

        for field, text in (
            ("titlu", activity["title"]),
            ("materiale", activity["materiale"]),
            ("gata", activity["gata"]),
            ("plus", activity["plus"]),
            ("provocare", activity["provocare"]),
            ("siguranta", activity.get("siguranta") or ""),
        ):
            audit(f"{live_id} {field}", text, issues)
        for index, step in enumerate(activity["baza"], start=1):
            audit(f"{live_id} baza {index}", step, issues)
        if len(activity["baza"]) != 4:
            issues.append(f"{live_id}: baza are {len(activity['baza'])} pași, nu 4")
        if not activity["plus"].strip() or not activity["provocare"].strip():
            issues.append(f"{live_id}: lipsește Pas în plus sau Provocarea")

        seed["titlu"] = activity["title"]
        seed["durata_min"] = activity["dur"]
        seed["materiale"] = [activity["materiale"]]
        seed["pasi"] = list(activity["baza"])
        seed["gata_cand"] = activity["gata"]
        seed["pas_in_plus"] = activity["plus"]
        seed["provocare"] = activity["provocare"]
        safety = blank_to_none(activity.get("siguranta"))
        if safety:
            seed["siguranta"] = safety
        else:
            seed.pop("siguranta", None)
        seed["nota"] = None

    weeks_meta = []
    materials = []
    for week in data["weeks"]:
        weeks_meta.append(
            {
                "saptamana": week["n"],
                "tema": week["theme"],
                "gratuit": week.get("free") or "",
            }
        )
        audit(f"S{week['n']} gratuit", week.get("free") or "", issues)
        for raw in week["materials"]:
            parsed = strip_markdown(parse_material(week["n"], raw))
            materials.append(parsed)
            audit(f"{parsed['id']} nume", parsed["nume"], issues)
            for line in [parsed["sursa"], parsed["folosita"] or "", parsed["detaliu_pret"] or ""]:
                audit(f"{parsed['id']} sursă", line, issues)
            for home in parsed["acasa"]:
                for line in home["linii"]:
                    audit(f"{home['id']}", line, issues)
            if not parsed["acasa"]:
                issues.append(f"{parsed['id']}: fără variantă de acasă")
            if "**" in json.dumps(parsed, ensure_ascii=False):
                issues.append(f"{parsed['id']}: a rămas un marcaj **")

    if len(materials) != 18:
        raise SystemExit(f"expected 18 materials, got {len(materials)}")

    dump_json(SEED_S1, seed_s1)
    dump_json(SEED_S2, seed_s2)
    dump_json(
        MATERIALS_PATH,
        {
            "data_verificare": SEEN_ON,
            "saptamani": weeks_meta,
            "materiale": materials,
        },
    )
    write_schema()
    write_content(activities, backup)
    write_rollback()

    print(f"activities {len(activities)}")
    print(f"materials {len(materials)}")
    print(f"theme diffs {len(theme_diffs)}")
    for line in theme_diffs:
        print("  THEME", line)
    print(f"live-vs-backup diffs {len(live_diffs)}")
    for line in live_diffs:
        print("  LIVE", line)
    print(f"text flags {len(issues)}")
    for line in issues:
        print("  FLAG", line)


def write_schema() -> None:
    SCHEMA_SQL.write_text(
        """-- Banda 2–3, S1–S4, varianta pentru copilul avansat.
-- Doar adăugiri: coloane noi pe activities și tabele noi pentru materiale.
-- Nu modifică coloane existente, nu șterge rânduri și nu scrie încă textele.
-- Conținutul e în migrarea următoare. Nu se aplică pe Familie din acest PR.

alter table public.activities
  add column if not exists pas_in_plus text,
  add column if not exists provocare text,
  add column if not exists siguranta text;

create table if not exists public.materiale (
  id text primary key,
  banda text not null,
  saptamana integer not null check (saptamana between 1 and 52),
  ordine integer not null,
  nume text not null,
  producator text,
  magazin text,
  sursa text not null,
  link text,
  pret text,
  moneda text,
  data_verificare date,
  stoc text,
  varsta text,
  nota_siguranta text,
  doar_acasa boolean not null default false,
  folosita text,
  detaliu_pret text,
  note text[] not null default '{}',
  unique (banda, saptamana, ordine)
);

create table if not exists public.materiale_acasa (
  id text primary key,
  material_id text not null references public.materiale (id),
  ordine integer not null,
  tip text not null check (tip in ('diy', 'print', '3d', 'nu')),
  titlu text,
  pasi text,
  materiale_unelte text,
  cost_estimat text,
  durata text,
  siguranta text,
  link_model text,
  text_complet text not null,
  unique (material_id, ordine)
);

create table if not exists public.materiale_activitati (
  material_id text not null references public.materiale (id),
  activity_id text not null references public.activities (id),
  primary key (material_id, activity_id)
);

create table if not exists public.materiale_saptamana (
  banda text not null,
  saptamana integer not null check (saptamana between 1 and 52),
  tema text not null,
  gratuit text not null,
  primary key (banda, saptamana)
);

create index if not exists materiale_banda_saptamana_idx
  on public.materiale (banda, saptamana, ordine);

alter table public.materiale enable row level security;
alter table public.materiale_acasa enable row level security;
alter table public.materiale_activitati enable row level security;
alter table public.materiale_saptamana enable row level security;

do $schema$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'materiale' and policyname = 'materiale_select_anon'
  ) then
    create policy materiale_select_anon on public.materiale for select to anon using (true);
  end if;
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'materiale' and policyname = 'materiale_select_authenticated'
  ) then
    create policy materiale_select_authenticated on public.materiale for select to authenticated using (true);
  end if;
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'materiale_acasa' and policyname = 'materiale_acasa_select_anon'
  ) then
    create policy materiale_acasa_select_anon on public.materiale_acasa for select to anon using (true);
  end if;
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'materiale_acasa' and policyname = 'materiale_acasa_select_authenticated'
  ) then
    create policy materiale_acasa_select_authenticated on public.materiale_acasa for select to authenticated using (true);
  end if;
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'materiale_activitati' and policyname = 'materiale_activitati_select_anon'
  ) then
    create policy materiale_activitati_select_anon on public.materiale_activitati for select to anon using (true);
  end if;
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'materiale_activitati' and policyname = 'materiale_activitati_select_authenticated'
  ) then
    create policy materiale_activitati_select_authenticated on public.materiale_activitati for select to authenticated using (true);
  end if;
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'materiale_saptamana' and policyname = 'materiale_saptamana_select_anon'
  ) then
    create policy materiale_saptamana_select_anon on public.materiale_saptamana for select to anon using (true);
  end if;
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'materiale_saptamana' and policyname = 'materiale_saptamana_select_authenticated'
  ) then
    create policy materiale_saptamana_select_authenticated on public.materiale_saptamana for select to authenticated using (true);
  end if;
end
$schema$;

revoke all on public.materiale from anon, authenticated;
revoke all on public.materiale_acasa from anon, authenticated;
revoke all on public.materiale_activitati from anon, authenticated;
revoke all on public.materiale_saptamana from anon, authenticated;
grant select on public.materiale to anon, authenticated;
grant select on public.materiale_acasa to anon, authenticated;
grant select on public.materiale_activitati to anon, authenticated;
grant select on public.materiale_saptamana to anon, authenticated;
""",
        encoding="utf-8",
    )


def write_content(activities: list[tuple[int, str, dict]], backup: dict[str, dict]) -> None:
    materials = load_json(MATERIALS_PATH)
    values: list[str] = []
    for _week, _theme, activity in activities:
        old = backup[activity["live_id"]]
        safety = blank_to_none(activity.get("siguranta"))
        values.append(
            "("
            + ", ".join(
                [
                    sql_text(activity["live_id"]),
                    sql_text(old["titlu"]),
                    sql_array(old["pasi"]),
                    sql_text(old.get("nota")),
                    sql_text(activity["title"]),
                    sql_array([activity["materiale"]]),
                    str(int(activity["dur"])),
                    sql_array(list(activity["baza"])),
                    sql_text(activity["gata"]),
                    sql_text(activity["plus"]),
                    sql_text(activity["provocare"]),
                    sql_text(safety),
                ]
            )
            + ")"
        )

    material_rows = []
    home_rows = []
    link_rows = []
    week_rows = []
    for week in materials["saptamani"]:
        week_rows.append(
            "("
            + ", ".join(
                [
                    sql_text("2-3"),
                    str(int(week["saptamana"])),
                    sql_text(week["tema"]),
                    sql_text(week["gratuit"]),
                ]
            )
            + ")"
        )
    for material in materials["materiale"]:
        material_rows.append(
            "("
            + ", ".join(
                [
                    sql_text(material["id"]),
                    sql_text(material["banda"]),
                    str(int(material["saptamana"])),
                    str(int(material["ordine"])),
                    sql_text(material["nume"]),
                    sql_text(material["producator"]),
                    sql_text(material["magazin"]),
                    sql_text(material["sursa"]),
                    sql_text(material["link"]),
                    sql_text(material["pret"]),
                    sql_text(material["moneda"]),
                    "null" if not material["data_verificare"] else f"date {sql_text(material['data_verificare'])}",
                    sql_text(material["stoc"]),
                    sql_text(material["varsta"]),
                    sql_text(material["nota_siguranta"]),
                    "true" if material["doar_acasa"] else "false",
                    sql_text(material["folosita"]),
                    sql_text(material["detaliu_pret"]),
                    sql_array(material["note"]),
                ]
            )
            + ")"
        )
        for home in material["acasa"]:
            home_rows.append(
                "("
                + ", ".join(
                    [
                        sql_text(home["id"]),
                        sql_text(material["id"]),
                        str(material["acasa"].index(home) + 1),
                        sql_text(home["tip"]),
                        sql_text(home["titlu"]),
                        sql_text(home["pasi"]),
                        sql_text(home["materiale_unelte"]),
                        sql_text(home["cost_estimat"]),
                        sql_text(home["durata"]),
                        sql_text(home["siguranta"]),
                        sql_text(home["link_model"]),
                        sql_text("\n".join(home["linii"])),
                    ]
                )
                + ")"
            )
        for activity_id in material["activitati"]:
            link_rows.append("(" + ", ".join([sql_text(material["id"]), sql_text(activity_id)]) + ")")

    plan = ",\n    ".join(values)
    CONTENT_SQL.write_text(
        f"""-- Înlocuiește textele celor 112 activități din banda 2–3, S1–S4.
-- Întâi copiază rândurile, exact cum sunt înainte de UPDATE, în
-- backup_20261116_gifted_s1s4, inclusiv nota. Apoi fiecare UPDATE cere
-- id-ul, banda 2–3 și textul vechi (titlul, pașii și nota) din acel backup.
-- Dacă un rând nu se potrivește, migrarea se oprește și tranzacția se anulează.
-- Nota celor 112 rânduri devine goală. Dacă textele noi sunt deja scrise și
-- nota e deja goală, rularea nu mai schimbă nimic.
-- Nu atinge copiii, bifele sau săptămânile din afara S1–S4.
-- Nu se aplică pe Familie din acest PR.

do $gifted$
declare
  plan record;
  snap_titlu text;
  snap_pasi text[];
  snap_nota text;
  cur_titlu text;
  cur_pasi text[];
  cur_materiale text[];
  cur_durata integer;
  cur_gata text;
  cur_plus text;
  cur_provocare text;
  cur_siguranta text;
  cur_nota text;
  updated_count int := 0;
  skipped_count int := 0;
  touched int;
begin
  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'activities'
      and column_name = 'pas_in_plus'
  ) then
    raise exception 'Gifted S1–S4: lipsește coloana pas_in_plus. Aplică întâi migrarea de schemă.';
  end if;

  create temporary table gifted_plan (
    id text primary key,
    old_titlu text not null,
    old_pasi text[] not null,
    old_nota text,
    titlu text not null,
    materiale text[] not null,
    durata_min integer not null,
    pasi text[] not null,
    gata_cand text not null,
    pas_in_plus text not null,
    provocare text not null,
    siguranta text
  );

  insert into gifted_plan (
    id, old_titlu, old_pasi, old_nota, titlu, materiale, durata_min, pasi, gata_cand,
    pas_in_plus, provocare, siguranta
  ) values
    {plan};

  if (select count(*) from gifted_plan) <> 112 then
    raise exception 'Gifted S1–S4: planul are % rânduri, așteptam 112', (select count(*) from gifted_plan);
  end if;

  if to_regclass('public.backup_20261116_gifted_s1s4') is null then
    create table public.backup_20261116_gifted_s1s4 as
    select *
    from public.activities
    where banda = '2-3'
      and saptamana between 1 and 4;

  end if;

  alter table public.backup_20261116_gifted_s1s4 enable row level security;
  revoke all on public.backup_20261116_gifted_s1s4 from public, anon, authenticated;

  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'backup_20261116_gifted_s1s4'
      and column_name = 'nota'
  ) then
    raise exception 'Gifted S1–S4: backup-ul nu are coloana nota';
  end if;

  if (select count(*) from public.backup_20261116_gifted_s1s4) <> 112 then
    raise exception 'Gifted S1–S4: backup-ul are % rânduri, așteptam 112',
      (select count(*) from public.backup_20261116_gifted_s1s4);
  end if;

  if exists (
    select 1
    from public.backup_20261116_gifted_s1s4 as snap_row
    full join gifted_plan as plan_row on plan_row.id = snap_row.id
    where plan_row.id is null
      or snap_row.id is null
      or snap_row.banda is distinct from '2-3'
      or snap_row.saptamana not between 1 and 4
  ) then
    raise exception 'Gifted S1–S4: backup-ul nu conține exact cele 112 id-uri din banda 2–3, S1–S4';
  end if;

  for plan in select * from gifted_plan order by id loop
    select titlu, pasi, nota into snap_titlu, snap_pasi, snap_nota
    from public.backup_20261116_gifted_s1s4
    where id = plan.id
      and banda = '2-3';

    if not found then
      raise exception 'Gifted S1–S4: id lipsă din backup: %', plan.id;
    end if;

    if snap_titlu is distinct from plan.old_titlu
       or snap_pasi is distinct from plan.old_pasi
       or snap_nota is distinct from plan.old_nota then
      raise exception 'Gifted S1–S4: backup-ul pentru % nu are titlul, pașii sau nota exportate pe 16.11.2026', plan.id;
    end if;

    select titlu, pasi, materiale, durata_min, gata_cand, pas_in_plus, provocare, siguranta, nota
      into cur_titlu, cur_pasi, cur_materiale, cur_durata, cur_gata, cur_plus, cur_provocare, cur_siguranta, cur_nota
    from public.activities
    where id = plan.id
      and banda = '2-3';

    if not found then
      raise exception 'Gifted S1–S4: id lipsă din banda 2–3: %', plan.id;
    end if;

    if cur_titlu = plan.titlu
       and cur_pasi = plan.pasi
       and cur_materiale = plan.materiale
       and cur_durata = plan.durata_min
       and cur_gata = plan.gata_cand
       and cur_plus is not distinct from plan.pas_in_plus
       and cur_provocare is not distinct from plan.provocare
       and cur_siguranta is not distinct from plan.siguranta
       and cur_nota is null then
      skipped_count := skipped_count + 1;
      continue;
    end if;

    if cur_titlu = plan.titlu
       and cur_pasi = plan.pasi
       and cur_materiale = plan.materiale
       and cur_durata = plan.durata_min
       and cur_gata = plan.gata_cand
       and cur_plus is not distinct from plan.pas_in_plus
       and cur_provocare is not distinct from plan.provocare
       and cur_siguranta is not distinct from plan.siguranta then
      if cur_nota is distinct from plan.old_nota then
        raise exception 'Gifted S1–S4: % nu are nota veche din backup', plan.id;
      end if;
      update public.activities
      set nota = null
      where id = plan.id
        and banda = '2-3'
        and nota is not distinct from plan.old_nota;
      get diagnostics touched = row_count;
      if touched <> 1 then
        raise exception 'Gifted S1–S4: % nota nu s-a golit (rânduri %)', plan.id, touched;
      end if;
      updated_count := updated_count + 1;
      continue;
    end if;

    if cur_titlu is distinct from plan.old_titlu
       or cur_pasi is distinct from plan.old_pasi
       or cur_nota is distinct from plan.old_nota then
      raise exception 'Gifted S1–S4: % nu are titlul, pașii sau nota veche din backup', plan.id;
    end if;

    update public.activities
    set
      titlu = plan.titlu,
      materiale = plan.materiale,
      durata_min = plan.durata_min,
      pasi = plan.pasi,
      gata_cand = plan.gata_cand,
      pas_in_plus = plan.pas_in_plus,
      provocare = plan.provocare,
      siguranta = plan.siguranta,
      nota = null
    where id = plan.id
      and banda = '2-3'
      and titlu = plan.old_titlu
      and pasi = plan.old_pasi
      and nota is not distinct from plan.old_nota;

    get diagnostics touched = row_count;
    if touched <> 1 then
      raise exception 'Gifted S1–S4: % nu s-a actualizat (rânduri %)', plan.id, touched;
    end if;
    updated_count := updated_count + 1;
  end loop;

  if updated_count + skipped_count <> 112 then
    raise exception 'Gifted S1–S4: închise % actualizate și % deja noi, așteptam 112',
      updated_count, skipped_count;
  end if;

  insert into public.materiale (
    id, banda, saptamana, ordine, nume, producator, magazin, sursa, link, pret,
    moneda, data_verificare, stoc, varsta, nota_siguranta, doar_acasa, folosita,
    detaliu_pret, note
  ) values
    {",\n    ".join(material_rows)}
  on conflict (id) do nothing;

  insert into public.materiale_acasa (
    id, material_id, ordine, tip, titlu, pasi, materiale_unelte, cost_estimat,
    durata, siguranta, link_model, text_complet
  ) values
    {",\n    ".join(home_rows)}
  on conflict (id) do nothing;

  insert into public.materiale_activitati (material_id, activity_id) values
    {",\n    ".join(link_rows)}
  on conflict (material_id, activity_id) do nothing;

  insert into public.materiale_saptamana (banda, saptamana, tema, gratuit) values
    {",\n    ".join(week_rows)}
  on conflict (banda, saptamana) do nothing;
end
$gifted$;
""",
        encoding="utf-8",
    )


def write_rollback() -> None:
    ROLLBACK_SQL.write_text(
        """-- Revenire manuală pentru textele gifted S1–S4.
-- NU se aplică automat: fișierul nu stă în supabase/migrations.
-- Citește backup_20261116_gifted_s1s4 și pune înapoi titlul, materialele,
-- durata, pașii și „gata când”. Golește pas_in_plus, provocare și siguranta.
-- Nu șterge activități, nu atinge copiii și nu atinge bifele.
-- Materialele adăugate rămân (sunt un tabel nou); activitățile revin la textul vechi.

do $rollback$
declare
  n int;
  updated int;
begin
  if to_regclass('public.backup_20261116_gifted_s1s4') is null then
    raise exception 'Rollback gifted S1–S4: lipsește tabelul backup_20261116_gifted_s1s4';
  end if;

  select count(*) into n from public.backup_20261116_gifted_s1s4;
  if n <> 112 then
    raise exception 'Rollback gifted S1–S4: backup-ul are % rânduri, așteptam 112', n;
  end if;

  if exists (
    select 1
    from public.backup_20261116_gifted_s1s4
    where banda is distinct from '2-3'
      or saptamana not between 1 and 4
  ) then
    raise exception 'Rollback gifted S1–S4: backup-ul are rânduri din afara benzii 2–3, S1–S4';
  end if;

  update public.activities as activity
  set
    titlu = snap.titlu,
    materiale = snap.materiale,
    durata_min = snap.durata_min,
    pasi = snap.pasi,
    gata_cand = snap.gata_cand,
    nota = snap.nota,
    pas_in_plus = null,
    provocare = null,
    siguranta = null
  from public.backup_20261116_gifted_s1s4 as snap
  where activity.id = snap.id
    and activity.banda = '2-3'
    and snap.banda = '2-3';

  get diagnostics updated = row_count;
  if updated <> 112 then
    raise exception 'Rollback gifted S1–S4: actualizate % din 112', updated;
  end if;
end
$rollback$;
""",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
