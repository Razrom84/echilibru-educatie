#!/usr/bin/env python3
"""Build band 1–2 S13–S14: local catalog, seed update, content SQL and rollback.

Reads content/gifted-b12-s13-s14-data.json (Cristina, 17.11.2026) and
docs/backup/live-1-2-S13-S14-backup-20261117.json. live_id is the exact Familie id.
Does not touch Familie.
"""
from __future__ import annotations

import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "content" / "gifted-b12-s13-s14-data.json"
BACKUP_PATH = ROOT / "docs" / "backup" / "live-1-2-S13-S14-backup-20261117.json"
BACKUP_SHA = "5c9039d9c3c26e22aa1f5d92a81540f10b15830092afe10b927e31f2e1ee2076"
SEED_PATH = ROOT / "content" / "seed-s13-s16-banda-1-2.json"
MATERIALS_PATH = ROOT / "content" / "materiale-s13-s14-banda-1-2.json"
CONTENT_SQL = ROOT / "supabase" / "migrations" / "20261117102938_gifted_b12_s13s14_continut.sql"
ROLLBACK_SQL = ROOT / "supabase" / "rollback" / "20261117102938_gifted_b12_s13s14_rollback.sql"
BACKUP_TABLE = "backup_20261117_b12_s13s14"
N = 56


def dollar(value: str) -> str:
    tag, n = "q", 0
    while f"${tag}$" in value:
        n += 1
        tag = f"q{n}"
    return f"${tag}${value}${tag}$"


def sql_text(value):
    return "null" if value is None else dollar(value)


def sql_array(items):
    if not items:
        return "'{}'::text[]"
    return "array[" + ", ".join(dollar(item) for item in items) + "]::text[]"


def blank(value):
    return value.strip() if value and value.strip() else None


def dump(path: Path, payload) -> None:
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def material_json(week: int, raw: dict) -> dict:
    lines: list[str] = []
    for bullet in raw["bullets"]:
        text = bullet["text"].replace("**", "")
        if text.startswith("Folosit") or text.startswith("Categorie:"):
            continue
        if text.startswith("Acasă:"):
            lines.extend(sub.replace("**", "") for sub in bullet.get("sub") or [])
            continue
        lines.append(text)
        lines.extend(sub.replace("**", "") for sub in bullet.get("sub") or [])
    homes = []
    for index, home in enumerate(raw["acasa"], start=1):
        homes.append({**home, "id": home["id"], "linii": lines, "ordine": index})
    for home in homes:
        home.pop("ordine")
    assert raw["id"].startswith("b12-"), raw["id"]
    assert raw["banda"] == "1-2" and raw["saptamana"] == week
    return {
        "id": raw["id"],
        "banda": "1-2",
        "saptamana": week,
        "ordine": raw["ordine"],
        "nume": raw["nume"],
        "producator": None,
        "magazin": None,
        "sursa": raw.get("extra") or "din casă",
        "link": raw.get("link"),
        "pret": raw.get("pret"),
        "moneda": raw.get("moneda"),
        "data_verificare": None,
        "stoc": None,
        "varsta": None,
        "nota_siguranta": None,
        "doar_acasa": bool(raw["doar_acasa"]),
        "folosita": raw.get("uses_text"),
        "detaliu_pret": None,
        "note": [],
        "activitati": list(raw["activitati"]),
        "acasa": homes,
        "produs_cheie": raw["produs_cheie"],
        "categorie": raw["categorie"],
        # Lucruri din casă pentru 1–2 ani: vârsta minimă a benzii, nu „necunoscută”.
        "varsta_min_luni": 12,
    }


