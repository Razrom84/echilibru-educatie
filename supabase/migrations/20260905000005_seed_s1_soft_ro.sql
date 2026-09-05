-- soft RO: Stop→Ne oprim; ok→în regulă
update public.activities set pasi = ARRAY['Țineți-i mâinile.', '2–5 sărituri ușoare.', 'Ne oprim când e gata.']::text[] where id = 's1-2-3-z2-fizic';
update public.activities set gata_cand = 'A acceptat sau a refuzat clar (oricare e în regulă).' where id = 's1-2-3-z3-social';
update public.activities set pasi = ARRAY['Țineți mâna.', 'Una-două trepte.', 'Ne oprim la oboseală.']::text[] where id = 's1-2-3-z5-fizic';
