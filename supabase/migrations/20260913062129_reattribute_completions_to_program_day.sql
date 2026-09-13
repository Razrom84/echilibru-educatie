-- Completions belong to the activity's program weekday (Europe/Bucharest),
-- not the instant the parent ticked the box.
--
-- Example: S2 Marți (2026-09-08) ticked on Duminică 13 Sep was stored as
-- completed_at = Sunday and archive_days.done_titles on Sunday.
-- Re-attribute by activities.saptamana + zi → civil date.

-- program_year_start is the S1 Monday. If the column is still null, use the
-- 2026/27 lock (Monday of the ISO week containing 1 September 2026).
-- Matches src/lib/program-week.ts familyProgramYearStart for current families.

with year_start as (
  select
    f.id as family_id,
    coalesce(f.program_year_start, date '2026-08-31') as program_year_start
  from public.families f
),
mapped as (
  select
    c.id,
    c.completed_at,
    (
      ys.program_year_start
      + ((a.saptamana - 1) * 7 + (a.zi - 1))
    ) as program_civil,
    (c.completed_at at time zone 'Europe/Bucharest')::date as completed_civil
  from public.completions c
  join public.activities a on a.id = c.activity_id
  join public.children ch on ch.id = c.child_id
  join year_start ys on ys.family_id = ch.family_id
)
update public.completions c
set completed_at = c.completed_at
  - ((m.completed_civil - m.program_civil) * interval '1 day')
from mapped m
where c.id = m.id
  and m.completed_civil <> m.program_civil;

-- Rebuild Ați făcut from the (now correct) completion civil dates.
-- Keep notes and photos. Empty title arrays stay if that day has no ticks.
update public.archive_days d
set
  done_titles = coalesce((
    select array_agg(a.titlu order by a.zi, a.pilon)
    from public.completions c
    join public.activities a on a.id = c.activity_id
    where c.child_id = d.child_id
      and (c.completed_at at time zone 'Europe/Bucharest')::date = d.civil_date
  ), '{}'),
  updated_at = now();
