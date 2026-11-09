-- T1 — bifele, notele, zilele de arhivă și fotografiile țin de copil.
--
-- MannyQ o rulează pe o copie a bazei Familie, nu din acest PR.
-- Înainte și după: scripts/verify-child-scope-counts.sql
--
-- Ce face:
--   * rândurile care au deja copil rămân la copilul lor;
--   * rândurile fără copil, dacă în copie e o singură familie, ajung la copilul
--     activ când e singurul, altfel la primul (după data creării, apoi id);
--   * dacă sunt mai multe familii, nu ghicim familia și lăsăm rândurile nemișcate,
--     cu un mesaj în jurnal;
--   * o bifă dublată (aceeași activitate, deja la copil) se strânge într-un singur
--     rând, fără să dispară bifa;
--   * rularea a doua oară nu mai mută nimic.

do $migration$
declare
  family_count integer;
  owner uuid;
  owner_name text;
  active_count integer;
  rec record;
  existing_id uuid;
  assigned_completions bigint := 0;
  folded_completions bigint := 0;
  assigned_notes bigint := 0;
  folded_notes bigint := 0;
  assigned_days bigint := 0;
  folded_days bigint := 0;
  completions_before bigint;
  completions_after bigint;
  notes_before bigint;
  notes_after bigint;
  days_before bigint;
  days_after bigint;
  several boolean;
