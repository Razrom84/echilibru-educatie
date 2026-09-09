-- Cezar growth archive: one civil-day snapshot per child + private photo bucket.
-- Age-band label and done titles are copied at write time; do not join live curriculum.

create table public.archive_days (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children (id) on delete cascade,
  civil_date date not null,
  age_band_label text not null,
  day_note text not null default '',
  done_titles text[] not null default '{}',
  photo_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint archive_days_child_civil_date_key unique (child_id, civil_date)
);

create index archive_days_child_date_idx
  on public.archive_days (child_id, civil_date);

comment on table public.archive_days is
  'Growth archive snapshot per child × Europe/Bucharest civil date. Band label and done titles are frozen at write.';

comment on column public.archive_days.civil_date is
  'Civil calendar date in Europe/Bucharest (YYYY-MM-DD).';

comment on column public.archive_days.age_band_label is
  'Copy of the age-band label at first write. Later live band changes do not rewrite this.';

comment on column public.archive_days.day_note is
  'Copy of the day note at last write. Empty string = no note.';

comment on column public.archive_days.done_titles is
  'Activity titles marked done on this civil date, copied at write. Not a live catalog join.';

comment on column public.archive_days.photo_path is
  'Private storage path in archive-photos. Null = no photo. JPEG only.';

alter table public.archive_days enable row level security;

create policy archive_days_select_own
  on public.archive_days for select to authenticated
  using (
    child_id in (
      select c.id
      from public.children c
      join public.families f on f.id = c.family_id
      where f.parent_id = auth.uid()
    )
  );

create policy archive_days_insert_own
  on public.archive_days for insert to authenticated
  with check (
    child_id in (
      select c.id
      from public.children c
      join public.families f on f.id = c.family_id
      where f.parent_id = auth.uid()
    )
  );

create policy archive_days_update_own
  on public.archive_days for update to authenticated
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

create policy archive_days_delete_own
  on public.archive_days for delete to authenticated
  using (
    child_id in (
      select c.id
      from public.children c
      join public.families f on f.id = c.family_id
      where f.parent_id = auth.uid()
    )
  );

-- Yearly booklet mail uses the same idempotent send log.
alter table public.mail_digest_sends
  drop constraint if exists mail_digest_sends_kind_check;

alter table public.mail_digest_sends
  add constraint mail_digest_sends_kind_check
  check (kind in ('weekly', 'monthly', 'yearly'));

comment on table public.mail_digest_sends is
  'Idempotent archive-mail log. period_key is weekly:{yearStart}:S#, monthly:YYYY-MM, yearly:YYYY (test:… for QA).';

-- Private photo store. Not public. JPEG only after browser compression.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'archive-photos',
  'archive-photos',
  false,
  1048576,
  array['image/jpeg']::text[]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Path: {child_id}/{yyyy-mm-dd}.jpg — parent sees only own children.
create policy archive_photos_select_own
  on storage.objects for select to authenticated
  using (
    bucket_id = 'archive-photos'
    and (storage.foldername(name))[1] in (
      select c.id::text
      from public.children c
      join public.families f on f.id = c.family_id
      where f.parent_id = auth.uid()
    )
  );

create policy archive_photos_insert_own
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'archive-photos'
    and storage.extension(name) = 'jpg'
    and (storage.foldername(name))[1] in (
      select c.id::text
      from public.children c
      join public.families f on f.id = c.family_id
      where f.parent_id = auth.uid()
    )
  );

create policy archive_photos_update_own
  on storage.objects for update to authenticated
  using (
    bucket_id = 'archive-photos'
    and (storage.foldername(name))[1] in (
      select c.id::text
      from public.children c
      join public.families f on f.id = c.family_id
      where f.parent_id = auth.uid()
    )
  )
  with check (
    bucket_id = 'archive-photos'
    and storage.extension(name) = 'jpg'
    and (storage.foldername(name))[1] in (
      select c.id::text
      from public.children c
      join public.families f on f.id = c.family_id
      where f.parent_id = auth.uid()
    )
  );

create policy archive_photos_delete_own
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'archive-photos'
    and (storage.foldername(name))[1] in (
      select c.id::text
      from public.children c
      join public.families f on f.id = c.family_id
      where f.parent_id = auth.uid()
    )
  );
