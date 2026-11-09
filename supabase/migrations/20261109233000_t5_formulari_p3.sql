-- T5: formulări P3, ritualul de duminică din S45 și paranteza goală.
-- Coloana de bandă este banda. Fiecare rând se actualizează doar dacă id-ul
-- există în banda așteptată (2-3). Dacă lipsește unul, migrarea se oprește
-- și nu schimbă nimic. A doua rulare scrie aceleași valori, deci e idempotentă.
-- Nu se aplică pe Familie din acest PR. O rulează MannyQ după acord.

do $$
declare
  missing text;
  updated bigint;
  expected int := 9;
begin
  create temporary table t5_copy (
    id text primary key,
    banda text not null,
    titlu text,
    pasi text[]
  ) on commit drop;

  insert into t5_copy (id, banda, titlu, pasi) values
    (
      's46-b23-z3-mental',
      '2-3',
      'Unde în cameră — două locuri',
      null
    ),
    (
      's46-b23-z4-fizic',
      '2-3',
      'Vânătoare: aia de departe',
      null
    ),
    (
      's46-b23-z1-resurse',
      '2-3',
      'Găsit — gata jocul',
      null
    ),
    (
      's45-b23-z7-mental',
      '2-3',
      null,
      array[
        'Întrebați: „Îți place să mergi sau să stai?” — arătați ambele.',
        'Rămâneți la alegerea lui.',
        'Dacă vrea: o rundă scurtă doar pe favorit.'
      ]
    ),
    (
      's46-b23-z7-mental',
      '2-3',
      null,
      array[
        'Întrebați: „Îți place unde, asta sau aia?” — gesturi.',
        'Rămâneți la alegerea lui.',
        'Dacă vrea: o rundă scurtă doar pe favorit.'
      ]
    ),
    (
      's47-b23-z7-mental',
      '2-3',
      null,
      array[
        'Întrebați: „Îți place la loc, al meu sau al tău?” — gesturi.',
        'Rămâneți la alegerea lui.',
        'Dacă vrea: o rundă scurtă doar pe favorit.'
      ]
    ),
    (
      's48-b23-z7-social',
      '2-3',
      null,
      array[
        'Șoptiți: „Bună seara. La revedere.” — undă mică.',
        '„Noapte bună.” — fără forțare.',
        'Dacă vrea: alege formula de închidere, apoi odihnă.'
      ]
    ),
    (
      's45-b23-z7-social',
      '2-3',
      'Ritual: bună seara — ne oprim, gata cu pașii',
      array[
        'Șoptiți: „Bună seara. Ne oprim. Gata cu pașii.”',
        '„Corp puternic. Noapte bună.”',
        'Dacă vrea: un mergem de 2 pași spre pat, apoi odihnă.'
      ]
    ),
    (
      's8-b23-z5-social',
      '2-3',
      null,
      array[
        'Stați umăr lângă umăr: „Uite — frunză.”',
        '„Frunză.” o dată.',
        'Dacă vrea: el alege unde o puneți să o priviți.'
      ]
    );

  if (select count(*) from t5_copy) <> expected then
    raise exception 'T5: lista are % rânduri, așteptam %', (select count(*) from t5_copy), expected;
  end if;

  if exists (select 1 from t5_copy where banda <> '2-3') then
    raise exception 'T5: un rând nu e în banda 2-3';
  end if;

  select string_agg(v.id || ' (' || v.banda || ')', ', ' order by v.id)
    into missing
  from t5_copy v
  left join public.activities a
    on a.id = v.id
   and a.banda = v.banda
  where a.id is null;

  if missing is not null then
    raise exception 'T5: id lipsă din banda așteptată: %', missing;
  end if;

  update public.activities a
  set
    titlu = coalesce(v.titlu, a.titlu),
    pasi = coalesce(v.pasi, a.pasi)
  from t5_copy v
  where a.id = v.id
    and a.banda = v.banda;

  get diagnostics updated = row_count;

  if updated <> expected then
    raise exception 'T5: actualizate % din %', updated, expected;
  end if;
end $$;

-- s45, s48 z1 și s48 z7: valoarea din live (după T4 și lustruirea „bună, salut”),
-- nu textul intermediar. Dacă rândul e deja la forma nouă, scrierea e un no-op.
-- Altfel se cere exact textul live. Un alt text oprește migrarea.
do $$
declare
  r public.activities%rowtype;
