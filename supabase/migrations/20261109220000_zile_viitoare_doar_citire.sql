-- T3 — o zi care încă n-a venit nu se poate scrie, nici pe lângă ecran.
--
-- MannyQ o rulează. Nu e rulată din acest PR.
-- A doua rulare înlocuiește funcția și recreează declanșatoarele.
--
-- Data zilei, pe tabel:
--   completions.completed_at  — moment; ziua e data lui în Europe/Bucharest
--   day_notes                 — nu are coloană de dată; ziua se calculează din
--                               program_year_start (lunea anului) + săptămâna + ziua
--                               săptămânii, la fel ca în program
--   archive_days.civil_date   — data civilă a zilei, inclusiv fotografia
--   storage.objects           — fișierul din archive-photos,
--                               calea {copil}/{YYYY-MM-DD}.jpg
--
-- Se resping inserarea și actualizarea. Ștergerea rămâne permisă.
-- „Azi” este (now() at time zone 'Europe/Bucharest')::date.

create or replace function public.reject_future_bucharest_day()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  civil date;
  today date := (now() at time zone 'Europe/Bucharest')::date;
begin
  if tg_table_name = 'completions' then
    civil := (new.completed_at at time zone 'Europe/Bucharest')::date;
  elsif tg_table_name = 'day_notes' then
    civil := new.program_year_start
      + ((new.week_number - 1) * 7 + (new.day_of_week - 1));
  elsif tg_table_name = 'archive_days' then
    civil := new.civil_date;
  else
    raise exception 'Nu știu să citesc ziua din tabelul %.', tg_table_name;
  end if;

  if civil is null or civil > today then
    raise exception 'Ziua n-a venit încă. Deocamdată o poți doar citi.'
      using errcode = '23514';
  end if;

  return new;
end;
$$;

comment on function public.reject_future_bucharest_day() is
  'Respinge scrierea unei zile de după azi, ora României.';

drop trigger if exists completions_reject_future_day on public.completions;
create trigger completions_reject_future_day
  before insert or update on public.completions
  for each row
  execute function public.reject_future_bucharest_day();

drop trigger if exists day_notes_reject_future_day on public.day_notes;
create trigger day_notes_reject_future_day
  before insert or update on public.day_notes
  for each row
  execute function public.reject_future_bucharest_day();

drop trigger if exists archive_days_reject_future_day on public.archive_days;
create trigger archive_days_reject_future_day
  before insert or update on public.archive_days
  for each row
  execute function public.reject_future_bucharest_day();

create or replace function public.reject_future_archive_photo()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  photo_day date;
  today date := (now() at time zone 'Europe/Bucharest')::date;
begin
  if new.bucket_id is distinct from 'archive-photos' then
    return new;
  end if;

  photo_day := substring(new.name from '(\d{4}-\d{2}-\d{2})')::date;
  if photo_day is null or photo_day > today then
    raise exception 'Ziua n-a venit încă. Deocamdată o poți doar citi.'
      using errcode = '23514';
  end if;

  return new;
end;
$$;

comment on function public.reject_future_archive_photo() is
  'Respinge încărcarea unei fotografii pentru o zi de după azi, ora României.';

drop trigger if exists archive_photos_reject_future_day on storage.objects;
create trigger archive_photos_reject_future_day
  before insert or update on storage.objects
  for each row
  execute function public.reject_future_archive_photo();