def main() -> None:
    raw_backup = BACKUP_PATH.read_bytes()
    if hashlib.sha256(raw_backup).hexdigest() != BACKUP_SHA:
        raise SystemExit("backup sha256 mismatch")
    backup = {row["id"]: row for row in json.loads(raw_backup)}
    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    assert data["banda"] == "1-2"
    acts = [(week["n"], a) for week in data["weeks"] for a in week["activities"]]
    ids = [a["live_id"] for _, a in acts]
    if len(acts) != N or len(set(ids)) != N or set(ids) != set(backup):
        raise SystemExit("ids do not match the backup (56)")

    seed = json.loads(SEED_PATH.read_text(encoding="utf-8"))
    seed_by_id = {row["id"]: row for row in seed["activitati"]}
    plan_rows = []
    for week_n, a in acts:
        old = backup[a["live_id"]]
        row = seed_by_id[a["live_id"]]
        if (row["zi"], row["pilon"], row["saptamana"]) != (a["day"], a["pillar"], week_n):
            raise SystemExit(f"seed slot mismatch {a['live_id']}")
        if (old["zi"], old["pilon"], old["saptamana"], old["banda"]) != (a["day"], a["pillar"], week_n, "1-2"):
            raise SystemExit(f"backup slot mismatch {a['live_id']}")
        if old["mod_default"] != a["mod_default"]:
            raise SystemExit(f"mod_default differs {a['live_id']}")
        if len(a["baza"]) != 4 or not a["plus"].strip() or not a["provocare"].strip():
            raise SystemExit(f"tiers incomplete {a['live_id']}")
        text = json.dumps(a, ensure_ascii=False)
        if "**" in text or any(c in text for c in "şţŞŢ"):
            raise SystemExit(f"markdown or cedilla in {a['live_id']}")
        materiale = list(a["materiale_lista"])
        safety = blank(a.get("siguranta"))
        row.update(
            titlu=a["title"],
            durata_min=a["dur"],
            materiale=materiale,
            pasi=list(a["baza"]),
            gata_cand=a["gata"],
            nota=None,
            pas_in_plus=a["plus"],
            provocare=a["provocare"],
        )
        if safety:
            row["siguranta"] = safety
        else:
            row.pop("siguranta", None)
        plan_rows.append((old, a, materiale, safety))

    materials = [material_json(week["n"], raw) for week in data["weeks"] for raw in week["materials"]]
    weeks_meta = [
        {"saptamana": week["n"], "tema": week["theme"], "gratuit": week.get("free") or ""}
        for week in data["weeks"]
    ]
    for material in materials:
        for activity_id in material["activitati"]:
            if activity_id not in backup:
                raise SystemExit(f"{material['id']} links unknown activity {activity_id}")

    dump(SEED_PATH, seed)
    dump(MATERIALS_PATH, {"data_verificare": None, "saptamani": weeks_meta, "materiale": materials})
    write_content(plan_rows, materials, weeks_meta)
    write_rollback(materials)
    print(f"activities {len(plan_rows)} · materials {len(materials)} · weeks {len(weeks_meta)}")