begin
  select * into r from public.activities
  where id = 's45-b23-z5-mental' and banda = '2-3';
  if not found then
    raise exception 'T5: id lipsă din banda așteptată: s45-b23-z5-mental (2-3)';
  end if;
  if coalesce(array_length(r.pasi, 1), 0) <> 3
     or r.pasi[1] is distinct from 'Spuneți: „Mergem” și mergeți.'
     or r.pasi[3] is distinct from 'Dacă vrea: el spune unul din cele trei cuvinte (sau arată).' then
    raise exception 'T5: s45-b23-z5-mental pașii 1 și 3 nu sunt cei din live';
  end if;
  if r.titlu not in (
    'Pași, oprim, hai — pe corpul puternic',
    'Mergem, ne oprim, pornim iar'
  ) then
    raise exception 'T5: s45-b23-z5-mental titlu neașteptat: %', r.titlu;
  end if;
  if r.pasi[2] not in (
    '„Oprim” — stați; „Hai” — porniți din nou.',
    '„Ne oprim” — stați; „Hai” — porniți din nou.'
  ) then
    raise exception 'T5: s45-b23-z5-mental pasul 2 neașteptat: %', r.pasi[2];
  end if;
  if r.gata_cand not in (
    'A legat pași / oprim / hai de mișcare.',
    'A legat „mergem”, „ne oprim” și „hai” de mișcare.'
  ) then
    raise exception 'T5: s45-b23-z5-mental gata_cand neașteptat: %', r.gata_cand;
  end if;
  update public.activities
  set
    titlu = 'Mergem, ne oprim, pornim iar',
    pasi = array[
      'Spuneți: „Mergem” și mergeți.',
      '„Ne oprim” — stați; „Hai” — porniți din nou.',
      'Dacă vrea: el spune unul din cele trei cuvinte (sau arată).'
    ],
    gata_cand = 'A legat „mergem”, „ne oprim” și „hai” de mișcare.'
  where id = 's45-b23-z5-mental' and banda = '2-3';

  select * into r from public.activities
  where id = 's48-b23-z1-fizic' and banda = '2-3';
  if not found then
    raise exception 'T5: id lipsă din banda așteptată: s48-b23-z1-fizic (2-3)';
  end if;
  if r.pasi is distinct from array[
    'Modelați unda: „Bună.” — mâna se mișcă.',
    'El încearcă unda (sau privește) — fără forțare.',
    'Dacă vrea: alege formula — bună sau salut (cu același gest).'
  ]::text[] then
    raise exception 'T5: s48-b23-z1-fizic pașii nu sunt cei din live';
  end if;
  if r.titlu not in ('Gest de salut — undă bună', 'Salut — facem cu mâna') then
    raise exception 'T5: s48-b23-z1-fizic titlu neașteptat: %', r.titlu;
  end if;
  update public.activities
  set titlu = 'Salut — facem cu mâna'
  where id = 's48-b23-z1-fizic' and banda = '2-3';

  select * into r from public.activities
  where id = 's48-b23-z7-mental' and banda = '2-3';
  if not found then
    raise exception 'T5: id lipsă din banda așteptată: s48-b23-z7-mental (2-3)';
  end if;
  if r.titlu is distinct from 'Favoritul: bună, salut sau la revedere?' then
    raise exception 'T5: s48-b23-z7-mental titlul live nu e cel așteptat: %', r.titlu;
  end if;
  if coalesce(array_length(r.pasi, 1), 0) <> 3
     or r.pasi[1] is distinct from 'Întrebați: „Îți place bună, salut sau la revedere?” — gesturi.'
     or r.pasi[3] is distinct from 'Dacă vrea: o rundă scurtă doar pe favorit.' then
    raise exception 'T5: s48-b23-z7-mental pașii 1 și 3 nu sunt cei din live';
  end if;
  if r.pasi[2] not in ('Stați pe alegerea lui.', 'Rămâneți la alegerea lui.') then
    raise exception 'T5: s48-b23-z7-mental pasul 2 neașteptat: %', r.pasi[2];
  end if;
  update public.activities
  set pasi = array[
    'Întrebați: „Îți place bună, salut sau la revedere?” — gesturi.',
    'Rămâneți la alegerea lui.',
    'Dacă vrea: o rundă scurtă doar pe favorit.'
  ]
  where id = 's48-b23-z7-mental' and banda = '2-3';
end $$;