begin
  select count(*) into completions_before from public.completions;
  select count(*) into notes_before from public.day_notes;
  select count(*) into days_before from public.archive_days;

  create temp table t1_completion_owners on commit drop as
  select id, child_id
  from public.completions
  where child_id is not null;

  create temp table t1_note_owners on commit drop as
  select id, child_id
  from public.day_notes
  where child_id is not null;

  create temp table t1_day_owners on commit drop as
  select id, child_id
  from public.archive_days
  where child_id is not null;

  create temp table t1_activity_ticks on commit drop as
  select distinct activity_id
  from public.completions;

  select count(distinct family_id) into family_count
  from public.children;

  if family_count = 1
     and (
       exists (select 1 from public.completions where child_id is null)
       or exists (select 1 from public.day_notes where child_id is null)
       or exists (select 1 from public.archive_days where child_id is null)
     )
  then
    select count(*) into active_count
    from public.children
    where active;

    if active_count > 0 then
      select c.id, c.name
        into owner, owner_name
      from public.children c
      where c.active
      order by c.created_at asc, c.id asc
      limit 1;
      several := active_count > 1;
    else
      select c.id, c.name
        into owner, owner_name
      from public.children c
      order by c.created_at asc, c.id asc
      limit 1;
      several := (select count(*) from public.children) > 1;
    end if;

    if owner is null then
      raise notice 'Sunt rânduri fără copil, dar familia nu are niciun copil. Le-am lăsat nemișcate.';
    else
      owner_name := coalesce(nullif(btrim(owner_name), ''), 'copilul din familie');
      for rec in
        select id, activity_id, parent_approved
        from public.completions
        where child_id is null
        order by completed_at asc, id asc
      loop
        select id into existing_id
        from public.completions
        where child_id = owner
          and activity_id = rec.activity_id
        limit 1;

        if existing_id is null then
          update public.completions
          set child_id = owner
          where id = rec.id;
          assigned_completions := assigned_completions + 1;
        else
          update public.completions
          set parent_approved = coalesce(parent_approved, rec.parent_approved)
          where id = existing_id
            and parent_approved is null
            and rec.parent_approved is not null;
          delete from public.completions where id = rec.id;
          folded_completions := folded_completions + 1;
        end if;
      end loop;

      for rec in
        select id, program_year_start, week_number, day_of_week, body
        from public.day_notes
        where child_id is null
        order by updated_at asc nulls first, id asc
      loop
        select id into existing_id
        from public.day_notes
        where child_id = owner
          and program_year_start = rec.program_year_start
          and week_number = rec.week_number
          and day_of_week = rec.day_of_week
        limit 1;

        if existing_id is null then
          update public.day_notes
          set child_id = owner
          where id = rec.id;
          assigned_notes := assigned_notes + 1;
        else
          update public.day_notes d
          set body = case
            when btrim(coalesce(d.body, '')) = '' then coalesce(rec.body, '')
            when btrim(coalesce(rec.body, '')) = '' then d.body
            when position(rec.body in d.body) > 0 then d.body
            else d.body || E'\n' || rec.body
          end
          where d.id = existing_id;
          delete from public.day_notes where id = rec.id;
          folded_notes := folded_notes + 1;
        end if;
      end loop;

      for rec in
        select id, civil_date, day_note, done_titles, photo_path
        from public.archive_days
        where child_id is null
        order by updated_at asc nulls first, id asc
      loop
        select id into existing_id
        from public.archive_days
        where child_id = owner
          and civil_date = rec.civil_date
        limit 1;

        if existing_id is null then
          update public.archive_days
          set child_id = owner
          where id = rec.id;
          assigned_days := assigned_days + 1;
          if rec.photo_path is not null
             and rec.photo_path not like (owner::text || '/%')
          then
            raise notice 'Fotografia din % nu stă în dosarul copilului %. Fișierul rămâne în stocare; verifică calea.',
              rec.photo_path, owner_name;
          end if;
        else
          update public.archive_days d
          set
            day_note = case
              when btrim(coalesce(d.day_note, '')) = '' then coalesce(rec.day_note, '')
              when btrim(coalesce(rec.day_note, '')) = '' then d.day_note
              when position(rec.day_note in d.day_note) > 0 then d.day_note
              else d.day_note || E'\n' || rec.day_note
            end,
            done_titles = (
              select coalesce(array_agg(title), '{}')
              from (
                select distinct btrim(title) as title
                from unnest(
                  coalesce(d.done_titles, '{}'::text[])
                  || coalesce(rec.done_titles, '{}'::text[])
                ) as title
                where btrim(title) <> ''
              ) titles
            ),
            photo_path = coalesce(d.photo_path, rec.photo_path)
          where d.id = existing_id;
          if rec.photo_path is not null
             and rec.photo_path is distinct from (
               select photo_path from public.archive_days where id = existing_id
             )
          then
            raise notice 'Pentru ziua % copilul avea deja o fotografie. Cealaltă cale, %, rămâne doar în jurnal.',
              rec.civil_date, rec.photo_path;
          end if;
          delete from public.archive_days where id = rec.id;
          folded_days := folded_days + 1;
        end if;
      end loop;

      if several then
        if assigned_completions > 0 then
          raise notice 'Bifele vechi, fără copil, au fost puse la primul copil, %. În familie sunt mai mulți copii; verifică dacă acolo le vrei.',
            owner_name;
        end if;
        if assigned_notes > 0 then
          raise notice 'Notele vechi, fără copil, au fost puse la primul copil, %. În familie sunt mai mulți copii; verifică dacă acolo le vrei.',
            owner_name;
        end if;
        if assigned_days > 0 then
          raise notice 'Zilele de arhivă vechi, fără copil, au fost puse la primul copil, %. În familie sunt mai mulți copii; verifică dacă acolo le vrei.',
            owner_name;
        end if;
      else
        if assigned_completions > 0 then
          raise notice 'Bifele vechi, fără copil, au fost puse la %.', owner_name;
        end if;
        if assigned_notes > 0 then
          raise notice 'Notele vechi, fără copil, au fost puse la %.', owner_name;
        end if;
        if assigned_days > 0 then
          raise notice 'Zilele de arhivă vechi, fără copil, au fost puse la %.', owner_name;
        end if;
      end if;

      if folded_completions > 0 then
        raise notice 'Am strâns % bife dublate la același copil. Bifa rămâne.', folded_completions;
      end if;
      if folded_notes > 0 then
        raise notice 'Am strâns % note dublate la același copil. Textul rămâne.', folded_notes;
      end if;
      if folded_days > 0 then
        raise notice 'Am strâns % zile de arhivă dublate la același copil. Conținutul rămâne.', folded_days;
      end if;
    end if;
  elsif family_count > 1
    and (
      exists (select 1 from public.completions where child_id is null)
      or exists (select 1 from public.day_notes where child_id is null)
      or exists (select 1 from public.archive_days where child_id is null)
    )
  then
    raise notice 'Sunt rânduri fără copil, dar în copie sunt mai multe familii. Nu le-am mutat, ca să nu ajungă la altcineva.';
  end if;

  if exists (
    select 1
    from t1_completion_owners previous
    join public.completions current on current.id = previous.id
    where current.child_id is distinct from previous.child_id
  ) then
    raise exception 'Migrarea a mutat bife care aveau deja copil. Nu o aplic.';
  end if;

  if exists (
    select 1
    from t1_note_owners previous
    join public.day_notes current on current.id = previous.id
    where current.child_id is distinct from previous.child_id
  ) then
    raise exception 'Migrarea a mutat note care aveau deja copil. Nu o aplic.';
  end if;

  if exists (
    select 1
    from t1_day_owners previous
    join public.archive_days current on current.id = previous.id
    where current.child_id is distinct from previous.child_id
  ) then
    raise exception 'Migrarea a mutat zile de arhivă care aveau deja copil. Nu o aplic.';
  end if;

  if exists (
    select activity_id from t1_activity_ticks
    except
    select activity_id from public.completions
  ) then
    raise exception 'Migrarea a pierdut bife. Nu o aplic.';
  end if;

  select count(*) into completions_after from public.completions;
  select count(*) into notes_after from public.day_notes;
  select count(*) into days_after from public.archive_days;

  if completions_after + folded_completions <> completions_before
     or notes_after + folded_notes <> notes_before
     or days_after + folded_days <> days_before
  then
    raise exception
      'Numerele nu se închid. Bife %→% (strânse %), note %→% (strânse %), zile %→% (strânse %).',
      completions_before, completions_after, folded_completions,
      notes_before, notes_after, folded_notes,
      days_before, days_after, folded_days;
  end if;

  raise notice 'Verificare: bife % înainte, % după (fără copil: %). Note % înainte, % după (fără copil: %). Zile % înainte, % după (fără copil: %).',
    completions_before,
    completions_after,
    (select count(*) from public.completions where child_id is null),
    notes_before,
    notes_after,
    (select count(*) from public.day_notes where child_id is null),
    days_before,
    days_after,
    (select count(*) from public.archive_days where child_id is null);
end
$migration$;

do $constraint$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.completions'::regclass
      and contype = 'u'
      and pg_get_constraintdef(oid) like '%(child_id, activity_id)%'
  ) then
    if exists (
      select 1
      from public.completions
      where child_id is not null
      group by child_id, activity_id
      having count(*) > 1
    ) then
      raise notice 'Nu am putut întări regula „o bifă pe copil și activitate”: există dubluri. Nu am șters nimic.';
    else
      alter table public.completions
        add constraint completions_child_id_activity_id_key unique (child_id, activity_id);
    end if;
  end if;
end
$constraint$;