def write_content(plan_rows, materials, weeks_meta) -> None:
    values = []
    for old, a, materiale, safety in plan_rows:
        values.append(
            "("
            + ", ".join(
                [
                    sql_text(a["live_id"]),
                    sql_text(old["titlu"]),
                    sql_array(old["pasi"]),
                    sql_text(old["nota"]),
                    sql_array(old["materiale"] or []),
                    str(int(old["durata_min"])),
                    sql_text(old["gata_cand"]),
                    sql_text(a["title"]),
                    sql_array(materiale),
                    str(int(a["dur"])),
                    sql_array(a["baza"]),
                    sql_text(a["gata"]),
                    sql_text(a["plus"]),
                    sql_text(a["provocare"]),
                    sql_text(safety),
                ]
            )
            + ")"
        )
    material_rows, home_rows, link_rows = [], [], []
    for m in materials:
        material_rows.append(
            "("
            + ", ".join(
                [
                    sql_text(m["id"]), sql_text("1-2"), str(m["saptamana"]), str(m["ordine"]),
                    sql_text(m["nume"]), sql_text(m["sursa"]), sql_text(m["link"]), sql_text(m["pret"]),
                    sql_text(m["moneda"]), "true" if m["doar_acasa"] else "false",
                    sql_text(m["folosita"]), sql_array(m["note"]), sql_text(m["produs_cheie"]),
                ]
            )
            + ")"
        )
        for index, home in enumerate(m["acasa"], start=1):
            home_rows.append(
                "("
                + ", ".join(
                    [
                        sql_text(home["id"]), sql_text(m["id"]), str(index), sql_text(home["tip"]),
                        sql_text(home["titlu"]), sql_text(home["pasi"]), sql_text(home["materiale_unelte"]),
                        sql_text(home["cost_estimat"]), sql_text(home["durata"]), sql_text(home["siguranta"]),
                        sql_text(home["link_model"]), sql_text("\n".join(home["linii"])),
                    ]
                )
                + ")"
            )
        for activity_id in m["activitati"]:
            link_rows.append(f"({sql_text(m['id'])}, {sql_text(activity_id)})")
    week_rows = [
        f"({sql_text('1-2')}, {w['saptamana']}, {sql_text(w['tema'])}, {sql_text(w['gratuit'])})" for w in weeks_meta
    ]
    J = ",\n    ".join
    CONTENT_SQL.write_text(
        f"""-- Banda 1–2, S13–S14: înlocuiește textele celor {N} activități cu varianta în trepte.
-- Cere întâi 20261117102924_stoc_materiale.sql (coloana materiale.produs_cheie).
-- 1. Copiază cele {N} rânduri, exact cum sunt, în {BACKUP_TABLE}.
-- 2. UPDATE pe id + banda 1–2, numai dacă titlul, pașii, nota, materialele,
--    durata și „gata când” sunt cele din backup-ul din 17.11.2026 (sha256 5c9039d9…2076).
--    Orice nepotrivire oprește migrarea; totul e o singură tranzacție.
-- 3. Oprește-se dacă vreuna dintre activități are deja bife (completions), doar citire.
-- 4. Adaugă materialele 1–2 (id-uri b12-), legăturile și textul „gratuit” pe săptămână.
-- Nu schimbă zi, pilon, mod_default, tema, id-uri; nu atinge completions, children,
-- day_notes, archive_days sau stocarea. A doua rulare nu schimbă nimic.
-- Nu se aplică pe Familie din acest PR.

do $b12$
declare
  plan record;
  cur record;
  updated_count int := 0;
  skipped_count int := 0;
  touched int;
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'activities' and column_name = 'pas_in_plus'
  ) then
    raise exception 'B12 S13–S14: lipsește coloana activities.pas_in_plus.';
  end if;
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'materiale' and column_name = 'produs_cheie'
  ) then
    raise exception 'B12 S13–S14: lipsește materiale.produs_cheie. Aplică întâi 20261117102924_stoc_materiale.sql.';
  end if;

  create temporary table b12_plan (
    id text primary key,
    old_titlu text not null,
    old_pasi text[] not null,
    old_nota text,
    old_materiale text[] not null,
    old_durata integer not null,
    old_gata text not null,
    titlu text not null,
    materiale text[] not null,
    durata_min integer not null,
    pasi text[] not null,
    gata_cand text not null,
    pas_in_plus text not null,
    provocare text not null,
    siguranta text
  ) on commit drop;

  insert into b12_plan values
    {J(values)};

  if (select count(*) from b12_plan) <> {N} then
    raise exception 'B12 S13–S14: planul are % rânduri, așteptam {N}', (select count(*) from b12_plan);
  end if;

  if to_regclass('public.{BACKUP_TABLE}') is null then
    create table public.{BACKUP_TABLE} as
    select * from public.activities
    where banda = '1-2' and saptamana between 13 and 14;
  end if;
  alter table public.{BACKUP_TABLE} enable row level security;
  revoke all on public.{BACKUP_TABLE} from public, anon, authenticated;

  if exists (
    select 1
    from public.{BACKUP_TABLE} as snap
    full join b12_plan as p on p.id = snap.id
    where p.id is null or snap.id is null or snap.banda is distinct from '1-2'
      or snap.saptamana not between 13 and 14
  ) then
    raise exception 'B12 S13–S14: backup-ul nu conține exact cele {N} id-uri din banda 1–2, S13–S14';
  end if;

  for plan in select * from b12_plan order by id loop
    select * into cur from public.{BACKUP_TABLE} where id = plan.id;
    if cur.titlu is distinct from plan.old_titlu or cur.pasi is distinct from plan.old_pasi
       or cur.nota is distinct from plan.old_nota or cur.materiale is distinct from plan.old_materiale
       or cur.durata_min is distinct from plan.old_durata or cur.gata_cand is distinct from plan.old_gata then
      raise exception 'B12 S13–S14: backup-ul pentru % nu e cel din 17.11.2026', plan.id;
    end if;

    select * into cur from public.activities where id = plan.id and banda = '1-2';
    if not found then
      raise exception 'B12 S13–S14: id lipsă din banda 1–2: %', plan.id;
    end if;

    if cur.titlu = plan.titlu and cur.pasi = plan.pasi and cur.materiale = plan.materiale
       and cur.durata_min = plan.durata_min and cur.gata_cand = plan.gata_cand
       and cur.pas_in_plus is not distinct from plan.pas_in_plus
       and cur.provocare is not distinct from plan.provocare
       and cur.siguranta is not distinct from plan.siguranta
       and cur.nota is null then
      skipped_count := skipped_count + 1;
      continue;
    end if;

    if exists (select 1 from public.completions c where c.activity_id = plan.id) then
      raise exception 'B12 S13–S14: % are deja bife; nu schimbăm textul sub ele', plan.id;
    end if;

    update public.activities
    set titlu = plan.titlu,
        materiale = plan.materiale,
        durata_min = plan.durata_min,
        pasi = plan.pasi,
        gata_cand = plan.gata_cand,
        pas_in_plus = plan.pas_in_plus,
        provocare = plan.provocare,
        siguranta = plan.siguranta,
        nota = null
    where id = plan.id
      and banda = '1-2'
      and titlu = plan.old_titlu
      and pasi = plan.old_pasi
      and nota is not distinct from plan.old_nota
      and materiale = plan.old_materiale
      and durata_min = plan.old_durata
      and gata_cand = plan.old_gata;
    get diagnostics touched = row_count;
    if touched <> 1 then
      raise exception 'B12 S13–S14: % nu are textul vechi din backup (rânduri %)', plan.id, touched;
    end if;
    updated_count := updated_count + 1;
  end loop;

  if updated_count + skipped_count <> {N} then
    raise exception 'B12 S13–S14: % actualizate + % deja noi, așteptam {N}', updated_count, skipped_count;
  end if;
  if updated_count not in (0, {N}) then
    raise exception 'B12 S13–S14: doar % din {N} erau de actualizat; stare amestecată', updated_count;
  end if;

  insert into public.materiale (
    id, banda, saptamana, ordine, nume, sursa, link, pret, moneda, doar_acasa, folosita, note, produs_cheie
  ) values
    {J(material_rows)}
  on conflict (id) do nothing;

  insert into public.materiale_acasa (
    id, material_id, ordine, tip, titlu, pasi, materiale_unelte, cost_estimat,
    durata, siguranta, link_model, text_complet
  ) values
    {J(home_rows)}
  on conflict (id) do nothing;

  insert into public.materiale_activitati (material_id, activity_id) values
    {J(link_rows)}
  on conflict (material_id, activity_id) do nothing;

  insert into public.materiale_saptamana (banda, saptamana, tema, gratuit) values
    {J(week_rows)}
  on conflict (banda, saptamana) do nothing;
end
$b12$;
""",
        encoding="utf-8",
    )


