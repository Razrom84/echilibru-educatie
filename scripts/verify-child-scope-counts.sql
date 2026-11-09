-- Verificare T1, de rulat pe o copie a bazei, înainte de migrare și încă o dată după.
-- Compară cele două rezultate.
-- Totalurile (ultima interogare) trebuie să rămână aceleași, în afară de dublurile
-- strânse la același copil, anunțate în jurnalul migrării.
-- După migrare, „fără copil” e 0 dacă în copie era o singură familie.
-- Dacă erau mai multe familii, rândurile fără copil rămân nemișcate și apar aici.

-- 1. Pe familie și pe copil. Ordinea e stabilă, ca să poți pune rezultatele unul lângă altul.
select
  f.id as familie,
  c.id as copil,
  c.name as nume,
  c.active as activ,
  c.created_at as creat_la,
  (select count(*) from public.completions x where x.child_id = c.id) as bife,
  (select count(*) from public.day_notes x where x.child_id = c.id) as note,
  (select count(*) from public.archive_days x where x.child_id = c.id) as zile,
  (
    select count(*)
    from public.archive_days x
    where x.child_id = c.id
      and x.photo_path is not null
  ) as poze
from public.children c
join public.families f on f.id = c.family_id
order by f.id, c.created_at, c.id;

-- 2. Rânduri care încă nu țin de un copil.
select 'bife_fara_copil' as verificare, count(*)::bigint as n
from public.completions
where child_id is null
union all
select 'note_fara_copil', count(*)
from public.day_notes
where child_id is null
union all
select 'zile_fara_copil', count(*)
from public.archive_days
where child_id is null
union all
select 'poze_fara_copil', count(*)
from public.archive_days
where child_id is null
  and photo_path is not null;

-- 3. Totaluri. Acestea nu trebuie să scadă, în afară de dublurile strânse.
select 'bife' as verificare, count(*)::bigint as n from public.completions
union all
select 'note', count(*) from public.day_notes
union all
select 'zile', count(*) from public.archive_days
union all
select 'activitati_bifate', count(distinct activity_id) from public.completions
order by verificare;
