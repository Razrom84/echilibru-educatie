-- R5: secret subscribe token per child for the ICS feed.
-- Apple / Google fetch /api/calendar/{token}.ics without a session.
-- Lookup is security definer; anon cannot SELECT children or tokens.

alter table public.children
  add column if not exists calendar_token text;

create unique index if not exists children_calendar_token_uidx
  on public.children (calendar_token)
  where calendar_token is not null;

comment on column public.children.calendar_token is
  'Secret subscribe token for the ICS feed. Unguessable; regenerate later by overwrite.';

create or replace function public.calendar_feed_for_token(p_token text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  rec record;
  acts jsonb;
begin
  if p_token is null or length(p_token) < 32 then
    return null;
  end if;

  select
    c.id,
    c.name,
    c.age_band,
    f.joined_at,
    f.program_year_start
  into rec
  from public.children c
  join public.families f on f.id = c.family_id
  where c.calendar_token = p_token
    and c.active
  limit 1;

  if rec.id is null then
    return null;
  end if;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'saptamana', a.saptamana,
        'zi', a.zi,
        'pilon', a.pilon,
        'titlu', a.titlu,
        'tema_saptamana', a.tema_saptamana
      )
      order by a.saptamana, a.zi, a.pilon
    ),
    '[]'::jsonb
  )
  into acts
  from public.activities a
  where a.banda = rec.age_band;

  return jsonb_build_object(
    'child_id', rec.id,
    'child_name', rec.name,
    'age_band', rec.age_band,
    'joined_at', rec.joined_at,
    'program_year_start', rec.program_year_start,
    'activities', acts
  );
end;
$$;

revoke all on function public.calendar_feed_for_token(text) from public;
grant execute on function public.calendar_feed_for_token(text) to anon, authenticated;

comment on function public.calendar_feed_for_token(text) is
  'ICS subscribe lookup: child + catalog for a valid calendar_token; null otherwise.';