def write_rollback(materials) -> None:
    ids = ", ".join(sql_text(m["id"]) for m in materials)
    ROLLBACK_SQL.write_text(
        f"""-- Revenire manuală pentru 20261117102938_gifted_b12_s13s14_continut.sql. NU se rulează automat.
-- Pune înapoi cele {N} activități din {BACKUP_TABLE} (titlu, materiale, durata, pași,
-- „gata când”, nota) și golește treptele. Scoate materialele b12 S13–S14.
-- Nu șterge activități, nu atinge copiii, bifele, notele sau pozele.

do $rollback$
declare
  n int;
  updated int;
begin
  if to_regclass('public.{BACKUP_TABLE}') is null then
    raise exception 'Rollback B12: lipsește {BACKUP_TABLE}';
  end if;
  select count(*) into n from public.{BACKUP_TABLE};
  if n <> {N} then
    raise exception 'Rollback B12: backup-ul are % rânduri, așteptam {N}', n;
  end if;
  if exists (select 1 from public.{BACKUP_TABLE} where banda is distinct from '1-2' or saptamana not between 13 and 14) then
    raise exception 'Rollback B12: backup-ul are rânduri din afara benzii 1–2, S13–S14';
  end if;

  update public.activities as activity
  set titlu = snap.titlu,
      materiale = snap.materiale,
      durata_min = snap.durata_min,
      pasi = snap.pasi,
      gata_cand = snap.gata_cand,
      nota = snap.nota,
      pas_in_plus = snap.pas_in_plus,
      provocare = snap.provocare,
      siguranta = snap.siguranta
  from public.{BACKUP_TABLE} as snap
  where activity.id = snap.id and activity.banda = '1-2' and snap.banda = '1-2';
  get diagnostics updated = row_count;
  if updated <> {N} then
    raise exception 'Rollback B12: actualizate % din {N}', updated;
  end if;

  delete from public.materiale_activitati where material_id in ({ids});
  delete from public.materiale_acasa where material_id in ({ids});
  delete from public.materiale where id in ({ids});
  delete from public.materiale_saptamana where banda = '1-2' and saptamana between 13 and 14;
end
$rollback$;
""",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
