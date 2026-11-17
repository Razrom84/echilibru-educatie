-- Stocul de materiale didactice (plan S13–S14 + stoc, secțiunile 5, 7, 8).
-- Doar aditiv: o coloană nouă opțională pe materiale, două tabele noi, un bucket privat.
-- Nu atinge activities, completions, children, day_notes, archive_days și nici archive-photos.
-- Idempotent: a doua rulare nu schimbă nimic.

-- 1. Cheia produsului: același produs, aceeași cheie, în orice săptămână și bandă.
alter table public.materiale add column if not exists produs_cheie text;
create index if not exists materiale_produs_cheie_idx on public.materiale (produs_cheie);
comment on column public.materiale.produs_cheie is
  'Cheia produsului (de ex. carte-vanatoare-ursi). Stocul familiei se potrivește pe ea.';

-- Cele 18 materiale din 2–3 S1–S4. Doar unde cheia lipsește încă.
update public.materiale m
set produs_cheie = k.cheie
from (values
    ('s1-m1', 'carte-ce-facem-toamna'),
    ('s1-m2', 'lupa-jumbo-tickit'),
    ('s1-m3', 'tava-lemn-mica'),
    ('s1-m4', 'harta-casei-diy'),
    ('s2-m1', 'carafa-mica'),
    ('s2-m2', 'bile-pahare-montessori'),
    ('s2-m3', 'set-plaja-dantoy'),
    ('s2-m4', 'carte-aparate-electrice'),
    ('s2-m5', 'carte-soare-vant-ploaie'),
    ('s3-m1', 'percutie-hape'),
    ('s3-m2', 'cilindri-sonori'),
    ('s3-m3', 'carte-vanatoare-ursi'),
    ('s3-m4', 'cartonase-sunete-diy'),
    ('s4-m1', 'rama-velcro'),
    ('s4-m2', 'placa-incuietori'),
    ('s4-m3', 'pensete-colorate'),
    ('s4-m4', 'suruburi-piulite-mari'),
    ('s4-m5', 'aluat-de-sare-diy')
) as k(id, cheie)
where m.id = k.id and m.banda = '2-3' and m.produs_cheie is null;

-- 2. Stocul familiei.
create table if not exists public.stoc_materiale (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families (id) on delete cascade,
  nume text not null check (length(btrim(nume)) between 1 and 200),
  tip text not null check (tip in ('cumparat', 'facut_acasa')),
  categorie text not null check (categorie in (
    'carti', 'sortare', 'motricitate_fina', 'miscare', 'senzorial',
    'apa_nisip', 'arta', 'natura', 'viata_practica', 'joc_rol'
  )),
  produs_cheie text,
  material_id text references public.materiale (id) on delete set null,
  stare text not null default 'bun' check (stare in ('bun', 'uzat', 'de_reparat', 'pierdut')),
  loc text,
  varsta_min_luni int check (varsta_min_luni between 0 and 144),
  varsta_max_luni int check (varsta_max_luni between 0 and 144),
  poza_url text,
  sursa text not null default 'manual' check (sursa in ('manual', 'lista_inceput', 'din_activitate')),
  data date,
  pret_platit numeric(10, 2) check (pret_platit >= 0),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (varsta_min_luni is null or varsta_max_luni is null or varsta_min_luni <= varsta_max_luni)
);
comment on column public.stoc_materiale.poza_url is
  'Calea în bucketul privat stoc-familie: {family_id}/{id}.jpg. Niciodată link public.';

create index if not exists stoc_materiale_family_idx on public.stoc_materiale (family_id, categorie);
create index if not exists stoc_materiale_cheie_idx on public.stoc_materiale (family_id, produs_cheie);

create or replace function public.stoc_materiale_touch()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists stoc_materiale_touch on public.stoc_materiale;
create trigger stoc_materiale_touch
  before update on public.stoc_materiale
  for each row execute function public.stoc_materiale_touch();

