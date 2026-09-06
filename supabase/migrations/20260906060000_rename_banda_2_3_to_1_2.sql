-- M1+M2: live age-band label 2-3 → 1-2 (12–24 months).
-- Activities stay the same: ids, titles, steps, materials are not rewritten.
-- calendar_feed_for_token matches activities.banda = children.age_band, so both move together.
-- Idempotent: safe to re-run on production Supabase.

alter table public.children
  alter column age_band set default '1-2';

alter table public.activities
  alter column banda set default '1-2';

update public.children
set age_band = '1-2'
where age_band in ('2-3', '2–3');

update public.activities
set
  banda = case
    when banda in ('2-3', '2–3') then '1-2'
    else banda
  end,
  nota = replace(replace(nota, 'Vârsta 2–3:', 'Vârsta 1–2:'), 'Vârsta 2-3:', 'Vârsta 1-2:')
where banda in ('2-3', '2–3')
   or nota like '%Vârsta 2–3:%'
   or nota like '%Vârsta 2-3:%';
