-- Revenire manuală pentru textele gifted S1–S4.
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
