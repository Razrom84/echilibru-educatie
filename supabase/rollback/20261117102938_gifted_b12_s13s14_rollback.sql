-- Revenire manuală pentru 20261117102938_gifted_b12_s13s14_continut.sql. NU se rulează automat.
-- Pune înapoi cele 56 activități din backup_20261117_b12_s13s14 (titlu, materiale, durata, pași,
-- „gata când”, nota) și golește treptele. Scoate materialele b12 S13–S14.
-- Nu șterge activități, nu atinge copiii, bifele, notele sau pozele.

do $rollback$
declare
  n int;
  updated int;
begin
  if to_regclass('public.backup_20261117_b12_s13s14') is null then
    raise exception 'Rollback B12: lipsește backup_20261117_b12_s13s14';
  end if;
  select count(*) into n from public.backup_20261117_b12_s13s14;
  if n <> 56 then
    raise exception 'Rollback B12: backup-ul are % rânduri, așteptam 56', n;
  end if;
  if exists (select 1 from public.backup_20261117_b12_s13s14 where banda is distinct from '1-2' or saptamana not between 13 and 14) then
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
  from public.backup_20261117_b12_s13s14 as snap
  where activity.id = snap.id and activity.banda = '1-2' and snap.banda = '1-2';
  get diagnostics updated = row_count;
  if updated <> 56 then
    raise exception 'Rollback B12: actualizate % din 56', updated;
  end if;

  delete from public.materiale_activitati where material_id in ($q$b12-s13-m1$q$, $q$b12-s13-m2$q$, $q$b12-s13-m3$q$, $q$b12-s13-m4$q$, $q$b12-s13-m5$q$, $q$b12-s14-m1$q$, $q$b12-s14-m2$q$, $q$b12-s14-m3$q$, $q$b12-s14-m4$q$, $q$b12-s14-m5$q$, $q$b12-s14-m6$q$);
  delete from public.materiale_acasa where material_id in ($q$b12-s13-m1$q$, $q$b12-s13-m2$q$, $q$b12-s13-m3$q$, $q$b12-s13-m4$q$, $q$b12-s13-m5$q$, $q$b12-s14-m1$q$, $q$b12-s14-m2$q$, $q$b12-s14-m3$q$, $q$b12-s14-m4$q$, $q$b12-s14-m5$q$, $q$b12-s14-m6$q$);
  delete from public.materiale where id in ($q$b12-s13-m1$q$, $q$b12-s13-m2$q$, $q$b12-s13-m3$q$, $q$b12-s13-m4$q$, $q$b12-s13-m5$q$, $q$b12-s14-m1$q$, $q$b12-s14-m2$q$, $q$b12-s14-m3$q$, $q$b12-s14-m4$q$, $q$b12-s14-m5$q$, $q$b12-s14-m6$q$);
  delete from public.materiale_saptamana where banda = '1-2' and saptamana between 13 and 14;
end
$rollback$;
