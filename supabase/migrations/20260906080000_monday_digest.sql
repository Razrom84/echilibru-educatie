-- V1.3: Monday digest (weekly + first-Monday monthly).
-- Toggle on families; idempotent send log per (family, period_key).

alter table public.families
  add column if not exists monday_digest_email boolean not null default true;

comment on column public.families.monday_digest_email is
  'Raport luni pe email. Default on. Cron skips the family when false.';

create table if not exists public.mail_digest_sends (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families (id) on delete cascade,
  period_key text not null,
  kind text not null check (kind in ('weekly', 'monthly')),
  sent_at timestamptz not null default now(),
  constraint mail_digest_sends_family_period_key unique (family_id, period_key)
);

create index if not exists mail_digest_sends_family_idx
  on public.mail_digest_sends (family_id);

comment on table public.mail_digest_sends is
  'Idempotent Monday digest log. period_key is weekly:{yearStart}:S# or monthly:YYYY-MM (test:… for QA).';

alter table public.mail_digest_sends enable row level security;

create policy mail_digest_sends_select_own
  on public.mail_digest_sends for select to authenticated
  using (
    family_id in (select id from public.families where parent_id = auth.uid())
  );

create policy mail_digest_sends_insert_own
  on public.mail_digest_sends for insert to authenticated
  with check (
    family_id in (select id from public.families where parent_id = auth.uid())
  );
