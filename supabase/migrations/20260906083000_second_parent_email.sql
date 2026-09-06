-- V1.3: optional second-parent email, CC on Monday digests.

alter table public.families
  add column if not exists second_parent_email text;

comment on column public.families.second_parent_email is
  'Email al doilea părinte (opțional). CC on weekly/monthly digest. Empty = no CC.';