-- „Folosesc asta aici”: legătura articol ↔ activitate. Nu atinge completions.
create table if not exists public.stoc_folosiri (
  id uuid primary key default gen_random_uuid(),
  stoc_id uuid not null references public.stoc_materiale (id) on delete cascade,
  activity_id text not null references public.activities (id),
  family_id uuid not null references public.families (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (stoc_id, activity_id)
);
create index if not exists stoc_folosiri_family_idx on public.stoc_folosiri (family_id, created_at);

-- 3. RLS: doar părintele familiei citește și scrie. Nimic pentru anon.
alter table public.stoc_materiale enable row level security;
alter table public.stoc_folosiri enable row level security;

drop policy if exists stoc_materiale_select_own on public.stoc_materiale;
create policy stoc_materiale_select_own on public.stoc_materiale for select to authenticated
  using (family_id in (select f.id from public.families f where f.parent_id = (select auth.uid())));
drop policy if exists stoc_materiale_insert_own on public.stoc_materiale;
create policy stoc_materiale_insert_own on public.stoc_materiale for insert to authenticated
  with check (family_id in (select f.id from public.families f where f.parent_id = (select auth.uid())));
drop policy if exists stoc_materiale_update_own on public.stoc_materiale;
create policy stoc_materiale_update_own on public.stoc_materiale for update to authenticated
  using (family_id in (select f.id from public.families f where f.parent_id = (select auth.uid())))
  with check (family_id in (select f.id from public.families f where f.parent_id = (select auth.uid())));
drop policy if exists stoc_materiale_delete_own on public.stoc_materiale;
create policy stoc_materiale_delete_own on public.stoc_materiale for delete to authenticated
  using (family_id in (select f.id from public.families f where f.parent_id = (select auth.uid())));

drop policy if exists stoc_folosiri_select_own on public.stoc_folosiri;
create policy stoc_folosiri_select_own on public.stoc_folosiri for select to authenticated
  using (family_id in (select f.id from public.families f where f.parent_id = (select auth.uid())));
drop policy if exists stoc_folosiri_insert_own on public.stoc_folosiri;
create policy stoc_folosiri_insert_own on public.stoc_folosiri for insert to authenticated
  with check (
    family_id in (select f.id from public.families f where f.parent_id = (select auth.uid()))
    and stoc_id in (select s.id from public.stoc_materiale s where s.family_id = stoc_folosiri.family_id)
  );
drop policy if exists stoc_folosiri_delete_own on public.stoc_folosiri;
create policy stoc_folosiri_delete_own on public.stoc_folosiri for delete to authenticated
  using (family_id in (select f.id from public.families f where f.parent_id = (select auth.uid())));

revoke all on public.stoc_materiale from anon, authenticated;
revoke all on public.stoc_folosiri from anon, authenticated;
grant select, insert, update, delete on public.stoc_materiale to authenticated;
grant select, insert, delete on public.stoc_folosiri to authenticated;

-- 4. Pozele: bucket privat, doar JPEG, cale {family_id}/{id}.jpg.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('stoc-familie', 'stoc-familie', false, 1048576, array['image/jpeg']::text[])
on conflict (id) do nothing;

drop policy if exists stoc_familie_select_own on storage.objects;
create policy stoc_familie_select_own on storage.objects for select to authenticated
  using (
    bucket_id = 'stoc-familie'
    and (storage.foldername(name))[1] in (select f.id::text from public.families f where f.parent_id = (select auth.uid()))
  );
drop policy if exists stoc_familie_insert_own on storage.objects;
create policy stoc_familie_insert_own on storage.objects for insert to authenticated
  with check (
    bucket_id = 'stoc-familie'
    and storage.extension(name) = 'jpg'
    and (storage.foldername(name))[1] in (select f.id::text from public.families f where f.parent_id = (select auth.uid()))
  );
drop policy if exists stoc_familie_update_own on storage.objects;
create policy stoc_familie_update_own on storage.objects for update to authenticated
  using (
    bucket_id = 'stoc-familie'
    and (storage.foldername(name))[1] in (select f.id::text from public.families f where f.parent_id = (select auth.uid()))
  )
  with check (
    bucket_id = 'stoc-familie'
    and storage.extension(name) = 'jpg'
    and (storage.foldername(name))[1] in (select f.id::text from public.families f where f.parent_id = (select auth.uid()))
  );
drop policy if exists stoc_familie_delete_own on storage.objects;
create policy stoc_familie_delete_own on storage.objects for delete to authenticated
  using (
    bucket_id = 'stoc-familie'
    and (storage.foldername(name))[1] in (select f.id::text from public.families f where f.parent_id = (select auth.uid()))
  );
