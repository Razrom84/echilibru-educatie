-- V1.2: optional free-text note per child × program year × week × weekday.
-- One short body. Empty means no row (delete on clear). Not per pillar.

create table public.day_notes (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children (id) on delete cascade,
  program_year_start date not null,
  week_number integer not null check (week_number between 1 and 52),
  day_of_week integer not null check (day_of_week between 1 and 7),
  body text not null check (char_length(body) between 1 and 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint day_notes_child_year_week_day_key
    unique (child_id, program_year_start, week_number, day_of_week)
);

create index day_notes_child_week_idx
  on public.day_notes (child_id, program_year_start, week_number);

comment on table public.day_notes is
  'Optional day-level note (notă pe zi). Unique per child, program year, S#, weekday.';

comment on column public.day_notes.program_year_start is
  'Monday of the program year (same meaning as families.program_year_start).';

comment on column public.day_notes.body is
  'Short free-text. Empty is represented by deleting the row.';

alter table public.day_notes enable row level security;

create policy day_notes_select_own
  on public.day_notes for select to authenticated
  using (
    child_id in (
      select c.id
      from public.children c
      join public.families f on f.id = c.family_id
      where f.parent_id = auth.uid()
    )
  );

create policy day_notes_insert_own
  on public.day_notes for insert to authenticated
  with check (
    child_id in (
      select c.id
      from public.children c
      join public.families f on f.id = c.family_id
      where f.parent_id = auth.uid()
    )
  );

create policy day_notes_update_own
  on public.day_notes for update to authenticated
  using (
    child_id in (
      select c.id
      from public.children c
      join public.families f on f.id = c.family_id
      where f.parent_id = auth.uid()
    )
  )
  with check (
    child_id in (
      select c.id
      from public.children c
      join public.families f on f.id = c.family_id
      where f.parent_id = auth.uid()
    )
  );

create policy day_notes_delete_own
  on public.day_notes for delete to authenticated
  using (
    child_id in (
      select c.id
      from public.children c
      join public.families f on f.id = c.family_id
      where f.parent_id = auth.uid()
    )
  );
