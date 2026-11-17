-- Banda 2–3, S1–S4, varianta pentru copilul avansat.
-- Doar adăugiri: coloane noi pe activities și tabele noi pentru materiale.
-- Nu modifică coloane existente, nu șterge rânduri și nu scrie încă textele.
-- Conținutul e în migrarea următoare. Nu se aplică pe Familie din acest PR.

alter table public.activities
  add column if not exists pas_in_plus text,
  add column if not exists provocare text,
  add column if not exists siguranta text;

create table if not exists public.materiale (
  id text primary key,
  banda text not null,
  saptamana integer not null check (saptamana between 1 and 52),
  ordine integer not null,
  nume text not null,
  producator text,
  magazin text,
  sursa text not null,
  link text,
  pret text,
  moneda text,
  data_verificare date,
  stoc text,
  varsta text,
  nota_siguranta text,
  doar_acasa boolean not null default false,
  folosita text,
  detaliu_pret text,
  note text[] not null default '{}',
  unique (banda, saptamana, ordine)
);

create table if not exists public.materiale_acasa (
  id text primary key,
  material_id text not null references public.materiale (id),
  ordine integer not null,
  tip text not null check (tip in ('diy', 'print', '3d', 'nu')),
  titlu text,
  pasi text,
  materiale_unelte text,
  cost_estimat text,
  durata text,
  siguranta text,
  link_model text,
  text_complet text not null,
  unique (material_id, ordine)
);

create table if not exists public.materiale_activitati (
  material_id text not null references public.materiale (id),
  activity_id text not null references public.activities (id),
  primary key (material_id, activity_id)
);

create table if not exists public.materiale_saptamana (
  banda text not null,
  saptamana integer not null check (saptamana between 1 and 52),
  tema text not null,
  gratuit text not null,
  primary key (banda, saptamana)
);

create index if not exists materiale_banda_saptamana_idx
  on public.materiale (banda, saptamana, ordine);

alter table public.materiale enable row level security;
alter table public.materiale_acasa enable row level security;
alter table public.materiale_activitati enable row level security;
alter table public.materiale_saptamana enable row level security;

do $schema$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'materiale' and policyname = 'materiale_select_anon'
  ) then
    create policy materiale_select_anon on public.materiale for select to anon using (true);
  end if;
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'materiale' and policyname = 'materiale_select_authenticated'
  ) then
    create policy materiale_select_authenticated on public.materiale for select to authenticated using (true);
  end if;
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'materiale_acasa' and policyname = 'materiale_acasa_select_anon'
  ) then
    create policy materiale_acasa_select_anon on public.materiale_acasa for select to anon using (true);
  end if;
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'materiale_acasa' and policyname = 'materiale_acasa_select_authenticated'
  ) then
    create policy materiale_acasa_select_authenticated on public.materiale_acasa for select to authenticated using (true);
  end if;
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'materiale_activitati' and policyname = 'materiale_activitati_select_anon'
  ) then
    create policy materiale_activitati_select_anon on public.materiale_activitati for select to anon using (true);
  end if;
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'materiale_activitati' and policyname = 'materiale_activitati_select_authenticated'
  ) then
    create policy materiale_activitati_select_authenticated on public.materiale_activitati for select to authenticated using (true);
  end if;
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'materiale_saptamana' and policyname = 'materiale_saptamana_select_anon'
  ) then
    create policy materiale_saptamana_select_anon on public.materiale_saptamana for select to anon using (true);
  end if;
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'materiale_saptamana' and policyname = 'materiale_saptamana_select_authenticated'
  ) then
    create policy materiale_saptamana_select_authenticated on public.materiale_saptamana for select to authenticated using (true);
  end if;
end
$schema$;

revoke all on public.materiale from anon, authenticated;
revoke all on public.materiale_acasa from anon, authenticated;
revoke all on public.materiale_activitati from anon, authenticated;
revoke all on public.materiale_saptamana from anon, authenticated;
grant select on public.materiale to anon, authenticated;
grant select on public.materiale_acasa to anon, authenticated;
grant select on public.materiale_activitati to anon, authenticated;
grant select on public.materiale_saptamana to anon, authenticated;
