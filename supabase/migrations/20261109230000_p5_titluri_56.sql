-- P5 / T4: titlul se aliniază la textul activității, pentru 56 de id-uri.
-- Se schimbă doar coloana titlu. Materialele, pașii, „gata când”, nota și tema rămân neschimbate.
-- Coloana de bandă din schemă este banda (nu band).
-- 52 de id-uri sN-2-3-… sunt în banda 1-2 (prefix vechi).
-- 4 id-uri sN-b23-… sunt în banda 2-3.
-- Înainte de UPDATE se verifică fiecare id în banda așteptată. Dacă lipsește, migrarea se oprește
-- și nu modifică niciun rând. La a doua rulare, aceleași 56 de rânduri există, deci operațiunea
-- este idempotentă.
-- Nu se aplică pe Familie din acest PR. O rulează MannyQ după acord.

do $$
declare
  missing text;
  updated bigint;
begin
  create temporary table p5_titluri (
    id text primary key,
    banda text not null,
    titlu text not null
  ) on commit drop;

  insert into p5_titluri (id, banda, titlu) values
    ('s2-2-3-z6-fizic', '1-2', 'Pași lângă baltă'),
    ('s6-2-3-z1-mental', '1-2', 'Sus și jos'),
    ('s6-2-3-z6-resurse', '1-2', 'Punem găleata jos'),
    ('s8-2-3-z7-mental', '1-2', 'Întoarcem o pagină'),
    ('s11-2-3-z5-fizic', '1-2', 'Dans scurt la fereastră'),
    ('s11-2-3-z6-social', '1-2', 'Afară, lângă adult'),
    ('s16-2-3-z7-fizic', '1-2', 'Plimbare, apoi bem apă'),
    ('s21-2-3-z5-fizic', '1-2', 'Mâna pe pervaz'),
    ('s21-2-3-z6-resurse', '1-2', 'Șosetele la loc'),
    ('s23-2-3-z4-fizic', '1-2', 'Mirosim prosopul'),
    ('s23-2-3-z4-mental', '1-2', 'Miroase a curat'),
    ('s24-2-3-z1-resurse', '1-2', 'Jucăria-oaspete pe raft'),
    ('s24-2-3-z2-resurse', '1-2', 'Haina pe cârlig'),
    ('s24-2-3-z3-fizic', '1-2', 'Jucărie pe scaun'),
    ('s24-2-3-z3-social', '1-2', 'Poftim, e pentru tine'),
    ('s24-2-3-z4-fizic', '1-2', 'Pe canapea, lângă adult'),
    ('s24-2-3-z4-social', '1-2', 'Stăm puțin lângă adult'),
    ('s24-2-3-z6-fizic', '1-2', 'Poza cu familia'),
    ('s24-2-3-z7-fizic', '1-2', 'Plimbare prin casă, cu salut'),
    ('s25-2-3-z3-fizic', '1-2', 'Pătura pe pat'),
    ('s25-2-3-z3-mental', '1-2', 'Pat și somn'),
    ('s25-2-3-z3-social', '1-2', 'Pe pat, împreună'),
    ('s25-2-3-z4-mental', '1-2', 'O poză din carte'),
    ('s25-2-3-z5-fizic', '1-2', 'Ne spălăm pe mâini'),
    ('s26-2-3-z6-resurse', '1-2', 'Mirosim și punem la loc'),
    ('s27-2-3-z6-fizic', '1-2', 'Numărăm ce vedem afară'),
    ('s29-2-3-z2-fizic', '1-2', 'Atingem mugurele'),
    ('s29-2-3-z2-mental', '1-2', 'Spunem: mugure, frunză'),
    ('s29-2-3-z2-social', '1-2', 'Arată mugurele adultului'),
    ('s29-2-3-z6-fizic', '1-2', 'Frunză de pe pământ'),
    ('s29-2-3-z6-social', '1-2', 'Frunza pentru adult'),
    ('s33-2-3-z5-resurse', '1-2', 'Găleata și lopata pe raft'),
    ('s33-2-3-z6-mental', '1-2', 'Urma rotundă a găleții'),
    ('s34-2-3-z1-fizic', '1-2', 'Afară, la soare'),
    ('s34-2-3-z1-resurse', '1-2', 'Pantofii lângă ușă'),
    ('s34-2-3-z3-resurse', '1-2', 'Intrăm, închidem ușa'),
    ('s34-2-3-z4-resurse', '1-2', 'Frunză în coș'),
    ('s34-2-3-z5-resurse', '1-2', 'Pălăria pe cuier'),
    ('s36-2-3-z4-resurse', '1-2', 'Intrăm, ușa se închide'),
    ('s37-2-3-z1-resurse', '1-2', 'Paharul cu apă, la umbră'),
    ('s37-2-3-z3-social', '1-2', 'Bem pe rând'),
    ('s37-2-3-z4-fizic', '1-2', 'Câțiva pași spre umbră'),
    ('s37-2-3-z4-mental', '1-2', 'Soare cald, umbră răcoroasă'),
    ('s37-2-3-z4-social', '1-2', 'Împreună spre umbră'),
    ('s38-2-3-z3-resurse', '1-2', 'Prosopul lângă pantofi'),
    ('s39-2-3-z2-resurse', '1-2', 'Bolul pe masă'),
    ('s39-2-3-z4-resurse', '1-2', 'Șervețelul lângă bol'),
    ('s39-2-3-z7-resurse', '1-2', 'Bolul și farfuria la loc'),
    ('s43-2-3-z5-mental', '1-2', 'Piatră și frunză'),
    ('s45-2-3-z2-fizic', '1-2', 'Sărituri mici împreună'),
    ('s45-2-3-z4-mental', '1-2', 'Brațe și picioare'),
    ('s48-2-3-z2-mental', '1-2', 'Cine e? Salut!'),
    ('s8-b23-z5-social', '2-3', 'Privim împreună frunza'),
    ('s10-b23-z6-fizic', '2-3', 'Colectăm în cutie'),
    ('s31-b23-z4-social', '2-3', 'Arată ghiveciul altcuiva'),
    ('s40-b23-z3-fizic', '2-3', 'Ducem lucrurile la locul lor');

  if (select count(*) from p5_titluri) <> 56 then
    raise exception 'P5: lista de titluri trebuie să aibă 56 de rânduri.';
  end if;

  select string_agg(v.id || ' (banda ' || v.banda || ')', ', ' order by v.id)
    into missing
  from p5_titluri as v
  where not exists (
    select 1
    from public.activities as a
    where a.id = v.id
      and a.banda = v.banda
  );

  if missing is not null then
    raise exception 'P5: id lipsă din banda așteptată (coloana banda): %', missing;
  end if;

  update public.activities as a
  set titlu = v.titlu
  from p5_titluri as v
  where a.id = v.id
    and a.banda = v.banda;

  get diagnostics updated = row_count;
  if updated <> 56 then
    raise exception 'P5: s-au actualizat % rânduri, așteptat 56. Nu s-a păstrat nicio modificare.', updated;
  end if;
end $$;
