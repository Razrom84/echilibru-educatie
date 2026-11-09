-- T5b: înălțime, masă, S25 vineri, S36 joi și corecturile D.
-- Fiecare scriere cere id-ul, banda și textul vechi din live (după T4).
-- Dacă textul e deja cel nou, operațiunea nu schimbă nimic și nu dă eroare.
-- Orice alt text oprește migrarea, iar tranzacția nu lasă nicio modificare.
-- Nu se aplică pe Familie din acest PR.

do $$
declare
  op record;
  cur text;
  cur_pasi text[];
  n int;
begin

  select pasi[1] into cur from public.activities
  where id = 's9-2-3-z1-mental' and banda = '1-2';
  if not found then
    raise exception 'T5b: id lipsă din banda așteptată: % (%)', 's9-2-3-z1-mental', '1-2';
  end if;
  if cur is distinct from 'Stați pe loc afară sau la fereastră deschisă. Țineți-l în brațe sau de mână.' then
    if cur is distinct from 'Stați pe loc afară sau la fereastră deschisă.' then
      raise exception 'T5b: % (%) pasul 1 nu e textul live și nici cel nou: %', 's9-2-3-z1-mental', '1-2', cur;
    end if;
    update public.activities
    set pasi = case
      when 1 = 1 then array['Stați pe loc afară sau la fereastră deschisă. Țineți-l în brațe sau de mână.'] || pasi[2:cardinality(pasi)]
      else pasi[1:0] || array['Stați pe loc afară sau la fereastră deschisă. Țineți-l în brațe sau de mână.'] || pasi[2:cardinality(pasi)]
    end
    where id = 's9-2-3-z1-mental' and banda = '1-2';
  end if;


  select pasi[1] into cur from public.activities
  where id = 's1-b23-z2-fizic' and banda = '2-3';
  if not found then
    raise exception 'T5b: id lipsă din banda așteptată: % (%)', 's1-b23-z2-fizic', '2-3';
  end if;
  if cur is distinct from 'Mergeți la o zonă (de exemplu iarbă sau hol), stați 20 de secunde. Pe balcon, țineți-l de mână.' then
    if cur is distinct from 'Mergeți la o zonă (de exemplu iarbă sau hol), stați 20 de secunde.' then
      raise exception 'T5b: % (%) pasul 1 nu e textul live și nici cel nou: %', 's1-b23-z2-fizic', '2-3', cur;
    end if;
    update public.activities
    set pasi = case
      when 1 = 1 then array['Mergeți la o zonă (de exemplu iarbă sau hol), stați 20 de secunde. Pe balcon, țineți-l de mână.'] || pasi[2:cardinality(pasi)]
      else pasi[1:0] || array['Mergeți la o zonă (de exemplu iarbă sau hol), stați 20 de secunde. Pe balcon, țineți-l de mână.'] || pasi[2:cardinality(pasi)]
    end
    where id = 's1-b23-z2-fizic' and banda = '2-3';
  end if;


  select pasi[1] into cur from public.activities
  where id = 's3-b23-z1-fizic' and banda = '2-3';
  if not found then
    raise exception 'T5b: id lipsă din banda așteptată: % (%)', 's3-b23-z1-fizic', '2-3';
  end if;
  if cur is distinct from 'Ieșiți scurt; stați pe loc și ascultați aproximativ 1–2 minute. Pe balcon, țineți-l de mână.' then
    if cur is distinct from 'Ieșiți scurt; stați pe loc și ascultați aproximativ 1–2 minute.' then
      raise exception 'T5b: % (%) pasul 1 nu e textul live și nici cel nou: %', 's3-b23-z1-fizic', '2-3', cur;
    end if;
    update public.activities
    set pasi = case
      when 1 = 1 then array['Ieșiți scurt; stați pe loc și ascultați aproximativ 1–2 minute. Pe balcon, țineți-l de mână.'] || pasi[2:cardinality(pasi)]
      else pasi[1:0] || array['Ieșiți scurt; stați pe loc și ascultați aproximativ 1–2 minute. Pe balcon, țineți-l de mână.'] || pasi[2:cardinality(pasi)]
    end
    where id = 's3-b23-z1-fizic' and banda = '2-3';
  end if;


  select pasi[1] into cur from public.activities
  where id = 's5-b23-z6-fizic' and banda = '2-3';
  if not found then
    raise exception 'T5b: id lipsă din banda așteptată: % (%)', 's5-b23-z6-fizic', '2-3';
  end if;
  if cur is distinct from 'Stați afară sau la fereastră 30–60 de secunde. Rămâneți lângă el; pe balcon sau la fereastră deschisă, țineți-l de mână.' then
    if cur is distinct from 'Stați afară sau la fereastră 30–60 de secunde.' then
      raise exception 'T5b: % (%) pasul 1 nu e textul live și nici cel nou: %', 's5-b23-z6-fizic', '2-3', cur;
    end if;
    update public.activities
    set pasi = case
      when 1 = 1 then array['Stați afară sau la fereastră 30–60 de secunde. Rămâneți lângă el; pe balcon sau la fereastră deschisă, țineți-l de mână.'] || pasi[2:cardinality(pasi)]
      else pasi[1:0] || array['Stați afară sau la fereastră 30–60 de secunde. Rămâneți lângă el; pe balcon sau la fereastră deschisă, țineți-l de mână.'] || pasi[2:cardinality(pasi)]
    end
    where id = 's5-b23-z6-fizic' and banda = '2-3';
  end if;


  select pasi[1] into cur from public.activities
  where id = 's9-b23-z5-fizic' and banda = '2-3';
  if not found then
    raise exception 'T5b: id lipsă din banda așteptată: % (%)', 's9-b23-z5-fizic', '2-3';
  end if;
  if cur is distinct from 'Parcurgeți: de la interior până la ușă/fereastră deschisă. La fereastră, țineți-l de mână.' then
    if cur is distinct from 'Parcurgeți: de la interior până la ușă/fereastră deschisă.' then
      raise exception 'T5b: % (%) pasul 1 nu e textul live și nici cel nou: %', 's9-b23-z5-fizic', '2-3', cur;
    end if;
    update public.activities
    set pasi = case
      when 1 = 1 then array['Parcurgeți: de la interior până la ușă/fereastră deschisă. La fereastră, țineți-l de mână.'] || pasi[2:cardinality(pasi)]
      else pasi[1:0] || array['Parcurgeți: de la interior până la ușă/fereastră deschisă. La fereastră, țineți-l de mână.'] || pasi[2:cardinality(pasi)]
    end
    where id = 's9-b23-z5-fizic' and banda = '2-3';
  end if;


  select pasi[1] into cur from public.activities
  where id = 's9-b23-z6-fizic' and banda = '2-3';
  if not found then
    raise exception 'T5b: id lipsă din banda așteptată: % (%)', 's9-b23-z6-fizic', '2-3';
  end if;
  if cur is distinct from 'Stați afară sau la fereastră 30–60 de secunde. Rămâneți lângă el; pe balcon sau la fereastră deschisă, țineți-l de mână.' then
    if cur is distinct from 'Stați afară sau la fereastră 30–60 de secunde.' then
      raise exception 'T5b: % (%) pasul 1 nu e textul live și nici cel nou: %', 's9-b23-z6-fizic', '2-3', cur;
    end if;
    update public.activities
    set pasi = case
      when 1 = 1 then array['Stați afară sau la fereastră 30–60 de secunde. Rămâneți lângă el; pe balcon sau la fereastră deschisă, țineți-l de mână.'] || pasi[2:cardinality(pasi)]
      else pasi[1:0] || array['Stați afară sau la fereastră 30–60 de secunde. Rămâneți lângă el; pe balcon sau la fereastră deschisă, țineți-l de mână.'] || pasi[2:cardinality(pasi)]
    end
    where id = 's9-b23-z6-fizic' and banda = '2-3';
  end if;


  select pasi[1] into cur from public.activities
  where id = 's9-b23-z7-mental' and banda = '2-3';
  if not found then
    raise exception 'T5b: id lipsă din banda așteptată: % (%)', 's9-b23-z7-mental', '2-3';
  end if;
  if cur is distinct from 'Întrebați: „Îți place vântul sau liniștea?” — arătați ambele (fereastră deschisă / închisă). La fereastra deschisă, rămâneți lângă el.' then
    if cur is distinct from 'Întrebați: „Îți place vântul sau liniștea?” — arătați ambele (fereastră deschisă / închisă).' then
      raise exception 'T5b: % (%) pasul 1 nu e textul live și nici cel nou: %', 's9-b23-z7-mental', '2-3', cur;
    end if;
    update public.activities
    set pasi = case
      when 1 = 1 then array['Întrebați: „Îți place vântul sau liniștea?” — arătați ambele (fereastră deschisă / închisă). La fereastra deschisă, rămâneți lângă el.'] || pasi[2:cardinality(pasi)]
      else pasi[1:0] || array['Întrebați: „Îți place vântul sau liniștea?” — arătați ambele (fereastră deschisă / închisă). La fereastra deschisă, rămâneți lângă el.'] || pasi[2:cardinality(pasi)]
    end
    where id = 's9-b23-z7-mental' and banda = '2-3';
  end if;


  select pasi[1] into cur from public.activities
  where id = 's10-b23-z6-fizic' and banda = '2-3';
  if not found then
    raise exception 'T5b: id lipsă din banda așteptată: % (%)', 's10-b23-z6-fizic', '2-3';
  end if;
  if cur is distinct from 'Colectați 2–3 lucruri sigure (frunză, piatră mare, jucărie). Pe balcon, rămâneți lângă el.' then
    if cur is distinct from 'Colectați 2–3 lucruri sigure (frunză, piatră mică, jucărie).' then
      raise exception 'T5b: % (%) pasul 1 nu e textul live și nici cel nou: %', 's10-b23-z6-fizic', '2-3', cur;
    end if;
    update public.activities
    set pasi = case
      when 1 = 1 then array['Colectați 2–3 lucruri sigure (frunză, piatră mare, jucărie). Pe balcon, rămâneți lângă el.'] || pasi[2:cardinality(pasi)]
      else pasi[1:0] || array['Colectați 2–3 lucruri sigure (frunză, piatră mare, jucărie). Pe balcon, rămâneți lângă el.'] || pasi[2:cardinality(pasi)]
    end
    where id = 's10-b23-z6-fizic' and banda = '2-3';
  end if;


  select pasi[1] into cur from public.activities
  where id = 's12-b23-z6-fizic' and banda = '2-3';
  if not found then
    raise exception 'T5b: id lipsă din banda așteptată: % (%)', 's12-b23-z6-fizic', '2-3';
  end if;
  if cur is distinct from 'Ieșiți 20–30 de secunde: „Rece afară.” Pe balcon, țineți-l de mână.' then
    if cur is distinct from 'Ieșiți 20–30 de secunde: „Rece afară.”' then
      raise exception 'T5b: % (%) pasul 1 nu e textul live și nici cel nou: %', 's12-b23-z6-fizic', '2-3', cur;
    end if;
    update public.activities
    set pasi = case
      when 1 = 1 then array['Ieșiți 20–30 de secunde: „Rece afară.” Pe balcon, țineți-l de mână.'] || pasi[2:cardinality(pasi)]
      else pasi[1:0] || array['Ieșiți 20–30 de secunde: „Rece afară.” Pe balcon, țineți-l de mână.'] || pasi[2:cardinality(pasi)]
    end
    where id = 's12-b23-z6-fizic' and banda = '2-3';
  end if;


  select pasi[1] into cur from public.activities
  where id = 's13-b23-z6-fizic' and banda = '2-3';
  if not found then
    raise exception 'T5b: id lipsă din banda așteptată: % (%)', 's13-b23-z6-fizic', '2-3';
  end if;
  if cur is distinct from 'Îmbrăcați-l, ieșiți 20–30 de secunde: „Rece afară.” Pe balcon, țineți-l de mână.' then
    if cur is distinct from 'Îmbrăcați, ieșiți 20–30 de secunde: „Rece afară.”' then
      raise exception 'T5b: % (%) pasul 1 nu e textul live și nici cel nou: %', 's13-b23-z6-fizic', '2-3', cur;
    end if;
    update public.activities
    set pasi = case
      when 1 = 1 then array['Îmbrăcați-l, ieșiți 20–30 de secunde: „Rece afară.” Pe balcon, țineți-l de mână.'] || pasi[2:cardinality(pasi)]
      else pasi[1:0] || array['Îmbrăcați-l, ieșiți 20–30 de secunde: „Rece afară.” Pe balcon, țineți-l de mână.'] || pasi[2:cardinality(pasi)]
    end
    where id = 's13-b23-z6-fizic' and banda = '2-3';
  end if;


  select pasi[1] into cur from public.activities
  where id = 's14-b23-z6-fizic' and banda = '2-3';
  if not found then
    raise exception 'T5b: id lipsă din banda așteptată: % (%)', 's14-b23-z6-fizic', '2-3';
  end if;
  if cur is distinct from 'Mergeți liber 30–60 de secunde: „Mergem.” Pe balcon, rămâneți lângă el.' then
    if cur is distinct from 'Mergeți liber 30–60 de secunde: „Mergem.”' then
      raise exception 'T5b: % (%) pasul 1 nu e textul live și nici cel nou: %', 's14-b23-z6-fizic', '2-3', cur;
    end if;
    update public.activities
    set pasi = case
      when 1 = 1 then array['Mergeți liber 30–60 de secunde: „Mergem.” Pe balcon, rămâneți lângă el.'] || pasi[2:cardinality(pasi)]
      else pasi[1:0] || array['Mergeți liber 30–60 de secunde: „Mergem.” Pe balcon, rămâneți lângă el.'] || pasi[2:cardinality(pasi)]
    end
    where id = 's14-b23-z6-fizic' and banda = '2-3';
  end if;


  select pasi[1] into cur from public.activities
  where id = 's17-b23-z1-fizic' and banda = '2-3';
  if not found then
    raise exception 'T5b: id lipsă din banda așteptată: % (%)', 's17-b23-z1-fizic', '2-3';
  end if;
  if cur is distinct from 'Ieșiți împreună 2–3 minute. Stați pe loc: „Urechi. Ascultăm.” Pe balcon, țineți-l de mână.' then
    if cur is distinct from 'Ieșiți împreună 2–3 minute. Stați pe loc: „Urechi. Ascultăm.”' then
      raise exception 'T5b: % (%) pasul 1 nu e textul live și nici cel nou: %', 's17-b23-z1-fizic', '2-3', cur;
    end if;
    update public.activities
    set pasi = case
      when 1 = 1 then array['Ieșiți împreună 2–3 minute. Stați pe loc: „Urechi. Ascultăm.” Pe balcon, țineți-l de mână.'] || pasi[2:cardinality(pasi)]
      else pasi[1:0] || array['Ieșiți împreună 2–3 minute. Stați pe loc: „Urechi. Ascultăm.” Pe balcon, țineți-l de mână.'] || pasi[2:cardinality(pasi)]
    end
    where id = 's17-b23-z1-fizic' and banda = '2-3';
  end if;


  select pasi[1] into cur from public.activities
  where id = 's17-b23-z6-fizic' and banda = '2-3';
  if not found then
    raise exception 'T5b: id lipsă din banda așteptată: % (%)', 's17-b23-z6-fizic', '2-3';
  end if;
  if cur is distinct from 'Ieșiți 20–40 de secunde: „Uite. Ascultăm.” Pe balcon, țineți-l de mână.' then
    if cur is distinct from 'Ieșiți 20–40 de secunde: „Uite. Ascultăm.”' then
      raise exception 'T5b: % (%) pasul 1 nu e textul live și nici cel nou: %', 's17-b23-z6-fizic', '2-3', cur;
    end if;
    update public.activities
    set pasi = case
      when 1 = 1 then array['Ieșiți 20–40 de secunde: „Uite. Ascultăm.” Pe balcon, țineți-l de mână.'] || pasi[2:cardinality(pasi)]
      else pasi[1:0] || array['Ieșiți 20–40 de secunde: „Uite. Ascultăm.” Pe balcon, țineți-l de mână.'] || pasi[2:cardinality(pasi)]
    end
    where id = 's17-b23-z6-fizic' and banda = '2-3';
  end if;


  select pasi[1] into cur from public.activities
  where id = 's30-b23-z1-fizic' and banda = '2-3';
  if not found then
    raise exception 'T5b: id lipsă din banda așteptată: % (%)', 's30-b23-z1-fizic', '2-3';
  end if;
  if cur is distinct from 'Stați liniștiți: „Uite. Privim.” — 30–60 secunde. La fereastra deschisă, țineți-l de mână.' then
    if cur is distinct from 'Stați liniștiți: „Uite. Privim.” — 30–60 secunde.' then
      raise exception 'T5b: % (%) pasul 1 nu e textul live și nici cel nou: %', 's30-b23-z1-fizic', '2-3', cur;
    end if;
    update public.activities
    set pasi = case
      when 1 = 1 then array['Stați liniștiți: „Uite. Privim.” — 30–60 secunde. La fereastra deschisă, țineți-l de mână.'] || pasi[2:cardinality(pasi)]
      else pasi[1:0] || array['Stați liniștiți: „Uite. Privim.” — 30–60 secunde. La fereastra deschisă, țineți-l de mână.'] || pasi[2:cardinality(pasi)]
    end
    where id = 's30-b23-z1-fizic' and banda = '2-3';
  end if;


  select pasi[1] into cur from public.activities
  where id = 's41-b23-z6-fizic' and banda = '2-3';
  if not found then
    raise exception 'T5b: id lipsă din banda așteptată: % (%)', 's41-b23-z6-fizic', '2-3';
  end if;
  if cur is distinct from 'Mergeți liber 30–60 de secunde: „Mergem.” Pe balcon, rămâneți lângă el.' then
    if cur is distinct from 'Mergeți liber 30–60 de secunde: „Mergem.”' then
      raise exception 'T5b: % (%) pasul 1 nu e textul live și nici cel nou: %', 's41-b23-z6-fizic', '2-3', cur;
    end if;
    update public.activities
    set pasi = case
      when 1 = 1 then array['Mergeți liber 30–60 de secunde: „Mergem.” Pe balcon, rămâneți lângă el.'] || pasi[2:cardinality(pasi)]
      else pasi[1:0] || array['Mergeți liber 30–60 de secunde: „Mergem.” Pe balcon, rămâneți lângă el.'] || pasi[2:cardinality(pasi)]
    end
    where id = 's41-b23-z6-fizic' and banda = '2-3';
  end if;


  select pasi[1] into cur from public.activities
  where id = 's43-b23-z6-fizic' and banda = '2-3';
  if not found then
    raise exception 'T5b: id lipsă din banda așteptată: % (%)', 's43-b23-z6-fizic', '2-3';
  end if;
  if cur is distinct from 'Colectați 2–3 lucruri sigure (frunză, piatră mare, jucărie). Pe balcon, rămâneți lângă el.' then
    if cur is distinct from 'Colectați 2–3 lucruri sigure (frunză, piatră mică, jucărie).' then
      raise exception 'T5b: % (%) pasul 1 nu e textul live și nici cel nou: %', 's43-b23-z6-fizic', '2-3', cur;
    end if;
    update public.activities
    set pasi = case
      when 1 = 1 then array['Colectați 2–3 lucruri sigure (frunză, piatră mare, jucărie). Pe balcon, rămâneți lângă el.'] || pasi[2:cardinality(pasi)]
      else pasi[1:0] || array['Colectați 2–3 lucruri sigure (frunză, piatră mare, jucărie). Pe balcon, rămâneți lângă el.'] || pasi[2:cardinality(pasi)]
    end
    where id = 's43-b23-z6-fizic' and banda = '2-3';
  end if;


  select pasi[1] into cur from public.activities
  where id = 's51-b23-z1-fizic' and banda = '2-3';
  if not found then
    raise exception 'T5b: id lipsă din banda așteptată: % (%)', 's51-b23-z1-fizic', '2-3';
  end if;
  if cur is distinct from 'Mergeți pe drumul pe care îl știți: „Drum.” Pe balcon, rămâneți lângă el.' then
    if cur is distinct from 'Mergeți pe drum-ul pe care îl știți: „Drum.”' then
      raise exception 'T5b: % (%) pasul 1 nu e textul live și nici cel nou: %', 's51-b23-z1-fizic', '2-3', cur;
    end if;
    update public.activities
    set pasi = case
      when 1 = 1 then array['Mergeți pe drumul pe care îl știți: „Drum.” Pe balcon, rămâneți lângă el.'] || pasi[2:cardinality(pasi)]
      else pasi[1:0] || array['Mergeți pe drumul pe care îl știți: „Drum.” Pe balcon, rămâneți lângă el.'] || pasi[2:cardinality(pasi)]
    end
    where id = 's51-b23-z1-fizic' and banda = '2-3';
  end if;


  select pasi[1] into cur from public.activities
  where id = 's4-2-3-z4-resurse' and banda = '1-2';
  if not found then
    raise exception 'T5b: id lipsă din banda așteptată: % (%)', 's4-2-3-z4-resurse', '1-2';
  end if;
  if cur is distinct from 'Ștergeți masa cu mișcări scurte.' then
    if cur is distinct from 'Mișcări scurte.' then
      raise exception 'T5b: % (%) pasul 1 nu e textul live și nici cel nou: %', 's4-2-3-z4-resurse', '1-2', cur;
    end if;
    update public.activities
    set pasi = case
      when 1 = 1 then array['Ștergeți masa cu mișcări scurte.'] || pasi[2:cardinality(pasi)]
      else pasi[1:0] || array['Ștergeți masa cu mișcări scurte.'] || pasi[2:cardinality(pasi)]
    end
    where id = 's4-2-3-z4-resurse' and banda = '1-2';
  end if;


  select pasi[1] into cur from public.activities
  where id = 's15-2-3-z4-resurse' and banda = '1-2';
  if not found then
    raise exception 'T5b: id lipsă din banda așteptată: % (%)', 's15-2-3-z4-resurse', '1-2';
  end if;
  if cur is distinct from 'După masă, duceți paharul la chiuvetă împreună.' then
    if cur is distinct from 'Duceți paharul la chiuvetă împreună.' then
      raise exception 'T5b: % (%) pasul 1 nu e textul live și nici cel nou: %', 's15-2-3-z4-resurse', '1-2', cur;
    end if;
    update public.activities
    set pasi = case
      when 1 = 1 then array['După masă, duceți paharul la chiuvetă împreună.'] || pasi[2:cardinality(pasi)]
      else pasi[1:0] || array['După masă, duceți paharul la chiuvetă împreună.'] || pasi[2:cardinality(pasi)]
    end
    where id = 's15-2-3-z4-resurse' and banda = '1-2';
  end if;


  select pasi[1] into cur from public.activities
  where id = 's15-2-3-z4-social' and banda = '1-2';
  if not found then
    raise exception 'T5b: id lipsă din banda așteptată: % (%)', 's15-2-3-z4-social', '1-2';
  end if;
  if cur is distinct from 'La masă, după o înghițitură: „Mulțumesc.”' then
    if cur is distinct from 'După o înghițitură: „Mulțumesc.”' then
      raise exception 'T5b: % (%) pasul 1 nu e textul live și nici cel nou: %', 's15-2-3-z4-social', '1-2', cur;
    end if;
    update public.activities
    set pasi = case
      when 1 = 1 then array['La masă, după o înghițitură: „Mulțumesc.”'] || pasi[2:cardinality(pasi)]
      else pasi[1:0] || array['La masă, după o înghițitură: „Mulțumesc.”'] || pasi[2:cardinality(pasi)]
    end
    where id = 's15-2-3-z4-social' and banda = '1-2';
  end if;


  select pasi[1] into cur from public.activities
  where id = 's23-2-3-z1-resurse' and banda = '1-2';
  if not found then
    raise exception 'T5b: id lipsă din banda așteptată: % (%)', 's23-2-3-z1-resurse', '1-2';
  end if;
  if cur is distinct from 'Puneți pâinea pe masă. După mirosit, puneți-o la loc.' then
    if cur is distinct from 'Puneți pâinea la loc după mirosit.' then
      raise exception 'T5b: % (%) pasul 1 nu e textul live și nici cel nou: %', 's23-2-3-z1-resurse', '1-2', cur;
    end if;
    update public.activities
    set pasi = case
      when 1 = 1 then array['Puneți pâinea pe masă. După mirosit, puneți-o la loc.'] || pasi[2:cardinality(pasi)]
      else pasi[1:0] || array['Puneți pâinea pe masă. După mirosit, puneți-o la loc.'] || pasi[2:cardinality(pasi)]
    end
    where id = 's23-2-3-z1-resurse' and banda = '1-2';
  end if;


  select pasi[1] into cur from public.activities
  where id = 's46-2-3-z5-social' and banda = '1-2';
  if not found then
    raise exception 'T5b: id lipsă din banda așteptată: % (%)', 's46-2-3-z5-social', '1-2';
  end if;
  if cur is distinct from 'Voi arătați scaunul, apoi masa, pe scurt.' then
    if cur is distinct from 'Voi arătați scaunul pe scurt.' then
      raise exception 'T5b: % (%) pasul 1 nu e textul live și nici cel nou: %', 's46-2-3-z5-social', '1-2', cur;
    end if;
    update public.activities
    set pasi = case
      when 1 = 1 then array['Voi arătați scaunul, apoi masa, pe scurt.'] || pasi[2:cardinality(pasi)]
      else pasi[1:0] || array['Voi arătați scaunul, apoi masa, pe scurt.'] || pasi[2:cardinality(pasi)]
    end
    where id = 's46-2-3-z5-social' and banda = '1-2';
  end if;


  select pasi[1] into cur from public.activities
  where id = 's5-b23-z6-mental' and banda = '2-3';
  if not found then
    raise exception 'T5b: id lipsă din banda așteptată: % (%)', 's5-b23-z6-mental', '2-3';
  end if;
  if cur is distinct from 'Așezați trei pe masă: „Una. Două. Trei.” Numiți fiecare culoare.' then
    if cur is distinct from 'Așezați trei: „Una. Două. Trei.” Numiți fiecare culoare.' then
      raise exception 'T5b: % (%) pasul 1 nu e textul live și nici cel nou: %', 's5-b23-z6-mental', '2-3', cur;
    end if;
    update public.activities
    set pasi = case
      when 1 = 1 then array['Așezați trei pe masă: „Una. Două. Trei.” Numiți fiecare culoare.'] || pasi[2:cardinality(pasi)]
      else pasi[1:0] || array['Așezați trei pe masă: „Una. Două. Trei.” Numiți fiecare culoare.'] || pasi[2:cardinality(pasi)]
    end
    where id = 's5-b23-z6-mental' and banda = '2-3';
  end if;


  select pasi[1] into cur from public.activities
  where id = 's8-b23-z6-mental' and banda = '2-3';
  if not found then
    raise exception 'T5b: id lipsă din banda așteptată: % (%)', 's8-b23-z6-mental', '2-3';
  end if;
  if cur is distinct from 'Puneți-le pe masă și atingeți-le pe rând: „Frunză. Piatră. Pământ.”' then
    if cur is distinct from 'Atingeți pe rând: „Frunză. Piatră. Pământ.”' then
      raise exception 'T5b: % (%) pasul 1 nu e textul live și nici cel nou: %', 's8-b23-z6-mental', '2-3', cur;
    end if;
    update public.activities
    set pasi = case
      when 1 = 1 then array['Puneți-le pe masă și atingeți-le pe rând: „Frunză. Piatră. Pământ.”'] || pasi[2:cardinality(pasi)]
      else pasi[1:0] || array['Puneți-le pe masă și atingeți-le pe rând: „Frunză. Piatră. Pământ.”'] || pasi[2:cardinality(pasi)]
    end
    where id = 's8-b23-z6-mental' and banda = '2-3';
  end if;


  select pasi[1] into cur from public.activities
  where id = 's10-b23-z6-mental' and banda = '2-3';
  if not found then
    raise exception 'T5b: id lipsă din banda așteptată: % (%)', 's10-b23-z6-mental', '2-3';
  end if;
  if cur is distinct from 'Așezați pe masă: „Una. Două. Trei.” — trei grămezi.' then
    if cur is distinct from 'Așezați: „Una. Două. Trei.” — trei grămezi.' then
      raise exception 'T5b: % (%) pasul 1 nu e textul live și nici cel nou: %', 's10-b23-z6-mental', '2-3', cur;
    end if;
    update public.activities
    set pasi = case
      when 1 = 1 then array['Așezați pe masă: „Una. Două. Trei.” — trei grămezi.'] || pasi[2:cardinality(pasi)]
      else pasi[1:0] || array['Așezați pe masă: „Una. Două. Trei.” — trei grămezi.'] || pasi[2:cardinality(pasi)]
    end
    where id = 's10-b23-z6-mental' and banda = '2-3';
  end if;


  select pasi[1] into cur from public.activities
  where id = 's42-b23-z6-mental' and banda = '2-3';
  if not found then
    raise exception 'T5b: id lipsă din banda așteptată: % (%)', 's42-b23-z6-mental', '2-3';
  end if;
  if cur is distinct from 'Puneți-le pe masă și atingeți-le pe rând: „Frunză. Piatră. Pământ.”' then
    if cur is distinct from 'Atingeți pe rând: „Frunză. Piatră. Pământ.”' then
      raise exception 'T5b: % (%) pasul 1 nu e textul live și nici cel nou: %', 's42-b23-z6-mental', '2-3', cur;
    end if;
    update public.activities
    set pasi = case
      when 1 = 1 then array['Puneți-le pe masă și atingeți-le pe rând: „Frunză. Piatră. Pământ.”'] || pasi[2:cardinality(pasi)]
      else pasi[1:0] || array['Puneți-le pe masă și atingeți-le pe rând: „Frunză. Piatră. Pământ.”'] || pasi[2:cardinality(pasi)]
    end
    where id = 's42-b23-z6-mental' and banda = '2-3';
  end if;


  select pasi[1] into cur from public.activities
  where id = 's43-b23-z6-mental' and banda = '2-3';
  if not found then
    raise exception 'T5b: id lipsă din banda așteptată: % (%)', 's43-b23-z6-mental', '2-3';
  end if;
  if cur is distinct from 'Așezați pe masă: „Una. Două. Trei.” — trei grămezi.' then
    if cur is distinct from 'Așezați: „Una. Două. Trei.” — trei grămezi.' then
      raise exception 'T5b: % (%) pasul 1 nu e textul live și nici cel nou: %', 's43-b23-z6-mental', '2-3', cur;
    end if;
    update public.activities
    set pasi = case
      when 1 = 1 then array['Așezați pe masă: „Una. Două. Trei.” — trei grămezi.'] || pasi[2:cardinality(pasi)]
      else pasi[1:0] || array['Așezați pe masă: „Una. Două. Trei.” — trei grămezi.'] || pasi[2:cardinality(pasi)]
    end
    where id = 's43-b23-z6-mental' and banda = '2-3';
  end if;


  select pasi[1] into cur from public.activities
  where id = 's46-b23-z2-mental' and banda = '2-3';
  if not found then
    raise exception 'T5b: id lipsă din banda așteptată: % (%)', 's46-b23-z2-mental', '2-3';
  end if;
  if cur is distinct from 'Puneți-le pe masă. Arătați aproape: „Asta.” Apoi departe: „Aia.”' then
    if cur is distinct from 'Arătați aproape: „Asta.” Apoi departe: „Aia.”' then
      raise exception 'T5b: % (%) pasul 1 nu e textul live și nici cel nou: %', 's46-b23-z2-mental', '2-3', cur;
    end if;
    update public.activities
    set pasi = case
      when 1 = 1 then array['Puneți-le pe masă. Arătați aproape: „Asta.” Apoi departe: „Aia.”'] || pasi[2:cardinality(pasi)]
      else pasi[1:0] || array['Puneți-le pe masă. Arătați aproape: „Asta.” Apoi departe: „Aia.”'] || pasi[2:cardinality(pasi)]
    end
    where id = 's46-b23-z2-mental' and banda = '2-3';
  end if;


  select pasi[1] into cur from public.activities
  where id = 's52-b23-z4-resurse' and banda = '2-3';
  if not found then
    raise exception 'T5b: id lipsă din banda așteptată: % (%)', 's52-b23-z4-resurse', '2-3';
  end if;
  if cur is distinct from 'Puneți-le pe masă: „Trei. Alege favorita.”' then
    if cur is distinct from '„Trei. Alege favorita.”' then
      raise exception 'T5b: % (%) pasul 1 nu e textul live și nici cel nou: %', 's52-b23-z4-resurse', '2-3', cur;
    end if;
    update public.activities
    set pasi = case
      when 1 = 1 then array['Puneți-le pe masă: „Trei. Alege favorita.”'] || pasi[2:cardinality(pasi)]
      else pasi[1:0] || array['Puneți-le pe masă: „Trei. Alege favorita.”'] || pasi[2:cardinality(pasi)]
    end
    where id = 's52-b23-z4-resurse' and banda = '2-3';
  end if;


  select titlu into cur from public.activities
  where id = 's15-2-3-z7-mental' and banda = '1-2';
  if not found then
    raise exception 'T5b: id lipsă din banda așteptată: % (%)', 's15-2-3-z7-mental', '1-2';
  end if;
  if cur is distinct from 'Carte cu mâncare' then
    if cur is distinct from 'Carte: mâncare pe masă' then
      raise exception 'T5b: % (%) titlu neașteptat: %', 's15-2-3-z7-mental', '1-2', cur;
    end if;
    update public.activities set titlu = 'Carte cu mâncare'
    where id = 's15-2-3-z7-mental' and banda = '1-2';
  end if;


  select pasi into cur_pasi from public.activities
  where id = 's25-2-3-z5-fizic' and banda = '1-2';
  if not found then
    raise exception 'T5b: id lipsă din banda așteptată: % (%)', 's25-2-3-z5-fizic', '1-2';
  end if;
  if cur_pasi is distinct from array['Seara, aprindeți împreună lumina din baie: „Lumină.”','Spălați mâinile pe scurt împreună: „Mâini. Apă.” fără grabă.']::text[] then
    if cur_pasi is distinct from array['Spălați mâinile pe scurt împreună.','„Mâini. Apă.” fără grabă.']::text[] then
      raise exception 'T5b: % (%) pașii nu sunt cei din live și nici cei noi', 's25-2-3-z5-fizic', '1-2';
    end if;
    update public.activities set pasi = array['Seara, aprindeți împreună lumina din baie: „Lumină.”','Spălați mâinile pe scurt împreună: „Mâini. Apă.” fără grabă.']::text[]
    where id = 's25-2-3-z5-fizic' and banda = '1-2';
  end if;


  select titlu into cur from public.activities
  where id = 's25-2-3-z5-fizic' and banda = '1-2';
  if not found then
    raise exception 'T5b: id lipsă din banda așteptată: % (%)', 's25-2-3-z5-fizic', '1-2';
  end if;
  if cur is distinct from 'Aprindem lumina, ne spălăm pe mâini' then
    if cur is distinct from 'Ne spălăm pe mâini' then
      raise exception 'T5b: % (%) titlu neașteptat: %', 's25-2-3-z5-fizic', '1-2', cur;
    end if;
    update public.activities set titlu = 'Aprindem lumina, ne spălăm pe mâini'
    where id = 's25-2-3-z5-fizic' and banda = '1-2';
  end if;


  select pasi into cur_pasi from public.activities
  where id = 's36-2-3-z4-resurse' and banda = '1-2';
  if not found then
    raise exception 'T5b: id lipsă din banda așteptată: % (%)', 's36-2-3-z4-resurse', '1-2';
  end if;
  if cur_pasi is distinct from array['Intrați din curte. Închideți ușa împreună, încet. Aveți grijă la degete.','„Ușă. Insecta rămâne afară.”']::text[] then
    if cur_pasi is distinct from array['Intrați. Închideți ușa pe scurt.','„Ușă. Gata.”']::text[] then
      raise exception 'T5b: % (%) pașii nu sunt cei din live și nici cei noi', 's36-2-3-z4-resurse', '1-2';
    end if;
    update public.activities set pasi = array['Intrați din curte. Închideți ușa împreună, încet. Aveți grijă la degete.','„Ușă. Insecta rămâne afară.”']::text[]
    where id = 's36-2-3-z4-resurse' and banda = '1-2';
  end if;


  select titlu into cur from public.activities
  where id = 's36-2-3-z4-resurse' and banda = '1-2';
  if not found then
    raise exception 'T5b: id lipsă din banda așteptată: % (%)', 's36-2-3-z4-resurse', '1-2';
  end if;
  if cur is distinct from 'Intrăm, insecta rămâne afară' then
    if cur is distinct from 'Intrăm, ușa se închide' then
      raise exception 'T5b: % (%) titlu neașteptat: %', 's36-2-3-z4-resurse', '1-2', cur;
    end if;
    update public.activities set titlu = 'Intrăm, insecta rămâne afară'
    where id = 's36-2-3-z4-resurse' and banda = '1-2';
  end if;


  select pasi[2] into cur from public.activities
  where id = 's14-b23-z6-fizic' and banda = '2-3';
  if not found then
    raise exception 'T5b: id lipsă din banda așteptată: % (%)', 's14-b23-z6-fizic', '2-3';
  end if;
  if cur is distinct from 'Alegeți un reper și opriți-vă: „Ne oprim.”' then
    if cur is distinct from 'Alegeți un reper și opriți: „Oprim.”' then
      raise exception 'T5b: % (%) pasul 2 nu e textul live și nici cel nou: %', 's14-b23-z6-fizic', '2-3', cur;
    end if;
    update public.activities
    set pasi = case
      when 2 = 1 then array['Alegeți un reper și opriți-vă: „Ne oprim.”'] || pasi[2:cardinality(pasi)]
      else pasi[1:1] || array['Alegeți un reper și opriți-vă: „Ne oprim.”'] || pasi[3:cardinality(pasi)]
    end
    where id = 's14-b23-z6-fizic' and banda = '2-3';
  end if;


  select pasi[2] into cur from public.activities
  where id = 's41-b23-z6-fizic' and banda = '2-3';
  if not found then
    raise exception 'T5b: id lipsă din banda așteptată: % (%)', 's41-b23-z6-fizic', '2-3';
  end if;
  if cur is distinct from 'Alegeți un reper spre poartă și opriți-vă: „Ne oprim.”' then
    if cur is distinct from 'Alegeți un reper spre poartă și opriți: „Oprim.”' then
      raise exception 'T5b: % (%) pasul 2 nu e textul live și nici cel nou: %', 's41-b23-z6-fizic', '2-3', cur;
    end if;
    update public.activities
    set pasi = case
      when 2 = 1 then array['Alegeți un reper spre poartă și opriți-vă: „Ne oprim.”'] || pasi[2:cardinality(pasi)]
      else pasi[1:1] || array['Alegeți un reper spre poartă și opriți-vă: „Ne oprim.”'] || pasi[3:cardinality(pasi)]
    end
    where id = 's41-b23-z6-fizic' and banda = '2-3';
  end if;


  select gata_cand into cur from public.activities
  where id = 's17-b23-z1-fizic' and banda = '2-3';
  if not found then
    raise exception 'T5b: id lipsă din banda așteptată: % (%)', 's17-b23-z1-fizic', '2-3';
  end if;
  if cur is distinct from 'A stat afară pe scurt și a ascultat.' then
    if cur is distinct from 'A staționar afară pe scurt și a ascultat.' then
      raise exception 'T5b: % (%) gata_cand neașteptat: %', 's17-b23-z1-fizic', '2-3', cur;
    end if;
    update public.activities set gata_cand = 'A stat afară pe scurt și a ascultat.'
    where id = 's17-b23-z1-fizic' and banda = '2-3';
  end if;


  select materiale into cur_pasi from public.activities
  where id = 's52-b23-z4-resurse' and banda = '2-3';
  if not found then
    raise exception 'T5b: id lipsă din banda așteptată: % (%)', 's52-b23-z4-resurse', '2-3';
  end if;
  if not ('3 obiecte preferate' = any(cur_pasi)) then
    if not ('3 obiecte favorita' = any(cur_pasi)) then
      raise exception 'T5b: % (%) materiale neașteptate: %', 's52-b23-z4-resurse', '2-3', cur_pasi;
    end if;
    update public.activities
    set materiale = array_replace(materiale, '3 obiecte favorita', '3 obiecte preferate')
    where id = 's52-b23-z4-resurse' and banda = '2-3';
  end if;

end $$;
