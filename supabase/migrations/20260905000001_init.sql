-- Echilibru educație — schema + RLS
-- Parent (auth.users) owns one family; family has N children.
-- Activities are a shared catalog. Completions belong to a child.

create type public.pillar as enum ('fizic', 'mental', 'resurse', 'social');
create type public.completion_mode as enum ('A', 'B');

create table public.families (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null unique references auth.users (id) on delete cascade,
  display_name text,
  default_mode public.completion_mode not null default 'A',
  created_at timestamptz not null default now()
);

create table public.children (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families (id) on delete cascade,
  name text not null,
  birthdate date,
  age_band text not null default '2-3',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.activities (
  id uuid primary key default gen_random_uuid(),
  week_number integer not null check (week_number between 1 and 52),
  day_of_week integer not null check (day_of_week between 1 and 7),
  pillar public.pillar not null,
  title text not null,
  body text not null,
  age_band text not null default '2-3',
  is_placeholder boolean not null default true,
  created_at timestamptz not null default now(),
  unique (week_number, day_of_week, pillar, age_band)
);

create table public.completions (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children (id) on delete cascade,
  activity_id uuid not null references public.activities (id) on delete cascade,
  completed_at timestamptz not null default now(),
  mode public.completion_mode not null default 'A',
  parent_approved boolean,
  unique (child_id, activity_id)
);

create index children_family_id_idx on public.children (family_id);
create index children_active_idx on public.children (family_id, active);
create index completions_child_id_idx on public.completions (child_id);
create index activities_week_day_band_idx on public.activities (week_number, day_of_week, age_band);

-- New parent → one family row
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.families (parent_id, display_name)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'display_name',
      split_part(new.email, '@', 1)
    )
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.families enable row level security;
alter table public.children enable row level security;
alter table public.activities enable row level security;
alter table public.completions enable row level security;

create policy families_select_own
  on public.families for select to authenticated
  using (parent_id = auth.uid());

create policy families_insert_own
  on public.families for insert to authenticated
  with check (parent_id = auth.uid());

create policy families_update_own
  on public.families for update to authenticated
  using (parent_id = auth.uid())
  with check (parent_id = auth.uid());

create policy children_select_own
  on public.children for select to authenticated
  using (
    family_id in (select id from public.families where parent_id = auth.uid())
  );

create policy children_insert_own
  on public.children for insert to authenticated
  with check (
    family_id in (select id from public.families where parent_id = auth.uid())
  );

create policy children_update_own
  on public.children for update to authenticated
  using (
    family_id in (select id from public.families where parent_id = auth.uid())
  )
  with check (
    family_id in (select id from public.families where parent_id = auth.uid())
  );

create policy children_delete_own
  on public.children for delete to authenticated
  using (
    family_id in (select id from public.families where parent_id = auth.uid())
  );

create policy activities_select_authenticated
  on public.activities for select to authenticated
  using (true);

create policy completions_select_own
  on public.completions for select to authenticated
  using (
    child_id in (
      select c.id
      from public.children c
      join public.families f on f.id = c.family_id
      where f.parent_id = auth.uid()
    )
  );

create policy completions_insert_own
  on public.completions for insert to authenticated
  with check (
    child_id in (
      select c.id
      from public.children c
      join public.families f on f.id = c.family_id
      where f.parent_id = auth.uid()
    )
  );

create policy completions_update_own
  on public.completions for update to authenticated
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

create policy completions_delete_own
  on public.completions for delete to authenticated
  using (
    child_id in (
      select c.id
      from public.children c
      join public.families f on f.id = c.family_id
      where f.parent_id = auth.uid()
    )
  );
