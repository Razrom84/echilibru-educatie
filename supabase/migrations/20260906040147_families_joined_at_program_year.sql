-- R1: store readiness for the program-week date model.
-- joined_at = when the family entered the program (backfill from created_at).
-- program_year_start = Monday of the S1 week in force at join (YYYY-MM-DD).
-- App helpers in src/lib/program-week.ts compute the Monday; column stays
-- nullable so existing rows can be filled by later tickets without inventing dates.

alter table public.families
  add column if not exists joined_at timestamptz;

update public.families
  set joined_at = created_at
  where joined_at is null;

alter table public.families
  alter column joined_at set default now(),
  alter column joined_at set not null;

alter table public.families
  add column if not exists program_year_start date;

comment on column public.families.joined_at is
  'When the family joined the program. Defaults to created_at for existing rows.';

comment on column public.families.program_year_start is
  'Monday (Europe/Bucharest) of the program year in force at join; S1 week start.';
