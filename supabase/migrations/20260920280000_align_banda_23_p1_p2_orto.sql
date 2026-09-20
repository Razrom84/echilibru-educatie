-- Lock B: align materiale/pasi/gata_cand for 8 P1 + 3 P2 banda 2–3 ids (title↔body).
-- KEEP titlu + tema_saptamana. Copy from docs/TICKET-WAVE-P1-P2-NIT-BANDA-2-3.md.
-- NIT orto: să crește → să crească on 28 appendix ids (any copy field).
-- Live ids are sN-b23-… ; seed ids sN-2-3-… remap via docs/IMPORT-BANDA-2-3-ID-MAP.md.
-- ONLY banda='2-3'. Does not touch banda 1–2 or ids without b23.
-- Do not apply to Familie/production from this PR; Cristina QA pe preview.

update public.activities as a
set
  materiale = v.materiale,
  pasi = v.pasi,
  gata_cand = v.gata_cand
from (values
  ('s2-b23-z4-resurse', ARRAY['pahar', 'masă']::text[], ARRAY['Luați paharul.', 'Puneți-l pe masă: „La loc. Masă.”']::text[], 'Paharul e pe masă.'),
  ('s28-b23-z5-resurse', ARRAY['cizme']::text[], ARRAY['După șters: puneți cizmele lângă ușă.', '„Cizme. Ușă.”']::text[], 'Cizmele curate sunt lângă ușă.'),
  ('s31-b23-z2-resurse', ARRAY['pahar']::text[], ARRAY['După udatul semințelor: „La loc.”', '„Semințe. Gata.”']::text[], 'Paharul e la loc după semințe.'),
  ('s34-b23-z2-resurse', ARRAY['cutie', 'frunză']::text[], ARRAY['După colectat: puneți frunza în cutie, apoi cutia la loc.', '„Frunză. La loc.”']::text[], 'A ajutat cu frunza sau cutia.'),
  ('s39-b23-z1-resurse', ARRAY['farfurie', 'fruct']::text[], ARRAY['După gustare: „Ajunge.”', 'Farfuria cu fruct (sau goală) la loc.']::text[], 'A ajutat cu farfuria după fruct.'),
  ('s39-b23-z3-resurse', ARRAY['farfurie']::text[], ARRAY['„După fruct: goală. Ajunge.”', 'Farfuria la loc.']::text[], 'Farfuria goală după fruct e la loc.'),
  ('s39-b23-z5-resurse', ARRAY['farfurie', 'pahar', 'șervet']::text[], ARRAY['Strângeți după fruct: „La loc.”', '„Masa cu fruct e gata.”']::text[], 'Obiectele de masă (după fruct) la loc.'),
  ('s39-b23-z7-resurse', ARRAY['farfurie / pahar']::text[], ARRAY['Strângeți masa cu fruct: „La loc.”', '„Gata. Liniște.”']::text[], 'Masa cu fruct e strânsă înainte de calm.'),
  ('s31-b23-z6-resurse', ARRAY['pahar', 'ghiveci']::text[], ARRAY['„Udatul la semințe — ajunge. Gata.”', 'Paharul la loc.']::text[], 'Udatul semințelor e închis.'),
  ('s31-b23-z2-mental', ARRAY['pământ', 'semințe / sămânță']::text[], ARRAY['„Uscat.”', '„Ud — sămânța vrea ud.”']::text[], 'A deosebit uscat/ud la pământul seminței.'),
  ('s42-b23-z6-resurse', ARRAY['cutie', 'frunze']::text[], ARRAY['Puneți trei frunze: „Plin destul.”', '„Frunze. Gata.”']::text[], 'Cutia de frunze are trei.')
) as v(id, materiale, pasi, gata_cand)
where a.id = v.id
  and a.banda = '2-3';

update public.activities as a
set
  titlu = replace(a.titlu, 'să crește', 'să crească'),
  tema_saptamana = replace(a.tema_saptamana, 'să crește', 'să crească'),
  gata_cand = replace(a.gata_cand, 'să crește', 'să crească'),
  nota = replace(a.nota, 'să crește', 'să crească'),
  materiale = (
    select coalesce(array_agg(replace(x, 'să crește', 'să crească') order by n), '{}')
    from unnest(a.materiale) with ordinality as t(x, n)
  ),
  pasi = (
    select coalesce(array_agg(replace(x, 'să crește', 'să crească') order by n), '{}')
    from unnest(a.pasi) with ordinality as t(x, n)
  )
where a.banda = '2-3'
  and a.id in (
    's29-b23-z1-fizic',
    's29-b23-z1-resurse',
    's29-b23-z2-fizic',
    's29-b23-z3-fizic',
    's29-b23-z3-resurse',
    's29-b23-z4-fizic',
    's29-b23-z4-mental',
    's29-b23-z4-social',
    's29-b23-z6-social',
    's31-b23-z1-fizic',
    's31-b23-z1-mental',
    's31-b23-z1-resurse',
    's31-b23-z2-fizic',
    's31-b23-z2-mental',
    's31-b23-z3-fizic',
    's31-b23-z3-mental',
    's31-b23-z3-resurse',
    's31-b23-z3-social',
    's31-b23-z4-mental',
    's38-b23-z1-fizic',
    's38-b23-z1-resurse',
    's38-b23-z2-fizic',
    's38-b23-z3-fizic',
    's38-b23-z3-resurse',
    's38-b23-z4-fizic',
    's38-b23-z4-mental',
    's38-b23-z4-social',
    's38-b23-z6-social'
  );
